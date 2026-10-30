const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  VIETNAM_PROVINCES_DATA,
  detectDestinationProvince,
  extractTripRoute,
  getOrCreateProvinceData,
  buildSmartItinerary,
  replaceActivityInPlan,
  shufflePlanActivities,
  expandItineraryDays,
  addFoodActivityToPlan,
  getRandomAlternativeDestination,
  getBestFoodRecommendation
} = require('./vietnamTourismKnowledge');

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const DEFAULT_MODELS = 'gemini-3.5-flash-lite,gemini-flash-lite-latest,gemini-3.5-flash,gemini-3.1-flash-lite';
const MODELS = (process.env.GEMINI_MODELS || DEFAULT_MODELS)
  .split(',')
  .map(m => m.trim())
  .filter(Boolean);

const SYSTEM_INSTRUCTION = `Bạn là VietnamTourism AI — Trợ lý du lịch thông minh hàng đầu Việt Nam.
Tuân thủ nghiêm ngặt BỘ QUY TẮC HUẤN LUYỆN VIETNAMTOURISM AI:
- RULE 1: Trả lời đúng trọng tâm. Khi người dùng hỏi một món ngon nhất hoặc điểm đến cụ thể, PHẢI nêu đích danh tên món/điểm cụ thể trước, mô tả hương vị/cách thưởng thức và địa chỉ uy tín, sau đó mới đề xuất thêm lựa chọn. Không trả lời chung chung sáo rỗng.
- RULE 2: Trả lời tự nhiên, đa dạng, tránh lặp lại nguyên văn lời chào hay câu mẫu cũ.
- RULE 3: Nhận biết rõ ý định đổi địa điểm (nếu đổi trong Chat thì gợi ý, nếu đổi trong Plan thì đồng bộ Plan).
- RULE 4: Duy trì ngữ cảnh hội thoại (tỉnh thành đang chọn, số ngày, sở thích).
- Giữ phong cách chuyên nghiệp, thân thiện, am hiểu văn hóa, thời tiết, phương tiện di chuyển và ẩm thực bản địa sâu sắc.`;

const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Request Timeout')), ms))
]);

async function generateWithFallback(prompt, customSystemInstruction) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  let lastError;
  for (const name of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: name,
        systemInstruction: customSystemInstruction || SYSTEM_INSTRUCTION
      });
      const result = await withTimeout(model.generateContent(prompt), 9000);
      const text = result.response.text();
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (error) {
      lastError = error;
      console.error(`Gemini Error [${name}]:`, error.status || '', error.message);
    }
  }
  throw lastError || new Error('All models unavailable');
}

function detectContextProvince(message, conversationHistory = []) {
  const direct = detectDestinationProvince(message);
  if (direct) return direct;
  if (Array.isArray(conversationHistory)) {
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const item = conversationHistory[i];
      const text = item?.text || item?.content || '';
      const found = detectDestinationProvince(text);
      if (found) return found;
    }
  }
  return null;
}

function buildSeasonalWeatherAdvice(provinceName, text = '') {
  const pData = getOrCreateProvinceData(provinceName);
  const region = pData.region || 'Việt Nam';
  const monthMatch = text.match(/tháng\s*(1[0-2]|[1-9])\b/i);
  const month = monthMatch ? parseInt(monthMatch[1], 10) : null;

  if (provinceName === 'Đà Lạt' || region.includes('Tây Nguyên')) {
    const monthNote = month
      ? (month >= 11 || month <= 3
        ? `Tháng ${month} tại **${provinceName}** đang là mùa khô đẹp nhất trong năm (mùa hoa dã quỳ, cỏ hồng, mai anh đào), ban ngày nắng dịu 20–24°C, sáng sớm và đêm se lạnh 12–15°C.`
        : `Tháng ${month} tại **${provinceName}** mát mẻ 17–23°C, chiều tối đôi khi có mưa rào cao nguyên lãng mạn.`)
      : `**${provinceName}** có khí hậu cao nguyên mát mẻ quanh năm (14–24°C), một ngày hội tụ đủ 4 mùa.`;
    return `${monthNote}\n\n• **Trang phục nên mặc:** Áo khoác ấm vừa (cardigan, blazer, áo len mỏng hoặc trench coat), khăn choàng nhẹ cho buổi tối/săn mây sáng sớm và giày thể thao êm chân để dạo đồi dốc.\n• **Lưu ý hữu ích:** Mang theo ô gấp gọn, kem dưỡng ẩm và sạc dự phòng để thoải mái chụp ảnh cả ngày.`;
  }

  if (['Sa Pa', 'Hà Giang', 'Cao Bằng', 'Tà Xùa', 'Mộc Châu', 'Tam Đảo', 'Lạng Sơn', 'Yên Bái', 'Bắc Kạn', 'Lai Châu', 'Điện Biên'].includes(provinceName)) {
    const monthNote = month && (month >= 10 || month <= 3)
      ? `Tháng ${month} ở **${provinceName}** tiết trời vùng cao se lạnh đến rét (8–18°C), rất lý tưởng để săn mây, ngắm mùa hoa hoặc lúa chín/hoa tam giác mạch.`
      : `Thời tiết vùng cao **${provinceName}** trong lành, mát mẻ vào ban ngày và se lạnh về đêm.`;
    return `${monthNote}\n\n• **Trang phục nên chuẩn bị:** Áo giữ nhiệt, áo khoác gió chống thấm sương, giày trekking/thể thao bám tốt để đi đèo dốc.\n• **Lưu ý:** Nên mang theo thuốc cảm nhẹ, miếng dán giữ nhiệt (nếu đi mùa đông) và tiền mặt lẻ khi ghé chợ phiên bản địa.`;
  }

  if (['Phú Quốc', 'Cần Thơ', 'An Giang', 'Cà Mau', 'TP. Hồ Chí Minh', 'Vũng Tàu', 'Tây Ninh', 'Bến Tre', 'Đồng Tháp', 'Vĩnh Long', 'Sóc Trăng', 'Bạc Liêu', 'Tiền Giang', 'Trà Vinh'].includes(provinceName) || region.includes('Nam')) {
    const monthNote = month
      ? (month >= 11 || month <= 4
        ? `Tháng ${month} tại **${provinceName}** là **mùa khô đẹp nhất** (nắng vàng rực rỡ, biển êm xanh trong, nhiệt độ dễ chịu 26–31°C, hầu như rất ít mưa).`
        : `Tháng ${month} tại **${provinceName}** thuộc mùa mưa nhiệt đới (26–32°C), mưa thường đến nhanh theo cơn ngắn buổi chiều rồi tạnh, cây trái miệt vườn rất tươi tốt.`)
      : `**${provinceName}** có khí hậu phương Nam ấm áp quanh năm (26–32°C), chia làm mùa khô (tháng 11 – tháng 4) và mùa mưa (tháng 5 – tháng 10).`;
    return `${monthNote}\n\n• **Trang phục gợi ý:** Đồ thoáng mát thấm hút mồ hôi (maxi, sơ mi đũi/linen, quần short, đồ bơi nếu đi biển), kính râm, mũ rộng vành và kem chống nắng SPF 50+.\n• **Kinh nghiệm:** Nếu đi tàu/cano ra đảo hoặc chợ nổi, nên đi khung giờ sáng sớm 06:00–09:00 để nắng dịu và cảnh đẹp nhất.`;
  }

  if (region.includes('Trung')) {
    const monthNote = month
      ? (month >= 2 && month <= 8
        ? `Tháng ${month} là **mùa vàng du lịch biển ${provinceName}** — trời nắng đẹp, nước biển trong xanh như ngọc, nhiệt độ 27–33°C.`
        : `Tháng ${month} tại **${provinceName}** bước vào mùa giao mùa/mưa miền Trung (22–27°C), tiết trời dịu mát, thích hợp tham quan di sản, ẩm thực nóng hổi và nghỉ dưỡng.`)
      : `**${provinceName}** đẹp nhất từ tháng 2 đến tháng 8 khi biển êm nắng vàng; các tháng cuối năm dịu mát, trầm mặc rất hợp khám phá văn hóa – ẩm thực.`;
    return `${monthNote}\n\n• **Trang phục gợi ý:** Trang phục sáng màu chụp ảnh biển/phố cổ, sandal hoặc giày đi bộ êm, áo khoác mỏng chống nắng (hoặc áo khoác nhẹ chắn gió nếu đi tháng 10–12).`;
  }

  // Miền Bắc đồng bằng
  const monthNote = month
    ? (month >= 9 && month <= 11
      ? `Tháng ${month} tại **${provinceName}** đang là tiết thu đẹp nhất miền Bắc — nắng hanh vàng dịu nhẹ 22–28°C, gió heo may cực kỳ lý tưởng để dạo chơi.`
      : (month === 12 || month <= 2
        ? `Tháng ${month} tại **${provinceName}** mang tiết trời đông miền Bắc (13–20°C), se lạnh đặc trưng rất hợp thưởng thức ẩm thực nóng.`
        : `Tháng ${month} tại **${provinceName}** thời tiết ấm áp (24–32°C), thuận lợi cho các hoạt động tham quan ngoài trời.`))
    : `**${provinceName}** mang khí hậu 4 mùa xuân - hạ - thu - đông rõ rệt, đẹp nhất vào mùa thu (tháng 9–11) và mùa xuân (tháng 2–4).`;
  return `${monthNote}\n\n• **Trang phục gợi ý:** Chuẩn bị trang phục theo mùa (áo khoác ấm vào tháng 12–2, áo thu mỏng thanh lịch vào tháng 9–11, đồ thoáng mát vào mùa hè) kèm giày đi bộ êm chân.`;
}

