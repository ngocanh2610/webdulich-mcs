
const VIETNAM_PROVINCES_DATA = {
  'Vịnh Hạ Long': {
    region: 'Quảng Ninh',
    coords: { lat: 20.9500, lng: 107.0733 },
    attractions: [
      { name: 'Du thuyền Vịnh Hạ Long & Hang Sửng Sốt', address: 'Vịnh Hạ Long, TP. Hạ Long, Quảng Ninh', duration: '4 giờ', cost: 290000, costText: 'Dự kiến: 290.000đ vé vịnh + thuyền', lat: 20.8933, lng: 107.0867, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Hang động thạch nhũ kỳ vĩ bậc nhất thế giới; nên mang giày thể thao chống trơn trượt.' },
      { name: 'Đảo Titop & Bãi tắm vầng trăng khuyết', address: 'Vịnh Hạ Long, Quảng Ninh', duration: '2 giờ', cost: 0, costText: 'Đã bao gồm trong vé vịnh', lat: 20.8583, lng: 107.0805, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Leo hơn 400 bậc đá lên chòi quan sát để ngắm toàn cảnh 360 độ Vịnh Hạ Long tuyệt mỹ.' },
      { name: 'Hang Luồn & Chèo thuyền Kayak', address: 'Vịnh Hạ Long, Quảng Ninh', duration: '1 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/thuyền kayak', lat: 20.8712, lng: 107.0912, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Tự tay chèo kayak xuyên qua cổng vòm ngập nước ngắm đàn khỉ vàng đu vách đá.' },
      { name: 'Làng chài Cửa Vạn giữa lòng di sản', address: 'Vịnh Hạ Long, Quảng Ninh', duration: '2 giờ', cost: 0, costText: 'Tham quan trên lộ trình tàu', lat: 20.8655, lng: 107.1234, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Khám phá văn hóa ngư dân làng chài nổi cổ kính nằm giữa thung lũng đá vôi bình yên.' },
      { name: 'Động Thiên Cung & Hang Đầu Gỗ', address: 'Đảo Đầu Gỗ, Vịnh Hạ Long', duration: '2 giờ', cost: 0, costText: 'Bao gồm trong vé tuyến 1', lat: 20.9167, lng: 107.0167, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Cung điện thạch nhũ huyền ảo với hệ thống đèn chiếu nghệ thuật tráng lệ.' },
      { name: 'Bãi biển Bãi Cháy & Phố cổ Sun World', address: 'Đường Hạ Long, Bãi Cháy, TP. Hạ Long', duration: '3 giờ', cost: 0, costText: 'Miễn phí tắm biển & dạo phố', lat: 20.9578, lng: 107.0422, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát trắng mịn nhân tạo trải dài 3km; tản bộ con phố mô phỏng phố cổ Hội An và Hà Nội.' },
      { name: 'Cáp treo Nữ Hoàng & Vòng quay Mặt Trời Sun Wheel', address: 'Bãi Cháy & Đồi Ba Đèo, Hạ Long', duration: '3 giờ', cost: 350000, costText: 'Dự kiến: 350.000đ/vé cáp treo + Sun Wheel', lat: 20.9556, lng: 107.0656, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Cabin 2 tầng đạt kỷ lục Guinness thế giới; ngắm toàn cảnh cầu Bãi Cháy và vịnh biển từ trên cao.' },
      { name: 'Bảo tàng Quảng Ninh & Cung Quy Hoạch Cá Heo', address: 'Trần Quốc Nghiễn, Hồng Gai, Hạ Long', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 20.9508, lng: 107.0989, image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc khối kính đen tuyền huyền bí bên bờ vịnh; địa điểm check-in biểu tượng của Hạ Long.' }
    ],
    foods: [
      { name: 'Bánh cuốn chả mực Bà Ngân', dish: 'Bánh cuốn tráng mỏng chả mực giã tay nóng hổi', address: '34 Đoàn Thị Điểm, Bạch Đằng, Hạ Long', costText: 'Dự kiến: 45.000đ - 60.000đ/suất', lat: 20.9520, lng: 107.0850, advice: 'Chả mực tươi giòn sần sật mới chiên vàng ươm ăn kèm nước mắm chấm chua ngọt.' },
      { name: 'Bún bề bề Cầu Trắng', dish: 'Bún bề bề tôm nõn chả mực nước lèo ngọt thanh', address: 'Đường Nguyễn Văn Cừ, Hồng Hà, Hạ Long', costText: 'Dự kiến: 40.000đ - 55.000đ/bát', lat: 20.9480, lng: 107.1020, advice: 'Thịt bề bề chắc ngọt tự nhiên hòa cùng nước dùng hầm xương tôm thơm phức.' },
      { name: 'Nhà hàng Sam biển Bãi Cháy', dish: 'Sam 7 món: chân sam xào chua ngọt, trứng sam nướng', address: 'Khu Cái Dăm, Bãi Cháy, Hạ Long', costText: 'Dự kiến: 200.000đ - 350.000đ/người', lat: 20.9600, lng: 107.0250, advice: 'Đặc sản biển độc đáo chỉ có ở vùng nước mặn sâu; thịt ngọt thơm lạ miệng.' },
      { name: 'Sữa chua trân châu Hạ Long Cô Nghi', dish: 'Sữa chua trân châu dẻo nước cốt dừa ấm', address: 'Số 10 Văn Lang, Hồng Gai, Hạ Long', costText: 'Dự kiến: 25.000đ - 35.000đ/ly', lat: 20.9515, lng: 107.0870, advice: 'Thương hiệu sữa chua trân châu chính gốc ra đời từ hơn 20 năm trước.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đêm Bãi Cháy & Chợ đêm hải sản', address: 'Đường Hoàng Quốc Việt, Bãi Cháy, Hạ Long', advice: 'Hòa mình vào không khí nhộn nhịp, thưởng thức hải sản nướng vỉa hè và mua đồ lưu niệm.' },
      { name: 'Du thuyền ngắm hoàng hôn & Ăn tối sang trọng trên Vịnh', address: 'Cảng tàu khách quốc tế Hạ Long', advice: 'Trải nghiệm ngắm vịnh lúc lên đèn rực rỡ, thưởng thức tiệc buffet và âm nhạc sống.' },
      { name: 'Check-in Sun Wheel & Ngắm cầu Bãi Cháy rực rỡ đèn LED', address: 'Đồi Ba Đèo, Hồng Gai, Hạ Long', advice: 'Tận hưởng gió biển mát rượi từ đỉnh đồi và ngắm toàn cảnh thành phố biển lung linh.' },
      { name: 'Thưởng thức sữa chua trân châu & Mua chả mực giã tay làm quà', address: 'Chợ Hạ Long 1 / Phố đi bộ Bãi Cháy', advice: 'Mua chả mực hút chân không tại chợ hải sản lớn nhất tỉnh để làm quà cho người thân.' }
    ],
    hotel: { name: 'Resort / Khách sạn view Vịnh Hạ Long Bãi Cháy', address: 'Đường Hạ Long, Phường Bãi Cháy, TP. Hạ Long', price: '750.000đ - 2.200.000đ/đêm' }
  },

  'Cát Bà': {
    region: 'Hải Phòng',
    coords: { lat: 20.7275, lng: 107.0464 },
    attractions: [
      { name: 'Du thuyền Vịnh Lan Hạ & Đảo Khỉ', address: 'Vịnh Lan Hạ, Quần đảo Cát Bà, Hải Phòng', duration: '4 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ vé tàu ghép', lat: 20.7200, lng: 107.0800, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Nước biển xanh trong màu ngọc bích phẳng lặng; tắm biển tại bãi Cát Dứa và xem khỉ hoang.' },
      { name: 'Hang Sáng - Hang Tối (Kayak vịnh Lan Hạ)', address: 'Khu bảo tồn biển Cát Bà, Vịnh Lan Hạ', duration: '2 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ/thuyền kayak', lat: 20.7500, lng: 107.0950, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Tự tay chèo thuyền nan hoặc kayak qua hang ngầm thăm vịnh biển kín hoang sơ tĩnh mịch.' },
      { name: 'Vườn Quốc Gia Cát Bà & Đỉnh Ngự Lâm', address: 'Xã Trân Châu, Huyện Cát Hải, Hải Phòng', duration: '3 giờ 30 phút', cost: 80000, costText: 'Dự kiến: 80.000đ/vé vào cổng', lat: 20.7850, lng: 106.9950, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Trekking xuyên rừng nguyên sinh cây kim giao, chinh phục đỉnh Ngự Lâm ngắm trập trùng núi đá vôi.' },
      { name: 'Làng chài cổ Cái Bèo hơn 7.000 năm', address: 'Bến Bèo, Thị trấn Cát Bà, Hải Phòng', duration: '1 giờ 30 phút', cost: 30000, costText: 'Dự kiến: 30.000đ/vé tham quan', lat: 20.7230, lng: 107.0580, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Làng chài biển cổ nhất Việt Nam với hàng trăm nhà bè nổi nuôi cá lồng giữa lòng vịnh.' },
      { name: 'Bãi tắm Cát Cò 1, 2, 3 & Đường mòn ven vách đá', address: 'Thị trấn Cát Bà, Huyện Cát Hải', duration: '2 giờ', cost: 0, costText: 'Miễn phí tắm biển', lat: 20.7180, lng: 107.0520, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Đi bộ trên con đường lát gỗ men vách núi nối Cát Cò 1 và Cát Cò 3 ngắm sóng vỗ tuyệt đẹp.' },
      { name: 'Di tích Pháo Đài Thần Công (Cao điểm 177)', address: 'Đồi Pháo Đài, TT Cát Bà, Hải Phòng', duration: '2 giờ', cost: 80000, costText: 'Dự kiến: 80.000đ/vé', lat: 20.7150, lng: 107.0420, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Cứ điểm quân sự lịch sử với 2 khẩu đại pháo thời Pháp; điểm ngắm hoàng hôn biển đẹp nhất đảo.' },
      { name: 'Làng cổ Việt Hải & Đạp xe thung lũng', address: 'Xã Việt Hải, Huyện Cát Hải, Hải Phòng', duration: '3 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ thuê xe đạp', lat: 20.7600, lng: 107.0600, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi làng cô lập giữa thung lũng rừng sâu; đạp xe ngắm lúa, trải nghiệm massage cá suối tự nhiên.' },
      { name: 'Hang Quân Y trong lòng núi đá vôi', address: 'Xã Gia Luận, Huyện Cát Hải, Hải Phòng', duration: '1 giờ 30 phút', cost: 80000, costText: 'Dự kiến: 80.000đ/vé', lat: 20.7720, lng: 106.9850, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Bệnh viện dã chiến 3 tầng kiên cố xây dựng bí mật trong lòng hang đá thời kháng chiến chống Mỹ.' }
    ],
    foods: [
      { name: 'Tu hài Cát Bà nướng mỡ hành', dish: 'Tu hài biển tươi giòn ngọt béo ngậy đậu phộng', address: 'Nhà bè nổi Bến Bèo / Đường Một Tháng Tư', costText: 'Dự kiến: 120.000đ - 180.000đ/đĩa', lat: 20.7240, lng: 107.0500, advice: 'Đặc sản trứ danh vùng biển Cát Bà, thịt tu hài giòn sần sật ngọt đậm đà.' },
      { name: 'Bề bề rang muối Cát Bà', dish: 'Bề bề biển to chắc thịt rang muối thơm nồng', address: 'Nhà hàng Viễn Dương, TT Cát Bà', costText: 'Dự kiến: 180.000đ - 250.000đ/đĩa', lat: 20.7260, lng: 107.0470, advice: 'Bề bề đánh bắt trong ngày, vỏ giòn thơm thịt chắc nịch chấm muối ớt xanh.' },
      { name: 'Bún tôm Cát Bà', dish: 'Bún tôm nõn biển chả cá thu nước lèo thơm ngọt', address: 'Chợ trung tâm Cát Bà, Đường Một Tháng Tư', costText: 'Dự kiến: 40.000đ - 55.000đ/bát', lat: 20.7280, lng: 107.0440, advice: 'Bữa sáng đậm chất ngư dân đảo với vị ngọt thanh từ tôm biển tươi rói.' },
      { name: 'Ghẹ xanh hấp sả Làng chài Cái Bèo', dish: 'Ghẹ tươi vớt tại lồng hấp sả chấm tiêu chanh', address: 'Bè nổi Cái Bèo, Thị trấn Cát Bà', costText: 'Dự kiến: 350.000đ - 450.000đ/kg', lat: 20.7220, lng: 107.0550, advice: 'Thịt ghẹ đầm vị biển tự nhiên, ăn ngay tại bè nổi trên mặt nước lộng gió.' }
    ],
    eveningActivities: [
      { name: 'Tản bộ đường ven biển Một Tháng Tư & Ăn vặt chợ đêm', address: 'Đường Một Tháng Tư, TT Cát Bà', advice: 'Thưởng thức kem cuộn, dừa xiêm mát lạnh và ngắm thuyền bè neo đậu lung linh ngoài vịnh.' },
      { name: 'Trải nghiệm câu mực đêm trên biển Cát Bà', address: 'Bến tàu du lịch Cát Bà', advice: 'Lên tàu cùng ngư dân trải nghiệm bật đèn câu mực ống tươi sống và luộc ăn ngay tại chỗ.' },
      { name: 'Chill tại quán bar bờ biển ngắm Vịnh Lan Hạ đêm', address: 'Bãi biển Cát Cò 1 & Cát Cò 3', advice: 'Thưởng thức cocktail nhẹ nhàng, lắng nghe tiếng sóng biển rì rào vỗ vào vách đá.' },
      { name: 'Dạo chợ đêm Cát Bà & Mua nước mắm Cát Hải làm quà', address: 'Khu chợ đêm trung tâm Cát Bà', advice: 'Mua nước mắm Cát Hải cốt truyền thống, mực khô một nắng và cá thu một nắng chính gốc.' }
    ],
    hotel: { name: 'Resort / Khách sạn view Vịnh Lan Hạ Cát Bà', address: 'Đường Một Tháng Tư / Bãi Cát Cò, TT Cát Bà, Hải Phòng', price: '600.000đ - 1.800.000đ/đêm' }
  },

  'Đồ Sơn': {
    region: 'Hải Phòng',
    coords: { lat: 20.7061, lng: 106.7865 },
    attractions: [
      { name: 'Bãi tắm Khu 2 Đồ Sơn', address: 'Vạn Hương, Quận Đồ Sơn, Hải Phòng', duration: '3 giờ', cost: 0, costText: 'Miễn phí tắm biển', lat: 20.7020, lng: 106.7900, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi tắm nhộn nhịp nhất Đồ Sơn với bờ cát thoai thoải và sóng biển dạt dào.' },
      { name: 'Khu du lịch Quốc tế Đồi Rồng (Dragon Ocean)', address: 'Phường Vạn Hương, Quận Đồ Sơn, Hải Phòng', duration: '3 giờ 30 phút', cost: 150000, costText: 'Dự kiến: 150.000đ vé công viên nước', lat: 20.6950, lng: 106.7820, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Tổ hợp nghỉ dưỡng siêu sang với bãi biển nhân tạo nước trong xanh, công viên nước và sân golf.' },
      { name: 'Dinh Vua Bảo Đại trên đồi Vung', address: 'Khu 2 Đồ Sơn, Quận Đồ Sơn, Hải Phòng', duration: '1 giờ 30 phút', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 20.7050, lng: 106.7930, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Biệt thự nghỉ hè cổ kính của vị hoàng đế cuối cùng thời nhà Nguyễn, ngắm toàn cảnh bán đảo Đồ Sơn.' },
      { name: 'Đảo Hòn Dấu & Đèn biển Hòn Dấu 120 năm', address: 'Đảo Hòn Dấu, Quận Đồ Sơn, Hải Phòng', duration: '3 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ vé tàu ra đảo', lat: 20.6670, lng: 106.8170, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Khu rừng nguyên sinh hoang sơ giữa biển khơi; chiêm bái Đền Nam Hải Thần Vương linh thiêng.' },
      { name: 'Đền Bà Đế linh thiêng chân núi Độc', address: 'Chân núi Độc, Ngọc Hải, Đồ Sơn', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng đền', lat: 20.7200, lng: 106.7800, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi đền oan khiên linh ứng thờ bà Đế tựa lưng vào vách đá núi, mặt hướng ra sóng biển rì rào.' },
      { name: 'Quần thể Di tích Tháp Tường Long', address: 'Đỉnh núi Ngọc, Phường Ngọc Xuyên, Đồ Sơn', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.7180, lng: 106.7720, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Di tích phật giáo thời Lý nghìn năm tuổi đứng sừng sững trên đỉnh núi Ngọc lộng gió.' },
      { name: 'Bến K15 - Khởi điểm Đường Hồ Chí Minh trên biển', address: 'Chân đồi Nghinh Phong, Vạn Hương, Đồ Sơn', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 20.6980, lng: 106.7950, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Di tích lịch sử thiêng liêng, nơi xuất phát của những con tàu không số cảm tử chi viện cho miền Nam.' },
      { name: 'Bãi tắm Vạn Hương & Rặng thông ven đèo', address: 'Đường Vạn Hoa, Đồ Sơn, Hải Phòng', duration: '2 giờ', cost: 0, costText: 'Dạo bộ tự do', lat: 20.7080, lng: 106.7850, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Cung đường ven đèo rợp bóng thông reo mát rượi, lý tưởng để chụp ảnh ngắm hoàng hôn buông.' }
    ],
    foods: [
      { name: 'Cua rang me Đồ Sơn', dish: 'Cua biển gạch son sốt me chua cay đậm vị biển', address: 'Nhà hàng Bến Nghiêng / Khu 2 Đồ Sơn', costText: 'Dự kiến: 350.000đ - 500.000đ/kg', lat: 20.7030, lng: 106.7890, advice: 'Cua Đồ Sơn chắc thịt béo bùi thấm đẫm sốt me chấm bánh mì giòn tan.' },
      { name: 'Bánh đa cua bể Đồ Sơn', dish: 'Bánh đa đỏ cua bể tôm nõn bề bề chả lá lốt', address: 'Phố Lý Thánh Tông, Đồ Sơn', costText: 'Dự kiến: 45.000đ - 65.000đ/bát', lat: 20.7150, lng: 106.7750, advice: 'Hương vị biển đặc trưng của đất Cảng với thịt cua tươi thơm lừng.' },
      { name: 'Nộm sứa Đồ Sơn chấm bỗng rượu', dish: 'Sứa đỏ giòn sần sật cuốn lá sung chuối xanh chấm bỗng', address: 'Đường Vạn Bún, Khu 1 Đồ Sơn', costText: 'Dự kiến: 50.000đ - 80.000đ/đĩa', lat: 20.7100, lng: 106.7830, advice: 'Món ăn giải nhiệt mùa hè giòn mát, lạ miệng và đậm chất dân dã ven biển.' },
      { name: 'Cá mòi kho Đồ Sơn & Ốc hương nướng', dish: 'Cá mòi kho nhừ xương hương gừng sả ớt', address: 'Khu ẩm thực Bến K15 Đồ Sơn', costText: 'Dự kiến: 120.000đ - 200.000đ/phần', lat: 20.7000, lng: 106.7920, advice: 'Đặc sản cá mòi đánh bắt tại cửa biển Đồ Sơn kho niêu ăn cùng cơm trắng nóng hổi.' }
    ],
    eveningActivities: [
      { name: 'Dạo mát bờ kè bãi biển Đồ Sơn & Thưởng thức dừa xiêm', address: 'Đường bao biển Khu 2 Đồ Sơn', advice: 'Hóng gió biển mát lành, nghe tiếng sóng vỗ rì rào và uống nước dừa xiêm ngọt lịm.' },
      { name: 'Xem nhạc nước tại quảng trường Khu du lịch Quốc tế Đồi Rồng', address: 'Quảng trường Dragon Ocean Đồ Sơn', advice: 'Mãn nhãn với màn trình diễn nhạc nước ánh sáng hiện đại hoành tráng bên bờ biển.' },
      { name: 'Thưởng thức tiệc hải sản nướng vỉa hè bến Nghiêng gió lộng', address: 'Khu vực Bến Nghiêng Đồ Sơn', advice: 'Ngồi nhâm nhi ốc biển nướng, mực một nắng nướng than hồng sát mép biển đêm.' },
      { name: 'Dạo phố đêm Đồ Sơn & Mua táo bàng, mực khô Đồ Sơn làm quà', address: 'Trung tâm Quận Đồ Sơn', advice: 'Táo bàng Đồ Sơn giòn ngọt và mực khô câu Đồ Sơn là những thức quà biển quý giá.' }
    ],
    hotel: { name: 'Resort Đồi Rồng / Khách sạn Bãi tắm Đồ Sơn', address: 'Khu du lịch Quốc tế Đồi Rồng / Vạn Hương, Đồ Sơn, Hải Phòng', price: '550.000đ - 1.500.000đ/đêm' }
  },

  'Tà Xùa': {
    region: 'Sơn La',
    coords: { lat: 21.2655, lng: 104.4719 },
    attractions: [
      { name: 'Sống Lưng Khủng Long Háng Đồng', address: 'Bản Háng Đồng, Xã Háng Đồng, Bắc Yên, Sơn La', duration: '3 giờ 30 phút', cost: 0, costText: 'Miễn phí (Xe ôm: 60.000đ/lượt)', lat: 21.2389, lng: 104.5122, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Dải sống núi hẹp vươn thẳng ra giữa biển mây ngút ngàn; thời điểm săn mây đẹp nhất từ 6h00 - 8h00 sáng.' },
      { name: 'Đỉnh Gió Tà Xùa & Săn biển mây hoàng hôn', address: 'Xã Tà Xùa, Huyện Bắc Yên, Sơn La', duration: '2 giờ', cost: 0, costText: 'Miễn phí ngắm cảnh', lat: 21.2680, lng: 104.4690, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Điểm săn mây xế chiều và đón ánh hoàng hôn rực đỏ nhuộm vàng biển mây bồng bềnh.' },
      { name: 'Mỏm Cá Heo Tà Xùa', address: 'Đường lên bản Mùa Trù Lùng, Xã Tà Xùa', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 21.2850, lng: 104.4450, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Khối đá tự nhiên nhô ra vách núi có hình thù như chú cá heo bơi giữa ngàn mây kỳ vĩ.' },
      { name: 'Cây Cô Đơn Tà Xùa (Ngắm Suối Sập)', address: 'Xã Háng Đồng, Bắc Yên, Sơn La', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí check-in', lat: 21.2550, lng: 104.4850, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Cây táo mèo cổ thụ đứng sừng sững bên bờ vực, nhìn xuống lòng hồ thủy điện Suối Sập thơ mộng.' },
      { name: 'Rừng Trúc Háng Đồng (Rừng kiếm hiệp)', address: 'Bản Háng Đồng, Bắc Yên, Sơn La', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé vào rừng', lat: 21.2420, lng: 104.5050, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Hàng vạn thân trúc xanh mướt vút cao tạo khung cảnh ma mị như trong các bộ phim cổ trang.' },
      { name: 'Mỏm Đá Đầu Rùa & Đỉnh Phình Hồ', address: 'Xã Tà Xùa, Huyện Bắc Yên, Sơn La', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 21.2750, lng: 104.4550, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Phiến đá nhô hẳn ra không trung nhìn về thung lũng Bản Công, trải nghiệm cảm giác mạnh.' },
      { name: 'Rừng chè Shan Tuyết cổ thụ Bản Bẹ', address: 'Bản Bẹ, Xã Tà Xùa, Bắc Yên, Sơn La', duration: '2 giờ 30 phút', cost: 0, costText: 'Tự do trải nghiệm', lat: 21.2580, lng: 104.4520, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chiêm ngưỡng những cây chè cổ thụ hàng trăm năm tuổi thân phủ đầy rêu phong địa y giữa mây mờ.' },
      { name: 'Thảo nguyên Tà Xùa & Đồi cỏ bay', address: 'Xã Tà Xùa, Bắc Yên, Sơn La', duration: '2 giờ', cost: 0, costText: 'Tự do dã ngoại', lat: 21.2720, lng: 104.4820, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thảm cỏ xanh ngút tầm mắt thoai thoải lộng gió, cực kỳ thích hợp để dựng lều cắm trại ngắm sao.' }
    ],
    foods: [
      { name: 'Lẩu gà đen H’Mông Tà Xùa', dish: 'Gà đen xương đen hầm nấm rừng táo mèo ấm nồng', address: 'Nhà hàng Homestay Mây Tà Xùa', costText: 'Dự kiến: 350.000đ - 450.000đ/nồi', lat: 21.2660, lng: 104.4710, advice: 'Thịt gà đen vùng cao săn chắc ngọt thơm, húp nước lẩu nóng ấm bốc khói xua tan sương lạnh.' },
      { name: 'Thịt trâu gác bếp & Lợn bản nướng mắc khén', dish: 'Thịt nướng than hoa đượm hạt dổi mắc khén rừng', address: 'Quán ăn Bản Bẹ, Xã Tà Xùa', costText: 'Dự kiến: 150.000đ - 220.000đ/đĩa', lat: 21.2600, lng: 104.4650, advice: 'Mùi khói củi tự nhiên quyện vị cay the của mắc khén chấm cùng chẩm chéo ướt chính hiệu.' },
      { name: 'Pa pỉnh tộp cá suối nướng & Cơm lam', dish: 'Cá suối nướng gập lá rau răm thì là kèm cơm nếp nương', address: 'Khu ẩm thực Trung tâm xã Tà Xùa', costText: 'Dự kiến: 100.000đ - 160.000đ/phần', lat: 21.2670, lng: 104.4700, advice: 'Món ăn truyền thống của người Thái vùng cao, cá suối thịt ngọt thơm ngào ngạt.' },
      { name: 'Trà Shan Tuyết cổ thụ Bản Bẹ', dish: 'Trà búp cổ thụ nước vàng óng ngọt hậu sâu sắc', address: 'Xưởng chế biến trà Bản Bẹ, Tà Xùa', costText: 'Dự kiến: 30.000đ/ấm trà', lat: 21.2580, lng: 104.4530, advice: 'Thưởng trà trên đỉnh đồi se lạnh ngắm biển mây cuồn cuộn là thú vui tao nhã bậc nhất.' }
    ],
    eveningActivities: [
      { name: 'Ngồi bên bếp lửa nướng ngô khoai & Nhâm nhi trà nóng', address: 'Không gian sưởi ấm tại Homestay Tà Xùa', advice: 'Hít hà củ khoai mật nóng hổi nướng than hồng, cảm nhận cái lạnh 12-15 độ C vùng cao Tây Bắc.' },
      { name: 'Tiệc nướng BBQ thịt bản ngắm biển mây đêm dưới ánh trăng', address: 'Khu sân vườn view thung lũng homestay Tà Xùa', advice: 'Thịt xiên nướng than xèo xèo, quây quần cùng bạn bè thưởng thức rượu táo mèo thơm ngào ngạt.' },
      { name: 'Chill acoustic tại quán cafe săn mây ngắm bầu trời sao', address: 'Tiệm cafe Mị Ơi / Thào Coffee Tà Xùa', advice: 'Không gian gỗ mộc ấm cúng với những bản nhạc ballad du dương nhìn ra thung lũng đèn đêm mờ ảo.' },
      { name: 'Giao lưu văn hóa lửa trại cùng đồng bào H’Mông bản địa', address: 'Bản Tà Xùa A, Xã Tà Xùa', advice: 'Lắng nghe tiếng khèn Mông véo von và tìm hiểu nét sinh hoạt văn hóa mộc mạc của bà con vùng cao.' }
    ],
    hotel: { name: 'Homestay view thung lũng mây Tà Xùa / Đỉnh Gió', address: 'Trung tâm Xã Tà Xùa, Huyện Bắc Yên, Sơn La', price: '400.000đ - 1.100.000đ/đêm' }
  },

  'Tam Đảo': {
    region: 'Miền Bắc',
    coords: { lat: 21.4583, lng: 105.6458 },
    attractions: [
      { name: 'Quảng trường & Thị trấn Tam Đảo', address: 'Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 21.4580, lng: 105.6455, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Tản bộ ngắm thị trấn sương mờ phong cách Châu Âu; chụp ảnh đài phun nước trung tâm.' },
      { name: 'Nhà thờ Đá Cổ Tam Đảo', address: 'Dốc Tam Đảo, Vĩnh Phúc', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 21.4570, lng: 105.6465, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic Pháp cổ bằng đá xanh rêu phong đứng sừng sững trên sườn núi; ngắm toàn cảnh thung lũng.' },
      { name: 'Cầu Mây Tam Đảo (Tổ hợp săn mây)', address: 'Thôn 2, Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', lat: 21.4520, lng: 105.6410, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Cây cầu đan bằng tre nứa len lỏi giữa biển mây bồng bềnh và đồi hoa dã quỳ rực rỡ.' },
      { name: 'Quán Gió Tam Đảo (Cà phê trên mây)', address: 'Thôn 1, Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ', cost: 60000, costText: 'Đồ uống: 50.000đ - 80.000đ', lat: 21.4590, lng: 105.6440, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Quán cà phê nhô ra vách đá không có mái che, nơi đón gió ngàn và ngắm biển mây xế chiều.' },
      { name: 'Quần thể Danh thắng Tây Thiên', address: 'Xã Đại Đình, Huyện Tam Đảo, Vĩnh Phúc', duration: '4 giờ', cost: 240000, costText: 'Dự kiến: 240.000đ vé cáp treo khứ hồi', lat: 21.4850, lng: 105.6150, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Miền đất Phật thanh tịnh và Đền Quốc Mẫu Tây Thiên linh thiêng giữa rừng nguyên sinh.' },
      { name: 'Tháp Truyền Hình Tam Đảo & Đền Bà Chúa', address: 'Đỉnh núi Thiên Nhị, Thị trấn Tam Đảo', duration: '3 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 21.4650, lng: 105.6520, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chinh phục gần 1.400 bậc đá rợp bóng cây cổ thụ lên đỉnh núi cao 1.375m ngắm trọn vẹn mây trời.' },
      { name: 'Thác Bạc Tam Đảo', address: 'Thung lũng sâu, Thị trấn Tam Đảo', duration: '2 giờ', cost: 0, costText: 'Tự do ngắm cảnh', lat: 21.4550, lng: 105.6470, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Dòng thác đổ từ trên vách núi cao xuống bọt tung trắng xóa như dải lụa bạc giữa rừng cây.' },
      { name: 'Vườn Quốc Gia Tam Đảo & Đồi thông', address: 'Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 21.4700, lng: 105.6350, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Hệ sinh thái rừng mưa nhiệt đới trong lành mát rượi, lý tưởng để dã ngoại và hòa mình vào thiên nhiên.' }
    ],
    foods: [
      { name: 'Ngọn su su xào tỏi Tam Đảo', dish: 'Ngọn su su tươi non xào tỏi giòn ngọt', address: 'Khu ẩm thực dốc chợ Tam Đảo', costText: 'Dự kiến: 50.000đ/đĩa', lat: 21.4580, lng: 105.6460, advice: 'Đặc sản trứ danh Tam Đảo, ngọn su su giòn sần sật xào cháy tỏi thơm lừng.' },
      { name: 'Gà đồi Tam Đảo nướng đất sét', dish: 'Gà đồi thả rông nướng than hoa', address: 'Nhà hàng Phố Mây Tam Đảo', costText: 'Dự kiến: 300.000đ - 350.000đ/con', lat: 21.4575, lng: 105.6450, advice: 'Thịt gà săn chắc da vàng óng giòn rụm chấm muối tiêu chanh ớt rừng.' },
      { name: 'Thịt bò tái kiến đốt', dish: 'Bò tươi nướng than hồng thơm the vị kiến', address: 'Trung tâm ẩm thực Tam Đảo', costText: 'Dự kiến: 200.000đ - 300.000đ/đĩa', lat: 21.4590, lng: 105.6455, advice: 'Món ăn độc lạ mang hương vị the thơm đặc trưng của các tổ kiến rừng Tam Đảo.' },
      { name: 'Lợn mán nướng xiên than hoa', dish: 'Thịt lợn mán bản nướng riềng mẻ thơm nức', address: 'Dốc chợ đêm Tam Đảo', costText: 'Dự kiến: 80.000đ - 120.000đ/đĩa', lat: 21.4582, lng: 105.6462, advice: 'Thịt thơm bùi bì giòn dai chấm muối ớt mắc khén thơm nức lòng du khách.' }
    ],
    eveningActivities: [
      { name: 'Dạo chợ đêm Tam Đảo ngắm sương mờ', address: 'Khu phố trung tâm Tam Đảo', advice: 'Thưởng thức ngô nướng, khoai nướng, trứng gà nướng nóng hổi giữa tiết trời se lạnh.' },
      { name: 'Cafe acoustic ngắm toàn cảnh thị trấn từ trên cao', address: 'Quán Gió / Cỏ Lạ Coffee Tam Đảo', advice: 'Lắng nghe những bản nhạc acoustic trữ tình, ngắm thị trấn lung linh mờ ảo trong sương đêm.' },
      { name: 'Tiệc nướng BBQ sưởi ấm thời tiết se lạnh', address: 'Khu sân vườn Homestay Tam Đảo', advice: 'Thịt nướng xèo xèo bên bếp than hồng cùng gia đình, tận hưởng trọn vẹn không khí đồi núi.' },
      { name: 'Tản bộ quảng trường & Mua ngọn su su tươi làm quà', address: 'Quảng trường Tam Đảo', advice: 'Chọn mua ngọn su su tươi hái buổi chiều từ các vườn su su địa phương đem về làm quà.' }
    ],
    hotel: { name: 'Resort / Homestay view mây Tam Đảo', address: 'Khu phố 1 / Khu phố 2, Tam Đảo, Vĩnh Phúc', price: '600.000đ - 1.400.000đ/đêm' }
  },

  'Hà Nam': {
    region: 'Miền Bắc',
    coords: { lat: 20.5450, lng: 105.9125 },
    attractions: [
      { name: 'Khu du lịch Chùa Tam Chúc & Du thuyền', address: 'Thị trấn Ba Sao, Kim Bảng, Hà Nam', duration: '4 giờ', cost: 200000, costText: 'Dự kiến: 200.000đ du thuyền + xe điện', lat: 20.5360, lng: 105.8200, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi thuyền trên hồ Lục Nhạc ngắm 6 ngọn núi nổi bồng bềnh; chiêm bái Điện Tam Thế nguy nga.' },
      { name: 'Đền Trúc - Ngũ Động Thi Sơn', address: 'Thôn Quyển Sơn, Thi Sơn, Kim Bảng, Hà Nam', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 20.5500, lng: 105.8750, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Rừng trúc xanh mát rợp bóng bên sông Đáy và 5 hang động đá vôi kỳ bí luồn trong lòng núi.' },
      { name: 'Làng Vũ Đại & Nhà Bá Kiến nguyên bản', address: 'Xã Hòa Hậu, Huyện Lý Nhân, Hà Nam', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.4850, lng: 106.0500, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi nhà 3 gian gỗ lim hơn 100 năm tuổi nguyên bản của Bá Kiến trong tác phẩm Nam Cao.' },
      { name: 'Chùa Bà Đanh & Núi Ngọc', address: 'Thôn Đanh, Ngọc Sơn, Kim Bảng, Hà Nam', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', lat: 20.5420, lng: 105.8650, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa cổ tĩnh mịch bên dòng sông Đáy gắn với câu thành ngữ "vắng như chùa Bà Đanh".' },
      { name: 'Đền Lăng Tiên Lục Nam Xương', address: 'Xã Chân Lý, Huyện Lý Nhân, Hà Nam', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.5100, lng: 106.0200, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Nơi thờ danh nhân Vũ Nương trong "Chuyện người con gái Nam Xương" bên dòng sông Hồng.' },
      { name: 'Bát Cảnh Sơn danh thắng Kim Bảng', address: 'Xã Tượng Lĩnh, Kim Bảng, Hà Nam', duration: '2 giờ 30 phút', cost: 0, costText: 'Tự do vãn cảnh', lat: 20.5700, lng: 105.8400, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể 8 ngọn núi và các ngôi chùa cổ trầm mặc soi bóng xuống dòng sông mát lành.' },
      { name: 'Làng dệt lụa tơ tằm Nha Xá hơn 700 năm', address: 'Xã Mộc Nam, Thị xã Duy Tiên, Hà Nam', duration: '2 giờ', cost: 0, costText: 'Tự do trải nghiệm', lat: 20.6100, lng: 105.9500, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Làng nghề dệt lụa tơ tằm nổi tiếng chỉ sau lụa Vạn Phúc với chất lụa mềm mượt óng ả.' },
      { name: 'Chùa Phật Quang Thanh Liêm', address: 'Thôn Dư Dưỡng, Thanh Phong, Thanh Liêm, Hà Nam', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng chùa', lat: 20.4700, lng: 105.9200, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa có cảnh quan thanh tịnh với tiểu cảnh vườn sỏi trắng, hồ sen và đèn đá phong cách Nhật Bản.' }
    ],
    foods: [
      { name: 'Cá kho làng Vũ Đại (Cá kho Bá Kiến)', dish: 'Cá trắm đen kho niêu đất 16 tiếng củi nhãn', address: 'Làng Hòa Hậu, Lý Nhân, Hà Nam', costText: 'Dự kiến: 500.000đ - 800.000đ/niêu', lat: 20.4860, lng: 106.0520, advice: 'Thịt cá chắc nịch xương nhừ tơi thấm đẫm riềng, gừng, nước cốt cua đồng ăn cùng cơm nóng.' },
      { name: 'Bánh cuốn chả Phủ Lý', dish: 'Bánh cuốn tráng mỏng chả nướng than hoa', address: 'Đường Trần Phú / Biên Hòa, TP. Phủ Lý', costText: 'Dự kiến: 35.000đ - 50.000đ/suất', lat: 20.5400, lng: 105.9150, advice: 'Ăn nguội cùng nước mắm ấm chua ngọt thả chả thịt nướng xém cạnh thơm nức mũi.' },
      { name: 'Bún cá rô đồng Phủ Lý', dish: 'Bún cá rô đồng chiên giòn rau cải cúc', address: 'Đường Lê Công Thanh, TP. Phủ Lý', costText: 'Dự kiến: 35.000đ - 45.000đ/bát', lat: 20.5420, lng: 105.9180, advice: 'Thịt cá rô đồng ngọt đậm đà, nước dùng ninh từ xương cá ngọt thanh tự nhiên.' },
      { name: 'Chuối ngự Đại Hoàng tiến vua', dish: 'Chuối ngự vỏ mỏng ruột vàng thơm lừng', address: 'Xã Hòa Hậu, Lý Nhân, Hà Nam', costText: 'Dự kiến: 35.000đ - 50.000đ/nải', lat: 20.4840, lng: 106.0480, advice: 'Chuối nhỏ xinh ruột vàng óng, vị ngọt đậm đà xưa kia chuyên dâng tiến các vị vua.' }
    ],
    eveningActivities: [
      { name: 'Dạo bộ phố đi bộ Phủ Lý bờ sông Đáy', address: 'Bờ sông Đáy, TP. Phủ Lý, Hà Nam', advice: 'Tản bộ ngắm cầu Châu Sơn lên đèn, tận hưởng làn gió mát lành từ dòng sông Đáy.' },
      { name: 'Thưởng thức chè sen Long Nhãn & bánh đa Kiện Khê', address: 'Khu ẩm thực chợ Bầu, TP. Phủ Lý', advice: 'Bánh đa giòn rụm bùi hạt vừng và bát chè hạt sen ngọt dịu thanh mát.' },
      { name: 'Chiêm ngưỡng cảnh đêm lung linh tại Chùa Tam Chúc', address: 'Khu du lịch Tam Chúc, Ba Sao, Hà Nam', advice: 'Quần thể chùa lên đèn rực rỡ soi bóng xuống mặt hồ Lục Nhạc huyền ảo.' },
      { name: 'Thưởng thức đặc sản đồng quê & Mua cá kho niêu làm quà', address: 'TP. Phủ Lý / Làng Vũ Đại', advice: 'Đặt mua niêu cá kho truyền thống đóng hộp chuyên nghiệp đem về làm quà biếu.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Phủ Lý / Ba Sao', address: 'TP. Phủ Lý / Khu du lịch Tam Chúc, Hà Nam', price: '450.000đ - 950.000đ/đêm' }
  },

  'Hà Nội': {
    region: 'Miền Bắc',
    coords: { lat: 21.0285, lng: 105.8542 },
    attractions: [
      { name: 'Hồ Hoàn Kiếm & Đền Ngọc Sơn', address: 'Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé vào đền', lat: 21.0305, lng: 105.8524, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Đi cầu Thê Húc son đỏ, ngắm Tháp Rùa cổ kính giữa lòng thủ đô.' },
      { name: 'Văn Miếu - Quốc Tử Giám', address: '58 Quốc Tử Giám, Đống Đa, Hà Nội', duration: '2 giờ', cost: 70000, costText: 'Dự kiến: 70.000đ/vé', lat: 21.0294, lng: 105.8360, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Trường đại học đầu tiên của Việt Nam; chiêm bái 82 bia tiến sĩ vinh danh hiền tài.' },
      { name: 'Lăng Chủ tịch Hồ Chí Minh & Chùa Một Cột', address: 'Số 2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng Lăng', lat: 21.0368, lng: 105.8346, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Mở cửa buổi sáng; trang phục trang nghiêm lịch sự, không mang máy ảnh vào phòng viếng.' },
      { name: 'Phố Cổ 36 Phố Phường & Chợ Đồng Xuân', address: 'Hàng Ngang, Hàng Đào, Hoàn Kiếm, Hà Nội', duration: '2 giờ 30 phút', cost: 0, costText: 'Dạo bộ tự do', lat: 21.0378, lng: 105.8500, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', advice: 'Dạo quanh các con phố thủ công cổ kính, thưởng thức cà phê trứng và kem Tràng Tiền.' },
      { name: 'Hoàng Thành Thăng Long di sản UNESCO', address: '19C Hoàng Diệu, Điện Biên, Ba Đình, Hà Nội', duration: '2 giờ 30 phút', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 21.0345, lng: 105.8402, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Trung tâm quyền lực chính trị suốt 13 thế kỷ; tham quan di tích khảo cổ Đoan Môn, Cột Cờ.' },
      { name: 'Hồ Tây & Chùa Trấn Quốc cổ nhất', address: 'Đường Thanh Niên, Tây Hồ, Hà Nội', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng chùa', lat: 21.0480, lng: 105.8370, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa hơn 1.500 năm soi bóng mặt hồ Tây; địa điểm ngắm hoàng hôn đẹp nhất thủ đô.' },
      { name: 'Nhà hát Lớn Hà Nội & Phố Tràng Tiền', address: 'Số 1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm', duration: '1 giờ 30 phút', cost: 0, costText: 'Ngắm kiến trúc bên ngoài', lat: 21.0245, lng: 105.8575, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc phong cách Tân cổ điển Pháp tuyệt mỹ; thưởng thức kem Tràng Tiền danh tiếng.' },
      { name: 'Cầu Long Biên lịch sử trăm năm', address: 'Bắc qua sông Hồng, Hoàn Kiếm - Long Biên', duration: '1 giờ 30 phút', cost: 0, costText: 'Tản bộ tự do', lat: 21.0425, lng: 105.8565, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Cây cầu thép lịch sử chứng kiến thăng trầm của Hà Nội; điểm check-in đậm chất hoài niệm.' }
    ],
    foods: [
      { name: 'Phở Bát Đàn gia truyền', dish: 'Phở bò tái nạm gia truyền nước thơm gừng', address: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', costText: 'Dự kiến: 60.000đ/bát', lat: 21.0335, lng: 105.8475, advice: 'Nước dùng trong thơm gừng thảo quả, xếp hàng gọi món theo phong cách truyền thống.' },
      { name: 'Bún chả Hương Liên (Bún chả Obama)', dish: 'Bún chả nướng than hoa, nem cua bể giòn', address: '24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội', costText: 'Dự kiến: 65.000đ/suất', lat: 21.0185, lng: 105.8530, advice: 'Chả miếng chả băm nướng thơm lừng chấm nước mắm giấm tỏi ớt cà rốt đu đủ.' },
      { name: 'Chả cá Lã Vọng thơm thì là', dish: 'Cá lăng chiên chảo nóng ăn kèm bún mắm tôm', address: '14 Phố Chả Cá, Hoàn Kiếm, Hà Nội', costText: 'Dự kiến: 150.000đ - 180.000đ/suất', lat: 21.0360, lng: 105.8490, advice: 'Món ăn hơn 100 năm tuổi của Hà Nội, cá lăng vàng ruộm xào thì là hành hoa thơm nức.' },
      { name: 'Cà phê Giảng (Cà phê trứng 1946)', dish: 'Cà phê kem trứng nóng bông mịn', address: '39 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội', costText: 'Dự kiến: 35.000đ/cốc', lat: 21.0340, lng: 105.8540, advice: 'Lớp kem trứng bông mịn béo ngậy quyện vị cà phê đậm đà ra đời từ năm 1946.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đi bộ Hồ Gươm nghe nhạc đường phố', address: 'Khu vực quanh Hồ Hoàn Kiếm, Hà Nội', advice: 'Hòa mình vào không gian nghệ thuật ngoài trời sôi động, các trò chơi dân gian cuối tuần.' },
      { name: 'Khám phá ngõ bia Tạ Hiện phố Tây không ngủ', address: 'Phố Tạ Hiện, Hàng Buồm, Hoàn Kiếm', advice: 'Ngồi ghế nhựa uống bia hơi, ăn nem chua rán và hòa vào nhịp sống trẻ trung về đêm.' },
      { name: 'Thưởng thức kem Tràng Tiền & Dạo phố Tràng Tiền rợp bóng', address: '35 Tràng Tiền, Hoàn Kiếm, Hà Nội', advice: 'Ăn ốc quế cốm, vani truyền thống và tản bộ ngắm Nhà hát Lớn lên đèn rực rỡ.' },
      { name: 'Xem múa rối nước Thăng Long & Ăn phở gánh đêm', address: 'Nhà hát Múa rối nước Thăng Long, 57B Đinh Tiên Hoàng', advice: 'Thưởng thức nghệ thuật rối nước dân gian độc đáo và kết thúc bằng tô phở đêm phố cổ.' }
    ],
    hotel: { name: 'Khách sạn phố cổ Hoàn Kiếm', address: 'Khu vực Phố Cổ / Hồ Gươm, Hà Nội', price: '600.000đ - 1.500.000đ/đêm' }
  },

  'Ninh Bình': {
    region: 'Miền Bắc',
    coords: { lat: 20.2506, lng: 105.9745 },
    attractions: [
      { name: 'Quần thể danh thắng Tràng An di sản kép', address: 'Xã Trường Yên, Huyện Hoa Lư, Ninh Bình', duration: '3 giờ 30 phút', cost: 250000, costText: 'Dự kiến: 250.000đ/vé thuyền', lat: 20.2580, lng: 105.9120, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Di sản thế giới kép UNESCO; ngồi thuyền nan qua các hang động kỳ thú và phim trường Kong.' },
      { name: 'Hang Múa & Đỉnh Ngọa Long', address: 'Thôn Khê Hạ, Ninh Xuân, Hoa Lư, Ninh Bình', duration: '2 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ/vé', lat: 20.2310, lng: 105.9320, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chinh phục gần 500 bậc đá ngắm toàn cảnh thung lũng Tam Cốc và dòng sông Ngô Đồng.' },
      { name: 'Chùa Bái Đính đại cổ tự lớn nhất Đông Nam Á', address: 'Xã Gia Sinh, Huyện Gia Viễn, Ninh Bình', duration: '3 giờ', cost: 60000, costText: 'Dự kiến: 60.000đ/vé xe điện khứ hồi', lat: 20.2680, lng: 105.8580, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể chùa lớn nhất Đông Nam Á với hành lang 500 tượng La Hán và Bảo tháp cao vút.' },
      { name: 'Tam Cốc - Bích Động & Sông Ngô Đồng', address: 'Xã Ninh Hải, Huyện Hoa Lư, Ninh Bình', duration: '2 giờ 30 phút', cost: 120000, costText: 'Dự kiến: 120.000đ vé thuyền Tam Cốc', lat: 20.2180, lng: 105.9350, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Đi thuyền nan luồn qua 3 hang đá tự nhiên giữa những ruộng lúa vàng óng ả mùa lúa chín.' },
      { name: 'Cố đô Hoa Lư đền Vua Đinh Vua Lê', address: 'Xã Trường Yên, Huyện Hoa Lư, Ninh Bình', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 20.2850, lng: 105.9050, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Kinh đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam với kiến trúc đền cổ trang nghiêm.' },
      { name: 'Vườn chim Thung Nham & Động Tiên Cá', address: 'Xã Ninh Hải, Hoa Lư, Ninh Bình', duration: '3 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ/vé trọn gói', lat: 20.2050, lng: 105.9150, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Ngắm hàng vạn cá thể chim trời rợp bóng bay về tổ lúc hoàng hôn buông xuống thung lũng.' },
      { name: 'Khu bảo tồn đất ngập nước Đầm Vân Long', address: 'Xã Gia Vân, Gia Viễn, Ninh Bình', duration: '2 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ vé đò', lat: 20.3550, lng: 105.8650, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Vịnh không sóng với mặt nước phẳng như gương phản chiếu vách núi đá và loài Voọc mông trắng quý hiếm.' },
      { name: 'Nhà thờ đá Phát Diệm độc nhất vô nhị', address: 'Thị trấn Phát Diệm, Kim Sơn, Ninh Bình', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.0920, lng: 106.0790, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể thánh đường Công giáo bằng đá và gỗ lim nguy nga mang đậm kiến trúc mái đình chùa Á Đông.' }
    ],
    foods: [
      { name: 'Thịt dê núi Ninh Bình Chính Thư', dish: 'Dê tái chanh, dê nướng tảng, dê xào lăn', address: 'Thôn Khê Thượng, Ninh Xuân, Hoa Lư', costText: 'Dự kiến: 180.000đ - 250.000đ/người', lat: 20.2400, lng: 105.9300, advice: 'Dê leo núi đá ăn lá thuốc tự nhiên thịt thơm ngọt săn chắc không hề có mùi gây.' },
      { name: 'Cơm cháy Ninh Bình sốt dê', dish: 'Cơm cháy giòn rụm chấm nước sốt tim cật dê', address: 'Đường Tràng An, TP. Ninh Bình', costText: 'Dự kiến: 80.000đ - 120.000đ/đĩa', lat: 20.2550, lng: 105.9700, advice: 'Hạt cơm gạo nếp hương chiên vàng ruộm giòn tan đẫm sốt béo ngậy đậm đà.' },
      { name: 'Gỏi cá nhệch Kim Sơn', dish: 'Gỏi cá nhệch cuốn lá sung bánh đa nước chấm mẻ chẻo', address: 'Thị trấn Phát Diệm, Kim Sơn, Ninh Bình', costText: 'Dự kiến: 150.000đ - 200.000đ/suất', lat: 20.0950, lng: 106.0820, advice: 'Vị bùi của lá sung, vị cay thơm của gừng ớt và vị ngọt béo ngậy của cá nhệch sông nước.' },
      { name: 'Xôi trứng kiến Nho Quan', dish: 'Xôi nếp nương đồ cùng trứng kiến rừng béo ngậy', address: 'Thị trấn Nho Quan, Ninh Bình', costText: 'Dự kiến: 60.000đ - 80.000đ/phần', lat: 20.3150, lng: 105.7480, advice: 'Món ăn độc đáo vùng đồi núi Nho Quan, hạt trứng kiến nổ lách tách béo bùi khó quên.' }
    ],
    eveningActivities: [
      { name: 'Khám phá Phố cổ Hoa Lư lên đèn rực rỡ bên hồ Kỳ Lân', address: 'Khu vực hồ Kỳ Lân, TP. Ninh Bình', advice: 'Tản bộ ngắm tháp Bạc lung linh, đi thuyền thả đèn hoa đăng và thưởng thức ẩm thực truyền thống.' },
      { name: 'Ngồi thuyền thả hoa đăng ngắm chùa Bái Đính về đêm', address: 'Khuôn viên chùa Bái Đính, Gia Sinh', advice: 'Bảo tháp Bái Đính thắp đèn lung linh rực sáng giữa màn đêm thanh tịnh đất Phật.' },
      { name: 'Thưởng thức ẩm thực dê núi đêm & Rượu cần Nho Quan', address: 'Khu phố ẩm thực Tràng An', advice: 'Ngồi nhâm nhi đĩa dê nướng than hoa, thưởng thức ngụm rượu cần cay nồng ấm bụng.' },
      { name: 'Cafe ngắm núi đá vôi về đêm tại trung tâm Tam Cốc', address: 'Khu phố du lịch Tam Cốc, Hoa Lư', advice: 'Tận hưởng không gian lãng mạn tại các quán pub, cafe view cánh đồng và núi đá tĩnh lặng.' }
    ],
    hotel: { name: 'Resort sinh thái / Homestay Tam Cốc Tràng An', address: 'Khu vực Tràng An / Tam Cốc, Ninh Bình', price: '500.000đ - 1.200.000đ/đêm' }
  },

  'Sa Pa': {
    region: 'Tây Bắc',
    coords: { lat: 22.3364, lng: 103.8438 },
    attractions: [
      { name: 'Đỉnh Fansipan 3.143m Nóc nhà Đông Dương', address: 'Ga cáp treo Sun World Fansipan Legend, Sa Pa', duration: '4 giờ', cost: 850000, costText: 'Dự kiến: 850.000đ/vé cáp treo', lat: 22.3033, lng: 103.7750, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chinh phục Nóc nhà Đông Dương; chuẩn bị áo ấm vì đỉnh gió mạnh và rất lạnh quanh năm.' },
      { name: 'Bản Cát Cát của người H’Mông', address: 'Xã Hoàng Liên, Thị xã Sa Pa, Lào Cai', duration: '3 giờ', cost: 90000, costText: 'Dự kiến: 90.000đ/vé', lat: 22.3280, lng: 103.8320, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thuê trang phục dân tộc thổ cẩm chụp ảnh bên cối xay nước, suối Hoa và cầu Si.' },
      { name: 'Đèo Ô Quy Hồ & Cổng Trời Sa Pa', address: 'Tuyến Quốc lộ 4D, ranh giới Lào Cai - Lai Châu', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí ngắm cảnh', lat: 22.3550, lng: 103.7720, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Một trong tứ đại đỉnh đèo Việt Nam; thời điểm ngắm hoàng hôn và biển mây đẹp nhất từ 16:30 - 17:30.' },
      { name: 'Núi Hàm Rồng & Vườn hoa trung tâm Sa Pa', address: 'Sau nhà thờ Đá Sa Pa, Thị xã Sa Pa', duration: '2 giờ 30 phút', cost: 70000, costText: 'Dự kiến: 70.000đ/vé', lat: 22.3330, lng: 103.8480, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Leo núi ngắm vườn lan rực rỡ, Cổng Trời và ngắm toàn cảnh thị trấn Sa Pa trong sương mù từ Sân Mây.' },
      { name: 'Bản Tả Van & Thung lũng Mường Hoa', address: 'Xã Tả Van, Thị xã Sa Pa, Lào Cai', duration: '3 giờ', cost: 75000, costText: 'Dự kiến: 75.000đ/vé tham quan', lat: 22.3020, lng: 103.8850, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Ruộng bậc thang uốn lượn tuyệt mỹ ven suối Mường Hoa; trải nghiệm nét mộc mạc người Giáy, H’Mông.' },
      { name: 'Thác Bạc & Thác Tình Yêu Vườn Quốc Gia', address: 'Quốc lộ 4D, Xã San Sả Hồ, Sa Pa', duration: '2 giờ 30 phút', cost: 70000, costText: 'Dự kiến: 70.000đ/vé thác Tình Yêu', lat: 22.3520, lng: 103.7850, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Dòng thác đổ từ độ cao 100m trắng xóa giữa rừng Hoàng Liên; suối Vàng óng ả huyền ảo.' },
      { name: 'Nhà thờ Đá Sa Pa cổ kính', address: 'Trung tâm Thị xã Sa Pa, Lào Cai', duration: '1 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 22.3345, lng: 103.8420, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic Pháp bằng đá đẽo từ năm 1895 nguyên vẹn; biểu tượng lịch sử của Sa Pa.' },
      { name: 'Bản Tả Phìn & Tắm lá thuốc người Dao đỏ', address: 'Xã Tả Phìn, Thị xã Sa Pa, Lào Cai', duration: '3 giờ', cost: 120000, costText: 'Dự kiến: 120.000đ ngâm bồn lá thuốc', lat: 22.3850, lng: 103.8750, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Thăm tu viện cổ Tả Phìn rêu phong và trải nghiệm ngâm lá thuốc bí truyền phục hồi thể lực.' }
    ],
    foods: [
      { name: 'Lẩu cá hồi & cá tầm Sa Pa', dish: 'Lẩu cá tươi sống, măng chua, rau cải mèo', address: 'Đường Xuân Viên / Fansipan, Sa Pa', costText: 'Dự kiến: 400.000đ - 600.000đ/nồi', lat: 22.3360, lng: 103.8410, advice: 'Thịt cá hồi chắc ngọt không ngấy, nhúng cùng măng chua và rau cải mèo đắng nhẹ giòn ngọt.' },
      { name: 'Thịt lợn cắp nách quay than hoa', dish: 'Lợn cắp nách nướng giòn bì chấm muối ớt mắc khén', address: 'Đường Điện Biên Phủ, Sa Pa', costText: 'Dự kiến: 180.000đ - 250.000đ/đĩa', lat: 22.3375, lng: 103.8450, advice: 'Lợn thả đồi tự nhiên thịt nạc chắc thơm, lớp bì giòn rụm không chút mỡ ngấy.' },
      { name: 'Thắng cố Sa Pa A Quỳnh', dish: 'Thắng cố ngựa truyền thống nấu thảo quả quế hồi', address: '15 Thạch Sơn, Thị xã Sa Pa', costText: 'Dự kiến: 250.000đ - 350.000đ/nồi', lat: 22.3350, lng: 103.8440, advice: 'Món ăn đại bổ truyền thống vùng cao thơm lừng mùi thảo dược Tây Bắc uống cùng rượu ngô Bản Phố.' },
      { name: 'Xôi ngũ sắc & Cơm lam nướng muối vừng', dish: 'Xôi lá cẩm lá nếp dẻo thơm hạt nếp nương', address: 'Chợ ẩm thực Sa Pa', costText: 'Dự kiến: 40.000đ - 60.000đ/phần', lat: 22.3340, lng: 103.8430, advice: 'Nhuộm màu hoàn toàn bằng cây cỏ tự nhiên của đồng bào, thơm dẻo bùi béo ngọt lành.' }
    ],
    eveningActivities: [
      { name: 'Dạo chợ đêm Sa Pa & Thưởng thức xiên nướng than hoa', address: 'Phố Cầu Mây / Chợ đêm Sa Pa', advice: 'Thịt cuốn nấm kim châm, cơm lam nướng, hạt dẻ nướng thơm lừng giữa thời tiết se lạnh.' },
      { name: 'Tham quan Nhà thờ Đá lung linh & Giao lưu chợ tình Sa Pa', address: 'Quảng trường trung tâm Sa Pa', advice: 'Xem các điệu múa khèn, biểu diễn văn nghệ truyền thống của các chàng trai cô gái H’Mông, Dao.' },
      { name: 'Trải nghiệm ngâm bồn tắm lá thuốc người Dao Đỏ thư giãn', address: 'Các cơ sở thảo dược uy tín tại Sa Pa', advice: 'Nước thuốc nóng ấm thơm thảo mộc giúp xua tan mệt mỏi sau ngày dài đi bộ tham quan.' },
      { name: 'Thưởng thức cafe view thung lũng Mường Hoa lãng đãng sương đêm', address: 'Đường Fansipan / Mường Hoa, Sa Pa', advice: 'Ngồi bên bếp sưởi nhâm nhi ly cafe nóng ấm nhìn ngắm thung lũng đèn đêm mờ sương.' }
    ],
    hotel: { name: 'Khách sạn view thung lũng Mường Hoa', address: 'Đường Fansipan / Mường Hoa, Sa Pa, Lào Cai', price: '600.000đ - 1.500.000đ/đêm' }
  },

  'Hà Giang': {
    region: 'Đông Bắc',
    coords: { lat: 22.8233, lng: 104.9839 },
    attractions: [
      { name: 'Cột Cờ Lũng Cú (Cực Bắc Tổ Quốc)', address: 'Xã Lũng Cú, Huyện Đồng Văn, Hà Giang', duration: '2 giờ 30 phút', cost: 25000, costText: 'Dự kiến: 25.000đ/vé', lat: 23.3600, lng: 105.3160, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chạm tay vào lá cờ đỏ sao vàng 54m2 biểu trưng cho 54 dân tộc anh em trên đỉnh núi Rồng.' },
      { name: 'Đèo Mã Pí Lèng & Hẻm Tu Sản Sông Nho Quế', address: 'Quốc lộ 4C nối Đồng Văn - Mèo Vạc, Hà Giang', duration: '3 giờ 30 phút', cost: 120000, costText: 'Dự kiến: 120.000đ vé thuyền sông Nho Quế', lat: 23.2450, lng: 105.4180, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Đi thuyền trên dòng sông Nho Quế xanh ngọc bích len qua hẻm vực sâu nhất Đông Nam Á.' },
      { name: 'Dinh Thự Vua Mèo họ Vương', address: 'Xã Sà Phìn, Huyện Đồng Văn, Hà Giang', duration: '1 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 23.2380, lng: 105.2550, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc pháo đài độc đáo kết hợp phong cách người Mông, người Hoa và kiến trúc Pháp.' },
      { name: 'Phố cổ Đồng Văn trăm năm', address: 'Thị trấn Đồng Văn, Hà Giang', duration: '2 giờ', cost: 0, costText: 'Dạo bộ tự do', lat: 23.2780, lng: 105.3620, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Những ngôi nhà trình tường cổ kính lợp ngói âm dương nép mình dưới chân vách núi đá vôi.' },
      { name: 'Cổng Trời Quản Bạ & Núi Đôi Cô Tiên', address: 'Thị trấn Tam Sơn, Huyện Quản Bạ, Hà Giang', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí ngắm cảnh', lat: 23.0600, lng: 104.9950, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Cửa ngõ bước vào Công viên địa chất toàn cầu Cao nguyên đá Đồng Văn; ngắm cặp núi đôi tròn trịa kỳ bí.' },
      { name: 'Rừng thông Yên Minh bạt ngàn', address: 'Xã Na Khê, Huyện Yên Minh, Hà Giang', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 23.1250, lng: 105.1500, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Cung đường thông reo xanh mướt ngỡ như lạc giữa cao nguyên Đà Lạt giữa lòng Đông Bắc.' },
      { name: 'Thung lũng Sủng Là & Nhà của Pao', address: 'Xã Sủng Là, Huyện Đồng Văn, Hà Giang', duration: '2 giờ', cost: 15000, costText: 'Dự kiến: 15.000đ/vé', lat: 23.2350, lng: 105.2850, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Bối cảnh bộ phim nổi tiếng "Chuyện của Pao", ngập tràn sắc hoa tam giác mạch và hoa cải vàng rực rỡ.' },
      { name: 'Dốc Thẩm Mã uốn lượn 9 khúc', address: 'Quốc lộ 4C, Huyện Đồng Văn, Hà Giang', duration: '1 giờ', cost: 0, costText: 'Check-in tự do', lat: 23.2100, lng: 105.2150, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Cung đèo quanh co khúc khuỷu huyền thoại từng là nơi thử sức ngựa thồ thời xưa.' }
    ],
    foods: [
      { name: 'Bánh cuốn trứng Phố Cổ Đồng Văn', dish: 'Bánh cuốn nóng chan nước xương hầm', address: 'Khu phố cổ Đồng Văn, Hà Giang', costText: 'Dự kiến: 35.000đ - 45.000đ/phần', lat: 23.2785, lng: 105.3625, advice: 'Khác biệt với bánh cuốn miền xuôi khi ăn kèm bát nước súp ninh xương ngọt lịm rắc hành hoa.' },
      { name: 'Cháo ấu tẩu Đồng Văn giải cảm', dish: 'Cháo ninh củ ấu tẩu chân giò béo ngậy', address: 'Đường Trần Phú, Thị trấn Đồng Văn', costText: 'Dự kiến: 40.000đ - 55.000đ/bát', lat: 23.2770, lng: 105.3610, advice: 'Món cháo độc đáo vị đắng dịu thanh mát giúp giải cảm và ngủ ngon sau ngày dài vượt đèo.' },
      { name: 'Thắng dền Phố Cổ Đồng Văn', dish: 'Bánh trôi mật dẻo nước gừng nóng rắc vừng lạc', address: 'Khu ẩm thực phố cổ Đồng Văn', costText: 'Dự kiến: 20.000đ - 30.000đ/bát', lat: 23.2790, lng: 105.3630, advice: 'Món ăn vặt ngọt ngào ấm sực cơ thể giữa sương đêm giá lạnh vùng cao nguyên đá.' },
      { name: 'Thịt lợn cắp nách gác bếp chấm chẩm chéo', dish: 'Thịt lợn bản hun khói xào măng ớt rừng', address: 'Nhà hàng Cao Nguyên Đá, Mèo Vạc', costText: 'Dự kiến: 150.000đ - 220.000đ/đĩa', lat: 23.1650, lng: 105.4120, advice: 'Thịt đượm mùi khói bếp củi tự nhiên ăn kèm rau cải mèo xào giòn ngọt đậm đà.' }
    ],
    eveningActivities: [
      { name: 'Dạo bộ Phố Cổ Đồng Văn nhâm nhi cafe Phố Cổ trăm năm', address: 'Phố cổ Đồng Văn, Hà Giang', advice: 'Ngồi trong ngôi nhà cổ trăm tuổi nghe nhạc ballad và ngắm mái ngói âm dương rêu phong về đêm.' },
      { name: 'Thưởng thức bát thắng dền nóng hổi bên bếp than hồng', address: 'Khu chợ cổ Đồng Văn', advice: 'Hít hà bát nước đường gừng cay nồng ấm áp xua tan cái lạnh sương mù vùng cao.' },
      { name: 'Tiệc lẩu gà đen vùng cao tại homestay Đồng Văn / Mèo Vạc', address: 'Làng văn hóa du lịch cộng đồng Pả Vi, Mèo Vạc', advice: 'Quây quần bên nồi lẩu gà đen nghi ngút khói cùng chén rượu ngô men lá thơm nồng.' },
      { name: 'Giao lưu văn nghệ khèn Mông & Uống rượu ngô bản địa', address: 'Khu chợ đêm Mèo Vạc', advice: 'Hòa mình vào tiếng khèn Mông và những điệu nhảy xòe truyền thống thắm tình bản địa.' }
    ],
    hotel: { name: 'Homestay bản địa / Khách sạn Đồng Văn', address: 'Thị trấn Đồng Văn / Mèo Vạc, Hà Giang', price: '300.000đ - 650.000đ/đêm' }
  },

  'Đà Nẵng': {
    region: 'Miền Trung',
    coords: { lat: 16.0544, lng: 108.2022 },
    attractions: [
      { name: 'Bãi Tắm Biển Mỹ Khê', address: 'Đường Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng', duration: '2 giờ', cost: 0, costText: 'Miễn phí tắm biển', lat: 16.0600, lng: 108.2450, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát trắng thoai thoải, thích hợp tắm biển buổi sáng sớm hoặc chiều mát.' },
      { name: 'Cổng Chùa Linh Ứng - Bán đảo Sơn Trà', address: 'Bãi Bụt, Thọ Quang, Sơn Trà, Đà Nẵng', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 16.1000, lng: 108.2750, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Chiêm bái tượng Phật Bà Quan Âm cao 67m hướng ra biển cả bao la.' },
      { name: 'Cầu Rồng & Cầu Tình Yêu', address: 'Nguyễn Văn Linh giao Trần Hưng Đạo, Hải Châu, Đà Nẵng', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí dạo phố', lat: 16.0610, lng: 108.2270, image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80', advice: 'Xem biểu diễn phun lửa và phun nước vào 21:00 tối thứ 7 & Chủ Nhật hàng tuần.' },
      { name: 'Sun World Bà Nà Hills & Cầu Vàng', address: 'Hòa Ninh, Hòa Vang, Đà Nẵng', duration: '6 giờ', cost: 900000, costText: 'Dự kiến: 900.000đ/vé cáp treo', lat: 15.9980, lng: 107.9870, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Nên đi sớm trước 8:00 để chụp ảnh Cầu Vàng trong sương sớm; mang theo áo khoác mỏng.' },
      { name: 'Danh thắng Ngũ Hành Sơn & Động Huyền Không', address: 'Hòa Hải, Ngũ Hành Sơn, Đà Nẵng', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 16.0040, lng: 108.2630, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Khám phá 5 ngọn núi Kim - Mộc - Thủy - Hỏa - Thổ và hang động thạch nhũ huyền ảo.' },
      { name: 'Bán đảo Sơn Trà & Đỉnh Bàn Cờ', address: 'Thọ Quang, Sơn Trà, Đà Nẵng', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 16.1150, lng: 108.2850, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Ngắm toàn cảnh vịnh Đà Nẵng từ độ cao gần 700m và tìm hiểu sự tích Đế Thích đánh cờ.' },
      { name: 'Bảo tàng Điêu khắc Chăm Đà Nẵng', address: 'Số 2 đường 2 Tháng 9, Hải Châu, Đà Nẵng', duration: '2 giờ', cost: 60000, costText: 'Dự kiến: 60.000đ/vé', lat: 21.0200, lng: 105.8500, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Nơi lưu giữ bộ sưu tập hiện vật điêu khắc Chăm Pa quy mô và quý giá nhất thế giới.' },
      { name: 'Cầu quay Sông Hàn biểu tượng kỹ nghệ', address: 'Nối Hải Châu và Sơn Trà, Đà Nẵng', duration: '1 giờ', cost: 0, costText: 'Dạo bộ tự do', lat: 16.0720, lng: 108.2270, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Cây cầu quay duy nhất tại Việt Nam, xoay trục 90 độ vào nửa đêm phục vụ tàu thuyền qua lại.' }
    ],
    foods: [
      { name: 'Mỳ Quảng Bà Mua', dish: 'Mỳ Quảng tôm thịt, ếch, gà ta kèm bánh tráng mè', address: '19 Trần Bình Trọng, Hải Châu, Đà Nẵng', costText: 'Dự kiến: 50.000đ - 70.000đ/tô', lat: 16.0640, lng: 108.2180, advice: 'Ăn kèm rau sống non, bẻ bánh tráng mè giòn rụm và thêm ớt xanh cay nồng.' },
      { name: 'Bánh tráng cuốn thịt heo Đại Lộc', dish: 'Thịt heo hai đầu da cuốn bánh tráng mắm nêm', address: '124 Huỳnh Thúc Kháng, Hải Châu, Đà Nẵng', costText: 'Dự kiến: 60.000đ - 90.000đ/suất', lat: 16.0600, lng: 108.2150, advice: 'Mắm nêm pha tỏi ớt thơm lừng, thịt heo thái mỏng mềm ngọt cuốn đầy ắp rau ghém.' },
      { name: 'Hải sản Bé Mặn / Năm Đảnh', dish: 'Ghẹ hấp, tôm nướng muối ớt, mực một nắng', address: 'Lô 11 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', costText: 'Dự kiến: 250.000đ - 400.000đ/người', lat: 21.0500, lng: 105.8000, advice: 'Hải sản tươi sống chọn tại bể, nêm nếm đậm đà ăn sát bờ biển mát rượi.' },
      { name: 'Bún chả cá Hờn Đà Nẵng', dish: 'Bún chả cá thu dai ngọt nước dùng dứa chua cay', address: '113/3 Nguyễn Chí Thanh, Hải Châu', costText: 'Dự kiến: 35.000đ - 50.000đ/tô', lat: 16.0690, lng: 108.2200, advice: 'Chả cá quết mịn chiên vàng giòn, nước lèo nấu bí đỏ và măng chua ngọt tự nhiên.' }
    ],
    eveningActivities: [
      { name: 'Xem Cầu Rồng phun lửa phun nước & Dạo Cầu Tình Yêu', address: 'Bờ Đông Cầu Rồng, Sơn Trà, Đà Nẵng', advice: 'Biểu diễn phun lửa lúc 21h cuối tuần; gắn khóa tình yêu và ngắm tượng Cá Chép Hóa Rồng.' },
      { name: 'Du thuyền sông Hàn ngắm thành phố ánh sáng', address: 'Bến du thuyền Sông Hàn, Bạch Đằng, Đà Nẵng', advice: 'Lướt trên sông ngắm nhìn các cây cầu đổi màu rực rỡ và xem biểu diễn múa Chăm trên thuyền.' },
      { name: 'Khám phá chợ đêm Helio & Chợ đêm Sơn Trà sôi động', address: 'Đường 2 Tháng 9 / Mai Hắc Đế, Đà Nẵng', advice: 'Thiên đường ẩm thực đường phố, hải sản nướng, trà sữa và không gian âm nhạc sống ngoài trời.' },
      { name: 'Chill quán bar ven biển Mỹ Khê nghe nhạc sóng vỗ', address: 'Đường Võ Nguyên Giáp, Sơn Trà', advice: 'Thưởng thức ly cocktail giải nhiệt mát lạnh và hòa mình vào làn gió biển êm đềm.' }
    ],
    hotel: { name: 'Khách sạn ven biển Mỹ Khê', address: 'Đường Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', price: '600.000đ - 1.200.000đ/đêm' }
  },

  'Hội An': {
    region: 'Miền Trung',
    coords: { lat: 15.8801, lng: 108.3380 },
    attractions: [
      { name: 'Phố Cổ Hội An & Chùa Cầu di sản UNESCO', address: 'Đường Trần Phú, Minh An, Hội An, Quảng Nam', duration: '3 giờ', cost: 120000, costText: 'Dự kiến: 120.000đ/vé di tích', lat: 15.8770, lng: 108.3260, image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80', advice: 'Ngắm đèn lồng lung linh khi hoàng hôn buông xuống; đi thuyền thả hoa đăng trên sông Hoài.' },
      { name: 'Rừng dừa Bảy Mẫu Cẩm Thanh', address: 'Cẩm Thanh, TP. Hội An, Quảng Nam', duration: '2 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ/thúng 2 người', lat: 15.8650, lng: 108.3650, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi thuyền thúng ngắm dừa nước và xem nghệ nhân biểu diễn quay thúng độc đáo.' },
      { name: 'Làng gốm Thanh Hà hơn 500 năm tuổi', address: 'Phường Thanh Hà, TP. Hội An', duration: '2 giờ', cost: 35000, costText: 'Dự kiến: 35.000đ/vé', lat: 15.8850, lng: 108.3050, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Tự tay chuốt gốm đất nung dưới sự hướng dẫn của các nghệ nhân làng nghề cổ truyền.' },
      { name: 'Làng rau Trà Quế hữu cơ', address: 'Xã Cẩm Hà, TP. Hội An', duration: '2 giờ', cost: 35000, costText: 'Dự kiến: 35.000đ/vé', lat: 15.9050, lng: 108.3350, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Trải nghiệm cuốc đất, tưới nước bằng gáo dừa và thưởng thức nước hạt é lá é thơm mát.' },
      { name: 'Bãi biển An Bàng top biển đẹp Châu Á', address: 'Phường Cẩm An, TP. Hội An', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí tắm biển', lat: 15.9120, lng: 108.3450, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát trắng mịn hoang sơ với những quán bar lợp mái cọ phong cách bohemian thư giãn.' },
      { name: 'Nhà cổ Tấn Ký hơn 200 năm', address: '101 Nguyễn Thái Học, Minh An, Hội An', duration: '1 giờ', cost: 0, costText: 'Bao gồm trong vé phố cổ', lat: 15.8765, lng: 108.3280, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc giao thoa Việt - Nhật - Hoa tuyệt mỹ từng trải qua hàng chục mùa lũ lụt lịch sử.' },
      { name: 'Hội quán Phúc Kiến uy nghiêm', address: '46 Trần Phú, Minh An, Hội An', duration: '1 giờ', cost: 0, costText: 'Bao gồm trong vé phố cổ', lat: 15.8775, lng: 108.3310, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Công trình kiến trúc tôn giáo hoa văn chạm khắc tinh xảo với các vòng nhang khoanh khổng lồ.' },
      { name: 'Công viên Ấn Tượng Hội An & Show Ký Ức', address: 'Cồn Hến, Cẩm Nam, Hội An', duration: '3 giờ', cost: 600000, costText: 'Dự kiến: 600.000đ/vé xem show', lat: 15.8720, lng: 108.3410, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Show diễn thực cảnh ngoài trời quy mô 500 diễn viên tái hiện 400 năm lịch sử hào hùng phố Hội.' }
    ],
    foods: [
      { name: 'Cơm gà Bà Buội gia truyền', dish: 'Cơm gà xé vàng óng hạt cơm nấu nước luộc gà', address: '22 Phan Chu Trinh, Hội An', costText: 'Dự kiến: 55.000đ/dĩa', lat: 15.8790, lng: 108.3290, advice: 'Hạt cơm nấu nước luộc gà vàng ươm, thịt gà ta xé ngọt chắc rắc lá chanh thái mỏng.' },
      { name: 'Cao lầu Thanh Hội An', dish: 'Cao lầu thịt xíu da heo chiên giòn rau thơm Trà Quế', address: '26 Thái Phiên, Minh An, Hội An', costText: 'Dự kiến: 40.000đ/bát', lat: 15.8810, lng: 108.3320, advice: 'Sợi mì thơm dai giòn ngâm tro củi cù lao Chàm ăn kèm thịt xíu mềm đậm đà.' },
      { name: 'Bánh mì Phượng / Madam Khánh', dish: 'Bánh mì kẹp thập cẩm pate bơ thịt xíu ngon nhất thế giới', address: '2B Phan Chu Trinh, Cẩm Châu, Hội An', costText: 'Dự kiến: 30.000đ - 40.000đ/chiếc', lat: 15.8800, lng: 108.3340, advice: 'Vỏ bánh mì giòn tan, nhân ngập tràn nước sốt gia truyền làm say lòng thực khách bốn phương.' },
      { name: 'Bánh bao bánh vạc Bông Hồng Trắng', dish: 'Bánh vạc nhân tôm thịt trong veo chấm mắm ớt', address: '533 Hai Bà Trưng, Cẩm Phổ, Hội An', costText: 'Dự kiến: 70.000đ - 100.000đ/đĩa', lat: 15.8820, lng: 108.3250, advice: 'Bánh tạo hình cánh hoa hồng trắng muốt rắc hành phi thơm nức cắn ngập vị tôm ngọt thanh.' }
    ],
    eveningActivities: [
      { name: 'Đi thuyền thả hoa đăng trên sông Hoài ngắm đèn lồng', address: 'Bến thuyền sông Hoài, Hội An', advice: 'Ngắm những ngôi nhà cổ vàng rực soi bóng xuống dòng sông lấp lánh ánh nến hoa đăng.' },
      { name: 'Thưởng thức show diễn thực cảnh Ký Ức Hội An hoành tráng', address: 'Công viên Ấn Tượng Hội An, Cẩm Nam', advice: 'Mãn nhãn với sân khấu trên mặt nước, kỹ xảo ánh sáng hiện đại tái hiện thời hoàng kim Faifo.' },
      { name: 'Khám phá chợ đêm Nguyễn Hoàng mua đèn lồng lụa tơ tằm', address: 'Đường Nguyễn Hoàng, An Hội', advice: 'Check-in những gian hàng đèn lồng rực rỡ sắc màu và thưởng thức kem ống, bánh tráng nướng.' },
      { name: 'Thưởng thức nước Mót thảo mộc & Thư thả dạo phố cổ', address: '150 Trần Phú, Minh An, Hội An', advice: 'Uống ly nước sả chanh hạt sen cánh sen thơm mát trong không gian hoài niệm êm đềm.' }
    ],
    hotel: { name: 'Resort / Homestay phố cổ Hội An', address: 'Đường Cửa Đại / Hai Bà Trưng, Hội An', price: '600.000đ - 1.800.000đ/đêm' }
  },

  'Đà Lạt': {
    region: 'Tây Nguyên',
    coords: { lat: 11.9404, lng: 108.4583 },
    attractions: [
      { name: 'Quảng trường Lâm Viên & Hồ Xuân Hương', address: 'Đường Trần Quốc Toản, Phường 1, TP. Đà Lạt', duration: '2 giờ', cost: 0, costText: 'Miễn phí dạo chơi', lat: 11.9360, lng: 108.4450, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Chụp ảnh với biểu tượng Nụ hoa Atiso & Bông hoa Dã Quỳ khổng lồ; dạo quanh bờ hồ se lạnh.' },
      { name: 'Đỉnh Núi Langbiang', address: 'Thị trấn Lạc Dương, Huyện Lạc Dương, Lâm Đồng', duration: '3 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ/vé + 120.000đ xe Jeep', lat: 12.0450, lng: 108.4350, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Đi xe Jeep cảm giác mạnh lên đỉnh radar ngắm trọn vẹn suối Vàng suối Bạc mờ sương.' },
      { name: 'Thác Datanla & Máng trượt Alpine Coaster', address: 'Đèo Prenn, Quốc lộ 20, Phường 3, Đà Lạt', duration: '2 giờ 30 phút', cost: 200000, costText: 'Dự kiến: 200.000đ/vé máng trượt', lat: 11.9020, lng: 108.4500, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Trải nghiệm hệ thống máng trượt xuyên qua rừng thông dài nhất Đông Nam Á.' },
      { name: 'Đồi Chè Cầu Đất & Săn Mây thảm gỗ', address: 'Thôn Trường Thọ, Trạm Hành, TP. Đà Lạt', duration: '3 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 11.8550, lng: 108.5600, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Nên dậy từ 5:00 sáng để đón biển mây bồng bềnh và ngắm cánh đồng điện gió.' },
      { name: 'Ga Đà Lạt cổ kính nhà ga răng cưa', address: 'Số 1 Quang Trung, Phường 10, Đà Lạt', duration: '1 giờ 30 phút', cost: 5000, costText: 'Dự kiến: 5.000đ/vé vào cổng', lat: 11.9420, lng: 108.4550, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Nhà ga cổ nhất Đông Dương mang kiến trúc hình 3 chóp núi Langbiang hùng vĩ.' },
      { name: 'Chùa Linh Phước (Chùa Ve Chai kỷ lục)', address: '120 Tự Phước, Trại Mát, TP. Đà Lạt', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng chùa', lat: 11.9450, lng: 108.4980, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Công trình kiến trúc khảm sành sứ độc đáo với con rồng dài 49m uốn quanh hồ nước làm từ 12.000 vỏ chai.' },
      { name: 'Dinh 3 Bảo Đại biệt điện mùa hè', address: 'Số 1 Triệu Việt Vương, Phường 4, Đà Lạt', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 11.9300, lng: 108.4300, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Biệt điện kiến trúc Châu Âu nguyên bản nơi sinh hoạt của gia đình vua Bảo Đại giữa đồi thông.' },
      { name: 'Làng hoa Vạn Thành & Vườn dâu tây công nghệ cao', address: '40 Vạn Hạnh, Phường 5, TP. Đà Lạt', duration: '2 giờ', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 11.9520, lng: 108.4100, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Làng hoa lớn nhất Đà Lạt rực rỡ hoa hồng, cẩm tú cầu và trải nghiệm tự tay hái dâu tây treo giàn.' }
    ],
    foods: [
      { name: 'Lẩu gà lá é Tao Ngộ', dish: 'Lẩu gà lá é cay nồng ớt hiểm ấm sực cơ thể', address: 'Số 5 Đường 3/4, Phường 3, TP. Đà Lạt', costText: 'Dự kiến: 250.000đ - 350.000đ/nồi', lat: 11.9310, lng: 108.4420, advice: 'Nồi lẩu nóng bốc khói, lá é the mát hòa quyện vị cay ấm sực cơ thể giữa sương đêm.' },
      { name: 'Bánh ướt lòng gà Long', dish: 'Bánh ướt mềm mượt lòng gà trứng non trộn gỏi', address: 'Hẻm 202 Phan Đình Phùng, Phường 2, Đà Lạt', costText: 'Dự kiến: 40.000đ - 60.000đ/tô', lat: 11.9460, lng: 108.4380, advice: 'Bánh ướt mềm mượt ăn kèm thịt gà xé, lòng heo giòn sần sật và nước mắm chua ngọt.' },
      { name: 'Bánh tráng nướng Dì Đinh', dish: 'Bánh tráng nướng phô mai trứng bò khô giòn rụm', address: '26 Hoàng Diệu, Phường 5, Đà Lạt', costText: 'Dự kiến: 25.000đ - 35.000đ/cái', lat: 11.9430, lng: 108.4320, advice: 'Pizza Đà Lạt nướng than hoa vàng ươm ngậy phô mai béo bùi ăn ngay khi vừa ra lò.' },
      { name: 'Lẩu bò Ba Toa quán Gỗ', dish: 'Lẩu bò nạm gân đuôi bò ngọt đậm đà nước dùng', address: '1/29 Hoàng Diệu, Phường 5, Đà Lạt', costText: 'Dự kiến: 250.000đ - 350.000đ/nồi', lat: 11.9410, lng: 108.4310, advice: 'Thịt bò tơ mềm nhừ chấm chao ớt cay xè nhúng ngập rau má, cải bẹ xanh tươi non.' }
    ],
    eveningActivities: [
      { name: 'Dạo Chợ Đêm Đà Lạt (Chợ Âm Phủ) ăn vặt sữa đậu nành nóng', address: 'Đường Nguyễn Thị Minh Khai, Phường 1', advice: 'Uống sữa đậu nành nóng hổi, ăn bánh tiêu, khoai lang mật nướng giữa trời se lạnh 15 độ C.' },
      { name: 'Ngồi quán cafe acoustic sườn đồi ngắm thung lũng đèn lung linh', address: 'Đồi Dã Chiến / Hoàng Hoa Thám, Đà Lạt', advice: 'Thưởng thức âm nhạc ballad mộc mạc và ngắm hàng vạn bóng đèn nhà kính sáng rực như dải ngân hà.' },
      { name: 'Đạp xe đạp đôi quanh bờ Hồ Xuân Hương lãng mạn', address: 'Quanh hồ Xuân Hương, TP. Đà Lạt', advice: 'Tận hưởng làn gió mát lạnh ven hồ, dừng chân uống cafe thủy tạ ngắm mặt hồ phẳng lặng.' },
      { name: 'Thưởng thức kem bơ Thanh Thảo & Mua đặc sản mứt hoa quả làm quà', address: '76 Nguyễn Văn Trỗi, Phường 2, Đà Lạt', advice: 'Kem bơ béo ngậy ăn cùng sầu riêng thơm phức; mua mứt dâu tây, atiso, hồng treo gió làm quà.' }
    ],
    hotel: { name: 'Khách sạn / Homestay ngắm thung lũng Đà Lạt', address: 'Khu trung tâm / đồi Dã Chiến, Đà Lạt', price: '500.000đ - 1.100.000đ/đêm' }
  },

  'Phú Quốc': {
    region: 'Miền Nam',
    coords: { lat: 10.2899, lng: 103.9840 },
    attractions: [
      { name: 'Bãi Sao Phú Quốc cát trắng như kem', address: 'Ấp Bãi Sao, An Thới, TP. Phú Quốc', duration: '3 giờ', cost: 0, costText: 'Miễn phí tắm biển', lat: 10.0550, lng: 104.0320, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát trắng mịn như kem và mặt biển phẳng lặng ngọc bích; tha hồ chụp ảnh xích đu cây dừa.' },
      { name: 'Thị trấn Hoàng Hôn & Cầu Hôn (Kiss Bridge)', address: 'Bờ Tây Nam đảo, An Thới, Phú Quốc', duration: '2 giờ 30 phút', cost: 100000, costText: 'Dự kiến: 100.000đ/vé Cầu Hôn', lat: 10.0250, lng: 104.0100, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Điểm ngắm hoàng hôn biển lộng lẫy nhất Phú Quốc với kiến trúc phong cách Địa Trung Hải rực rỡ.' },
      { name: 'Cáp treo Hòn Thơm vượt biển dài kỷ lục', address: 'Ga An Thới, An Thới, Phú Quốc', duration: '4 giờ', cost: 650000, costText: 'Dự kiến: 650.000đ/vé cáp treo + công viên nước', lat: 10.0150, lng: 104.0150, image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop&q=80', advice: 'Tuyến cáp treo 3 dây vượt biển dài gần 7.900m ngắm toàn cảnh làng chài Nam đảo từ trên cao.' },
      { name: 'Grand World Phú Quốc thành phố không ngủ', address: 'Bãi Dài, Gành Dầu, TP. Phú Quốc', duration: '4 giờ', cost: 0, costText: 'Miễn phí vào cổng', lat: 10.3250, lng: 103.8600, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Đi thuyền gondola trên kênh đào Venice thu nhỏ, tham quan Bảo tàng Gấu Teddy và nhà tre khổng lồ.' },
      { name: 'Vinpearl Safari công viên bán hoang dã', address: 'Bãi Dài, Gành Dầu, TP. Phú Quốc', duration: '3 giờ 30 phút', cost: 650000, costText: 'Dự kiến: 650.000đ/vé Safari', lat: 10.3400, lng: 103.8850, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Trải nghiệm "nhốt người thả thú" trên xe bus chuyên dụng ngắm sư tử, tê giác, hươu cao cổ.' },
      { name: 'Làng chài Rạch Vẹm vương quốc sao biển', address: 'Xã Gành Dầu, TP. Phú Quốc', duration: '3 giờ', cost: 0, costText: 'Khám phá tự do', lat: 10.3600, lng: 103.9200, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Mặt nước biển trong veo nông thoai thoải với hàng ngàn chú sao biển đỏ rực dưới cát.' },
      { name: 'Dinh Cậu & Dinh Bà ngắm hoàng hôn', address: 'Khu phố 2, Dương Đông, Phú Quốc', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng dinh', lat: 10.2180, lng: 103.9550, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Biểu tượng tâm linh chở che sóng gió cho ngư dân đảo ngọc trên mỏm đá nhô ra biển.' },
      { name: 'Nhà tù Phú Quốc di tích lịch sử quốc gia', address: '350 Nguyễn Văn Cừ, An Thới, Phú Quốc', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 10.0450, lng: 104.0180, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Chứng tích lịch sử kiên cường bất khuất của các chiến sĩ cách mạng trong thời kỳ kháng chiến.' }
    ],
    foods: [
      { name: 'Bún quậy Kiến Xây chính gốc', dish: 'Bún quậy tôm mực chả cá tươi rói nóng hổi', address: '28 Bạch Đằng, Dương Đông, Phú Quốc', costText: 'Dự kiến: 55.000đ - 75.000đ/tô', lat: 10.2200, lng: 103.9600, advice: 'Tự pha chế nước chấm muối tiêu ớt quất thơm nồng theo sở thích trước khi thưởng thức.' },
      { name: 'Hải sản Làng chài Hàm Ninh', dish: 'Ghẹ Hàm Ninh hấp bia, nhum biển nướng mỡ hành', address: 'Làng chài Hàm Ninh, Phú Quốc', costText: 'Dự kiến: 250.000đ - 400.000đ/người', lat: 10.1800, lng: 104.0450, advice: 'Ghẹ thịt chắc nịch gạch son ngọt ngào, chấm muối tiêu chanh Phú Quốc chính gốc.' },
      { name: 'Gỏi cá trích Phú Quốc', dish: 'Cá trích tươi cuốn bánh tráng dừa nạo chấm nước mắm nhĩ', address: 'Nhà hàng Sông Xanh, Dương Đông', costText: 'Dự kiến: 120.000đ - 180.000đ/đĩa', lat: 10.2150, lng: 103.9650, advice: 'Thịt cá trích béo ngậy hòa quyện dừa nạo bùi bùi và nước mắm ớt tỏi đậu phộng thơm lừng.' },
      { name: 'Cơm chiên ghẹ Phú Quốc', dish: 'Cơm chiên vàng ruộm ngập tràn thịt ghẹ xé ngọt', address: 'Quán Ra Khơi, Đường 30 Tháng 4', costText: 'Dự kiến: 90.000đ - 150.000đ/dĩa', lat: 10.2180, lng: 103.9620, advice: 'Hạt cơm săn bóng thơm phức quyện mùi thơm của biển đảo phương Nam.' }
    ],
    eveningActivities: [
      { name: 'Xem show Kiss of the Sea & Bắn pháo hoa rực rỡ', address: 'Thị trấn Hoàng Hôn Sunset Town, An Thới', advice: 'Màn trình diễn công nghệ đa phương tiện kết hợp lửa, nước, laser và pháo hoa mỗi tối.' },
      { name: 'Dạo Chợ Đêm Phú Quốc thưởng thức hải sản nướng', address: 'Đường Bạch Đằng, Dương Đông, Phú Quốc', advice: 'Thiên đường ẩm thực đảo với mực nướng, ốc biển, kẹo chỉ và kem cuộn Thái Lan.' },
      { name: 'Chill tại OCSEN Beach Bar ngắm hoàng hôn biển đỏ rực', address: '118/10 Trần Hưng Đạo, Dương Tơ, Phú Quốc', advice: 'Nằm trên ghế lười êm ái trên bờ cát, nghe nhạc deephouse ngắm lửa trại bập bùng.' },
      { name: 'Mua ngọc trai Phú Quốc, tiêu chín sọ & Nước mắm truyền thống', address: 'Khu trưng bày ngọc trai Ngọc Hiền / Nhà thùng nước mắm', advice: 'Chọn mua đặc sản đảo ngọc cao cấp có xuất xứ và chứng nhận uy tín mang về làm quà.' }
    ],
    hotel: { name: 'Resort nghỉ dưỡng ven biển Phú Quốc', address: 'Bãi Trường / Bãi Dài / An Thới, Phú Quốc', price: '800.000đ - 2.500.000đ/đêm' }
  },

  'Cao Bằng': {
    region: 'Đông Bắc',
    coords: { lat: 22.6657, lng: 105.9723 },
    attractions: [
      { name: 'Thác Bản Giốc thác nước lớn nhất Đông Nam Á', address: 'Xã Đàm Thủy, Trùng Khánh, Cao Bằng', duration: '3 giờ', cost: 45000, costText: 'Dự kiến: 45.000đ/vé', lat: 22.8540, lng: 106.7230, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thác nước tự nhiên hùng vĩ nằm trên biên giới Việt - Trung đẹp tráng lệ.' },
      { name: 'Động Ngườm Ngao thạch nhũ vàng', address: 'Bản Gun, Đàm Thủy, Trùng Khánh, Cao Bằng', duration: '2 giờ', cost: 45000, costText: 'Dự kiến: 45.000đ/vé', lat: 22.8450, lng: 106.7050, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Hang động đá vôi kỳ ảo dài hơn 2.000m với nhũ đá hình bông sen vàng rực rỡ.' },
      { name: 'Khu di tích Pác Bó & Suối Lê Nin', address: 'Xã Trường Hà, Hà Quảng, Cao Bằng', duration: '2 giờ 30 phút', cost: 25000, costText: 'Dự kiến: 25.000đ/vé', lat: 22.9800, lng: 106.0500, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Dòng suối nước trong vắt màu xanh ngọc bích nơi Bác Hồ từng sống và làm việc.' },
      { name: 'Núi Thủng Mắt Thần Núi (Hồ Thang Hen)', address: 'Xã Quốc Toản, Huyện Quảng Hòa, Cao Bằng', duration: '3 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 22.7500, lng: 106.3000, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Ngọn núi thủng kỳ quan thiên nhiên giữa thung lũng cỏ xanh ngút ngàn và hồ nước trong veo.' },
      { name: 'Làng rèn đúc Phúc Sen người Nùng An', address: 'Xã Phúc Sen, Quảng Hòa, Cao Bằng', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 22.7100, lng: 106.4000, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Làng nghề rèn thủ công truyền thống hàng trăm năm tuổi bằng nhíp xe ô tô bền bỉ.' },
      { name: 'Đèo Mã Phục 7 tầng dốc đá hiểm trở', address: 'Quốc lộ 3 nối TP. Cao Bằng và Trùng Khánh', duration: '1 giờ', cost: 0, costText: 'Check-in ngắm cảnh', lat: 22.7200, lng: 106.3200, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Cung đèo đẹp và nổi tiếng nhất Cao Bằng với hai khối đá vôi dựng đứng tựa hai con ngựa quỳ.' },
      { name: 'Chùa Phật Tích Trúc Lâm Bản Giốc', address: 'Xã Đàm Thủy, Trùng Khánh, Cao Bằng', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', lat: 22.8580, lng: 106.7200, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa tựa lưng vào núi Phia Nhằm phóng tầm mắt ôm trọn thác Bản Giốc hùng vĩ.' },
      { name: 'Rừng trúc Lũng Pán xanh ngút ngàn', address: 'Xã Lũng Pán, Huyện Bảo Lạc, Cao Bằng', duration: '2 giờ', cost: 0, costText: 'Tự do chụp ảnh', lat: 22.8800, lng: 105.8000, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Rừng trúc bạt ngàn thân thẳng tắp tạo nên khung cảnh lãng mạn như phim trường kiếm hiệp.' }
    ],
    foods: [
      { name: 'Bánh cuốn Cao Bằng chan canh xương', dish: 'Bánh cuốn tráng mỏng nhân thịt chan canh xương nóng', address: 'Phố cổ TP. Cao Bằng', costText: 'Dự kiến: 35.000đ - 50.000đ/suất', lat: 22.6680, lng: 105.9740, advice: 'Bánh tráng mỏng dẻo dai chan nước hầm xương ngọt lịm kèm giò lụa măng ớt móc mật.' },
      { name: 'Vịt quay 7 vị Cao Bằng da giòn', dish: 'Vịt quay da giòn rụm đượm gia vị mật ong lá móc mật', address: 'Đường Kim Đồng, TP. Cao Bằng', costText: 'Dự kiến: 250.000đ - 300.000đ/con', lat: 22.6650, lng: 105.9710, advice: 'Mùi thơm nức mũi của 7 vị thảo mộc rừng Đông Bắc ướp ngập trong từng thớ thịt vịt.' },
      { name: 'Phở chua Cao Bằng thịt xá xíu', dish: 'Phở chua trộn thịt vịt quay lạp sườn khoai tàu chiên', address: 'Đường Hoàng Đình Giong, TP. Cao Bằng', costText: 'Dự kiến: 40.000đ - 60.000đ/bát', lat: 22.6670, lng: 105.9730, advice: 'Nước sốt chua ngọt dẻo quánh trộn cùng bánh phở mềm mướt và đậu phộng bùi béo.' },
      { name: 'Rau dạ hiến xào bò & Lạp sườn hun khói mía', dish: 'Rau bò khai tự nhiên xào thịt bò thơm giòn', address: 'Nhà hàng Dân Tộc Quán, TP. Cao Bằng', costText: 'Dự kiến: 120.000đ - 180.000đ/đĩa', lat: 22.6690, lng: 105.9750, advice: 'Đặc sản rau rừng chỉ có ở vùng núi đá vôi Cao Bằng với vị ngọt bùi tự nhiên lạ miệng.' }
    ],
    eveningActivities: [
      { name: 'Dạo chợ đêm phố đi bộ Kim Đồng TP. Cao Bằng', address: 'Phố đi bộ Kim Đồng, TP. Cao Bằng', advice: 'Thưởng thức bánh áp chao nóng hổi, hạt dẻ Trùng Khánh nướng thơm nức mũi bên sông Bằng Giang.' },
      { name: 'Thưởng thức hạt dẻ Trùng Khánh nướng & Cafe bên bờ sông', address: 'Đường bờ sông Bằng Giang, TP. Cao Bằng', advice: 'Hạt dẻ bùi ngậy to tròn đặc trưng của đất Trùng Khánh nhâm nhi cùng tách cafe ấm.' },
      { name: 'Ngồi bên dòng suối lắng nghe tiếng thác Bản Giốc đêm', address: 'Resort / Homestay Bản Giốc, Đàm Thủy', advice: 'Cảm nhận sự thanh bình kỳ vĩ của thiên nhiên khi màn đêm buông xuống biên cương.' },
      { name: 'Giao lưu văn nghệ dân tộc Tày - Nùng & Mua miến dong Phia Đén', address: 'Trung tâm văn hóa huyện Trùng Khánh', advice: 'Mua miến dong Phia Đén sợi dai trong suốt nấu không nát và nấm hương rừng làm quà.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Cao Bằng / Bản Giốc', address: 'TP. Cao Bằng / Bản Giốc, Trùng Khánh, Cao Bằng', price: '400.000đ - 850.000đ/đêm' }
  },

  'Mộc Châu': {
    region: 'Tây Bắc',
    coords: { lat: 20.8433, lng: 104.6467 },
    attractions: [
      { name: 'Đồi Chè Trái Tim Mộc Châu uốn lượn', address: 'Bản Ôn, TT Nông Trường Mộc Châu, Sơn La', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.8650, lng: 104.6850, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Đồi chè xanh mướt uốn lượn hình trái tim; địa điểm chụp ảnh lãng mạn bậc nhất cao nguyên.' },
      { name: 'Rừng thông Bản Áng & Vườn dâu Chimi', address: 'Xã Đông Sang, Mộc Châu, Sơn La', duration: '2 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', lat: 20.8250, lng: 104.6300, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Không gian se lạnh thơ mộng ví như Đà Lạt của Tây Bắc với hồ nước phẳng lặng và đồi thông.' },
      { name: 'Thác Dải Yếm & Cầu Kính Tình Yêu 5D', address: 'Xã Mường Sang, Mộc Châu, Sơn La', duration: '2 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ/vé cầu kính', lat: 20.8120, lng: 104.6150, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Dòng thác đổ trắng xóa như dải yếm lụa của cô gái Thái; cầu kính 5D hiện đại nhìn thung lũng.' },
      { name: 'Cầu Kính Bạch Long kỷ lục thế giới', address: 'Xã Mường Sang, Huyện Mộc Châu, Sơn La', duration: '3 giờ', cost: 550000, costText: 'Dự kiến: 550.000đ/vé trọn gói', lat: 20.8050, lng: 104.6050, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Cầu kính đi bộ dài nhất thế giới bắc qua hai ngọn núi cao ngắm trọn thung lũng nguyên sinh.' },
      { name: 'Thung lũng mận Nà Ka mùa hoa trắng', address: 'Tỉnh lộ 104, Thị trấn Nông trường Mộc Châu', duration: '2 giờ 30 phút', cost: 30000, costText: 'Dự kiến: 30.000đ/vé vào vườn', lat: 20.9100, lng: 104.7000, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Bạt ngàn hoa mận nở trắng muốt vào tháng 1-2 hoặc mùa quả mận chín đỏ mọng vào tháng 5.' },
      { name: 'Hang Ma Suối Bàng di tích khảo cổ kỳ bí', address: 'Xã Suối Bàng, Huyện Vân Hồ, Sơn La', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 20.9500, lng: 104.8200, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Hệ thống hang động chứa hàng trăm cỗ quan tài gỗ thân cây đẽo rỗng nghìn năm tuổi bí ẩn.' },
      { name: 'Trang trại Bò Sữa Mộc Châu đồng cỏ xanh', address: 'Thị trấn Nông Trường Mộc Châu', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 20.8550, lng: 104.6650, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Tìm hiểu quy trình vắt sữa bò tươi nguyên chất và chụp ảnh trên cánh đồng cỏ xanh ngát.' },
      { name: 'Bản Pa Phách hoa cải trắng tinh khôi', address: 'Xã Đông Sang, Mộc Châu, Sơn La', duration: '2 giờ 30 phút', cost: 0, costText: 'Khám phá tự do', lat: 20.8150, lng: 104.6400, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thiên đường hoa cải trắng nở rộ khắp các triền đồi bao quanh nếp nhà sàn của người H’Mông.' }
    ],
    foods: [
      { name: 'Bê chao Mộc Châu mềm ngọt bì giòn', dish: 'Thịt bê non chao dầu sôi chấm tương gừng nóng', address: 'Tiểu khu Chiềng Đi / Km 70 Mộc Châu', costText: 'Dự kiến: 150.000đ - 250.000đ/đĩa', lat: 20.8350, lng: 104.6350, advice: 'Thịt bê non mềm ngọt đậm đà, bì giòn sần sật chấm cùng nước tương gừng nóng ấm.' },
      { name: 'Cá suối chiên giòn rụm & Ốc đá', dish: 'Cá suối rán giòn nguyên con chấm mắm ớt rừng', address: 'Thị trấn Mộc Châu, Sơn La', costText: 'Dự kiến: 100.000đ - 150.000đ/đĩa', lat: 20.8400, lng: 104.6450, advice: 'Cá suối tự nhiên bắt tại suối đá rán giòn tan, nhai cả xương thơm phức bùi ngậy.' },
      { name: 'Cơm lam nướng & Gà đồi nướng mắc khén', dish: 'Gà đồi thả rông nướng than hoa ướp hạt dổi', address: 'Khu ẩm thực Rừng thông Bản Áng', costText: 'Dự kiến: 250.000đ - 350.000đ/con', lat: 20.8270, lng: 104.6320, advice: 'Gà đồi thịt săn chắc da giòn chấm chẩm chéo ướt ăn kèm cơm lam nếp nương dẻo quánh.' },
      { name: 'Sữa tươi Mộc Châu & Bánh sữa nướng', dish: 'Sữa bò tươi thanh trùng nóng hổi, sữa chua nếp cẩm', address: 'Các tiệm sữa tươi Nông Trường Mộc Châu', costText: 'Dự kiến: 15.000đ - 30.000đ/ly', lat: 20.8520, lng: 104.6600, advice: 'Thức uống bổ dưỡng ngọt béo tự nhiên vừa vắt trong ngày từ các trang trại thảo nguyên.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đêm thị trấn Nông trường Mộc Châu se lạnh', address: 'Tiểu khu Khí Tượng, TT Nông Trường', advice: 'Tản bộ trong tiết trời se lạnh 15 độ C, ăn bắp ngô nướng ngọt lịm và uống sữa tươi nóng.' },
      { name: 'Thưởng thức sữa chua nếp cẩm Mộc Châu béo ngậy', address: 'Đường Hoàng Quốc Việt, Mộc Châu', advice: 'Sữa chua nhà làm sánh mịn ăn cùng xôi nếp cẩm nương thơm dẻo khó quên.' },
      { name: 'Ngồi quanh lửa trại nướng ngô khoai tại homestay đồi chè', address: 'Khu homestay Bản Áng / Bản Ôn', advice: 'Tiếng củi tí tách reo vui, cùng bạn bè thưởng thức rượu mận Mộc Châu thơm lừng.' },
      { name: 'Thưởng thức trà Ô Long Mộc Châu & Mua bánh sữa làm quà', address: 'Khu giới thiệu sản phẩm thảo nguyên Mộc Châu', advice: 'Mua trà Ô Long Kim Tuyên, kẹo sữa nướng và chẩm chéo Tây Bắc đem về làm quà.' }
    ],
    hotel: { name: 'Resort / Homestay đồi chè Mộc Châu', address: 'Thị trấn Nông Trường Mộc Châu, Sơn La', price: '450.000đ - 1.100.000đ/đêm' }
  },

  'Bắc Ninh': {
    region: 'Miền Bắc',
    coords: { lat: 21.1861, lng: 106.0763 },
    attractions: [
      { name: 'Chùa Dâu cổ tự cổ nhất Việt Nam', address: 'Xã Thanh Khương, Thuận Thành, Bắc Ninh', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', lat: 21.0350, lng: 106.0400, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Cái nôi của Phật giáo Việt Nam với tháp Hòa Phong cổ kính rêu phong thời Bắc thuộc.' },
      { name: 'Đền Đô vương triều 8 vị vua Lý', address: 'Phường Đình Bảng, Từ Sơn, Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 21.1150, lng: 105.9600, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Nơi thờ tự và tưởng niệm các vị hoàng đế nhà Lý trong không gian hồ bán nguyệt linh thiêng.' },
      { name: 'Làng tranh dân gian Đông Hồ', address: 'Xã Song Hồ, Thuận Thành, Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Tự do trải nghiệm', lat: 21.0650, lng: 106.0700, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Tìm hiểu quy trình in tranh khắc gỗ trên giấy điệp tự nhiên đậm chất văn hóa Kinh Bắc.' },
      { name: 'Chùa Phật Tích tượng Phật đá thời Lý', address: 'Xã Phật Tích, Tiên Du, Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng chùa', lat: 21.1000, lng: 106.0250, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Bảo vật quốc gia pho tượng Phật A Di Đà bằng đá xanh tuyệt mỹ tạc từ thời vua Lý Thánh Tông.' },
      { name: 'Làng gốm Phù Lãng men da lươn cổ', address: 'Xã Phù Lãng, Thị xã Quế Võ, Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 21.1400, lng: 106.2300, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Làng gốm nung củi truyền thống bên bờ sông Cầu với chất men da lươn nâu đỏ trầm ấm.' },
      { name: 'Chùa Bút Tháp tượng Quan Âm nghìn mắt nghìn tay', address: 'Xã Đình Tổ, Thuận Thành, Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng chùa', lat: 21.0550, lng: 106.0200, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Kiệt tác điêu khắc gỗ cổ tuyệt đỉnh của Việt Nam với tháp Báo Nghiêm hình cây bút vút cao.' },
      { name: 'Làng quan họ Viêm Xá (Đền Cùng Giếng Ngọc)', address: 'Xã Hòa Long, TP. Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 21.2150, lng: 106.0550, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Uống nước Giếng Ngọc trong vắt ngọt lịm và nghe các liền anh liền chị hát dân ca quan họ mộc.' },
      { name: 'Văn Miếu Bắc Ninh bia tiến sĩ Kinh Bắc', address: 'Phường Đại Phúc, TP. Bắc Ninh', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng thăm', lat: 21.1750, lng: 106.0800, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Tôn vinh truyền thống hiếu học khoa bảng vẻ vang của vùng đất địa linh nhân kiệt Kinh Bắc.' }
    ],
    foods: [
      { name: 'Bánh phu thê Đình Bảng gia truyền', dish: 'Bánh xu xê gói lá chuối nhân đậu xanh dừa', address: 'Phường Đình Bảng, Từ Sơn, Bắc Ninh', costText: 'Dự kiến: 30.000đ - 50.000đ/cặp', lat: 21.1160, lng: 105.9620, advice: 'Vỏ bánh dẻo trong màu vàng hạt dành dành, nhân ngọt bùi thơm hương sen.' },
      { name: 'Nem bùi Ninh Xá cuốn lá sung', dish: 'Nem thính cuốn lá sung chấm tương ớt cay nồng', address: 'Xã Ninh Xá, Thuận Thành, Bắc Ninh', costText: 'Dự kiến: 35.000đ/quả', lat: 21.0450, lng: 106.1200, advice: 'Thịt nạc và mỡ thái mỏng trộn thính gạo rang vàng thơm nức chấm tương ớt cay cay.' },
      { name: 'Bánh tẻ làng Chờ nóng hổi', dish: 'Bánh tẻ lá dong nhân thịt mộc nhĩ giòn bùi', address: 'Thị trấn Chờ, Huyện Yên Phong, Bắc Ninh', costText: 'Dự kiến: 8.000đ - 12.000đ/chiếc', lat: 21.2200, lng: 105.9800, advice: 'Vỏ bánh bột gạo tẻ mềm mướt không ngấy, nhân thịt băm mộc nhĩ thơm nức tiêu bắc.' },
      { name: 'Gà Hồ Thuận Thành tiến vua', dish: 'Thịt gà Hồ hấp lá chanh da giòn thịt ngọt', address: 'Thị trấn Hồ, Thuận Thành, Bắc Ninh', costText: 'Dự kiến: 300.000đ - 450.000đ/kg', lat: 21.0500, lng: 106.0850, advice: 'Giống gà quý dáng hình dũng mãnh, thịt thơm ngọt chắc nịch tiến dâng hoàng đế ngày xưa.' }
    ],
    eveningActivities: [
      { name: 'Nghe hát dân ca Quan họ trên thuyền rồng hồ Nguyên Phi Ỷ Lan', address: 'Hồ công viên Nguyên Phi Ỷ Lan, TP. Bắc Ninh', advice: 'Thưởng thức câu hát giao duyên ngọt ngào mượt mà của các liền anh liền chị quan họ.' },
      { name: 'Dạo phố ẩm thực đêm đường Ngọc Hân Công Chúa', address: 'Đường Ngọc Hân Công Chúa, TP. Bắc Ninh', advice: 'Khu phố ẩm thực hiện đại sầm uất với hàng trăm món ngon nướng, lẩu, trà chanh vỉa hè.' },
      { name: 'Thưởng thức bánh tro Đình Bảng chấm mật mía ngọt thanh', address: 'Khu vực Đền Đô, Từ Sơn', advice: 'Bánh tro trong veo màu hổ phách mềm dẻo chấm mật mía ngọt lịm tan chảy nơi đầu lưỡi.' },
      { name: 'Mua nem bùi Ninh Xá, bánh phu thê Đình Bảng làm quà', address: 'Các tiệm bánh truyền thống TP. Bắc Ninh', advice: 'Món quà cưới hỏi và du lịch truyền thống đậm đà phong vị văn hóa Kinh Bắc.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Bắc Ninh / Từ Sơn', address: 'TP. Bắc Ninh / Thị xã Từ Sơn', price: '450.000đ - 900.000đ/đêm' }
  },

  'Nam Định': {
    region: 'Miền Bắc',
    coords: { lat: 20.4344, lng: 106.1805 },
    attractions: [
      { name: 'Quần thể Đền Trần Nam Định linh thiêng', address: 'Phường Lộc Vượng, TP. Nam Định', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng đền', lat: 20.4480, lng: 106.1650, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Nơi phụng thờ các vị vua và công thần vương triều Trần lừng lẫy chiến công hiển hách.' },
      { name: 'Nhà thờ đổ Hải Lý (Xương Điền) bình minh biển', address: 'Xã Hải Lý, Huyện Hải Hậu, Nam Định', duration: '1 giờ 30 phút', cost: 0, costText: 'Tự do ngắm cảnh biển', lat: 20.1850, lng: 106.3100, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc nhà thờ cổ bị biển xâm lấn đứng trơ trọi bên bờ cát; điểm ngắm bình minh tuyệt mỹ.' },
      { name: 'Chùa Cổ Lễ & Tháp Cửu Phẩm Liên Hoa', address: 'Thị trấn Cổ Lễ, Trực Ninh, Nam Định', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 20.3550, lng: 106.2400, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc độc đáo hòa quyện Phật giáo cổ truyền và phong cách Gothic phương Tây.' },
      { name: 'Vườn Quốc gia Xuân Thủy vùng đất Ramsar', address: 'Xã Giao Thiện, Huyện Giao Thủy, Nam Định', duration: '3 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ vé vào cổng + thuyền', lat: 20.2500, lng: 106.5200, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Vùng ngập nước cửa sông Hồng bảo tồn các loài chim di cư quý hiếm và rừng ngập mặn.' },
      { name: 'Tòa Giám mục Bùi Chu trăm tuổi', address: 'Xã Xuân Ngọc, Huyện Xuân Trường, Nam Định', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.3150, lng: 106.3400, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Cái nôi Công giáo lâu đời với tháp chuông cổ kính và kiến trúc vòm tráng lệ.' },
      { name: 'Cột cờ Nam Định di tích lịch sử triều Nguyễn', address: 'Đường Tô Hiệu, Phường Ngô Quyền, TP. Nam Định', duration: '1 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.4280, lng: 106.1750, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Một trong 4 cột cờ cổ thời Nguyễn cùng thời với Cột cờ Hà Nội và Huế.' },
      { name: 'Cầu ngói Chợ Lương hơn 500 năm tuổi', address: 'Xã Hải Anh, Huyện Hải Hậu, Nam Định', duration: '1 giờ', cost: 0, costText: 'Tham quan tự do', lat: 20.2100, lng: 106.2600, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Một trong ba cây cầu ngói cổ đẹp nhất Việt Nam với kiến trúc "thượng gia hạ kiều".' },
      { name: 'Bãi biển Thịnh Long & Quất Lâm', address: 'Hải Hậu & Giao Thủy, Nam Định', duration: '2 giờ 30 phút', cost: 0, costText: 'Tự do tắm biển', lat: 20.1500, lng: 106.2800, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Thưởng thức hải sản tươi rói mua ngay tại bến thuyền ngư dân vừa cập bờ.' }
    ],
    foods: [
      { name: 'Phở bò gia truyền Nam Định Đán', dish: 'Phở bò tái lăn nước dùng ngọt tủy xương thơm gừng', address: '128 Hai Bà Trưng / 142 Bắc Ninh, Nam Định', costText: 'Dự kiến: 40.000đ - 60.000đ/bát', lat: 20.4320, lng: 106.1820, advice: 'Cái nôi sinh ra món phở bò Việt Nam với nước lèo thơm gừng nướng và thảo quả gia truyền.' },
      { name: 'Bánh xíu páo Nam Định nướng giòn', dish: 'Bánh nướng nhân thịt xá xíu trứng cút nhiều lớp', address: 'Đường Lê Hồng Phong / Hoàng Văn Thụ, Nam Định', costText: 'Dự kiến: 10.000đ/chiếc', lat: 20.4300, lng: 106.1780, advice: 'Vỏ bánh nhiều lớp giòn xốp thơm lừng bọc nhân thịt béo ngậy ăn khi vừa ra lò.' },
      { name: 'Nem nắm Giao Thủy chính hiệu', dish: 'Nem thính thịt mông bì lợn bóp thính cuốn lá sung', address: 'Thị trấn Ngô Đồng, Giao Thủy, Nam Định', costText: 'Dự kiến: 40.000đ - 60.000đ/quả', lat: 20.2650, lng: 106.4600, advice: 'Thính gạo tám thơm lừng bóp đều thịt lợn tươi nóng dẻo chấm nước mắm Sa Châu đậm đà.' },
      { name: 'Kẹo sìu châu Nam Định vừng lạc', dish: 'Kẹo lạc vừng giòn tan thanh ngọt tiến vua', address: 'Phố Hàng Sắt, TP. Nam Định', costText: 'Dự kiến: 45.000đ - 70.000đ/hộp', lat: 20.4290, lng: 106.1800, advice: 'Kẹo lạc giòn xốp thơm nức bọc mè trắng, uống cùng chén trà sen nóng ấm.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đêm hồ Vị Xuyên ngắm tượng đài Trần Hưng Đạo', address: 'Quanh hồ Vị Xuyên, TP. Nam Định', advice: 'Không gian quảng trường lộng gió rợp bóng cây xanh soi bóng mặt hồ tĩnh lặng.' },
      { name: 'Thưởng thức phở bò đêm nóng hổi tại phố cổ Hàng Tiện', address: 'Phố Hàng Tiện, TP. Nam Định', advice: 'Húp thìa nước dùng phở bò nóng rực sực mùi gừng hoa hồi giữa đêm se lạnh.' },
      { name: 'Ăn xíu páo nóng hổi vừa ra lò & Uống trà sen Nam Định', address: 'Đường Hàng Thao, TP. Nam Định', advice: 'Chiếc bánh xíu páo vàng ươm thơm lừng ăn kèm ngụm trà sen thanh khiết tao nhã.' },
      { name: 'Mua nem nắm Giao Thủy và kẹo sìu châu làm quà', address: 'Chợ Rồng Nam Định / Phố Hàng Sắt', advice: 'Thức quà quê mộc mạc thơm thảo nức tiếng xứ Thành Nam mang về cho gia đình.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Nam Định', address: 'Đường Đông A / Lê Hồng Phong, Nam Định', price: '400.000đ - 850.000đ/đêm' }
  },

  'Hải Phòng': {
    region: 'Miền Bắc',
    coords: { lat: 20.8449, lng: 106.6881 },
    attractions: [
      { name: 'Nhà hát Lớn Hải Phòng & Quảng trường trung tâm', address: 'Số 28 Trần Hưng Đạo, Hoàng Văn Thụ, Hồng Bàng', duration: '1 giờ 30 phút', cost: 0, costText: 'Tham quan tự do', lat: 20.8590, lng: 106.6820, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc phong cách Baroque Pháp cổ tuyệt đẹp giữa dải vườn hoa trung tâm thành phố hoa phượng đỏ.' },
      { name: 'Ga Hải Phòng trăm năm tuổi', address: 'Lương Khánh Thiện, Lương Khánh Thiện, Ngô Quyền', duration: '1 giờ', cost: 0, costText: 'Miễn phí check-in', lat: 20.8560, lng: 106.6890, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Công trình kiến trúc đường sắt Pháp cổ kính nguyên vẹn; điểm khởi đầu của tuyến Food Tour trứ danh.' },
      { name: 'Tuyệt Tình Cốc hồ nước ngọc bích', address: 'Xã An Sơn, Thủy Nguyên, Hải Phòng', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 20.9450, lng: 106.6100, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Hồ nước xanh biếc màu ngọc bích bao quanh bởi núi đá vôi trắng kỳ ảo.' },
      { name: 'Khu di tích Bạch Đằng Giang Thủy Nguyên', address: 'Thị trấn Minh Đức, Thủy Nguyên, Hải Phòng', duration: '3 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 20.9650, lng: 106.7200, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể tâm linh tưởng niệm ba trận thủy chiến lừng lẫy chống giặc ngoại xâm trên sông Bạch Đằng.' },
      { name: 'Đền Nghè thờ Nữ tướng Lê Chân', address: 'Phố Lê Chân, An Biên, Lê Chân, Hải Phòng', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng đền', lat: 20.8520, lng: 106.6800, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Di tích tâm linh thờ vị nữ tướng anh hùng khai sinh lập nên vùng đất An Biên - Hải Phòng.' },
      { name: 'Chợ Cát Bi thiên đường ăn vặt đất Cảng', address: 'Phường Cát Bi, Quận Hải An, Hải Phòng', duration: '2 giờ', cost: 0, costText: 'Tự do ăn uống', lat: 20.8350, lng: 106.7150, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Tụ điểm ẩm thực đường phố sầm uất bậc nhất với hàng trăm món ngon chuẩn vị Hải Phòng.' },
      { name: 'Cầu Hoàng Văn Thụ biểu tượng cánh chim biển', address: 'Bắc qua sông Cấm nối Hồng Bàng và Thủy Nguyên', duration: '1 giờ', cost: 0, costText: 'Dạo bộ tự do', lat: 20.8720, lng: 106.6810, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Cây cầu vòm thép lớn nhất Việt Nam hình cánh chim biển sải cánh ra khơi lộng gió.' },
      { name: 'Bảo tàng Hải Phòng kiến trúc Gothic', address: '66 Điện Biên Phủ, Minh Khai, Hồng Bàng', duration: '1 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 20.8620, lng: 106.6850, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', advice: 'Lưu giữ hàng nghìn cổ vật quý giá tái hiện lịch sử hình thành và phát triển của thành phố Cảng.' }
    ],
    foods: [
      { name: 'Bánh đa cua bể Bà Cụ', dish: 'Bánh đa đỏ cua bể tôm bề bề chả lá lốt', address: '179 Cầu Đất, Ngô Quyền, Hải Phòng', costText: 'Dự kiến: 45.000đ - 65.000đ/bát', lat: 20.8540, lng: 106.6860, advice: 'Sợi bánh đa đỏ dai mềm trong nước dùng ngọt đậm đà gạch cua đồng và cua bể.' },
      { name: 'Bánh mì que cay Cột Đèn', dish: 'Bánh mì que pate béo ngậy chấm tương ớt chí chương', address: 'Chợ Cột Đèn, Tô Hiệu, Lê Chân', costText: 'Dự kiến: 5.000đ/chiếc', lat: 20.8460, lng: 106.6780, advice: 'Chấm đẫm tương ớt chí chương gia truyền cay nồng đặc trưng đất Cảng giòn tan.' },
      { name: 'Cà phê cốt dừa cô Hạnh', dish: 'Cà phê thơm cốt dừa béo ngậy thạch dừa trân châu', address: 'Đường Lam Sơn, Lê Chân, Hải Phòng', costText: 'Dự kiến: 30.000đ/ly', lat: 20.8490, lng: 106.6750, advice: 'Thức uống giải nhiệt ngọt béo quyến rũ được giới trẻ săn đón khi đi food tour.' },
      { name: 'Bì bò & Sủi dìn Đông Dung', dish: 'Sủi dìn nóng hổi nhân mè đen nước gừng cay ấm', address: '163 Cầu Đất, Ngô Quyền, Hải Phòng', costText: 'Dự kiến: 20.000đ - 35.000đ/bát', lat: 20.8550, lng: 106.6850, advice: 'Món ăn gốc Hoa ấm nồng thơm phức mùi gừng tươi và mè đen bùi ngậy.' }
    ],
    eveningActivities: [
      { name: 'Tuyến Food Tour đêm càn quét ẩm thực phố Cầu Đất & Cột Đèn', address: 'Trục đường Cầu Đất - Tô Hiệu', advice: 'Ăn bánh mì que, sủi dìn, chè dừa dầm và ốc xào cay nồng ấm bụng.' },
      { name: 'Tản bộ ngắm dải vườn hoa trung tâm & Nhà hát Lớn lên đèn', address: 'Quảng trường Nhà hát Lớn Hải Phòng', advice: 'Hòa mình vào nhịp sống thảnh thơi, ngắm đài phun nước rực rỡ và những hàng cây phượng vĩ.' },
      { name: 'Check-in cầu Hoàng Văn Thụ ngắm sông Cấm lung linh về đêm', address: 'Cầu Hoàng Văn Thụ, Hồng Bàng', advice: 'Hóng gió sông mát rượi, ngắm ánh đèn cầu đổi màu phản chiếu trên mặt nước lấp lánh.' },
      { name: 'Chill quán cafe phong cách Pháp cổ & Mua bánh mì cay làm quà', address: 'Phố cổ Tam Bạc / Đinh Tiên Hoàng', advice: 'Đóng thùng xốp bánh mì que pate nướng nóng hổi mang về làm quà cho bạn bè.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Hải Phòng', address: 'Quận Hồng Bàng / Ngô Quyền, TP. Hải Phòng', price: '500.000đ - 1.200.000đ/đêm' }
  },

  'Quảng Ninh': {
    region: 'Miền Bắc',
    coords: { lat: 20.9500, lng: 107.0733 },
    attractions: [
      { name: 'Quần thể danh thắng Yên Tử đất Phật Trúc Lâm', address: 'Xã Thượng Yên Công, TP. Uông Bí, Quảng Ninh', duration: '5 giờ', cost: 350000, costText: 'Dự kiến: 350.000đ cáp treo khứ hồi', lat: 21.1550, lng: 106.7200, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kinh đô Phật giáo Việt Nam; chinh phục Chùa Đồng trên đỉnh núi cao 1.068m bồng bềnh mây trắng.' },
      { name: 'Chùa Ba Vàng trên núi Thành Đẳng', address: 'Phường Quang Trung, TP. Uông Bí, Quảng Ninh', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', lat: 21.0800, lng: 106.7800, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa có chính điện trên núi lớn nhất Đông Dương với cảnh quan sơn thủy hữu tình tráng lệ.' },
      { name: 'Đảo Cô Tô biển xanh cát trắng Hồng Vàn', address: 'Huyện đảo Cô Tô, Quảng Ninh', duration: '5 giờ', cost: 250000, costText: 'Dự kiến: 250.000đ vé tàu cao tốc', lat: 20.9850, lng: 107.7650, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi đá Cầu Mỵ sóng vỗ kỳ vĩ, bãi biển Hồng Vàn nước trong vắt phẳng lặng tựa gương soi.' },
      { name: 'Đảo Quan Lạn - Minh Châu cát trắng như tuyết', address: 'Vịnh Bái Tử Long, Huyện Vân Đồn, Quảng Ninh', duration: '4 giờ', cost: 200000, costText: 'Dự kiến: 200.000đ vé tàu ra đảo', lat: 20.9050, lng: 107.5100, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Bãi tắm Minh Châu cát trắng mịn không dính chân; không gian hoang sơ yên bình tĩnh lặng.' },
      { name: 'Cảng quốc tế Vân Đồn & Bãi dài Phương Đông', address: 'Khu đô thị Phương Đông, Vân Đồn, Quảng Ninh', duration: '2 giờ 30 phút', cost: 0, costText: 'Tự do dạo biển', lat: 21.0500, lng: 107.3500, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Ngắm toàn cảnh vịnh Bái Tử Long với các cụm đảo đá nhấp nhô từ con đường ven biển hiện đại.' },
      { name: 'Đền Cửa Ông địa danh tâm linh trấn biển', address: 'Phường Cửa Ông, TP. Cẩm Phả, Quảng Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng đền', lat: 21.0250, lng: 107.3750, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Nơi phụng thờ Hưng Nhượng Vương Trần Quốc Tảng trấn giữ vùng biển Đông Bắc Tổ Quốc.' },
      { name: 'Mỏ than lộ thiên Đèo Nai Cẩm Phả', address: 'Phường Cẩm Sơn, TP. Cẩm Phả, Quảng Ninh', duration: '2 giờ', cost: 0, costText: 'Ngắm từ đài quan sát', lat: 21.0150, lng: 107.3000, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Chiêm ngưỡng công trường khai thác than lộ thiên hùng vĩ biểu tượng của vùng đất mỏ anh hùng.' },
      { name: 'Suối khoáng nóng Yoko Onsen Quang Hanh', address: 'Phường Quang Hanh, TP. Cẩm Phả, Quảng Ninh', duration: '3 giờ', cost: 750000, costText: 'Dự kiến: 750.000đ/vé tắm Onsen', lat: 20.9850, lng: 107.1950, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Khu nghỉ dưỡng tắm khoáng nóng phong cách Nhật Bản giữa thung lũng núi đá thanh bình.' }
    ],
    foods: [
      { name: 'Bún bề bề Cẩm Phả tôm nõn', dish: 'Bún bề bề tôm tươi nước lèo chua cay thanh ngọt', address: 'Đường Trần Phú, Cẩm Phả, Quảng Ninh', costText: 'Dự kiến: 40.000đ - 55.000đ/bát', lat: 21.0100, lng: 107.2950, advice: 'Thịt bề bề thơm ngọt bóc nõn ăn kèm rau cần nước giòn ngọt.' },
      { name: 'Gà đồi Tiên Yên da vàng giòn', dish: 'Gà đồi Tiên Yên luộc chấm nước sốt cà ti', address: 'Thị trấn Tiên Yên, Quảng Ninh', costText: 'Dự kiến: 250.000đ - 350.000đ/con', lat: 21.3200, lng: 107.4000, advice: 'Da gà vàng ươm mọng nước giòn sần sật như thạch, thịt ngọt thơm đậm đà.' },
      { name: 'Khau nhục Tiên Yên hầm nhừ', dish: 'Thịt ba chỉ hầm nhừ thảo quả lá móc mật tàu soi', address: 'Khu ẩm thực Tiên Yên / Ba Chẽ', costText: 'Dự kiến: 120.000đ - 180.000đ/đĩa', lat: 21.3220, lng: 107.4050, advice: 'Món ăn truyền thống của người Tày thơm béo mềm tan trong miệng ăn cùng xôi nếp.' },
      { name: 'Sá sùng Quan Lạn xào tỏi / nấu canh', dish: 'Sá sùng khô nướng vàng hoặc sá sùng tươi xào lá lốt', address: 'Cảng Cái Rồng, Vân Đồn', costText: 'Dự kiến: 200.000đ - 350.000đ/đĩa', lat: 21.0650, lng: 107.3450, advice: 'Đặc sản biển tiến vua đắt giá vị ngọt sâu thanh khiết tự nhiên.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đêm Cẩm Phả ngắm vịnh Bái Tử Long lung linh', address: 'Đường bao biển Cẩm Phả, Quảng Ninh', advice: 'Tản bộ trên cung đường bao biển hiện đại ngắm biển đêm và gió lộng.' },
      { name: 'Thưởng thức hải sản đêm tươi sống tại cảng Cái Rồng', address: 'Bến cảng Cái Rồng, Vân Đồn', advice: 'Ăn mực nướng, hàu nướng mỡ hành tại các nhà bè nổi ven cảng biển.' },
      { name: 'Thư giãn ngâm khoáng nóng Yoko Onsen Quang Hanh buổi tối', address: 'Quang Hanh, Cẩm Phả', advice: 'Ngâm mình trong dòng khoáng ấm xua tan mệt mỏi và cân bằng năng lượng cơ thể.' },
      { name: 'Mua sá sùng Quan Lạn, mực khô một nắng làm quà', address: 'Chợ hải sản Vân Đồn / Cẩm Phả', advice: 'Đặc sản biển cao cấp được đóng gói hút chân không tiện lợi đem về làm quà biếu.' }
    ],
    hotel: { name: 'Resort / Khách sạn Vân Đồn - Cẩm Phả', address: 'Vân Đồn / Cẩm Phả / Uông Bí, Quảng Ninh', price: '550.000đ - 1.600.000đ/đêm' }
  },

  'Huế': {
    region: 'Miền Trung',
    coords: { lat: 16.4637, lng: 107.5909 },
    attractions: [
      { name: 'Đại Nội Huế & Tử Cấm Thành triều Nguyễn', address: 'Đường 23 Tháng 8, Thuận Hòa, TP. Huế', duration: '3 giờ 30 phút', cost: 200000, costText: 'Dự kiến: 200.000đ/vé', lat: 16.4698, lng: 107.5786, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Hoàng cung nguy nga của 13 vị vua triều Nguyễn; nên thuê áo dài cổ phục chụp ảnh cung đình.' },
      { name: 'Chùa Thiên Mụ & Tháp Phước Duyên 7 tầng', address: 'Đồi Hà Khê, Hương Long, TP. Huế', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', lat: 16.4528, lng: 107.5450, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi quốc tự cổ nhất xứ Huế soi bóng bên dòng sông Hương thơ mộng; tiếng chuông chùa ngân vang.' },
      { name: 'Lăng Khải Định (Ứng Lăng) đỉnh cao khảm sành sứ', address: 'Xã Thủy Bằng, Hương Thủy, Thừa Thiên Huế', duration: '2 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ/vé', lat: 16.3986, lng: 107.5903, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Kiệt tác nghệ thuật kiến trúc kết hợp Á - Âu với điện Khải Thành khảm sành sứ và thủy tinh lộng lẫy.' },
      { name: 'Lăng Tự Đức (Khiêm Lăng) bức tranh sơn thủy', address: 'Thôn Thượng Ba, Thủy Xuân, TP. Huế', duration: '2 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ/vé', lat: 16.4331, lng: 107.5647, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể lăng tẩm thơ mộng nhất với hồ Lưu Khiêm, nhà thủy tạ Xung Khiêm Tạ rợp bóng thông xanh.' },
      { name: 'Làng hương Thủy Xuân rực rỡ sắc màu', address: 'Đường Huyền Trân Công Chúa, Thủy Xuân, TP. Huế', duration: '1 giờ 30 phút', cost: 0, costText: 'Tham quan & chụp ảnh tự do', lat: 16.4380, lng: 107.5670, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Các bó tăm hương xòe hoa ngũ sắc rực rỡ thơm ngát mùi trầm; trải nghiệm tự tay se nén hương truyền thống.' },
      { name: 'Đồi Vọng Cảnh ngắm khúc quanh sông Hương', address: 'Đồi Vọng Cảnh, Thủy Biều, TP. Huế', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí ngắm cảnh', lat: 16.4300, lng: 107.5500, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Tọa độ ngắm hoàng hôn buông xuống dòng sông Hương và các lăng tẩm đẹp như một bức tranh thủy mặc.' },
      { name: 'Trường Quốc Học Huế & Cầu Gỗ Lim ven sông', address: '12 Lê Lợi, Vĩnh Ninh, TP. Huế', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 16.4625, lng: 107.5858, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi trường cổ với tường gạch đỏ phong cách Pháp cổ rợp bóng hoa điệp anh đào mùa nở rộ.' },
      { name: 'Phá Tam Giang & Đầm Chuồn mênh mông sông nước', address: 'Huyện Phú Vang, Thừa Thiên Huế', duration: '3 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ thuê thuyền ngắm phá', lat: 16.5400, lng: 107.6500, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Đầm phá nước lợ lớn nhất Đông Nam Á; ăn bánh khoái cá kình tươi rói ngay trên nhà chồ giữa đầm.' }
    ],
    foods: [
      { name: 'Bún bò Huế O Phượng gia truyền', dish: 'Bún bò giò heo chả cua huyết nước dùng thơm sả ruốc', address: '24 Nguyễn Khuyến, Vĩnh Ninh, TP. Huế', costText: 'Dự kiến: 45.000đ - 65.000đ/tô', lat: 16.4670, lng: 107.5920, advice: 'Vị ngọt đậm từ xương bò ninh nhừ quyện hương sả và mắm ruốc Huế đặc trưng thơm nức.' },
      { name: 'Cơm hến & Bún hến Đập Đá Cồn Hến', dish: 'Cơm hến xào cay nồng tóp mỡ giòn rụm rau bắp chuối', address: 'Cồn Hến, Vĩ Dạ, TP. Huế', costText: 'Dự kiến: 20.000đ - 35.000đ/tô', lat: 16.4710, lng: 107.6050, advice: 'Món ăn dân dã cay xé lưỡi bùng nổ vị giác ăn cùng chén nước luộc hến ngọt thanh nghi ngút khói.' },
      { name: 'Bánh bèo, nậm, lọc bà Đỏ xứ Huế', dish: 'Khay bánh bèo tôm cháy, bánh nậm lá dong, bánh lọc tôm thịt', address: '8 Nguyễn Bỉnh Khiêm, Phú Cát, TP. Huế', costText: 'Dự kiến: 50.000đ - 80.000đ/phần', lat: 16.4630, lng: 107.5940, advice: 'Chén bánh bèo mỏng mướt rắc tôm cháy đỏ au chan nước mắm ớt cay ngọt thanh tao.' },
      { name: 'Chè Hẻm Huế 20 món & Chè bột lọc bọc heo quay', dish: 'Chè bột lọc bọc thịt heo quay mặn ngọt độc đáo', address: 'Số 1 Kiệt 29 Hùng Vương, Phú Hội, TP. Huế', costText: 'Dự kiến: 15.000đ - 25.000đ/ly', lat: 16.4680, lng: 107.5910, advice: 'Sự kết hợp độc lạ giữa vị ngọt của đường phèn, vị béo mặn của thịt quay giòn trong viên bột lọc trong veo.' }
    ],
    eveningActivities: [
      { name: 'Du thuyền rồng sông Hương nghe Ca Huế & Thả hoa đăng', address: 'Bến thuyền Tòa Khâm, Lê Lợi, TP. Huế', advice: 'Thưởng thức nhã nhạc cung đình và làn điệu ca Huế ngọt ngào, thả hoa đăng cầu may trên dòng sông Hương.' },
      { name: 'Dạo phố đi bộ Chu Văn An - Võ Thị Sáu - Phạm Ngũ Lão (Phố Tây)', address: 'Phố Tây Vĩnh Ninh, TP. Huế', advice: 'Không gian sôi động về đêm với các quán pub, acoustic và ẩm thực đường phố đa dạng.' },
      { name: 'Tản bộ cầu Tràng Tiền 6 vài 12 nhịp đổi màu lung linh', address: 'Cầu Tràng Tiền, TP. Huế', advice: 'Ngắm cây cầu lịch sử rực rỡ sắc màu phản chiếu mặt nước và tận hưởng làn gió mát lành.' },
      { name: 'Thưởng thức chè đêm bờ sông & Mua kẹo mè xửng, nón bài thơ làm quà', address: 'Đường Lê Lợi / Chợ Đông Ba, TP. Huế', advice: 'Chọn mua mè xửng Thiên Hương, trà cung đình Huế và nón bài thơ tinh xảo làm quà kỷ niệm.' }
    ],
    hotel: { name: 'Resort / Khách sạn bờ sông Hương Huế', address: 'Đường Lê Lợi / Nguyễn Huệ, TP. Huế', price: '500.000đ - 1.400.000đ/đêm' }
  },

  'Quảng Bình': {
    region: 'Miền Trung',
    coords: { lat: 17.4729, lng: 106.6028 },
    attractions: [
      { name: 'Động Phong Nha di sản thiên nhiên thế giới UNESCO', address: 'Xã Sơn Trạch, Bố Trạch, Quảng Bình', duration: '3 giờ 30 phút', cost: 150000, costText: 'Dự kiến: 150.000đ vé vào cổng + thuyền sông Son', lat: 17.5822, lng: 106.2822, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi thuyền nan trôi theo dòng sông ngầm ngắm 7 kỷ lục thế giới về hang động thạch nhũ.' },
      { name: 'Động Thiên Đường - Hoàng cung trong lòng đất', address: 'Km 16 Đường Hồ Chí Minh nhánh Tây, Bố Trạch', duration: '3 giờ', cost: 250000, costText: 'Dự kiến: 250.000đ/vé vào hang', lat: 17.5200, lng: 106.2230, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Hang động khô dài nhất Châu Á với hệ thống cầu gỗ 1km dẫn lối qua rừng thạch nhũ tráng lệ.' },
      { name: 'Suối Nước Moọc dòng suối xanh ngọc bích', address: 'Khu bảo tồn Phong Nha - Kẻ Bàng, Bố Trạch', duration: '2 giờ 30 phút', cost: 80000, costText: 'Dự kiến: 80.000đ/vé tham quan', lat: 17.5350, lng: 106.2410, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Nước suối nguồn phun trào từ lòng núi đá vôi mát lạnh 18-20 độ C; chèo thuyền kayak và tắm suối.' },
      { name: 'Sông Chày - Hang Tối chèo thuyền & Tắm bùn tự nhiên', address: 'Vườn Quốc gia Phong Nha - Kẻ Bàng, Bố Trạch', duration: '3 giờ 30 phút', cost: 450000, costText: 'Dự kiến: 450.000đ vé tour trọn gói Zipline + tắm bùn', lat: 17.5500, lng: 106.2550, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Trải nghiệm đu dây zipline vượt sông Chày, ngâm bùn khoáng tinh khiết trong hang sâu không ánh sáng.' },
      { name: 'Cồn Cát Quang Phú trượt cát ven biển', address: 'Xã Quang Phú, TP. Đồng Hới, Quảng Bình', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ thuê ván trượt cát', lat: 17.5120, lng: 106.6050, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Đồi cát trắng thoai thoải ôm lấy bờ biển; thời điểm lý tưởng nhất lúc bình minh hoặc hoàng hôn xế chiều.' },
      { name: 'Biển Nhật Lệ & Tượng đài Mẹ Suốt', address: 'Đường Trương Pháp, TP. Đồng Hới, Quảng Bình', duration: '2 giờ', cost: 0, costText: 'Miễn phí tắm biển', lat: 17.4780, lng: 106.6280, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát vàng óng ả phẳng lặng bên cửa sông Nhật Lệ; chiêm bái tượng đài Mẹ Suốt anh hùng bên bến đò xưa.' },
      { name: 'Hang Tám Cô & Đền tưởng niệm Đường 20 Quyết Thắng', address: 'Km 16.5 Đường 20 Quyết Thắng, Bố Trạch', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng hương', lat: 17.5300, lng: 106.2700, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Địa chỉ đỏ tri ân 8 nữ thanh niên xung phong hy sinh anh dũng trong cuộc kháng chiến vệ quốc.' },
      { name: 'Vũng Chùa - Đảo Yến nơi yên nghỉ Đại tướng Võ Nguyên Giáp', address: 'Thôn Thọ Sơn, Xã Quảng Đông, Huyện Quảng Trạch', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng mộ', lat: 17.9150, lng: 106.4750, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Khu vực non nước hữu tình tựa lưng núi Mũi Rồng nhìn ra đảo Yến thanh bình, tưởng nhớ Đại tướng.' }
    ],
    foods: [
      { name: 'Cháo canh cá lóc Quảng Bình (Bánh canh)', dish: 'Cháo canh sợi mì nhào tay nấu cá lóc đồng rau cải xanh', address: 'Đường Hai Bà Trưng, TP. Đồng Hới', costText: 'Dự kiến: 35.000đ - 50.000đ/tô', lat: 17.4700, lng: 106.6000, advice: 'Ăn kèm ram giòn nóng hổi và rau cải con cay the thơm ngọt nước hầm cá.' },
      { name: 'Bánh bột lọc Mệ Xuân Đồng Hới', dish: 'Bánh lọc tôm sông mộc nhĩ dẻo dai chấm mắm ớt cay', address: 'Ngõ 15 Lê Thành Đồng, TP. Đồng Hới', costText: 'Dự kiến: 30.000đ - 50.000đ/đĩa', lat: 17.4750, lng: 106.6050, advice: 'Vỏ bánh lọc trong suốt nhìn thấy rõ tôm tươi và thịt mỡ rim đậm đà ăn kèm mắm ớt cay nồng.' },
      { name: 'Đẻn biển nướng & Ram đẻn Nhật Lệ', dish: 'Đẻn biển cuốn lá lốt nướng than hoa thơm nức', address: 'Đường Trương Pháp ven biển Nhật Lệ', costText: 'Dự kiến: 150.000đ - 250.000đ/đĩa', lat: 17.4800, lng: 106.6250, advice: 'Món hải sản biển đại bổ trứ danh của vùng biển Quảng Bình uống kèm chút rượu đẻn biển.' },
      { name: 'Lẩu cá khoai Quảng Bình nước lèo chua cay', dish: 'Cá khoai tươi rói nhúng lẩu chua thì là cà chua', address: 'Khu ẩm thực bờ biển Đồng Hới', costText: 'Dự kiến: 250.000đ - 350.000đ/nồi', lat: 17.4850, lng: 106.6200, advice: 'Cá khoai thịt mềm ngọt tan ngay trong miệng, nước lẩu thanh dịu giải nhiệt mùa hè.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố biển Nhật Lệ thưởng thức mực nhảy hấp sả', address: 'Đường Trương Pháp, TP. Đồng Hới', advice: 'Hóng gió biển mát rượi, ăn mực ống câu đêm tươi giòn sần sật tại các quán ven bờ kè.' },
      { name: 'Tản bộ Quảng trường Hồ Chí Minh & Ngắm Cầu Nhật Lệ rực sáng', address: 'Quảng trường trung tâm TP. Đồng Hới', advice: 'Chiêm ngưỡng cầu Nhật Lệ uốn cong bắc qua sông lung linh ánh đèn phản chiếu mặt nước.' },
      { name: 'Thưởng thức bánh xèo gạo lứt Quảng Hòa & Chè bưởi đêm', address: 'Phố ẩm thực đêm Đồng Hới', advice: 'Bánh xèo vỏ giòn rụm từ gạo lứt đỏ cuốn cá chuối kho và rau sống tươi xanh.' },
      { name: 'Mua khoai deo Quảng Bình, sâm Bố Chính & Mực một nắng làm quà', address: 'Chợ Đồng Hới bên bờ sông Nhật Lệ', advice: 'Khoai deo dẻo ngọt bùi tự nhiên phơi nắng cồn cát là đặc sản quý giá bậc nhất Quảng Bình.' }
    ],
    hotel: { name: 'Resort / Khách sạn biển Nhật Lệ Đồng Hới', address: 'Đường Trương Pháp, TP. Đồng Hới / TT. Phong Nha', price: '450.000đ - 1.200.000đ/đêm' }
  },

  'Quy Nhơn': {
    region: 'Miền Trung',
    coords: { lat: 13.7820, lng: 109.2194 },
    attractions: [
      { name: 'Bãi biển Kỳ Co - Thiên đường Maldives Việt Nam', address: 'Xã Nhơn Lý, TP. Quy Nhơn, Bình Định', duration: '4 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ vé vào cổng + xe trung chuyển', lat: 13.8500, lng: 109.2850, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Dải cát trắng mịn bên làn nước biển hai màu xanh ngọc bích phẳng lặng; cầu gỗ check-in sống ảo.' },
      { name: 'Eo Gió - Điểm ngắm hoàng hôn đẹp nhất Việt Nam', address: 'Thôn Lý Lương, Xã Nhơn Lý, Quy Nhơn', duration: '2 giờ', cost: 25000, costText: 'Dự kiến: 25.000đ/vé', lat: 13.8650, lng: 109.2900, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Con đường đi bộ men vách đá ôm trọn eo biển lộng gió với hàng rào đỏ trắng đặc trưng.' },
      { name: 'Ghềnh Ráng Tiên Sa & Mộ thi sĩ Hàn Mặc Tử', address: 'Phường Ghềnh Ráng, TP. Quy Nhơn', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 13.7380, lng: 109.2150, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Bãi đá Trứng (Bãi tắm Hoàng Hậu) với hàng triệu viên đá tròn nhẵn như trứng chim khổng lồ.' },
      { name: 'Tháp Đôi Chăm Pa nghìn năm tuổi', address: 'Đường Trần Hưng Đạo, Đống Đa, Quy Nhơn', duration: '1 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 13.7850, lng: 109.2050, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Di tích tháp Chăm cổ nguyên vẹn giữa lòng phố thị với hoa văn chạm khắc tượng chim thần Garuda.' },
      { name: 'Đảo Hòn Khô & Con đường đi bộ xuyên biển', address: 'Thôn Hải Đông, Xã Nhơn Hải, Quy Nhơn', duration: '3 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ vé ca nô khứ hồi', lat: 13.7650, lng: 109.3000, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Cầu gỗ dựng trên vách đá ngắm biển trong vắt; lặn ngắm rạn san hô tự nhiên đa sắc màu.' },
      { name: 'Đồi cát Phương Mai trượt cát khổng lồ', address: 'Xã Cát Tiến, Huyện Phù Cát, Bình Định', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí (Thuê ván trượt: 30.000đ)', lat: 13.8400, lng: 109.2450, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Đồi cát nguyên sơ thoai thoải ngắm toàn cảnh đầm Thị Nại và cầu vượt biển dài nhất Việt Nam.' },
      { name: 'Khu dã ngoại Trung Lương biển xanh lều trại', address: 'Thôn Trung Lương, Cát Tiến, Phù Cát', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé vào cổng', lat: 13.9550, lng: 109.2150, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Thung lũng đá hướng ra biển xanh trong vắt với bãi cỏ cắm trại phong cách dã ngoại xinh xắn.' },
      { name: 'Bảo tàng Quang Trung & Cây me cổ thụ 300 năm', address: 'Thị trấn Phú Phong, Huyện Tây Sơn, Bình Định', duration: '2 giờ 30 phút', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 13.9100, lng: 108.9100, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Quê hương người anh hùng áo vải cờ đào Quang Trung; xem biểu diễn trống trận Tây Sơn hào hùng.' }
    ],
    foods: [
      { name: 'Bánh xèo tôm nhảy Gia Vỹ', dish: 'Bánh xèo tôm đất tươi sống giòn rụm rau mầm xoài chua', address: '14 Diên Hồng / 118 Đống Đa, TP. Quy Nhơn', costText: 'Dự kiến: 35.000đ - 55.000đ/cái', lat: 13.7750, lng: 109.2200, advice: 'Tôm đất nhảy tanh tách đúc trên chảo gang giòn tan cuốn bánh tráng rau sống chấm mắm ớt tỏi.' },
      { name: 'Bún chả cá Quy Nhơn Ngọc Liên', dish: 'Bún chả cá thu dai ngọt nước lèo dứa cà chua thơm thanh', address: '379 Nguyễn Huệ, Trần Phú, TP. Quy Nhơn', costText: 'Dự kiến: 35.000đ - 50.000đ/tô', lat: 13.7780, lng: 109.2250, advice: 'Chả cá quết mịn từ cá thu cá nhồng tươi dai giòn sần sật, ăn cùng sứa tươi giòn ngọt.' },
      { name: 'Bánh hỏi cháo lòng Diên Hồng', dish: 'Bánh hỏi thoa mỡ hẹ đĩa lòng heo nóng đẫm tô cháo', address: '20 Diên Hồng, TP. Quy Nhơn', costText: 'Dự kiến: 40.000đ - 60.000đ/suất', lat: 13.7720, lng: 109.2180, advice: 'Bữa sáng chuẩn vị người Bình Định với bánh hỏi mướt mát, đĩa lòng luộc nóng chấm mắm ớt.' },
      { name: 'Hải sản ốc biển đường Xuân Diệu', dish: 'Cua huỳnh đế hấp, cá tà ma nướng, ốc hương sốt trứng muối', address: 'Đường bờ biển Xuân Diệu, TP. Quy Nhơn', costText: 'Dự kiến: 200.000đ - 350.000đ/người', lat: 13.7680, lng: 109.2300, advice: 'Thưởng thức hải sản tươi sống đánh bắt tại làng chài ngay sát mép sóng biển rì rào.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố ẩm thực đêm Ngô Văn Sở thưởng thức nem nướng', address: 'Đường Ngô Văn Sở, Trần Phú, Quy Nhơn', advice: 'Thiên đường ăn vặt với nem nướng lụi than, mực rim me cay, kem cuộn và sinh tố trái cây.' },
      { name: 'Chill tại Surf Bar ngay trên bãi cát biển Xuân Diệu', address: 'Bãi biển Xuân Diệu, TP. Quy Nhơn', advice: 'Quán bar ngoài trời lãng mạn trên cát với xích đu gỗ, đèn vàng lung linh và tiếng sóng biển êm đềm.' },
      { name: 'Tản bộ Quảng trường Nguyễn Tất Thành ngắm tượng đài cha con Bác', address: 'Đại lộ Nguyễn Tất Thành, TP. Quy Nhơn', advice: 'Không gian quảng trường lộng gió rợp bóng cọ biển, nơi vui chơi đông đúc nhất của người dân địa phương.' },
      { name: 'Thưởng thức tré Bình Định & Mua bánh ít lá gai, rượu Bàu Đá làm quà', address: 'Phố đặc sản đường Tăng Bạt Hổ, Quy Nhơn', advice: 'Tré rơm chua ngọt bùi béo và bánh ít lá gai dẻo thơm nức tiếng xứ võ Bình Định.' }
    ],
    hotel: { name: 'Khách sạn / Resort ven biển Quy Nhơn', address: 'Đường Xuân Diệu / An Dương Vương, TP. Quy Nhơn', price: '500.000đ - 1.500.000đ/đêm' }
  },

  'Phú Yên': {
    region: 'Miền Trung',
    coords: { lat: 13.0882, lng: 109.3175 },
    attractions: [
      { name: 'Gành Đá Đĩa kỳ quan đá bazan núi lửa thế giới', address: 'Xã An Ninh Đông, Huyện Tuy An, Phú Yên', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 13.3480, lng: 109.2960, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Hàng vạn cột đá bazan hình lục giác xếp khít nhau như tổ ong khổng lồ vươn ra biển xanh biếc.' },
      { name: 'Mũi Điện (Mũi Đại Lãnh) đón ánh bình minh đầu tiên', address: 'Thôn Phước Tân, Xã Hòa Tâm, Đông Hòa, Phú Yên', duration: '2 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 12.8830, lng: 109.4580, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Nơi đón ánh mặt trời đầu tiên trên đất liền Việt Nam; ngọn hải đăng sừng sững trên vách đá cao.' },
      { name: 'Bãi Môn bờ cát mịn dưới chân hải đăng Mũi Điện', address: 'Chân núi Mũi Điện, Hòa Tâm, Đông Hòa', duration: '2 giờ', cost: 0, costText: 'Tự do tắm biển', lat: 12.8870, lng: 109.4550, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi biển hình vầng trăng khuyết hoang sơ nước trong vắt phẳng lặng với dòng suối nước ngọt chảy ra biển.' },
      { name: 'Tháp Nghinh Phong biểu tượng kiến trúc đương đại', address: 'Ngã tư Nguyễn Hữu Thọ - Độc Lập, TP. Tuy Hòa', duration: '1 giờ 30 phút', cost: 0, costText: 'Tham quan tự do', lat: 13.1150, lng: 109.3180, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc lấy cảm hứng từ truyền thuyết Lạc Long Quân - Âu Cơ và Gành Đá Đĩa; check-in tuyệt đẹp.' },
      { name: 'Bãi Xép & Đồi cỏ xanh "Tôi thấy hoa vàng trên cỏ xanh"', address: 'Xã An Chấn, Huyện Tuy An, Phú Yên', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 13.2050, lng: 109.2880, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi đá đen huyền bí, đồi cỏ xương rồng đón gió lộng nhìn ra bãi cát vàng óng ả và biển xanh rì rào.' },
      { name: 'Tháp Nhạn Chăm Pa nghìn năm trên đỉnh núi Nhạn', address: 'Phường 1, TP. Tuy Hòa, Phú Yên', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 13.0800, lng: 109.3050, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Tháp cổ Chăm Pa thế kỷ XI đứng sừng sững soi bóng dòng sông Ba; ngắm toàn cảnh thành phố Tuy Hòa.' },
      { name: 'Vịnh Vũng Rô di tích bến tàu không số anh hùng', address: 'Xã Hòa Xuân Nam, Thị xã Đông Hòa, Phú Yên', duration: '2 giờ', cost: 0, costText: 'Tham quan bến tàu & nhà bè', lat: 12.8600, lng: 109.4100, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Vịnh biển kín gió nước phẳng như gương; ăn hải sản tươi sống trên bè nổi và ngắm xác tàu không số.' },
      { name: 'Đầm Ô Loan thiên đường sò huyết', address: 'Thị trấn Chí Thạnh, Huyện Tuy An, Phú Yên', duration: '2 giờ', cost: 0, costText: 'Khám phá tự do', lat: 13.2650, lng: 109.2750, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Ngắm hoàng hôn lãng mạn bên mặt đầm tĩnh lặng; thưởng thức đặc sản sò huyết Ô Loan ngon số một Việt Nam.' }
    ],
    foods: [
      { name: 'Mắt cá ngừ đại dương hầm thuốc bắc Bà Tám', dish: 'Mắt cá ngừ hầm thảo mộc trong hũ đất nung nóng hổi', address: '289 Lê Duẩn, Phường 7, TP. Tuy Hòa', costText: 'Dự kiến: 45.000đ - 60.000đ/thố', lat: 13.0850, lng: 109.3100, advice: 'Đặc sản trứ danh bổ dưỡng vị béo ngậy của mắt cá ngừ quyện hương kỷ tử, táo đỏ, ớt xanh the ấm.' },
      { name: 'Sò huyết Đầm Ô Loan nướng mỡ hành', dish: 'Sò huyết đầm béo múp nướng mọi hoặc xào me chua ngọt', address: 'Cầu An Hải, Đầm Ô Loan, Tuy An', costText: 'Dự kiến: 120.000đ - 180.000đ/đĩa', lat: 13.2680, lng: 109.2780, advice: 'Sò huyết Ô Loan thịt dày, ngọt đậm đà khác biệt, ăn kèm rau răm và muối tiêu chanh tươi.' },
      { name: 'Bánh canh hẹ chả cá Tuy Hòa', dish: 'Bánh canh bột gạo phủ xanh ngắt lá hẹ chả cá thu dai ngọt', address: 'Đường Điện Biên Phủ / Chợ Tuy Hòa', costText: 'Dự kiến: 25.000đ - 35.000đ/tô', lat: 13.0820, lng: 109.3120, advice: 'Bát bánh canh phủ kín lớp hẹ thái nhỏ xanh mướt, nước lèo ngọt thanh ninh từ xương cá cờ cá thu.' },
      { name: 'Bò một nắng chấm muối kiến vàng Krông Pa', dish: 'Bò tơ phơi một nắng nướng than xé sợi chấm muối kiến chua cay', address: 'Nhà hàng đặc sản TP. Tuy Hòa', costText: 'Dự kiến: 180.000đ - 250.000đ/đĩa', lat: 13.0900, lng: 109.3080, advice: 'Thịt bò dai ngọt thơm lừng quyện vị chua độc lạ của trứng kiến và ớt hiểm rừng.' }
    ],
    eveningActivities: [
      { name: 'Check-in Tháp Nghinh Phong trình diễn ánh sáng laser & Âm nhạc', address: 'Quảng trường Tháp Nghinh Phong, Tuy Hòa', advice: 'Tháp rực rỡ dưới hiệu ứng ánh sáng đèn LED và laser hiện đại bên tiếng sóng biển rì rào.' },
      { name: 'Dạo phố đi bộ bờ biển Độc Lập hóng gió biển Tuy Hòa', address: 'Đường Độc Lập, Phường 7, Tuy Hòa', advice: 'Tản bộ trên vỉa hè lát đá ven biển mát rượi, thưởng thức dừa xiêm ngọt lịm.' },
      { name: 'Thưởng thức chè mít đười ươi & Bánh xèo tôm mực vỉa hè', address: 'Khu ẩm thực đêm bờ kè Bạch Đằng', advice: 'Ngồi ghế nhựa sát mép sông Ba thưởng thức các món ăn vặt dân dã xứ Nẫu thơm ngon giá bình dân.' },
      { name: 'Mua bò một nắng muối kiến vàng, nước mắm Gành Đỏ làm quà', address: 'Chợ Tuy Hòa / Các tiệm đặc sản Tuy Hòa', advice: 'Đặc sản trứ danh đóng gói hút chân không chuyên nghiệp mang về làm quà biếu gia đình.' }
    ],
    hotel: { name: 'Khách sạn / Resort bờ biển Tuy Hòa Phú Yên', address: 'Đường Độc Lập / Hùng Vương, TP. Tuy Hòa', price: '450.000đ - 1.300.000đ/đêm' }
  },

  'Nha Trang': {
    region: 'Miền Trung',
    coords: { lat: 12.2388, lng: 109.1967 },
    attractions: [
      { name: 'VinWonders Nha Trang & Đảo Hòn Tre', address: 'Đảo Hòn Tre, Vĩnh Nguyên, TP. Nha Trang', duration: '6 giờ', cost: 800000, costText: 'Dự kiến: 800.000đ/vé trọn gói vui chơi + cáp treo', lat: 12.2150, lng: 109.2450, image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop&q=80', advice: 'Tổ hợp công viên giải trí đẳng cấp thế giới với thủy cung, công viên nước và show thực cảnh Tata Show.' },
      { name: 'Tháp Bà Ponagar kiến trúc Chăm cổ kính', address: 'Đường 2 Tháng 4, Vĩnh Phước, TP. Nha Trang', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 12.2650, lng: 109.1950, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể tháp Chăm nghìn năm tuổi tọa lạc trên đồi Cù Lao nhìn ra cửa biển xóm Bóng; xem múa Chăm.' },
      { name: 'Tour 3 đảo: Hòn Mun, Hòn Tằm lặn biển san hô', address: 'Cảng du lịch Nha Trang, Vĩnh Trường, TP. Nha Trang', duration: '5 giờ', cost: 450000, costText: 'Dự kiến: 450.000đ vé ca nô ghép tour đảo', lat: 12.1650, lng: 109.3000, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Khu bảo tồn biển sinh học Hòn Mun nước trong như pha lê ngắm hàng trăm loài san hô và cá nhiệt đới.' },
      { name: 'Viện Hải Dương Học Nha Trang bể cá khổng lồ', address: 'Số 1 Cầu Đá, Vĩnh Hòa, TP. Nha Trang', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 12.2050, lng: 109.2150, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Bảo tàng biển lớn nhất Đông Dương với đường hầm thủy cung và bộ xương cá voi khổng lồ dài 26m.' },
      { name: 'Bãi biển Trần Phú dải cát vàng thoai thoải', address: 'Đường Trần Phú, TP. Nha Trang, Khánh Hòa', duration: '2 giờ', cost: 0, costText: 'Miễn phí tắm biển', lat: 12.2400, lng: 109.1980, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Cung đường biển đẹp nhất Việt Nam với hàng dừa rợp bóng và làn nước biển trong xanh êm đềm quanh năm.' },
      { name: 'Chùa Long Sơn tượng Kim Thân Phật Tổ trắng', address: 'Số 20 Đường 23 Tháng 10, Phương Sơn, Nha Trang', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', lat: 12.2500, lng: 109.1800, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Pho tượng Phật Thích Ca ngồi thuyết pháp bằng bê tông trắng cao 24m trên đỉnh đồi Trại Thủy.' },
      { name: 'Nhà thờ Đá Nha Trang (Nhà thờ Núi Gothic)', address: '31 Thái Nguyên, Phước Tân, TP. Nha Trang', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 12.2450, lng: 109.1880, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic Pháp bằng đá đẽo rêu phong với các ô cửa kính màu hoa hồng tráng lệ.' },
      { name: 'Suối khoáng nóng I-Resort tắm bùn khoáng tự nhiên', address: 'Tổ 19, Thôn Xuân Ngọc, Vĩnh Ngọc, Nha Trang', duration: '3 giờ', cost: 260000, costText: 'Dự kiến: 260.000đ/vé tắm bùn khoáng', lat: 12.2800, lng: 109.1750, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngâm mình trong bùn khoáng vô cơ tự nhiên giúp thải độc, mịn màng làn da và thư giãn tuyệt đối.' }
    ],
    foods: [
      { name: 'Nem nướng Nha Trang Đặng Văn Quyên', dish: 'Nem nướng lụi than hoa giòn rụm cuốn bánh tráng ram sốt tương nếp', address: '16A Lãn Ông / 02-04 Phan Bội Châu, Nha Trang', costText: 'Dự kiến: 60.000đ - 80.000đ/phần', lat: 12.2520, lng: 109.1920, advice: 'Nước chấm tương nếp thịt băm ấm nóng béo bùi gia truyền làm nên linh hồn của món nem nướng.' },
      { name: 'Bún sứa chả cá Năm Beo chợ Đầm', dish: 'Bún sứa biển tươi giòn ngọt nước dùng cá dầm thanh khiết', address: 'Lô B2 Chung cư Chợ Đầm, Phan Bội Châu', costText: 'Dự kiến: 35.000đ - 55.000đ/tô', lat: 12.2550, lng: 109.1900, advice: 'Thịt sứa giòn sần sật mọng nước thanh mát ăn cùng chả cá thu chiên vàng thơm phức.' },
      { name: 'Bánh căn mực trứng Cô Trang ngập mỡ hành', dish: 'Bánh căn đổ khuôn đất giòn đáy ngập mực trứng tôm tươi', address: '3A Tháp Bà, Vĩnh Thọ, TP. Nha Trang', costText: 'Dự kiến: 40.000đ - 70.000đ/dĩa', lat: 12.2420, lng: 109.1910, advice: 'Mực cơm tươi rói cắn ngập miệng chấm mắm nêm hoặc xíu mại hành hoa thơm nức.' },
      { name: 'Hải sản tươi sống Bờ Kè Tháp Bà', dish: 'Tôm hùm nướng phô mai, tu hài nướng mỡ hành, ghẹ hấp', address: 'Đường Bờ Kè Tháp Bà, Vĩnh Thọ, Nha Trang', costText: 'Dự kiến: 250.000đ - 450.000đ/người', lat: 12.2680, lng: 109.2000, advice: 'Lựa chọn hải sản sống bơi trong bể kính cân ký chế biến tại chỗ giá niêm yết rõ ràng.' }
    ],
    eveningActivities: [
      { name: 'Dạo Chợ Đêm Nha Trang & Quảng trường 2 Tháng 4 Tháp Trầm Hương', address: 'Đường Trần Phú, Lộc Thọ, Nha Trang', advice: 'Hòa vào dòng người nhộn nhịp, chụp ảnh bên Tháp Trầm Hương biểu tượng hoa sen nở.' },
      { name: 'Chill tại Skylight Rooftop Bar ngắm 360 độ toàn cảnh vịnh đêm', address: 'Tầng 45 Khách sạn Havana, 38 Trần Phú, Nha Trang', advice: 'Ngắm thành phố biển lấp lánh từ ngọn hải đăng trên cao với cầu kính ngắm cảnh và âm nhạc DJ sôi động.' },
      { name: 'Du thuyền ăn tối ngắm hoàng hôn vịnh Nha Trang lãng mạn', address: 'Cảng Nha Trang, Vĩnh Nguyên', advice: 'Thưởng thức tiệc tối buffet tôm hùm, rượu vang và lắng nghe tiếng violin du dương trên mặt biển.' },
      { name: 'Mua yến sào Khánh Hòa, nem chua Ninh Hòa & Mực rim me làm quà', address: 'Chợ Đầm Nha Trang / Showroom Yến Sào Khánh Hòa', advice: 'Yến sào đảo thiên nhiên Khánh Hòa nức tiếng thế giới là món quà sức khỏe vô giá cho gia đình.' }
    ],
    hotel: { name: 'Khách sạn / Resort mặt biển Trần Phú Nha Trang', address: 'Đường Trần Phú / Phạm Văn Đồng, TP. Nha Trang', price: '550.000đ - 1.800.000đ/đêm' }
  },

  'Kon Tum': {
    region: 'Tây Nguyên',
    coords: { lat: 14.3540, lng: 108.0076 },
    attractions: [
      { name: 'Khu du lịch sinh thái Măng Đen - Đà Lạt thứ hai', address: 'Thị trấn Măng Đen, Huyện Kon Plông, Kon Tum', duration: '4 giờ', cost: 0, costText: 'Tham quan tự do', lat: 14.6000, lng: 108.2900, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Khí hậu quanh năm mát mẻ 16-20 độ C giữa rừng thông nguyên sinh bạt ngàn mây phủ.' },
      { name: 'Thác Pa Sỹ Măng Đen dải lụa trắng đại ngàn', address: 'Khu du lịch sinh thái thác Pa Sỹ, Măng Đen', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 14.6150, lng: 108.2850, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Dòng thác đổ từ độ cao 45m giữa thung lũng rừng sâu; tham quan khu vườn tượng gỗ Tây Nguyên.' },
      { name: 'Hồ Đăk Ke Măng Đen chèo thuyền kayak', address: 'Khu du lịch hồ Đăk Ke, Măng Đen, Kon Plông', duration: '2 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ thuê thuyền đạp vịt/kayak', lat: 14.6050, lng: 108.2950, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Mặt hồ phẳng lặng rợp bóng hoa anh đào nở rộ vào dịp đầu xuân đón chào năm mới.' },
      { name: 'Nhà thờ Gỗ Kon Tum hơn 100 năm tuổi', address: 'Đường Nguyễn Huệ, Thống Nhất, TP. Kon Tum', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 14.3480, lng: 108.0120, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic kết hợp nhà sàn người Ba Na hoàn toàn bằng gỗ cà chít không dùng đinh sắt.' },
      { name: 'Cầu treo Kon Klor bên dòng sông Đăk Bla', address: 'Làng Kon Klor, Thắng Lợi, TP. Kon Tum', duration: '1 giờ', cost: 0, costText: 'Tản bộ tự do', lat: 14.3520, lng: 108.0280, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Cây cầu treo dây văng lớn nhất Tây Nguyên bắc qua dòng sông Đăk Bla chảy ngược huyền thoại.' },
      { name: 'Nhà Rông Kon Klor lớn nhất Tây Nguyên', address: 'Làng Kon Klor, Thắng Lợi, TP. Kon Tum', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 14.3530, lng: 108.0260, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Nhà rông truyền thống cao 22m mái vút trời tượng trưng cho sức mạnh cộng đồng làng buôn Ba Na.' },
      { name: 'Tòa Giám mục Kon Tum kiến trúc gỗ độc đáo', address: '146 Trần Hưng Đạo, Thắng Lợi, TP. Kon Tum', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 14.3490, lng: 108.0050, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Hàng cây sứ cổ thụ rợp bóng hai bên lối vào; bảo tàng trưng bày cổ vật các dân tộc bản địa.' },
      { name: 'Di tích Lịch sử Ngục Kon Tum', address: 'Đường Trương Quang Trọng, Quyết Thắng, TP. Kon Tum', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 14.3400, lng: 107.9950, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Nơi giam giữ và chứng kiến tinh thần bất khuất kiên cường của các chiến sĩ cộng sản kiên trung.' }
    ],
    foods: [
      { name: 'Gỏi lá Kon Tum 40 loại lá rừng', dish: 'Gỏi cuốn lá rừng thịt ba chỉ tôm sông chấm nước sốt mẻ hèm', address: 'Đường Trần Cao Vân / Phan Chu Trinh, Kon Tum', costText: 'Dự kiến: 100.000đ - 150.000đ/mâm', lat: 14.3510, lng: 108.0090, advice: 'Cuốn hơn 40 loại lá rừng Tây Nguyên thơm nồng chấm nước sốt hèm rượu đậm đà đại bổ.' },
      { name: 'Cơm lam gà nướng Măng Đen hạt dổi', dish: 'Gà bản thả đồi nướng than hoa cơm nếp nương ống tre', address: 'Quán Cô Sinh, Thị trấn Măng Đen, Kon Tum', costText: 'Dự kiến: 220.000đ - 280.000đ/con', lat: 14.6020, lng: 108.2920, advice: 'Gà da vàng giòn thịt ngọt lịm chấm muối ớt hạt dổi rừng cay thơm ăn kèm cơm lam dẻo quánh.' },
      { name: 'Lẩu cá tầm Măng Đen măng chua rừng', dish: 'Cá tầm nuôi suối lạnh thịt dai ngọt béo ngậy nấu măng chua', address: 'Nhà hàng Măng Đen Lữ Quán', costText: 'Dự kiến: 350.000đ - 500.000đ/nồi', lat: 14.6040, lng: 108.2940, advice: 'Thịt cá tầm sụn giòn ngọt nhúng măng rừng chua thanh xua tan sương lạnh cao nguyên.' },
      { name: 'Bún đỏ Kon Tum cua đồng', dish: 'Bún sợi to chan riêu cua đồng tóp mỡ hành phi thơm giòn', address: 'Chợ trung tâm TP. Kon Tum', costText: 'Dự kiến: 30.000đ - 45.000đ/tô', lat: 14.3500, lng: 108.0080, advice: 'Món ăn sáng ấm bụng với nước lèo đỏ màu hạt điều và gạch cua đồng béo bùi ngọt lịm.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đêm Măng Đen se lạnh & Uống cà phê Arabica', address: 'Trung tâm Thị trấn Măng Đen', advice: 'Hít hà khí trời 15 độ C thơm mùi thông reo, nhâm nhi tách Arabica nóng ấm đậm đà.' },
      { name: 'Tiệc nướng BBQ & Đốt lửa trại cồng chiêng tại homestay', address: 'Khu sân vườn Homestay Măng Đen', advice: 'Quây quần bên ánh lửa bập bùng, nghe tiếng đàn T’rưng và tiếng cồng chiêng vang vọng núi rừng.' },
      { name: 'Tản bộ cầu treo Kon Klor ngắm dòng sông Đăk Bla đêm', address: 'Cầu treo Kon Klor, TP. Kon Tum', advice: 'Lắng nghe tiếng nước chảy rì rào và ngắm những nếp nhà rông lung linh trong ánh đèn đêm.' },
      { name: 'Mua sâm Ngọc Linh, chuối hột rừng & Rượu ghè Kon Tum làm quà', address: 'Chợ Kon Tum / Tiệm đặc sản Măng Đen', advice: 'Sâm Ngọc Linh quốc bảo Việt Nam và rượu cần men lá truyền thống là món quà quý giá bậc nhất.' }
    ],
    hotel: { name: 'Resort / Homestay Măng Đen view rừng thông', address: 'Thị trấn Măng Đen, Huyện Kon Plông, Kon Tum', price: '450.000đ - 1.200.000đ/đêm' }
  },

  'Đắk Lắk': {
    region: 'Tây Nguyên',
    coords: { lat: 12.6667, lng: 108.0500 },
    attractions: [
      { name: 'Bảo tàng Thế giới Cà phê kiến trúc nhà rông cách điệu', address: 'Đường Nguyễn Đình Chiểu, Tân Lợi, TP. Buôn Ma Thuột', duration: '2 giờ 30 phút', cost: 150000, costText: 'Dự kiến: 150.000đ/vé', lat: 12.6980, lng: 108.0620, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Không gian kiến trúc đương đại kết hợp nhà rông Tây Nguyên; trưng bày hàng vạn hiện vật cà phê toàn cầu.' },
      { name: 'Cụm thác Dray Nur & Dray Sáp hùng vĩ', address: 'Xã Dray Sáp, Huyện Krông Ana, Đắk Lắk', duration: '3 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 12.5350, lng: 107.8950, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thác nước tự nhiên kỳ vĩ bậc nhất Tây Nguyên đổ bọt trắng xóa; đi cầu treo gỗ xuyên rừng.' },
      { name: 'Hồ Lắk & Biệt điện Bảo Đại ngắm toàn cảnh hồ', address: 'Thị trấn Liên Sơn, Huyện Lắk, Đắk Lắk', duration: '3 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ chèo thuyền độc mộc', lat: 12.4150, lng: 108.1850, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Hồ nước ngọt tự nhiên lớn thứ hai Việt Nam; ngồi thuyền độc mộc lướt trên mặt hồ yên ả ngắm hoa sen.' },
      { name: 'Buôn Đôn (Bản Đôn) quê hương săn bắt thuần dưỡng voi', address: 'Xã Krông Na, Huyện Buôn Đôn, Đắk Lắk', duration: '3 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ/vé tham quan', lat: 12.9000, lng: 107.7850, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Tham quan nhà sàn cổ 130 năm của vua voi Khun Yu Nốp và đi cầu treo Buôn Đôn bắc qua rặng si già.' },
      { name: 'Buôn Ako Dhông buôn làng Ê Đê giữa lòng phố thị', address: 'Đường Trần Nhật Duật, Tân Lợi, TP. Buôn Ma Thuột', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 12.7020, lng: 108.0450, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Buôn làng giàu đẹp nhất Tây Nguyên với những ngôi nhà dài Ê Đê truyền thống dưới bóng cây xanh mát.' },
      { name: 'Làng cà phê Trung Nguyên không gian văn hóa', address: '163 Lý Thường Kiệt, Thắng Lợi, Buôn Ma Thuột', duration: '2 giờ', cost: 0, costText: 'Vào cổng tự do (Đồ uống: 50.000đ)', lat: 12.6900, lng: 108.0550, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Khuôn viên nhà cổ, thác nước nhân tạo và thưởng thức các dòng cà phê phối trộn thượng hạng.' },
      { name: 'Đá Voi Mẹ Yang Tao tảng đá nguyên khối lớn nhất', address: 'Xã Yang Tao, Huyện Lắk, Đắk Lắk', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 12.4550, lng: 108.2250, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Tảng đá granite khổng lồ hình chú voi nằm giữa thung lũng lúa; leo lên lưng đá ngắm dãy Chư Yang Sin.' },
      { name: 'Chùa Sắc Tứ Khải Đoan ngôi chùa gỗ cổ cuối cùng', address: '117 Phan Bội Châu, Thống Nhất, TP. Buôn Ma Thuột', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', lat: 12.6850, lng: 108.0400, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa có sắc phong cuối cùng của triều Nguyễn, kết hợp hài hòa kiến trúc cung đình Huế và nhà dài Ê Đê.' }
    ],
    foods: [
      { name: 'Bún đỏ Buôn Ma Thuột gạch cua trứng cút', dish: 'Bún sợi to màu đỏ gạch cua đồng rau cần nước hành phi', address: 'Đường Phan Đình Giót / Lê Hồng Phong, Buôn Ma Thuột', costText: 'Dự kiến: 30.000đ - 45.000đ/tô', lat: 12.6820, lng: 108.0480, advice: 'Món ăn đặc sản độc nhất của Buôn Ma Thuột nước lèo ngọt đậm đà ăn kèm rau cần trụng và giá đỗ.' },
      { name: 'Bò nhúng me Cà Te Quán bánh mì nóng giòn', dish: 'Bò tơ thái mỏng sốt me chua ngọt phô mai chấm bánh mì', address: '140 Lê Thánh Tông, Tân Lợi, TP. Buôn Ma Thuột', costText: 'Dự kiến: 130.000đ - 180.000đ/phần', lat: 12.6880, lng: 108.0520, advice: 'Thịt bò tơ mềm tan quyện sốt me chua cay sánh mịn xèo xèo trên chảo gang chấm đẫm bánh mì giòn tan.' },
      { name: 'Gà nướng Bản Đôn & Cơm lam nếp nương', dish: 'Gà thả rông nướng than hoa ướp sả ớt rừng chấm muối é', address: 'Khu du lịch sinh thái Buôn Đôn', costText: 'Dự kiến: 220.000đ - 300.000đ/con', lat: 12.8980, lng: 107.7880, advice: 'Thịt gà săn chắc thơm nức mũi củi than chấm cùng chén muối ớt rừng giã nhuyễn thơm ngát.' },
      { name: 'Cá lăng sông Sêrêpôk nướng than hoa', dish: 'Cá lăng tươi nướng than kẹp lá chuối chấm muối kiến vàng', address: 'Nhà hàng ven sông Sêrêpôk, Buôn Ma Thuột', costText: 'Dự kiến: 180.000đ - 250.000đ/đĩa', lat: 12.6920, lng: 108.0440, advice: 'Cá lăng dòng sông chảy ngược thịt dai thơm béo ngậy ăn kèm rau rừng Tây Nguyên tươi mát.' }
    ],
    eveningActivities: [
      { name: 'Thưởng thức Robusta Buôn Ma Thuột chính gốc ngắm phố đêm', address: 'Đường Phan Chu Trinh / Nguyễn Du, Buôn Ma Thuột', advice: 'Ngồi quán cà phê không gian mở lắng nghe những tình khúc Tây Nguyên nồng nàn say đắm.' },
      { name: 'Dạo chợ đêm Buôn Ma Thuột & Phố đi bộ Phan Đình Giót', address: 'Đường Phan Đình Giót, TP. Buôn Ma Thuột', advice: 'Thưởng thức bún đỏ nóng hổi, thịt xiên nướng than, nem nướng lụi và ngắm nhịp sống phố núi.' },
      { name: 'Giao lưu không gian văn hóa cồng chiêng tại buôn làng Ako Dhông', address: 'Buôn Ako Dhông, Tân Lợi, Buôn Ma Thuột', advice: 'Thưởng thức rượu cần men lá, nhảy điệu xoang bên bếp lửa rực hồng cùng đồng bào Ê Đê.' },
      { name: 'Mua cà phê chồn, hạt macca Đắk Lắk & Tiêu Buôn Hồ làm quà', address: 'Chợ trung tâm Buôn Ma Thuột / Các cửa hàng OCOP', advice: 'Hạt macca sấy nứt vỏ béo bùi và cà phê nguyên chất đóng gói cao cấp làm quà tặng người thân.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Buôn Ma Thuột', address: 'Đường Hùng Vương / Ngô Quyền, Buôn Ma Thuột, Đắk Lắk', price: '450.000đ - 1.100.000đ/đêm' }
  },

  'TP. Hồ Chí Minh': {
    region: 'Miền Nam',
    coords: { lat: 10.8231, lng: 106.6297 },
    attractions: [
      { name: 'Dinh Độc Lập (Hội trường Thống Nhất) lịch sử', address: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 10.7770, lng: 106.6953, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Di tích quốc gia đặc biệt chứng kiến thời khắc lịch sử ngày 30/4/1975; khám phá hầm chỉ huy kiên cố.' },
      { name: 'Nhà thờ Đức Bà & Bưu điện Trung tâm Thành phố', address: 'Số 1 Công xã Paris, Bến Nghé, Quận 1', duration: '1 giờ 30 phút', cost: 0, costText: 'Tham quan tự do', lat: 10.7798, lng: 106.6990, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic Pháp cổ điển rực rỡ gạch đỏ Marseille và trần vòm sắt uốn do Gustave Eiffel thiết kế.' },
      { name: 'Chợ Bến Thành biểu tượng trăm năm Sài Gòn', address: 'Đường Lê Lợi, Phường Bến Thành, Quận 1', duration: '2 giờ', cost: 0, costText: 'Tự do mua sắm', lat: 10.7725, lng: 106.6980, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chợ sầm uất với 4 cửa tháp đồng hồ; thiên đường đồ lưu niệm, vải vóc và ẩm thực đa vùng miền.' },
      { name: 'Tòa tháp Landmark 81 nóc nhà Việt Nam & Đài SkyView', address: '720A Điện Biên Phủ, Phường 22, Bình Thạnh', duration: '2 giờ 30 phút', cost: 300000, costText: 'Dự kiến: 300.000đ vé lên đài quan sát SkyView', lat: 10.7950, lng: 106.7218, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Tòa nhà cao nhất Việt Nam 461m lấy cảm hứng từ bó tre truyền thống; ngắm toàn cảnh Sài Gòn từ mây xanh.' },
      { name: 'Bến Nhà Rồng - Bảo tàng Hồ Chí Minh bên sông', address: 'Số 1 Nguyễn Tất Thành, Phường 12, Quận 4', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 10.7682, lng: 106.7068, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước năm 1911 trên con tàu Amiral Latouche-Tréville.' },
      { name: 'Bảo tàng Chứng tích Chiến tranh', address: '28 Võ Văn Tần, Phường 6, Quận 3', duration: '2 giờ', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 10.7790, lng: 106.6920, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bảo tàng thu hút khách quốc tế hàng đầu Việt Nam với những hình ảnh, hiện vật sống động về chiến tranh.' },
      { name: 'Phố đi bộ Nguyễn Huệ & Trụ sở UBND Thành phố', address: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1', duration: '1 giờ 30 phút', cost: 0, costText: 'Dạo bộ tự do', lat: 10.7740, lng: 106.7035, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Đại lộ đi bộ hiện đại ngắm các tòa cao ốc chọc trời, đài phun nước nhạc nước và tòa nhà UBND phong cách Phục hưng.' },
      { name: 'Địa đạo Củ Chi kỳ quan đánh giặc trong lòng đất', address: 'Ấp Phú Hiệp, Xã Phú Mỹ Hưng, Huyện Củ Chi', duration: '4 giờ', cost: 35000, costText: 'Dự kiến: 35.000đ/vé', lat: 11.1430, lng: 106.4630, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Mê cung hầm ngầm dài hơn 250km kiên cố dưới lòng đất; trải nghiệm chui hầm và ăn khoai mì chấm muối mè.' }
    ],
    foods: [
      { name: 'Cơm tấm Ba Ghiền sườn bì chả khổng lồ', dish: 'Cơm tấm hạt tấm thơm sườn nướng mỡ hành trứng ốp la', address: '84 Đặng Văn Ngữ, Phường 10, Phú Nhuận', costText: 'Dự kiến: 75.000đ - 110.000đ/dĩa', lat: 10.7920, lng: 106.6700, advice: 'Miếng sườn nướng than hoa to choán ngợp đĩa ướp mật ong đậm đà ăn kèm nước mắm kẹo ớt tỏi.' },
      { name: 'Hủ tiếu Nam Vang Nhân Quán tôm thịt xá xíu', dish: 'Hủ tiếu khô trộn nước sốt tôm tươi thịt bằm gan cật trứng cút', address: '122 Nguyễn Trãi, Bến Thành, Quận 1', costText: 'Dự kiến: 80.000đ - 100.000đ/tô', lat: 10.7650, lng: 106.6850, advice: 'Sợi hủ tiếu dai mềm trộn sốt đen gia truyền kèm chén nước súp ninh tôm mực ngọt lịm.' },
      { name: 'Bánh mì Huỳnh Hoa ngập tràn pate giăm bông', dish: 'Bánh mì giòn rụm ngập 5 tầng pate bơ chả lụa thịt nguội', address: '26 Lê Thị Riêng, Bến Thành, Quận 1', costText: 'Dự kiến: 65.000đ/ổ', lat: 10.7710, lng: 106.6930, advice: 'Ổ bánh mì nặng gần nửa ký đầy ắp nhân béo ngậy được mệnh danh là bánh mì đắt khách nhất Sài Gòn.' },
      { name: 'Lẩu dê Trương Định nước dùng thuốc bắc thanh ngọt', dish: 'Thịt dê tơ mềm nhừ nhúng ngải cứu củ sen chấm chao sa tế', address: '105 Trương Định, Phường 6, Quận 3', costText: 'Dự kiến: 200.000đ - 300.000đ/người', lat: 10.7780, lng: 106.6900, advice: 'Nước lẩu ninh xương tủy thơm lừng táo đỏ kỷ tử nhúng rau má mồng tơi thanh nhiệt cơ thể.' }
    ],
    eveningActivities: [
      { name: 'Tản bộ Phố đi bộ Nguyễn Huệ & Check-in Landmark 81 rực rỡ', address: 'Đường Nguyễn Huệ, Quận 1', advice: 'Hòa vào nhịp sống trẻ trung, thưởng thức trà sữa ngắm đài phun nước biểu diễn nghệ thuật.' },
      { name: 'Khám phá Phố Tây Bùi Viện không ngủ sôi động', address: 'Đường Bùi Viện, Phạm Ngũ Lão, Quận 1', advice: 'Trải nghiệm không khí tiệc tùng âm nhạc DJ đường phố, biểu diễn xiếc lửa và ẩm thực nướng xuyên đêm.' },
      { name: 'Đi buýt sông Saigon Waterbus ngắm thành phố hoa lệ', address: 'Bến Bạch Đằng, Tôn Đức Thắng, Quận 1', advice: 'Lướt sóng trên sông Sài Gòn lộng gió ngắm các tòa cao ốc Bitexco, Landmark 81 rực sáng ánh đèn.' },
      { name: 'Khám phá Chung cư cafe 42 Nguyễn Huệ & Mua cơm cháy làm quà', address: '42 Nguyễn Huệ, Bến Nghé, Quận 1', advice: 'Khu chung cư cổ với hàng chục quán cafe boutique độc lạ; mua cơm cháy chà bông cay giòn mang về.' }
    ],
    hotel: { name: 'Khách sạn trung tâm Quận 1 Sài Gòn', address: 'Quận 1 / Quận 3, TP. Hồ Chí Minh', price: '600.000đ - 2.000.000đ/đêm' }
  },

  'Vũng Tàu': {
    region: 'Đông Nam Bộ',
    coords: { lat: 10.3460, lng: 107.0843 },
    attractions: [
      { name: 'Tượng Chúa Kitô Vua trên đỉnh Núi Nhỏ', address: 'Số 2 Hạ Long, Phường 2, TP. Vũng Tàu', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 10.3260, lng: 107.0845, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Tượng Chúa dang tay cao 32m; leo gần 1.000 bậc đá và leo lên hai cánh tay ngắm toàn cảnh biển bao la.' },
      { name: 'Ngọn Hải Đăng Vũng Tàu cổ nhất Việt Nam', address: 'Đỉnh Núi Nhỏ, Phường 2, TP. Vũng Tàu', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 10.3340, lng: 107.0750, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Tháp hải đăng hình trụ trắng xây từ năm 1862; cung đường hoa phượng vĩ và hoa giấy ven núi tuyệt đẹp.' },
      { name: 'Bãi Sau (Thùy Vân) bãi tắm biển sôi động dài 8km', address: 'Đường Thùy Vân, Phường Thắng Tam, Vũng Tàu', duration: '3 giờ', cost: 0, costText: 'Miễn phí tắm biển', lat: 10.3380, lng: 107.0950, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát vàng mịn thoai thoải sóng biển dạt dào; địa điểm tắm biển và thể thao nước chính của thành phố.' },
      { name: 'Mũi Nghinh Phong đón gió bốn phương & Cổng Trời', address: 'Số 1 Hạ Long, Phường 2, TP. Vũng Tàu', duration: '1 giờ 30 phút', cost: 0, costText: 'Tham quan tự do', lat: 10.3220, lng: 107.0820, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Mũi đất vươn dài ra biển hứng gió ngàn; chiếc cổng trời màu vàng mở ra khung cảnh biển trời bao la.' },
      { name: 'Bãi Trước (Quang Trung) công viên dừa rợp mát', address: 'Đường Quang Trung, Phường 1, Vũng Tàu', duration: '1 giờ 30 phút', cost: 0, costText: 'Tản bộ tự do', lat: 10.3440, lng: 107.0720, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Hàng dừa xanh ngát soi bóng biển êm đềm; địa điểm ngắm hoàng hôn đỏ rực buông xuống biển đẹp nhất.' },
      { name: 'Bạch Dinh (Villa Blanche) dinh thự thời Pháp', address: '04 Trần Phú, Phường 1, TP. Vũng Tàu', duration: '1 giờ 30 phút', cost: 15000, costText: 'Dự kiến: 15.000đ/vé', lat: 10.3480, lng: 107.0680, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Biệt thự nghỉ dưỡng phong cách Châu Âu thế kỷ XIX nhìn ra biển, nơi từng giam lỏng vua Thành Thái.' },
      { name: 'Đồi Cừu Suối Nghệ thảo nguyên cừu trắng xinh xắn', address: 'Xã Suối Nghệ, Huyện Châu Đức, Bà Rịa - Vũng Tàu', duration: '2 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ phí chụp ảnh cùng cừu', lat: 10.5500, lng: 107.1950, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Hàng trăm chú cừu bông trắng muốt chạy nhảy trên thảm cỏ xanh; chụp ảnh phong cách du mục độc đáo.' },
      { name: 'Khu du lịch Hồ Mây Park cáp treo Núi Lớn', address: '1A Trần Phú, Phường 1, TP. Vũng Tàu', duration: '4 giờ', cost: 400000, costText: 'Dự kiến: 400.000đ/vé cáp treo + trọn gói vui chơi', lat: 10.3600, lng: 107.0650, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Tổ hợp công viên trên đỉnh núi cao với hồ nước trên mây, xe trượt dốc Alpine Coaster và vườn thú.' }
    ],
    foods: [
      { name: 'Bánh khọt Gốc Vú Sữa giòn rụm tôm tươi', dish: 'Bánh khọt đổ khuôn vàng rụm tôm tươi rắc tôm cháy ngập mỡ hành', address: '14 Nguyễn Trường Tộ, Phường 2, Vũng Tàu', costText: 'Dự kiến: 60.000đ - 80.000đ/dĩa', lat: 10.3460, lng: 107.0780, advice: 'Vỏ bánh chiên giòn tan cuốn ngập lá cải xanh xà lách chấm nước mắm pha đu đủ ngâm giòn sần sật.' },
      { name: 'Lẩu cá đuối Hoàng Minh măng chua cay nồng', dish: 'Cá đuối tươi giòn sụn thịt ngọt nấu măng chua bắp chuối', address: '44 Trương Công Định, Phường 3, Vũng Tàu', costText: 'Dự kiến: 200.000đ - 300.000đ/nồi', lat: 10.3490, lng: 107.0820, advice: 'Thịt cá đuối không xương dăm thơm ngọt nấu cùng nước lèo me chua ngọt cay nồng ấm bụng.' },
      { name: 'Bánh bông lan trứng muối Cột Điện nóng hổi', dish: 'Bánh bông lan nướng lò than nhân trứng muối phô mai chà bông', address: '17B Nguyễn Trường Tộ, Phường 2, Vũng Tàu', costText: 'Dự kiến: 30.000đ - 45.000đ/hộp', lat: 10.3450, lng: 107.0770, advice: 'Bánh nướng than củi mềm xốp vàng ươm ngậy vị mặn bùi của trứng muối và sốt bơ béo ngậy.' },
      { name: 'Hải sản Gành Hào ven vách đá bờ biển', dish: 'Tôm tích rang muối, mực sữa chiên nước mắm, hàu nướng phô mai', address: '03 Trần Phú, Phường 5, TP. Vũng Tàu', costText: 'Dự kiến: 300.000đ - 500.000đ/người', lat: 10.3410, lng: 107.0640, advice: 'Nhà hàng sát mép biển nghe sóng vỗ rì rào thưởng thức hải sản cao cấp tươi ngon bậc nhất.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đêm Bãi Trước hóng gió & Ăn kem Thổ Nhĩ Kỳ Alibaba', address: 'Đường Quang Trung / Ba Cu, Vũng Tàu', advice: 'Tản bộ bên bờ biển lộng gió, xem màn ảo thuật vui nhộn của nghệ nhân bán kem dẻo.' },
      { name: 'Thưởng thức ốc biển, ghẹ hấp tại chợ đêm hải sản Vũng Tàu', address: 'Sau lưng khách sạn Imperial, Thắng Tam', advice: 'Thiên đường hải sản đêm với hàng chục quầy ốc hương, sò điệp nướng mỡ hành thơm nức.' },
      { name: 'Check-in cafe ngắm hoàng hôn & Biển đêm Bãi Dâu lãng mạn', address: 'Đường Trần Phú ven biển Bãi Dâu', advice: 'Không gian ngắm tàu bè chở dầu rực sáng đèn ngoài khơi xa bên tiếng sóng vỗ thì thầm.' },
      { name: 'Mua bánh bông lan trứng muối, cá đù một nắng làm quà', address: 'Phố bánh bông lan Nguyễn Trường Tộ', advice: 'Bánh mới ra lò thơm nức mũi đóng hộp tiện lợi mang về làm quà ấm áp cho bạn bè.' }
    ],
    hotel: { name: 'Khách sạn / Resort mặt biển Thùy Vân Bãi Sau', address: 'Đường Thùy Vân / Hạ Long, TP. Vũng Tàu', price: '500.000đ - 1.500.000đ/đêm' }
  },

  'Tây Ninh': {
    region: 'Đông Nam Bộ',
    coords: { lat: 11.3100, lng: 106.0983 },
    attractions: [
      { name: 'Quần thể Núi Bà Đen Nóc nhà Đông Nam Bộ 986m', address: 'Xã Thạnh Tân, TP. Tây Ninh, Tỉnh Tây Ninh', duration: '4 giờ', cost: 10000, costText: 'Dự kiến: 10.000đ/vé vào cổng khu du lịch', lat: 11.3780, lng: 106.1680, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Ngọn núi thiêng cao nhất Nam Bộ quanh năm mây vờn đỉnh; chiêm bái Chùa Bà linh ứng hơn 300 năm.' },
      { name: 'Tuyến cáp treo Sun World & Tượng Phật Bà Tây Bổ Đà Sơn', address: 'Đỉnh Núi Bà Đen, Thạnh Tân, TP. Tây Ninh', duration: '3 giờ', cost: 350000, costText: 'Dự kiến: 350.000đ/vé cáp treo lên đỉnh núi', lat: 11.3750, lng: 106.1650, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Tượng Phật Bà bằng đồng cao nhất Châu Á ngự trên đỉnh núi; biển hoa rực rỡ và nhà ga cáp treo đạt kỷ lục Guinness.' },
      { name: 'Tòa Thánh Tây Ninh thánh địa đạo Cao Đài tráng lệ', address: 'Phạm Hộ Pháp, Thị xã Hòa Thành, Tây Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 11.3000, lng: 106.1350, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Công trình tôn giáo độc nhất vô nhị với biểu tượng Thiên Nhãn và kiến trúc rồng phượng nguy nga; lễ cúng chính ngọ 12:00.' },
      { name: 'Hồ Dầu Tiếng hồ nhân tạo lớn nhất Đông Nam Á', address: 'Huyện Dương Minh Châu, Tây Ninh', duration: '2 giờ 30 phút', cost: 0, costText: 'Tham quan tự do', lat: 11.3500, lng: 106.3500, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Mặt hồ mênh mông phẳng lặng tựa biển hồ; điểm cắm trại hạ trại ngắm bình minh và hoàng hôn tuyệt đẹp.' },
      { name: 'Thung lũng Ma Thiên Lãnh hoang sơ kỳ bí', address: 'Xã Thạnh Tân, TP. Tây Ninh', duration: '2 giờ 30 phút', cost: 0, costText: 'Khám phá tự do', lat: 11.3850, lng: 106.1550, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Tam giác vàng tạo bởi ba ngọn núi Bà Đen - núi Phụng - núi Heo với suối vàng róc rách và rừng cây rậm rạp.' },
      { name: 'Vườn Quốc gia Lò Gò - Xa Mát rừng khộp biên giới', address: 'Huyện Tân Biên, Tỉnh Tây Ninh', duration: '3 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', lat: 11.5900, lng: 105.8700, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Khu rừng ngập nước bán ngập độc đáo nơi cư trú của loài sếu đầu đỏ quý hiếm và chim di cư.' },
      { name: 'Tháp Cổ Chót Mạt kiến trúc văn hóa Óc Eo', address: 'Ấp Xóm Mới, Xã Tân Phong, Tân Biên, Tây Ninh', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 11.5450, lng: 105.9550, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Di tích tháp cổ bằng đá phiến và gạch nung từ thế kỷ thứ VIII của vương quốc Phù Nam cổ xưa.' },
      { name: 'Căn cứ Trung ương Cục Miền Nam lịch sử', address: 'Rừng Rùm Đuôn, Xã Tân Lập, Tân Biên, Tây Ninh', duration: '2 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 11.6600, lng: 106.0300, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thủ đô kháng chiến của cách mạng miền Nam với hệ thống nhà lá trung quân và hầm hào nguyên vẹn.' }
    ],
    foods: [
      { name: 'Bò tơ Tây Ninh Năm Sánh nướng than hoa', dish: 'Bò tơ tảng nướng than hoa mềm ngọt cuộn rau rừng chấm mắm nêm', address: 'Quốc lộ 22B, Hiệp Tân, Hòa Thành, Tây Ninh', costText: 'Dự kiến: 150.000đ - 220.000đ/phần', lat: 11.3120, lng: 106.1050, advice: 'Thịt bò tơ non mềm ngọt da giòn bùi nướng chín tới cuộn bánh tráng và các loại rau rừng thơm lừng.' },
      { name: 'Bánh canh Trảng Bàng Hoàng Minh chính gốc', dish: 'Bánh canh gạo nàng thơm giò heo bắp luộc nước lèo trong veo', address: '38 Quốc lộ 22, Thị xã Trảng Bàng, Tây Ninh', costText: 'Dự kiến: 45.000đ - 65.000đ/tô', lat: 11.0350, lng: 106.3650, advice: 'Sợi bánh canh trắng mềm dẻo dai ăn cùng thịt chân giò luộc thái mỏng chấm mắm tiêu ớt cay xè.' },
      { name: 'Bánh tráng phơi sương Trảng Bàng cuốn thịt luộc', dish: 'Bánh tráng dẻo phơi sương đêm cuốn thịt ba chỉ 20 loại rau rừng', address: 'Thị xã Trảng Bàng, Tây Ninh', costText: 'Dự kiến: 80.000đ - 120.000đ/suất', lat: 11.0380, lng: 106.3680, advice: 'Vỏ bánh tráng dẻo mặn tự nhiên hấp thụ sương đêm cuốn lá cóc, lá nhái, sao nhái chấm mắm nêm đậm đà.' },
      { name: 'Nem bưởi Tây Ninh chay chua ngọt giòn sần sật', dish: 'Nem vỏ bưởi lên men tự nhiên đu đủ sợi tiêu hạt', address: 'Chợ Long Hoa, Hòa Thành, Tây Ninh', costText: 'Dự kiến: 30.000đ - 50.000đ/chục', lat: 11.3020, lng: 106.1320, advice: 'Món ăn chay thanh khiết làm từ vỏ bưởi giòn sần sật có vị chua thanh ngọt bùi điểm xuyết hạt tiêu cay.' }
    ],
    eveningActivities: [
      { name: 'Chiêm ngưỡng hệ thống đèn LED đỉnh Núi Bà Đen rực rỡ', address: 'Quần thể Sun World Núi Bà Đen', advice: 'Hàng ngàn ngọn đèn led thắp sáng tượng Phật Bà và mái vòm nhà ga tựa như dải ngân hà giữa trời đêm.' },
      { name: 'Dạo quanh Tòa Thánh Tây Ninh thanh tịnh về đêm', address: 'Khuôn viên Tòa Thánh, Hòa Thành', advice: 'Chiêm ngưỡng các tòa tháp uy nghiêm rực sáng trong không gian thanh tịnh và gió mát rượi.' },
      { name: 'Thưởng thức ốc núi Tây Ninh nướng & Chè bưởi nước cốt dừa', address: 'Khu phố ẩm thực TP. Tây Ninh', advice: 'Ốc núi chỉ xuất hiện mùa mưa thịt dai giòn ngọt thảo dược chấm muối tiêu chanh cay nồng.' },
      { name: 'Mua muối tôm Tây Ninh chính gốc & Bánh tráng me làm quà', address: 'Chợ Long Hoa, Hòa Thành, Tây Ninh', advice: 'Muối ớt tôm hạt to cay nồng thơm lừng nổi tiếng khắp cả nước là món quà bắt buộc phải mua.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Tây Ninh / Chân Núi Bà', address: 'Đường 30 Tháng 4 / Xã Phan, TP. Tây Ninh', price: '400.000đ - 900.000đ/đêm' }
  },

  'Cần Thơ': {
    region: 'Tây Nam Bộ',
    coords: { lat: 10.0452, lng: 105.7469 },
    attractions: [
      { name: 'Chợ nổi Cái Răng văn hóa sông nước buổi sớm', address: 'Sông Cần Thơ, Số 46 Hai Bà Trưng, Cái Răng', duration: '3 giờ', cost: 70000, costText: 'Dự kiến: 70.000đ vé tàu ghép chợ nổi', lat: 10.0050, lng: 105.7450, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Nên đi từ 5:30 sáng ngắm ghe thuyền tấp nập, cây bẹo treo nông sản và ăn tô bún riêu lắc lư trên sông.' },
      { name: 'Bến Ninh Kiều & Cầu Đi Bộ Tình Yêu hoa sen', address: 'Đường Hai Bà Trưng, Tân An, Ninh Kiều, Cần Thơ', duration: '2 giờ', cost: 0, costText: 'Tản bộ tự do', lat: 10.0340, lng: 105.7880, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Biểu tượng đô thị Tây Đô soi bóng dòng sông Hậu; cây cầu đi bộ uốn lượn hình hoa sen lên đèn rực rỡ.' },
      { name: 'Cồn Sơn miệt vườn sông nước xem cá lóc bay', address: 'Cù lao Cồn Sơn, Phường Bùi Hữu Nghĩa, Bình Thủy', duration: '3 giờ 30 phút', cost: 100000, costText: 'Dự kiến: 100.000đ vé đò + vé tham quan bè cá', lat: 10.0750, lng: 105.7550, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Trải nghiệm du lịch cộng đồng mộc mạc: xem đàn cá lóc bay đớp mồi, tự tay làm bánh dân gian Nam Bộ.' },
      { name: 'Nhà cổ Bình Thủy kiến trúc Pháp - Việt hơn 150 năm', address: '144 Bùi Hữu Nghĩa, Bình Thủy, Cần Thơ', duration: '1 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', lat: 10.0720, lng: 105.7380, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi nhà 5 gian kiểu Pháp cổ kính bối cảnh phim "Người tình" (L’Amant); vườn lan quý ngát hương.' },
      { name: 'Lò hủ tiếu truyền thống Chín Của', address: 'Khu vực Yên Hòa, Phường Lê Bình, Cái Răng', duration: '1 giờ 30 phút', cost: 0, costText: 'Tham quan tự do', lat: 10.0080, lng: 105.7420, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Tự tay tráng bánh, phơi và cắt sợi hủ tiếu ngũ sắc nhuộm từ gấc, lá cẩm; ăn thử món pizza hủ tiếu độc lạ.' },
      { name: 'Thiền viện Trúc Lâm Phương Nam lớn nhất miền Tây', address: 'Ấp Mỹ Nhơn, Xã Mỹ Khánh, Phong Điền, Cần Thơ', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng thăm', lat: 9.9850, lng: 105.6950, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể chùa gỗ lim bề thế mang đậm phong cách kiến trúc thời Lý - Trần thanh tịnh uy nghiêm.' },
      { name: 'Làng du lịch sinh thái Mỹ Khánh', address: '335 Lộ Vòng Cung, Xã Mỹ Khánh, Phong Điền', duration: '3 giờ', cost: 90000, costText: 'Dự kiến: 90.000đ/vé vào cổng', lat: 9.9920, lng: 105.7020, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Vườn cây ăn trái trĩu quả sầu riêng, chôm chôm; xem đua heo, xiếc khỉ và chèo xuồng ba lá.' },
      { name: 'Chợ nổi Phong Điền nét buôn bán mộc mạc', address: 'Ngã ba sông Cần Thơ và sông Chợ Thủ, Phong Điền', duration: '2 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ vé thuyền', lat: 9.9750, lng: 105.6700, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Chợ nổi sinh hoạt thuần chất miệt vườn sông nước, giao thương ghe chèo chở đầy ắp trái cây miệt vườn.' }
    ],
    foods: [
      { name: 'Lẩu mắm Cần Thơ Dạ Lý đẫm hải sản rau đồng', dish: 'Lẩu mắm cá linh cá sặc cá lóc tôm mực 24 loại rau đồng', address: '89 Đường 3 Tháng 2, Hưng Lợi, Ninh Kiều', costText: 'Dự kiến: 300.000đ - 450.000đ/nồi', lat: 10.0480, lng: 105.7680, advice: 'Hương vị mắm miền Tây thơm lừng nước dùng đậm đà nhúng bông súng, bông điên điển, so đũa giòn ngọt.' },
      { name: 'Vịt nấu chao Thành Giao mềm béo bùi ngậy', dish: 'Thịt vịt xiêm hầm chao trắng chao đỏ khoai môn nấm rơm', address: 'Hẻm 1 Lý Tự Trọng, An Phú, Ninh Kiều', costText: 'Dự kiến: 180.000đ - 250.000đ/nồi', lat: 10.0380, lng: 105.7720, advice: 'Vịt xiêm thịt mềm thơm hòa cùng vị bùi béo ngậy của khoai môn dẻo và hột vịt lộn ngọt lịm.' },
      { name: 'Bánh cống Cô Út giòn rụm đậu xanh tôm đất', dish: 'Bánh cống chiên giòn đậu xanh thịt băm tôm nguyên con', address: '86/38 Lý Tự Trọng, An Cư, Ninh Kiều', costText: 'Dự kiến: 15.000đ - 25.000đ/cái', lat: 10.0320, lng: 105.7820, advice: 'Vỏ bánh bột gạo giòn tan bọc nhân đậu xanh bùi bùi, cuốn rau cải xà lách chấm nước mắm chua ngọt.' },
      { name: 'Nem nướng Cái Răng Thanh Vân cuốn bánh tráng', dish: 'Nem nướng lụi than thơm nức cuốn bánh hỏi mỡ hành', address: '17 Đại lộ Hòa Bình, Tân An, Ninh Kiều', costText: 'Dự kiến: 60.000đ - 80.000đ/phần', lat: 10.0350, lng: 105.7850, advice: 'Thịt nem nướng vàng bóng thơm lừng ăn kèm tương chấm nếp xay nhuyễn béo bùi tỏi ớt.' }
    ],
    eveningActivities: [
      { name: 'Dạo Bến Ninh Kiều & Tản bộ Cầu Tình Yêu ngắm sông Hậu', address: 'Bến Ninh Kiều, Tân An, Cần Thơ', advice: 'Hóng gió mát lành từ dòng sông Hậu mênh mông, ngắm cầu Cần Thơ dây văng rực rỡ từ xa.' },
      { name: 'Du thuyền Cần Thơ ăn tối nghe Đờn Ca Tài Tử Nam Bộ', address: 'Bến tàu du lịch Ninh Kiều, Cần Thơ', advice: 'Thưởng ngoạn dòng sông lúc lên đèn, lắng nghe những khúc vọng cổ ngọt ngào da diết lòng người.' },
      { name: 'Khám phá chợ đêm Tây Đô & Chợ đêm Ninh Kiều ăn vặt', address: 'Đường Hai Bà Trưng, Tân An, Cần Thơ', advice: 'Khu ẩm thực đêm sầm uất với chuối nếp nướng, chè thốt nốt, bánh xèo giòn rụm và trà sữa.' },
      { name: 'Mua bánh tét lá cẩm Cần Thơ, mắm cá linh & Trái cây làm quà', address: 'Chợ Xuân Khánh / Chợ cổ Cần Thơ', advice: 'Bánh tét lá cẩm Huỳnh Thị Trọng nếp tím dẻo nhân trứng muối thịt mỡ thơm bùi nức tiếng.' }
    ],
    hotel: { name: 'Resort / Khách sạn Bến Ninh Kiều Cần Thơ', address: 'Đường Hai Bà Trưng / Lê Lợi, Ninh Kiều, Cần Thơ', price: '450.000đ - 1.300.000đ/đêm' }
  },

  'An Giang': {
    region: 'Tây Nam Bộ',
    coords: { lat: 10.5216, lng: 105.1259 },
    attractions: [
      { name: 'Rừng tràm Trà Sư lướt xuồng trên thảm bèo xanh', address: 'Xã Văn Giáo, Huyện Tịnh Biên, An Giang', duration: '3 giờ 30 phút', cost: 100000, costText: 'Dự kiến: 100.000đ vé xuồng tắc ráng + chèo tay', lat: 10.5550, lng: 105.0450, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi tắc ráng lướt sóng qua cánh rừng tràm ngập nước; đi xuồng chèo len lỏi thảm bèo cám xanh ngắt.' },
      { name: 'Miếu Bà Chúa Xứ Núi Sam linh thiêng', address: 'Chân Núi Sam, Phường Núi Sam, TP. Châu Đốc', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng miếu', lat: 10.6780, lng: 105.0750, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Điểm hành hương tâm linh lớn nhất phương Nam; chiêm bái tượng Bà bằng đá sa thạch linh ứng.' },
      { name: 'Chùa Lầu (Phước Lâm Tự) phong cách Nhật Bản', address: 'Khóm Xuân Phú, Thị trấn Tịnh Biên, An Giang', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 10.4500, lng: 105.0100, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa cổ xây xếp tầng mái đỏ rực rỡ phong cách chùa Nhật Bản; khuôn viên hoa cỏ thanh tịnh.' },
      { name: 'Cánh đồng thốt nốt Tịnh Biên - Tri Tôn trái tim', address: 'Xã An Tức, Huyện Tri Tôn, An Giang', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 10.4200, lng: 104.9950, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Cụm cây thốt nốt vút cao uốn cong hình trái tim lãng mạn giữa cánh đồng lúa chín vàng óng ả.' },
      { name: 'Đồi Tức Dụp (Ngọn đồi 2 triệu đô la) anh hùng', address: 'Xã An Tức, Huyện Tri Tôn, An Giang', duration: '2 giờ 30 phút', cost: 60000, costText: 'Dự kiến: 60.000đ/vé', lat: 10.3800, lng: 104.9750, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Căn cứ pháo đài thép kiên cố trong lòng hang đá từng đứng vững trước bom đạn chiến tranh khốc liệt.' },
      { name: 'Hồ Tà Pạ hồ nước ngọc bích trên đỉnh núi', address: 'Xã Núi Tô, Huyện Tri Tôn, An Giang', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 10.4150, lng: 105.0050, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Tuyệt tình cốc miền Tây với hố nước khai thác đá đổi màu xanh ngọc bích phẳng lặng như gương soi.' },
      { name: 'Thánh đường Hồi giáo Mubarak người Chăm Đa Phước', address: 'Xã Đa Phước, Huyện An Phú, An Giang', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', lat: 10.7100, lng: 105.1100, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Hồi giáo mái vòm tròn trắng muốt thanh tao; tìm hiểu nét sinh hoạt văn hóa làng Chăm dệt lụa.' },
      { name: 'Lăng Thoại Ngọc Hầu danh thần khai mở đất phương Nam', address: 'Chân Núi Sam, TP. Châu Đốc, An Giang', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng lăng', lat: 10.6790, lng: 105.0740, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể lăng mộ cổ kính uy nghiêm của danh tướng Thoại Ngọc Hầu - người đào kênh Vĩnh Tế biên thùy.' }
    ],
    foods: [
      { name: 'Bún cá Châu Đốc nước lèo ngải bún nghệ tươi', dish: 'Bún cá lóc đồng chao xào nghệ vàng thơm ngải bún rau đắng', address: 'Đường Lê Lợi / Chợ Châu Đốc, An Giang', costText: 'Dự kiến: 30.000đ - 45.000đ/tô', lat: 10.7050, lng: 105.1150, advice: 'Nước dùng trong thơm thảo mộc ngải bún và nghệ vàng tươi, ăn cùng hoa điên điển giòn ngọt.' },
      { name: 'Gà đốt Ô Thum Tri Tôn lá chúc nức mũi', dish: 'Gà đồi ướp sả ớt lá chúc nướng đốt niêu đất da giòn thơm', address: 'Hồ Ô Thum, Xã Ô Lâm, Tri Tôn, An Giang', costText: 'Dự kiến: 220.000đ - 280.000đ/con', lat: 10.3950, lng: 104.9850, advice: 'Món ăn gốc Khmer da gà vàng ươm thơm the quyến rũ của lá chúc chấm muối ớt chanh ớt hiểm cay xé.' },
      { name: 'Bò bảy món Núi Sam lụi sả béo ngậy', dish: 'Bò lụi sả, bò né, bò nướng bánh hỏi mắm nêm', address: 'Khu vực chân Núi Sam, Châu Đốc', costText: 'Dự kiến: 120.000đ - 180.000đ/phần', lat: 10.6750, lng: 105.0780, advice: 'Thịt bò tơ vùng Bảy Núi chắc ngọt mềm đậm đà cuốn bánh tráng rau rừng tươi roi rói.' },
      { name: 'Bánh bò thốt nốt nướng cốt dừa vàng ươm', dish: 'Bánh bò đường thốt nốt nướng lò rễ tre mềm mướt béo ngậy', address: 'Chợ trung tâm Châu Đốc / Tri Tôn', costText: 'Dự kiến: 25.000đ - 40.000đ/ổ', lat: 10.7020, lng: 105.1120, advice: 'Màu vàng mơ tự nhiên từ đường thốt nốt dẻo mềm xốp như rễ tre thơm ngào ngạt nước cốt dừa.' }
    ],
    eveningActivities: [
      { name: 'Viếng Miếu Bà Chúa Xứ Núi Sam về đêm cầu an thanh tịnh', address: 'Miếu Bà Chúa Xứ, Núi Sam, Châu Đốc', advice: 'Không gian tâm linh lung linh ánh đèn và hương trầm khói tỏa, cầu bình an cho gia đạo.' },
      { name: 'Dạo chợ đêm Châu Đốc thưởng thức nước thốt nốt ướp lạnh', address: 'Đường Bạch Đằng / Bờ kè Châu Đốc', advice: 'Uống ly nước thốt nốt ngọt thanh mát lạnh có cùi thốt nốt giòn sần sật và ăn bánh khoai mì nướng.' },
      { name: 'Khám phá Vương quốc mắm Châu Đốc tại chợ đêm', address: 'Chợ Châu Đốc, An Giang', advice: 'Chiêm ngưỡng hàng trăm thùng mắm cá lóc, mắm cá linh, mắm ba khía xếp chồng bắt mắt.' },
      { name: 'Mua mắm thái Châu Đốc, đường thốt nốt nguyên chất làm quà', address: 'Các sạp mắm Bà Giáo Khỏe / Chợ Châu Đốc', advice: 'Mắm thái cá lóc đu đủ giòn ngọt và đường thốt nốt thơm bùi là đặc sản danh tiếng bậc nhất miền Tây.' }
    ],
    hotel: { name: 'Khách sạn / Resort Núi Sam Châu Đốc', address: 'Phường Núi Sam, TP. Châu Đốc, An Giang', price: '400.000đ - 1.200.000đ/đêm' }
  },

  'Cà Mau': {
    region: 'Tây Nam Bộ',
    coords: { lat: 9.1769, lng: 105.1524 },
    attractions: [
      { name: 'Mốc Tọa Độ Quốc Gia GPS 0001 Đất Mũi Cà Mau', address: 'Khu du lịch Quốc gia Mũi Cà Mau, Xã Đất Mũi, Ngọc Hiển', duration: '3 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé vào khu du lịch', lat: 8.6050, lng: 104.7150, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Điểm cực Nam thiêng liêng của Tổ Quốc trên đất liền; chạm tay vào cột mốc tọa độ ghi dấu ấn tự hào dân tộc.' },
      { name: 'Biểu tượng Con Tàu Mũi Cà Mau hướng biển khơi', address: 'Mũi Cà Mau, Xã Đất Mũi, Huyện Ngọc Hiển', duration: '1 giờ 30 phút', cost: 0, costText: 'Bao gồm trong vé Đất Mũi', lat: 8.6040, lng: 104.7140, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Mũi tàu vươn thẳng ra biển Đông và vịnh Thái Lan; nơi duy nhất ngắm mặt trời mọc ở biển Đông và lặn ở biển Tây.' },
      { name: 'Vườn Quốc gia Mũi Cà Mau xuyên rừng ngập mặn', address: 'Xã Đất Mũi, Huyện Ngọc Hiển, Cà Mau', duration: '3 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ vé vỏ lãi xuyên rừng đước', lat: 8.6100, lng: 104.7200, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi thuyền vỏ lãi lướt sóng qua những cánh rừng đước bạt ngàn ngắm bãi bồi sinh thái lấn biển hàng năm.' },
      { name: 'Vườn Quốc gia U Minh Hạ trải nghiệm đi gác kèo ong', address: 'Xã Trần Hợi, Huyện Trần Văn Thời, Cà Mau', duration: '4 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ/vé tham quan', lat: 9.2500, lng: 104.9500, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Hệ sinh thái rừng tràm ngập than bùn; theo chân thợ rừng đi gác kèo ong và nếm sáp ong mật tươi nguyên chất.' },
      { name: 'Đầm Thị Tường đầm nước tự nhiên lớn nhất Tây Nam Bộ', address: 'Huyện Phú Tân & Trần Văn Thời, Cà Mau', duration: '3 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ thuê đò ngắm đầm', lat: 9.0200, lng: 105.0300, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Biển hồ giữa đồng bằng với những căn nhà chòi nổi nuôi sò huyết; ngắm hoàng hôn đỏ ối tráng lệ trên mặt nước.' },
      { name: 'Hòn Đá Bạc cụm đảo đá granite nghìn năm tuổi', address: 'Xã Khánh Bình Tây, Trần Văn Thời, Cà Mau', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 9.1850, lng: 104.8100, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Cầu đá uốn lượn nối các hòn đảo giữa biển khơi; chiêm bái Lăng Ông Nam Hải thờ bộ xương cá voi khổng lồ.' },
      { name: 'Khu tưởng niệm Chủ tịch Hồ Chí Minh & Vườn chim phố', address: 'Đường Ngô Quyền, Phường 1, TP. Cà Mau', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', lat: 9.1750, lng: 105.1550, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Khuôn viên xanh mát nơi hàng ngàn cá thể cò, vạc bay về làm tổ ngay giữa trung tâm thành phố lúc chiều tà.' },
      { name: 'Cột cờ Hà Nội tại Mũi Cà Mau biểu tượng non sông', address: 'Khu công viên Văn hóa Mũi Cà Mau, Ngọc Hiển', duration: '1 giờ 30 phút', cost: 0, costText: 'Bao gồm trong vé Đất Mũi', lat: 8.6060, lng: 104.7160, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Món quà thiêng liêng của thủ đô Hà Nội gửi tặng Đất Mũi; leo lên đỉnh cột cờ ngắm biển rừng bao la bát ngát.' }
    ],
    foods: [
      { name: 'Cua Năm Căn Cà Mau luộc chấm muối tiêu chanh', dish: 'Cua biển Năm Căn chắc nịch gạch son béo ngậy ngọt lịm', address: 'Thị trấn Năm Căn / Nhà hàng Đất Mũi, Cà Mau', costText: 'Dự kiến: 350.000đ - 500.000đ/kg', lat: 8.7500, lng: 105.0100, advice: 'Được tôn vinh là loại cua ngon nhất Việt Nam thịt ngọt chắc nịch bùi béo không hề tanh.' },
      { name: 'Cá thòi lòi nướng muối ớt vùng rừng đước', dish: 'Cá thòi lòi leo cây nướng muối ớt than hoa thịt dai ngọt', address: 'Khu ẩm thực Đất Mũi, Ngọc Hiển, Cà Mau', costText: 'Dự kiến: 120.000đ - 180.000đ/đĩa', lat: 8.6080, lng: 104.7180, advice: 'Loài cá kỳ lạ vừa bơi vừa chạy trên cạn leo cây thịt săn chắc thơm ngậy như thịt gà đồng.' },
      { name: 'Vọp rừng nướng chấm mỡ hành đầm Thị Tường', dish: 'Vọp rừng ngập mặn nướng mọi chấm muối tiêu chanh tươi', address: 'Nhà sàn nổi Đầm Thị Tường, Cà Mau', costText: 'Dự kiến: 100.000đ - 150.000đ/đĩa', lat: 9.0250, lng: 105.0350, advice: 'Vọp to dày thịt ngọt thanh đậm vị phù sa ăn nóng ngay trên sàn nhà chòi gió lộng.' },
      { name: 'Lẩu lươn nấu trái giác chua thanh U Minh', dish: 'Lươn đồng béo vàng ươm hầm trái giác rừng rau muống đồng', address: 'Nhà hàng Rừng U Minh, TP. Cà Mau', costText: 'Dự kiến: 200.000đ - 280.000đ/nồi', lat: 9.1800, lng: 105.1500, advice: 'Vị chua thanh mát độc đáo của trái nho rừng U Minh quyện thịt lươn đồng béo ngậy ngọt lịm.' }
    ],
    eveningActivities: [
      { name: 'Dạo phố đêm TP. Cà Mau & Thưởng thức ẩm thực Chợ đêm', address: 'Đường An Dương Vương, Phường 7, TP. Cà Mau', advice: 'Hòa mình vào nhịp sống hiền hòa phương Nam, ăn bánh tằm cay, bánh xèo tôm đất nóng hổi.' },
      { name: 'Ngồi nhà sàn ven rừng đước nghe sóng biển Tây lộng gió', address: 'Homestay du lịch sinh thái Đất Mũi', advice: 'Cảm nhận sự tĩnh lặng thiêng liêng nơi cuối trời Tổ Quốc dưới bầu trời đêm ngàn sao lấp lánh.' },
      { name: 'Thưởng thức cua rang me & Lẩu cá bớp trên sông Gành Hào', address: 'Bờ kè sông Gành Hào, TP. Cà Mau', advice: 'Ngắm dòng sông Gành Hào lững lờ trôi, thưởng thức mâm cua rang me thơm nức mũi.' },
      { name: 'Mua tôm khô Rạch Gốc, mắm ba khía & Mật ong U Minh làm quà', address: 'Chợ trung tâm TP. Cà Mau / Đất Mũi', advice: 'Tôm khô Rạch Gốc đỏ au ngọt đậm và mật ong hoa tràm nguyên chất là hai sản vật nức tiếng Cà Mau.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Cà Mau / Homestay Đất Mũi', address: 'TP. Cà Mau / Xã Đất Mũi, Huyện Ngọc Hiển, Cà Mau', price: '400.000đ - 950.000đ/đêm' }
  }
};

const PROVINCE_ALIASES = {
  'vịnh hạ long': 'Vịnh Hạ Long', 'vinh ha long': 'Vịnh Hạ Long', 'hạ long': 'Vịnh Hạ Long', 'ha long': 'Vịnh Hạ Long', 'bãi cháy': 'Vịnh Hạ Long', 'bai chay': 'Vịnh Hạ Long', 'hòn gai': 'Vịnh Hạ Long', 'bái tử long': 'Vịnh Hạ Long',
  'cát bà': 'Cát Bà', 'cat ba': 'Cát Bà', 'đảo cát bà': 'Cát Bà', 'vịnh lan hạ': 'Cát Bà', 'lan hạ': 'Cát Bà', 'bến bèo': 'Cát Bà',
  'đồ sơn': 'Đồ Sơn', 'do son': 'Đồ Sơn', 'bãi biển đồ sơn': 'Đồ Sơn', 'đồi rồng': 'Đồ Sơn', 'dragon ocean': 'Đồ Sơn', 'hòn dấu': 'Đồ Sơn',
  'tà xùa': 'Tà Xùa', 'ta xua': 'Tà Xùa', 'săn mây tà xùa': 'Tà Xùa', 'háng đồng': 'Tà Xùa', 'sống lưng khủng long': 'Tà Xùa', 'mỏm cá heo': 'Tà Xùa', 'bắc yên': 'Tà Xùa',

  'tam đảo': 'Tam Đảo', 'tam dao': 'Tam Đảo', 'vĩnh phúc': 'Tam Đảo', 'vinh phuc': 'Tam Đảo', 'tây thiên': 'Tam Đảo', 'đại lải': 'Tam Đảo',
  'hà nam': 'Hà Nam', 'ha nam': 'Hà Nam', 'tam chúc': 'Hà Nam', 'tam chuc': 'Hà Nam', 'phủ lý': 'Hà Nam', 'phu ly': 'Hà Nam', 'vũ đại': 'Hà Nam', 'kim bảng': 'Hà Nam', 'bá kiến': 'Hà Nam',
  'hà nội': 'Hà Nội', 'ha noi': 'Hà Nội', 'hanoi': 'Hà Nội', 'thủ đô': 'Hà Nội', 'hồ gươm': 'Hà Nội', 'hoàn kiếm': 'Hà Nội',
  'hải phòng': 'Hải Phòng', 'hai phong': 'Hải Phòng',
  'quảng ninh': 'Quảng Ninh', 'quang ninh': 'Quảng Ninh', 'yên tử': 'Quảng Ninh', 'cô tô': 'Quảng Ninh', 'quan lạn': 'Quảng Ninh', 'vân đồn': 'Quảng Ninh', 'cẩm phả': 'Quảng Ninh',
  'ninh bình': 'Ninh Bình', 'ninh binh': 'Ninh Bình', 'tràng an': 'Ninh Bình', 'tam cốc': 'Ninh Bình', 'hang múa': 'Ninh Bình', 'bái đính': 'Ninh Bình', 'hoa lư': 'Ninh Bình',
  'sa pa': 'Sa Pa', 'sapa': 'Sa Pa', 'lào cai': 'Sa Pa', 'lao cai': 'Sa Pa', 'fansipan': 'Sa Pa', 'ô quy hồ': 'Sa Pa', 'cát cát': 'Sa Pa',
  'hà giang': 'Hà Giang', 'ha giang': 'Hà Giang', 'đồng văn': 'Hà Giang', 'mã pí lèng': 'Hà Giang', 'lũng cú': 'Hà Giang', 'nho quế': 'Hà Giang', 'mèo vạc': 'Hà Giang',
  'cao bằng': 'Cao Bằng', 'cao bang': 'Cao Bằng', 'bản giốc': 'Cao Bằng', 'pác bó': 'Cao Bằng', 'ngườm ngao': 'Cao Bằng',
  'mộc châu': 'Mộc Châu', 'moc chau': 'Mộc Châu', 'sơn la': 'Mộc Châu', 'son la': 'Mộc Châu', 'đồi chè': 'Mộc Châu',
  'bắc ninh': 'Bắc Ninh', 'bac ninh': 'Bắc Ninh', 'kinh bắc': 'Bắc Ninh', 'đền đô': 'Bắc Ninh', 'chùa dâu': 'Bắc Ninh',
  'nam định': 'Nam Định', 'nam dinh': 'Nam Định', 'đền trần': 'Nam Định', 'hải hậu': 'Nam Định',
  'bắc kạn': 'Bắc Kạn', 'bac kan': 'Bắc Kạn', 'ba bể': 'Bắc Kạn', 'hồ ba bể': 'Bắc Kạn',
  'lạng sơn': 'Lạng Sơn', 'lang son': 'Lạng Sơn', 'mẫu sơn': 'Lạng Sơn', 'tam thanh': 'Lạng Sơn',
  'tuyên quang': 'Tuyên Quang', 'tuyen quang': 'Tuyên Quang', 'na hang': 'Tuyên Quang', 'tân trào': 'Tuyên Quang',
  'thái nguyên': 'Thái Nguyên', 'thai nguyen': 'Thái Nguyên', 'hồ núi cốc': 'Thái Nguyên', 'tân cương': 'Thái Nguyên',
  'phú thọ': 'Phú Thọ', 'phu tho': 'Phú Thọ', 'đền hùng': 'Phú Thọ',
  'bắc giang': 'Bắc Giang', 'bac giang': 'Bắc Giang', 'lục ngạn': 'Bắc Giang',
  'hải dương': 'Hải Dương', 'hai duong': 'Hải Dương', 'côn sơn': 'Hải Dương', 'kiếp bạc': 'Hải Dương',
  'hưng yên': 'Hưng Yên', 'hung yen': 'Hưng Yên', 'phố hiến': 'Hưng Yên',
  'thái bình': 'Thái Bình', 'thai binh': 'Thái Bình', 'chùa keo': 'Thái Bình',
  'hòa bình': 'Hòa Bình', 'hoa binh': 'Hòa Bình', 'mai châu': 'Hòa Bình', 'thung nai': 'Hòa Bình',
  'yên bái': 'Yên Bái', 'yen bai': 'Yên Bái', 'mù cang chải': 'Yên Bái', 'mu cang chai': 'Yên Bái', 'tú lệ': 'Yên Bái',
  'điện biên': 'Điện Biên', 'dien bien': 'Điện Biên', 'mường thanh': 'Điện Biên', 'pha đin': 'Điện Biên',
  'lai châu': 'Lai Châu', 'lai chau': 'Lai Châu',
  'thanh hóa': 'Thanh Hóa', 'thanh hoa': 'Thanh Hóa', 'sầm sơn': 'Thanh Hóa', 'pù luông': 'Thanh Hóa', 'pu luong': 'Thanh Hóa',
  'nghệ an': 'Nghệ An', 'nghe an': 'Nghệ An', 'cửa lò': 'Nghệ An', 'quê bác': 'Nghệ An', 'nam đàn': 'Nghệ An',
  'hà tĩnh': 'Hà Tĩnh', 'ha tinh': 'Hà Tĩnh', 'thiên cầm': 'Hà Tĩnh', 'đồng lộc': 'Hà Tĩnh',
  'quảng bình': 'Quảng Bình', 'quang binh': 'Quảng Bình', 'phong nha': 'Quảng Bình', 'động thiên đường': 'Quảng Bình', 'sơn đoòng': 'Quảng Bình', 'đồng hới': 'Quảng Bình',
  'quảng trị': 'Quảng Trị', 'quang tri': 'Quảng Trị', 'vịnh mốc': 'Quảng Trị', 'thành cổ': 'Quảng Trị',
  'huế': 'Huế', 'hue': 'Huế', 'thừa thiên huế': 'Huế', 'sông hương': 'Huế', 'đại nội': 'Huế',
  'đà nẵng': 'Đà Nẵng', 'da nang': 'Đà Nẵng', 'danang': 'Đà Nẵng', 'cầu rồng': 'Đà Nẵng', 'bà nà': 'Đà Nẵng', 'mỹ khê': 'Đà Nẵng',
  'hội an': 'Hội An', 'hoi an': 'Hội An', 'quảng nam': 'Hội An', 'quang nam': 'Hội An', 'cù lao chàm': 'Hội An',
  'quảng ngãi': 'Quảng Ngãi', 'quang ngai': 'Quảng Ngãi', 'lý sơn': 'Quảng Ngãi', 'ly son': 'Quảng Ngãi',
  'quy nhơn': 'Quy Nhơn', 'quy nhon': 'Quy Nhơn', 'bình định': 'Quy Nhơn', 'binh dinh': 'Quy Nhơn', 'kỳ co': 'Quy Nhơn', 'eo gió': 'Quy Nhơn',
  'phú yên': 'Phú Yên', 'phu yen': 'Phú Yên', 'tuy hòa': 'Phú Yên', 'gành đá đĩa': 'Phú Yên', 'mũi điện': 'Phú Yên',
  'nha trang': 'Nha Trang', 'khánh hòa': 'Nha Trang', 'khanh hoa': 'Nha Trang', 'hòn tre': 'Nha Trang', 'cam ranh': 'Nha Trang',
  'ninh thuận': 'Ninh Thuận', 'ninh thuan': 'Ninh Thuận', 'vĩnh hy': 'Ninh Thuận', 'phan rang': 'Ninh Thuận',
  'mũi né': 'Bình Thuận', 'mui ne': 'Bình Thuận', 'phan thiết': 'Bình Thuận', 'bình thuận': 'Bình Thuận', 'binh thuan': 'Bình Thuận',
  'măng đen': 'Kon Tum', 'mang den': 'Kon Tum', 'kon tum': 'Kon Tum', 'kontum': 'Kon Tum',
  'gia lai': 'Gia Lai', 'pleiku': 'Gia Lai', 'biển hồ': 'Gia Lai',
  'đắk lắk': 'Đắk Lắk', 'dak lak': 'Đắk Lắk', 'daklak': 'Đắk Lắk', 'buôn ma thuột': 'Đắk Lắk', 'buon ma thuot': 'Đắk Lắk',
  'đắk nông': 'Đắk Nông', 'dak nong': 'Đắk Nông', 'tà đùng': 'Đắk Nông', 'ta dung': 'Đắk Nông',
  'đà lạt': 'Đà Lạt', 'da lat': 'Đà Lạt', 'dalat': 'Đà Lạt', 'lâm đồng': 'Đà Lạt', 'lam dong': 'Đà Lạt', 'langbiang': 'Đà Lạt', 'bảo lộc': 'Đà Lạt',
  'sài gòn': 'TP. Hồ Chí Minh', 'sai gon': 'TP. Hồ Chí Minh', 'hồ chí minh': 'TP. Hồ Chí Minh', 'tp.hcm': 'TP. Hồ Chí Minh', 'tphcm': 'TP. Hồ Chí Minh',
  'vũng tàu': 'Vũng Tàu', 'vung tau': 'Vũng Tàu', 'bà rịa': 'Vũng Tàu', 'côn đảo': 'Vũng Tàu', 'con dao': 'Vũng Tàu',
  'tây ninh': 'Tây Ninh', 'tay ninh': 'Tây Ninh', 'núi bà đen': 'Tây Ninh',
  'bình dương': 'Bình Dương', 'binh duong': 'Bình Dương', 'đại nam': 'Bình Dương',
  'bình phước': 'Bình Phước', 'binh phuoc': 'Bình Phước',
  'đồng nai': 'Đồng Nai', 'dong nai': 'Đồng Nai', 'cát tiên': 'Đồng Nai',
  'long an': 'Long An', 'tân lập': 'Long An',
  'tiền giang': 'Tiền Giang', 'tien giang': 'Tiền Giang', 'mỹ tho': 'Tiền Giang',
  'bến tre': 'Bến Tre', 'ben tre': 'Bến Tre',
  'trà vinh': 'Trà Vinh', 'tra vinh': 'Trà Vinh',
  'vĩnh long': 'Vĩnh Long', 'vinh long': 'Vĩnh Long',
  'đồng tháp': 'Đồng Tháp', 'dong thap': 'Đồng Tháp', 'sa đéc': 'Đồng Tháp', 'tràm chim': 'Đồng Tháp',
  'an giang': 'An Giang', 'châu đốc': 'An Giang', 'núi sam': 'An Giang', 'trà sư': 'An Giang',
  'phú quốc': 'Phú Quốc', 'phu quoc': 'Phú Quốc', 'kiên giang': 'Phú Quốc', 'kien giang': 'Phú Quốc', 'hà tiên': 'Phú Quốc', 'nam du': 'Phú Quốc',
  'cần thơ': 'Cần Thơ', 'can tho': 'Cần Thơ', 'ninh kiều': 'Cần Thơ', 'cái răng': 'Cần Thơ', 'miền tây': 'Cần Thơ',
  'hậu giang': 'Hậu Giang', 'hau giang': 'Hậu Giang',
  'sóc trăng': 'Sóc Trăng', 'soc trang': 'Sóc Trăng', 'chùa dơi': 'Sóc Trăng',
  'bạc liêu': 'Bạc Liêu', 'bac lieu': 'Bạc Liêu', 'công tử bạc liêu': 'Bạc Liêu',
  'cà mau': 'Cà Mau', 'ca mau': 'Cà Mau', 'đất mũi': 'Cà Mau', 'u minh': 'Cà Mau'
};

function detectDestinationProvince(text = '') {
  if (!text || typeof text !== 'string') return null;
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const lower = cleanText.toLowerCase();

  const sortedAliases = Object.keys(PROVINCE_ALIASES).sort((a, b) => b.length - a.length);
  for (const key of sortedAliases) {
    if (lower.includes(key)) {
      return PROVINCE_ALIASES[key];
    }
  }

  const sortedProvinces = Object.keys(VIETNAM_PROVINCES_DATA).sort((a, b) => b.length - a.length);
  for (const provName of sortedProvinces) {
    if (lower.includes(provName.toLowerCase())) {
      return provName;
    }
  }

  return null;
}

function extractTripRoute(text = '') {
  let startLocation = 'Hà Nội';
  let destination = null;

  const cleanText = (text || '').replace(/\s+/g, ' ').trim();
  const routeMatch = cleanText.match(/từ\s+([^➔\->vàođến]+)\s*(?:➔|->|vào|đến|đi)\s*([^\.,;?!]+)/i);
  if (routeMatch) {
    const rawStart = routeMatch[1].trim();
    const rawDest = routeMatch[2].trim();
    const detectedStart = detectDestinationProvince(rawStart);
    const detectedDest = detectDestinationProvince(rawDest);
    if (detectedStart) startLocation = detectedStart;
    if (detectedDest) destination = detectedDest;
    else destination = detectDestinationProvince(cleanText);
  } else {
    destination = detectDestinationProvince(cleanText);
  }

  return { startLocation, destination };
}

function getOrCreateProvinceData(provinceName) {
  if (VIETNAM_PROVINCES_DATA[provinceName]) {
    return VIETNAM_PROVINCES_DATA[provinceName];
  }

  return {
    region: 'Việt Nam',
    coords: { lat: 16.0544, lng: 108.2022 },
    attractions: [
      { name: `Quảng trường trung tâm & Di tích lịch sử ${provinceName}`, address: `Khu hành chính trung tâm ${provinceName}`, duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 16.0544, lng: 108.2022, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: `Khám phá trung tâm văn hóa và dấu ấn lịch sử hào hùng của ${provinceName}.` },
      { name: `Khu danh thắng thiên nhiên & Thác nước ${provinceName}`, address: `Khu du lịch sinh thái, ${provinceName}`, duration: '3 giờ', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', lat: 16.0600, lng: 108.2100, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: `Tận hưởng không khí trong lành, chụp ảnh phong cảnh thiên nhiên tuyệt đẹp.` },
      { name: `Chùa cổ & Quần thể tâm linh linh thiêng ${provinceName}`, address: `Địa phận ${provinceName}`, duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng chùa', lat: 16.0450, lng: 108.1950, image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: `Chiêm bái cầu bình an, thanh tịnh tâm hồn; nên mặc trang phục trang nghiêm.` },
      { name: `Bảo tàng văn hóa & Làng nghề truyền thống ${provinceName}`, address: `Trung tâm văn hóa ${provinceName}`, duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', lat: 21.0300, lng: 105.8500, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: `Tìm hiểu các hiện vật quý giá và trải nghiệm làm đồ thủ công truyền thống.` },
      { name: `Hồ sinh thái & Điểm ngắm hoàng hôn ${provinceName}`, address: `Khu hồ cảnh quan ${provinceName}`, duration: '2 giờ', cost: 0, costText: 'Tự do dạo mát', lat: 16.0500, lng: 108.2000, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: `Thời điểm lý tưởng nhất lúc chiều tà, ngắm mặt trời lặn lãng mạn bên mặt nước phẳng lặng.` },
      { name: `Khu du lịch cộng đồng & Bản làng sinh thái ${provinceName}`, address: `Ngoại ô ${provinceName}`, duration: '3 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', lat: 16.0700, lng: 108.2200, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: `Giao lưu cùng người dân bản địa, hòa mình vào không gian xanh ngát của miệt vườn, đồi núi.` },
      { name: `Công viên giải trí & Check-in biểu tượng ${provinceName}`, address: `Đại lộ trung tâm ${provinceName}`, duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', lat: 16.0580, lng: 108.2050, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Địa điểm chụp ảnh kỷ niệm tuyệt đẹp với biểu tượng kiến trúc đặc trưng địa phương.' },
      { name: `Chợ truyền thống lâu đời ${provinceName}`, address: `Khu thương mại trung tâm ${provinceName}`, duration: '2 giờ', cost: 0, costText: 'Tự do mua sắm', lat: 16.0520, lng: 108.1980, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', advice: 'Cảm nhận nhịp sống giao thương nhộn nhịp và mua sắm đặc sản làm quà giá tốt.' }
    ],
    foods: [
      { name: `Quán đặc sản gia truyền ${provinceName}`, dish: `Ẩm thực đặc sản truyền thống số 1 ${provinceName}`, address: `Trung tâm ${provinceName}`, costText: 'Dự kiến: 50.000đ - 80.000đ/người', lat: 16.0540, lng: 108.2010, advice: `Món ăn đặc trưng mang đậm phong vị bản xứ thơm ngon khó cưỡng.` },
      { name: `Nhà hàng ẩm thực đồng quê ${provinceName}`, dish: `Mâm cơm truyền thống đậm đà hương vị miền quê`, address: `Đường ẩm thực chính, ${provinceName}`, costText: 'Dự kiến: 120.000đ - 180.000đ/người', lat: 16.0560, lng: 108.2030, advice: `Nguyên liệu tươi sạch từ nông sản và thủy sản địa phương được chế biến tinh tế.` },
      { name: `Quán ăn dân dã nức tiếng ${provinceName}`, dish: `Món ngon địa phương được người bản địa ưa chuộng`, address: `Khu phố cổ ${provinceName}`, costText: 'Dự kiến: 60.000đ - 90.000đ/phần', lat: 16.0510, lng: 108.1990, advice: `Hương vị gia truyền lâu năm với nước chấm và gia vị thảo mộc độc đáo.` },
      { name: `Khu ẩm thực chợ truyền thống ${provinceName}`, dish: `Các món quà vặt & bánh ngọt đặc sản ${provinceName}`, address: `Khu ẩm thực chợ trung tâm ${provinceName}`, costText: 'Dự kiến: 30.000đ - 50.000đ/món', lat: 16.0530, lng: 108.1970, advice: `Trải nghiệm văn hóa ăn uống vỉa hè đa dạng, gần gũi và hấp dẫn.` }
    ],
    eveningActivities: [
      { name: `Chợ đêm & Khám phá ẩm thực đường phố ${provinceName}`, address: `Khu phố đi bộ ${provinceName}`, advice: `Tản bộ ngắm phố đêm, thưởng thức quà vặt địa phương và hòa vào nhịp sống tươi vui.` },
      { name: `Ngắm cảnh lung linh & Thưởng thức cafe view đẹp`, address: `Khu vực trung tâm bờ sông / bờ biển ${provinceName}`, advice: `Thư giãn với không gian âm nhạc nhẹ nhàng, ngắm toàn cảnh thị trấn về đêm rực rỡ ánh đèn.` },
      { name: `Dạo phố đi bộ & Giao lưu văn hóa nghệ thuật`, address: `Khu vực quảng trường ${provinceName}`, advice: `Trải nghiệm các hoạt động nghệ thuật đường phố, biểu diễn âm nhạc và mua sắm đồ lưu niệm.` },
      { name: `Thưởng thức ẩm thực đêm & Mua quà lưu niệm đặc sản`, address: `Phố ẩm thực truyền thống ${provinceName}`, advice: `Chọn mua các món đặc sản làm quà cho người thân và tận hưởng buổi tối thảnh thơi trước khi kết thúc chuyến đi.` }
    ],
    hotel: { name: `Khách sạn nghỉ dưỡng trung tâm ${provinceName}`, address: `Trung tâm ${provinceName}`, price: '450.000đ - 950.000đ/đêm' }
  };
}

function buildSmartItinerary({ startLocation, destination, days, budget, guests, rooms, travelStyle, specialRequests }) {
  const numDays = Math.max(1, Math.min(30, parseInt(days, 10) || 4));
  const numGuests = Math.max(1, parseInt(guests, 10) || 1);
  const numRooms = Math.max(1, parseInt(rooms, 10) || 1);

  let matchedProvince = detectDestinationProvince(destination) || detectDestinationProvince(specialRequests);
  if (!matchedProvince) {
    matchedProvince = destination?.trim() || 'Vịnh Hạ Long';
  }

  const provinceData = getOrCreateProvinceData(matchedProvince);
  const provCoords = provinceData.coords || { lat: 16.0544, lng: 108.2022 };

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 3);

  const formatDate = (d) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const startDateStr = formatDate(baseDate);
  const endDate = new Date(baseDate);
  endDate.setDate(endDate.getDate() + numDays - 1);
  const endDateStr = formatDate(endDate);

  const dailyItinerary = [];
  const attractionsPool = [...(provinceData.attractions || [])];
  const foodsPool = [...(provinceData.foods || [])];
  const eveningPool = [...(provinceData.eveningActivities || [])];
  const hotelInfo = provinceData.hotel || { name: `Khách sạn nghỉ dưỡng tại ${matchedProvince}`, address: `Trung tâm ${matchedProvince}` };

  const timeSlots = ['08:30', '11:30', '15:00', '19:00'];

  const dayThemeTitles = [
    `Check-in ${matchedProvince} & Khám phá nét đẹp khởi đầu`,
    `Chinh phục danh thắng biểu tượng & Trải nghiệm thiên nhiên ${matchedProvince}`,
    `Hòa mình vào chiều sâu văn hóa & Ẩm thực đặc sắc ${matchedProvince}`,
    `Thư thái ngắm cảnh, Mua quà đặc sản & Tạm biệt ${matchedProvince}`,
    `Khám phá chuyên sâu, Đổi mới góc nhìn & Trải nghiệm lân cận ${matchedProvince}`,
    `Hòa nhập nhịp sống bản địa, Check-in góc lạ & Ẩm thực gia truyền ${matchedProvince}`,
    `Tận hưởng thiên nhiên khoáng đạt & Trải nghiệm sinh thái thư giãn ${matchedProvince}`,
    `Thong dong dạo chơi các điểm yêu thích, Săn ảnh đẹp & Nghỉ dưỡng trọn vẹn`
  ];

  const isShuffle = specialRequests && (
    specialRequests.includes('xáo') ||
    specialRequests.includes('đổi thứ tự') ||
    specialRequests.includes('sắp xếp lại') ||
    specialRequests.includes('đảo lại')
  );

  const isDifferentPoints = specialRequests && (
    specialRequests.includes('đi rồi') ||
    specialRequests.includes('đã đi') ||
    specialRequests.includes('lịch trình khác') ||
    specialRequests.includes('điểm khác')
  );

  const initialOffset = isDifferentPoints ? 4 : 0;

  for (let day = 1; day <= numDays; day++) {
    const curDate = new Date(baseDate);
    curDate.setDate(curDate.getDate() + day - 1);
    const curDateStr = formatDate(curDate);

    const activities = [];

    const cycle = Math.floor((day - 1) / 4);
    const subDay = (day - 1) % 4;

    let att1Idx, att2Idx, foodIdx, eveningIdx;

    if (cycle === 0) {
      if (isShuffle) {
        att1Idx = ((day - 1) * 2 + 1 + initialOffset) % attractionsPool.length;
        att2Idx = ((day - 1) * 2 + initialOffset) % attractionsPool.length;
        foodIdx = (day + 1 + (isDifferentPoints ? 2 : 0)) % foodsPool.length;
        eveningIdx = (day) % eveningPool.length;
      } else {
        att1Idx = ((day - 1) * 2 + initialOffset) % attractionsPool.length;
        att2Idx = ((day - 1) * 2 + 1 + initialOffset) % attractionsPool.length;
        foodIdx = (day - 1 + (isDifferentPoints ? 2 : 0)) % foodsPool.length;
        eveningIdx = (day - 1) % eveningPool.length;
      }
    } else {
      const crossPairs = [
        [3, 0],
        [5, 2],
        [7, 4],
        [1, 6],
        [2, 5],
        [4, 7],
        [0, 3]
      ];
      const pair = crossPairs[(day - 5) % crossPairs.length];
      att1Idx = (pair[0] + initialOffset) % attractionsPool.length;
      att2Idx = (pair[1] + initialOffset) % attractionsPool.length;
      foodIdx = (subDay + 2 + cycle) % foodsPool.length;
      eveningIdx = (subDay + 1 + cycle) % eveningPool.length;
    }

    const att1 = attractionsPool[att1Idx % attractionsPool.length];
    if (att1) {
      const customAdvice = cycle > 0
        ? `Khám phá góc nhìn mới buổi sáng tại ${att1.name}, tận hưởng không gian thanh tĩnh và trải nghiệm văn hóa bản địa chuyên sâu.`
        : (att1.advice || `Khám phá thắng cảnh tiêu biểu của ${matchedProvince} vào buổi sáng mát mẻ.`);

      activities.push({
        order: 1,
        time: timeSlots[0],
        type: 'attraction',
        name: att1.name,
        address: att1.address,
        duration: att1.duration || '2 giờ',
        costText: att1.costText || 'Tham quan tự do',
        cost: att1.cost || 0,
        lat: att1.lat || (provCoords.lat + 0.008 * day),
        lng: att1.lng || (provCoords.lng + 0.006 * day),
        image: att1.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
        advice: customAdvice
      });
    }

    const foodItem = foodsPool[foodIdx % foodsPool.length];
    if (foodItem) {
      const customFoodAdvice = cycle > 0
        ? `Đổi vị ngày ${day} với món ${foodItem.dish || foodItem.name}, trải nghiệm ẩm thực truyền thống đậm đà của ${matchedProvince}.`
        : (foodItem.advice || `Thưởng thức món ngon trứ danh ${foodItem.dish || 'đặc sản'} tại ${matchedProvince}.`);

      activities.push({
        order: 2,
        time: timeSlots[1],
        type: 'food',
        name: foodItem.name,
        address: foodItem.address,
        duration: '1 giờ 15 phút',
        costText: foodItem.costText || 'Dự kiến: 50.000đ - 90.000đ/người',
        cost: foodItem.cost || 60000,
        lat: foodItem.lat || (provCoords.lat + 0.003),
        lng: foodItem.lng || (provCoords.lng + 0.002),
        image: foodItem.image || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
        advice: customFoodAdvice
      });
    }

    const att2 = attractionsPool[att2Idx % attractionsPool.length];
    if (att2) {
      const customAdvice2 = cycle > 0
        ? `Ghé thăm ${att2.name} vào khung giờ chiều tà mát dịu, ngắm hoàng hôn và ghi lại những góc ảnh lưu niệm tuyệt đẹp.`
        : (att2.advice || `Trải nghiệm cảnh sắc thiên nhiên và không gian văn hóa ${matchedProvince} buổi chiều tà.`);

      activities.push({
        order: 3,
        time: timeSlots[2],
        type: 'attraction',
        name: att2.name,
        address: att2.address,
        duration: att2.duration || '2 giờ',
        costText: att2.costText || 'Tham quan tự do',
        cost: att2.cost || 0,
        lat: att2.lat || (provCoords.lat - 0.007 * day),
        lng: att2.lng || (provCoords.lng - 0.005 * day),
        image: att2.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        advice: customAdvice2
      });
    }

    const eveningItem = eveningPool[eveningIdx % eveningPool.length] || {
      name: `Phố đêm & Ẩm thực tối ${matchedProvince}`,
      address: `Khu phố trung tâm ${matchedProvince}`,
      advice: `Tản bộ ngắm phố đêm, thưởng thức các món ăn đường phố đặc sắc.`
    };

    const customEveningAdvice = cycle > 0
      ? `Buổi tối ngày ${day}: Tận hưởng không khí đêm ${matchedProvince}, thư thái uống cafe ngắm phố thị lung linh hoặc ghé mua quà lưu niệm.`
      : eveningItem.advice;

    activities.push({
      order: 4,
      time: timeSlots[3],
      type: 'food',
      name: eveningItem.name,
      address: eveningItem.address,
      duration: '2 giờ',
      costText: eveningItem.costText || 'Ăn tối & dạo phố tự do',
      cost: eveningItem.cost || 100000,
      lat: eveningItem.lat || (provCoords.lat + 0.001),
      lng: eveningItem.lng || (provCoords.lng + 0.001),
      image: eveningItem.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      advice: customEveningAdvice
    });

    const dayTitle = dayThemeTitles[(day - 1) % dayThemeTitles.length];

    dailyItinerary.push({
      day: day,
      date: curDateStr,
      title: `${dayTitle} (Ngày ${day})`,
      activityCount: activities.length,
      transitSummary: `Di chuyển thuận tiện bằng taxi, thuê xe máy hoặc xe đưa đón giữa các điểm tham quan tại ${matchedProvince}.`,
      activities: activities
    });
  }

  const isNear = ['Hà Nội', 'Ninh Bình', 'Quảng Ninh', 'Vịnh Hạ Long', 'Cát Bà', 'Đồ Sơn', 'Tà Xùa', 'Sa Pa', 'Hải Phòng', 'Hòa Bình', 'Mai Châu', 'Mộc Châu', 'Cao Bằng', 'Hà Giang', 'Tam Đảo', 'Hà Nam', 'Vĩnh Phúc', 'Nam Định', 'Thái Bình', 'Bắc Ninh', 'Bắc Giang', 'Phú Thọ', 'Thái Nguyên'].includes(matchedProvince) && ['Hà Nội'].includes(startLocation);
  const transitCostPerPerson = isNear ? 350000 : 1650000;
  const transitCostTotal = transitCostPerPerson * numGuests;

  const nights = numDays > 1 ? numDays - 1 : 1;
  let hotelPricePerNight = 650000;
  if (['Phú Quốc', 'Nha Trang', 'Đà Nẵng', 'Đà Lạt', 'TP. Hồ Chí Minh', 'Vịnh Hạ Long'].includes(matchedProvince)) {
    hotelPricePerNight = 850000;
  } else if (['Hà Giang', 'Cao Bằng', 'Cần Thơ', 'Tây Ninh', 'Hà Nam', 'Nam Định', 'Bắc Ninh', 'Tà Xùa', 'Đồ Sơn'].includes(matchedProvince)) {
    hotelPricePerNight = 500000;
  } else if (['Tam Đảo', 'Cát Bà'].includes(matchedProvince)) {
    hotelPricePerNight = 700000;
  }
  const hotelCostTotal = hotelPricePerNight * nights * numRooms;

  let ticketCostPerPerson = 0;
  dailyItinerary.forEach(day => {
    day.activities.forEach(act => {
      ticketCostPerPerson += (act.cost || 0);
    });
  });
  const ticketCostTotal = ticketCostPerPerson * numGuests;

  const foodPerDayPerPerson = 280000;
  const foodCostTotal = foodPerDayPerPerson * numDays * numGuests;

  const localTransportTotal = 120000 * numDays;

  const calculatedBudget = transitCostTotal + hotelCostTotal + ticketCostTotal + foodCostTotal + localTransportTotal;

  const fixedCost = transitCostTotal + Math.round(hotelCostTotal * 0.3) + ticketCostTotal;

  const overviewServices = [
    {
      category: isNear ? 'Vé xe Limousine khứ hồi' : 'Vé máy bay khứ hồi',
      provider: isNear ? 'Xe Limousine VIP đưa đón' : 'Vietnam Airlines / Vietjet Air',
      route: `${startLocation || 'Hà Nội'} ⇄ ${matchedProvince}`,
      price: transitCostTotal,
      detail: `${transitCostPerPerson.toLocaleString('vi-VN')}đ/khách x ${numGuests} khách`,
      status: 'Xác nhận tức thì',
      type: isNear ? 'transit' : 'flight'
    },
    {
      category: 'Lưu trú nghỉ dưỡng',
      provider: hotelInfo.name,
      nights: `${nights} đêm (${numGuests} khách, ${numRooms} phòng)`,
      detail: `${hotelPricePerNight.toLocaleString('vi-VN')}đ/đêm x ${nights} đêm x ${numRooms} phòng`,
      price: hotelCostTotal,
      status: 'Giữ phòng linh hoạt',
      type: 'hotel'
    },
    {
      category: 'Vé thắng cảnh & Trải nghiệm',
      provider: `Các điểm tham quan tại ${matchedProvince}`,
      detail: `Trọn gói vé tham quan cho ${numGuests} khách (${ticketCostPerPerson.toLocaleString('vi-VN')}đ/người)`,
      price: ticketCostTotal,
      status: 'Đặt trước tiện lợi',
      type: 'ticket'
    },
    {
      category: 'Dự toán ẩm thực & ăn uống',
      provider: 'Đặc sản địa phương 3 bữa/ngày',
      detail: `${foodPerDayPerPerson.toLocaleString('vi-VN')}đ/ngày x ${numDays} ngày x ${numGuests} khách`,
      price: foodCostTotal,
      status: 'Tự do trải nghiệm',
      type: 'food'
    }
  ];

  return {
    title: `Lịch trình du lịch ${matchedProvince} (${numDays} Ngày ${numDays > 1 ? numDays - 1 : 0} Đêm)`,
    startLocation: startLocation || 'Hà Nội',
    destination: matchedProvince,
    startDate: startDateStr,
    endDate: endDateStr,
    days: numDays,
    guests: numGuests,
    rooms: numRooms,
    fixedCost: fixedCost,
    totalBudget: calculatedBudget,
    summary: `Kế hoạch hành trình tối ưu được hệ thống VietnamTourism AI thiết kế riêng cho chuyến khám phá ${matchedProvince} trong ${numDays} ngày ${numDays > 1 ? numDays - 1 : 0} đêm. Lộ trình từng ngày gồm 4 mốc hoạt động (sáng, trưa, chiều, tối) hoàn toàn khác biệt, giúp bạn trải nghiệm trọn vẹn cảnh sắc kỳ quan, ẩm thực đặc sản và văn hóa bản địa.`,
    dailyItinerary: dailyItinerary,
    overviewServices: overviewServices,
    travelTips: [
      `Nên chuẩn bị trang phục phù hợp với thời tiết đặc trưng của ${matchedProvince}.`,
      `Có thể bấm trực tiếp vào từng địa điểm trên bản đồ tương tác để mở vị trí và chỉ đường trên Google Maps.`,
      `Thưởng thức các món đặc sản địa phương tại các địa chỉ gia truyền uy tín được hệ thống gợi ý.`
    ]
  };
}

function replaceActivityInPlan(plan, targetName, provinceName, options = {}) {
  if (!plan || !plan.dailyItinerary || !plan.dailyItinerary.length) {
    return { success: false, error: 'Chưa có kế hoạch nào để thay thế' };
  }

  const dest = provinceName || plan.destination || 'Vịnh Hạ Long';
  const pData = getOrCreateProvinceData(dest);
  const cleanTarget = (targetName || '').trim().toLowerCase();
  const closerOnly = !!options.closerOnly;

  let targetDay = null;
  let targetAct = null;
  let targetIndex = -1;

  if (closerOnly) {
    let maxDist = -1;
    for (const day of plan.dailyItinerary) {
      const atts = (day.activities || []).filter(a => a.type === 'attraction' && a.lat && a.lng);
      if (atts.length >= 2) {
        const dist = Math.hypot(atts[0].lat - atts[1].lat, atts[0].lng - atts[1].lng);
        if (dist > maxDist) {
          maxDist = dist;
          targetDay = day;
          targetAct = atts[1];
          targetIndex = day.activities.indexOf(atts[1]);
        }
      }
    }
    if (!targetAct && plan.dailyItinerary[0]?.activities?.length >= 3) {
      targetDay = plan.dailyItinerary[0];
      targetAct = targetDay.activities.find((a, idx) => idx >= 2 && a.type === 'attraction') || targetDay.activities[0];
      targetIndex = targetDay.activities.indexOf(targetAct);
    }
  }

  if (!targetAct && cleanTarget) {
    for (const day of plan.dailyItinerary) {
      for (let i = 0; i < day.activities.length; i++) {
        const act = day.activities[i];
        if (act.name.toLowerCase().includes(cleanTarget) || cleanTarget.includes(act.name.toLowerCase())) {
          targetDay = day;
          targetAct = act;
          targetIndex = i;
          break;
        }
      }
      if (targetAct) break;
    }
  }

  if (!targetAct) {
    for (const day of plan.dailyItinerary) {
      for (let i = 0; i < day.activities.length; i++) {
        if (day.activities[i].type === 'attraction') {
          targetDay = day;
          targetAct = day.activities[i];
          targetIndex = i;
          break;
        }
      }
      if (targetAct) break;
    }
  }

  if (!targetAct) {
    return { success: false, error: 'Không tìm thấy hoạt động cần thay thế trong lịch trình' };
  }

  const existingNames = new Set();
  plan.dailyItinerary.forEach(d => d.activities.forEach(a => existingNames.add(a.name.toLowerCase())));

  let pool = targetAct.type === 'food' ? (pData.foods || []) : (pData.attractions || []);
  let availableCandidates = pool.filter(item => !existingNames.has(item.name.toLowerCase()));

  if (!availableCandidates.length) {
    availableCandidates = pool.filter(item => item.name.toLowerCase() !== targetAct.name.toLowerCase());
  }

  let candidate = null;
  if (closerOnly && availableCandidates.length > 0) {
    const otherActs = targetDay.activities.filter(a => a !== targetAct && a.lat && a.lng);
    if (otherActs.length > 0) {
      availableCandidates.sort((a, b) => {
        const distA = Math.min(...otherActs.map(o => Math.hypot((a.lat || 0) - o.lat, (a.lng || 0) - o.lng)));
        const distB = Math.min(...otherActs.map(o => Math.hypot((b.lat || 0) - o.lat, (b.lng || 0) - o.lng)));
        return distA - distB;
      });
    }
    candidate = availableCandidates[0];
  } else {
    candidate = availableCandidates[0] || pool[0];
  }

  if (!candidate) {
    return { success: false, error: 'Không có địa điểm thay thế phù hợp' };
  }

  const oldName = targetAct.name;
  targetAct.name = candidate.name;
  if (candidate.address) targetAct.address = candidate.address;
  if (candidate.duration) targetAct.duration = candidate.duration;
  if (candidate.costText) targetAct.costText = candidate.costText;
  if (candidate.cost !== undefined) targetAct.cost = candidate.cost;
  if (closerOnly) {
    targetAct.advice = `Vị trí trung tâm rất gần các điểm tham quan cùng ngày, di chuyển nhanh chóng, tiết kiệm tối đa thời gian.`;
  } else if (candidate.advice) {
    targetAct.advice = candidate.advice;
  }
  if (candidate.image) targetAct.image = candidate.image;
  if (candidate.lat) targetAct.lat = candidate.lat;
  if (candidate.lng) targetAct.lng = candidate.lng;

  let ticketCostPerPerson = 0;
  plan.dailyItinerary.forEach(day => {
    day.activities.forEach(act => {
      ticketCostPerPerson += (act.cost || 0);
    });
  });
  const numGuests = plan.guests || 1;
  const ticketCostTotal = ticketCostPerPerson * numGuests;
  const transitCostTotal = (plan.overviewServices?.find(s => s.type === 'transit' || s.type === 'flight')?.price) || 0;
  const hotelCostTotal = (plan.overviewServices?.find(s => s.type === 'hotel')?.price) || 0;
  const foodCostTotal = 280000 * (plan.days || 3) * numGuests;
  const localTransportTotal = 120000 * (plan.days || 3);
  plan.totalBudget = transitCostTotal + hotelCostTotal + ticketCostTotal + foodCostTotal + localTransportTotal;
  plan.fixedCost = transitCostTotal + Math.round(hotelCostTotal * 0.3) + ticketCostTotal;

  const ticketService = plan.overviewServices?.find(s => s.type === 'ticket');
  if (ticketService) {
    ticketService.price = ticketCostTotal;
    ticketService.detail = `Trọn gói vé tham quan cho ${numGuests} khách (${ticketCostPerPerson.toLocaleString('vi-VN')}đ/người)`;
  }

  return {
    success: true,
    updatedPlan: plan,
    dayNumber: targetDay.day,
    oldName: oldName,
    newName: candidate.name,
    replacement: candidate,
    isCloser: closerOnly
  };
}

function shufflePlanActivities(currentPlan, targetDayNumber = null) {
  if (!currentPlan || !currentPlan.dailyItinerary || !currentPlan.dailyItinerary.length) {
    return currentPlan;
  }
  const cloned = JSON.parse(JSON.stringify(currentPlan));
  const days = cloned.dailyItinerary;

  const targetDayInt = targetDayNumber ? parseInt(targetDayNumber, 10) : null;
  const daysToShuffle = targetDayInt
    ? days.filter(d => d.day === targetDayInt)
    : days;

  for (let i = 0; i < daysToShuffle.length; i++) {
    const day = daysToShuffle[i];
    const acts = day.activities;
    if (acts && acts.length >= 3) {
      const morningAtt = { ...acts[0] };
      const afternoonAtt = { ...acts[2] };

      acts[0] = {
        ...afternoonAtt,
        order: 1,
        time: '08:30',
        advice: `Ghé thăm ${afternoonAtt.name} vào buổi sáng mát mẻ, đón bình minh và tránh đông đúc.`
      };
      acts[2] = {
        ...morningAtt,
        order: 3,
        time: '15:00',
        advice: `Khám phá ${morningAtt.name} vào buổi chiều tà, tận hưởng hoàng hôn thư thái.`
      };
    }
  }

  if (targetDayInt) {
    cloned.summary = `Lịch trình Ngày ${targetDayInt} tại ${cloned.destination} đã được xáo lại thứ tự tham quan buổi sáng và buổi chiều một cách khoa học.`;
  } else {
    cloned.summary = `Lịch trình du lịch ${cloned.destination} đã được VietnamTourism AI giữ nguyên các địa điểm quen thuộc và sắp xếp lại thứ tự các buổi tham quan một cách logic và khoa học.`;
  }
  return cloned;
}

function addFoodActivityToPlan(currentPlan, targetDayNumber = null) {
  if (!currentPlan || !currentPlan.dailyItinerary || !currentPlan.dailyItinerary.length) {
    return { success: false, error: 'Chưa có lịch trình để thêm địa điểm ăn uống' };
  }
  const cloned = JSON.parse(JSON.stringify(currentPlan));
  const pData = getOrCreateProvinceData(cloned.destination);

  const existingNames = new Set();
  cloned.dailyItinerary.forEach(d => {
    (d.activities || []).forEach(a => existingNames.add(a.name.toLowerCase()));
  });

  const availableFoods = (pData.foods || []).filter(f => !existingNames.has(f.name.toLowerCase()));
  const candidate = availableFoods[0] || (pData.foods && pData.foods[0]) || {
    name: `Quán ăn đặc sản ${cloned.destination}`,
    dish: 'Ẩm thực địa phương',
    address: `Khu ẩm thực trung tâm ${cloned.destination}`,
    cost: 120000,
    costText: '120.000đ/người',
    advice: 'Thưởng thức ẩm thực đậm đà bản sắc địa phương.'
  };

  let targetDay = cloned.dailyItinerary[0];
  if (targetDayNumber) {
    const found = cloned.dailyItinerary.find(d => d.day === parseInt(targetDayNumber, 10));
    if (found) targetDay = found;
  }

  const hasAfternoonSnack = targetDay.activities.some(a => a.time === '16:30');
  const foodTime = hasAfternoonSnack ? '21:00' : '16:30';
  const foodLabel = hasAfternoonSnack ? 'Khám phá ẩm thực đêm & ăn khuya' : 'Ăn xế chiều & Thưởng thức quà vặt địa phương';

  const newActivity = {
    order: targetDay.activities.length + 1,
    time: foodTime,
    type: 'food',
    name: candidate.name,
    address: candidate.address || `Khu ẩm thực ${cloned.destination}`,
    duration: '1.5 giờ',
    cost: candidate.cost || 100000,
    costText: candidate.costText || '100.000đ/người',
    lat: candidate.lat || (pData.coordinates?.lat ? pData.coordinates.lat + 0.002 : 20.95),
    lng: candidate.lng || (pData.coordinates?.lng ? pData.coordinates.lng + 0.002 : 107.05),
    image: candidate.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    advice: candidate.advice || `Trải nghiệm ${foodLabel}: Thưởng thức ${candidate.dish || candidate.name} nóng hổi, hấp dẫn.`
  };

  targetDay.activities.push(newActivity);
  targetDay.activities.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  targetDay.activities.forEach((act, idx) => { act.order = idx + 1; });
  targetDay.activityCount = targetDay.activities.length;

  const numGuests = cloned.guests || 1;
  cloned.totalBudget = (cloned.totalBudget || 0) + (newActivity.cost * numGuests);

  return {
    success: true,
    updatedPlan: cloned,
    addedFood: candidate,
    dayNumber: targetDay.day,
    activity: newActivity
  };
}

function expandItineraryDays(currentPlan, newDays, startLocation = 'Hà Nội') {
  if (!currentPlan || !currentPlan.dailyItinerary || !currentPlan.dailyItinerary.length) {
    return buildSmartItinerary({
      startLocation,
      destination: currentPlan?.destination || 'Vịnh Hạ Long',
      days: newDays,
      budget: newDays * 1500000
    });
  }

  const cloned = JSON.parse(JSON.stringify(currentPlan));
  const oldDaysCount = cloned.dailyItinerary.length;
  if (newDays <= oldDaysCount) {
    cloned.dailyItinerary = cloned.dailyItinerary.slice(0, newDays);
    cloned.days = newDays;
    return cloned;
  }

  const pData = getOrCreateProvinceData(cloned.destination);
  const existingNames = new Set();
  cloned.dailyItinerary.forEach(d => (d.activities || []).forEach(a => existingNames.add(a.name.toLowerCase())));

  let unusedAttractions = (pData.attractions || []).filter(a => !existingNames.has(a.name.toLowerCase()));
  let unusedFoods = (pData.foods || []).filter(f => !existingNames.has(f.name.toLowerCase()));

  const dayThemeTitles = [
    'Khám phá danh thắng & check-in tuyệt cảnh',
    'Trải nghiệm văn hóa & ẩm thực di sản',
    'Chinh phục thiên nhiên kỳ vĩ & thư giãn',
    'Hòa mình vào nhịp sống bản địa & ngắm cảnh',
    'Thưởng thức tinh hoa ẩm thực & mua sắm quà lưu niệm',
    'Nghỉ dưỡng & lưu giữ khoảnh khắc đáng nhớ'
  ];

  for (let day = oldDaysCount + 1; day <= newDays; day++) {
    let morningAtt, afternoonAtt;

    if (day <= 4 && unusedAttractions.length >= 2) {
      morningAtt = unusedAttractions.shift();
      afternoonAtt = unusedAttractions.shift();
    } else {
      const attPool = pData.attractions || [];
      const crossPairs = [
        [3, 0],
        [5, 2],
        [7, 4],
        [1, 6],
        [2, 5],
        [4, 7],
        [0, 3]
      ];
      const pair = crossPairs[(day - 5) % crossPairs.length];
      const mRaw = attPool[pair[0] % attPool.length] || attPool[0];
      const aRaw = attPool[pair[1] % attPool.length] || attPool[1] || attPool[0];

      morningAtt = {
        ...mRaw,
        advice: `Góc nhìn buổi sáng mới lạ tại ${mRaw.name}, đón bình minh và tận hưởng không gian yên bình khác biệt.`
      };
      afternoonAtt = {
        ...aRaw,
        advice: `Khám phá ${aRaw.name} vào buổi chiều tà lãng mạn, ngắm hoàng hôn và cảm nhận chiều sâu bản địa.`
      };
    }

    const lunchPool = pData.foods || [];
    const lunchFood = unusedFoods.shift() || lunchPool[(day + 1) % lunchPool.length] || {
      name: `Quán ăn đặc sản Ngày ${day}`,
      dish: 'Món ngon địa phương',
      address: `Trung tâm ${cloned.destination}`,
      duration: '1.5 giờ',
      cost: 120000,
      costText: 'Khoảng 120.000đ/người',
      advice: `Đổi vị Ngày ${day} với món ăn đậm đà bản sắc địa phương.`
    };

    const eveningPool = pData.eveningActivities || lunchPool;
    const eveningFood = eveningPool[(day + 2) % eveningPool.length] || {
      name: `Phố ẩm thực & Chợ đêm Ngày ${day}`,
      dish: 'Ẩm thực đường phố',
      address: `Phố đi bộ ${cloned.destination}`,
      duration: '2 giờ',
      cost: 150000,
      costText: 'Ăn tối & dạo phố: 150.000đ',
      advice: 'Khám phá không khí sôi động và ẩm thực đêm.'
    };

    const activities = [
      { order: 1, time: '08:30', type: 'attraction', ...morningAtt },
      { order: 2, time: '12:00', type: 'food', ...lunchFood },
      { order: 3, time: '15:00', type: 'attraction', ...afternoonAtt },
      { order: 4, time: '19:00', type: 'food', ...eveningFood }
    ];

    const title = dayThemeTitles[(day - 1) % dayThemeTitles.length];
    cloned.dailyItinerary.push({
      day: day,
      title: `${title} (Ngày ${day})`,
      activityCount: activities.length,
      transitSummary: `Di chuyển thuận tiện giữa các điểm tham quan Ngày ${day} tại ${cloned.destination}.`,
      activities: activities
    });
  }

  cloned.days = newDays;
  const numGuests = cloned.guests || 1;
  const nights = newDays > 1 ? newDays - 1 : 1;

  let ticketCostPerPerson = 0;
  cloned.dailyItinerary.forEach(d => d.activities.forEach(a => ticketCostPerPerson += (a.cost || 0)));
  const ticketCostTotal = ticketCostPerPerson * numGuests;
  const transitCostTotal = (cloned.overviewServices?.find(s => s.type === 'transit' || s.type === 'flight')?.price) || (350000 * numGuests);
  const hotelCostTotal = 700000 * nights * (cloned.rooms || 1);
  const foodCostTotal = 280000 * newDays * numGuests;
  const localTransportTotal = 120000 * newDays;

  cloned.totalBudget = transitCostTotal + hotelCostTotal + ticketCostTotal + foodCostTotal + localTransportTotal;
  cloned.fixedCost = transitCostTotal + Math.round(hotelCostTotal * 0.3) + ticketCostTotal;
  cloned.summary = `Lịch trình du lịch ${cloned.destination} ${newDays} ngày ${newDays - 1} đêm đã được cập nhật đầy đủ, giữ nguyên các ngày đầu và bổ sung chi tiết các ngày tiếp theo với trải nghiệm đa dạng không trùng lặp.`;

  return cloned;
}

const POPULAR_DESTINATIONS = [
  'Vịnh Hạ Long', 'Cát Bà', 'Đồ Sơn', 'Tà Xùa', 'Tam Đảo', 'Sa Pa',
  'Ninh Bình', 'Hà Giang', 'Cao Bằng', 'Đà Nẵng', 'Huế', 'Quy Nhơn',
  'Nha Trang', 'Đà Lạt', 'Phú Quốc', 'Mộc Châu', 'Cần Thơ'
];

function getRandomAlternativeDestination(currentProvince) {
  const normCurrent = (currentProvince || '').trim().toLowerCase();
  const filtered = POPULAR_DESTINATIONS.filter(d => !normCurrent.includes(d.toLowerCase()) && !d.toLowerCase().includes(normCurrent));
  if (!filtered.length) return 'Cát Bà';
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

function getBestFoodRecommendation(provinceName) {
  const pData = getOrCreateProvinceData(provinceName);
  const foods = pData.foods || [];
  if (!foods.length) {
    return {
      mainDish: `Đặc sản truyền thống ${provinceName}`,
      dishDetail: 'Món ăn đặc sản địa phương',
      address: `Các nhà hàng trung tâm ${provinceName}`,
      advice: 'Hương vị thơm ngon mang đậm phong vị địa phương.',
      otherDishes: []
    };
  }
  return {
    mainDish: foods[0].name,
    dishDetail: foods[0].dish,
    address: foods[0].address,
    costText: foods[0].costText,
    advice: foods[0].advice,
    otherDishes: foods.slice(1)
  };
}

module.exports = {
  VIETNAM_PROVINCES_DATA,
  PROVINCE_ALIASES,
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
};

