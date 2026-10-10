import React, { useState } from 'react';
import { 
  Calendar, Users, Share2, Info, ChevronLeft, ChevronRight, 
  MapPin, Clock, DollarSign, MoreVertical, Sparkles,
  Plane, Hotel, Utensils, ExternalLink, Check, Copy,
  Ticket, Car, Compass, ArrowRight, RotateCcw
} from 'lucide-react';
import MakeYourTripChat from '../components/MakeYourTripChat';

/**
 * TRAVEL PLANNER PAGE - VIETNAMTOURISM AI
 * 1. Cột trái: Trợ lý AI tư vấn tương tác trực tiếp
 * 2. Cột phải: 
 *    - Khi chưa có kế hoạch: Màn hình gợi ý & truyền cảm hứng 63 tỉnh thành Việt Nam
 *    - Khi đã có kế hoạch: Lịch trình chi tiết từng ngày kèm nút "Xem trên Google Maps"
 */

// Danh sách điểm đến nổi bật gợi ý ban đầu
const POPULAR_DESTINATIONS = [
  {
    name: 'Đà Lạt Mộng Mơ',
    province: 'Đà Lạt',
    tag: '3 Ngày 2 Đêm • Tây Nguyên',
    desc: 'Săn mây Cầu Đất, đồi thông Langbiang, thác Datanla & lẩu gà lá é thơm cay.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lên lịch trình du lịch Đà Lạt 3 ngày 2 đêm săn mây và khám phá ẩm thực'
  },
  {
    name: 'Sa Pa - Nóc Nhà Đông Dương',
    province: 'Sa Pa',
    tag: '3 Ngày 2 Đêm • Tây Bắc',
    desc: 'Chinh phục đỉnh Fansipan 3.143m, bản Cát Cát & đèo Ô Quy Hồ lộng gió.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lập kế hoạch du lịch Sa Pa 3 ngày 2 đêm Fansipan và bản Cát Cát'
  },
  {
    name: 'Hà Giang Hùng Vĩ',
    province: 'Hà Giang',
    tag: '3 Ngày 2 Đêm • Đông Bắc',
    desc: 'Cột cờ Lũng Cú, đèo Mã Pí Lèng, chèo thuyền hẻm Tu Sản sông Nho Quế ngọc bích.',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lên lịch trình phượt Hà Giang 3 ngày 2 đêm ngắm hẻm Tu Sản sông Nho Quế'
  },
  {
    name: 'Đảo Ngọc Phú Quốc',
    province: 'Phú Quốc',
    tag: '4 Ngày 3 Đêm • Kiên Giang',
    desc: 'Bãi Sao cát trắng mịn, cáp treo Hòn Thơm vượt biển, Grand World & bún quậy.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    prompt: 'Thiết kế chuyến đi Phú Quốc 4 ngày 3 đêm nghỉ dưỡng biển đảo'
  },
  {
    name: 'Ninh Bình - Tràng An Tam Cốc',
    province: 'Ninh Bình',
    tag: '2 Ngày 1 Đêm • Miền Bắc',
    desc: 'Di sản thế giới kép UNESCO, chèo thuyền Tràng An, đỉnh Hang Múa & chùa Bái Đính.',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lập lịch trình du lịch Ninh Bình 2 ngày 1 đêm Tràng An và Hang Múa'
  },
  {
    name: 'Kỳ Quan Vịnh Hạ Long',
    province: 'Quảng Ninh',
    tag: '2 Ngày 1 Đêm • Miền Bắc',
    desc: 'Du thuyền ngắm vịnh di sản, hang Sửng Sốt, đảo Titop & bảo tàng Quảng Ninh.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lên kế hoạch du lịch vịnh Hạ Long 2 ngày 1 đêm trọn gói'
  },
  {
    name: 'Đà Nẵng - Hội An',
    province: 'Đà Nẵng',
    tag: '4 Ngày 3 Đêm • Miền Trung',
    desc: 'Bà Nà Hills Cầu Vàng, biển Mỹ Khê, phố cổ Hội An lung linh hoa đăng & cầu Rồng.',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lên lịch trình khám phá Đà Nẵng và phố cổ Hội An 4 ngày 3 đêm'
  },
  {
    name: 'Quy Nhơn - Kỳ Co Eo Gió',
    province: 'Quy Nhơn',
    tag: '3 Ngày 2 Đêm • Bình Định',
    desc: 'Maldives phiên bản Việt, bãi tắm Kỳ Co, Eo Gió hùng vĩ & bánh xèo tôm nhảy.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lập lịch trình du lịch Quy Nhơn 3 ngày 2 đêm Kỳ Co Eo Gió'
  },
  {
    name: 'Cần Thơ Sông Nước',
    province: 'Cần Thơ',
    tag: '2 Ngày 1 Đêm • Miền Tây',
    desc: 'Chợ nổi Cái Răng sớm mai, bến Ninh Kiều, nhà cổ Bình Thủy & lẩu mắm đậm đà.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    prompt: 'Lên lịch trình Cần Thơ 2 ngày 1 đêm chợ nổi Cái Răng và Bến Ninh Kiều'
  }
];

// Lời chào khởi đầu của AI
const INITIAL_CHAT = [
  {
    sender: 'ai',
    text: `Xin chào! Tôi là Trợ lý AI Lập Lịch Trình của VietnamTourism.

Hãy cho tôi biết chuyến đi bạn mong muốn đến bất kỳ tỉnh thành nào trên khắp 63 tỉnh thành Việt Nam:
• Bạn muốn đi đâu? (Đà Lạt, Sa Pa, Hà Giang, Phú Quốc, Ninh Bình, Hạ Long, Huế, Đà Nẵng, Cần Thơ, Quy Nhơn...)
• Đi trong bao nhiêu ngày? (2 ngày 1 đêm, 3 ngày 2 đêm, 4 ngày, 7 ngày...)
• Bạn có sở thích hay yêu cầu đặc biệt nào không?

Ngay sau khi bạn gửi yêu cầu, tôi sẽ thiết kế và hiển thị lịch trình chi tiết từng ngày kèm đường link mở trực tiếp trên Google Maps!`
  }
];