function buildLocalChatFallback(message, conversationHistory = []) {
  const lower = (message || '').toLowerCase();
  const prov = detectContextProvince(message, conversationHistory) || 'Đà Nẵng';
  const pData = getOrCreateProvinceData(prov);
  const food = getBestFoodRecommendation(prov);
  const topSpots = (pData.attractions || []).slice(0, 3);

  if (/(thời tiết|mặc gì|mùa nào|tháng\s*\d+|có mưa không|khí hậu|chuẩn bị đồ)/i.test(lower)) {
    return buildSeasonalWeatherAdvice(prov, message);
  }

  if (/(ăn gì|món ngon|đặc sản|ẩm thực|quán ăn)/i.test(lower)) {
    const others = (food.otherDishes || []).slice(0, 2).map(d => `**${d.name}** (${d.dish || 'đặc sản địa phương'})`).join(', ');
    return `Đến **${prov}**, món đặc sản số 1 bạn nhất định nên thử trước tiên là **${food.mainDish}** (${food.dishDetail || 'hương vị trứ danh bản địa'}).\n\n• **Địa chỉ gợi ý:** ${food.address}\n• **Trải nghiệm:** ${food.advice}\n• **Chi phí tham khảo:** ${food.costText || '50.000đ - 120.000đ/phần'}${others ? `\n\nNgoài ra, bạn hãy thưởng thức thêm ${others} để trọn vẹn hương vị ${prov} nhé!` : ''}`;
  }

  if (/(chi phí|bao nhiêu tiền|giá|ngân sách)/i.test(lower)) {
    return `Chi phí du lịch **${prov}** tự túc trung bình rất hợp lý:\n\n• **Lưu trú (${pData.hotel?.name || 'Khách sạn trung tâm'}):** ${pData.hotel?.price || '500.000đ - 1.100.000đ/đêm'}\n• **Ăn uống đặc sản:** Khoảng 250.000đ - 400.000đ/người/ngày (nổi bật với **${food.mainDish}**)\n• **Tổng ngân sách 3 ngày 2 đêm gợi ý:** Khoảng **2.800.000đ - 4.800.000đ/người** (tùy phương tiện di chuyển).\n\nBạn có thể mở mục **Lên lịch trình AI** để hệ thống lập bảng dự toán chi tiết từng ngày cho bạn!`;
  }

  const spotLines = topSpots.map((s, idx) => `${idx + 1}. **${s.name}** — ${s.advice}`).join('\n');
  return `Gợi ý khám phá **${prov}** (${pData.region || 'Việt Nam'}) dành cho bạn:\n\n${spotLines}\n\n• **Ẩm thực nhất định phải thử:** **${food.mainDish}** tại *${food.address}*.\n• **Lưu trú gợi ý:** ${pData.hotel?.name || `Khách sạn trung tâm ${prov}`} (${pData.hotel?.price || '500.000đ - 1.000.000đ/đêm'}).\n\nBạn muốn mình tư vấn sâu hơn về lịch trình mấy ngày, thời tiết hay quán ăn ngon tại **${prov}**?`;
}

