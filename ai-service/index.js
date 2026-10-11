const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { 
  VIETNAM_PROVINCES_DATA, 
  detectDestinationProvince, 
  extractTripRoute, 
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

const MODELS = (process.env.GEMINI_MODELS || 'gemini-flash-latest,gemini-3.8-flash,gemini-2.5-flash-lite,gemini-3.5-flash').split(',');

const SYSTEM_INSTRUCTION = `Bạn là VietnamTourism AI — Trợ lý du lịch thông minh hàng đầu Việt Nam.
Tuân thủ nghiêm ngặt BỘ QUY TẮC HUẤN LUYỆN VIETNAMTOURISM AI:
- RULE 1: Trả lời đúng trọng tâm. Khi người dùng hỏi một món ngon nhất hoặc điểm đến cụ thể, PHẢI nêu đích danh tên món/điểm cụ thể trước, mô tả hương vị/cách thưởng thức và địa chỉ uy tín, sau đó mới đề xuất thêm lựa chọn. Không trả lời chung chung sáo rỗng.
- RULE 2: Trả lời tự nhiên, đa dạng, tránh lặp lại nguyên văn lời chào hay câu mẫu cũ.
- RULE 3: Nhận biết rõ ý định đổi địa điểm (nếu đổi trong Chat thì gợi ý, nếu đổi trong Plan thì đồng bộ Plan).
- RULE 4: Duy trì ngữ cảnh hội thoại (tỉnh thành đang chọn, số ngày, sở thích).
- Giữ phong cách chuyên nghiệp, thân thiện, am hiểu văn hóa và ẩm thực bản địa sâu sắc.`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Request Timeout')), ms))
]);

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

    const route = extractTripRoute(userMsg);
    const mentionedProv = route.destination || detectDestinationProvince(userMsg);
    const activeProvince = mentionedProv || currentPlan?.destination || 'Vịnh Hạ Long';
    const activeStart = route.startLocation || currentPlan?.startLocation || 'Hà Nội';

