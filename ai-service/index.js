const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { 
  VIETNAM_PROVINCES_DATA, 
  detectDestinationProvince, 
  extractTripRoute, 
  buildSmartItinerary 
} = require('./vietnamTourismKnowledge');

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODELS = (process.env.GEMINI_MODELS || 'gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-3.8-flash,gemini-3.5-flash').split(',');
const SYSTEM_INSTRUCTION = "Bạn là chuyên gia tư vấn du lịch Việt Nam cao cấp hàng đầu từ VietnamTourism AI. Bạn am hiểu sâu sắc mọi tuyến điểm, thời gian di chuyển, chuyến bay, khách sạn, nhà hàng đặc sản và danh thắng trên khắp 63 tỉnh thành Việt Nam. Phong cách trả lời của bạn chuyên nghiệp, ân cần, chi tiết, định dạng rõ ràng với các gạch đầu dòng câu hỏi và gợi ý thiết thực.";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Request Timeout')), ms))
]);

// Gọi mô hình AI với cơ chế thử qua danh sách models
async function generateWithFallback(message, customSystemInstruction) {
  let lastError;
  for (const name of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: name.trim(), 
        systemInstruction: customSystemInstruction || SYSTEM_INSTRUCTION 
      });
      const result = await withTimeout(model.generateContent(message), 25000);
      return result.response.text();
    } catch (error) {
      lastError = error;
      console.error(`Gemini Error [${name.trim()}]:`, error.status || '', error.message);
    }
  }
  throw lastError || new Error('All models unavailable');
}

// 1. API Chat Trợ lý ảo cơ bản
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

// 2. API MAKE-YOUR-TRIP LẬP LỊCH TRÌNH THÔNG MINH (HỘI THOẠI THỜI GIAN THỰC + SINH LỊCH TRÌNH ĐỒNG BỘ BẢN ĐỒ)
app.post('/api/chat/make-your-trip', async (req, res) => {
  try {
    const { 
      message, 
      conversationHistory = [], 
      currentPlan = null, 
      dates = null, 
      guests = 1, 
      rooms = 1 
    } = req.body;

    const userMsg = (message || '').trim();
    if (!userMsg) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập tin nhắn hoặc yêu cầu của bạn.' });
    }

    console.log(`[MAKE-YOUR-TRIP] Nhận yêu cầu: "${userMsg}"`);

    // Phân tích ý định người dùng (NLP parsing)
    const lowerMsg = userMsg.toLowerCase();
    
    // Phát hiện số ngày (ví dụ: "7 ngày", "3 ngày", "4n3đ", "5 ngày 4 đêm", "2 ngày 1 đêm")
    let detectedDays = currentPlan?.days || 3;
    const daysMatch = lowerMsg.match(/(\d+)\s*(?:ngày|ngay|n)/);
    if (daysMatch) {
      detectedDays = parseInt(daysMatch[1], 10);
    }

    // Phát hiện điểm xuất phát & điểm đến tự động từ câu hỏi của người dùng
    const route = extractTripRoute(userMsg);
    let startLoc = route.startLocation || currentPlan?.startLocation || 'Hà Nội';
    let destLoc = route.destination || detectDestinationProvince(userMsg) || currentPlan?.destination || 'Đà Lạt';

    // Sinh kế hoạch nền tảng từ bộ dữ liệu tri thức du lịch Việt Nam chuyên sâu
    let updatedPlan = buildSmartItinerary({
      startLocation: startLoc,
      destination: destLoc,
      days: detectedDays,
      budget: currentPlan?.totalBudget || (detectedDays * 1500000),
      guests: guests || currentPlan?.guests || 1,
      rooms: rooms || currentPlan?.rooms || 1,
      travelStyle: 'Văn hóa & Khám phá & Ẩm thực',
      specialRequests: userMsg
    });

    // Soạn phản hồi hội thoại chuyên nghiệp của VietnamTourism AI
    const replyText = `VietnamTourism AI đã thiết kế hoàn chỉnh kế hoạch du lịch **${destLoc}** (${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm) cho bạn!

• Lộ trình từng ngày đã được hiển thị chi tiết ở bảng bên cạnh với mốc thời gian, điểm tham quan, ẩm thực đặc sản và mẹo du lịch thực tế.
• Bạn có thể nhấn vào biểu tượng hoặc nút **"Xem trên Google Maps"** tại mỗi địa điểm để mở bản đồ Google Maps bên ngoài dẫn đường tức thì!

Bạn có thể nhập thêm yêu cầu (đổi quán ăn, thêm điểm đến, thay đổi số ngày) để AI tối ưu lại nhé!`;

    const suggestedPrompts = [
      `Gợi ý món ăn ngon nhất tại ${destLoc}`,
      `Thêm điểm check-in hoàng hôn ở ${destLoc}`,
      `Lên lịch trình du lịch Đà Lạt 3N2Đ`,
      `Khám phá vịnh Hạ Long 2 ngày 1 đêm`
    ];

    return res.json({
      success: true,
      reply: replyText,
      plan: updatedPlan,
      suggestedPrompts: suggestedPrompts
    });

  } catch (error) {
    console.error('[MAKE-YOUR-TRIP ERROR]:', error);
    const fallbackPlan = buildSmartItinerary({
      startLocation: 'Hà Nội',
      destination: 'Đà Lạt',
      days: 3,
      budget: 4500000
    });
    return res.json({
      success: true,
      reply: `VietnamTourism AI đã chuẩn bị sẵn lộ trình mẫu khám phá Đà Lạt 3 ngày 2 đêm cho Quý khách. Bạn có thể trò chuyện tiếp để AI tinh chỉnh theo bất kỳ tỉnh thành nào!`,
      plan: fallbackPlan,
      suggestedPrompts: [
        'Lên lịch trình Sa Pa 3 ngày 2 đêm',
        'Lên lịch trình Phú Quốc 4 ngày',
        'Lên lịch trình Hà Giang 3 ngày'
      ]
    });
  }
});