function extractDaysFromText(text) {
  if (!text) return null;
  const lower = text.toString().trim().toLowerCase();

  // Strip URLs so numbers inside TikTok/web links are never parsed as days
  const cleaned = lower.replace(/https?:\/\/\S+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return null;

  const isMetaOrComplaint = /(?:vẫn chỉ (?:có|được)|sao lại chỉ|toàn|auto)\s*(\d+)\s*(?:ngày|ngay)/i.test(cleaned);
  const condPrefixMatch = /(?:quá|hơn|trên)\s*(\d+)\s*(?:ngày|ngay)/i.test(cleaned);

  const insteadOfPrefix = cleaned.match(/(?:thay vì|thay cho)\s*(\d+)\s*(?:ngày|ngay|n|hôm)?.*?(?:cho (?:t|tôi|mình) đi|đi|làm|thành|sang)?\s*(\d+)\s*(?:ngày|ngay|n|hôm)?/i);
  if (insteadOfPrefix) {
    const d = parseInt(insteadOfPrefix[2], 10);
    if (d >= 1 && d <= 30) return d;
  }

  const insteadOfSuffix = cleaned.match(/(\d+)\s*(?:ngày|ngay|n|hôm)\s*(?:thay vì|thay cho|chứ không phải|thay)\s*(\d+)/i);
  if (insteadOfSuffix) {
    const d = parseInt(insteadOfSuffix[1], 10);
    if (d >= 1 && d <= 30) return d;
  }

  const fromToMatch = cleaned.match(/từ\s*(\d+)\s*(?:ngày|ngay|n|hôm)?\s*(?:lên|sang|thành|xuống)\s*(\d+)\s*(?:ngày|ngay|n|hôm)?/i);
  if (fromToMatch) {
    const d = parseInt(fromToMatch[2], 10);
    if (d >= 1 && d <= 30) return d;
  }

  // Match compact formats like "3n2đ", "4n3d", "3 ngày 2 đêm"
  const compactNightMatch = cleaned.match(/(?:^|\s)(\d{1,2})\s*(?:n|ngày|ngay)\s*(\d{1,2})\s*(?:đ|d|đêm|dem)(?:\b|$)/i);
  if (compactNightMatch) {
    const d = parseInt(compactNightMatch[1], 10);
    if (d >= 1 && d <= 30) return d;
  }

  if (!isMetaOrComplaint && !condPrefixMatch) {
    // Match explicit "<number> ngày/hôm" ONLY when number precedes "ngày/hôm" (never "ngày 2", "tháng 11", "2 người", "15/11")
    const explicitRegex = /(?:^|[^\d/])(\d{1,2})\s*(?:ngày|ngay|hôm)(?!\s*(?:tháng|\/|\d))/gi;
    let match;
    while ((match = explicitRegex.exec(cleaned)) !== null) {
      const prefixSlice = cleaned.slice(Math.max(0, match.index - 10), match.index + 1);
      if (/(?:mùng|mung|ngày|ngay)\s*$/i.test(prefixSlice)) continue;
      const d = parseInt(match[1], 10);
      if (d >= 1 && d <= 30) return d;
    }
  }

  // Bare number ONLY when the entire message is strictly a short day-count answer like "4" or "đổi lên 5"
  const bareDayReply = cleaned.match(/^(?:cho\s+|đổi\s+|đổi\s+thành\s+|đổi\s+lên\s+|تăng\s+lên\s+|tăng\s+lên\s+|rút\s+xuống\s+|đi\s+)?([1-9]|[12][0-9]|30)\s*(?:thôi|nhé|nha|ạ)?$/i);
  if (bareDayReply) {
    const d = parseInt(bareDayReply[1], 10);
    if (d >= 1 && d <= 30) return d;
  }

  return null;
}

function extractGuestsAndRoomsFromText(text) {
  if (!text) return { guests: null, rooms: null };
  const lower = text.toString().toLowerCase();
  let detectedGuests = null;
  let detectedRooms = null;

  const guestMatch = lower.match(/(\d{1,2})\s*(?:người|nguoi|khách|khach|thành viên|bạn|người lớn)/i);
  if (guestMatch) {
    const g = parseInt(guestMatch[1], 10);
    if (g >= 1 && g <= 50) detectedGuests = g;
  } else if (/(?:cặp đôi|hai vợ chồng|2 vợ chồng|couple|trăng mật|honeymoon)/i.test(lower)) {
    detectedGuests = 2;
  } else if (/(?:đi một mình|đi 1 mình|độc hành|solo)/i.test(lower)) {
    detectedGuests = 1;
  }

  const roomMatch = lower.match(/(\d{1,2})\s*(?:phòng|phong)/i);
  if (roomMatch) {
    const r = parseInt(roomMatch[1], 10);
    if (r >= 1 && r <= 30) detectedRooms = r;
  } else if (detectedGuests !== null) {
    detectedRooms = Math.max(1, Math.ceil(detectedGuests / 2));
  }

  return { guests: detectedGuests, rooms: detectedRooms };
}

async function resolveTikTokVideoInfo(url) {
  try {
    let targetUrl = url;
    // Resolve shortlinks like vt.tiktok.com / vm.tiktok.com first if needed
    if (/https?:\/\/(?:vt|vm)\.tiktok\.com\//i.test(url)) {
      try {
        const headRes = await withTimeout(fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36' }
        }), 4000);
        if (headRes?.url) targetUrl = headRes.url;
      } catch (e) {
        // Proceed with original URL on redirect error
      }
    }

    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(targetUrl)}`;
    const res = await withTimeout(fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36' }
    }), 4500);

    if (!res.ok) return null;
    const data = await res.json();
    const title = (data?.title || '').trim();
    const author = (data?.author_name || '').trim();
    let province = detectDestinationProvince(title);

    if (!province && title && process.env.GEMINI_API_KEY) {
      try {
        const aiGuess = await generateWithFallback(
          `Đọc tiêu đề video TikTok du lịch sau và CHỈ TRẢ VỀ đúng tên 1 tỉnh/thành phố hoặc địa danh du lịch Việt Nam tương ứng (nếu không thuộc Việt Nam hoặc không xác định được thì trả về "NONE"):\n"${title}"`,
          'Chỉ trả về tên tỉnh/địa danh Việt Nam ngắn gọn hoặc NONE, không giải thích.'
        );
        if (aiGuess && !aiGuess.toUpperCase().includes('NONE')) {
          province = detectDestinationProvince(aiGuess) || null;
        }
      } catch (e) { }
    }

    return { title, author, province, resolvedUrl: targetUrl };
  } catch (err) {
    return null;
  }
}

app.post('/api/chat', async (req, res) => {
  const { message, conversationHistory = [] } = req.body || {};
  if (!message || !String(message).trim()) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  const cleanMessage = String(message).trim();

  try {
    let fullPrompt = cleanMessage;
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentTurns = conversationHistory
        .filter(m => m && (m.text || m.content))
        .slice(-8)
        .map(m => {
          const isBot = m.role === 'ai' || m.role === 'assistant' || m.role === 'bot' || m.sender === 'bot';
          return `${isBot ? 'Trợ lý AI' : 'Du khách'}: ${String(m.text || m.content).trim()}`;
        })
        .join('\n');

      if (recentTurns) {
        fullPrompt = `Lịch sử trò chuyện gần đây:\n${recentTurns}\n\nCâu hỏi hiện tại của Du khách: ${cleanMessage}\n\nHãy trả lời đúng trọng tâm, tự nhiên, giữ mạch ngữ cảnh hội thoại trên.`;
      }
    }

    const text = await generateWithFallback(fullPrompt);
    return res.json({ success: true, reply: text });
  } catch (error) {
    console.error('Gemini Error on /api/chat, serving local tourism knowledge fallback:', error.message);
    const fallbackReply = buildLocalChatFallback(cleanMessage, conversationHistory);
    return res.json({ success: true, reply: fallbackReply, source: 'knowledge-fallback' });
  }
});

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
    const lowerMsg = userMsg.toLowerCase();

    // 0. Check TikTok link first!
    const tiktokMatch = userMsg.match(/https?:\/\/(?:www\.|vm\.|vt\.|m\.)?tiktok\.com\/[^\s]+/i);
    let tiktokInfo = null;
    if (tiktokMatch) {
      tiktokInfo = await resolveTikTokVideoInfo(tiktokMatch[0]);
    }

    const route = extractTripRoute(userMsg);
    const mentionedProv = tiktokInfo?.province || route.destination || detectDestinationProvince(userMsg);
    const activeProvince = mentionedProv || currentPlan?.destination || detectContextProvince(userMsg, conversationHistory) || 'Vịnh Hạ Long';
    const activeStart = (route.destination && route.startLocation) ? route.startLocation : (currentPlan?.startLocation || 'Hà Nội');

    const extractedParty = extractGuestsAndRoomsFromText(userMsg);
    const activeGuests = extractedParty.guests !== null
      ? extractedParty.guests
      : (parseInt(guests, 10) || currentPlan?.guests || 1);
    const activeRooms = extractedParty.rooms !== null
      ? extractedParty.rooms
      : (extractedParty.guests !== null ? Math.max(1, Math.ceil(activeGuests / 2)) : (parseInt(rooms, 10) || currentPlan?.rooms || 1));

    let currentDays = 3;
    if (currentPlan) {
      currentDays = parseInt(currentPlan.days, 10) || currentPlan.dailyItinerary?.length || 3;
    }
    let detectedDays = currentDays;
    let isExplicitDays = false;

    const parsedDays = extractDaysFromText(userMsg) || (tiktokInfo?.title ? extractDaysFromText(tiktokInfo.title) : null);
    if (parsedDays !== null) {
      detectedDays = parsedDays;
      isExplicitDays = true;
    }
    detectedDays = Math.max(1, Math.min(30, detectedDays));

    // If TikTok link was sent, handle unresolvable destination gracefully instead of silently jumping to Ha Long!
    if (tiktokMatch && !mentionedProv) {
      const captionHint = tiktokInfo?.title
        ? `Mình đã đọc được video TikTok của **${tiktokInfo.author || 'creator'}** (*"${tiktokInfo.title.slice(0, 110)}"*), tuy nhiên tiêu đề video chưa ghi rõ tên tỉnh/thành phố.`
        : `Mình đã nhận được đường link TikTok của bạn, tuy nhiên video này hiện đang giới hạn quyền truy cập công khai hoặc chưa ghi rõ tên địa danh trong mô tả.`;

      return res.json({
        success: true,
        reply: `${captionHint}\n\nBạn cho mình biết thêm **tên địa điểm / tỉnh thành** trong video (ví dụ: *Đà Lạt, Phú Quốc, Hà Giang, Ninh Bình, Đà Nẵng...*) và **số ngày dự kiến** để mình dựng ngay lịch trình chi tiết kèm bản đồ cho bạn nhé!`,
        plan: currentPlan,
        suggestedPrompts: [
          'Lên lịch trình Đà Lạt 3 ngày 2 đêm',
          'Lên lịch trình Đà Nẵng 4 ngày cho 2 người',
          'Lên lịch trình Phú Quốc 3 ngày',
          'Lên lịch trình Hà Giang 3 ngày 2 đêm'
        ]
      });
    }

    const isAnotherFoodQuery = /(có món nào khác không|còn món nào khác|có món gì khác|món khác đi|gợi ý món khác|đổi món khác|món khác không|còn món gì nữa|có món nào khác)/i.test(lowerMsg);

    if (isAnotherFoodQuery) {
      const foodData = getBestFoodRecommendation(activeProvince);
      const otherList = foodData.otherDishes && foodData.otherDishes.length > 0
        ? foodData.otherDishes
        : [{ name: 'Bánh cuốn chả mực', dish: 'Bánh cuốn nóng ăn kèm chả mực thơm lừng', address: 'Khu ẩm thực phố cổ', advice: 'Nước mắm chấm pha vừa vặn, hành phi giòn rụm.' }];

      const formattedDishes = otherList.slice(0, 3).map((d, i) =>
        `${i + 1}. **${d.name}**${d.dish ? ` (${d.dish})` : ''}\n   • **Địa chỉ gợi ý:** ${d.address || 'Khu ẩm thực trung tâm'}\n   • **Hương vị:** ${d.advice || 'Đậm đà phong vị bản địa trứ danh.'}`
      ).join('\n\n');

      const replyText = `Ngoài món **${foodData.mainDish}** đã giới thiệu trước đó, nền ẩm thực tại **${activeProvince}** còn có nhiều món ngon đặc sắc khác để bạn đổi vị:\n\n${formattedDishes}\n\nBạn có muốn mình bổ sung món nào trong số này vào lịch trình chuyến đi của bạn không?`;

      return res.json({
        success: true,
        reply: replyText,
        plan: currentPlan,
        suggestedPrompts: [
          'Thêm một địa điểm ăn uống',
          'Xáo lại lịch trình ngày 2',
          'Đổi địa điểm khác đi',
          'Làm lịch trình khác đi'
        ]
      });
    }

    const isBestFoodQuery = /(món nào ngon nhất|món gì ngon nhất|ngon nhất ở đây|đặc sản ngon nhất|món ngon nhất|ăn gì ngon nhất)/i.test(lowerMsg) ||
      (/(món.*(?:ngon|gì|đặc sản|nổi tiếng)|ăn gì|đặc sản.*(?:gì|nào)|ẩm thực)/i.test(lowerMsg) && !lowerMsg.includes('thêm') && !lowerMsg.includes('quán ăn') && !lowerMsg.includes('lên lịch trình'));

    if (isBestFoodQuery) {
      const foodData = getBestFoodRecommendation(activeProvince);
      let replyText = '';

      try {
        const foodPrompt = `Người dùng hỏi: "${userMsg}".
