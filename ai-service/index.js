const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODELS = (process.env.GEMINI_MODELS || 'gemini-3.8-flash,gemini-3.5-flash').split(',');
const SYSTEM_INSTRUCTION = "Bạn là một chuyên gia tư vấn du lịch Việt Nam chuyên sâu có tên là VietnamTourism AI. Bạn chỉ trả lời các câu hỏi liên quan đến du lịch, địa điểm, văn hóa, và ẩm thực của Việt Nam. Giữ câu trả lời chi tiết, thân thiện, hữu ích và phong phú.";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Request Timeout')), ms))
]);

// Try models with 1 attempt each and 7-second max timeout
async function generateWithFallback(message, customSystemInstruction) {
  let lastError;
  for (const name of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: name.trim(), 
        systemInstruction: customSystemInstruction || SYSTEM_INSTRUCTION 
      });
      const result = await withTimeout(model.generateContent(message), 7000);
      return result.response.text();
    } catch (error) {
      lastError = error;
      console.error(`Gemini Error [${name.trim()}]:`, error.status || '', error.message);
    }
  }
  throw lastError || new Error('All models unavailable');
}

// ==========================================
// KNOWLEDGE BASE PHONG PHÚ CHO BỘ GỢI Ý DỰ PHÒNG (HEURISTIC RECOMMENDATION ENGINE)
// Hơn 15 điểm đến hàng đầu, mỗi điểm đến có 7-8 nơi ở và 10-12 món ăn đặc sản cụ thể
// ==========================================
const DESTINATION_DATABASE = {
  'đà nẵng': {
    title: 'Hành trình Khám phá Biển xanh & Cầu Rồng Đà Nẵng',
    areaStay: 'Ven biển Mỹ Khê hoặc đường Bạch Đằng ngắm sông Hàn',
    places: [
      { morning: 'Bán đảo Sơn Trà & Viếng Chùa Linh Ứng ngắm tượng Phật Bà 67m', afternoon: 'Tắm biển Mỹ Khê & lướt ván chèo SUP', evening: 'Dạo Cầu Rồng phun lửa, cầu quay Sông Hàn & Chợ đêm Sơn Trà' },
      { morning: 'Khu du lịch Bà Nà Hills & Check-in Cầu Vàng bàn tay khổng lồ', afternoon: 'Khám phá Làng Pháp, Hầm rượu Debay và Vườn hoa Le Jardin', evening: 'Thưởng thức hải sản tươi sống tại quán Bé Mặn hoặc Năm Đảnh' },
      { morning: 'Danh thắng Ngũ Hành Sơn & Động Huyền Không kỳ vĩ', afternoon: 'Bảo tàng Điêu khắc Chăm & dạo công viên APEC', evening: 'Du thuyền sông Hàn ngắm toàn cảnh thành phố về đêm lung linh' },
      { morning: 'Check-in Đèo Hải Vân - Thiên hạ đệ nhất hùng quan & Lăng Cô', afternoon: 'Thưởng thức bánh tráng cuốn thịt heo hai đầu da', evening: 'Thư giãn ngắm cảnh tại các quán cafe rooftop ven sông Hàn' }
    ],
    foods: [
      { dish: 'Mì Quảng Ếch & Mì Quảng Tôm Thịt', places: 'Bếp Trang (24 Pasteur), Mì Quảng Bà Mua (95 Nguyễn Tri Phương)', cost: '45.000 - 65.000 VNĐ', category: 'Món nước' },
      { dish: 'Bánh tráng cuốn thịt heo hai đầu da', places: 'Quán Trần (04 Lê Duẩn), Mậu Quán (35 Đỗ Thúc Tịnh)', cost: '80.000 - 130.000 VNĐ', category: 'Món chính' },
      { dish: 'Hải sản tươi sống ven biển', places: 'Quán Bé Mặn (Lô 11 Võ Nguyên Giáp), Hải sản Năm Đảnh (K139/H59/38 Trần Quang Khải)', cost: '300.000 - 550.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Bún chả cá Đà Nẵng trứ danh', places: 'Bún chả cá Bà Lữ (319 Hùng Vương), Quán 109 Nguyễn Chí Thanh', cost: '35.000 - 50.000 VNĐ', category: 'Món nước' },
      { dish: 'Bánh xèo & Nem lụi giòn rụm', places: 'Quán Bà Dưỡng (K280/23 Hoàng Diệu), Quán Cô Ba (248 Trưng Nữ Vương)', cost: '60.000 - 100.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bê thui Cầu Mống mềm ngọt', places: 'Quán Rô (Cầu Đỏ), Bê thui Kim Chi (490 Trưng Nữ Vương)', cost: '150.000 - 250.000 VNĐ', category: 'Món chính' },
      { dish: 'Chè sầu riêng Liên nức tiếng', places: 'Chè Sầu Liên (189 Hoàng Diệu & 175 Hải Phòng)', cost: '30.000 - 45.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bún mắm nêm thịt quay giòn bì', places: 'Bún mắm Dì Cúc (Trần Kế Xương), Bún mắm Ngọc (20 Đoàn Thị Điểm)', cost: '35.000 - 50.000 VNĐ', category: 'Món nước' },
      { dish: 'Bánh đập & Bánh bèo chén miền Trung', places: 'Quán Bà Bé (100 Hoàng Văn Thụ), Bánh bèo Tâm (291 Nguyễn Chí Thanh)', cost: '25.000 - 45.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Cá nục hấp cuốn bánh tráng', places: 'Quán Bé Nâu (178 Thái Thị Bôi), Quán Bà Thôi (96 Lê Đình Dương)', cost: '60.000 - 90.000 VNĐ', category: 'Món chính' },
      { dish: 'Gỏi cá Nam Ô cay nồng độc đáo', places: 'Gỏi cá Bà Mỳ (11 Mai Lão Bạng), Quán Sáu Hào (232 Trần Cao Vân)', cost: '80.000 - 120.000 VNĐ', category: 'Món chính' },
      { dish: 'Cà phê view biển & Check-in hoàng hôn', places: 'Sơn Trà Marina, Lu Coffee Bạch Đằng, Không Gian Xưa', cost: '40.000 - 70.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'TMS Hotel Da Nang Beach (4-5 sao)', priceRange: '1.200.000 - 2.100.000 VNĐ / đêm', area: 'Đường Võ Nguyên Giáp, sát bãi tắm Mỹ Khê', highlights: 'Hồ bơi vô cực trên tầng thượng view trọn biển, phòng kính panorama, buffet sáng quốc tế', type: 'Khách sạn cao cấp' },
      { name: 'Sala Danang Beach Hotel (4 sao)', priceRange: '850.000 - 1.400.000 VNĐ / đêm', area: 'Bãi biển Mỹ Khê', highlights: 'Cách bãi cát 2 phút đi bộ, thiết kế hiện đại sang trọng, hồ bơi rooftop cực đẹp', type: 'Khách sạn' },
      { name: 'Vanda Hotel Danang (4 sao trung tâm)', priceRange: '750.000 - 1.200.000 VNĐ / đêm', area: 'Ngay chân Cầu Rồng, đường Nguyễn Văn Linh', highlights: 'Vị trí đắc địa ngắm Cầu Rồng phun lửa trực diện từ phòng ngủ, gần chợ đêm', type: 'Khách sạn' },
      { name: 'Furama Resort Danang (5 sao huyền thoại)', priceRange: '2.500.000 - 4.800.000 VNĐ / đêm', area: 'Đường Võ Nguyên Giáp, Ngũ Hành Sơn', highlights: 'Khu nghỉ dưỡng 5 sao biểu tượng, bãi tắm riêng, hồ bơi đầm phá nhiệt đới mát rượi', type: 'Resort 5 sao' },
      { name: 'An Thuong Tropical Homestay', priceRange: '350.000 - 550.000 VNĐ / đêm', area: 'Khu phố Tây An Thượng, Ngũ Hành Sơn', highlights: 'Không gian xanh mát ngập tràn cây cối, phong cách boho vintage, yên tĩnh tuyệt đối', type: 'Homestay' },
      { name: 'Han River View Boutique Apartment', priceRange: '500.000 - 850.000 VNĐ / đêm', area: 'Đường Bạch Đằng ven sông Hàn', highlights: 'Căn hộ đầy đủ bếp nấu nướng gia đình, ban công ngắm toàn cảnh sông Hàn lung linh', type: 'Căn hộ' },
      { name: 'InterContinental Danang Sun Peninsula Resort', priceRange: '7.500.000 - 15.000.000 VNĐ / đêm', area: 'Bán đảo Sơn Trà', highlights: 'Tuyệt tác kiến trúc của Bill Bensley ẩn mình giữa núi rừng nguyên sinh và biển biếc', type: 'Resort 5 sao' },
      { name: 'City Hostel Danang', priceRange: '180.000 - 320.000 VNĐ / đêm', area: 'Hải Châu, trung tâm', highlights: 'Phòng dorm sạch sẽ, máy lạnh 24/7, gần chợ Hàn, cộng đồng du lịch bụi thân thiện', type: 'Hostel' }
    ],
    tips: [
      'Nên thuê xe máy (120k-150k/ngày) để chủ động lịch trình vi vu bán đảo Sơn Trà và đèo Hải Vân.',
      'Cầu Rồng biểu diễn phun lửa và nước vào lúc 21h00 tối Thứ Bảy và Chủ Nhật hàng tuần.',
      'Bà Nà Hills nên đặt vé cáp treo online trước để tránh phải xếp hàng chờ đợi lâu.'
    ]
  },
  'đà lạt': {
    title: 'Hành trình Săn mây & Thưởng ngoạn Xứ sở Ngàn hoa Đà Lạt',
    areaStay: 'Gần Hồ Xuân Hương, Chợ Đà Lạt hoặc thung lũng săn mây Cầu Đất',
    places: [
      { morning: 'Săn mây sớm tại Đồi chè Cầu Đất & Tuabin gió kỳ vĩ', afternoon: 'Check-in Ga Đà Lạt & Dinh Bảo Đại I', evening: 'Dạo Chợ đêm Đà Lạt, thưởng thức bánh tráng nướng & sữa đậu nành nóng' },
      { morning: 'Chèo SUP đón bình minh Hồ Tuyền Lâm & Viếng Thiền Viện Trúc Lâm', afternoon: 'Khám phá Thác Datanla trải nghiệm xe trượt alpine coaster mạo hiểm', evening: 'Thưởng thức Lẩu gà lá é Tao Ngộ hoặc Lẩu bò Ba Toa' },
      { morning: 'Check-in các nông trại hoa cẩm tú cầu & Thung lũng Tình Yêu', afternoon: 'Tham quan Chùa Linh Phước (Chùa Ve Chai)', evening: 'Nghe nhạc Acoustic tại các quán cafe mây sườn đồi lãng mạn' },
      { morning: 'Khám phá Làng Cù Lần & Đỉnh Lang Biang hùng vĩ', afternoon: 'Thưởng thức kem bơ Thanh Thảo & dạo Hồ Xuân Hương', evening: 'Thư giãn tại các quán pub nhỏ acoustic đường Trương Công Định' }
    ],
    foods: [
      { dish: 'Lẩu gà lá é thơm cay nồng', places: 'Quán Tao Ngộ (số 5 đường 3/4), Quán 668 (Chu Văn An)', cost: '200.000 - 350.000 VNĐ / nồi', category: 'Món chính' },
      { dish: 'Lẩu bò Quán Gỗ (Ba Toa chính gốc)', places: 'Hẻm 1 đường Hoàng Diệu (khu Ba Toa cũ)', cost: '250.000 - 400.000 VNĐ / nồi', category: 'Món chính' },
      { dish: 'Bánh tráng nướng "Pizza Đà Lạt"', places: 'Dì Đinh (26 Hoàng Diệu), Chợ đêm Đà Lạt, Quán Cô Phượng', cost: '20.000 - 35.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bánh mì xíu mại chén nước dùng nóng', places: 'Bánh mì xíu mại Bé Linh (26 Hoàng Diệu), Cô Sương (14 Ánh Sáng)', cost: '25.000 - 40.000 VNĐ', category: 'Món nước' },
      { dish: 'Kem bơ béo ngậy đặc sản', places: 'Kem bơ Thanh Thảo (76 Nguyễn Văn Trỗi), Chè Cung Đình', cost: '30.000 - 45.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bánh căn giòn rụm chấm mắm xíu mại', places: 'Bánh căn Lệ (27/44 Yersin), Bánh căn Nhà Chung (số 1 Nhà Chung)', cost: '35.000 - 60.000 VNĐ', category: 'Món chính' },
      { dish: 'Nem nướng Đà Lạt chấm tương đậu phộng', places: 'Nem nướng Bà Hùng (328 Phan Đình Phùng), Nem nướng Hùng Ký', cost: '50.000 - 70.000 VNĐ', category: 'Món chính' },
      { dish: 'Ốc bươu nhồi thịt thố sả thơm lừng', places: 'Quán 33 (33 Hai Bà Trưng), Ốc nhồi thịt Tâm', cost: '120.000 - 180.000 VNĐ / thố', category: 'Hải sản & Đồ nướng' },
      { dish: 'Sữa đậu nành nóng & Bánh tiêu', places: 'Quán Hoa Sữa (64 Tăng Bạt Hổ), Cổng chợ đêm', cost: '15.000 - 30.000 VNĐ', category: 'Cà phê & Đồ uống' },
      { dish: 'Gà nướng cơm lam ống tre', places: 'Quán Khương Duy (ngã 3 Măng Line), Gà nướng Tam Nguyên', cost: '250.000 - 380.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Bánh ướt lòng gà gia truyền', places: 'Quán Trang (15F Tăng Bạt Hổ), Quán Long (Hẻm 202 Phan Đình Phùng)', cost: '35.000 - 55.000 VNĐ', category: 'Món chính' },
      { dish: 'Cà phê ngắm hoàng hôn & Acoustic thung lũng', places: 'Tiệm Cà phê Túi Mơ To, Lululola Coffee, Cheo Veooo', cost: '50.000 - 90.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Hotel Colline Da Lat (4 sao trung tâm)', priceRange: '1.200.000 - 2.200.000 VNĐ / đêm', area: 'Số 10 Phan Bội Châu, ngay cạnh Chợ Đà Lạt', highlights: 'Kiến trúc gạch nung độc đáo, ngay cầu thang check-in sống ảo triệu view, đi bộ chợ đêm 1 phút', type: 'Khách sạn cao cấp' },
      { name: 'Terracotta Hotel & Resort Dalat', priceRange: '1.500.000 - 2.800.000 VNĐ / đêm', area: 'Bán đảo ven Hồ Tuyền Lâm', highlights: 'Rừng thông bao bọc thơ mộng, hồ bơi nước ấm trong nhà, không khí trong lành tuyệt đối', type: 'Resort 5 sao' },
      { name: 'Golf Valley Hotel Da Lat (4 sao)', priceRange: '900.000 - 1.600.000 VNĐ / đêm', area: 'Đường Bùi Thị Xuân, gần Hồ Xuân Hương', highlights: 'Thiết kế lượn sóng hiện đại, phòng ốc tiện nghi rộng rãi, dịch vụ buffet sáng ngon miệng', type: 'Khách sạn' },
      { name: 'Nhà Bên Rừng Homestay Đà Lạt', priceRange: '400.000 - 700.000 VNĐ / đêm', area: 'Dốc sườn đồi Hoàng Hoa Thám', highlights: 'Nhà gỗ mộc mạc view thung lũng đèn lồng, vườn hoa cẩm tú cầu trước hiên nhà', type: 'Homestay' },
      { name: 'The Kupid Hill Homestay & Cafe', priceRange: '450.000 - 800.000 VNĐ / đêm', area: 'Đồi Đặng Thái Thân', highlights: 'Phòng kính lớn view rừng thông bạt ngàn, không gian yên bình cho người yêu sự tĩnh lặng', type: 'Homestay' },
      { name: 'Ladalat Hotel (5 sao ngắm Thung lũng Tình Yêu)', priceRange: '1.400.000 - 2.600.000 VNĐ / đêm', area: 'Đường Mai Anh Đào', highlights: 'Kiến trúc bán cổ điển Châu Âu, sân thượng view toàn cảnh thung lũng đèn đêm', type: 'Khách sạn cao cấp' },
      { name: 'Ana Mandara Villas Dalat Resort & Spa (5 sao)', priceRange: '2.800.000 - 5.200.000 VNĐ / đêm', area: 'Đường Lê Lai, đồi thông cổ thụ', highlights: 'Quần thể biệt thự cổ thời Pháp thuộc với lò sưởi ấm cúng và sân vườn cổ kính', type: 'Resort 5 sao' },
      { name: 'Dalat Family Hostel', priceRange: '150.000 - 280.000 VNĐ / đêm', area: 'Hẻm Đào Duy Từ', highlights: 'Gia đình chủ nấu bữa tối miễn phí cho khách, không khí đầm ấm, giá siêu rẻ', type: 'Hostel' }
    ],
    tips: [
      'Nhiệt độ Đà Lạt chênh lệch ngày và đêm lớn, hãy mang theo áo khoác ấm, khăn choàng.',
      'Săn mây Cầu Đất nên dậy sớm xuất phát từ trung tâm lúc 4h30 - 5h00 sáng.',
      'Đường đèo dốc nhiều quanh co, chú ý lái xe an toàn và kiểm tra phanh xe máy kỹ lưỡng.'
    ]
  },
  'hà nội': {
    title: 'Hành trình 36 Phố phường & Di sản Ngàn năm Văn hiến',
    areaStay: 'Khu Phố Cổ Hoàn Kiếm, Tây Hồ hoặc Ba Đình',
    places: [
      { morning: 'Dạo quanh Hồ Hoàn Kiếm, Đền Ngọc Sơn & Tháp Bút', afternoon: 'Viếng Văn Miếu - Quốc Tử Giám & Hoàng thành Thăng Long', evening: 'Khám phá ẩm thực Phố cổ & Bia hơi Tạ Hiện sôi động' },
      { morning: 'Viếng Lăng Bác, Chùa Một Cột & Nhà sàn Bác Hồ', afternoon: 'Ngắm hoàng hôn Hồ Tây, Chùa Trấn Quốc & Kem Hồ Tây', evening: 'Xem múa rối nước Thăng Long hoặc dạo chợ đêm phố cổ Đồng Xuân' },
      { morning: 'Bảo tàng Lịch sử Quân sự Việt Nam & Cột Cờ Hà Nội', afternoon: 'Dạo đường Phan Đình Phùng lá bay & Cầu Long Biên lịch sử', evening: 'Thưởng thức chả cá Lã Vọng & Cà phê Trứng Giảng' }
    ],
    foods: [
      { dish: 'Phở bò truyền thống Hà Nội', places: 'Phở Bát Đàn (49 Bát Đàn), Phở Thìn (13 Lò Đúc), Phở Lý Quốc Sư', cost: '55.000 - 90.000 VNĐ', category: 'Món nước' },
      { dish: 'Bún chả nướng than hoa', places: 'Bún chả Đắc Kim (số 1 Hàng Mành), Bún chả Hương Liên (Obama - 24 Lê Văn Hưu)', cost: '50.000 - 75.000 VNĐ', category: 'Món chính' },
      { dish: 'Chả cá Lã Vọng thơm thì là', places: 'Chả cá Thăng Long (6B Đường Thành), Chả cá Lão Ngư (171 Thái Hà)', cost: '150.000 - 220.000 VNĐ / phần', category: 'Món chính' },
      { dish: 'Cà phê Trứng truyền thống', places: 'Cà phê Giảng (39 Nguyễn Hữu Huân), Cà phê Đinh (13 Đinh Tiên Hoàng)', cost: '35.000 - 55.000 VNĐ', category: 'Cà phê & Đồ uống' },
      { dish: 'Bún đậu mắm tôm thập cẩm', places: 'Bún đậu Hàng Khay (ngõ 31 Hàng Khay), Bún đậu Trung Hương (ngõ Phất Lộc)', cost: '45.000 - 70.000 VNĐ', category: 'Món chính' },
      { dish: 'Bún thang Hà thành thanh tao', places: 'Bún thang Bà Đức (48 Cầu Gỗ), Bún thang Thuận Lý (33 Hàng Hòm)', cost: '45.000 - 65.000 VNĐ', category: 'Món nước' },
      { dish: 'Bánh cuốn Thanh Trì nóng hổi', places: 'Bánh cuốn Bà Hoành (66 Tô Hiến Thành), Bánh cuốn Gia An', cost: '35.000 - 55.000 VNĐ', category: 'Món chính' },
      { dish: 'Nộm bò khô & Bánh bột lọc', places: 'Nộm bò khô Long Vi Dung (23 Hồ Hoàn Kiếm), Nộm Mai Nga (Hàm Long)', cost: '35.000 - 50.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Kem Tràng Tiền & Kem hồ Tây', places: 'Kem Tràng Tiền (35 Tràng Tiền), Kem hồ Tây đường Thanh Niên', cost: '15.000 - 30.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Cốm Làng Vòng & Xôi cốm hạt sen', places: 'Làng Cốm Vòng (Dịch Vọng Hậu), Quán xôi cô Mây Hàng Bài', cost: '30.000 - 60.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Chè sen long nhãn thanh mát', places: 'Chè 4 Mùa Hàng Cân, Chè Mười Sáu (16 Ngô Thì Nhậm)', cost: '25.000 - 40.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Phở cuốn & Phở chiên phồng Ngũ Xã', places: 'Phở cuốn Hương Mai (25 Ngũ Xã), Hưng Bền (33 Ngũ Xã)', cost: '60.000 - 90.000 VNĐ', category: 'Món chính' }
    ],
    hotels: [
      { name: 'Peridot Grand Luxury Hotel (5 sao Phố Cổ)', priceRange: '2.200.000 - 4.500.000 VNĐ / đêm', area: '33 Đường Thành, Hoàn Kiếm', highlights: 'Hồ bơi vô cực ngắm trọn mái ngói phố cổ, nhà hàng fine dining sang trọng, spa chuẩn 5 sao', type: 'Khách sạn cao cấp' },
      { name: 'The Chi Boutique Hotel (4 sao)', priceRange: '1.100.000 - 1.900.000 VNĐ / đêm', area: '13-15 Nhà Chung, sát Nhà Thờ Lớn', highlights: 'Chỉ 20 bước chân tới Nhà Thờ Lớn Hà Nội, thiết kế mang đậm phong cách Pháp Á Đông', type: 'Khách sạn' },
      { name: 'Acoustic Hotel & Spa (4 sao)', priceRange: '800.000 - 1.400.000 VNĐ / đêm', area: '39 Thợ Nhuộm, Hoàn Kiếm', highlights: 'Gần hồ Hoàn Kiếm và ga Hà Nội, phòng ốc êm ái, rooftop bar ngắm hoàng hôn cực chill', type: 'Khách sạn' },
      { name: 'The Westlake Residence Căn hộ Tây Hồ', priceRange: '650.000 - 1.100.000 VNĐ / đêm', area: 'Quảng An, ven Hồ Tây', highlights: 'Không gian yên bình thoáng mát, view hồ Tây lãng mạn, xung quanh nhiều quán cafe nghệ thuật', type: 'Căn hộ' },
      { name: 'Apricot Hotel Ha Noi (5 sao mặt Hồ Gươm)', priceRange: '2.800.000 - 5.500.000 VNĐ / đêm', area: '136 Hàng Trống, bờ Hồ Hoàn Kiếm', highlights: 'Tọa lạc tại vị trí kim cương ven Hồ Gươm, trưng bày các tác phẩm nghệ thuật đắt giá', type: 'Khách sạn cao cấp' },
      { name: 'Hanoi La Siesta Classic Ma May', priceRange: '1.400.000 - 2.500.000 VNĐ / đêm', area: '94 Mã Mây, Hàng Buồm', highlights: 'Phong cách cổ điển phố cổ, dịch vụ chuẩn quốc tế, nhà hàng Red Bean nổi tiếng', type: 'Khách sạn' },
      { name: 'Old Quarter Homestay Hà Nội', priceRange: '350.000 - 600.000 VNĐ / đêm', area: 'Ngõ Hàng Bạc, Hoàn Kiếm', highlights: 'Nằm trong con ngõ cổ sâu hút đậm chất Hà thành, ban công ngắm phố phường', type: 'Homestay' },
      { name: 'Hanoi Central Backpackers Hostel', priceRange: '200.000 - 450.000 VNĐ / đêm', area: 'Ngõ Huyện, Hàng Trống', highlights: 'Giá siêu tiết kiệm, không khí giao lưu quốc tế sôi nổi, rất sạch sẽ và thân thiện', type: 'Hostel' }
    ],
    tips: [
      'Phố đi bộ Hồ Gươm hoạt động từ tối Thứ 6 đến hết Chủ Nhật hàng tuần.',
      'Viếng Lăng Bác cần mặc trang phục lịch sự, trang nghiêm (quần dài, áo có tay).',
      'Thử một ly Cà phê Trứng Giảng buổi sáng để cảm nhận hương vị đặc trưng nhất của Hà Nội.'
    ]
  },
  'hội an': {
    title: 'Hành trình Phố Hội Đèn lồng & Dấu ấn Thương cảng Cổ',
    areaStay: 'Phố cổ Hội An hoặc ven biển An Bàng',
    places: [
      { morning: 'Đi bộ dạo Chùa Cầu, Nhà cổ Tấn Ký & Hội quán Phúc Kiến', afternoon: 'Thưởng thức trà thảo mộc Mót & may đo áo dài lấy liền', evening: 'Đi thuyền thả hoa đăng trên sông Hoài, phố đèn lồng lung linh' },
      { morning: 'Đạp xe khám phá Làng rau Trà Quế & Làng gốm Thanh Hà', afternoon: 'Tắm biển An Bàng & thư giãn tại các quán beach bar', evening: 'Thưởng thức show diễn Ký Ức Hội An hoành tráng' },
      { morning: 'Check-in Rừng dừa Bảy Mẫu chèo thuyền thúng xoay vòng', afternoon: 'Khám phá Cù Lao Chàm lặn ngắm san hô', evening: 'Thưởng thức ẩm thực chợ đêm Hội An bờ sông Hoài' }
    ],
    foods: [
      { dish: 'Cao lầu Hội An sợi vàng dai', places: 'Cao lầu Thanh (26 Thái Phiên), Cao lầu Bá Lễ (49/3 Trần Hưng Đạo)', cost: '35.000 - 55.000 VNĐ', category: 'Món chính' },
      { dish: 'Bánh mì Phượng & Madam Khánh', places: 'Bánh mì Phượng (2B Phan Châu Trinh), Madam Khánh - The Banh Mi Queen (115 Trần Cao Vân)', cost: '25.000 - 40.000 VNĐ', category: 'Món chính' },
      { dish: 'Cơm gà Phố Hội đậm đà', places: 'Cơm gà Bà Buội (22 Phan Châu Trinh), Cơm gà Nga (8 Phan Châu Trinh)', cost: '45.000 - 70.000 VNĐ', category: 'Món chính' },
      { dish: 'Nước Mót thảo mộc thanh mát', places: 'Quán Mót Hội An (150 Trần Phú)', cost: '15.000 - 25.000 VNĐ', category: 'Cà phê & Đồ uống' },
      { dish: 'Bánh bao & Bánh vạc hoa hồng trắng', places: 'Nhà hàng Bông Hồng Trắng (533 Hai Bà Trưng)', cost: '70.000 - 100.000 VNĐ / đĩa', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Mì Quảng Phố Hội', places: 'Mì Quảng Ông Hai (6A Trương Minh Lượng), Mì Quảng Dì Hát', cost: '35.000 - 50.000 VNĐ', category: 'Món nước' },
      { dish: 'Bánh đập & Hến xào xúc bánh tráng', places: 'Quán Bến Tre (Cẩm Nam), Quán Bà Già (thôn 1 Cẩm Nam)', cost: '40.000 - 65.000 VNĐ', category: 'Món chính' },
      { dish: 'Chè bắp & Chè hạt sen sông Hoài', places: 'Gánh chè Cô Lệ, Phố ẩm thực bờ sông Hoài', cost: '15.000 - 25.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Hải sản tươi sống bãi biển An Bàng', places: 'Nhà hàng Năm Giã, The DeckHouse An Bang Beach', cost: '200.000 - 450.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Hoành thánh chiên giòn sốt chua ngọt', places: 'Quán Vạn Lộc (27 Trần Phú), Quán Anh Dũng', cost: '60.000 - 90.000 VNĐ', category: 'Món chính' },
      { dish: 'Thịt xiên nướng cuốn bánh ướt', places: 'Các gánh hàng rong bờ sông Hoài, Chợ Hội An', cost: '30.000 - 50.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Cà phê muối & Cà phê Faifo ngắm mái ngói', places: 'Faifo Coffee (130 Trần Phú), Roastery Coffee', cost: '45.000 - 75.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'La Siesta Hoi An Resort & Spa (5 sao)', priceRange: '1.800.000 - 3.400.000 VNĐ / đêm', area: 'Đường Hùng Vương, gần phố cổ', highlights: 'Hồ bơi nước mặn và hồ bơi vô cực hướng cánh đồng lúa, dịch vụ xe buýt miễn phí ra phố cổ', type: 'Resort 5 sao' },
      { name: 'Allegro Hoi An Little Luxury Hotel (5 sao)', priceRange: '1.300.000 - 2.500.000 VNĐ / đêm', area: '86 Trần Hưng Đạo', highlights: 'Chỉ cách chợ đêm và phố đèn lồng 400m, phòng ốc phong cách hoàng gia trang nhã', type: 'Khách sạn cao cấp' },
      { name: 'Vinh Hung Riverside Resort & Spa (4 sao)', priceRange: '900.000 - 1.600.000 VNĐ / đêm', area: 'Bờ sông Hoài, An Hội', highlights: 'Khuôn viên nhà vườn rợp bóng dừa sát bờ sông Hoài, chợ quê ẩm thực miễn phí mỗi chiều', type: 'Resort 5 sao' },
      { name: 'An Bang Beach Hideaway Homestay', priceRange: '550.000 - 950.000 VNĐ / đêm', area: 'Làng chài biển An Bàng', highlights: 'Cách bãi cát biển An Bàng 50m, phong cách mộc mạc làng chài miền Trung', type: 'Homestay' },
      { name: 'Heron House Hoi An (Biệt thự đồng quê)', priceRange: '1.100.000 - 1.800.000 VNĐ / đêm', area: 'Cẩm Châu, giữa đồng lúa', highlights: 'Phòng rộng thênh thang bao quanh bởi đồng lúa xanh ngắt, hồ bơi riêng tư lãng mạn', type: 'Căn hộ' },
      { name: 'Maison Vy Hotel Hoi An (Boutique cổ điển)', priceRange: '800.000 - 1.300.000 VNĐ / đêm', area: 'Đường Nga Năm, Cẩm Châu', highlights: 'Trang trí phong cách vintage cổ điển, tặng trà chiều và đồ ăn nhẹ miễn phí hàng ngày', type: 'Khách sạn' },
      { name: 'Four Seasons Resort The Nam Hai', priceRange: '12.000.000 - 25.000.000 VNĐ / đêm', area: 'Bãi biển Hà My', highlights: 'Resort nghỉ dưỡng xa xỉ hàng đầu thế giới với các villa hồ bơi riêng biệt lập', type: 'Resort 5 sao' },
      { name: 'The Hoi An Hippie House Homestay', priceRange: '250.000 - 450.000 VNĐ / đêm', area: 'Biển An Bàng', highlights: 'Màu sắc sặc sỡ, phong cách tự do phóng khoáng, thích hợp cho các bạn trẻ thích chill', type: 'Hostel' }
    ],
    tips: [
      'Hội An đẹp nhất vào sáng sớm vắng người và buổi chiều tối khi lên đèn.',
      'Mượn xe đạp đi dạo quanh các con ngõ nhỏ và cánh đồng lúa Cẩm Châu là trải nghiệm tuyệt vời.',
      'Nên đặt vé xem show "Ký Ức Hội An" trước vì các suất cuối tuần thường hết chỗ sớm.'
    ]
  },
  'phú quốc': {
    title: 'Hành trình Nghỉ dưỡng Thiên đường Đảo ngọc Phú Quốc',
    areaStay: 'Bãi Trường, Dương Đông hoặc Grand World Bắc Đảo',
    places: [
      { morning: 'Check-in Grand World, Thuyền Gondola kênh đào Venice thơ mộng', afternoon: 'Khám phá Safari công viên bán hoang dã lớn nhất VN', evening: 'Thưởng thức show Sắc màu Venice & Chợ đêm Phú Quốc' },
      { morning: 'Tour cano 4 đảo & Lặn ngắm san hô Hòn Mây Rút, Hòn Móng Tay', afternoon: 'Đi cáp treo Hòn Thơm vượt biển dài nhất thế giới', evening: 'Ngắm hoàng hôn Sunset Sanato & Hải sản Làng chài Hàm Ninh' },
      { morning: 'Tắm biển Bãi Sao - bờ cát trắng mịn như kem', afternoon: 'Thăm Nhà tù Phú Quốc, Nhà thùng nước mắm truyền thống Phụng Hưng', evening: 'Thư giãn thưởng thức cocktail ngắm biển đêm lãng mạn' }
    ],
    foods: [
      { dish: 'Gỏi cá trích cuốn bánh tráng rau rừng', places: 'Quán Việt Phú Quốc (261 Nguyễn Trung Trực), Nhà hàng Sông Xanh', cost: '130.000 - 200.000 VNĐ', category: 'Món chính' },
      { dish: 'Bún quậy Kiến Xây tự pha nước chấm', places: 'Bún quậy Kiến Xây (28 Bạch Đằng), Bún quậy Thanh Hùng', cost: '50.000 - 80.000 VNĐ', category: 'Món nước' },
      { dish: 'Ghẹ Hàm Ninh hấp chấm muối tiêu chanh', places: 'Làng chài Hàm Ninh (Nhà bè Bé Ghẹ, Hạnh Nhung)', cost: '300.000 - 550.000 VNĐ / kg', category: 'Hải sản & Đồ nướng' },
      { dish: 'Nhum biển (Cầu gai) nướng mỡ hành trứng cút', places: 'Quán Ra Khơi (131 đường 30/4), Chợ đêm Phú Quốc', cost: '30.000 - 50.000 VNĐ / con', category: 'Hải sản & Đồ nướng' },
      { dish: 'Còi biên mai nướng muối ớt sa tế', places: 'Nhà hàng Bãi Sao, Quán Ốc 343 đường 30/4', cost: '120.000 - 180.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Canh nấm tràm hải sản bổ dưỡng', places: 'Nhà hàng Xin Chào (66 Trần Hưng Đạo)', cost: '140.000 - 220.000 VNĐ', category: 'Món chính' },
      { dish: 'Bún kèn Phú Quốc đậm đà cốt dừa', places: 'Bún kèn Út Lượm (87 đường 30/4)', cost: '30.000 - 45.000 VNĐ', category: 'Món nước' },
      { dish: 'Bánh khéo Phú Quốc đủ vị dừa, khoai môn', places: 'Lò bánh khéo Cô Dung (43 đường 30/4), Thu Hiền', cost: '60.000 - 100.000 VNĐ / hộp', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Mực trứng nướng sa tế thơm lừng', places: 'Quán Biển Xanh (Cầu Cảng Quốc Tế)', cost: '150.000 - 220.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Rượu sim rừng Phú Quốc nguyên chất', places: 'Cơ sở sản xuất Sim Sơn, Rượu sim Bảy Gáo', cost: '150.000 - 250.000 VNĐ / chai', category: 'Cà phê & Đồ uống' },
      { dish: 'Kem dừa thốt nốt & Đậu phộng Chou Chou', places: 'Chợ đêm Phú Quốc', cost: '35.000 - 60.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Cocktail ngắm hoàng hôn bãi biển', places: 'Sunset Sanato Beach Club, OCSEN Beach Bar & Club', cost: '90.000 - 160.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Novotel Phu Quoc Resort (5 sao Bãi Trường)', priceRange: '1.800.000 - 3.800.000 VNĐ / đêm', area: 'Khu du lịch Bãi Trường, Dương Tơ', highlights: 'Sát bờ biển hoàng hôn Bãi Trường, 2 hồ bơi lớn ngoài trời, khu vui chơi trẻ em và spa', type: 'Resort 5 sao' },
      { name: 'Seashells Phu Quoc Hotel & Spa (5 sao)', priceRange: '1.500.000 - 2.900.000 VNĐ / đêm', area: '1 Võ Thị Sáu, ngay trung tâm Dương Đông', highlights: 'Thiết kế hình con thuyền hướng biển, hồ bơi vô cực ngắm hoàng hôn, đi bộ chợ đêm 3 phút', type: 'Khách sạn cao cấp' },
      { name: 'Sunset Sanato Resort & Villas', priceRange: '1.400.000 - 2.600.000 VNĐ / đêm', area: 'Bắc Bãi Trường', highlights: 'Sở hữu tọa độ check-in đàn voi chân dài ngắm hoàng hôn đẹp nhất đảo ngọc', type: 'Resort 5 sao' },
      { name: 'Lahana Resort Phu Quoc sinh thái (4 sao)', priceRange: '950.000 - 1.700.000 VNĐ / đêm', area: 'Đồi Trần Hưng Đạo, Dương Đông', highlights: 'Tựa lưng vào sườn đồi xanh ngắt, hồ bơi tràn bờ view ôm trọn biển cả', type: 'Resort 5 sao' },
      { name: 'The May Garden Homestay Phú Quốc', priceRange: '450.000 - 750.000 VNĐ / đêm', area: 'Đường Suối Mây, Dương Tơ', highlights: 'Homestay phong cách gạch thô và kính hiện đại giữa vườn nhiệt đới, cực kỳ ấm cúng', type: 'Homestay' },
      { name: 'M Village Hotel Phu Quoc (Trung tâm)', priceRange: '600.000 - 1.100.000 VNĐ / đêm', area: 'Trần Hưng Đạo, Dương Đông', highlights: 'Thương hiệu căn hộ - khách sạn trẻ trung, hồ bơi xanh mát, tiện di chuyển ăn uống', type: 'Khách sạn' },
      { name: 'JW Marriott Phu Quoc Emerald Bay Resort', priceRange: '6.500.000 - 16.000.000 VNĐ / đêm', area: 'Bãi Khem, An Thới', highlights: 'Resort phong cách trường đại học thần thoại Lamarck, bãi cát trắng mịn Bãi Khem', type: 'Resort 5 sao' },
      { name: 'Phu Quoc 9 Station Hostel', priceRange: '180.000 - 350.000 VNĐ / đêm', area: '91/3 Trần Hưng Đạo', highlights: 'Hostel có hồ bơi lớn ngoài trời, quầy bar sôi động, phù hợp các bạn trẻ mê kết bạn', type: 'Hostel' }
    ],
    tips: [
      'Nên đặt tour 4 đảo cano kèm chụp ảnh flycam để có bộ ảnh sống ảo lung linh.',
      'Bún quậy Kiến Xây bạn sẽ được tự tay pha nước chấm theo khẩu vị riêng.',
      'Hoàng hôn Phú Quốc đẹp nhất trong khoảng 17h15 đến 17h50, hãy đến các beach bar từ 16h45.'
    ]
  },
  'sa pa': {
    title: 'Hành trình Chinh phục Nóc nhà Đông Dương & Bản làng Sa Pa',
    areaStay: 'Trung tâm thị trấn Sa Pa hoặc Homestay Bản Tả Van / Mường Hoa',
    places: [
      { morning: 'Chinh phục Đỉnh Fansipan bằng cáp treo & Tàu hỏa leo núi Mường Hoa', afternoon: 'Dạo Nhà thờ Đá & Hồ Sa Pa thơ mộng', evening: 'Thưởng thức Lẩu cá hồi, cá tầm & Đồ nướng Sa Pa' },
      { morning: 'Đi bộ khám phá Bản Cát Cát xinh đẹp', afternoon: 'Check-in Đèo Ô Quy Hồ & Cổng trời ngắm hoàng hôn biển mây', evening: 'Ngâm chân lá thuốc người Dao đỏ thư giãn hồi phục năng lượng' },
      { morning: 'Thung lũng Mường Hoa & Bản Tả Van ngắm ruộng bậc thang', afternoon: 'Thác Bạc & Thác Tình Yêu giữa đại ngàn Hoàng Liên Sơn', evening: 'Uống cacao nóng ngắm phố núi trong sương mờ ảo' }
    ],
    foods: [
      { dish: 'Lẩu cá hồi & Cá tầm Sa Pa tươi sống', places: 'Nhà hàng A Phủ (15 Fansipan), Cá Hồi Vua Sa Pa (Lê Văn Tám)', cost: '350.000 - 600.000 VNĐ / nồi', category: 'Món chính' },
      { dish: 'Thắng cố truyền thống vùng cao', places: 'Quán A Quỳnh (15 Thạch Sơn), Nhà hàng Khám Phá Việt', cost: '150.000 - 250.000 VNĐ / nồi', category: 'Món chính' },
      { dish: 'Thịt lợn cắp nách nướng than hoa', places: 'Nhà hàng Đỗ Quyên (đỉnh đèo Fansipan), Phố nướng Cầu Mây', cost: '120.000 - 200.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Đồ nướng than hồng Sa Pa', places: 'Phố nướng Cầu Mây, Chợ đêm Sa Pa (trứng gà nướng, ngô khoai, thịt cuốn cải mèo)', cost: '80.000 - 150.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Gà đen H\'Mông nướng mật ong rừng', places: 'Nhà hàng Hoa Đồng Tiền (29 Cầu Mây), Quán Chợ Quê', cost: '250.000 - 380.000 VNĐ / con', category: 'Hải sản & Đồ nướng' },
      { dish: 'Cơm lam nướng thơm chấm muối vừng', places: 'Các sạp nướng chợ Sa Pa, Bản Cát Cát', cost: '20.000 - 35.000 VNĐ / ống', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Rau cải mèo xào thịt bò gác bếp', places: 'Nhà hàng Red Dao (4B Thác Bạc)', cost: '100.000 - 160.000 VNĐ', category: 'Món chính' },
      { dish: 'Hạt dẻ Sa Pa rang bơ thơm phức', places: 'Dọc phố Thạch Sơn, Chợ đêm', cost: '60.000 - 100.000 VNĐ / kg', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Xôi ngũ sắc Tây Bắc dẻo thơm', places: 'Chợ phiên Sa Pa, Nhà hàng Dân Tộc Quán', cost: '30.000 - 50.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bánh hạt dẻ nướng nóng giòn', places: 'Khu vực Chợ Sa Pa, Đền Mẫu', cost: '50.000 - 80.000 VNĐ / hộp 10 chiếc', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Thịt trâu gác bếp xé chấm chẩm chéo', places: 'A Phủ Quán, Chợ phiên Sa Pa', cost: '200.000 - 350.000 VNĐ', category: 'Món chính' },
      { dish: 'Trà táo mèo & Cacao nóng ngắm mây', places: 'Viettrekking Coffee, Fansipan Terrace Cafe', cost: '40.000 - 70.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Hotel de la Coupole - MGallery (5 sao biểu tượng)', priceRange: '2.600.000 - 5.500.000 VNĐ / đêm', area: 'Số 1 Hoàng Liên, trung tâm Sa Pa', highlights: 'Tuyệt tác kiến trúc của Bill Bensley, ga tàu hỏa leo núi Mường Hoa ngay trong sảnh khách sạn', type: 'Khách sạn cao cấp' },
      { name: 'Silk Path Grand Resort & Spa Sapa (5 sao)', priceRange: '1.900.000 - 3.800.000 VNĐ / đêm', area: 'Đồi Quan 6, phường Sa Pả', highlights: 'Khu resort tựa như lâu đài Châu Âu ngập tràn vườn hồng cổ, view dãy Hoàng Liên Sơn hùng vĩ', type: 'Resort 5 sao' },
      { name: 'Pao\'s Sapa Leisure Hotel (5 sao)', priceRange: '1.200.000 - 2.400.000 VNĐ / đêm', area: 'Đường Mường Hoa', highlights: 'Thiết kế uốn lượn theo ruộng bậc thang, view bao quát thung lũng Mường Hoa huyền ảo', type: 'Khách sạn cao cấp' },
      { name: 'Viettrekking Sapa (Khách sạn & Cafe biển mây)', priceRange: '800.000 - 1.500.000 VNĐ / đêm', area: 'Số 33 Hoàng Liên', highlights: 'Tọa độ săn biển mây số 1 Sa Pa, đoàn tàu đỏ hỏa xa chạy ngang qua khung cửa sổ thơ mộng', type: 'Khách sạn' },
      { name: 'Eco Palms House Bản Lao Chải', priceRange: '900.000 - 1.600.000 VNĐ / đêm', area: 'Bản Lao Chải, Thung lũng Mường Hoa', highlights: 'Bungalow mái cọ nhà sàn gỗ nằm giữa ruộng bậc thang, hòa mình trọn vẹn vào thiên nhiên', type: 'Homestay' },
      { name: 'Mega View Homestay Sa Pa', priceRange: '350.000 - 650.000 VNĐ / đêm', area: 'Ngõ Cầu Mây, trung tâm', highlights: 'Giá cực kỳ hợp lý, phòng sạch sẽ ban công view núi Fansipan, chủ nhà thân thiện chu đáo', type: 'Homestay' },
      { name: 'Topas Ecolodge (Resort sinh thái đỉnh núi)', priceRange: '4.800.000 - 9.500.000 VNĐ / đêm', area: 'Thôn Bản Lếch, xã Thanh Bình', highlights: 'Hồ bơi vô cực nước nóng giữa lưng chừng mây, từng lọt top khu nghỉ dưỡng đẹp nhất thế giới', type: 'Resort 5 sao' },
      { name: 'Sapa Capsule Hotel', priceRange: '200.000 - 350.000 VNĐ / đêm', area: 'Sở Than, Sa Pa', highlights: 'Khách sạn buồng kén phi thuyền không gian độc lạ, giá tiết kiệm cho bạn trẻ đi một mình', type: 'Hostel' }
    ],
    tips: [
      'Đỉnh Fansipan nhiệt độ rất lạnh (có thể dưới 10 độ C), bắt buộc mang áo ấm dày và găng tay.',
      'Đi trekking Bản Cát Cát hay Tả Van nên chuẩn bị giày thể thao êm chân chống trơn trượt.',
      'Buổi tối nhất định nên thử dịch vụ tắm ngâm lá thuốc người Dao đỏ để phục hồi cơ thể.'
    ]
  },
  'nha trang': {
    title: 'Hành trình Biển xanh Cát trắng & Vịnh ngọc Nha Trang',
    areaStay: 'Đường Trần Phú sát biển, Phạm Văn Đồng hoặc Hòn Tre',
    places: [
      { morning: 'Tour cano 3 đảo Hòn Mun - Hòn Tằm - Làng Chài tắm bùn khoáng', afternoon: 'Khám phá Tháp Bà Ponagar & Viện Hải dương học', evening: 'Dạo phố đêm chợ Đầm, thưởng thức nem nướng Ninh Hòa' },
      { morning: 'Khu vui chơi VinWonders Hòn Tre đi cáp treo vượt biển', afternoon: 'Xem show Tata Show triệu đô tại VinWonders', evening: 'Thưởng thức tiệc hải sản tươi sống tại Bờ kè Tháp Bà' },
      { morning: 'Tắm biển Bãi Dài Cam Ranh nước trong vắt', afternoon: 'Viếng Chùa Long Sơn chiêm bái Kim Thân Phật Tổ', evening: 'Thư giãn thưởng thức cocktail tại Skylight 360 Rooftop Bar' }
    ],
    foods: [
      { dish: 'Nem nướng Ninh Hòa giòn rụm chấm nước sốt tương nếp', places: 'Quán Đặng Văn Quyên (16A Lãn Ông), Nem nướng Vũ Thành An (15 Lê Lợi)', cost: '50.000 - 75.000 VNĐ', category: 'Món chính' },
      { dish: 'Bún chả cá & Bún sứa Nha Trang thanh ngọt', places: 'Bún cá Cô Ba (123 Yersin), Bún sứa Năm Beo (B2 chung cư Chợ Đầm)', cost: '35.000 - 55.000 VNĐ', category: 'Món nước' },
      { dish: 'Hải sản bờ kè Tháp Bà tươi sống giá bình dân', places: 'Quán hải sản Thanh Sương (9A Trần Phú), Hải sản Tám Mẹo (40 Trần Phú)', cost: '250.000 - 500.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Bánh căn mực & Bánh căn trứng lòng đào', places: 'Bánh căn số 51 Tô Hiến Thành, Bánh căn Út Loan (127 Huỳnh Thúc Kháng)', cost: '40.000 - 70.000 VNĐ', category: 'Món chính' },
      { dish: 'Bò nướng Lạc Cảnh ướp mật ong gia truyền', places: 'Nhà hàng Lạc Cảnh (44 Nguyễn Bỉnh Khiêm)', cost: '150.000 - 250.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Bánh xèo mực chảo giòn tan', places: 'Bánh xèo Cô Tôn (đường Tháp Bà), Bánh xèo Chảo 85 Tô Hiến Thành', cost: '35.000 - 60.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Gỏi cá mai Nha Trang chấm nước chấm đậu phộng', places: 'Quán Cô Hằng (133 Hồ Tùng Mậu)', cost: '80.000 - 130.000 VNĐ', category: 'Món chính' },
      { dish: 'Tôm hùm Bình Ba nướng phô mai', places: 'Hải sản Làng Chài ven biển', cost: '400.000 - 800.000 VNĐ / con', category: 'Hải sản & Đồ nướng' },
      { dish: 'Chè trái cây & Sinh tố bơ dầm sầu riêng', places: 'Quán sinh tố số 24 Quang Trung', cost: '25.000 - 45.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Cơm gà Nha Trang sốt bơ trứng vàng ươm', places: 'Cơm gà Trâm Anh (10 Bà Triệu), Cơm gà Hà (75 Ngô Gia Tự)', cost: '45.000 - 65.000 VNĐ', category: 'Món chính' },
      { dish: 'Bánh tráng xoài Cam Ranh chua ngọt dẻo thơm', places: 'Chợ Đầm, Chợ Xóm Mới', cost: '30.000 - 50.000 VNĐ / bịch', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Cocktail ngắm toàn cảnh vịnh biển tại Skylight 360', places: 'Skylight Nha Trang (tầng 45 Khách sạn Havana, 38 Trần Phú)', cost: '90.000 - 180.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Vinpearl Resort & Spa Nha Trang Bay (5 sao Đảo Hòn Tre)', priceRange: '2.400.000 - 4.800.000 VNĐ / đêm', area: 'Đảo Hòn Tre', highlights: 'Khu nghỉ dưỡng đảo riêng biệt, bãi biển riêng thơ mộng, hồ bơi ngoài trời khổng lồ', type: 'Resort 5 sao' },
      { name: 'Sheraton Nha Trang Hotel & Spa (5 sao mặt biển)', priceRange: '1.800.000 - 3.500.000 VNĐ / đêm', area: '26-28 Trần Phú, Lộc Thọ', highlights: '100% các phòng đều có ban công hướng trọn vịnh Nha Trang, hồ bơi vô cực tầng 6', type: 'Khách sạn cao cấp' },
      { name: 'Liberty Central Nha Trang Hotel (4 sao)', priceRange: '850.000 - 1.500.000 VNĐ / đêm', area: '9 Biệt Thự, Lộc Thọ', highlights: 'Vị trí khu phố Tây nhộn nhịp, cách biển 150m, phòng ốc hiện đại, rooftop bar sôi động', type: 'Khách sạn' },
      { name: 'Amiana Resort Nha Trang (5 sao cao cấp)', priceRange: '3.200.000 - 6.500.000 VNĐ / đêm', area: 'Vịnh Nha Trang, Phạm Văn Đồng', highlights: 'Hồ bơi nước biển tự nhiên 2.500m2, dịch vụ tắm bùn khoáng nóng riêng tư tại resort', type: 'Resort 5 sao' },
      { name: 'Mojzo Inn Boutique Hotel Nha Trang', priceRange: '450.000 - 750.000 VNĐ / đêm', area: '120/36 Nguyễn Thiện Thuật', highlights: 'Đội ngũ nhân viên thân thiện bậc nhất, bữa sáng rooftop ngon miệng, dịch vụ chu đáo', type: 'Khách sạn' },
      { name: 'Ccasa Hostel Nha Trang (Kiến trúc container độc lạ)', priceRange: '160.000 - 350.000 VNĐ / đêm', area: '24 Sao Biển, Vĩnh Hải', highlights: 'Hostel thiết kế từ container tái chế kết hợp giàn dây leo xanh mát, góc sống ảo cực chất', type: 'Hostel' },
      { name: 'Panorama Nha Trang Condotel (Căn hộ view biển)', priceRange: '650.000 - 1.200.000 VNĐ / đêm', area: 'Số 2 Nguyễn Thị Minh Khai', highlights: 'Ngay sát Quảng trường 2/4 và tháp Trầm Hương, hồ bơi đáy kính vô cực trên nóc tòa nhà', type: 'Căn hộ' },
      { name: 'Livin Homestay Nha Trang', priceRange: '380.000 - 600.000 VNĐ / đêm', area: 'Đường Hùng Vương', highlights: 'Phong cách Scandinavian tối giản hiện đại, gần các quán cafe ngon và quán hải sản', type: 'Homestay' }
    ],
    tips: [
      'Đi tour đảo nên mang theo kem chống nắng, kính râm và túi chống nước cho điện thoại.',
      'Ăn hải sản nên chọn các quán niêm yết giá cân tươi sống rõ ràng như Thanh Sương hoặc Tám Mẹo.',
      'Tắm bùn khoáng Hòn Tằm hoặc Tháp Bà giúp da dẻ mịn màng và thư giãn gân cốt rất tốt.'
    ]
  },
  'huế': {
    title: 'Hành trình Cố đô Huế & Tinh hoa Văn hóa Triều Nguyễn',
    areaStay: 'Khu phố Tây đường Chu Văn An / Võ Thị Sáu hoặc bờ nam sông Hương',
    places: [
      { morning: 'Đại Nội Huế (Hoàng Thành & Tử Cấm Thành)', afternoon: 'Chùa Thiên Mụ & Du thuyền rồng nghe ca Huế trên sông Hương', evening: 'Dạo Cầu Trường Tiền lên đèn & thưởng thức chè hẻm 20 món' },
      { morning: 'Lăng Khải Định lộng lẫy & Lăng Tự Đức thơ mộng', afternoon: 'Làng hương Thủy Xuân rực rỡ sắc màu check-in áo dài', evening: 'Thưởng thức cơm hến Cồn Hến & Bánh bèo chén cung đình' },
      { morning: 'Đồi Vọng Cảnh ngắm khúc quanh sông Hương', afternoon: 'Khám phá Chợ Đông Ba mua mè xửng, nón bài thơ làm quà', evening: 'Bữa tối ẩm thực chay Huế thanh tịnh' }
    ],
    foods: [
      { dish: 'Bún bò Huế chuẩn vị mắm ruốc', places: 'Bún bò Mụ Rơi (40 Nguyễn Chí Diểu), Bún bò Bà Tuyết (47 Nguyễn Công Trứ)', cost: '35.000 - 55.000 VNĐ', category: 'Món nước' },
      { dish: 'Cơm hến & Bún hến Cồn Hến', places: 'Quán Hoa Đông (64 kiệt 7 Ưng Bình, Cồn Hến), Quán Đập Đá (01 Hàn Mặc Tử)', cost: '20.000 - 35.000 VNĐ', category: 'Món chính' },
      { dish: 'Bánh bèo, Bánh nậm, Bánh lọc Huế', places: 'Quán Hàng Me (12 Võ Thị Sáu), Quán Bà Đỏ (08 Nguyễn Bỉnh Khiêm)', cost: '40.000 - 70.000 VNĐ / khay', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Chè hẻm Huế 20 món & Chè bột lọc heo quay', places: 'Chè Hẻm (số 1 kiệt 29 Hùng Vương), Chè Cầm (10 Nguyễn Sinh Cung)', cost: '15.000 - 25.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bánh khoái giòn rụm chấm nước lèo gan nếp', places: 'Quán Lạc Thiện (06 Đinh Tiên Hoàng), Quán Hồng Mai', cost: '35.000 - 55.000 VNĐ', category: 'Món chính' },
      { dish: 'Bánh ép Huế kẹp chua ngọt', places: 'Bánh ép Cây Dừa (Bà Triệu), Bánh ép Dì Mai (Đối diện trường Quốc Học)', cost: '20.000 - 35.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Nem lụi nướng sả Cố đô', places: 'Quán Tài Phú (02 Điện Biên Phủ)', cost: '50.000 - 80.000 VNĐ', category: 'Món chính' },
      { dish: 'Cơm chay Huế thanh tao cung đình', places: 'Quán chay An Nhiên, Nhà hàng chay Liên Hoa (03 Lê Quý Đôn)', cost: '60.000 - 120.000 VNĐ', category: 'Món chính' },
      { dish: 'Mè xửng Thiên Hương dẻo ngọt làm quà', places: 'Cửa hàng Thiên Hương (20 Chi Lăng), Chợ Đông Ba', cost: '30.000 - 60.000 VNĐ / gói', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Trà cung đình Huế thảo mộc', places: 'Trà Cung Đình Đức Phượng (24 Nguyễn Huệ)', cost: '40.000 - 80.000 VNĐ / gói', category: 'Cà phê & Đồ uống' },
      { dish: 'Bánh canh Nam Phổ sền sệt gạch cua', places: 'Quán Thúy (16 Phạm Hồng Thái), Quán Dì Thu', cost: '25.000 - 40.000 VNĐ', category: 'Món nước' },
      { dish: 'Cà phê muối xứ Huế đậm đà', places: 'Cà phê Muối (10 Nguyễn Lương Bằng & 142 Đặng Thái Thân)', cost: '20.000 - 35.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Azerai La Residence Hue (5 sao lịch sử bên sông Hương)', priceRange: '3.500.000 - 7.500.000 VNĐ / đêm', area: 'Số 5 Lê Lợi, ven sông Hương', highlights: 'Biệt thự Art Deco thời Pháp thuộc từng là dinh thự Thống đốc, ngắm trọn Cột Cờ Kỳ Đài', type: 'Resort 5 sao' },
      { name: 'Silk Path Grand Hue Hotel (5 sao)', priceRange: '1.400.000 - 2.800.000 VNĐ / đêm', area: 'Số 2 Lê Lợi, gần ga Huế', highlights: 'Kiến trúc cung đình pha trộn phong cách quý tộc Pháp, hồ bơi ngoài trời sang trọng', type: 'Khách sạn cao cấp' },
      { name: 'Imperial Hotel Hue (5 sao Hoàng Gia)', priceRange: '1.200.000 - 2.200.000 VNĐ / đêm', area: 'Số 8 Hùng Vương, trung tâm', highlights: 'Trang trí họa tiết rồng phượng cung đình độc đáo, Sky Bar ngắm cầu Trường Tiền về đêm', type: 'Khách sạn cao cấp' },
      { name: 'Vinpearl Hotel Hue (5 sao Melia)', priceRange: '1.300.000 - 2.400.000 VNĐ / đêm', area: '50A Hùng Vương', highlights: 'Tòa tháp cao nhất Cố Đô, view panorama 360 độ ngắm trọn dòng Hương giang thơ mộng', type: 'Khách sạn cao cấp' },
      { name: 'Moonlight Hotel Hue (4 sao)', priceRange: '650.000 - 1.100.000 VNĐ / đêm', area: '20 Phạm Ngũ Lão, phố Tây', highlights: 'Vị trí phố đi bộ sầm uất ăn uống tiện lợi, hồ bơi trên cao, phòng sạch đẹp', type: 'Khách sạn' },
      { name: 'Hue Ecolodge (Resort sinh thái làng Thủy Biều)', priceRange: '900.000 - 1.600.000 VNĐ / đêm', area: 'Làng bưởi Thanh Trà Thủy Biều', highlights: 'Khu nhà vườn truyền thống lợp ngói liệt giữa vườn bưởi thanh trà thanh bình', type: 'Homestay' },
      { name: 'Shark Homestay Hue', priceRange: '300.000 - 500.000 VNĐ / đêm', area: 'Kiệt 28 Võ Thị Sáu', highlights: 'Chủ nhà cực kỳ dễ thương hướng dẫn các quán ăn địa phương siêu ngon giá rẻ', type: 'Homestay' },
      { name: 'Hue Central Hostel', priceRange: '140.000 - 250.000 VNĐ / đêm', area: 'Bến Nghé, trung tâm', highlights: 'Phòng dorm sạch, bữa sáng miễn phí, gần các điểm tham quan chính', type: 'Hostel' }
    ],
    tips: [
      'Thuê một bộ áo dài truyền thống hoặc cổ phục Nhật Bình để chụp ảnh ở Đại Nội và Làng hương Thủy Xuân.',
      'Sông Hương nghe Ca Huế lúc 19h00 hoặc 20h00, đừng quên thả một ngọn đèn hoa đăng cầu an.',
      'Cà phê muối xuất phát điểm chính gốc từ Huế, giá chỉ 20k-25k mà vị béo mặn thơm ngậy khó quên.'
    ]
  },
  'hạ long': {
    title: 'Hành trình Kỳ quan Thiên nhiên Thế giới Vịnh Hạ Long',
    areaStay: 'Bãi Cháy, Bán đảo Tuần Châu hoặc du thuyền ngủ đêm trên Vịnh',
    places: [
      { morning: 'Tour du thuyền Vịnh Hạ Long ngắm Động Thiên Cung & Hang Đầu Gỗ', afternoon: 'Chèo thuyền kayak qua Hang Luồn & Đảo Ti Tốp tắm biển', evening: 'Dạo Phố cổ Bãi Cháy & Chợ đêm Hạ Long thưởng thức sữa chua trân châu' },
      { morning: 'Tổ hợp Sun World Ha Long Complex & Cáp treo Nữ Hoàng vượt biển', afternoon: 'Vòng quay Mặt Trời Sun Wheel ngắm toàn cảnh Vịnh từ trên cao', evening: 'Thưởng thức hải sản tươi sống tại khu vực Bến Đoan hoặc Cái Dăm' },
      { morning: 'Bảo tàng Quảng Ninh kiến trúc khối than đen tuyệt đẹp', afternoon: 'Check-in Đỉnh núi Bài Thơ ngắm toàn cảnh thành phố biển', evening: 'Bữa tối lẩu hải sản ấm cúng chia tay Hạ Long' }
    ],
    foods: [
      { dish: 'Chả mực giã tay giòn sần sật', places: 'Chả mực Thoan (Kiot 36-37 chợ Hạ Long 1), Chả mực Quang Phong', cost: '380.000 - 520.000 VNĐ / kg', category: 'Món chính' },
      { dish: 'Bánh cuốn chả mực nóng hổi', places: 'Bánh cuốn Bà Ngân (34 Đoàn Thị Điểm), Bánh cuốn Gốc Bàng', cost: '40.000 - 65.000 VNĐ', category: 'Món chính' },
      { dish: 'Sữa chua trân châu Hạ Long trứ danh', places: 'Sữa chua trân châu Cô Nghi (10 Văn Lang), Cơ sở Cô Cương', cost: '25.000 - 45.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bún bề bề tươi ngọt đậm vị biển', places: 'Bún bề bề Khánh Mập (đường bao biển Cột 5), Quán Đông Đoan', cost: '45.000 - 70.000 VNĐ', category: 'Món nước' },
      { dish: 'Sam biển 7 món độc đáo', places: 'Quán Sam Quảng Yên, Sam Bà Tỵ (ngõ 6 Cao Thắng)', cost: '200.000 - 400.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Hải sản Cái Dăm & Bến Đoan', places: 'Nhà hàng Cua Vàng (32 Phan Chu Trinh), Hải sản Hồng Hạnh 3', cost: '300.000 - 600.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Cù kỳ hấp & Sốt me chua ngọt', places: 'Nhà hàng Phương Nam Bãi Cháy, Quán Hương Duyên', cost: '180.000 - 280.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Cháo ngán & Rượu ngán Hạ Long', places: 'Khu ẩm thực Chợ Hạ Long 1', cost: '50.000 - 80.000 VNĐ', category: 'Món nước' },
      { dish: 'Gà đồi Tiên Yên nướng mật ong', places: 'Các quán ăn Tiên Yên dọc Quốc lộ 18', cost: '220.000 - 320.000 VNĐ / con', category: 'Món chính' },
      { dish: 'Bánh gật gù chấm mỡ gà hành phi', places: 'Chợ đêm Hạ Long, Chợ ẩm thực Bãi Cháy', cost: '30.000 - 50.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Ruốc tôm Quảng Ninh bùi thơm', places: 'Cửa hàng đặc sản chợ Hạ Long 1', cost: '120.000 - 200.000 VNĐ / hộp', category: 'Món chính' },
      { dish: 'Cà phê Đồi Thông view Vịnh Hạ Long', places: '1900 Coffee House, Thông Ze-o Coffee Đồi Hải Quân', cost: '40.000 - 70.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Vinpearl Resort & Spa Ha Long (5 sao Đảo Rều biệt lập)', priceRange: '2.800.000 - 5.500.000 VNĐ / đêm', area: 'Đảo Rều, Bãi Cháy', highlights: 'Resort 4 mặt hướng biển độc nhất vô nhị, đi tàu cao tốc ra đảo riêng tư đẳng cấp', type: 'Resort 5 sao' },
      { name: 'Du thuyền Ambassador Cruise Hạ Long (5 sao ngủ đêm trên Vịnh)', priceRange: '3.600.000 - 7.200.000 VNĐ / đêm', area: 'Cảng tàu khách quốc tế Tuần Châu', highlights: 'Trải nghiệm du thuyền xa xỉ 6 sao, buffet tôm hùm, hồ bơi sục Jacuzzi trên boong tàu', type: 'Resort 5 sao' },
      { name: 'FLC Grand Hotel Halong (5 sao view đỉnh đồi)', priceRange: '1.600.000 - 3.200.000 VNĐ / đêm', area: 'Đoàn Kết, Hà Trung', highlights: 'Tọa lạc trên đỉnh đồi cao ngắm trọn toàn cảnh kỳ quan Vịnh Hạ Long, sân golf 18 hố', type: 'Khách sạn cao cấp' },
      { name: 'Muong Thanh Luxury Quang Ninh (5 sao Bãi Cháy)', priceRange: '1.100.000 - 2.100.000 VNĐ / đêm', area: 'Tổ 1, Khu 2, Bãi Cháy', highlights: 'Vị trí đối diện công viên Sun World, phòng ốc tiêu chuẩn quốc tế, hồ bơi rộng', type: 'Khách sạn cao cấp' },
      { name: 'Ha Long Boutique Hotel (3-4 sao)', priceRange: '650.000 - 1.100.000 VNĐ / đêm', area: 'Khu đô thị San Hô, Bãi Cháy', highlights: 'Gần phố đi bộ, phòng decor ấm cúng hiện đại, giá cả cực kỳ hợp lý', type: 'Khách sạn' },
      { name: 'The Bay - Ha Long Homestay', priceRange: '400.000 - 750.000 VNĐ / đêm', area: 'Ngõ 2 đường Suối Mơ, Bãi Cháy', highlights: 'Sân vườn xanh ngát hoa hồng, thiết kế trẻ trung tối giản, chủ nhà thân thiện', type: 'Homestay' },
      { name: 'Green Bay Condotel Ha Long (Căn hộ nghỉ dưỡng)', priceRange: '600.000 - 1.100.000 VNĐ / đêm', area: 'Đường Hoàng Quốc Việt, Hùng Thắng', highlights: 'Căn hộ 2 phòng ngủ có bếp đầy đủ, thích hợp nhóm bạn và gia đình đi đông người', type: 'Căn hộ' },
      { name: 'Halong Party Hostel', priceRange: '180.000 - 350.000 VNĐ / đêm', area: 'Khu phố cổ Little Vietnam, Bãi Cháy', highlights: 'Hostel phong cách trẻ trung năng động, gần biển và các tụ điểm giải trí về đêm', type: 'Hostel' }
    ],
    tips: [
      'Nên trải nghiệm ngủ đêm 1 đêm trên du thuyền Vịnh để đón bình minh giữa kỳ quan đá vôi hùng vĩ.',
      'Bảo tàng Quảng Ninh đóng cửa vào Thứ Hai hàng tuần, hãy sắp xếp lịch tham quan phù hợp.',
      'Mua chả mực Hạ Long làm quà nên chọn loại giã tay truyền thống tại chợ Hạ Long 1 để đảm bảo độ giòn.'
    ]
  },
  'ninh bình': {
    title: 'Hành trình Non nước Hữu tình & Di sản Kép Tràng An',
    areaStay: 'Quần thể Tam Cốc - Bích Động, Tràng An hoặc TP. Ninh Bình',
    places: [
      { morning: 'Đi thuyền khám phá Di sản Văn hóa & Thiên nhiên Thế giới Tràng An', afternoon: 'Leo 500 bậc đá Đỉnh Ngọa Long Hang Múa ngắm toàn cảnh Tam Cốc', evening: 'Dạo Phố cổ Hoa Lư lung linh về đêm bên Hồ Kỳ Lân' },
      { morning: 'Viếng Quần thể Chùa Bái Đính - ngôi chùa giữ nhiều kỷ lục nhất Châu Á', afternoon: 'Đi thuyền Tam Cốc lướt qua cánh đồng lúa chín vàng', evening: 'Thưởng thức đặc sản Cơm cháy & Thịt dê núi Ninh Bình' },
      { morning: 'Đầm sen Hang Múa & Đầm Vân Long - bối cảnh phim Kong: Skull Island', afternoon: 'Cố đô Hoa Lư viếng đền vua Đinh, vua Lê', evening: 'Thư giãn nghe tiếng ếch nhái đồng quê tại resort sinh thái' }
    ],
    foods: [
      { dish: 'Thịt dê núi nướng tảng & Dê tái chanh', places: 'Nhà hàng Dũng Phố Núi (Ninh Xuân), Nhà hàng Đức Dê (29 Đoàn Kết)', cost: '160.000 - 280.000 VNĐ', category: 'Món chính' },
      { dish: 'Cơm cháy chà bông chấm sốt tim cật dê', places: 'Nhà hàng Thăng Long (Tràng An), Cơm cháy Hoa Lư', cost: '80.000 - 140.000 VNĐ', category: 'Món chính' },
      { dish: 'Ốc núi Ninh Bình hấp sả gừng giòn sần sật', places: 'Quán ốc núi Tam Điệp, Nhà hàng Ba Cửa', cost: '90.000 - 150.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Miến lươn bà Phấn gia truyền nước dùng đậm', places: 'Quán Miến lươn Bà Phấn (999 Trần Hưng Đạo, TP Ninh Bình)', cost: '40.000 - 65.000 VNĐ', category: 'Món nước' },
      { dish: 'Gỏi cá nhệch Kim Sơn cuốn lá sung', places: 'Nhà hàng Vũ Bảo (Kim Sơn & TP Ninh Bình)', cost: '150.000 - 250.000 VNĐ', category: 'Món chính' },
      { dish: 'Xôi trứng kiến Nho Quan độc lạ', places: 'Khu vực Nho Quan, Nhà hàng vùng đồi núi', cost: '50.000 - 80.000 VNĐ', category: 'Món chính' },
      { dish: 'Canh chua cá rô Tổng Trường béo ngậy', places: 'Nhà hàng Hoàng Giang (Trường Yên)', cost: '100.000 - 160.000 VNĐ', category: 'Món chính' },
      { dish: 'Bánh đa cá rô đồng giòn ngọt', places: 'Quán cá rô đồng đường Lê Hồng Phong', cost: '35.000 - 50.000 VNĐ', category: 'Món nước' },
      { dish: 'Rượu cần Nho Quan men lá thơm', places: 'Bản Mường Nho Quan, Chợ Rồng', cost: '80.000 - 150.000 VNĐ / vò', category: 'Cà phê & Đồ uống' },
      { dish: 'Bánh trôi nước Ninh Bình dẻo thơm mật mía', places: 'Quán bà béo số 52 Vân Gia', cost: '20.000 - 30.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Nem chua Yên Mạc cuốn lá ổi', places: 'Nem chua Tuấn Bình (Yên Mạc), Chợ Rồng Ninh Bình', cost: '60.000 - 100.000 VNĐ / chục', category: 'Món chính' },
      { dish: 'Cà phê ngắm hồ súng & Thung lũng đá vôi', places: 'Chookies Beer Garden, Brick Coffee Tam Cốc', cost: '35.000 - 65.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Emeralda Resort Ninh Binh (5 sao Làng cổ Bắc Bộ)', priceRange: '2.100.000 - 4.200.000 VNĐ / đêm', area: 'Khu bảo tồn Vân Long, Gia Viễn', highlights: 'Tái hiện không gian làng quê Bắc Bộ xưa với nhà ba gian, vườn cau, ao sen và spa cao cấp', type: 'Resort 5 sao' },
      { name: 'Tam Coc Garden Resort (Resort giữa đồng lúa)', priceRange: '2.500.000 - 5.000.000 VNĐ / đêm', area: 'Thôn Hải Nham, Hoa Lư', highlights: 'Ốc đảo bình yên bao quanh bởi cánh đồng lúa và rặng tre xanh ngát, bể bơi nước ấm', type: 'Resort 5 sao' },
      { name: 'Ninh Binh Hidden Charm Hotel & Spa (4 sao)', priceRange: '1.200.000 - 2.300.000 VNĐ / đêm', area: 'Số 9 Tam Cốc, Hoa Lư', highlights: 'Nằm ngay bến thuyền Tam Cốc, phòng sang trọng phong cách gốm Bát Tràng và thêu ren', type: 'Khách sạn cao cấp' },
      { name: 'Trang An Lamia Bungalow', priceRange: '650.000 - 1.200.000 VNĐ / đêm', area: 'Đại Áng, Ninh Hòa, Hoa Lư', highlights: 'Bungalow tre nứa mộc mạc nép mình dưới chân vách núi đá vôi sừng sững', type: 'Homestay' },
      { name: 'Chez Beo Homestay Ninh Bình', priceRange: '450.000 - 850.000 VNĐ / đêm', area: 'Làng Khả Lương, Ninh Xuân', highlights: 'Nằm giữa đầm sen bát ngát, đi cầu tre dẫn vào từng căn phòng gỗ mộc độc đáo', type: 'Homestay' },
      { name: 'The Reed Hotel Ninh Binh (4 sao trung tâm)', priceRange: '800.000 - 1.400.000 VNĐ / đêm', area: 'Đinh Điền, Đông Thành, TP Ninh Bình', highlights: 'Khách sạn hiện đại nhất thành phố, hồ bơi trên cao, trung tâm hội nghị tiệc cưới', type: 'Khách sạn' },
      { name: 'Tam Coc Horizon Bungalow', priceRange: '750.000 - 1.300.000 VNĐ / đêm', area: 'Bến thuyền Tam Cốc', highlights: 'Tựa lưng vào hang đá tự nhiên, nhân viên phục vụ chu đáo như người nhà', type: 'Homestay' },
      { name: 'Ninh Binh Central Backpackers Hostel', priceRange: '150.000 - 300.000 VNĐ / đêm', area: 'Tam Cốc, Hoa Lư', highlights: 'Giá cực rẻ, có hồ bơi sân vườn, giao lưu kết bạn du khách quốc tế vui nhộn', type: 'Hostel' }
    ],
    tips: [
      'Đi thuyền Tràng An nên chọn Tuyến 3 (qua hang Mây dài 1km) hoặc Tuyến 2 để ghé phim trường Kong.',
      'Leo Hang Múa nên đi vào lúc chiều muộn (16h30-17h30) để ngắm hoàng hôn đỏ rực buông xuống thung lũng Tam Cốc.',
      'Ninh Bình đẹp nhất vào mùa lúa chín tháng 5 - đầu tháng 6 và mùa sen nở rộ tháng 6 - tháng 7.'
    ]
  },
  'quy nhơn': {
    title: 'Hành trình Biển xanh Eo Gió & Xứ Nẫu Bình Định',
    areaStay: 'Đường Xuân Diệu / An Dương Vương ven biển hoặc bán đảo Kỳ Co',
    places: [
      { morning: 'Cano khám phá Thiên đường biển Kỳ Co & Lặn san hô Bãi Dứa', afternoon: 'Chiêm ngưỡng Eo Gió - Nơi ngắm hoàng hôn đẹp nhất Việt Nam', evening: 'Dạo phố biển Xuân Diệu thưởng thức hải sản ốc đêm' },
      { morning: 'Check-in Tịnh Xá Ngọc Hòa ngắm tượng Phật Đôi cao nhất VN', afternoon: 'Khám phá Đồi cát Phương Mai & Cầu Thị Nại vượt biển', evening: 'Thưởng thức bánh hỏi lòng heo & chả ram tôm đất' },
      { morning: 'Khu du lịch Ghềnh Ráng Tiên Sa & Mộ thi sĩ Hàn Mặc Tử', afternoon: 'Tắm biển Bãi Trứng (Bãi tắm Hoàng Hậu Nam Phương)', evening: 'Thư giãn nghe sóng vỗ tại Surf Bar trên bãi cát' }
    ],
    foods: [
      { dish: 'Bánh hỏi lòng heo nóng hổi kèm cháo huyết', places: 'Quán Mẫn (76 Trần Phú), Quán Hồng Thanh (22 Phan Bội Châu)', cost: '35.000 - 55.000 VNĐ', category: 'Món chính' },
      { dish: 'Bánh xèo tôm nhảy giòn rụm', places: 'Quán Rau Mầm (91 Đống Đa), Bánh xèo Gia Vỹ (14 Diên Hồng)', cost: '35.000 - 60.000 VNĐ', category: 'Món chính' },
      { dish: 'Chả ram tôm đất Bình Định giòn tan', places: 'Quán Chả ram Dì Anh, Các quán đặc sản đường Ngô Mây', cost: '40.000 - 70.000 VNĐ / đĩa', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Bún chả cá & Bún sứa Quy Nhơn', places: 'Bún cá Ngọc Liên (379 Nguyễn Huệ), Bún cá Phượng Tèo (211 Nguyễn Huệ)', cost: '35.000 - 50.000 VNĐ', category: 'Món nước' },
      { dish: 'Hải sản ốc đường Ngọc Hân Công Chúa', places: 'Ốc Cô Xí (40 Đào Duy Từ), Ốc Hảo (24 Ngọc Hân Công Chúa)', cost: '30.000 - 60.000 VNĐ / đĩa', category: 'Hải sản & Đồ nướng' },
      { dish: 'Cua Huỳnh Đế đầm Trà Ổ hấp', places: 'Nhà hàng hải sản Hải Sỹ (35B Nguyễn Huệ)', cost: '450.000 - 900.000 VNĐ / kg', category: 'Hải sản & Đồ nướng' },
      { dish: 'Bánh bèo chén tôm chấy đậu phộng', places: 'Bánh bèo Bà Xê (Trần Nguyên Đán)', cost: '20.000 - 35.000 VNĐ / khay 10 chén', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Nem nướng Chợ Huyện cuốn bánh tráng', places: 'Quán nem Lợi (113 Tăng Bạt Hổ)', cost: '40.000 - 65.000 VNĐ', category: 'Món chính' },
      { dish: 'Bánh ít lá gai xứ Nẫu dẻo ngọt làm quà', places: 'Đặc sản Bình Định Như Ý, Cơ sở Phụng Nga', cost: '40.000 - 60.000 VNĐ / chục', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Gà chỉ đường đèo Quy Hòa', places: 'Quán Gà chỉ Đông Ba, Quán Sáu Cao', cost: '250.000 - 350.000 VNĐ / con', category: 'Hải sản & Đồ nướng' },
      { dish: 'Rượu Bàu Đá trứ danh làng nghề', places: 'Làng nghề Bàu Đá (An Nhơn)', cost: '80.000 - 150.000 VNĐ / lít', category: 'Cà phê & Đồ uống' },
      { dish: 'Cà phê Surf Bar lãng mạn trên bờ cát', places: 'Surf Bar 1 & Surf Bar 2 (Bãi biển Xuân Diệu)', cost: '35.000 - 60.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'Anantara Quy Nhon Villas (5 sao nghỉ dưỡng xa xỉ)', priceRange: '8.000.000 - 16.000.000 VNĐ / đêm', area: 'Bãi biển Bãi Dài, Ghềnh Ráng', highlights: 'Khu biệt thự hồ bơi vô cực nhìn thẳng biển cả, dịch vụ quản gia cá nhân cao cấp', type: 'Resort 5 sao' },
      { name: 'FLC Luxury Resort Quy Nhon (5 sao Nhơn Lý)', priceRange: '1.800.000 - 3.600.000 VNĐ / đêm', area: 'Khu du lịch Nhơn Lý, gần Eo Gió', highlights: 'Khu nghỉ dưỡng ôm trọn bãi biển Nhơn Lý, sân golf 36 lỗ dạng links, công viên thú FLC Safari', type: 'Resort 5 sao' },
      { name: 'Anya Premier Hotel Quy Nhon (5 sao ven biển)', priceRange: '1.200.000 - 2.200.000 VNĐ / đêm', area: '44 An Dương Vương, sát biển', highlights: 'Khách sạn 5 sao ngay trung tâm ngã ba biển, hồ bơi tràn bờ vô cực, buffet sáng phong phú', type: 'Khách sạn cao cấp' },
      { name: 'Seaside Boutique Resort Quy Nhon (4 sao)', priceRange: '1.100.000 - 1.900.000 VNĐ / đêm', area: 'Bãi biển Bãi Dài', highlights: 'Thiết kế phong cách Santorini Địa Trung Hải với hai tông màu trắng xanh lãng mạn', type: 'Resort 5 sao' },
      { name: 'Mira Bãi Xếp Quy Nhơn The Hidden Jewel', priceRange: '650.000 - 1.200.000 VNĐ / đêm', area: 'Làng chài Bãi Xếp', highlights: 'Phòng ốc kính lớn view trọn làng chài cổ tích, bồn tắm gỗ nhìn ra biển xanh ngắt', type: 'Homestay' },
      { name: 'Life\'s A Beach Homestay', priceRange: '450.000 - 850.000 VNĐ / đêm', area: 'Tổ 2, Khu vực 1, Bãi Xép', highlights: 'Do hai chàng trai người Anh sáng lập, phong cách mộc mạc hòa mình vào đời sống ngư dân', type: 'Homestay' },
      { name: 'TMS Hotel Quy Nhon Beach (Căn hộ khách sạn)', priceRange: '700.000 - 1.300.000 VNĐ / đêm', area: '28 Nguyễn Huệ, sát biển', highlights: 'Tòa nhà cao 42 tầng biểu tượng mới của Quy Nhơn, tiện nghi căn hộ gia đình sang trọng', type: 'Căn hộ' },
      { name: 'Haven Vietnam Hostel', priceRange: '180.000 - 350.000 VNĐ / đêm', area: 'Bãi Xép, Ghềnh Ráng', highlights: 'Ngay cạnh bãi biển cát vàng tĩnh lặng, bia lạnh và đồ uống giá rẻ, rất chill', type: 'Hostel' }
    ],
    tips: [
      'Đi Kỳ Co - Eo Gió nên đi vào buổi sáng từ 7h30 để biển êm và nước trong xanh nhất.',
      'Đường ốc Ngọc Hân Công Chúa là thiên đường ăn vặt buổi tối với giá chỉ từ 25k-30k/đĩa.',
      'Bãi Xếp là một làng chài nhỏ cực kỳ yên bình, rất phù hợp cho ai muốn trốn sự ồn ào.'
    ]
  },
  'vũng tàu': {
    title: 'Hành trình Phố biển Vũng Tàu & Ngọn Hải Đăng Cổ',
    areaStay: 'Bãi Sau (Thùy Vân) để tắm biển hoặc Bãi Trước ngắm hoàng hôn',
    places: [
      { morning: 'Check-in Tượng Chúa Kito Vua dang tay trên đỉnh Núi Nhỏ', afternoon: 'Ngắm hoàng hôn lãng mạn tại Mũi Nghinh Phong & Cổng Trời', evening: 'Thưởng thức bánh khọt Gốc Vú Sữa & lẩu cá đuối đường Trương Công Định' },
      { morning: 'Chinh phục Ngọn Hải Đăng Vũng Tàu cổ nhất Đông Dương & ăn yaourt trứng gà', afternoon: 'Tắm biển Bãi Sau sóng vỗ êm đềm & check-in Bạch Dinh', evening: 'Dạo biển Bãi Trước & thưởng thức hải sản Chợ đêm Vũng Tàu' }
    ],
    foods: [
      { dish: 'Bánh khọt Vũng Tàu tôm tươi giòn rụm', places: 'Bánh khọt Gốc Vú Sữa (14 Nguyễn Trường Tộ), Bánh khọt Cô Ba Vũng Tàu (01 Hoàng Hoa Thám)', cost: '50.000 - 80.000 VNĐ / dĩa', category: 'Món chính' },
      { dish: 'Lẩu cá đuối măng chua cay nồng', places: 'Lẩu cá đuối Hoàng Minh (44 Trương Công Định), Quán 7 Lượm (37 Nguyễn Trường Tộ)', cost: '180.000 - 280.000 VNĐ / nồi', category: 'Món chính' },
      { dish: 'Hải sản tươi sống chợ đêm & Bãi Trước', places: 'Ốc Tự Nhiên (34 Trần Phú), Quán Gành Hào (03 Trần Phú view biển)', cost: '150.000 - 400.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Bánh bông lan trứng muối chà bông', places: 'Bánh bông lan Gốc Cột Điện (17B Nguyễn Trường Tộ), Thọ Bakery', cost: '30.000 - 50.000 VNĐ / hộp', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Yaourt & Trứng gà lòng đào Hải Đăng', places: 'Quán Yaourt Cô Tiên (Đường lên ngọn Hải Đăng)', cost: '10.000 - 15.000 VNĐ / món', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Gỏi cá mai Vũng Tàu nước chấm mè đậu phộng', places: 'Quán Vườn Xoài (34/5 Hoàng Hoa Thám)', cost: '100.000 - 160.000 VNĐ', category: 'Món chính' },
      { dish: 'Hủ tiếu mực Ông Già Cali', places: 'Hủ tiếu mực Ông Già Cali (113 Hoàng Hoa Thám)', cost: '55.000 - 85.000 VNĐ', category: 'Món nước' },
      { dish: 'Bún súng Vũng Tàu hải sản độc đáo', places: 'Bún súng Cô Thành (đường Lê Hồng Phong)', cost: '40.000 - 60.000 VNĐ', category: 'Món nước' },
      { dish: 'Chè sen đậu xanh thanh nhiệt', places: 'Chè Hiệp (167 Ba Cu)', cost: '20.000 - 35.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Kem Alibaba Thổ Nhĩ Kỳ vui nhộn', places: 'Cáp treo Vũng Tàu, đường Trần Phú', cost: '25.000 - 40.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
      { dish: 'Cá mao ếch nướng muối ớt sa tế', places: 'Hải sản La Sirena Seafood Restaurant (Bãi Sau)', cost: '200.000 - 350.000 VNĐ', category: 'Hải sản & Đồ nướng' },
      { dish: 'Cà phê view biển hoàng hôn Bãi Trước', places: 'Marina Club Vũng Tàu, Soho Coffee đường Hạ Long', cost: '45.000 - 80.000 VNĐ', category: 'Cà phê & Đồ uống' }
    ],
    hotels: [
      { name: 'The Imperial Hotel Vung Tau (5 sao phong cách cổ điển Anh)', priceRange: '2.200.000 - 4.500.000 VNĐ / đêm', area: '159 Thùy Vân, Bãi Sau', highlights: 'Khách sạn 5 sao mang phong cách quý tộc Victoria tráng lệ, cầu vượt đi bộ thẳng ra bãi biển riêng', type: 'Khách sạn cao cấp' },
      { name: 'Pullman Vung Tau (5 sao chuẩn Accor)', priceRange: '1.800.000 - 3.400.000 VNĐ / đêm', area: '15 Thi Sách, Thắng Tam', highlights: 'Kiến trúc quả cầu độc đáo, trung tâm hội nghị lớn, phòng ốc siêu rộng và tiện nghi cao cấp', type: 'Khách sạn cao cấp' },
      { name: 'Marina Bay Vung Tau Resort & Spa (5 sao ven biển Trần Phú)', priceRange: '1.900.000 - 3.800.000 VNĐ / đêm', area: '115 Trần Phú', highlights: 'Hồ bơi vô cực sát biển ngắm hoàng hôn buông lơi đẹp nhất Vũng Tàu, không gian yên bình', type: 'Resort 5 sao' },
      { name: 'Vias Hotel Vung Tau (4 sao mặt biển Bãi Sau)', priceRange: '1.100.000 - 2.100.000 VNĐ / đêm', area: '179 Thùy Vân', highlights: 'Hồ bơi vô cực trên tầng thượng ngắm trọn Bãi Sau, phong cách trẻ trung năng động hiện đại', type: 'Khách sạn' },
      { name: 'Malibu Hotel Vung Tau (4 sao)', priceRange: '950.000 - 1.700.000 VNĐ / đêm', area: '263 Lê Hồng Phong', highlights: 'Hồ bơi chân mây tầng chân trời, phòng decor xịn sò, buffet sáng tươi ngon hấp dẫn', type: 'Khách sạn' },
      { name: 'Santoni Homestay Vũng Tàu (Phong cách Santorini)', priceRange: '450.000 - 850.000 VNĐ / đêm', area: '139/27A Phan Chu Trinh', highlights: 'Tông màu trắng xanh Hy Lạp ngập tràn góc sống ảo, hồ bơi mini trong sân ấm cúng', type: 'Homestay' },
      { name: 'Oasky Luxury Apartment Vũng Tàu (Căn hộ view biển)', priceRange: '700.000 - 1.400.000 VNĐ / đêm', area: 'Sơn Thịnh 02, Lê Hồng Phong kéo dài', highlights: 'Căn hộ 2-3 phòng ngủ có ban công view biển Bãi Sau bao la, đầy đủ bếp nấu nướng gia đình', type: 'Căn hộ' },
      { name: 'Gecko Hostel Vung Tau', priceRange: '160.000 - 300.000 VNĐ / đêm', area: 'Trần Phú, gần biển', highlights: 'Giá tiết kiệm cho du khách trẻ, sạch sẽ, nhân viên hỗ trợ nhiệt tình', type: 'Hostel' }
    ],
    tips: [
      'Leo Tượng Chúa Kito cần mặc trang phục lịch sự (quần qua đầu gối, áo có tay), gửi giày dép dưới chân tượng.',
      'Ăn hải sản tại quán Gành Hào nên đặt bàn trước từ chiều để có được vị trí sát mép sóng ngắm hoàng hôn.',
      'Cuối tuần Vũng Tàu rất đông đúc, hãy đặt trước phòng khách sạn từ 3-5 ngày để có giá tốt.'
    ]
  }
};

function stripVietnamese(str) {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
}

// Hàm sinh kế hoạch du lịch dự phòng thông minh (Heuristic Recommendation Engine)
function generateLocalItinerary(destination, days, budget, travelStyle, groupType, specialRequests) {
  const cleanDest = (destination || 'Đà Nẵng').trim();
  const searchDest = stripVietnamese(cleanDest);
  const numDays = Math.max(1, Math.min(parseInt(days, 10) || 3, 30));
  const rawBudget = parseInt((budget || '5000000').toString().replace(/\D/g, ''), 10) || 5000000;
  
  // Tìm dữ liệu điểm đến khớp không phân biệt dấu
  let matchKey = Object.keys(DESTINATION_DATABASE).find(k => {
    const normK = stripVietnamese(k);
    return searchDest.includes(normK) || normK.includes(searchDest);
  });
  let destData = matchKey ? DESTINATION_DATABASE[matchKey] : null;

  if (!destData) {
    // Điểm đến tổng quát phong phú cho mọi tỉnh thành Việt Nam với 8 nơi ở và 12 món ăn
    destData = {
      title: `Hành trình Khám phá & Trải nghiệm Trọn vẹn ${cleanDest}`,
      areaStay: `Khu vực trung tâm thành phố hoặc ven các thắng cảnh nổi bật tại ${cleanDest}`,
      places: [
        { morning: `Tham quan các danh lam thắng cảnh và di tích lịch sử nổi tiếng tại ${cleanDest}`, afternoon: `Khám phá các điểm check-in thiên nhiên và làng nghề truyền thống`, evening: `Dạo chợ đêm, trải nghiệm không gian văn hóa bản địa và phố ẩm thực` },
        { morning: `Trải nghiệm các hoạt động vui chơi giải trí ngoài trời và ngắm bình minh`, afternoon: `Thưởng thức ẩm thực đặc sản vùng miền và chụp ảnh kỷ niệm`, evening: `Thư giãn tại các quán cà phê ngắm cảnh đêm địa phương` },
        { morning: `Mua sắm đặc sản làm quà tại chợ trung tâm ${cleanDest}`, afternoon: `Tham quan các bảo tàng, không gian triển lãm nghệ thuật địa phương`, evening: `Bữa tối chia tay với các món ăn ngon đặc trưng nhất` }
      ],
      foods: [
        { dish: `Món điểm tâm sáng truyền thống tại ${cleanDest}`, places: 'Khu ẩm thực chợ trung tâm & các quán ăn lâu đời', cost: '35.000 - 60.000 VNĐ', category: 'Món nước' },
        { dish: `Đặc sản vùng miền chính gốc ${cleanDest}`, places: 'Nhà hàng đặc sản địa phương uy tín hàng đầu', cost: '150.000 - 300.000 VNĐ', category: 'Món chính' },
        { dish: 'Món ăn dân dã đường phố nổi tiếng', places: 'Phố đi bộ & Khu chợ đêm địa phương', cost: '25.000 - 50.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
        { dish: 'Lẩu đặc sản địa phương ấm cúng', places: 'Các quán lẩu gia truyền nổi tiếng trong vùng', cost: '250.000 - 450.000 VNĐ / nồi', category: 'Món chính' },
        { dish: 'Đồ nướng than hoa đêm thơm lừng', places: 'Phố nướng ẩm thực về đêm bản địa', cost: '80.000 - 160.000 VNĐ', category: 'Hải sản & Đồ nướng' },
        { dish: 'Hải sản / Thủy sản tươi sống bắt tại bè', places: 'Khu ẩm thực ven sông / bãi biển', cost: '200.000 - 450.000 VNĐ', category: 'Hải sản & Đồ nướng' },
        { dish: 'Bánh truyền thống dân gian xứ sở', places: 'Các gánh hàng rong chợ truyền thống', cost: '20.000 - 40.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
        { dish: 'Chè và món tráng miệng thanh mát', places: 'Các quán chè lâu năm trung tâm', cost: '20.000 - 35.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
        { dish: 'Bữa cơm niêu đậm đà hương vị gia đình', places: 'Nhà hàng cơm niêu truyền thống', cost: '80.000 - 150.000 VNĐ', category: 'Món chính' },
        { dish: 'Đặc sản khô & Rượu truyền thống mua làm quà', places: 'Chợ trung tâm tỉnh & Siêu thị đặc sản', cost: '100.000 - 250.000 VNĐ', category: 'Món chính' },
        { dish: 'Bánh mặn chiên giòn ăn xế chiều', places: 'Khu phố ăn vặt học sinh sinh viên', cost: '20.000 - 35.000 VNĐ', category: 'Ăn vặt & Tráng miệng' },
        { dish: 'Cà phê view đẹp ngắm cảnh địa phương', places: 'Các quán cafe rooftop hoặc view thiên nhiên thơ mộng', cost: '35.000 - 65.000 VNĐ', category: 'Cà phê & Đồ uống' }
      ],
      hotels: [
        { name: `Khách sạn 5 sao cao cấp ${cleanDest}`, priceRange: '1.800.000 - 3.800.000 VNĐ / đêm', area: 'Khu vực trung tâm hành chính / thương mại', highlights: 'Tiện nghi chuẩn quốc tế, hồ bơi vô cực, buffet sáng thượng hạng, phòng view toàn cảnh', type: 'Khách sạn cao cấp' },
        { name: `Khách sạn 4 sao trung tâm tiện nghi`, priceRange: '850.000 - 1.500.000 VNĐ / đêm', area: 'Gần các điểm tham quan chính', highlights: 'Vị trí đắc địa thuận tiện đi lại, phòng ốc hiện đại, dịch vụ đưa đón chu đáo', type: 'Khách sạn' },
        { name: `Resort / Khu nghỉ dưỡng sinh thái sinh thái`, priceRange: '1.400.000 - 2.800.000 VNĐ / đêm', area: 'Vùng ven cảnh quan thiên nhiên trong lành', highlights: 'Không gian yên bình, hồ bơi ngoài trời xanh mát, nhiều cây xanh thư giãn tối đa', type: 'Resort 5 sao' },
        { name: `Khách sạn 3 sao giá hợp lý`, priceRange: '450.000 - 800.000 VNĐ / đêm', area: 'Khu phố du lịch sầm uất', highlights: 'Phòng ốc sạch sẽ, tiện nghi đầy đủ, nhân viên nhiệt tình, giá cả rất tiết kiệm', type: 'Khách sạn' },
        { name: `Homestay trải nghiệm văn hóa bản địa`, priceRange: '350.000 - 600.000 VNĐ / đêm', area: 'Làng bản / Khu dân cư truyền thống', highlights: 'Trải nghiệm cuộc sống mộc mạc của người bản xứ, chủ nhà nấu ăn ngon và hiếu khách', type: 'Homestay' },
        { name: `Căn hộ du lịch cho gia đình & nhóm bạn`, priceRange: '650.000 - 1.200.000 VNĐ / đêm', area: 'Khu đô thị mới hiện đại', highlights: 'Đầy đủ bếp nấu nướng, máy giặt, phòng khách rộng rãi, phù hợp nhóm đông người', type: 'Căn hộ' },
        { name: `Boutique Villa phong cách vintage`, priceRange: '900.000 - 1.600.000 VNĐ / đêm', area: 'Khu vực yên tĩnh ven hồ / sông', highlights: 'Thiết kế tinh tế mang tính nghệ thuật cao, nhiều góc chụp ảnh sống ảo độc đáo', type: 'Khách sạn' },
        { name: `Hostel du lịch bụi tiết kiệm`, priceRange: '150.000 - 280.000 VNĐ / đêm', area: 'Gần bến xe hoặc trung tâm', highlights: 'Giá siêu rẻ, giường tầng sạch sẽ, điều hòa mát mẻ, dễ giao lưu cùng bạn bè', type: 'Hostel' }
      ],
      tips: [
        `Nên tìm hiểu trước dự báo thời tiết tại ${cleanDest} để chuẩn bị trang phục phù hợp.`,
        'Thuê phương tiện xe máy tại chỗ để tiết kiệm chi phí và chủ động khám phá mọi ngõ ngách.',
        'Hỏi giá trước khi sử dụng dịch vụ hoặc mua sắm tại các khu du lịch đông khách.'
      ]
    };
  }

  // Phân bổ ngân sách hợp lý theo tỷ lệ tiêu chuẩn
  const accomBudget = Math.round(rawBudget * 0.30);
  const foodBudget = Math.round(rawBudget * 0.32);
  const sightBudget = Math.round(rawBudget * 0.18);
  const transBudget = Math.round(rawBudget * 0.12);
  const contingency = rawBudget - (accomBudget + foodBudget + sightBudget + transBudget);

  // Sinh lịch trình từng ngày
  const dailyItinerary = [];
  for (let i = 1; i <= numDays; i++) {
    const templateIdx = (i - 1) % destData.places.length;
    const place = destData.places[templateIdx];
    const foodItem = destData.foods[(i - 1) % destData.foods.length];

    dailyItinerary.push({
      day: i,
      title: `Ngày ${i}: ${i === 1 ? 'Khởi hành & Chào đón' : i === numDays ? 'Tổng kết & Tạm biệt' : 'Khám phá chiều sâu'} ${cleanDest}`,
      morning: {
        activity: place.morning,
        food: `Ăn sáng: ${foodItem.dish} tại ${foodItem.places.split(',')[0] || 'quán địa phương'}`,
        cost: Math.round(foodBudget / (numDays * 3) + sightBudget / (numDays * 2)),
        tips: 'Nên khởi hành sớm trong khoảng 7h30 - 8h00 để tận hưởng không khí trong lành.'
      },
      afternoon: {
        activity: place.afternoon,
        food: `Bữa trưa & xế: Đặc sản địa phương tại ${destData.foods[1 % destData.foods.length].places}`,
        cost: Math.round(foodBudget / (numDays * 3)),
        tips: 'Thời gian 12h00 - 13h30 nên nghỉ ngơi hồi phục sức lực trước khi tham quan buổi chiều.'
      },
      evening: {
        activity: place.evening,
        food: `Bữa tối: Thưởng thức bữa ăn phong phú ấm cúng tại ${destData.foods[2 % destData.foods.length].places}`,
        cost: Math.round(foodBudget / (numDays * 3) + 50000),
        tips: 'Buổi tối là thời điểm tuyệt vời nhất để ngắm nhịp sống địa phương lên đèn rực rỡ.'
      }
    });
  }

  return {
    title: `${destData.title} (${numDays}N${numDays > 1 ? numDays - 1 : 0}Đ)`,
    destination: cleanDest,
    days: numDays,
    budget: rawBudget,
    travelStyle: travelStyle || 'Khám phá & Nghỉ dưỡng',
    groupType: groupType || 'Cặp đôi / Bạn bè',
    summary: `Kế hoạch du lịch thông minh được tối ưu hóa riêng cho chuyến đi ${numDays} ngày tại ${cleanDest} với mức ngân sách ${rawBudget.toLocaleString('vi-VN')} VNĐ. Hệ thống đã tổng hợp đầy đủ ${destData.hotels.length} gợi ý nơi ở và ${destData.foods.length} món ăn đặc sản nổi tiếng nhất để bạn thỏa sức lựa chọn!`,
    dailyItinerary,
    accommodations: destData.hotels,
    culinary: destData.foods,
    budgetBreakdown: {
      accommodation: accomBudget,
      food: foodBudget,
      sightseeing: sightBudget,
      transportation: transBudget,
      contingency: Math.max(0, contingency),
      totalEstimated: rawBudget
    },
    travelTips: destData.tips
  };
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

// 2. API Lập Kế Hoạch Du Lịch Chuyên Sâu (NLP & Recommendation Engine - Mục 2.1.2)
app.post(['/api/chat/plan', '/api/ai/plan'], async (req, res) => {
  const { destination, days, budget, travelStyle, groupType, specialRequests } = req.body;

  if (!destination || !destination.trim()) {
    return res.status(400).json({ success: false, error: 'Vui lòng cung cấp điểm đến du lịch mong muốn.' });
  }

  const prompt = `Bạn là chuyên gia tư vấn du lịch hàng đầu Việt Nam. Hãy đóng vai trò hệ thống gợi ý du lịch thông minh (theo Chương 2 Đồ án ĐATN) để xây dựng một kế hoạch du lịch chi tiết và hoàn chỉnh cho du khách:
- Điểm đến: ${destination}
- Số ngày: ${days || 3} ngày
- Tổng ngân sách dự kiến: ${budget || 5000000} VNĐ
- Phong cách du lịch: ${travelStyle || 'Khám phá & Thư giãn'}
- Đối tượng tham gia: ${groupType || 'Cặp đôi / Bạn bè'}
- Yêu cầu bổ sung (NLP): ${specialRequests || 'Không có yêu cầu đặc biệt'}

YÊU CẦU BẮT BUỘC VỀ ĐỘ PHONG PHÚ:
1. "accommodations": BẮT BUỘC cung cấp từ 7 đến 8 gợi ý lưu trú đa dạng mọi phân khúc (Resort 5 sao cao cấp, Khách sạn 4 sao view đẹp, Khách sạn 3 sao trung tâm, Homestay mộc mạc bản địa, Căn hộ gia đình tiện nghi, Hostel tiết kiệm) kèm tên cụ thể, giá/đêm, khu vực, loại hình và điểm nổi bật.
2. "culinary": BẮT BUỘC cung cấp từ 10 đến 14 món ăn đặc sản tiêu biểu nhất cùng tên các quán ăn/nhà hàng nổi tiếng có tiếng tại địa phương kèm địa chỉ rõ ràng, giá tiền tham khảo và phân loại danh mục món (Món chính, Món nước, Hải sản & Đồ nướng, Ăn vặt & Tráng miệng, Cà phê & Đồ uống).
3. "dailyItinerary": Chi tiết theo từng ngày (Sáng, Chiều, Tối). Mỗi buổi có hoạt động, địa điểm ăn uống, chi phí ước tính và mẹo nhỏ.

Trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm markdown \`\`\`json, không kèm lời bình luận nào):
{
  "title": "Tên kế hoạch hấp dẫn",
  "destination": "${destination}",
  "days": ${parseInt(days, 10) || 3},
  "budget": ${parseInt((budget || '5000000').toString().replace(/\D/g, ''), 10) || 5000000},
  "travelStyle": "${travelStyle || 'Khám phá'}",
  "groupType": "${groupType || 'Nhóm bạn'}",
  "summary": "Tóm tắt ngắn gọn 2-3 câu giới thiệu chuyến đi",
  "dailyItinerary": [
    {
      "day": 1,
      "title": "Tiêu đề ngày 1",
      "morning": { "activity": "Mô tả hoạt động sáng", "food": "Món ăn sáng gợi ý & địa chỉ", "cost": 150000, "tips": "Mẹo hữu ích" },
      "afternoon": { "activity": "Mô tả hoạt động chiều", "food": "Món ăn trưa/xế & quán gợi ý", "cost": 200000, "tips": "Mẹo hữu ích" },
      "evening": { "activity": "Mô tả hoạt động tối", "food": "Bữa tối đặc sản & địa chỉ", "cost": 300000, "tips": "Mẹo hữu ích" }
    }
  ],
  "accommodations": [
    { "name": "Tên khách sạn/resort/homestay cụ thể", "priceRange": "Khoảng giá/đêm", "area": "Khu vực địa chỉ nên ở", "highlights": "Ưu điểm nổi bật", "type": "Resort 5 sao / Khách sạn cao cấp / Khách sạn / Homestay / Căn hộ / Hostel" }
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
    "totalEstimated": 5000000
  },
  "travelTips": [
    "Lời khuyên thiết thực 1",
    "Lời khuyên thiết thực 2",
    "Lời khuyên thiết thực 3"
  ]
}`;

  try {
    console.log(`[AI-PLANNER] Đang sinh kế hoạch du lịch cho: ${destination} (${days} ngày, ngân sách: ${budget})`);
    const aiText = await generateWithFallback(prompt, "Bạn là hệ thống AI sinh lịch trình du lịch Việt Nam chuyên nghiệp. Bạn CHỈ trả về dữ liệu định dạng JSON chuẩn.");
    
    // Bóc tách JSON từ kết quả trả về của AI
    const cleanedJson = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedPlan = JSON.parse(cleanedJson);
    console.log(`[AI-PLANNER] Thành công sinh kế hoạch từ Gemini cho ${destination}`);
    return res.json({ success: true, source: 'gemini', plan: parsedPlan });
  } catch (error) {
    console.warn(`[AI-PLANNER] Gemini không phản hồi hoặc lỗi (${error.message}). Tự động kích hoạt Heuristic Recommendation Fallback...`);
    const fallbackPlan = generateLocalItinerary(destination, days, budget, travelStyle, groupType, specialRequests);
    return res.json({ success: true, source: 'heuristic-engine', plan: fallbackPlan });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-service', port: port });
});

app.listen(port, () => {
  console.log(`AI Service running on port ${port}`);
});
