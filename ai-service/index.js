const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODELS = (process.env.GEMINI_MODELS || 'gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-3.8-flash,gemini-3.5-flash').split(',');
const SYSTEM_INSTRUCTION = "Bạn là một chuyên gia tư vấn du lịch Việt Nam chuyên sâu có tên là VietnamTourism AI. Bạn chỉ trả lời các câu hỏi liên quan đến du lịch, địa điểm, văn hóa, và ẩm thực của Việt Nam. Giữ câu trả lời chi tiết, thân thiện, hữu ích và phong phú.";
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

// 1. API Chat Trợ lý ảo (dành cho widget nhỏ hoặc hỏi đáp chung)
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

// 2. API Lập Kế Hoạch Du Lịch Chuyên Sâu 100% BẰNG AI & NLP
app.post(['/api/chat/plan', '/api/ai/plan'], async (req, res) => {
  const { destination, startLocation, days, budget, travelStyle, groupType, specialRequests } = req.body;

  if (!destination || !destination.trim()) {
    return res.status(400).json({ success: false, error: 'Vui lòng cung cấp điểm đến du lịch mong muốn.' });
  }

  const cleanStart = (startLocation || '').trim();
  const cleanDest = destination.trim();
  const cleanSpecial = (specialRequests || '').trim();
  const numDays = parseInt(days, 10) || 3;
  const numBudget = parseInt((budget || '5000000').toString().replace(/\D/g, ''), 10) || 5000000;
  const hasDistinctStart = Boolean(cleanStart && cleanStart.toLowerCase() !== cleanDest.toLowerCase());

  let routingRules = '';
  if (hasDistinctStart) {
    if (numDays === 1) {
      routingRules = `
QUY TẮC LỘ TRÌNH CHUYẾN ĐI 1 NGÀY:
- Điểm xuất phát: "${cleanStart}" -> Điểm đến: "${cleanDest}".
- Buổi sáng: Dành thời gian ăn sáng đặc sản và dạo chơi các điểm nổi tiếng tại "${cleanStart}".
- Buổi trưa / đầu giờ chiều: Di chuyển từ "${cleanStart}" đến "${cleanDest}" (ghi rõ phương tiện), nhận phòng khách sạn.
- Buổi chiều và tối: Khám phá thắng cảnh và ăn tối đặc sản tại "${cleanDest}".`;
    } else {
      routingRules = `
QUY TẮC LỘ TRÌNH 2 GIAI ĐOẠN (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT 100%):
- Điểm xuất phát: "${cleanStart}" -> Điểm đến: "${cleanDest}".
- GIAI ĐOẠN 1 - NGÀY 1 (DÀNH TRỌN VẸN 1 NGÀY VUI CHƠI TẠI ĐIỂM XUẤT PHÁT "${cleanStart}"):
  + Du khách xuất phát tại chính "${cleanStart}". Toàn bộ Ngày 1 (Sáng, Chiều, Tối) BẮT BUỘC dành trọn vẹn để vui chơi, tham quan các thắng cảnh/địa danh nổi tiếng và thưởng thức ẩm thực đặc sản tiêu biểu của "${cleanStart}".
  + Sáng Ngày 1: Đón bình minh, ăn sáng đặc sản nổi tiếng tại ${cleanStart}, tham quan địa danh biểu tượng của ${cleanStart}.
  + Chiều Ngày 1: Tiếp tục khám phá các điểm tham quan văn hóa/thắng cảnh tại ${cleanStart}, thưởng thức món ăn xế chiều của ${cleanStart}.
  + Tối Ngày 1: Thưởng thức bữa tối ẩm thực đặc sản ${cleanStart}, dạo chơi phố đêm/chợ đêm tại ${cleanStart}, nghỉ ngơi hoặc chuẩn bị hành lý cho chặng di chuyển ngày mai.
  + Tiêu đề Ngày 1 PHẢI ghi rõ trải nghiệm tại "${cleanStart}" (Ví dụ: "Khám phá & Trải nghiệm trọn vẹn 1 ngày tại ${cleanStart}").
- GIAI ĐOẠN 2 - NGÀY 2 (DI CHUYỂN TỪ "${cleanStart}" ĐẾN "${cleanDest}" VÀ BẮT ĐẦU KHÁM PHÁ):
  + Sáng Ngày 2: Bắt đầu chặng di chuyển từ "${cleanStart}" vào "${cleanDest}" (nêu rõ phương tiện máy bay/tàu hỏa/xe ô tô phù hợp khoảng cách), đến nơi nhận phòng khách sạn tại ${cleanDest}, ăn trưa đặc sản ${cleanDest}.
  + Chiều & Tối Ngày 2: Bắt đầu tham quan các thắng cảnh đầu tiên tại ${cleanDest}, tắm biển hoặc dạo phố, ăn tối đặc sản ${cleanDest}.
- GIAI ĐOẠN 3 - TỪ NGÀY 3 ĐẾN NGÀY ${numDays} (nếu tổng thời gian >= 3 ngày):
  + Toàn bộ thời gian còn lại dành 100% để khám phá chuyên sâu các danh lam thắng cảnh, văn hóa, ẩm thực tại "${cleanDest}".`;
    }
  } else {
    routingRules = `
QUY TẮC ĐỊA BÀN 100% TẠI ĐIỂM ĐẾN (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT 100%):
- Người dùng KHÔNG nhập điểm xuất phát (hoặc điểm xuất phát trùng điểm đến).
- DO ĐÓ TOÀN BỘ 100% LỊCH TRÌNH TỪ NGÀY 1 ĐẾN NGÀY ${numDays} CHỈ ĐƯỢC PHÉP DIỄN RA TẠI ĐIỂM ĐẾN "${cleanDest}".
- TUYỆT ĐỐI CẤM đề cập đến Hà Nội, TP.HCM, Sài Gòn hay bất kỳ địa phương nào khác làm nơi xuất phát hay chặng bay/xe di chuyển đến trong Ngày 1!
- Sáng Ngày 1 bắt đầu trực tiếp tại "${cleanDest}": đón bình minh tại thắng cảnh ${cleanDest}, ăn sáng món đặc sản của ${cleanDest}, bắt đầu tham quan ${cleanDest}.
- Trong JSON trả về, trường "startLocation" BẮT BUỘC PHẢI LÀ CHUỖI RỖNG ""!`;
  }

  const prompt = `Bạn là Trí tuệ Nhân tạo (AI) chuyên gia hàng đầu về du lịch Việt Nam, tích hợp năng lực xử lý ngôn ngữ tự nhiên (NLP) chuyên sâu.
Nhiệm vụ của bạn là đọc và phân tích toàn diện yêu cầu du lịch của người dùng để lập ra một kế hoạch du lịch hoàn chỉnh, độc đáo và cá nhân hóa 100%.

THÔNG TIN ĐẦU VÀO TỪ NGƯỜI DÙNG:
${hasDistinctStart ? `- Điểm xuất phát: "${cleanStart}"` : '- Điểm xuất phát: Không nhập (Du khách bắt đầu trực tiếp tại điểm đến)'}
- Điểm đến du lịch: "${cleanDest}"
- Thời gian chuyến đi: ${numDays} ngày
- Tổng ngân sách dự kiến: ${numBudget} VNĐ
- Phong cách du lịch: ${travelStyle || 'Khám phá & Thư giãn'}
- Đối tượng tham gia: ${groupType || 'Cặp đôi / Bạn bè'}
- YÊU CẦU ĐẶC BIỆT BỔ SUNG (VĂN BẢN NGÔN NGỮ TỰ NHIÊN): "${cleanSpecial || 'Không có yêu cầu đặc biệt'}"

${routingRules}

HÃY DÙNG NĂNG LỰC TRÍ TUỆ NHÂN TẠO (NLP) ĐỂ:
1. Phân tích ngữ nghĩa tự nhiên từ "Yêu cầu đặc biệt bổ sung": hiểu rõ du khách muốn trải nghiệm gì (món ăn cụ thể, thời điểm ngắm hoàng hôn/bình minh, phương tiện xe máy hay ô tô, không gian yên tĩnh hay sôi động, các địa danh mong muốn ghé qua...).
2. Kết hợp toàn bộ yêu cầu đặc biệt này với các thông số bên trên (Điểm xuất phát, Điểm đến, Thời gian ${numDays} ngày, Ngân sách ${numBudget} VNĐ, Phong cách, Đối tượng).
3. May đo một lịch trình chi tiết và hoàn toàn mới:
   - Các buổi Sáng, Chiều, Tối trong "dailyItinerary" PHẢI thể hiện rõ rệt các mong muốn trong yêu cầu bổ sung (không dùng nội dung chung chung rập khuôn).
   - "accommodations": Đề xuất từ 7 đến 8 nơi ở cụ thể phù hợp mức ngân sách và đối tượng.
   - "culinary": Đề xuất từ 10 đến 14 món ăn đặc sản tiêu biểu cùng quán ăn nổi tiếng có địa chỉ rõ ràng.

TRẢ VỀ DUY NHẤT MỘT CHUỖI JSON HỢP LỆ (KHÔNG KÈM MARKDOWN \`\`\`json, KHÔNG KÈM BÌNH LUẬN):
{
  "title": "Tên kế hoạch hấp dẫn và mang dấu ấn riêng của chuyến đi",
  "startLocation": "${hasDistinctStart ? cleanStart : ''}",
  "destination": "${cleanDest}",
  "days": ${numDays},
  "budget": ${numBudget},
  "travelStyle": "${travelStyle || 'Khám phá'}",
  "groupType": "${groupType || 'Nhóm bạn'}",
  "summary": "Tóm tắt ngắn gọn 2-3 câu giới thiệu chuyến đi và giải thích cách AI đã may đo kế hoạch theo đúng yêu cầu bổ sung của du khách",
  "nlpAnalysis": {
    "detectedIntent": "Ý định chính mà AI đã hiểu từ yêu cầu bổ sung",
    "extractedEntities": ["Các thực thể AI đã trích xuất được từ câu yêu cầu (ví dụ: phương tiện, món ăn, cảnh quan...)"],
    "appliedCustomizations": ["Các điều chỉnh cụ thể mà AI đã áp dụng vào lịch trình để phục vụ yêu cầu đó"]
  },
  "dailyItinerary": [
    {
      "day": 1,
      "title": "${hasDistinctStart ? `Khám phá trọn vẹn 1 ngày tại ${cleanStart} - Khởi động chuyến đi` : `Khám phá & Trải nghiệm ngày đầu tiên tại ${cleanDest}`}",
      "morning": { "activity": "Hoạt động sáng chi tiết", "food": "Món ăn sáng gợi ý & địa chỉ", "cost": 150000, "tips": "Mẹo hữu ích" },
      "afternoon": { "activity": "Hoạt động chiều chi tiết", "food": "Món ăn trưa/xế & quán gợi ý", "cost": 200000, "tips": "Mẹo hữu ích" },
      "evening": { "activity": "Hoạt động tối chi tiết", "food": "Bữa tối đặc sản & địa chỉ", "cost": 300000, "tips": "Mẹo hữu ích" }
    }
  ],
  "accommodations": [
    { "name": "Tên khách sạn/resort cụ thể", "priceRange": "Khoảng giá/đêm", "area": "Khu vực địa chỉ", "highlights": "Điểm nổi bật", "type": "Resort 5 sao / Khách sạn cao cấp / Khách sạn / Homestay / Căn hộ / Hostel" }
  ],
  "culinary": [
    { "dish": "Tên món đặc sản", "places": "Tên quán ăn nổi tiếng & địa chỉ cụ thể", "cost": "Giá tham khảo", "category": "Món chính / Món nước / Hải sản & Đồ nướng / Ăn vặt & Tráng miệng / Cà phê & Đồ uống" }
  ],
  "budgetBreakdown": {
    "accommodation": 1500000,
    "food": 1800000,
    "sightseeing": 900000,
    "transportation": 500000,
    "contingency": 300000,
    "totalEstimated": ${numBudget}
  },
  "travelTips": [
    "Lời khuyên thiết thực 1",
    "Lời khuyên thiết thực 2",
    "Lời khuyên thiết thực 3"
  ]
}`;

  try {
    console.log(`[AI-PLANNER] Đang dùng AI phân tích & sinh lịch trình cho: ${hasDistinctStart ? cleanStart + ' -> ' : ''}${cleanDest} (${numDays} ngày, ngân sách: ${numBudget})`);
    const aiText = await generateWithFallback(prompt, "Bạn là hệ thống AI phân tích ngôn ngữ tự nhiên và lập lịch trình du lịch chuyên nghiệp. Bạn CHỈ trả về dữ liệu định dạng JSON chuẩn, không kèm markdown.");
    
    // Bóc tách JSON từ kết quả trả về của AI
    const cleanedJson = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedPlan = JSON.parse(cleanedJson);

    // XỬ LÝ HẬU KỲ CHẶT CHẼ BẰNG IF
    if (!hasDistinctStart) {
      // Trường hợp không có điểm xuất phát: 100% tại điểm đến
      parsedPlan.startLocation = '';
      parsedPlan.destination = cleanDest;

      // Làm sạch bất kỳ từ ngữ nào liên quan đến chặng di chuyển từ tỉnh khác trong Ngày 1
      if (Array.isArray(parsedPlan.dailyItinerary) && parsedPlan.dailyItinerary.length > 0) {
        const d1 = parsedPlan.dailyItinerary[0];
        if (d1.title && /Hà Nội|TP\.HCM|TPHCM|Sài Gòn|Khởi hành từ|Bay từ|Di chuyển từ/i.test(d1.title) && !cleanDest.match(/Hà Nội|TP\.HCM|Sài Gòn/i)) {
          d1.title = `Khám phá & Trải nghiệm ngày đầu tiên tại ${cleanDest}`;
        }
        if (d1.morning && d1.morning.activity && /khởi hành từ|bay từ|di chuyển từ sân bay nội bài|tân sơn nhất/i.test(d1.morning.activity)) {
          d1.morning.activity = `Đón chào ngày mới tại ${cleanDest}, bắt đầu chuyến hành trình khám phá những danh lam thắng cảnh và ẩm thực tuyệt vời.`;
        }
      }
    } else {
      // Trường hợp có điểm xuất phát rõ ràng
      parsedPlan.startLocation = cleanStart;
      parsedPlan.destination = cleanDest;

      // Đảm bảo Ngày 1 và Ngày 2 phản ánh đúng lộ trình: Ngày 1 chơi ở điểm xuất phát, Ngày 2 mới vào điểm đến
      if (Array.isArray(parsedPlan.dailyItinerary) && parsedPlan.dailyItinerary.length >= 2) {
        const d1 = parsedPlan.dailyItinerary[0];
        const d2 = parsedPlan.dailyItinerary[1];
        if (d1 && d1.title && !d1.title.toLowerCase().includes(cleanStart.toLowerCase())) {
          d1.title = `Khám phá trọn vẹn 1 ngày tại ${cleanStart} - Khởi động chuyến đi`;
        }
        if (d2 && d2.title && !d2.title.toLowerCase().includes(cleanDest.toLowerCase())) {
          d2.title = `Di chuyển từ ${cleanStart} đến ${cleanDest} & Bắt đầu khám phá`;
        }
      }
    }

    console.log(`[AI-PLANNER] AI đã sinh thành công kế hoạch độc đáo cho ${hasDistinctStart ? cleanStart + ' -> ' : ''}${cleanDest}`);
    return res.json({ success: true, source: 'gemini-ai', plan: parsedPlan });
  } catch (error) {
    console.error(`[AI-PLANNER] Lỗi khi gọi AI (${error.message})`);
    return res.status(500).json({ 
      success: false, 
      error: 'Hệ thống AI đang quá tải hoặc gặp sự cố kết nối. Vui lòng bấm tạo lại sau ít giây.' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-service', port: port });
});

app.listen(port, () => {
  console.log(`AI Service running on port ${port}`);
});