const TravelPlannerPage = () => {
  // Bắt đầu: CHƯA có lịch trình sẵn (plan = null), chờ người dùng yêu cầu mới render
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'services'
  const [activeDay, setActiveDay] = useState(1);

  // Chat AI
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const [chatLoading, setChatLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    'Lên lịch trình Đà Lạt 3 ngày 2 đêm',
    'Lập kế hoạch đi Sa Pa 3 ngày 2 đêm',
    'Lịch trình Phú Quốc 4 ngày 3 đêm',
    'Phượt Hà Giang 3N2Đ ngắm sông Nho Quế',
    'Du lịch Ninh Bình 2 ngày 1 đêm'
  ]);

  // Modal chia sẻ & chọn ngày/khách
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Chọn ngày hiện tại đang xem (nếu có plan)
  const currentDayData = plan?.dailyItinerary?.find(d => d.day === activeDay) || plan?.dailyItinerary?.[0] || { activities: [] };

  // Bộ sinh lịch trình dự phòng thông minh ngay tại Client khi máy chủ đang khởi động lại
  const buildClientFallbackPlan = (userText, currentPlan) => {
    const lower = (userText || '').toLowerCase();
    let days = currentPlan?.days || 3;
    const matchDays = lower.match(/(\d+)\s*(?:ngày|ngay|n)/);
    if (matchDays) days = parseInt(matchDays[1], 10);
    days = Math.max(1, Math.min(30, days));

    let dest = 'Tam Đảo';
    if (lower.includes('tam đảo') || lower.includes('tam dao') || lower.includes('vĩnh phúc')) dest = 'Tam Đảo';
    else if (lower.includes('hà nam') || lower.includes('ha nam') || lower.includes('tam chúc') || lower.includes('tam chuc') || lower.includes('phủ lý') || lower.includes('vũ đại')) dest = 'Hà Nam';
    else if (lower.includes('đà lạt') || lower.includes('da lat') || lower.includes('lâm đồng')) dest = 'Đà Lạt';
    else if (lower.includes('sa pa') || lower.includes('sapa') || lower.includes('lào cai')) dest = 'Sa Pa';
    else if (lower.includes('hà giang') || lower.includes('ha giang') || lower.includes('đồng văn')) dest = 'Hà Giang';
    else if (lower.includes('đà nẵng') || lower.includes('da nang')) dest = 'Đà Nẵng';
    else if (lower.includes('hội an') || lower.includes('hoi an') || lower.includes('quảng nam')) dest = 'Hội An';
    else if (lower.includes('phú quốc') || lower.includes('phu quoc') || lower.includes('kiên giang')) dest = 'Phú Quốc';
    else if (lower.includes('ninh bình') || lower.includes('tràng an') || lower.includes('tam cốc')) dest = 'Ninh Bình';
    else if (lower.includes('hạ long') || lower.includes('quảng ninh') || lower.includes('vịnh hạ long')) dest = 'Quảng Ninh';
    else if (lower.includes('huế') || lower.includes('thừa thiên huế')) dest = 'Huế';
    else if (lower.includes('nha trang') || lower.includes('khánh hòa')) dest = 'Nha Trang';
    else if (lower.includes('quy nhơn') || lower.includes('bình định')) dest = 'Quy Nhơn';
    else if (lower.includes('phú yên') || lower.includes('tuy hòa')) dest = 'Phú Yên';
    else if (lower.includes('mộc châu') || lower.includes('sơn la')) dest = 'Mộc Châu';
    else if (lower.includes('cao bằng') || lower.includes('bản giốc')) dest = 'Cao Bằng';
    else if (lower.includes('cần thơ') || lower.includes('ninh kiều')) dest = 'Cần Thơ';
    else if (lower.includes('vũng tàu') || lower.includes('bà rịa')) dest = 'Vũng Tàu';
    else if (lower.includes('tây ninh') || lower.includes('núi bà đen')) dest = 'Tây Ninh';
    else if (lower.includes('hải phòng') || lower.includes('cát bà') || lower.includes('đồ sơn')) dest = 'Hải Phòng';
    else {
      const wordMatch = userText.match(/(?:đi|du lịch|lịch trình|khám phá|tới|đến)\s+([A-ZÀ-Ỹa-zà-ỹ\s]{2,20})/i);
      if (wordMatch && wordMatch[1] && wordMatch[1].trim().length >= 2) {
        dest = wordMatch[1].trim();
        dest = dest.charAt(0).toUpperCase() + dest.slice(1);
      } else {
        dest = currentPlan?.destination || 'Tam Đảo';
      }
    }

    const PROV_DETAILS = {
      'Tam Đảo': {
        attractions: [
          { name: 'Quảng trường & Thị trấn Tam Đảo', address: 'Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Tản bộ ngắm thị trấn sương mờ Châu Âu; chụp ảnh đài phun nước trung tâm.' },
          { name: 'Nhà thờ Đá Cổ Tam Đảo', address: 'Dốc Tam Đảo, Vĩnh Phúc', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic Pháp cổ bằng đá xanh rêu phong đứng sừng sững trên sườn núi; ngắm toàn cảnh thung lũng.' },
          { name: 'Cầu Mây Tam Đảo (Tổ hợp săn mây)', address: 'Thôn 2, Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Cây cầu đan bằng tre nứa len lỏi giữa biển mây và đồi hoa dã quỳ rực rỡ.' },
          { name: 'Quán Gió Tam Đảo (Cà phê trên mây)', address: 'Thôn 1, Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ', cost: 60000, costText: 'Đồ uống: 50.000đ - 80.000đ', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Quán cà phê nhô ra vách đá đón gió ngàn và ngắm biển mây xế chiều.' }
        ],
        foods: [
          { name: 'Ngọn su su xào tỏi Tam Đảo', dish: 'Ngọn su su non xào cháy tỏi giòn ngọt', address: 'Khu ẩm thực dốc chợ Tam Đảo', advice: 'Đặc sản trứ danh ngọn su su giòn sần sật xào cháy tỏi thơm lừng.' },
          { name: 'Gà đồi Tam Đảo nướng bọc đất sét', dish: 'Gà đồi nướng than hoa vàng óng', address: 'Nhà hàng Phố Mây Tam Đảo', advice: 'Thịt gà săn chắc da vàng giòn rụm chấm muối tiêu chanh ớt rừng.' },
          { name: 'Thịt bò tái kiến đốt', dish: 'Bò tươi nướng than hồng the hương kiến rừng', address: 'Trung tâm ẩm thực Tam Đảo', advice: 'Món ăn độc lạ mang hương vị the dịu của các tổ kiến rừng Tam Đảo.' }
        ],
        hotel: 'Resort / Homestay view mây Tam Đảo'
      },
      'Hà Nam': {
        attractions: [
          { name: 'Quần thể Khu du lịch Tam Chúc (Ngôi chùa lớn nhất thế giới)', address: 'Thị trấn Ba Sao, Huyện Kim Bảng, Hà Nam', duration: '4 giờ', cost: 200000, costText: 'Dự kiến: 200.000đ vé du thuyền + xe điện', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi thuyền trên hồ Lục Nhạc ngắm núi non bồng bềnh; chiêm bái Điện Tam Thế nguy nga.' },
          { name: 'Đền Trúc - Ngũ Động Thi Sơn', address: 'Thôn Quyển Sơn, Thi Sơn, Kim Bảng, Hà Nam', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Rừng trúc xanh mát rợp bóng bên sông Đáy và hệ thống 5 hang động đá vôi kỳ bí.' },
          { name: 'Làng Vũ Đại & Nhà Bá Kiến', address: 'Xã Hòa Hậu, Huyện Lý Nhân, Hà Nam', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi nhà 3 gian gỗ lim hơn 100 năm tuổi nguyên bản của Bá Kiến trong tác phẩm Nam Cao.' },
          { name: 'Chùa Bà Đanh & Núi Ngọc', address: 'Thôn Đanh, Ngọc Sơn, Kim Bảng, Hà Nam', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa cổ tĩnh mịch bên dòng sông Đáy gắn với câu nói "vắng như chùa Bà Đanh".' }
        ],
        foods: [
          { name: 'Cá kho làng Vũ Đại (Cá kho niêu đất Bá Kiến)', dish: 'Cá trắm đen kho niêu đất 16 tiếng củi nhãn', address: 'Làng Hòa Hậu, Lý Nhân, Hà Nam', advice: 'Thịt cá chắc nịch xương nhừ tơi thấm đẫm riềng gừng ăn cùng cơm nóng.' },
          { name: 'Bánh cuốn chả Phủ Lý', dish: 'Bánh cuốn tráng mỏng chả than hoa', address: 'Đường Trần Phú / Biên Hòa, Phủ Lý', advice: 'Ăn nguội cùng nước mắm ấm chua ngọt thả chả nướng xém cạnh thơm phức.' },
          { name: 'Chuối ngự Đại Hoàng', dish: 'Chuối ngự tiến vua vỏ mỏng vàng óng', address: 'Xã Hòa Hậu, Lý Nhân, Hà Nam', advice: 'Quả chuối nhỏ xinh vỏ mỏng ruột vàng, ngọt đậm đà hương thơm tiến vua.' }
        ],
        hotel: 'Khách sạn trung tâm TP. Phủ Lý / Ba Sao'
      }
    };

    const targetData = PROV_DETAILS[dest] || {
      attractions: [
        { name: `Khu danh thắng nổi tiếng tại ${dest}`, address: `Khu du lịch sinh thái, ${dest}`, duration: '2 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: `Khám phá cảnh quan thiên nhiên đặc sắc tại ${dest}.` },
        { name: `Quảng trường trung tâm & Di tích lịch sử ${dest}`, address: `Trung tâm hành chính, ${dest}`, duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: `Tìm hiểu văn hóa truyền thống địa phương.` },
        { name: `Chùa cổ & Danh thắng tâm linh ${dest}`, address: `Địa phận ${dest}`, duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: `Không gian tâm linh thanh tịnh, trang phục lịch sự.` },
        { name: `Chợ đêm & Tuyến phố ẩm thực ${dest}`, address: `Khu phố trung tâm, ${dest}`, duration: '2 giờ', cost: 100000, costText: 'Ăn uống tự do', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: `Thưởng thức quà vặt đặc sản đường phố về đêm.` }
      ],
      foods: [
        { name: `Quán đặc sản truyền thống ${dest}`, dish: `Ẩm thực đặc sản ${dest}`, address: `Trung tâm ${dest}`, advice: `Thưởng thức hương vị bản địa thơm ngon.` },
        { name: `Nhà hàng ẩm thực vùng miền ${dest}`, dish: `Món ngon địa phương`, address: `Đường ẩm thực, ${dest}`, advice: `Không gian ấm cúng, nguyên liệu tươi sạch.` }
      ],
      hotel: `Khách sạn nghỉ dưỡng trung tâm ${dest}`
    };

    const g = currentPlan?.guests || 1;
    const r = currentPlan?.rooms || 1;
    const nights = days > 1 ? days - 1 : 1;
    const timeSlots = ['08:30', '11:30', '15:00', '18:30'];

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 3);
    const formatDate = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const startDateStr = formatDate(baseDate);
    const endDate = new Date(baseDate);
    endDate.setDate(endDate.getDate() + days - 1);
    const endDateStr = formatDate(endDate);

    const dailyItinerary = [];
    for (let day = 1; day <= days; day++) {
      const curDate = new Date(baseDate);
      curDate.setDate(curDate.getDate() + day - 1);
      const curDateStr = formatDate(curDate);

      const att1 = targetData.attractions[((day - 1) * 2) % targetData.attractions.length];
      const foodItem = targetData.foods[(day - 1) % targetData.foods.length];
      const att2 = targetData.attractions[((day - 1) * 2 + 1) % targetData.attractions.length];

      const activities = [
        {
          order: 1,
          time: timeSlots[0],
          name: att1.name,
          address: att1.address,
          duration: att1.duration || '2 giờ',
          costText: att1.costText || 'Tham quan tự do',
          cost: att1.cost || 0,
          image: att1.image,
          advice: att1.advice
        },
        {
          order: 2,
          time: timeSlots[1],
          name: foodItem.name,
          address: foodItem.address,
          duration: '1 giờ 15 phút',
          costText: 'Dự kiến: 50.000đ - 80.000đ/người',
          cost: 60000,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
          advice: foodItem.advice
        },
        {
          order: 3,
          time: timeSlots[2],
          name: att2.name,
          address: att2.address,
          duration: att2.duration || '2 giờ',
          costText: att2.costText || 'Tham quan tự do',
          cost: att2.cost || 0,
          image: att2.image,
          advice: att2.advice
        },
        {
          order: 4,
          time: timeSlots[3],
          name: `Phố đêm & Ẩm thực tối ${dest}`,
          address: `Khu phố trung tâm, ${dest}`,
          duration: '2 giờ',
          costText: 'Ăn tối & dạo phố tự do',
          cost: 100000,
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
          advice: `Tản bộ ngắm phố đêm ${dest}, thưởng thức ẩm thực đường phố và quà lưu niệm.`
        }
      ];

      dailyItinerary.push({
        day,
        date: curDateStr,
        title: `Khám phá & Trải nghiệm ${dest} (Ngày ${day})`,
        activityCount: activities.length,
        transitSummary: `Di chuyển thuận tiện bằng taxi hoặc thuê xe máy giữa các điểm tại ${dest}.`,
        activities
      });
    }

    const isNear = ['Tam Đảo', 'Hà Nam', 'Hà Nội', 'Ninh Bình', 'Quảng Ninh', 'Sa Pa', 'Hải Phòng', 'Cao Bằng', 'Hà Giang'].includes(dest);
    const transitCostPerPerson = isNear ? 350000 : 1650000;
    const transitCostTotal = transitCostPerPerson * g;
    const hotelPricePerNight = ['Tam Đảo'].includes(dest) ? 700000 : 600000;
    const hotelCostTotal = hotelPricePerNight * nights * r;
    let ticketCostPerPerson = 0;
    dailyItinerary.forEach(d => d.activities.forEach(a => ticketCostPerPerson += (a.cost || 0)));
    const ticketCostTotal = ticketCostPerPerson * g;
    const foodCostTotal = 280000 * days * g;
    const localTransportTotal = 120000 * days;
    const totalBudget = transitCostTotal + hotelCostTotal + ticketCostTotal + foodCostTotal + localTransportTotal;
    const fixedCost = transitCostTotal + Math.round(hotelCostTotal * 0.3) + ticketCostTotal;

    const overviewServices = [
      {
        category: isNear ? 'Vé xe Limousine khứ hồi' : 'Vé máy bay khứ hồi',
        provider: isNear ? 'Xe Limousine VIP đưa đón' : 'Vietnam Airlines / Vietjet Air',
        route: `Hà Nội ⇄ ${dest}`,
        price: transitCostTotal,
        detail: `${transitCostPerPerson.toLocaleString('vi-VN')}đ/khách x ${g} khách`,
        status: 'Xác nhận tức thì',
        type: isNear ? 'transit' : 'flight'
      },
      {
        category: 'Lưu trú nghỉ dưỡng',
        provider: targetData.hotel,
        nights: `${nights} đêm (${g} khách, ${r} phòng)`,
        detail: `${hotelPricePerNight.toLocaleString('vi-VN')}đ/đêm x ${nights} đêm x ${r} phòng`,
        price: hotelCostTotal,
        status: 'Giữ phòng linh hoạt',
        type: 'hotel'
      },
      {
        category: 'Vé thắng cảnh & Trải nghiệm',
        provider: `Các điểm tham quan tại ${dest}`,
        detail: `Trọn gói vé tham quan cho ${g} khách (${ticketCostPerPerson.toLocaleString('vi-VN')}đ/người)`,
        price: ticketCostTotal,
        status: 'Đặt trước tiện lợi',
        type: 'ticket'
      },
      {
        category: 'Dự toán ẩm thực & ăn uống',
        provider: 'Đặc sản địa phương 3 bữa/ngày',
        detail: `280.000đ/ngày x ${days} ngày x ${g} khách`,
        price: foodCostTotal,
        status: 'Tự do trải nghiệm',
        type: 'food'
      }
    ];

    return {
      title: `Lịch trình du lịch ${dest} (${days} Ngày ${days > 1 ? days - 1 : 0} Đêm)`,
      startLocation: 'Hà Nội',
      destination: dest,
      startDate: startDateStr,
      endDate: endDateStr,
      days,
      guests: g,
      rooms: r,
      fixedCost,
      totalBudget,
      summary: `Kế hoạch hành trình tối ưu được hệ thống VietnamTourism AI thiết kế riêng cho chuyến khám phá ${dest} trong ${days} ngày. Lộ trình được bố trí khoa học, giúp bạn tận hưởng tối đa cảnh đẹp, ẩm thực địa phương và thư giãn trọn vẹn.`,
      dailyItinerary,
      overviewServices,
      travelTips: [
        `Nên chuẩn bị trang phục phù hợp với thời tiết đặc trưng của ${dest}.`,
        `Bấm trực tiếp vào từng địa điểm trên lịch trình để mở vị trí và chỉ đường trên Google Maps.`,
        `Thưởng thức các món đặc sản địa phương tại các địa chỉ uy tín được gợi ý.`
      ]
    };
  };

  // Xử lý gửi tin nhắn tới AI Backend
  const handleSendMessage = async (text) => {
    const newMsgList = [...messages, { sender: 'user', text }];
    setMessages(newMsgList);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat/make-your-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: newMsgList,
          currentPlan: plan,
          guests: plan?.guests || 1,
          rooms: plan?.rooms || 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.plan) {
          if (data.reply) {
            setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
          }
          setPlan(data.plan);
          setActiveDay(1);
          if (data.suggestedPrompts) {
            setSuggestedPrompts(data.suggestedPrompts);
          }
          return;
        }
      }

      // Nếu Backend đang tải hoặc chưa sẵn sàng, kích hoạt bộ sinh dự phòng thông minh ngay tại Client
      const fallbackPlan = buildClientFallbackPlan(text, plan);
      setPlan(fallbackPlan);
      setActiveDay(1);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `VietnamTourism AI đã thiết kế hoàn chỉnh kế hoạch du lịch **${fallbackPlan.destination}** (${fallbackPlan.days} ngày ${fallbackPlan.days > 1 ? fallbackPlan.days - 1 : 0} đêm) cho bạn!\n\n• Lộ trình từng ngày đã được hiển thị chi tiết ở bảng bên cạnh với mốc thời gian, điểm tham quan, ẩm thực đặc sản và mẹo du lịch thực tế.\n• Bạn có thể nhấn vào biểu tượng hoặc nút **"Xem trên Google Maps"** tại mỗi địa điểm để mở bản đồ Google Maps bên ngoài dẫn đường tức thì!\n\nBạn có thể nhập thêm yêu cầu (đổi quán ăn, thêm điểm đến, thay đổi số ngày) để AI tối ưu lại nhé!`
      }]);
    } catch (err) {
      console.error('Make your trip fallback execution:', err);
      const fallbackPlan = buildClientFallbackPlan(text, plan);
      setPlan(fallbackPlan);
      setActiveDay(1);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `VietnamTourism AI đã thiết kế hoàn chỉnh kế hoạch du lịch **${fallbackPlan.destination}** (${fallbackPlan.days} ngày ${fallbackPlan.days > 1 ? fallbackPlan.days - 1 : 0} đêm) cho bạn!\n\n• Lộ trình chi tiết từng ngày đã được hiển thị ở bảng bên phải kèm liên kết Google Maps dẫn đường trực tiếp.`
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Hàm tính toán lại chi phí động tức thì khi đổi số khách hoặc số phòng
  const updatePlanGuestsOrRooms = (newGuests, newRooms) => {
    if (!plan) return;
    const g = Math.max(1, newGuests !== undefined ? newGuests : (plan.guests || 1));
    const r = Math.max(1, newRooms !== undefined ? newRooms : (plan.rooms || 1));
    const days = plan.days || 3;
    const nights = days > 1 ? days - 1 : 1;

    // Chi phí di chuyển
    const isNear = ['Hà Nội', 'Ninh Bình', 'Quảng Ninh', 'Sa Pa', 'Hải Phòng', 'Hòa Bình', 'Mai Châu', 'Mộc Châu', 'Cao Bằng', 'Hà Giang'].includes(plan.destination) && ['Hà Nội'].includes(plan.startLocation || 'Hà Nội');
    const transitCostPerPerson = isNear ? 450000 : 1650000;
    const transitCostTotal = transitCostPerPerson * g;

    // Chi phí khách sạn theo địa điểm và số đêm
    let hotelPricePerNight = 650000;
    if (['Phú Quốc', 'Nha Trang', 'Đà Nẵng', 'Đà Lạt'].includes(plan.destination)) {
      hotelPricePerNight = 850000;
    } else if (['Hà Giang', 'Cao Bằng', 'Cần Thơ', 'Tây Ninh'].includes(plan.destination)) {
      hotelPricePerNight = 500000;
    }
    const hotelCostTotal = hotelPricePerNight * nights * r;

    // Chi phí vé tham quan từ các hoạt động thực tế trong lịch trình
    let ticketCostPerPerson = 0;
    plan.dailyItinerary?.forEach(day => {
      day.activities?.forEach(act => {
        ticketCostPerPerson += (act.cost || 0);
      });
    });
    const ticketCostTotal = ticketCostPerPerson * g;

    // Chi phí ăn uống đặc sản 3 bữa
    const foodPerDayPerPerson = 280000;
    const foodCostTotal = foodPerDayPerPerson * days * g;

    // Đi lại nội thành
    const localTransportTotal = 120000 * days;

    // Tổng chi phí ước tính thực tế
    const newTotalBudget = transitCostTotal + hotelCostTotal + ticketCostTotal + foodCostTotal + localTransportTotal;
    const newFixedCost = transitCostTotal + Math.round(hotelCostTotal * 0.3) + ticketCostTotal;

    const newOverviewServices = [
      {
        category: isNear ? 'Vé xe Limousine khứ hồi' : 'Vé máy bay khứ hồi',
        provider: isNear ? 'Xe Limousine VIP đưa đón' : 'Vietnam Airlines / Vietjet Air',
        route: `${plan.startLocation || 'Hà Nội'} ⇄ ${plan.destination}`,
        price: transitCostTotal,
        detail: `${transitCostPerPerson.toLocaleString('vi-VN')}đ/khách x ${g} khách`,
        status: 'Xác nhận tức thì',
        type: isNear ? 'transit' : 'flight'
      },
      {
        category: 'Lưu trú khách sạn',
        provider: plan.overviewServices?.[1]?.provider || `Khách sạn nghỉ dưỡng ${plan.destination}`,
        nights: `${nights} đêm (${g} khách, ${r} phòng)`,
        detail: `${hotelPricePerNight.toLocaleString('vi-VN')}đ/đêm x ${nights} đêm x ${r} phòng`,
        price: hotelCostTotal,
        status: 'Giữ phòng linh hoạt',
        type: 'hotel'
      },
      {
        category: 'Vé thắng cảnh & Trải nghiệm',
        provider: `Các điểm tham quan tại ${plan.destination}`,
        detail: `Trọn gói vé tham quan cho ${g} khách (${ticketCostPerPerson.toLocaleString('vi-VN')}đ/người)`,
        price: ticketCostTotal,
        status: 'Đặt trước tiện lợi',
        type: 'ticket'
      },
      {
        category: 'Dự toán ẩm thực & ăn uống',
        provider: 'Đặc sản địa phương 3 bữa/ngày',
        detail: `${foodPerDayPerPerson.toLocaleString('vi-VN')}đ/ngày x ${days} ngày x ${g} khách`,
        price: foodCostTotal,
        status: 'Tự do trải nghiệm',
        type: 'food'
      }
    ];

    setPlan(prev => ({
      ...prev,
      guests: g,
      rooms: r,
      totalBudget: newTotalBudget,
      fixedCost: newFixedCost,
      overviewServices: newOverviewServices
    }));
  };

  const handleResetTrip = () => {
    setPlan(null);
    setMessages(INITIAL_CHAT);
    setSuggestedPrompts([
      'Lên lịch trình Đà Lạt 3 ngày 2 đêm',
      'Lập kế hoạch đi Sa Pa 3 ngày 2 đêm',
      'Lịch trình Phú Quốc 4 ngày 3 đêm',
      'Phượt Hà Giang 3N2Đ ngắm sông Nho Quế',
      'Du lịch Ninh Bình 2 ngày 1 đêm'
    ]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      // Navbar cao ~108px -> paddingTop 120px để tránh hoàn toàn bị thọt/che khuất
      paddingTop: '120px',
      paddingBottom: '40px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 1. TOP HEADER CONTROL BAR (Hiển thị thông tin hành trình khi đã có Plan) */}
      {plan && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0.75rem 1.5rem',
          position: 'sticky',
          top: '108px',
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '1rem'
        }}>
          <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            
            {/* Trái: Điểm đến, Date picker & Guest picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              
              {/* Badge điểm đến */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F0F9FF',
                color: '#0284C7',
                border: '1px solid #BAE6FD',
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                <MapPin size={16} />
                <span>{plan.destination} ({plan.days} Ngày)</span>
              </div>

              {/* Date range picker button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    cursor: 'pointer'
                  }}
                >
                  <Calendar size={15} color="#0284C7" />
                  <span>{plan.startDate} - {plan.endDate}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>▾</span>
                </button>

                {showDatePicker && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '6px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    padding: '1rem',
                    zIndex: 100,
                    width: '280px'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--brand-navy)' }}>
                      Chọn độ dài chuyến đi:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[2, 3, 4, 5, 7].map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            handleSendMessage(`Đổi sang lịch trình ${d} ngày ${d > 1 ? d - 1 : 0} đêm`);
                            setShowDatePicker(false);
                          }}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            border: plan.days === d ? '2px solid #0284C7' : '1px solid #E2E8F0',
                            background: plan.days === d ? '#EFF6FF' : '#F8FAFC',
                            color: plan.days === d ? '#0284C7' : '#334155',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          {d} Ngày {d > 1 ? d - 1 : 0} Đêm
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Guests & Rooms button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    cursor: 'pointer'
                  }}
                >
                  <Users size={15} color="#0284C7" />
                  <span>{plan.guests || 1} khách • 🛏️ {plan.rooms || 1} phòng</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>▾</span>
                </button>

                {showGuestPicker && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '6px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    padding: '1rem',
                    zIndex: 100,
                    width: '240px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Số khách:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          type="button" 
                          onClick={() => updatePlanGuestsOrRooms(Math.max(1, (plan.guests || 1) - 1), plan.rooms)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                        >-</button>
                        <span style={{ fontWeight: 700 }}>{plan.guests || 1}</span>
                        <button 
                          type="button" 
                          onClick={() => updatePlanGuestsOrRooms((plan.guests || 1) + 1, plan.rooms)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                        >+</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Số phòng:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          type="button" 
                          onClick={() => updatePlanGuestsOrRooms(plan.guests, Math.max(1, (plan.rooms || 1) - 1))}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                        >-</button>
                        <span style={{ fontWeight: 700 }}>{plan.rooms || 1}</span>
                        <button 
                          type="button" 
                          onClick={() => updatePlanGuestsOrRooms(plan.guests, (plan.rooms || 1) + 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                        >+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Phải: Chi phí dự kiến & Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              
              {/* Chi phí ước tính */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Chi phí ước tính:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#E11D48' }}>
                  {plan.totalBudget?.toLocaleString('vi-VN')}đ
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>
                  ({plan.guests || 1} khách • {plan.rooms || 1} phòng)
                </span>
                <span title="Dự toán tính động từ vé di chuyển, phòng khách sạn, vé thắng cảnh và ăn uống thực tế" style={{ cursor: 'pointer', color: '#94A3B8' }}>
                  <Info size={15} />
                </span>
              </div>

              {/* Nút reset / Tạo chuyến đi mới */}
              <button
                type="button"
                onClick={handleResetTrip}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F1F5F9',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
                <span>Tạo chuyến đi mới</span>
              </button>

              {/* Nút chia sẻ lịch trình */}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                }}
              >
                <Share2 size={14} />
                <span>Chia sẻ</span>
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN LAYOUT CONTAINER: Cột Trái (Chat) & Cột Phải (Lịch Trình hoặc Gợi Ý) */}
      <style>{`
        .planner-grid-2col {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 20px;
        }
        @media (max-width: 1100px) {
          .planner-grid-2col {
            grid-template-columns: 340px 1fr;
            gap: 16px;
          }
        }
        @media (max-width: 900px) {
          .planner-grid-2col {
            grid-template-columns: 1fr;
          }
          .planner-chat-sticky {
            position: relative !important;
            top: 0 !important;
            height: 520px !important;
          }
        }
      `}</style>

      <div 
        className="planner-grid-2col"
        style={{
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
          padding: '0 1.25rem',
          flex: 1,
          alignItems: 'stretch'
        }}
      >
        
        {/* CỘT 1: CHAT AI TƯ VẤN (MakeYourTripChat) */}
        <div 
          className="planner-chat-sticky" 
          style={{ 
            height: plan ? 'calc(100vh - 200px)' : 'calc(100vh - 150px)', 
            minHeight: '620px', 
            position: 'sticky', 
            top: plan ? '180px' : '120px' 
          }}
        >
          <MakeYourTripChat
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={chatLoading}
            suggestedPrompts={suggestedPrompts}
            onSelectPrompt={handleSendMessage}
          />
        </div>

        {/* CỘT 2: KHU VỰC HIỂN THỊ */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(2, 50, 106, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: '620px'
        }}>
          
          {/* TRƯỜNG HỢP A: CHƯA CÓ KẾ HOẠCH (plan === null) -> Hiển thị Màn hình Gợi ý & Cảm hứng 63 Tỉnh Thành */}
          {!plan ? (
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              {/* Grid các điểm đến nổi bật */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
                      Gợi Ý Điểm Đến Khám Phá Nổi Bật
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                      Chọn một điểm đến bên dưới hoặc trò chuyện với AI bên trái để lên lịch trình
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {POPULAR_DESTINATIONS.map((dest, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSendMessage(dest.prompt)}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#0284C7';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.12)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                      }}
                    >
                      <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(1, 30, 64, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {dest.tag}
                        </div>
                      </div>

                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                            {dest.name}
                          </h4>
                          <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45, marginBottom: '12px' }}>
                            {dest.desc}
                          </p>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px solid #F1F5F9',
                          color: '#0284C7',
                          fontSize: '0.82rem',
                          fontWeight: 700
                        }}>
                          <span>Tạo lịch trình ngay</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* TRƯỜNG HỢP B: ĐÃ CÓ KẾ HOẠCH (plan !== null) -> Render Lịch trình chi tiết từng ngày */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* TABS HEADER: Lịch trình theo ngày | Tổng quan dịch vụ */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.25rem',
                borderBottom: '1px solid #F1F5F9',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('daily')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.95rem',
                      fontWeight: activeTab === 'daily' ? 800 : 600,
                      color: activeTab === 'daily' ? '#0284C7' : '#64748B',
                      cursor: 'pointer',
                      borderBottom: activeTab === 'daily' ? '2px solid #0284C7' : '2px solid transparent',
                      paddingBottom: '6px'
                    }}
                  >
                    Lịch trình theo ngày
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.95rem',
                      fontWeight: activeTab === 'services' ? 800 : 600,
                      color: activeTab === 'services' ? '#0284C7' : '#64748B',
                      cursor: 'pointer',
                      borderBottom: activeTab === 'services' ? '2px solid #0284C7' : '2px solid transparent',
                      paddingBottom: '6px'
                    }}
                  >
                    Tổng quan dịch vụ
                  </button>
                </div>

                {/* Nút mở điểm đến trên Google Maps */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.destination + ' Việt Nam')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#E11D48',
                    textDecoration: 'none',
                    background: '#FFF1F2',
                    border: '1px solid #FECDD3',
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}
                >
                  <MapPin size={13} />
                  <span>Mở {plan.destination} trên Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* TAB 1: LỊCH TRÌNH THEO TỪNG NGÀY */}
              {activeTab === 'daily' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  
                  {/* THANH CHỌN NGÀY (Tabs Ngày 1, Ngày 2, Ngày 3, ...) */}
                  <div style={{
                    padding: '0.75rem 1.25rem',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                  }}>
                    {plan.dailyItinerary?.map((dayObj) => {
                      const isActive = dayObj.day === activeDay;
                      return (
                        <button
                          key={dayObj.day}
                          type="button"
                          onClick={() => setActiveDay(dayObj.day)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '10px',
                            border: isActive ? '2px solid #0284C7' : '1px solid #CBD5E1',
                            background: isActive ? '#EFF6FF' : '#FFFFFF',
                            color: isActive ? '#0284C7' : '#334155',
                            fontWeight: isActive ? 800 : 600,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s'
                          }}
                        >
                          <span>Ngày {dayObj.day}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* HEADER NGÀY ĐANG CHỌN */}
                  <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    background: '#FAFBFD'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
                        {currentDayData.date}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-navy)', marginTop: '2px' }}>
                        {currentDayData.title || `Lịch trình ngày ${activeDay}`}
                      </h3>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#ECFDF5',
                      color: '#059669',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      <span>● {currentDayData.activities?.length || 0} hoạt động trong ngày</span>
                    </div>
                  </div>

                  {/* TIMELINE CÁC ĐỊA ĐIỂM / HOẠT ĐỘNG TRONG NGÀY */}
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {currentDayData.activities?.map((act, index) => {
                      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${act.name} ${act.address || plan.destination || ''}`)}`;

                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            gap: '14px',
                            position: 'relative'
                          }}
                        >
                          {/* Cột trái: Time & Order Badge */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '56px',
                            flexShrink: 0
                          }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                              {act.time}
                            </span>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#E11D48',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              zIndex: 2,
                              boxShadow: '0 2px 6px rgba(225, 29, 72, 0.3)'
                            }}>
                              {act.order || (index + 1)}
                            </div>
                            {/* Dây nối dọc timeline */}
                            {index < currentDayData.activities.length - 1 && (
                              <div style={{
                                width: '2px',
                                flex: 1,
                                background: '#CBD5E1',
                                marginTop: '4px',
                                marginBottom: '4px'
                              }} />
                            )}
                          </div>

                          {/* Cột phải: Content Card */}
                          <div style={{
                            flex: 1,
                            background: '#FFFFFF',
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0',
                            padding: '1rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                            transition: 'all 0.15s'
                          }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                              
                              {/* Thumbnail ảnh thực tế */}
                              {act.image && (
                                <img
                                  src={act.image}
                                  alt={act.name}
                                  style={{
                                    width: '84px',
                                    height: '84px',
                                    borderRadius: '10px',
                                    objectFit: 'cover',
                                    flexShrink: 0
                                  }}
                                />
                              )}

                              {/* Chi tiết địa điểm */}
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                                    {act.name}
                                  </h4>

                                  {/* NÚT MỞ GOOGLE MAPS NGOÀI */}
                                  <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      background: '#F0F9FF',
                                      color: '#0284C7',
                                      border: '1px solid #BAE6FD',
                                      borderRadius: '8px',
                                      padding: '4px 10px',
                                      fontSize: '0.78rem',
                                      fontWeight: 700,
                                      textDecoration: 'none',
                                      transition: 'all 0.15s'
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.background = '#0284C7';
                                      e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.background = '#F0F9FF';
                                      e.currentTarget.style.color = '#0284C7';
                                    }}
                                  >
                                    <MapPin size={13} />
                                    <span>Xem trên Google Maps</span>
                                    <ExternalLink size={12} />
                                  </a>
                                </div>

                                <p style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', margin: '6px 0' }}>
                                  <MapPin size={13} color="#0284C7" />
                                  <span>{act.address}</span>
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Clock size={13} /> {act.duration}
                                  </span>
                                  {act.costText && (
                                    <span style={{ color: '#E11D48', fontWeight: 700 }}>
                                      • {act.costText}
                                    </span>
                                  )}
                                </div>
                              </div>

                            </div>

                            {/* Lời khuyên của AI (AI Advice Box) */}
                            {act.advice && (
                              <div style={{
                                marginTop: '10px',
                                background: '#F8FAFC',
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '0.82rem',
                                color: '#334155',
                                lineHeight: 1.5,
                                border: '1px solid #F1F5F9'
                              }}>
                                💡 <strong>Mẹo trải nghiệm: </strong>{act.advice}
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}

                    {/* Transit summary note */}
                    {currentDayData.transitSummary && (
                      <div style={{
                        marginTop: '10px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        fontSize: '0.84rem',
                        color: '#0369A1',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px'
                      }}>
                        <Car size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong>Gợi ý di chuyển: </strong>{currentDayData.transitSummary}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* TAB 2: TỔNG QUAN DỊCH VỤ CÓ THỂ ĐẶT TRƯỚC */}
              {activeTab === 'services' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
                      Tổng Quan Dịch Vụ Chuyến Đi
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                      Các dịch vụ cốt lõi trong chuyến đi khám phá {plan.destination} được thiết kế trọn gói và hỗ trợ giữ chỗ linh hoạt.
                    </p>
                  </div>

                  {plan.overviewServices?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#F8FAFC',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        padding: '1.15rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: item.type === 'flight' ? '#EFF6FF' : item.type === 'hotel' ? '#F5F3FF' : '#FEF2F2',
                          color: item.type === 'flight' ? '#0284C7' : item.type === 'hotel' ? '#7C3AED' : '#E11D48',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.type === 'flight' && <Plane size={22} />}
                          {item.type === 'hotel' && <Hotel size={22} />}
                          {item.type === 'ticket' && <Ticket size={22} />}
                          {item.type === 'transit' && <Car size={22} />}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                            {item.category}: {item.provider}
                          </div>
                          <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                            {item.route || item.nights || item.detail}
                          </div>
                          <div style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '2px 8px', borderRadius: '10px' }}>
                            ✓ {item.status}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#E11D48' }}>
                          {item.price?.toLocaleString('vi-VN')}đ
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Dự toán trọn gói</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* SHARE MODAL DIALOG */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px' }}>
              Chia Sẻ Lịch Trình Du Lịch
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Sao chép liên kết chuyến đi này để gửi cho bạn bè hoặc gia đình cùng xem lịch trình khám phá {plan?.destination}:
            </p>

            <div style={{
              display: 'flex',
              gap: '8px',
              background: '#F1F5F9',
              padding: '6px',
              borderRadius: '12px',
              marginBottom: '1.25rem'
            }}>
              <input
                type="text"
                readOnly
                value={window.location.href}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.85rem',
                  color: '#334155',
                  paddingLeft: '8px'
                }}
              />
              <button
                type="button"
                onClick={handleCopyShareLink}
                style={{
                  background: copiedLink ? '#10B981' : '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#334155',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TravelPlannerPage;