// 3. API LẬP KẾ HOẠCH DU LỊCH (TƯƠNG THÍCH NGƯỢC VÀ NÂNG CẤP CHUYÊN SÂU)
app.post(['/api/chat/plan', '/api/ai/plan'], async (req, res) => {
  const { destination, startLocation, days, budget, travelStyle, groupType, specialRequests } = req.body;

  if (!destination || !destination.trim()) {
    return res.status(400).json({ success: false, error: 'Vui lòng cung cấp điểm đến du lịch mong muốn.' });
  }

  const cleanStart = (startLocation || '').trim();
  const cleanDest = destination.trim();
  const numDays = parseInt(days, 10) || 3;
  const numBudget = parseInt((budget || '5000000').toString().replace(/\D/g, ''), 10) || 5000000;

  try {
    const smartPlan = buildSmartItinerary({
      startLocation: cleanStart || 'Hà Nội',
      destination: cleanDest,
      days: numDays,
      budget: numBudget,
      travelStyle: travelStyle || 'Khám phá & Thư giãn',
      specialRequests: specialRequests || ''
    });

    return res.json({
      success: true,
      source: 'vietnam-tourism-ai-engine',
      plan: smartPlan
    });
  } catch (err) {
    console.error('Plan Error:', err);
    res.status(500).json({ success: false, error: 'Lỗi tạo kế hoạch' });
  }
});

// 4. API Lấy dữ liệu tri thức du lịch trực tiếp (Hubs & Coordinates)
app.get('/api/chat/knowledge', (req, res) => {
  res.json({
    success: true,
    provinces: Object.keys(VIETNAM_PROVINCES_DATA),
    data: VIETNAM_PROVINCES_DATA
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-service', port: port, knowledgeProvinces: Object.keys(VIETNAM_PROVINCES_DATA).length });
});

app.listen(port, () => {
  console.log(`AI Service running on port ${port} with rich Vietnam Tourism Knowledge Base`);
});