function extractDaysFromText(text) {
  if (!text) return null;
  const lower = text.toString().trim().toLowerCase();

  const isMetaOrComplaint = /(?:vẫn chỉ (?:có|được)|sao lại chỉ|toàn|auto)\s*(\d+)\s*(?:ngày|ngay)/i.test(lower);
  const condPrefixMatch = /(?:quá|hơn|trên)\s*(\d+)\s*(?:ngày|ngay)/i.test(lower);

  const insteadOfPrefix = lower.match(/(?:thay vì|thay cho)\s*(\d+)\s*(?:ngày|ngay|n|hôm)?.*?(?:cho (?:t|tôi|mình) đi|đi|làm|thành|sang)?\s*(\d+)\s*(?:ngày|ngay|n|hôm)?/i);
  if (insteadOfPrefix) {
    const d = parseInt(insteadOfPrefix[2], 10);
    if (d >= 1 && d <= 30) return d;
  }

  const insteadOfSuffix = lower.match(/(\d+)\s*(?:ngày|ngay|n|hôm)?\s*(?:thay vì|thay cho|chứ không phải|thay)\s*(\d+)/i);
  if (insteadOfSuffix) {
    const d = parseInt(insteadOfSuffix[1], 10);
    if (d >= 1 && d <= 30) return d;
  }

  const fromToMatch = lower.match(/từ\s*(\d+)\s*(?:ngày|ngay|n|hôm)?\s*(?:lên|sang|thành|xuống)\s*(\d+)/i);
  if (fromToMatch) {
    const d = parseInt(fromToMatch[2], 10);
    if (d >= 1 && d <= 30) return d;
  }

  if (!isMetaOrComplaint && !condPrefixMatch) {
    const explicitMatch = lower.match(/(?:cho (?:t|tôi|mình) đi|đi|làm|tạo|lên lịch|lịch trình|đổi thành|đổi sang|thành|tăng lên|giảm xuống)?\s*(\d+)\s*(?:ngày|ngay|hôm|n|d)(?:\s*\d+\s*(?:đêm|dem|d))?/i);
    if (explicitMatch) {
      const d = parseInt(explicitMatch[1], 10);
      if (d >= 1 && d <= 30) return d;
    }
  }

  if (!isMetaOrComplaint && !condPrefixMatch) {
    const justNumberMatch = lower.match(/(?:^|\b)(?:đi|làm|cho|thành|lên|đổi|tăng|rút|chọn)?\s*([1-9]|[12][0-9]|30)\s*(?:đi|thôi|nhé|nha|ạ|được không)?(?:\b|$)/i);
    if (justNumberMatch) {
      const d = parseInt(justNumberMatch[1], 10);
      if (d >= 1 && d <= 30) return d;
    }
  }

  return null;
}

    let currentDays = 4;
    if (currentPlan) {
      currentDays = parseInt(currentPlan.days, 10) || currentPlan.dailyItinerary?.length || 4;
    }
    let detectedDays = currentDays;

    let isExplicitDays = false;
    const parsedDays = extractDaysFromText(userMsg);
    if (parsedDays !== null) {
      detectedDays = parsedDays;
      isExplicitDays = true;
    }
    detectedDays = Math.max(1, Math.min(30, detectedDays));

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
          `Thêm một địa điểm ăn uống`,
          `Xáo lại lịch trình ngày 2`,
          `Đổi địa điểm khác đi`,
          `Làm lịch trình khác đi`
        ]
      });
    }

    const isBestFoodQuery = /(món nào ngon nhất|món gì ngon nhất|ngon nhất ở đây|đặc sản ngon nhất|món ngon nhất|ăn gì ngon nhất)/i.test(lowerMsg) ||
      (/(món.*(?:ngon|gì|đặc sản|nổi tiếng)|ăn gì|đặc sản.*(?:gì|nào)|ẩm thực)/i.test(lowerMsg) && !lowerMsg.includes('thêm') && !lowerMsg.includes('quán ăn'));

    if (isBestFoodQuery) {
      const foodData = getBestFoodRecommendation(activeProvince);
      let replyText = '';

      try {
        const foodPrompt = `Người dùng hỏi: "${userMsg}".
Điểm đến hiện tại: ${activeProvince}.
Dữ liệu ẩm thực tại ${activeProvince}:
- Món đặc trưng nhất: ${foodData.mainDish} (${foodData.dishDetail || ''}). Địa chỉ: ${foodData.address || ''}. Cách thưởng thức: ${foodData.advice || ''}.
- Các món nổi tiếng khác: ${foodData.otherDishes.map(f => f.name + (f.dish ? ` (${f.dish})` : '')).join(', ')}.

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
          `Có món nào khác không?`,
          `Thêm một địa điểm ăn uống`,
          `Xáo lại lịch trình ngày 2`,
          `Đổi địa điểm khác đi`
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
            `Có món nào khác không?`,
            `Xáo lại lịch trình ngày 2`,
            `Chỗ đó xa quá, đổi chỗ gần hơn`,
            `Làm lịch trình khác đi`
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
            `Thêm một địa điểm ăn uống`,
            `Xáo lại lịch trình ngày 2`,
            `Giữ các điểm cũ nhưng xếp lại`,
            `Món nào ngon nhất ở đây?`
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
          `Món nào ngon nhất ở đây?`,
          `Thêm một địa điểm ăn uống`,
          `Chỗ đó xa quá, đổi chỗ gần hơn`,
          `Cho t đi 5 ngày thay vì 3 ngày`
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
          `Món nào ngon nhất ở đây?`,
          `Thêm một địa điểm ăn uống`,
          `Chỗ đó xa quá, đổi chỗ gần hơn`,
          `Cho t đi 5 ngày thay vì 3 ngày`
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
          `Món nào ngon nhất ở đây?`,
          `Thêm một địa điểm ăn uống`,
          `Chỗ đó xa quá, đổi chỗ gần hơn`,
          `Đổi địa điểm khác đi`
        ]
      });
    }

    const isReplaceActivity = /(đổi.*(chỗ|điểm|nơi|quán|hoạt động|thắng cảnh)|thay.*(chỗ|điểm|nơi|quán)|không thích.*(chỗ|điểm|này)|chỗ khác thay|thay.*bằng|đổi.*sang)/i.test(lowerMsg) && !lowerMsg.includes('địa điểm khác') && !lowerMsg.includes('tỉnh khác');

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
            `Xáo lại lịch trình ngày 2`,
            `Thêm một địa điểm ăn uống`,
            `Món nào ngon nhất ở đây?`,
            `Chỗ đó xa quá, đổi chỗ gần hơn`
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
        guests: guests || currentPlan.guests || 1,
        rooms: rooms || currentPlan.rooms || 1,
        travelStyle: 'Văn hóa & Khám phá & Ẩm thực',
        specialRequests: 'đi rồi lên lịch trình khác với trải nghiệm và địa điểm mới lạ'
      });

      const replyText = `VietnamTourism AI đã tạo lại toàn bộ lịch trình khám phá **${currentPlan.destination}** (${currentDays} ngày ${currentDays > 1 ? currentDays - 1 : 0} đêm) với thứ tự và các hoạt động hoàn toàn mới lạ cho bạn!\n\n• Các điểm tham quan, danh thắng và quán ăn đã được làm mới để bạn có trải nghiệm phong phú khác biệt.\n• Toàn bộ bảng lịch trình và bản đồ tương tác đã được cập nhật đồng bộ lộ trình mới.\n\nBạn có thể xem chi tiết hoặc yêu cầu tinh chỉnh thêm nhé!`;

      return res.json({
        success: true,
        reply: replyText,
        plan: newPlan,
        suggestedPrompts: [
          `Món nào ngon nhất ở đây?`,
          `Xáo lại lịch trình ngày 2`,
          `Thêm một địa điểm ăn uống`,
          `Chỗ đó xa quá, đổi chỗ gần hơn`
        ]
      });
    }

    const isDaysChanged = isExplicitDays && currentPlan && detectedDays !== currentDays;

    if (isDaysChanged && currentPlan) {
      const expandedPlan = expandItineraryDays(currentPlan, detectedDays, activeStart);

      const replyText = detectedDays > currentDays
        ? `Mình đã điều chỉnh chuyến đi **${currentPlan.destination}** thành **đủ ${detectedDays} ngày ${detectedDays - 1} đêm** và bổ sung hoàn chỉnh lịch trình cho **${Array.from({ length: detectedDays - currentDays }, (_, i) => `Ngày ${currentDays + 1 + i}`).join(', ')}** theo đúng yêu cầu của bạn!\n\n• Các ngày trước (${Array.from({ length: currentDays }, (_, i) => `Ngày ${i + 1}`).join(', ')}) vẫn được giữ nguyên trọn vẹn.\n• Các ngày bổ sung mới sở hữu các danh thắng, trải nghiệm ngắm cảnh và quán ăn đặc sản không hề trùng lặp.\n• Dự toán chi phí và dịch vụ đã được tính toán lại tương ứng.\n\nBạn có thể bấm chọn từng ngày trên lịch trình để theo dõi chi tiết!`
        : `Mình đã rút gọn lịch trình **${currentPlan.destination}** thành **${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm** phù hợp với quỹ thời gian của bạn! Lộ trình đã được tối ưu tinh gọn và đồng bộ trên bảng lịch trình.`;

      return res.json({
        success: true,
        reply: replyText,
        plan: expandedPlan,
        suggestedPrompts: [
          `Món nào ngon nhất ở đây?`,
          `Xáo lại lịch trình ngày 2`,
          `Thêm một địa điểm ăn uống`,
          `Chỗ đó xa quá, đổi chỗ gần hơn`
        ]
      });
    }

    const isChangeDestination = (
      /(đổi địa điểm khác|đi chỗ khác|có chỗ nào khác không|không thích chỗ này|tìm nơi khác|cho t địa điểm mới|đổi điểm đến|chuyển điểm đến|tìm điểm khác)/i.test(lowerMsg) ||
      (/(đổi sang|chuyển sang|đi)\s+/i.test(lowerMsg) && mentionedProv && mentionedProv !== currentPlan?.destination)
    );

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
      guests: guests || currentPlan?.guests || 1,
      rooms: rooms || currentPlan?.rooms || 1,
      travelStyle: 'Văn hóa & Khám phá & Ẩm thực',
      specialRequests: userMsg
    });

    let replyText = '';
    if (isDestinationChanged) {
      replyText = `Mình đã thay đổi điểm đến từ **${currentPlan.destination}** sang **${finalDest}** và tái thiết lập toàn bộ kế hoạch du lịch (${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm) cho bạn!\n\n• Điểm đến mới **${finalDest}** sở hữu cảnh quan thiên nhiên kỳ vĩ, nhiều di tích danh thắng và nền ẩm thực bản địa đặc sắc.\n• Toàn bộ 4 mốc thời gian mỗi ngày (sáng, trưa, chiều, tối) đã được đồng bộ mới trên bảng lịch trình và bản đồ.\n\nBạn có thể xem chi tiết hoặc yêu cầu tinh chỉnh tiếp theo nhé!`;
    } else {
      replyText = `VietnamTourism AI đã thiết kế lịch trình khám phá **${finalDest}** (${detectedDays} ngày ${detectedDays > 1 ? detectedDays - 1 : 0} đêm) hoàn chỉnh cho bạn!\n\n• Toàn bộ các ngày đều có danh thắng, quán ăn gia truyền và trải nghiệm đêm khác biệt hoàn toàn (không trùng lặp).\n• Bạn có thể nhấn vào nút hoặc biểu tượng **Google Maps** tại mỗi địa điểm để mở bản đồ dẫn đường trực tiếp.\n\nBạn có thể hỏi về món ngon nhất, xáo lại lịch trình, hoặc thêm địa điểm bất cứ lúc nào!`;
    }

    const suggestedPrompts = [
      `Món nào ngon nhất ở đây?`,
      `Có món nào khác không?`,
      `Xáo lại lịch trình ngày 2`,
      `Thêm một địa điểm ăn uống`
    ];

    return res.json({
      success: true,
      reply: replyText,
      plan: newPlan,
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
        'Món nào ngon nhất ở đây?',
        'Có món nào khác không?',
        'Xáo lại lịch trình ngày 2',
        'Thêm một địa điểm ăn uống'
      ]
    });
  }
});

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
