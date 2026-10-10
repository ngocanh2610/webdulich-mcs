/**
 * CƠ SỞ DỮ LIỆU TRI THỨC DU LỊCH VIỆT NAM TOÀN DIỆN (VIETNAM TOURISM KNOWLEDGE BASE)
 * Dữ liệu huấn luyện chuyên sâu cho Trợ lý AI du lịch 63 tỉnh thành Việt Nam
 * VietnamTourism AI - Đầy đủ 63 tỉnh thành: Miền Bắc, Miền Trung, Tây Nguyên, Miền Nam, Miền Tây
 */

const VIETNAM_PROVINCES_DATA = {
  // ======================= MIỀN BẮC =======================
  'Tam Đảo': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Quảng trường & Thị trấn Tam Đảo', address: 'Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ', cost: 0, costText: 'Tham quan tự do', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Tản bộ ngắm thị trấn sương mờ phong cách Châu Âu; chụp ảnh đài phun nước trung tâm.' },
      { name: 'Nhà thờ Đá Cổ Tam Đảo', address: 'Dốc Tam Đảo, Vĩnh Phúc', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic Pháp cổ bằng đá xanh rêu phong đứng sừng sững trên sườn núi; ngắm toàn cảnh thung lũng.' },
      { name: 'Cầu Mây Tam Đảo (Tổ hợp săn mây)', address: 'Thôn 2, Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Cây cầu đan bằng tre nứa len lỏi giữa biển mây bồng bềnh và đồi hoa dã quỳ rực rỡ.' },
      { name: 'Quán Gió Tam Đảo (Cà phê trên mây)', address: 'Thôn 1, Thị trấn Tam Đảo, Vĩnh Phúc', duration: '2 giờ', cost: 60000, costText: 'Đồ uống: 50.000đ - 80.000đ', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Quán cà phê nhô ra vách đá không có mái che, nơi đón gió ngàn và ngắm biển mây xế chiều.' },
      { name: 'Quần thể Danh thắng Tây Thiên', address: 'Xã Đại Đình, Huyện Tam Đảo, Vĩnh Phúc', duration: '4 giờ', cost: 240000, costText: 'Dự kiến: 240.000đ vé cáp treo khứ hồi', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Miền đất Phật thanh tịnh và Đền Quốc Mẫu Tây Thiên linh thiêng giữa rừng nguyên sinh.' }
    ],
    foods: [
      { name: 'Ngọn su su xào tỏi Tam Đảo', dish: 'Ngọn su su tươi non xào tỏi giòn ngọt', address: 'Khu ẩm thực dốc chợ Tam Đảo', costText: 'Dự kiến: 50.000đ/đĩa', advice: 'Đặc sản trứ danh Tam Đảo, ngọn su su giòn sần sật xào cháy tỏi thơm lừng.' },
      { name: 'Gà đồi Tam Đảo nướng đất sét', dish: 'Gà đồi thả rông nướng than hoa', address: 'Nhà hàng Phố Mây Tam Đảo', costText: 'Dự kiến: 300.000đ - 350.000đ/con', advice: 'Thịt gà săn chắc da vàng óng giòn rụm chấm muối tiêu chanh ớt rừng.' },
      { name: 'Thịt bò tái kiến đốt', dish: 'Bò tươi nướng than hồng thơm the vị kiến', address: 'Trung tâm ẩm thực Tam Đảo', costText: 'Dự kiến: 200.000đ - 300.000đ/đĩa', advice: 'Món ăn độc lạ mang hương vị the thơm đặc trưng của các tổ kiến rừng Tam Đảo.' }
    ],
    hotel: { name: 'Resort / Homestay view mây Tam Đảo', address: 'Khu phố 1 / Khu phố 2, Tam Đảo', price: '600.000đ - 1.400.000đ/đêm' }
  },

  'Hà Nam': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Khu du lịch Chùa Tam Chúc (Ngôi chùa lớn nhất thế giới)', address: 'Thị trấn Ba Sao, Huyện Kim Bảng, Hà Nam', duration: '4 giờ', cost: 200000, costText: 'Dự kiến: 200.000đ vé du thuyền + xe điện', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi thuyền trên hồ Lục Nhạc ngắm 6 ngọn núi nổi bồng bềnh; chiêm bái Điện Tam Thế nguy nga.' },
      { name: 'Đền Trúc - Ngũ Động Thi Sơn', address: 'Thôn Quyển Sơn, Thi Sơn, Kim Bảng, Hà Nam', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Rừng trúc xanh mát rợp bóng bên sông Đáy và 5 hang động đá vôi kỳ bí luồn trong lòng núi.' },
      { name: 'Làng Vũ Đại & Nhà Bá Kiến', address: 'Xã Hòa Hậu, Huyện Lý Nhân, Hà Nam', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi nhà 3 gian gỗ lim hơn 100 năm tuổi nguyên bản của Bá Kiến trong tác phẩm Nam Cao.' },
      { name: 'Chùa Bà Đanh & Núi Ngọc', address: 'Thôn Đanh, Ngọc Sơn, Kim Bảng, Hà Nam', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa cổ tĩnh mịch bên dòng sông Đáy gắn với câu thành ngữ "vắng như chùa Bà Đanh".' }
    ],
    foods: [
      { name: 'Cá kho làng Vũ Đại (Cá kho niêu đất Bá Kiến)', dish: 'Cá trắm đen kho niêu đất 16 tiếng củi nhãn', address: 'Làng Hòa Hậu, Lý Nhân, Hà Nam', costText: 'Dự kiến: 500.000đ - 800.000đ/niêu', advice: 'Thịt cá chắc nịch xương nhừ tơi thấm đẫm riềng, gừng, nước cốt cua đồng ăn cùng cơm nóng.' },
      { name: 'Bánh cuốn chả Phủ Lý', dish: 'Bánh cuốn tráng mỏng chả nướng than hoa', address: 'Đường Trần Phú / Biên Hòa, TP. Phủ Lý', costText: 'Dự kiến: 35.000đ - 50.000đ/suất', advice: 'Ăn nguội cùng nước mắm ấm chua ngọt thả chả thịt nướng xém cạnh thơm nức mũi.' },
      { name: 'Chuối ngự Đại Hoàng', dish: 'Chuối ngự tiến vua vỏ mỏng vàng óng', address: 'Xã Hòa Hậu, Lý Nhân, Hà Nam', costText: 'Dự kiến: 35.000đ - 50.000đ/nải', advice: 'Chuối nhỏ xinh vỏ mỏng ruột vàng, ngọt đậm đà hương thơm tiến vua.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Phủ Lý / Ba Sao', address: 'TP. Phủ Lý / Khu du lịch Tam Chúc, Hà Nam', price: '450.000đ - 950.000đ/đêm' }
  },

  'Hà Nội': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Hồ Hoàn Kiếm & Đền Ngọc Sơn', address: 'Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé vào đền', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Đi cầu Thê Húc son đỏ, ngắm Tháp Rùa cổ kính giữa lòng thủ đô.' },
      { name: 'Văn Miếu - Quốc Tử Giám', address: '58 Quốc Tử Giám, Đống Đa, Hà Nội', duration: '2 giờ', cost: 70000, costText: 'Dự kiến: 70.000đ/vé', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Trường đại học đầu tiên của Việt Nam; chiêm bái 82 bia tiến sĩ vinh danh hiền tài.' },
      { name: 'Lăng Chủ tịch Hồ Chí Minh & Chùa Một Cột', address: 'Số 2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng Lăng', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Mở cửa buổi sáng; trang phục trang nghiêm lịch sự, không mang máy ảnh vào phòng viếng.' },
      { name: 'Phố Cổ 36 Phố Phường', address: 'Hàng Ngang, Hàng Đào, Hoàn Kiếm, Hà Nội', duration: '2 giờ 30 phút', cost: 0, costText: 'Dạo bộ tự do', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', advice: 'Dạo quanh các con phố thủ công cổ kính, thưởng thức cà phê trứng và kem Tràng Tiền.' }
    ],
    foods: [
      { name: 'Phở Bát Đàn', dish: 'Phở bò tái nạm gia truyền', address: '49 Bát Đàn, Hoàn Kiếm, Hà Nội', costText: 'Dự kiến: 60.000đ/bát', advice: 'Nước dùng trong thơm gừng thảo quả, xếp hàng gọi món theo phong cách truyền thống.' },
      { name: 'Bún chả Hương Liên (Bún chả Obama)', dish: 'Bún chả nướng than hoa, nem cua bể', address: '24 Lê Văn Hưu, Phan Chu Trinh, Hai Bà Trưng, Hà Nội', costText: 'Dự kiến: 65.000đ/suất', advice: 'Chả miếng chả băm nướng thơm lừng chấm nước mắm giấm tỏi ớt cà rốt đu đủ.' },
      { name: 'Cà phê Giảng (Cà phê trứng)', dish: 'Cà phê kem trứng nóng', address: '39 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội', costText: 'Dự kiến: 35.000đ/cốc', advice: 'Lớp kem trứng bông mịn béo ngậy quyện vị cà phê đậm đà ra đời từ năm 1946.' }
    ],
    hotel: { name: 'Khách sạn phố cổ Hoàn Kiếm', address: 'Khu vực Phố Cổ / Hồ Gươm, Hà Nội', price: '600.000đ - 1.500.000đ/đêm' }
  },

  'Quảng Ninh': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Vịnh Hạ Long & Du thuyền ngắm vịnh', address: 'TP. Hạ Long, Quảng Ninh', duration: '4 - 6 giờ', cost: 290000, costText: 'Dự kiến: 290.000đ/vé vịnh + tàu', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Kỳ quan thiên nhiên thế giới; tham quan Hang Sửng Sốt, Động Thiên Cung và chèo kayak qua Hang Luồn.' },
      { name: 'Đảo Titop & Bãi tắm', address: 'Vịnh Hạ Long, Quảng Ninh', duration: '2 giờ', cost: 0, costText: 'Bao gồm trong vé vịnh', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Leo 400 bậc đá lên đài quan sát ngắm góc nhìn 360 độ toàn cảnh Vịnh Hạ Long tuyệt mỹ.' },
      { name: 'Bảo tàng Quảng Ninh', address: 'Đường Trần Quốc Nghiễn, Hồng Gai, Hạ Long', duration: '2 giờ', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80', advice: 'Tòa nhà khối kính đen tuyền huyền bí bên bờ vịnh; địa điểm check-in kiến trúc nổi tiếng bậc nhất.' }
    ],
    foods: [
      { name: 'Chả mực giã tay Hạ Long', dish: 'Chả mực chiên vàng, bánh cuốn chả mực', address: 'Chợ Hạ Long 1 / Hòn Gai, Quảng Ninh', costText: 'Dự kiến: 50.000đ - 80.000đ/suất', advice: 'Mực nang tươi giã tay giòn sần sật, chiên vàng ươm ăn kèm xôi trắng hoặc bánh cuốn.' }
    ],
    hotel: { name: 'Khách sạn Bãi Cháy view vịnh Hạ Long', address: 'Khu du lịch Bãi Cháy, TP. Hạ Long', price: '650.000đ - 1.600.000đ/đêm' }
  },

  'Hải Phòng': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Quần đảo Cát Bà & Vịnh Lan Hạ', address: 'Huyện Cát Hải, Hải Phòng', duration: '5 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ/vé tàu vịnh', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Khu dự trữ sinh quyển thế giới; chèo thuyền kayak qua đảo khỉ và làng chài cổ Cái Bèo.' },
      { name: 'Khu du lịch Đồ Sơn & Biển Đồ Sơn', address: 'Quận Đồ Sơn, Hải Phòng', duration: '3 giờ', cost: 0, costText: 'Miễn phí tắm biển', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Tắm biển khu 2 Đồ Sơn, thăm Dinh Bảo Đại và ngọn hải đèo Hòn Dấu.' },
      { name: 'Tuyệt Tình Cốc Hải Phòng', address: 'Xã An Sơn, Thủy Nguyên, Hải Phòng', duration: '2 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Hồ nước xanh biếc màu ngọc bích bao quanh bởi núi đá vôi trắng kỳ ảo.' }
    ],
    foods: [
      { name: 'Bánh đa cua bể Hải Phòng', dish: 'Bánh đa đỏ cua bể, chả lá lốt, tôm nõn', address: 'Đường Trần Phú / Cầu Đất, Hải Phòng', costText: 'Dự kiến: 45.000đ - 65.000đ/bát', advice: 'Sợi bánh đa đỏ dai mềm trong nước dùng ngọt đậm đà gạch cua đồng và cua bể.' },
      { name: 'Bánh mì cay Hải Phòng & Chè thái', dish: 'Bánh mì que pate béo ngậy cay tê', address: 'Cột Đèn / Đinh Tiên Hoàng, Hải Phòng', costText: 'Dự kiến: 5.000đ/chiếc', advice: 'Chấm đẫm tương ớt chí chương gia truyền cay nồng đặc trưng đất Cảng.' },
      { name: 'Cà phê cốt dừa cô Hạnh', dish: 'Cà phê thơm cốt dừa béo ngậy thạch dừa', address: 'Đường Lam Sơn, Lê Chân, Hải Phòng', costText: 'Dự kiến: 30.000đ/ly', advice: 'Thức uống giải nhiệt ngọt béo quyến rũ được giới trẻ săn đón.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Hải Phòng / Cát Bà', address: 'Quận Hồng Bàng / TT Cát Bà, Hải Phòng', price: '500.000đ - 1.200.000đ/đêm' }
  },

  'Ninh Bình': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Quần thể danh thắng Tràng An', address: 'Xã Trường Yên, Huyện Hoa Lư, Ninh Bình', duration: '3 giờ 30 phút', cost: 250000, costText: 'Dự kiến: 250.000đ/vé thuyền', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Di sản thế giới kép UNESCO; ngồi thuyền nan qua các hang động kỳ thú và phim trường Kong.' },
      { name: 'Hang Múa & Đỉnh Ngọa Long', address: 'Thôn Khê Hạ, Ninh Xuân, Hoa Lư, Ninh Bình', duration: '2 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chinh phục gần 500 bậc đá ngắm toàn cảnh thung lũng Tam Cốc và dòng sông Ngô Đồng.' },
      { name: 'Chùa Bái Đính cổ và mới', address: 'Xã Gia Sinh, Huyện Gia Viễn, Ninh Bình', duration: '3 giờ', cost: 60000, costText: 'Dự kiến: 60.000đ/vé xe điện khứ hồi', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể chùa lớn nhất Đông Nam Á với hành lang 500 tượng La Hán và Bảo tháp cao vút.' }
    ],
    foods: [
      { name: 'Thịt dê núi & Cơm cháy Ninh Bình', dish: 'Dê tái chanh, dê nướng tảng, cơm cháy sốt dê', address: 'Đường Tràng An, TP. Ninh Bình', costText: 'Dự kiến: 150.000đ - 250.000đ/người', advice: 'Thịt dê chạy núi đá săn chắc thơm ngọt, cơm cháy giòn rụm chấm nước sốt tim cật béo bùi.' }
    ],
    hotel: { name: 'Resort sinh thái / Homestay Tam Cốc Tràng An', address: 'Khu vực Tràng An / Tam Cốc, Ninh Bình', price: '500.000đ - 1.200.000đ/đêm' }
  },

  'Sa Pa': {
    region: 'Tây Bắc',
    attractions: [
      { name: 'Đỉnh Fansipan & Ga cáp treo Sun World', address: 'Thị xã Sa Pa, Lào Cai', duration: '4 giờ', cost: 850000, costText: 'Dự kiến: 850.000đ/vé cáp treo', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chinh phục Nóc nhà Đông Dương ở độ cao 3.143m; chuẩn bị áo ấm vì đỉnh gió mạnh và rất lạnh.' },
      { name: 'Bản Cát Cát của người H’Mông', address: 'Xã Hoàng Liên, Thị xã Sa Pa, Lào Cai', duration: '3 giờ', cost: 90000, costText: 'Dự kiến: 90.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thuê trang phục dân tộc thổ cẩm chụp ảnh bên cối xay nước, suối Hoa và cầu Si.' },
      { name: 'Đèo Ô Quy Hồ & Cổng Trời Sa Pa', address: 'Tuyến Quốc lộ 4D, ranh giới Lào Cai - Lai Châu', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí ngắm cảnh', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Một trong tứ đại đỉnh đèo Việt Nam; thời điểm ngắm hoàng hôn và biển mây đẹp nhất từ 16:30 - 17:30.' }
    ],
    foods: [
      { name: 'Lẩu cá hồi & cá tầm Sa Pa', dish: 'Lẩu cá tươi sống, rau rừng Tây Bắc', address: 'Đường Xuân Viên / Fansipan, Sa Pa', costText: 'Dự kiến: 400.000đ - 600.000đ/nồi', advice: 'Thịt cá hồi chắc ngọt không ngấy, nhúng cùng măng chua và rau cải mèo đắng nhẹ giòn ngọt.' }
    ],
    hotel: { name: 'Khách sạn view thung lũng Mường Hoa', address: 'Đường Fansipan / Mường Hoa, Sa Pa', price: '600.000đ - 1.500.000đ/đêm' }
  },

  'Hà Giang': {
    region: 'Đông Bắc',
    attractions: [
      { name: 'Cột Cờ Lũng Cú (Cực Bắc Tổ Quốc)', address: 'Xã Lũng Cú, Huyện Đồng Văn, Hà Giang', duration: '2 giờ 30 phút', cost: 25000, costText: 'Dự kiến: 25.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chạm tay vào lá cờ đỏ sao vàng 54m2 biểu trưng cho 54 dân tộc anh em trên đỉnh núi Rồng.' },
      { name: 'Đèo Mã Pí Lèng & Hẻm Tu Sản Sông Nho Quế', address: 'Quốc lộ 4C nối Đồng Văn - Mèo Vạc, Hà Giang', duration: '3 giờ 30 phút', cost: 120000, costText: 'Dự kiến: 120.000đ vé thuyền sông Nho Quế', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Đi thuyền trên dòng sông Nho Quế xanh ngọc bích len qua hẻm vực sâu nhất Đông Nam Á.' },
      { name: 'Dinh Thự Vua Mèo họ Vương', address: 'Xã Sà Phìn, Huyện Đồng Văn, Hà Giang', duration: '1 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc pháo đài độc đáo kết hợp phong cách người Mông, người Hoa và kiến trúc Pháp.' }
    ],
    foods: [
      { name: 'Bánh cuốn trứng Phố Cổ Đồng Văn', dish: 'Bánh cuốn nóng chan nước xương hầm', address: 'Khu phố cổ Đồng Văn, Hà Giang', costText: 'Dự kiến: 35.000đ - 45.000đ/phần', advice: 'Khác biệt với bánh cuốn miền xuôi khi ăn kèm bát nước súp ninh xương ngọt lịm rắc hành hoa.' }
    ],
    hotel: { name: 'Homestay bản địa / Khách sạn Đồng Văn', address: 'Thị trấn Đồng Văn / Mèo Vạc, Hà Giang', price: '300.000đ - 650.000đ/đêm' }
  },

  'Cao Bằng': {
    region: 'Đông Bắc',
    attractions: [
      { name: 'Thác Bản Giốc hùng vĩ', address: 'Xã Đàm Thủy, Huyện Trùng Khánh, Cao Bằng', duration: '3 giờ', cost: 45000, costText: 'Dự kiến: 45.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Thác nước tự nhiên lớn nhất Đông Nam Á nằm giữa biên giới Việt - Trung đẹp tráng lệ.' },
      { name: 'Động Ngườm Ngao', address: 'Bản Gun, Đàm Thủy, Trùng Khánh, Cao Bằng', duration: '2 giờ', cost: 45000, costText: 'Dự kiến: 45.000đ/vé', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Hang động đá vôi kỳ ảo dài hơn 2.000m với nhũ đá hình bông sen vàng rực rỡ.' },
      { name: 'Khu di tích Pác Bó & Suối Lê Nin', address: 'Xã Trường Hà, Hà Quảng, Cao Bằng', duration: '2 giờ 30 phút', cost: 25000, costText: 'Dự kiến: 25.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Dòng suối nước trong vắt màu xanh ngọc bích nơi Bác Hồ từng sống và làm việc.' }
    ],
    foods: [
      { name: 'Bánh cuốn Cao Bằng', dish: 'Bánh cuốn nóng chan canh xương', address: 'Phố cổ TP. Cao Bằng', costText: 'Dự kiến: 35.000đ - 50.000đ/suất', advice: 'Bánh tráng mỏng cuốn nhân thịt băm mộc nhĩ, chan nước canh hầm xương ngọt lịm.' },
      { name: 'Vịt quay 7 vị Cao Bằng', dish: 'Vịt quay da giòn đẫm gia vị mật ong rừng', address: 'Đường Kim Đồng, TP. Cao Bằng', costText: 'Dự kiến: 250.000đ - 300.000đ/con', advice: 'Mùi thơm của lá móc mật và 7 loại thảo mộc rừng Đông Bắc quyến rũ.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Cao Bằng / Trùng Khánh', address: 'TP. Cao Bằng / Bản Giốc', price: '400.000đ - 850.000đ/đêm' }
  },

  'Mộc Châu': {
    region: 'Tây Bắc',
    attractions: [
      { name: 'Đồi Chè Trái Tim Mộc Châu', address: 'Bản Ôn, Thị trấn Nông Trường Mộc Châu, Sơn La', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Đồi chè xanh mướt uốn lượn hình trái tim; địa điểm chụp ảnh lãng mạn bậc nhất cao nguyên.' },
      { name: 'Rừng thông Bản Áng & Vườn dâu tây', address: 'Xã Đông Sang, Mộc Châu, Sơn La', duration: '2 giờ 30 phút', cost: 50000, costText: 'Dự kiến: 50.000đ/vé', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Không gian se lạnh thơ mộng ví như Đà Lạt của Tây Bắc với hồ nước phẳng lặng và đồi thông.' },
      { name: 'Thác Dải Yếm & Cầu Kính Tình Yêu', address: 'Xã Mường Sang, Mộc Châu, Sơn La', duration: '2 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ/vé cầu kính', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Dòng thác đổ trắng xóa như dải yếm lụa của cô gái Thái; cầu kính 5D hiện đại nhìn thung lũng.' }
    ],
    foods: [
      { name: 'Bê chao Mộc Châu', dish: 'Thịt bê non chao dầu nóng mềm ngọt', address: 'Tiểu khu Chiềng Đi / Km 70 Mộc Châu', costText: 'Dự kiến: 150.000đ - 250.000đ/đĩa', advice: 'Thịt bê mềm ngọt đậm đà, bì giòn sần sật chấm cùng nước tương gừng nóng ấm.' },
      { name: 'Cá suối chiên giòn & Ốc đá', dish: 'Cá suối rán giòn rụm nguyên con', address: 'Thị trấn Mộc Châu', costText: 'Dự kiến: 100.000đ/đĩa', advice: 'Cá suối tươi bắt tự nhiên rán vàng giòn chấm mắm ớt rừng thơm phức.' }
    ],
    hotel: { name: 'Resort / Homestay đồi chè Mộc Châu', address: 'Thị trấn Nông Trường Mộc Châu', price: '450.000đ - 1.100.000đ/đêm' }
  },

  'Bắc Ninh': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Chùa Dâu (Cổ tự cổ nhất Việt Nam)', address: 'Xã Thanh Khương, Thuận Thành, Bắc Ninh', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Cái nôi của Phật giáo Việt Nam với tháp Hòa Phong cổ kính rêu phong.' },
      { name: 'Đền Đô (Khu lăng mộ 8 vị vua triều Lý)', address: 'Phường Đình Bảng, Từ Sơn, Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Nơi thờ tự và tưởng niệm các vị hoàng đế nhà Lý trong không gian hồ bán nguyệt linh thiêng.' },
      { name: 'Làng tranh dân gian Đông Hồ', address: 'Xã Song Hồ, Thuận Thành, Bắc Ninh', duration: '2 giờ', cost: 0, costText: 'Tự do trải nghiệm', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Tìm hiểu quy trình in tranh khắc gỗ trên giấy điệp tự nhiên đậm chất văn hóa Kinh Bắc.' }
    ],
    foods: [
      { name: 'Bánh phu thê Đình Bảng', dish: 'Bánh xu xê gói lá chuối nhân đậu xanh dừa', address: 'Phường Đình Bảng, Từ Sơn, Bắc Ninh', costText: 'Dự kiến: 30.000đ - 50.000đ/cặp', advice: 'Vỏ bánh dẻo trong màu vàng hạt dành dành, nhân ngọt bùi thơm hương sen.' },
      { name: 'Nem bùi Ninh Xá', dish: 'Nem thính cuốn lá sung chấm tương ớt', address: 'Xã Ninh Xá, Thuận Thành, Bắc Ninh', costText: 'Dự kiến: 35.000đ/quả', advice: 'Thịt nạc và mỡ thái mỏng trộn thính gạo rang vàng thơm nức chấm tương ớt cay cay.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Bắc Ninh / Từ Sơn', address: 'TP. Bắc Ninh', price: '450.000đ - 900.000đ/đêm' }
  },

  'Nam Định': {
    region: 'Miền Bắc',
    attractions: [
      { name: 'Quần thể Đền Trần Nam Định', address: 'Phường Lộc Vượng, TP. Nam Định', duration: '2 giờ', cost: 0, costText: 'Miễn phí viếng đền', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Nơi phụng thờ các vị vua và công thần vương triều Trần lừng lẫy chiến công hiển hách.' },
      { name: 'Nhà thờ đổ Hải Lý (Xương Điền)', address: 'Xã Hải Lý, Huyện Hải Hậu, Nam Định', duration: '1 giờ 30 phút', cost: 0, costText: 'Tự do ngắm cảnh biển', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc nhà thờ cổ bị biển xâm lấn đứng trơ trọi bên bờ cát; điểm ngắm bình minh tuyệt mỹ.' },
      { name: 'Chùa Cổ Lễ & Tháp Cửu Phẩm Liên Hoa', address: 'Thị trấn Cổ Lễ, Trực Ninh, Nam Định', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc độc đáo hòa quyện Phật giáo cổ truyền và phong cách Gothic phương Tây.' }
    ],
    foods: [
      { name: 'Phở bò gia truyền Nam Định', dish: 'Phở bò tái lăn nước dùng ngọt tủy xương', address: 'Đường Hàng Tiện / Điện Biên, TP. Nam Định', costText: 'Dự kiến: 40.000đ - 60.000đ/bát', advice: 'Cái nôi sinh ra món phở bò Việt Nam với nước lèo thơm gừng nướng và thảo quả gia truyền.' },
      { name: 'Bánh xíu páo Nam Định', dish: 'Bánh nướng nhân thịt xá xíu trứng cút', address: 'Đường Lê Hồng Phong / Hoàng Văn Thụ, Nam Định', costText: 'Dự kiến: 10.000đ/chiếc', advice: 'Vỏ bánh nhiều lớp giòn xốp thơm lừng bọc nhân thịt béo ngậy ăn khi vừa ra lò.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Nam Định', address: 'Đường Đông A / Lê Hồng Phong, Nam Định', price: '400.000đ - 850.000đ/đêm' }
  },

  // ======================= MIỀN TRUNG & TÂY NGUYÊN =======================
  'Đà Nẵng': {
    region: 'Miền Trung',
    attractions: [
      { name: 'Bãi Tắm Biển Mỹ Khê', address: 'Đường Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng', duration: '2 giờ', cost: 0, costText: 'Miễn phí tắm biển', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát trắng thoai thoải, thích hợp tắm biển buổi sáng sớm hoặc chiều mát.' },
      { name: 'Cổng Chùa Linh Ứng - Bán đảo Sơn Trà', address: 'Bãi Bụt, Thọ Quang, Sơn Trà, Đà Nẵng', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Chiêm bái tượng Phật Bà Quan Âm cao 67m hướng ra biển cả bao la.' },
      { name: 'Cầu Rồng & Cầu Tình Yêu', address: 'Nguyễn Văn Linh giao Trần Hưng Đạo, Hải Châu, Đà Nẵng', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí dạo phố', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80', advice: 'Xem biểu diễn phun lửa và phun nước vào 21:00 tối thứ 7 & Chủ Nhật hàng tuần.' },
      { name: 'Sun World Bà Nà Hills & Cầu Vàng', address: 'Hòa Ninh, Hòa Vang, Đà Nẵng', duration: '6 giờ', cost: 900000, costText: 'Dự kiến: 900.000đ/vé cáp treo', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Nên đi sớm trước 8:00 để chụp ảnh Cầu Vàng trong sương sớm; mang theo áo khoác mỏng.' }
    ],
    foods: [
      { name: 'Mỳ Quảng Bà Mua', dish: 'Mỳ Quảng tôm thịt, ếch, gà ta', address: '19 Trần Bình Trọng, Hải Châu, Đà Nẵng', costText: 'Dự kiến: 50.000đ - 70.000đ/tô', advice: 'Ăn kèm rau sống non, bẻ bánh tráng mè giòn rụm và thêm ớt xanh cay nồng.' },
      { name: 'Hải sản Bé Mặn / Năm Đảnh', dish: 'Ghẹ hấp, tôm nướng muối ớt, mực một nắng', address: 'Lô 11 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', costText: 'Dự kiến: 250.000đ - 400.000đ/người', advice: 'Hải sản tươi sống chọn tại bể, nêm nếm đậm đà ăn sát bờ biển mát rượi.' }
    ],
    hotel: { name: 'Khách sạn ven biển Mỹ Khê', address: 'Đường Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', price: '600.000đ - 1.200.000đ/đêm' }
  },

  'Hội An': {
    region: 'Miền Trung',
    attractions: [
      { name: 'Phố Cổ Hội An & Chùa Cầu', address: 'Đường Trần Phú, Minh An, Hội An, Quảng Nam', duration: '3 giờ', cost: 120000, costText: 'Dự kiến: 120.000đ/vé di tích', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80', advice: 'Ngắm đèn lồng lung linh khi hoàng hôn buông xuống; đi thuyền thả hoa đăng trên sông Hoài.' },
      { name: 'Rừng dừa Bảy Mẫu Cẩm Thanh', address: 'Cẩm Thanh, TP. Hội An, Quảng Nam', duration: '2 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ/thúng 2 người', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Ngồi thuyền thúng ngắm dừa nước và xem nghệ nhân biểu diễn quay thúng độc đáo.' }
    ],
    foods: [
      { name: 'Cơm gà Bà Buội', dish: 'Cơm gà xé gia truyền', address: '22 Phan Chu Trinh, Hội An', costText: 'Dự kiến: 55.000đ/dĩa', advice: 'Hạt cơm nấu nước luộc gà vàng ươm, thịt gà ta xé ngọt chắc rắc lá chanh thái mỏng.' },
      { name: 'Cao lầu Thanh', dish: 'Cao lầu thịt xíu da heo giòn', address: '26 Thái Phiên, Minh An, Hội An', costText: 'Dự kiến: 40.000đ/bát', advice: 'Sợi mì thơm dai giòn ngâm tro củi cù lao Chàm ăn kèm thịt xíu mềm đậm đà.' }
    ],
    hotel: { name: 'Resort / Homestay phố cổ Hội An', address: 'Đường Cửa Đại / Hai Bà Trưng, Hội An', price: '600.000đ - 1.800.000đ/đêm' }
  },

  'Huế': {
    region: 'Miền Trung',
    attractions: [
      { name: 'Đại Nội Huế (Hoàng Thành)', address: 'Đường 23/8, Thuận Hòa, TP. Huế', duration: '3 giờ', cost: 200000, costText: 'Dự kiến: 200.000đ/vé', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể cung điện triều Nguyễn nguy nga; có thể thuê cổ phục Việt để chụp ảnh.' },
      { name: 'Chùa Thiên Mụ & Sông Hương', address: 'Đồi Hà Khê, Kim Long, TP. Huế', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí viếng chùa', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngôi chùa cổ soi bóng dòng sông Hương; kết hợp đi thuyền rồng nghe ca Huế buổi tối.' },
      { name: 'Lăng Khải Định & Lăng Tự Đức', address: 'Xã Thủy Bằng, Hương Thủy, Thừa Thiên Huế', duration: '2 giờ 30 phút', cost: 150000, costText: 'Dự kiến: 150.000đ/vé lăng', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc giao thoa Đông - Tây tuyệt mỹ với nghệ thuật ghép sành sứ tinh xảo đỉnh cao.' }
    ],
    foods: [
      { name: 'Bún bò Huế Mụ Rơi', dish: 'Bún bò bắp giò chả cua', address: '40 Nguyễn Chí Diễu, Thuận Thành, Huế', costText: 'Dự kiến: 45.000đ/tô', advice: 'Nước dùng nồng thơm sả ruốc, viên chả cua vàng ươm giòn ngọt.' },
      { name: 'Bánh bèo, nậm, lọc bà Đỏ', dish: 'Mẹt bánh Huế chấm nước mắm ớt cay', address: '8 Nguyễn Bỉnh Khiêm, Phú Cát, Huế', costText: 'Dự kiến: 50.000đ - 80.000đ/mẹt', advice: 'Bánh bèo chén tôm cháy giòn rụm, bánh lọc gói lá chuối tôm thịt đậm vị cung đình.' }
    ],
    hotel: { name: 'Khách sạn bờ Nam sông Hương', address: 'Đường Lê Lợi, TP. Huế', price: '500.000đ - 1.500.000đ/đêm' }
  },

  'Đà Lạt': {
    region: 'Tây Nguyên',
    attractions: [
      { name: 'Quảng trường Lâm Viên & Hồ Xuân Hương', address: 'Đường Trần Quốc Toản, Phường 1, TP. Đà Lạt', duration: '2 giờ', cost: 0, costText: 'Miễn phí dạo chơi', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Chụp ảnh với biểu tượng Nụ hoa Atiso & Bông hoa Dã Quỳ khổng lồ; dạo quanh bờ hồ se lạnh.' },
      { name: 'Đỉnh Núi Langbiang', address: 'Thị trấn Lạc Dương, Huyện Lạc Dương, Lâm Đồng', duration: '3 giờ', cost: 50000, costText: 'Dự kiến: 50.000đ/vé + 120.000đ xe Jeep', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Đi xe Jeep cảm giác mạnh lên đỉnh radar ngắm trọn vẹn suối Vàng suối Bạc mờ sương.' },
      { name: 'Thác Datanla & Máng trượt Alpine Coaster', address: 'Đèo Prenn, Quốc lộ 20, Phường 3, Đà Lạt', duration: '2 giờ 30 phút', cost: 200000, costText: 'Dự kiến: 200.000đ/vé máng trượt', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Trải nghiệm hệ thống máng trượt xuyên qua rừng thông dài nhất Đông Nam Á.' },
      { name: 'Đồi Chè Cầu Đất & Săn Mây', address: 'Thôn Trường Thọ, Trạm Hành, TP. Đà Lạt', duration: '3 giờ', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Nên dậy từ 5:00 sáng để đón biển mây bồng bềnh và ngắm cánh đồng điện gió.' }
    ],
    foods: [
      { name: 'Lẩu gà lá é Tao Ngộ', dish: 'Lẩu gà lá é cay nồng ớt hiểm', address: 'Số 5 Đường 3/4, Phường 3, TP. Đà Lạt', costText: 'Dự kiến: 250.000đ - 350.000đ/nồi', advice: 'Nồi lẩu nóng bốc khói, lá é the mát hòa quyện vị cay ấm sực cơ thể.' },
      { name: 'Bánh ướt lòng gà Long', dish: 'Bánh ướt lòng gà trứng non trộn gỏi', address: 'Hẻm 202 Phan Đình Phùng, Phường 2, Đà Lạt', costText: 'Dự kiến: 40.000đ - 60.000đ/tô', advice: 'Bánh ướt mềm mượt ăn kèm thịt gà xé, lòng heo giòn sần sật và nước mắm chua ngọt.' }
    ],
    hotel: { name: 'Khách sạn / Homestay ngắm thung lũng Đà Lạt', address: 'Khu trung tâm / đồi Dã Chiến, Đà Lạt', price: '500.000đ - 1.100.000đ/đêm' }
  },

  'Nha Trang': {
    region: 'Nam Trung Bộ',
    attractions: [
      { name: 'Bãi biển Nha Trang & Đường Trần Phú', address: 'Đường Trần Phú, TP. Nha Trang, Khánh Hòa', duration: '2 giờ', cost: 0, costText: 'Miễn phí tắm biển', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Con đường ven biển đẹp bậc nhất Việt Nam với hàng dừa rợp bóng và dải cát vàng thoai thoải.' },
      { name: 'Tháp Bà Ponagar', address: '2 Tháng 4, Vĩnh Phước, TP. Nha Trang', duration: '1 giờ 30 phút', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Quần thể tháp Chăm Pa cổ kính trên đồi Cu Lao hướng ra cửa sông Cái; xem múa Chăm truyền thống.' },
      { name: 'VinWonders Nha Trang (Đảo Hòn Tre)', address: 'Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang', duration: '6 giờ', cost: 800000, costText: 'Dự kiến: 800.000đ vé cáp treo + vui chơi', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Thiên đường giải trí đẳng cấp quốc tế với công viên nước, show Tata biểu diễn triệu đô.' }
    ],
    foods: [
      { name: 'Nem nướng Đặng Văn Quyên', dish: 'Nem nướng Ninh Hòa, ram giòn, nước chấm sền sệt', address: '16A Lãn Ông, Xương Huân, Nha Trang', costText: 'Dự kiến: 60.000đ - 90.000đ/phần', advice: 'Cuốn bánh tráng với xoài chua, dưa leo, rau thơm và chấm đẫm sốt thịt tôm béo ngậy.' }
    ],
    hotel: { name: 'Khách sạn view biển Trần Phú Nha Trang', address: 'Đường Trần Phú / Hùng Vương, Nha Trang', price: '550.000đ - 1.400.000đ/đêm' }
  },

  'Quy Nhơn': {
    region: 'Miền Trung',
    attractions: [
      { name: 'Bãi biển Kỳ Co & Đảo Kỳ Co', address: 'Xã Nhơn Lý, TP. Quy Nhơn, Bình Định', duration: '4 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ vé vào cổng + cano', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Được mệnh danh là Maldives của Việt Nam với làn nước trong vắt 2 màu xanh ngọc bích.' },
      { name: 'Eo Gió (Con đường ven biển đẹp ngút ngàn)', address: 'Thôn Lý Lương, Nhơn Lý, Quy Nhơn', duration: '2 giờ', cost: 25000, costText: 'Dự kiến: 25.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Cung đường đi bộ ven vách núi đá dựng đứng uốn lượn sát bờ biển lộng gió.' },
      { name: 'Tháp Đôi Chăm Pa Quy Nhơn', address: 'Đường Trần Hưng Đạo, Đống Đa, Quy Nhơn', duration: '1 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Hai tòa tháp Chăm cổ sừng sững giữa lòng thành phố với hoa văn chạm khắc tinh xảo.' }
    ],
    foods: [
      { name: 'Bánh hỏi lòng heo Quy Nhơn', dish: 'Bánh hỏi rắc lá hẹ kèm đĩa lòng heo nóng hổi', address: 'Đường Diên Hồng / Ngô Mây, Quy Nhơn', costText: 'Dự kiến: 40.000đ - 60.000đ/phần', advice: 'Bánh hỏi mềm mịn ăn kèm bát cháo lòng ấm bụng và chén nước mắm ớt cay tê.' },
      { name: 'Bún chả cá Quy Nhơn', dish: 'Bún chả cá thu dai ngọt, nước dùng dứa cà chua', address: 'Đường Nguyễn Huệ, TP. Quy Nhơn', costText: 'Dự kiến: 35.000đ - 50.000đ/tô', advice: 'Chả cá quết nhuyễn chiên vàng và hấp giòn ngọt đậm đà vị cá biển tươi.' }
    ],
    hotel: { name: 'Khách sạn / Resort ven biển Quy Nhơn', address: 'Đường An Dương Vương / Xuân Diệu, Quy Nhơn', price: '500.000đ - 1.300.000đ/đêm' }
  },

  'Phú Yên': {
    region: 'Miền Trung',
    attractions: [
      { name: 'Gành Đá Đĩa kỳ quan thiên nhiên', address: 'Xã An Ninh Đông, Huyện Tuy An, Phú Yên', duration: '2 giờ 30 phút', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Hiện tượng địa chất hiếm có với hàng vạn cột đá bazan hình lăng trụ xếp chồng lên nhau.' },
      { name: 'Bãi Xép - Ghềnh Ông (Hoa vàng trên cỏ xanh)', address: 'Xã An Chấn, Huyện Tuy An, Phú Yên', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Đồi cỏ xanh mướt mọc đầy xương rồng nhô ra biển sóng vỗ rì rào trong phim điện ảnh nổi tiếng.' },
      { name: 'Hải Đăng Mũi Điện - Đại Lãnh', address: 'Xã Hòa Tâm, Thị xã Đông Hòa, Phú Yên', duration: '2 giờ 30 phút', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Nơi đón ánh bình minh đầu tiên trên đất liền của Tổ Quốc; ngắm Bãi Môn cát vàng thoai thoải.' }
    ],
    foods: [
      { name: 'Mắt cá ngừ đại dương hầm thuốc bắc', dish: 'Mắt cá ngừ thố đất nghi ngút khói', address: 'Đường Lê Duẩn / Bạch Đằng, TP. Tuy Hòa', costText: 'Dự kiến: 50.000đ/thố', advice: 'Món ăn đại bổ béo ngậy hầm cùng táo tàu, kỷ tử và ớt hiểm thơm cay nồng ấm.' },
      { name: 'Bò một nắng muối kiến vàng', dish: 'Thịt bò tơ nướng chấm muối ớt kiến rừng chua cay', address: 'Đường Hùng Vương, Tuy Hòa, Phú Yên', costText: 'Dự kiến: 180.000đ - 250.000đ/đĩa', advice: 'Thịt bò phơi một nắng dẻo thơm nướng than hoa xé sợi chấm vị chua the độc lạ.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Tuy Hòa view biển', address: 'Đường Hùng Vương / Độc Lập, Tuy Hòa', price: '450.000đ - 1.000.000đ/đêm' }
  },

  'Quảng Bình': {
    region: 'Miền Trung',
    attractions: [
      { name: 'Động Phong Nha & Vườn quốc gia Phong Nha - Kẻ Bàng', address: 'Thị trấn Phong Nha, Bố Trạch, Quảng Bình', duration: '4 giờ', cost: 150000, costText: 'Dự kiến: 150.000đ vé vào động + thuyền', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Di sản thiên nhiên thế giới; đi thuyền ngược dòng sông Son vào lòng động thạch nhũ lung linh.' },
      { name: 'Động Thiên Đường (Hoàng cung trong lòng đất)', address: 'Km 16 đường Hồ Chí Minh nhánh Tây, Bố Trạch', duration: '3 giờ 30 phút', cost: 250000, costText: 'Dự kiến: 250.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Hang động khô dài nhất Châu Á với hệ thống cầu gỗ 1km dẫn qua các khối thạch nhũ tráng lệ.' },
      { name: 'Suối Nước Moọc sinh thái', address: 'Đường Hồ Chí Minh nhánh Tây, Bố Trạch, Quảng Bình', duration: '2 giờ 30 phút', cost: 80000, costText: 'Dự kiến: 80.000đ/vé', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Dòng suối trong veo xanh ngắt mát lạnh giữa rừng nguyên sinh; chèo kayak và tắm suối sảng khoái.' }
    ],
    foods: [
      { name: 'Cháo canh cá lóc Quảng Bình', dish: 'Cháo canh sợi bột gạo cá lóc chiên giòn ram', address: 'Đường Hai Bà Trưng, Đồng Hới, Quảng Bình', costText: 'Dự kiến: 35.000đ - 50.000đ/bát', advice: 'Ăn kèm ram giòn (nem rán) cắn ngập miệng ngâm vào nước dùng cay nồng hành hoa.' }
    ],
    hotel: { name: 'Khách sạn bờ biển Nhật Lệ / Phong Nha', address: 'Đường Trương Pháp, TP. Đồng Hới', price: '450.000đ - 1.200.000đ/đêm' }
  },

  'Kon Tum': {
    region: 'Tây Nguyên',
    attractions: [
      { name: 'Thị trấn Măng Đen (Đà Lạt thứ hai)', address: 'Huyện Kon Plông, Tỉnh Kon Tum', duration: '4 giờ', cost: 0, costText: 'Khám phá tự do', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Cao nguyên thông xanh ngắt ở độ cao 1.200m quanh năm se lạnh với hoa anh đào và biển mây.' },
      { name: 'Thác Pa Sỹ Măng Đen', address: 'Xã Măng Cành, Kon Plông, Kon Tum', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Dòng thác trắng xóa đổ xuống hồ nước trong lành giữa thung lũng nguyên sinh xanh thẳm.' },
      { name: 'Nhà thờ Gỗ Kon Tum hơn 100 năm tuổi', address: 'Đường Nguyễn Huệ, Thống Nhất, TP. Kon Tum', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Roman kết hợp nhà sàn dân tộc Ba Na dựng hoàn toàn bằng gỗ cà chít.' }
    ],
    foods: [
      { name: 'Gà nướng cơm lam Măng Đen', dish: 'Gà đồi ướp lá tiêu rừng nướng than, cơm lam dẻo thơm', address: 'Quốc lộ 24, Thị trấn Măng Đen', costText: 'Dự kiến: 250.000đ - 300.000đ/con', advice: 'Thịt gà giòn da ngọt thịt chấm muối ớt sả ăn kèm cơm nếp nướng ống nứa.' }
    ],
    hotel: { name: 'Homestay / Khách sạn thông reo Măng Đen', address: 'Khu du lịch sinh thái Măng Đen', price: '400.000đ - 900.000đ/đêm' }
  },

  'Đắk Lắk': {
    region: 'Tây Nguyên',
    attractions: [
      { name: 'Bảo tàng Thế giới Cà phê Trung Nguyên', address: 'Đường Nguyễn Đình Chiểu, Tân Lợi, Buôn Ma Thuột', duration: '2 giờ 30 phút', cost: 150000, costText: 'Dự kiến: 150.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Công trình kiến trúc nhà dài Tây Nguyên uốn cong hiện đại với hàng vạn hiện vật cà phê thế giới.' },
      { name: 'Cụm thác Dray Nur - Dray Sap', address: 'Xã Dray Sáp, Krông Ana, Đắk Lắk', duration: '3 giờ', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Thác nước hùng vĩ bậc nhất Tây Nguyên trên dòng sông Sêrêpôk huyền thoại.' },
      { name: 'Khu du lịch Buôn Đôn & Cầu treo', address: 'Xã Krông Na, Huyện Buôn Đôn, Đắk Lắk', duration: '3 giờ', cost: 40000, costText: 'Dự kiến: 40.000đ/vé', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Đi cầu treo bằng tre đan xuyên qua rặng si cổ thụ; tìm hiểu văn hóa voi và nhà rông Tây Nguyên.' }
    ],
    foods: [
      { name: 'Bún đỏ Buôn Ma Thuột', dish: 'Bún đỏ sợi to gạch cua trứng cút', address: 'Đường Phan Đình Giót / Lê Hồng Phong, Buôn Ma Thuột', costText: 'Dự kiến: 35.000đ/tô', advice: 'Màu đỏ gạch tôm cua hạt điều tự nhiên, ăn kèm rau cần nước giòn ngọt.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Buôn Ma Thuột', address: 'Đường Nguyễn Tất Thành / Phan Chu Trinh', price: '450.000đ - 1.000.000đ/đêm' }
  },

  // ======================= MIỀN NAM & MIỀN TÂY =======================
  'Phú Quốc': {
    region: 'Miền Nam',
    attractions: [
      { name: 'Bãi Sao Phú Quốc', address: 'Ấp Bãi Sao, An Thới, TP. Phú Quốc', duration: '3 giờ', cost: 0, costText: 'Miễn phí tắm biển', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Bãi cát trắng mịn như kem và mặt biển phẳng lặng ngọc bích; tha hồ chụp ảnh xích đu cây dừa.' },
      { name: 'Thị trấn Hoàng Hôn & Cầu Hôn (Kiss Bridge)', address: 'Bờ Tây Nam đảo, An Thới, Phú Quốc', duration: '2 giờ 30 phút', cost: 100000, costText: 'Dự kiến: 100.000đ/vé Cầu Hôn', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Điểm ngắm hoàng hôn biển lộng lẫy nhất Phú Quốc với kiến trúc phong cách Địa Trung Hải rực rỡ.' },
      { name: 'Cáp treo Hòn Thơm vượt biển', address: 'Ga An Thới, An Thới, Phú Quốc', duration: '4 giờ', cost: 650000, costText: 'Dự kiến: 650.000đ/vé cáp treo + công viên nước', image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop&q=80', advice: 'Tuyến cáp treo 3 dây vượt biển dài gần 7.900m ngắm toàn cảnh làng chài Nam đảo từ trên cao.' }
    ],
    foods: [
      { name: 'Bún quậy Kiến Xây', dish: 'Bún quậy tôm mực chả cá tươi rói', address: '28 Bạch Đằng, Dương Đông, Phú Quốc', costText: 'Dự kiến: 55.000đ - 75.000đ/tô', advice: 'Tự pha chế nước chấm muối tiêu ớt quất thơm nồng theo sở thích trước khi thưởng thức.' },
      { name: 'Hải sản Làng chài Hàm Ninh', dish: 'Ghẹ Hàm Ninh hấp bia, nhum biển nướng mỡ hành', address: 'Làng chài Hàm Ninh, Phú Quốc', costText: 'Dự kiến: 250.000đ - 400.000đ/người', advice: 'Ghẹ thịt chắc nịch gạch son ngọt ngào, chấm muối tiêu chanh Phú Quốc chính gốc.' }
    ],
    hotel: { name: 'Resort nghỉ dưỡng ven biển Phú Quốc', address: 'Bãi Trường / Bãi Dài / An Thới, Phú Quốc', price: '800.000đ - 2.500.000đ/đêm' }
  },

  'TP. Hồ Chí Minh': {
    region: 'Miền Nam',
    attractions: [
      { name: 'Dinh Độc Lập', address: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP.HCM', duration: '2 giờ', cost: 65000, costText: 'Dự kiến: 65.000đ/vé', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', advice: 'Chứng tích lịch sử thống nhất đất nước 30/4/1975 với kiến trúc độc đáo.' },
      { name: 'Nhà thờ Đức Bà & Bưu điện Trung tâm', address: 'Công xã Paris, Bến Nghé, Quận 1, TP.HCM', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', advice: 'Kiến trúc Gothic cổ điển xây dựng từ thời Pháp thuộc giữa trung tâm Sài Gòn.' },
      { name: 'Phố đi bộ Nguyễn Huệ & Bến Bạch Đằng', address: 'Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM', duration: '2 giờ', cost: 0, costText: 'Dạo chơi tự do', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Ngắm nhìn các tòa tháp chọc trời và trải nghiệm xe bus đường sông Saigon Waterbus ngắm hoàng hôn.' }
    ],
    foods: [
      { name: 'Cơm tấm Ba Ghiền', dish: 'Cơm tấm sườn bì chả khổng lồ', address: '84 Đặng Văn Ngữ, Phú Nhuận, TP.HCM', costText: 'Dự kiến: 95.000đ/dĩa', advice: 'Miếng sườn nướng mật ong thơm phức che kín mặt dĩa, ăn kèm mỡ hành tóp mỡ béo bùi.' }
    ],
    hotel: { name: 'Khách sạn trung tâm Quận 1 Sài Gòn', address: 'Quận 1 / Quận 3, TP.HCM', price: '700.000đ - 2.000.000đ/đêm' }
  },

  'Vũng Tàu': {
    region: 'Miền Nam',
    attractions: [
      { name: 'Tượng Chúa Kitô Vua đỉnh Núi Nhỏ', address: 'Đường Thùy Vân, Phường 2, TP. Vũng Tàu', duration: '2 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Leo gần 800 bậc thang lên đỉnh tượng phóng tầm mắt ôm trọn biển Đông lộng gió.' },
      { name: 'Mũi Nghinh Phong & Cổng Trời', address: 'Số 1 Hạ Long, Phường 2, TP. Vũng Tàu', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí dạo mát', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Mũi đất vươn dài đón gió biển trước mặt là biển xanh ngắt sau lưng là núi đồi trập trùng.' },
      { name: 'Ngọn Hải Đăng Vũng Tàu cổ', address: 'Đỉnh núi Nhỏ, Phường 2, TP. Vũng Tàu', duration: '1 giờ 30 phút', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Ngọn hải đăng cổ xưa nhất Đông Nam Á sơn trắng cổ điển; đường lên rợp bóng hoa phượng đỏ và hoa giấy.' }
    ],
    foods: [
      { name: 'Bánh khọt Gốc Vú Sữa', dish: 'Bánh khọt tôm tươi giòn rụm rắc bột tôm cháy', address: '14 Nguyễn Trường Tộ, Phường 2, Vũng Tàu', costText: 'Dự kiến: 65.000đ - 80.000đ/dĩa', advice: 'Cuốn rau cải xanh, xà lách, đu đủ chua và chấm nước mắm pha ấm vừa miệng.' },
      { name: 'Lẩu cá đuối Trương Công Định', dish: 'Lẩu cá đuối măng chua cay nồng ấm bụng', address: '40 Trương Công Định, Phường 3, Vũng Tàu', costText: 'Dự kiến: 200.000đ - 300.000đ/nồi', advice: 'Thịt cá đuối mềm ngọt sụn giòn sần sật nhúng ngập nước lẩu me măng chua.' }
    ],
    hotel: { name: 'Khách sạn view Bãi Sau / Bãi Trước Vũng Tàu', address: 'Đường Thùy Vân / Hạ Long, Vũng Tàu', price: '500.000đ - 1.300.000đ/đêm' }
  },

  'Tây Ninh': {
    region: 'Miền Nam',
    attractions: [
      { name: 'Quần thể Núi Bà Đen (Nóc nhà Nam Bộ 986m)', address: 'Xã Thạnh Tân, TP. Tây Ninh', duration: '5 giờ', cost: 400000, costText: 'Dự kiến: 400.000đ vé cáp treo đỉnh + chùa', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Chiêm bái tượng Phật Bà Tây Bổ Đà Sơn bằng đồng cao nhất Châu Á giữa biển mây hùng vĩ.' },
      { name: 'Tòa Thánh Cao Đài Tây Ninh', address: 'Phạm Hộ Pháp, Thị xã Hòa Thành, Tây Ninh', duration: '2 giờ', cost: 0, costText: 'Miễn phí tham quan', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Thánh địa tôn giáo Cao Đài lộng lẫy với các cột rồng sơn màu rực rỡ và biểu tượng Thiên Nhãn.' }
    ],
    foods: [
      { name: 'Bò tơ Tây Ninh Năm Sánh', dish: 'Bò tơ nướng tảng cuốn rau rừng bánh tráng', address: 'Đường 30/4, Phường 2, TP. Tây Ninh', costText: 'Dự kiến: 150.000đ - 250.000đ/người', advice: 'Thịt bò tơ mềm ngọt đậm đà cuốn cùng hơn chục loại rau rừng sông Vàm Cỏ.' },
      { name: 'Bánh tráng phơi sương Trảng Bàng', dish: 'Bánh tráng phơi sương cuốn thịt luộc rau rừng', address: 'Quốc lộ 22, Thị xã Trảng Bàng, Tây Ninh', costText: 'Dự kiến: 80.000đ/suất', advice: 'Bánh tráng dẻo dai hứng sương đêm ăn kèm mắm nêm đậm đà chuẩn vị phương Nam.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Tây Ninh', address: 'Đường 30/4 / Cách Mạng Tháng 8, Tây Ninh', price: '450.000đ - 900.000đ/đêm' }
  },

  'Cần Thơ': {
    region: 'Miền Tây',
    attractions: [
      { name: 'Chợ Nổi Cái Răng sáng sớm', address: 'Sông Cần Thơ, Quận Cái Răng, Cần Thơ', duration: '3 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ vé tàu ghép', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Nên đi từ 5:30 sáng để ngắm cảnh mua bán nhộn nhịp trên sông và ăn tô hủ tiếu nóng bốc khói.' },
      { name: 'Bến Ninh Kiều & Cầu Đi Bộ Tình Yêu', address: 'Đường Hai Bà Trưng, Tân An, Ninh Kiều, Cần Thơ', duration: '2 giờ', cost: 0, costText: 'Miễn phí dạo phố', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', advice: 'Biểu tượng của Tây Đô; buổi tối lên đèn rực rỡ soi bóng dòng sông Hậu hiền hòa.' }
    ],
    foods: [
      { name: 'Bánh xèo Mười Xiềm / Bánh cống', dish: 'Bánh xèo củ hủ dừa tép sông', address: '13/3 Nguyễn Chí Thanh, Bình Thủy, Cần Thơ', costText: 'Dự kiến: 60.000đ - 90.000đ/cái', advice: 'Vỏ bánh mỏng giòn rụm, nhân củ hủ dừa ngọt bùi chấm nước mắm chua ngọt đặc sản miền Tây.' }
    ],
    hotel: { name: 'Khách sạn trung tâm Bến Ninh Kiều', address: 'Quận Ninh Kiều, TP. Cần Thơ', price: '450.000đ - 1.000.000đ/đêm' }
  },

  'An Giang': {
    region: 'Miền Tây',
    attractions: [
      { name: 'Rừng tràm Trà Sư', address: 'Xã Văn Giáo, Huyện Tịnh Biên, An Giang', duration: '3 giờ', cost: 100000, costText: 'Dự kiến: 100.000đ vé xuồng tắc ráng', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', advice: 'Đi thuyền lướt trên thảm bèo cám xanh mướt ngắm các loài chim nước quý hiếm đậu rợp ngọn tràm.' },
      { name: 'Miếu Bà Chúa Xứ Núi Sam', address: 'Phường Núi Sam, TP. Châu Đốc, An Giang', duration: '2 giờ', cost: 20000, costText: 'Dự kiến: 20.000đ/vé', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', advice: 'Điểm du lịch tâm linh linh thiêng bậc nhất Tây Nam Bộ; khách thập phương đổ về cầu an tài lộc.' }
    ],
    foods: [
      { name: 'Bún cá Châu Đốc', dish: 'Bún cá nghệ tươi chả lụa cá lóc đồng', address: 'Đường Lê Công Thành, Châu Đốc, An Giang', costText: 'Dự kiến: 35.000đ/tô', advice: 'Thịt cá lóc xào nghệ vàng thơm ngọt ăn kèm đĩa bông điên điển và rau nhút giòn sần sật.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Châu Đốc / Núi Sam', address: 'TP. Châu Đốc, An Giang', price: '400.000đ - 900.000đ/đêm' }
  },

  'Cà Mau': {
    region: 'Miền Tây',
    attractions: [
      { name: 'Cột mốc Tọa độ Quốc gia Đất Mũi (GPS 0001)', address: 'Xã Đất Mũi, Huyện Ngọc Hiển, Cà Mau', duration: '3 giờ', cost: 30000, costText: 'Dự kiến: 30.000đ/vé', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', advice: 'Điểm cực Nam của Tổ Quốc; chụp ảnh biểu tượng mũi tàu Cà Mau no gió hướng ra biển khơi.' },
      { name: 'Vườn Quốc gia U Minh Hạ', address: 'Ấp Vồ Dơi, Trần Hợi, Trần Văn Thời, Cà Mau', duration: '3 giờ', cost: 25000, costText: 'Dự kiến: 25.000đ/vé', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', advice: 'Rừng tràm bạt ngàn trên vùng đất than bùn; trải nghiệm gác kèo ong lấy mật ong rừng tràm nguyên chất.' }
    ],
    foods: [
      { name: 'Cua biển Cà Mau Năm Căn', dish: 'Cua gạch Năm Căn hấp bia, rang me, nướng mọi', address: 'Đường Phan Ngọc Hiển, TP. Cà Mau', costText: 'Dự kiến: 350.000đ - 550.000đ/kg', advice: 'Cua Cà Mau nổi tiếng cả nước với thịt chắc nịch thơm ngọt và gạch son béo bùi khó cưỡng.' }
    ],
    hotel: { name: 'Khách sạn trung tâm TP. Cà Mau / Đất Mũi', address: 'Đường Phan Ngọc Hiển, TP. Cà Mau', price: '450.000đ - 950.000đ/đêm' }
  }
};

/**
 * Danh sách đồng nghĩa và từ khóa nhận diện toàn bộ 63 tỉnh thành & địa danh du lịch Việt Nam
 */
const PROVINCE_ALIASES = {
  // Tam Đảo / Vĩnh Phúc
  'tam đảo': 'Tam Đảo', 'tam dao': 'Tam Đảo', 'vĩnh phúc': 'Tam Đảo', 'vinh phuc': 'Tam Đảo', 'tây thiên': 'Tam Đảo', 'đại lải': 'Tam Đảo',
  // Hà Nam
  'hà nam': 'Hà Nam', 'ha nam': 'Hà Nam', 'tam chúc': 'Hà Nam', 'tam chuc': 'Hà Nam', 'phủ lý': 'Hà Nam', 'phu ly': 'Hà Nam', 'vũ đại': 'Hà Nam', 'kim bảng': 'Hà Nam', 'bá kiến': 'Hà Nam',
  // Hà Nội
  'hà nội': 'Hà Nội', 'ha noi': 'Hà Nội', 'hanoi': 'Hà Nội', 'thủ đô': 'Hà Nội', 'hồ gươm': 'Hà Nội', 'hoàn kiếm': 'Hà Nội',
  // Hải Phòng
  'hải phòng': 'Hải Phòng', 'hai phong': 'Hải Phòng', 'cát bà': 'Hải Phòng', 'đồ sơn': 'Hải Phòng', 'lan hạ': 'Hải Phòng',
  // Quảng Ninh
  'quảng ninh': 'Quảng Ninh', 'hạ long': 'Quảng Ninh', 'ha long': 'Quảng Ninh', 'vịnh hạ long': 'Quảng Ninh', 'bãi cháy': 'Quảng Ninh', 'cô tô': 'Quảng Ninh', 'quan lạn': 'Quảng Ninh', 'vân đồn': 'Quảng Ninh',
  // Ninh Bình
  'ninh bình': 'Ninh Bình', 'ninh binh': 'Ninh Bình', 'tràng an': 'Ninh Bình', 'tam cốc': 'Ninh Bình', 'hang múa': 'Ninh Bình', 'bái đính': 'Ninh Bình', 'hoa lư': 'Ninh Bình',
  // Lào Cai / Sa Pa
  'sa pa': 'Sa Pa', 'sapa': 'Sa Pa', 'lào cai': 'Sa Pa', 'lao cai': 'Sa Pa', 'fansipan': 'Sa Pa', 'ô quy hồ': 'Sa Pa', 'cát cát': 'Sa Pa',
  // Hà Giang
  'hà giang': 'Hà Giang', 'ha giang': 'Hà Giang', 'đồng văn': 'Hà Giang', 'mã pí lèng': 'Hà Giang', 'lũng cú': 'Hà Giang', 'nho quế': 'Hà Giang', 'mèo vạc': 'Hà Giang',
  // Cao Bằng
  'cao bằng': 'Cao Bằng', 'cao bang': 'Cao Bằng', 'bản giốc': 'Cao Bằng', 'pác bó': 'Cao Bằng', 'ngườm ngao': 'Cao Bằng',
  // Sơn La / Mộc Châu
  'mộc châu': 'Mộc Châu', 'moc chau': 'Mộc Châu', 'sơn la': 'Mộc Châu', 'son la': 'Mộc Châu', 'đồi chè': 'Mộc Châu',
  // Bắc Ninh
  'bắc ninh': 'Bắc Ninh', 'bac ninh': 'Bắc Ninh', 'kinh bắc': 'Bắc Ninh', 'đền đô': 'Bắc Ninh', 'chùa dâu': 'Bắc Ninh',
  // Nam Định
  'nam định': 'Nam Định', 'nam dinh': 'Nam Định', 'đền trần': 'Nam Định', 'hải hậu': 'Nam Định',
  // Bắc Kạn
  'bắc kạn': 'Bắc Kạn', 'bac kan': 'Bắc Kạn', 'ba bể': 'Bắc Kạn', 'hồ ba bể': 'Bắc Kạn',
  // Lạng Sơn
  'lạng sơn': 'Lạng Sơn', 'lang son': 'Lạng Sơn', 'mẫu sơn': 'Lạng Sơn', 'tam thanh': 'Lạng Sơn',
  // Tuyên Quang
  'tuyên quang': 'Tuyên Quang', 'tuyen quang': 'Tuyên Quang', 'na hang': 'Tuyên Quang', 'tân trào': 'Tuyên Quang',
  // Thái Nguyên
  'thái nguyên': 'Thái Nguyên', 'thai nguyen': 'Thái Nguyên', 'hồ núi cốc': 'Thái Nguyên', 'tân cương': 'Thái Nguyên',
  // Phú Thọ
  'phú thọ': 'Phú Thọ', 'phu tho': 'Phú Thọ', 'đền hùng': 'Phú Thọ',
  // Bắc Giang
  'bắc giang': 'Bắc Giang', 'bac giang': 'Bắc Giang', 'lục ngạn': 'Bắc Giang',
  // Hải Dương
  'hải dương': 'Hải Dương', 'hai duong': 'Hải Dương', 'côn sơn': 'Hải Dương', 'kiếp bạc': 'Hải Dương',
  // Hưng Yên
  'hưng yên': 'Hưng Yên', 'hung yen': 'Hưng Yên', 'phố hiến': 'Hưng Yên',
  // Thái Bình
  'thái bình': 'Thái Bình', 'thai binh': 'Thái Bình', 'chùa keo': 'Thái Bình',
  // Hòa Bình
  'hòa bình': 'Hòa Bình', 'hoa binh': 'Hòa Bình', 'mai châu': 'Hòa Bình', 'thung nai': 'Hòa Bình',
  // Yên Bái
  'yên bái': 'Yên Bái', 'yen bai': 'Yên Bái', 'mù cang chải': 'Yên Bái', 'mu cang chai': 'Yên Bái', 'tú lệ': 'Yên Bái',
  // Điện Biên
  'điện biên': 'Điện Biên', 'dien bien': 'Điện Biên', 'mường thanh': 'Điện Biên', 'pha đin': 'Điện Biên',
  // Lai Châu
  'lai châu': 'Lai Châu', 'lai chau': 'Lai Châu',
  // Thanh Hóa
  'thanh hóa': 'Thanh Hóa', 'thanh hoa': 'Thanh Hóa', 'sầm sơn': 'Thanh Hóa', 'pù luông': 'Thanh Hóa', 'pu luong': 'Thanh Hóa',
  // Nghệ An
  'nghệ an': 'Nghệ An', 'nghe an': 'Nghệ An', 'cửa lò': 'Nghệ An', 'quê bác': 'Nghệ An', 'nam đàn': 'Nghệ An',
  // Hà Tĩnh
  'hà tĩnh': 'Hà Tĩnh', 'ha tinh': 'Hà Tĩnh', 'thiên cầm': 'Hà Tĩnh', 'đồng lộc': 'Hà Tĩnh',
  // Quảng Bình
  'quảng bình': 'Quảng Bình', 'quang binh': 'Quảng Bình', 'phong nha': 'Quảng Bình', 'động thiên đường': 'Quảng Bình', 'sơn đoòng': 'Quảng Bình', 'đồng hới': 'Quảng Bình',
  // Quảng Trị
  'quảng trị': 'Quảng Trị', 'quang tri': 'Quảng Trị', 'vịnh mốc': 'Quảng Trị', 'thành cổ': 'Quảng Trị',
  // Thừa Thiên Huế
  'huế': 'Huế', 'hue': 'Huế', 'thừa thiên huế': 'Huế', 'sông hương': 'Huế', 'đại nội': 'Huế',
  // Đà Nẵng
  'đà nẵng': 'Đà Nẵng', 'da nang': 'Đà Nẵng', 'danang': 'Đà Nẵng', 'cầu rồng': 'Đà Nẵng', 'bà nà': 'Đà Nẵng', 'mỹ khê': 'Đà Nẵng',
  // Quảng Nam / Hội An
  'hội an': 'Hội An', 'hoi an': 'Hội An', 'quảng nam': 'Hội An', 'quang nam': 'Hội An', 'cù lao chàm': 'Hội An',
  // Quảng Ngãi
  'quảng ngãi': 'Quảng Ngãi', 'quang ngai': 'Quảng Ngãi', 'lý sơn': 'Quảng Ngãi', 'ly son': 'Quảng Ngãi',
  // Bình Định / Quy Nhơn
  'quy nhơn': 'Quy Nhơn', 'quy nhon': 'Quy Nhơn', 'bình định': 'Quy Nhơn', 'binh dinh': 'Quy Nhơn', 'kỳ co': 'Quy Nhơn', 'eo gió': 'Quy Nhơn',
  // Phú Yên
  'phú yên': 'Phú Yên', 'phu yen': 'Phú Yên', 'tuy hòa': 'Phú Yên', 'gành đá đĩa': 'Phú Yên', 'mũi điện': 'Phú Yên',
  // Khánh Hòa / Nha Trang
  'nha trang': 'Nha Trang', 'khánh hòa': 'Nha Trang', 'khanh hoa': 'Nha Trang', 'hòn tre': 'Nha Trang', 'cam ranh': 'Nha Trang',
  // Ninh Thuận
  'ninh thuận': 'Ninh Thuận', 'ninh thuan': 'Ninh Thuận', 'vĩnh hy': 'Ninh Thuận', 'phan rang': 'Ninh Thuận',
  // Bình Thuận / Mũi Né
  'mũi né': 'Bình Thuận', 'mui ne': 'Bình Thuận', 'phan thiết': 'Bình Thuận', 'bình thuận': 'Bình Thuận', 'binh thuan': 'Bình Thuận',
  // Kon Tum / Măng Đen
  'măng đen': 'Kon Tum', 'mang den': 'Kon Tum', 'kon tum': 'Kon Tum', 'kontum': 'Kon Tum',
  // Gia Lai
  'gia lai': 'Gia Lai', 'pleiku': 'Gia Lai', 'biển hồ': 'Gia Lai',
  // Đắk Lắk
  'đắk lắk': 'Đắk Lắk', 'dak lak': 'Đắk Lắk', 'daklak': 'Đắk Lắk', 'buôn ma thuột': 'Đắk Lắk', 'buon ma thuot': 'Đắk Lắk',
  // Đắk Nông
  'đắk nông': 'Đắk Nông', 'dak nong': 'Đắk Nông', 'tà đùng': 'Đắk Nông', 'ta dung': 'Đắk Nông',
  // Lâm Đồng / Đà Lạt
  'đà lạt': 'Đà Lạt', 'da lat': 'Đà Lạt', 'dalat': 'Đà Lạt', 'lâm đồng': 'Đà Lạt', 'lam dong': 'Đà Lạt', 'langbiang': 'Đà Lạt', 'bảo lộc': 'Đà Lạt',
  // TP. Hồ Chí Minh
  'sài gòn': 'TP. Hồ Chí Minh', 'sai gon': 'TP. Hồ Chí Minh', 'hồ chí minh': 'TP. Hồ Chí Minh', 'tp.hcm': 'TP. Hồ Chí Minh', 'tphcm': 'TP. Hồ Chí Minh',
  // Bà Rịa - Vũng Tàu
  'vũng tàu': 'Vũng Tàu', 'vung tau': 'Vũng Tàu', 'bà rịa': 'Vũng Tàu', 'côn đảo': 'Vũng Tàu', 'con dao': 'Vũng Tàu',
  // Tây Ninh
  'tây ninh': 'Tây Ninh', 'tay ninh': 'Tây Ninh', 'núi bà đen': 'Tây Ninh',
  // Bình Dương
  'bình dương': 'Bình Dương', 'binh duong': 'Bình Dương', 'đại nam': 'Bình Dương',
  // Bình Phước
  'bình phước': 'Bình Phước', 'binh phuoc': 'Bình Phước',
  // Đồng Nai
  'đồng nai': 'Đồng Nai', 'dong nai': 'Đồng Nai', 'cát tiên': 'Đồng Nai',
  // Long An
  'long an': 'Long An', 'tân lập': 'Long An',
  // Tiền Giang
  'tiền giang': 'Tiền Giang', 'tien giang': 'Tiền Giang', 'mỹ tho': 'Tiền Giang',
  // Bến Tre
  'bến tre': 'Bến Tre', 'ben tre': 'Bến Tre',
  // Trà Vinh
  'trà vinh': 'Trà Vinh', 'tra vinh': 'Trà Vinh',
  // Vĩnh Long
  'vĩnh long': 'Vĩnh Long', 'vinh long': 'Vĩnh Long',
  // Đồng Tháp
  'đồng tháp': 'Đồng Tháp', 'dong thap': 'Đồng Tháp', 'sa đéc': 'Đồng Tháp', 'tràm chim': 'Đồng Tháp',
  // An Giang
  'an giang': 'An Giang', 'châu đốc': 'An Giang', 'núi sam': 'An Giang', 'trà sư': 'An Giang',
  // Kiên Giang / Phú Quốc
  'phú quốc': 'Phú Quốc', 'phu quoc': 'Phú Quốc', 'kiên giang': 'Phú Quốc', 'kien giang': 'Phú Quốc', 'hà tiên': 'Phú Quốc', 'nam du': 'Phú Quốc',
  // Cần Thơ
  'cần thơ': 'Cần Thơ', 'can tho': 'Cần Thơ', 'ninh kiều': 'Cần Thơ', 'cái răng': 'Cần Thơ', 'miền tây': 'Cần Thơ',
  // Hậu Giang
  'hậu giang': 'Hậu Giang', 'hau giang': 'Hậu Giang',
  // Sóc Trăng
  'sóc trăng': 'Sóc Trăng', 'soc trang': 'Sóc Trăng', 'chùa dơi': 'Sóc Trăng',
  // Bạc Liêu
  'bạc liêu': 'Bạc Liêu', 'bac lieu': 'Bạc Liêu', 'công tử bạc liêu': 'Bạc Liêu',
  // Cà Mau
  'cà mau': 'Cà Mau', 'ca mau': 'Cà Mau', 'đất mũi': 'Cà Mau', 'u minh': 'Cà Mau'
};

/**
 * Hàm tìm kiếm thông tin tỉnh/thành phố từ câu hỏi tự nhiên của người dùng
 */
function detectDestinationProvince(text = '') {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase();
  
  // Sắp xếp các key theo độ dài giảm dần để ưu tiên cụm từ dài nhất trước
  const sortedAliases = Object.keys(PROVINCE_ALIASES).sort((a, b) => b.length - a.length);
  for (const key of sortedAliases) {
    if (lower.includes(key)) {
      return PROVINCE_ALIASES[key];
    }
  }

  // Quét trực tiếp trong các key của cơ sở dữ liệu
  const sortedProvinces = Object.keys(VIETNAM_PROVINCES_DATA).sort((a, b) => b.length - a.length);
  for (const provName of sortedProvinces) {
    if (lower.includes(provName.toLowerCase())) {
      return provName;
    }
  }

  // Khai thác các mẫu câu: "đi [tên]", "du lịch [tên]", "lịch trình [tên]", "ở [tên]"
  const matchPattern = text.match(/(?:đi|du lịch|lịch trình|khám phá|tới|đến)\s+([A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐa-zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ\s]{2,20})/i);
  if (matchPattern && matchPattern[1]) {
    const candidate = matchPattern[1].trim();
    if (candidate.length >= 2 && !['ngày', 'người', 'đêm', 'hôm'].includes(candidate.toLowerCase())) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  return null;
}

/**
 * Trích xuất điểm xuất phát nếu có ("từ Hà Nội vào Đà Nẵng", "từ Sài Gòn đi Đà Lạt")
 */
function extractTripRoute(text = '') {
  let startLocation = 'Hà Nội';
  let destination = null;

  const routeMatch = text.match(/từ\s+([^➔\->vàođến]+)\s*(?:➔|->|vào|đến|đi)\s*([^\.,;?!]+)/i);
  if (routeMatch) {
    const rawStart = routeMatch[1].trim();
    const rawDest = routeMatch[2].trim();
    const detectedStart = detectDestinationProvince(rawStart);
    const detectedDest = detectDestinationProvince(rawDest);
    if (detectedStart) startLocation = detectedStart;
    if (detectedDest) destination = detectedDest;
    else destination = rawDest;
  } else {
    destination = detectDestinationProvince(text);
  }

  return { startLocation, destination };
}

/**
 * Bộ sinh dữ liệu thông minh cho bất kỳ tỉnh nào chưa có trong danh sách cố định (hỗ trợ toàn bộ 63 tỉnh)
 */
function getOrCreateProvinceData(provinceName) {
  if (VIETNAM_PROVINCES_DATA[provinceName]) {
    return VIETNAM_PROVINCES_DATA[provinceName];
  }

  // Fallback thông minh linh hoạt cho bất kỳ tỉnh thành nào
  return {
    region: 'Việt Nam',
    attractions: [
      { 
        name: `Khu danh thắng & Điểm du lịch nổi tiếng tại ${provinceName}`, 
        address: `Khu du lịch sinh thái, ${provinceName}`, 
        duration: '2 giờ 30 phút', 
        cost: 40000, 
        costText: 'Dự kiến: 40.000đ/vé', 
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', 
        advice: `Trải nghiệm cảnh quan thiên nhiên trong lành, chụp ảnh phong cảnh đặc trưng của ${provinceName}.` 
      },
      { 
        name: `Quảng trường trung tâm & Di tích lịch sử ${provinceName}`, 
        address: `Trung tâm hành chính, ${provinceName}`, 
        duration: '2 giờ', 
        cost: 0, 
        costText: 'Tham quan tự do', 
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', 
        advice: `Khám phá trung tâm văn hóa và tìm hiểu lịch sử truyền thống đặc sắc của ${provinceName}.` 
      },
      { 
        name: `Chùa cổ & Công trình kiến trúc tâm linh ${provinceName}`, 
        address: `Địa phận ${provinceName}`, 
        duration: '1 giờ 30 phút', 
        cost: 0, 
        costText: 'Miễn phí viếng chùa', 
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80', 
        advice: `Không gian tâm linh thanh tịnh; quý khách nên mặc trang phục kín đáo, lịch sự.` 
      },
      { 
        name: `Chợ đêm & Khu phố ẩm thực truyền thống ${provinceName}`, 
        address: `Khu phố thương mại trung tâm, ${provinceName}`, 
        duration: '2 giờ', 
        cost: 100000, 
        costText: 'Ăn uống & mua sắm tự do', 
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', 
        advice: `Tản bộ ngắm phố đêm, thưởng thức các món ăn đường phố đặc sắc và mua quà lưu niệm địa phương.` 
      }
    ],
    foods: [
      { 
        name: `Quán đặc sản gia truyền ${provinceName}`, 
        dish: `Ẩm thực đặc sản truyền thống ${provinceName}`, 
        address: `Trung tâm ${provinceName}`, 
        costText: 'Dự kiến: 50.000đ - 100.000đ/người', 
        advice: `Thưởng thức hương vị bản địa đậm đà được người dân địa phương ưa chuộng.` 
      },
      { 
        name: `Nhà hàng ẩm thực vùng miền ${provinceName}`, 
        dish: `Mâm cơm truyền thống bản địa`, 
        address: `Đường ẩm thực chính, ${provinceName}`, 
        costText: 'Dự kiến: 120.000đ - 200.000đ/người', 
        advice: `Không gian ấm cúng, phục vụ chu đáo với nguồn nguyên liệu tươi sạch của địa phương.` 
      }
    ],
    hotel: { 
      name: `Khách sạn nghỉ dưỡng trung tâm ${provinceName}`, 
      address: `Trung tâm ${provinceName}`, 
      price: '450.000đ - 950.000đ/đêm' 
    }
  };
}

/**
 * TẠO LỊCH TRÌNH THÔNG MINH CHO BẤT KỲ TỈNH THÀNH NÀO
 */
function buildSmartItinerary({ startLocation, destination, days, budget, guests, rooms, travelStyle, specialRequests }) {
  const numDays = Math.max(1, Math.min(30, parseInt(days, 10) || 3));
  const numGuests = Math.max(1, parseInt(guests, 10) || 1);
  const numRooms = Math.max(1, parseInt(rooms, 10) || 1);

  // Nhận diện tỉnh thành
  let matchedProvince = detectDestinationProvince(destination) || detectDestinationProvince(specialRequests);
  if (!matchedProvince) {
    matchedProvince = destination?.trim() || 'Tam Đảo';
  }

  const provinceData = getOrCreateProvinceData(matchedProvince);

  // Tạo mốc ngày bắt đầu
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
  const hotelInfo = provinceData.hotel || { name: `Khách sạn nghỉ dưỡng tại ${matchedProvince}`, address: `Trung tâm ${matchedProvince}` };

  const timeSlots = ['08:30', '11:30', '15:00', '18:30'];

  for (let day = 1; day <= numDays; day++) {
    const curDate = new Date(baseDate);
    curDate.setDate(curDate.getDate() + day - 1);
    const curDateStr = formatDate(curDate);

    const activities = [];

    // Buổi sáng: Điểm tham quan 1
    const att1 = attractionsPool[((day - 1) * 2) % attractionsPool.length];
    if (att1) {
      activities.push({
        order: 1,
        time: timeSlots[0],
        name: att1.name,
        address: att1.address,
        duration: att1.duration || '2 giờ',
        costText: att1.costText || 'Tham quan tự do',
        cost: att1.cost || 0,
        image: att1.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
        advice: att1.advice || `Khám phá thắng cảnh tiêu biểu của ${matchedProvince} vào buổi sáng mát mẻ.`
      });
    }

    // Buổi trưa: Quán ăn đặc sản
    const foodItem = foodsPool[(day - 1) % foodsPool.length];
    if (foodItem) {
      activities.push({
        order: 2,
        time: timeSlots[1],
        name: foodItem.name,
        address: foodItem.address,
        duration: '1 giờ 15 phút',
        costText: foodItem.costText || 'Dự kiến: 50.000đ - 80.000đ/người',
        cost: 60000,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
        advice: foodItem.advice || `Thưởng thức món ngon trứ danh ${foodItem.dish} tại ${matchedProvince}.`
      });
    }

    // Buổi chiều: Điểm tham quan 2
    const att2 = attractionsPool[((day - 1) * 2 + 1) % attractionsPool.length];
    if (att2) {
      activities.push({
        order: 3,
        time: timeSlots[2],
        name: att2.name,
        address: att2.address,
        duration: att2.duration || '2 giờ',
        costText: att2.costText || 'Tham quan tự do',
        cost: att2.cost || 0,
        image: att2.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        advice: att2.advice || `Trải nghiệm cảnh sắc thiên nhiên và không gian văn hóa ${matchedProvince} buổi chiều tà.`
      });
    }

    // Buổi tối: Dạo phố / Ẩm thực đêm
    activities.push({
      order: 4,
      time: timeSlots[3],
      name: `Phố đêm & Ẩm thực tối ${matchedProvince}`,
      address: `Khu phố trung tâm, ${matchedProvince}`,
      duration: '2 giờ',
      costText: 'Ăn tối & dạo phố tự do',
      cost: 100000,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      advice: `Tản bộ ngắm phố đêm ${matchedProvince}, hòa mình vào nhịp sống địa phương và thưởng thức quà vặt đặc sản.`
    });

    dailyItinerary.push({
      day: day,
      date: curDateStr,
      title: `Khám phá & Trải nghiệm ${matchedProvince} (Ngày ${day})`,
      activityCount: activities.length,
      transitSummary: `Di chuyển thuận tiện bằng taxi, thuê xe máy hoặc xe đưa đón giữa các điểm tham quan tại ${matchedProvince}.`,
      activities: activities
    });
  }

  // 1. Tính toán chi phí di chuyển (Vé máy bay hoặc Xe Limousine khứ hồi)
  const isNear = ['Hà Nội', 'Ninh Bình', 'Quảng Ninh', 'Sa Pa', 'Hải Phòng', 'Hòa Bình', 'Mai Châu', 'Mộc Châu', 'Cao Bằng', 'Hà Giang', 'Tam Đảo', 'Hà Nam', 'Vĩnh Phúc', 'Nam Định', 'Thái Bình', 'Bắc Ninh', 'Bắc Giang', 'Phú Thọ', 'Thái Nguyên'].includes(matchedProvince) && ['Hà Nội'].includes(startLocation);
  const transitCostPerPerson = isNear ? 350000 : 1650000;
  const transitCostTotal = transitCostPerPerson * numGuests;

  // 2. Tính toán chi phí khách sạn theo địa điểm và số đêm
  const nights = numDays > 1 ? numDays - 1 : 1;
  let hotelPricePerNight = 650000;
  if (['Phú Quốc', 'Nha Trang', 'Đà Nẵng', 'Đà Lạt', 'TP. Hồ Chí Minh'].includes(matchedProvince)) {
    hotelPricePerNight = 850000;
  } else if (['Hà Giang', 'Cao Bằng', 'Cần Thơ', 'Tây Ninh', 'Hà Nam', 'Nam Định', 'Bắc Ninh'].includes(matchedProvince)) {
    hotelPricePerNight = 500000;
  } else if (['Tam Đảo'].includes(matchedProvince)) {
    hotelPricePerNight = 700000;
  }
  const hotelCostTotal = hotelPricePerNight * nights * numRooms;

  // 3. Tính toán chi phí vé tham quan từ các hoạt động thực tế
  let ticketCostPerPerson = 0;
  dailyItinerary.forEach(day => {
    day.activities.forEach(act => {
      ticketCostPerPerson += (act.cost || 0);
    });
  });
  const ticketCostTotal = ticketCostPerPerson * numGuests;

  // 4. Tính toán chi phí ẩm thực (3 bữa/ngày)
  const foodPerDayPerPerson = 280000;
  const foodCostTotal = foodPerDayPerPerson * numDays * numGuests;

  // 5. Chi phí đi lại nội thành / taxi
  const localTransportTotal = 120000 * numDays;

  // TỔNG CHI PHÍ DỰ KIẾN (Tính động chính xác theo số khách, phòng, ngày và các điểm đến thực tế)
  const calculatedBudget = transitCostTotal + hotelCostTotal + ticketCostTotal + foodCostTotal + localTransportTotal;

  // Chi phí cố định / đặt trước ban đầu (vé di chuyển + 30% cọc phòng + vé tham quan)
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
    summary: `Kế hoạch hành trình tối ưu được hệ thống VietnamTourism AI thiết kế riêng cho chuyến khám phá ${matchedProvince} trong ${numDays} ngày. Lộ trình được bố trí khoa học, giúp bạn tận hưởng tối đa cảnh đẹp, ẩm thực địa phương và thư giãn trọn vẹn.`,
    dailyItinerary: dailyItinerary,
    overviewServices: overviewServices,
    travelTips: [
      `Nên chuẩn bị trang phục phù hợp với thời tiết đặc trưng của ${matchedProvince}.`,
      `Có thể bấm trực tiếp vào từng địa điểm trên lịch trình để mở vị trí và chỉ đường trên Google Maps.`,
      `Thưởng thức các món đặc sản địa phương tại các địa chỉ uy tín được gợi ý.`
    ]
  };
}

module.exports = {
  VIETNAM_PROVINCES_DATA,
  PROVINCE_ALIASES,
  detectDestinationProvince,
  extractTripRoute,
  getOrCreateProvinceData,
  buildSmartItinerary
};