Điểm đến đang tư vấn: ${activeProvince}.
Dữ liệu ẩm thực tại ${activeProvince}:
- Món đặc trưng nhất: ${foodData.mainDish} (${foodData.dishDetail || ''}). Địa chỉ: ${foodData.address || ''}. Cách thưởng thức: ${foodData.advice || ''}.
- Các món nổi tiếng khác: ${(foodData.otherDishes || []).map(f => f.name + (f.dish ? ` (${f.dish})` : '')).join(', ')}.

Tuân thủ nghiêm ngặt:
- Nêu đích danh tên món đặc trưng nhất (${foodData.mainDish}) đầu tiên, mô tả hương vị/cách thưởng thức và địa chỉ uy tín cụ thể.
- Sau đó đề xuất thêm 2 lựa chọn khác.
- Giọng văn tự nhiên, sành ăn, hấp dẫn.`;

        replyText = await generateWithFallback(foodPrompt, SYSTEM_INSTRUCTION);
      } catch (err) {
        replyText = `Nếu chọn một món đặc trưng và ngon nhất tại **${activeProvince}**, bạn nhất định phải thử **${foodData.mainDish}** (${foodData.dishDetail || 'đặc sản số 1 tại địa phương'}).\n\n• **Hương vị đặc sắc:** ${foodData.advice}\n• **Địa chỉ nổi tiếng:** ${foodData.address}\n• **Mức giá tham khảo:** ${foodData.costText || '50.000đ - 100.000đ/suất'}${foodData.otherDishes.length > 0 ? `\n\nNgoài ra, bạn cũng có thể thưởng thức thêm các món trứ danh khác như: ${foodData.otherDishes.slice(0, 2).map(d => `**${d.name}**`).join(', ')}.` : ''}`;
      }

      return res.json({
        success: true,
        reply: replyText,
        plan: currentPlan,
        suggestedPrompts: [
          'Có món nào khác không?',
          'Thêm một địa điểm ăn uống',
          'Xáo lại lịch trình ngày 2',
          'Đổi địa điểm khác đi'
        ]
      });
    }

    // General travel advisory Q&A (weather, month/season, clothing, rain, safety, transport tips, souvenirs) -> answer WITHOUT wiping/rebuilding plan!
    const hasExplicitPlanIntent = /(lên lịch|tạo lịch|làm lịch|lập lịch|thiết kế lịch|lịch trình|làm plan|tạo plan|đổi plan|xáo|thêm.*ăn|đổi địa điểm|đổi sang|chuyển sang|thay.*bằng)/i.test(lowerMsg) || isExplicitDays || Boolean(tiktokMatch);
    const isAdvisoryQuestion = !hasExplicitPlanIntent && (
      /(thời tiết|khí hậu|mặc gì|trang phục|mang gì|chuẩn bị gì|có mưa không|mùa mưa|mùa khô|mùa nào đẹp|tháng\s*\d+\s*(?:có|nên|đẹp|mưa|lạnh|nóng)|đi xe gì|di chuyển bằng gì|phương tiện gì|mua gì làm quà|lưu ý gì|kinh nghiệm đi|có lạnh không|có nóng không|bao nhiêu độ)/i.test(lowerMsg) ||
      (/\?$/.test(userMsg) && /(nên|sao|thế nào|như nào|không|gì|đâu|bao nhiêu)/i.test(lowerMsg) && currentPlan && (!mentionedProv || mentionedProv === currentPlan.destination))
    );

    if (isAdvisoryQuestion) {
      const targetProv = mentionedProv || currentPlan?.destination || activeProvince;
      const pData = getOrCreateProvinceData(targetProv);
      let replyText = '';

      try {
        const advisoryPrompt = `Du khách đang xem kế hoạch du lịch (hoặc tìm hiểu) về **${targetProv}** (${pData.region || 'Việt Nam'})${currentPlan ? `, lịch trình hiện tại ${currentPlan.days} ngày cho ${currentPlan.guests || 1} khách` : ''}.
