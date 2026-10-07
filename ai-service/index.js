const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = (process.env.GEMINI_MODELS || 'gemini-2.5-flash').split(',');
const SYSTEM_INSTRUCTION = "Bạn là một trợ lý ảo am hiểu về du lịch Việt Nam có tên là VietnamTourism AI. Bạn chỉ trả lời các câu hỏi liên quan đến du lịch, địa điểm, văn hóa, và ẩm thực của Việt Nam. Giữ câu trả lời ngắn gọn, thân thiện và hữu ích.";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Try each model in order; retry transient errors (503 overloaded / 429 rate limit) once per model
async function generateWithFallback(message) {
  let lastError;
  for (const name of MODELS) {
    const model = genAI.getGenerativeModel({ model: name.trim(), systemInstruction: SYSTEM_INSTRUCTION });
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await model.generateContent(message);
        return result.response.text();
      } catch (error) {
        lastError = error;
        console.error(`Gemini Error [${name}] attempt ${attempt + 1}:`, error.status || '', error.message);
        const transient = error.status === 503 || error.status === 429;
        if (!transient) break; // 404/400/etc: skip to next model
        await sleep(1000 * (attempt + 1));
      }
    }
  }
  throw lastError;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const text = await generateWithFallback(message);
    res.json({ success: true, reply: text });
  } catch (error) {
    console.error('Gemini Error (all models failed):', error.message);
    res.status(503).json({ success: false, error: 'AI đang quá tải, vui lòng thử lại sau ít giây.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-service', port: port });
});

app.listen(port, () => {
  console.log(`AI Service running on port ${port}`);
});