Câu hỏi của du khách: "${userMsg}"

Hãy tư vấn chi tiết, thực tế, gạch đầu dòng rõ ràng, hữu ích đúng trọng tâm câu hỏi (thời tiết/trang phục/phương tiện/lưu ý bản địa tại ${targetProv}), giữ nguyên lịch trình hiện tại của khách.`;
        replyText = await generateWithFallback(advisoryPrompt, SYSTEM_INSTRUCTION);
      } catch (err) {
        replyText = buildSeasonalWeatherAdvice(targetProv, userMsg);
      }

      return res.json({
        success: true,
        reply: replyText,
        plan: currentPlan,
        suggestedPrompts: currentPlan
          ? [
              `Món nào ngon nhất ở ${targetProv}?`,
              'Thêm một địa điểm ăn uống',
              'Xáo lại lịch trình ngày 2',
              `Đổi sang lịch trình ${targetProv} ${(currentDays % 5) + 2} ngày`
            ]
          : [
              `Lên lịch trình ${targetProv} 3 ngày 2 đêm`,
              `Món nào ngon nhất ở ${targetProv}?`,
              `Lên lịch trình ${targetProv} 4 ngày cho 2 người`
            ]
      });
    }

    const isAddFoodQuery = /(thêm.*(?:địa điểm|điểm|quán|nhà hàng|chỗ).*ăn(?: uống)?|thêm.*quán ăn|thêm ăn uống|bổ sung.*ăn uống|thêm điểm ăn|cho thêm quán ăn)/i.test(lowerMsg);

    if (isAddFoodQuery && currentPlan) {
      const dayTargetMatch = lowerMsg.match(/(?:ngày|ngay)\s*(\d+)/i);
      const targetDay = dayTargetMatch ? parseInt(dayTargetMatch[1], 10) : 1;
      const addResult = addFoodActivityToPlan(currentPlan, targetDay);

      if (addResult.success) {
        const added = addResult.addedFood;
        const replyText = `Mình đã bổ sung thêm địa điểm ăn uống **"${added.name}"** (${added.dish || added.costText || 'ẩm thực đặc sản'}) vào lịch trình Ngày ${addResult.dayNumber} cho bạn!\n\n• **Địa chỉ:** ${added.address || 'Trung tâm thành phố'}\n• **Món đặc trưng:** ${added.dish || added.name}\n• **Gợi ý trải nghiệm:** ${added.advice || 'Thưởng thức ẩm thực đậm đà bản sắc địa phương'}\n• **Khung giờ:** ${addResult.activity?.time || '16:30'}\n\nBảng lịch trình và bản đồ tương tác đã được cập nhật thêm điểm ăn uống mới này!`;

        return res.json({
          success: true,
          reply: replyText,
          plan: addResult.updatedPlan,
          suggestedPrompts: [
            'Có món nào khác không?',
            'Xáo lại lịch trình ngày 2',
            'Chỗ đó xa quá, đổi chỗ gần hơn',
            'Làm lịch trình khác đi'
          ]
        });
      }
    }

    const isCloserQuery = /(xa quá.*(?:đổi|tìm|chọn).*(?:gần|khác|chỗ)|đổi.*(?:chỗ|điểm|nơi).*gần hơn|tìm.*(?:chỗ|điểm).*gần hơn|chỗ đó xa quá|điểm này xa quá|xa quá)/i.test(lowerMsg);

    if (isCloserQuery && currentPlan) {
      const replaceResult = replaceActivityInPlan(currentPlan, '', currentPlan.destination, { closerOnly: true });

      if (replaceResult.success) {
        const replyText = `Mình hiểu bạn muốn tối ưu quãng đường di chuyển! Mình đã thay thế điểm **"${replaceResult.oldName}"** bằng **"${replaceResult.newName}"** nằm ngay khu vực trung tâm và gần các hoạt động liên quan trong Ngày ${replaceResult.dayNumber} để bạn di chuyển thuận tiện nhất mà không lo ngại đường xa!\n\n• **Điểm đến mới:** ${replaceResult.newName}\n• **Địa chỉ:** ${replaceResult.replacement.address || 'Khu vực trung tâm'}\n• **Ưu điểm:** Vị trí gần, kết nối liền mạch với các điểm còn lại trong ngày.\n\nLộ trình và bản đồ đã được tự động kết nối lại gần hơn!`;

        return res.json({
          success: true,
          reply: replyText,
          plan: replaceResult.updatedPlan,
          suggestedPrompts: [
            'Thêm một địa điểm ăn uống',
            'Xáo lại lịch trình ngày 2',
            'Giữ các điểm cũ nhưng xếp lại',
            'Món nào ngon nhất ở đây?'
          ]
        });
      }
    }

    const specificDayShuffleMatch = lowerMsg.match(/(?:xáo lại|xáo lên|xáo trộn|đổi thứ tự|sắp xếp lại|đảo lại).*?(?:lịch trình|hoạt động)?.*?(?:ngày|ngay)\s*(\d+)/i) ||
      lowerMsg.match(/(?:ngày|ngay)\s*(\d+).*?(?:xáo lại|xáo lên|xáo trộn|đổi thứ tự|sắp xếp lại|đảo lại)/i);

    if (specificDayShuffleMatch && currentPlan) {
      const dayNum = parseInt(specificDayShuffleMatch[1], 10);
      const shuffledPlan = shufflePlanActivities(currentPlan, dayNum);

      const dayObj = shuffledPlan.dailyItinerary?.find(d => d.day === dayNum);
      const morningName = dayObj?.activities?.[0]?.name || 'Điểm sáng';
      const afternoonName = dayObj?.activities?.[2]?.name || 'Điểm chiều';

      const replyText = `VietnamTourism AI đã tạo lại và sắp xếp lại thứ tự các hoạt động trong **Ngày ${dayNum}** cho chuyến đi **${currentPlan.destination}** của bạn!\n\n• **Buổi sáng (08:30):** Khám phá **${morningName}** trong không khí trong lành, đón bình minh và tránh đông đúc.\n• **Buổi chiều (15:00):** Ghé thăm **${afternoonName}** vào khung giờ hoàng hôn mát mẻ.\n• Các ngày khác trong lịch trình vẫn được giữ nguyên vẹn.\n\nBạn có thể kiểm tra thứ tự hoạt động mới của Ngày ${dayNum} ở bảng bên cạnh nhé!`;

      return res.json({
        success: true,
        reply: replyText,
        plan: shuffledPlan,
        suggestedPrompts: [
          'Món nào ngon nhất ở đây?',
          'Thêm một địa điểm ăn uống',
          'Chỗ đó xa quá, đổi chỗ gần hơn',
          'Cho t đi 5 ngày thay vì 3 ngày'
        ]
      });
    }

    const isKeepPlacesShuffleQuery = /(giữ.*(?:điểm|chỗ|nơi).*?(?:xếp lại|xáo|đổi|sắp xếp)|(?:xếp lại|xáo|đổi thứ tự).*?giữ|giữ các điểm cũ|giữ địa điểm.*xáo|xáo lên mà giữ|giữ.*nhưng.*xáo)/i.test(lowerMsg);

    if (isKeepPlacesShuffleQuery && currentPlan) {
      const shuffledPlan = shufflePlanActivities(currentPlan);

      const replyText = `VietnamTourism AI đã **giữ nguyên các địa điểm tham quan quen thuộc** trong chuyến đi **${currentPlan.destination}** (${shuffledPlan.days} ngày) của bạn và xáo trộn, tái sắp xếp lại thứ tự trải nghiệm hoàn toàn khác biệt!\n\n• Thứ tự các điểm tham quan buổi sáng và buổi chiều đã được hoán đổi ghép chéo khoa học để mang lại góc nhìn mới mẻ.\n• Mọi điểm đến vẫn trọn vẹn, các hoạt động ăn uống và dạo phố được luân chuyển hài hòa.\n\nBạn có thể theo dõi thứ tự mới trên bảng lịch trình và bản đồ tương tác nhé!`;

      return res.json({
        success: true,
        reply: replyText,
        plan: shuffledPlan,
        suggestedPrompts: [
          'Món nào ngon nhất ở đây?',
          'Thêm một địa điểm ăn uống',
          'Chỗ đó xa quá, đổi chỗ gần hơn',
          'Cho t đi 5 ngày thay vì 3 ngày'
        ]
      });
    }

    const isGeneralShuffle = /(xáo lại|xáo lên|xáo trộn|đổi thứ tự|sắp xếp lại|thay đổi thứ tự|đảo lại|khác đi tí|xáo lại tí|sắp xếp khác|xáo.*khác đi|xáo đi)/i.test(lowerMsg);

    if (isGeneralShuffle && currentPlan) {
      const shuffledPlan = shufflePlanActivities(currentPlan);
      const replyText = `VietnamTourism AI đã xáo trộn và tái sắp xếp lại thứ tự các buổi tham quan trong chuyến đi **${currentPlan.destination}** cho bạn!\n\n• Thứ tự các điểm tham quan buổi sáng và buổi chiều đã được hoán đổi khoa học để mang lại góc nhìn và khung giờ trải nghiệm mới lạ.\n• Thời lượng tham quan và thời gian di chuyển giữa các điểm vẫn được đảm bảo tối ưu, không bị trùng lịch.\n\nBạn có thể kiểm tra lộ trình mới ở bảng bên cạnh nhé!`;

      return res.json({
        success: true,
        reply: replyText,
        plan: shuffledPlan,
        suggestedPrompts: [
          'Món nào ngon nhất ở đây?',
          'Thêm một địa điểm ăn uống',
          'Chỗ đó xa quá, đổi chỗ gần hơn',
          'Đổi địa điểm khác đi'
        ]
      });
    }

    const isReplaceActivity = /(đổi.*(chỗ|điểm|nơi|quán|hoạt động|thắng cảnh)|thay.*(chỗ|điểm|nơi|quán)|không thích.*(chỗ|điểm|này)|chỗ khác thay|thay.*bằng|đổi.*sang)/i.test(lowerMsg) && !lowerMsg.includes('địa điểm khác') && !lowerMsg.includes('tỉnh khác') && (!mentionedProv || mentionedProv === currentPlan?.destination);

    if (isReplaceActivity && currentPlan) {
      let targetName = '';
      const replaceMatch = lowerMsg.match(/(?:đổi|thay)\s+([^,]+?)\s+(?:sang|thành|bằng|chỗ khác)/i);
      if (replaceMatch) {
        targetName = replaceMatch[1].trim();
      }

      const replaceResult = replaceActivityInPlan(currentPlan, targetName, currentPlan.destination);

      if (replaceResult.success) {
        const replyText = `Mình đã thay thế hoạt động **"${replaceResult.oldName}"** bằng **"${replaceResult.newName}"** trong lịch trình Ngày ${replaceResult.dayNumber} theo đúng yêu cầu của bạn!\n\n• **Địa chỉ mới:** ${replaceResult.replacement.address || 'Khu vực trung tâm'}\n• **Trải nghiệm:** ${replaceResult.replacement.advice || 'Tham quan và khám phá nét đẹp văn hóa bản địa'}\n• Dự toán chi phí vé và thời lượng di chuyển đã được tính toán lại đồng bộ.\n\nBạn có thể xem chi tiết điểm mới ngay trên bảng lịch trình và bản đồ tương tác!`;

        return res.json({
          success: true,
          reply: replyText,
          plan: replaceResult.updatedPlan,
          suggestedPrompts: [
            'Xáo lại lịch trình ngày 2',
            'Thêm một địa điểm ăn uống',
            'Món nào ngon nhất ở đây?',
            'Chỗ đó xa quá, đổi chỗ gần hơn'
          ]
        });
      }
    }

    const isChangePlan = /(làm lịch trình khác|lên lịch trình khác|tạo lịch trình khác|lịch trình khác đi|plan khác đi|đổi lịch trình khác|làm plan khác|làm lại plan|đổi plan|thay plan)/i.test(lowerMsg);

    if (isChangePlan && currentPlan) {
      const newPlan = buildSmartItinerary({
        startLocation: activeStart,
        destination: currentPlan.destination,
        days: currentDays,
        budget: currentPlan.totalBudget || (currentDays * 1500000),
        guests: activeGuests,
        rooms: activeRooms,
        travelStyle: 'Văn hóa & Khám phá & Ẩm thực',
        specialRequests: 'đi rồi lên lịch trình khác với trải nghiệm và địa điểm mới lạ'
      });

      const replyText = `VietnamTourism AI đã tạo lại toàn bộ lịch trình khám phá **${currentPlan.destination}** (${currentDays} ngày ${currentDays > 1 ? currentDays - 1 : 0} đêm) với thứ tự và các hoạt động hoàn toàn mới lạ cho bạn!\n\n• Các điểm tham quan, danh thắng và quán ăn đã được làm mới để bạn có trải nghiệm phong phú khác biệt.\n• Toàn bộ bảng lịch trình và bản đồ tương tác đã được cập nhật đồng bộ lộ trình mới.\n\nBạn có thể xem chi tiết hoặc yêu cầu tinh chỉnh thêm nhé!`;

      return res.json({
        success: true,
        reply: replyText,
        plan: newPlan,
        suggestedPrompts: [
          'Món nào ngon nhất ở đây?',
          'Xáo lại lịch trình ngày 2',
          'Thêm một địa điểm ăn uống',
          'Chỗ đó xa quá, đổi chỗ gần hơn'
        ]
      });
    }

    const isChangeDestination = (
      /(đổi địa điểm khác|đi chỗ khác|có chỗ nào khác không|không thích chỗ này|tìm nơi khác|cho t địa điểm mới|đổi điểm đến|chuyển điểm đến|tìm điểm khác)/i.test(lowerMsg) ||
      (/(đổi sang|chuyển sang|đi)\s+/i.test(lowerMsg) && mentionedProv && mentionedProv !== currentPlan?.destination)
    );

    const isDaysChangedOnly = isExplicitDays && currentPlan && !isChangeDestination && (!mentionedProv || mentionedProv === currentPlan.destination) && detectedDays !== currentDays;

    if (isDaysChangedOnly && currentPlan) {
      const expandedPlan = expandItineraryDays(currentPlan, detectedDays, activeStart);

      const replyText = detectedDays > currentDays
        ? `Mình đã điều chỉnh chuyến đi **${currentPlan.destination}** thành **đủ ${detectedDays} ngày ${detectedDays - 1} đêm** và bổ sung hoàn chỉnh lịch trình cho **${Array.from({ length: detectedDays - currentDays }, (_, i) => `Ngày ${currentDays + 1 + i}`).join(', ')}** theo đúng yêu cầu của bạn!\n\n• Các ngày trước (${Array.from({ length: currentDays }, (_, i) => `Ngày ${i + 1}`).join(', ')}) vẫn được giữ nguyên trọn vẹn.\n• Các ngày bổ sung mới sở hữu các danh thắng, trải nghiệm ngắm cảnh và quán ăn đặc sản không hề trùng lặp.\n• Dự toán chi phí và dịch vụ đã được tính toán lại tương ứng.\n\nBạn có thể bấm chọn từng ngày trên lịch trình để theo dõi chi tiết!`
        : `Mình đã rút gọn lịch trình **${currentPlan.destination}** thành **${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm** phù hợp với quỹ thời gian của bạn! Lộ trình đã được tối ưu tinh gọn và đồng bộ trên bảng lịch trình.`;

      return res.json({
        success: true,
        reply: replyText,
        plan: expandedPlan,
        suggestedPrompts: [
          'Món nào ngon nhất ở đây?',
          'Xáo lại lịch trình ngày 2',
          'Thêm một địa điểm ăn uống',
          'Chỗ đó xa quá, đổi chỗ gần hơn'
        ]
      });
    }

    let finalDest = currentPlan?.destination || activeProvince;
    if (isChangeDestination) {
      if (mentionedProv && mentionedProv !== currentPlan?.destination) {
        finalDest = mentionedProv;
      } else {
        finalDest = getRandomAlternativeDestination(currentPlan?.destination);
      }
    } else if (mentionedProv) {
      finalDest = mentionedProv;
    }

    const isDestinationChanged = currentPlan && finalDest !== currentPlan.destination;

    const newPlan = buildSmartItinerary({
      startLocation: activeStart,
      destination: finalDest,
      days: detectedDays,
      budget: currentPlan?.totalBudget || (detectedDays * 1500000),
      guests: activeGuests,
      rooms: activeRooms,
      travelStyle: 'Văn hóa & Khám phá & Ẩm thực',
      specialRequests: userMsg
    });

    let replyText = '';
    if (tiktokInfo && tiktokInfo.province) {
      replyText = `Mình đã phân tích video TikTok${tiktokInfo.author ? ` của **${tiktokInfo.author}**` : ''}${tiktokInfo.title ? ` (*"${tiktokInfo.title.slice(0, 90)}"*)` : ''} và nhận diện điểm đến **${finalDest}**!\n\n• Đã thiết lập ngay lịch trình **${finalDest} (${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm)** cho **${activeGuests} khách** (${activeRooms} phòng).\n• Toàn bộ tọa độ bản đồ, danh thắng nổi bật và quán đặc sản bản địa đã được đồng bộ ở bảng bên cạnh!`;
    } else if (isDestinationChanged) {
      replyText = `Mình đã thay đổi điểm đến từ **${currentPlan.destination}** sang **${finalDest}** và tái thiết lập toàn bộ kế hoạch du lịch (${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm, ${activeGuests} khách) cho bạn!\n\n• Điểm đến mới **${finalDest}** sở hữu cảnh quan đặc trưng, nhiều di tích danh thắng và nền ẩm thực bản địa hấp dẫn.\n• Toàn bộ 4 mốc thời gian mỗi ngày (sáng, trưa, chiều, tối) đã được đồng bộ mới trên bảng lịch trình và bản đồ.\n\nBạn có thể xem chi tiết hoặc yêu cầu tinh chỉnh tiếp theo nhé!`;
    } else {
      replyText = `VietnamTourism AI đã thiết kế lịch trình khám phá **${finalDest}** (${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm, ${activeGuests} khách / ${activeRooms} phòng) hoàn chỉnh cho bạn!\n\n• Toàn bộ các ngày đều có danh thắng, quán ăn đặc sản và trải nghiệm đêm khác biệt (không trùng lặp).\n• Bạn có thể nhấn vào từng địa điểm trên bản đồ hoặc nút **Google Maps** để xem chỉ đường trực tiếp.\n\nBạn có thể hỏi thêm về thời tiết, món ngon nhất, xáo lại lịch trình, hoặc thêm địa điểm bất cứ lúc nào!`;
    }

    const suggestedPrompts = [
      `Món nào ngon nhất ở ${finalDest}?`,
      `Thời tiết ${finalDest} nên mặc gì?`,
      'Xáo lại lịch trình ngày 2',
      'Thêm một địa điểm ăn uống'
    ];

    return res.json({
      success: true,
      reply: replyText,
      plan: newPlan,
      suggestedPrompts
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
      reply: 'VietnamTourism AI đã chuẩn bị sẵn lộ trình mẫu khám phá Đà Lạt 3 ngày 2 đêm cho Quý khách. Bạn có thể trò chuyện tiếp để AI tinh chỉnh theo bất kỳ tỉnh thành nào!',
      plan: fallbackPlan,
      suggestedPrompts: [
        'Món nào ngon nhất ở đây?',
        'Có món nào khác không?',
        'Xáo lại lịch trình ngày 2',
        'Thêm một địa điểm ăn uống'
      ]
    });
  }
});

app.post(['/api/chat/plan', '/api/ai/plan'], async (req, res) => {
  const { destination, startLocation, days, budget, guests, rooms, travelStyle, specialRequests } = req.body;

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
      guests: parseInt(guests, 10) || 1,
      rooms: parseInt(rooms, 10) || 1,
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

app.get('/api/chat/knowledge', (req, res) => {
  res.json({
    success: true,
    provinces: Object.keys(VIETNAM_PROVINCES_DATA),
    data: VIETNAM_PROVINCES_DATA
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ai-service',
    port,
    models: MODELS,
    knowledgeProvinces: Object.keys(VIETNAM_PROVINCES_DATA).length
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`AI Service running on port ${port} with rich Vietnam Tourism Knowledge Base (${Object.keys(VIETNAM_PROVINCES_DATA).length} destinations)`);
  });
}

module.exports = { app, extractDaysFromText, extractGuestsAndRoomsFromText };
