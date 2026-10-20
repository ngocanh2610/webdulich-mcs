const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const approvedLocations = [
  {
    id: 'ninh-binh-trang-an',
    provinceId: 'ninh-binh',
    name: 'Quần thể danh thắng Tràng An',
    type: 'nature',
    rating: 5,
    description: 'Di sản Văn hóa và Thiên nhiên thế giới được UNESCO công nhận với cảnh quan karst tháp đá vôi ngoạn mục, hang động ngập nước kỳ bí và những dòng sông thơ mộng.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80'
    ],
    tags: ['Di sản UNESCO', 'Thiên nhiên', 'Hang động', 'Chèo thuyền'],
    author: 'admin',
    status: 'approved'
  },
  {
    id: 'ninh-binh-hang-mua',
    provinceId: 'ninh-binh',
    name: 'Hang Múa & Đỉnh Ngọa Long',
    type: 'nature',
    rating: 5,
    description: 'Chinh phục gần 500 bậc thang đá uốn lượn lên đỉnh núi Ngọa Long để phóng tầm mắt ngắm trọn toàn cảnh thung lũng Tam Cốc và sông Ngô Đồng mùa lúa chín vàng ươm.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
    ],
    tags: ['Check-in', 'Leo núi', 'Toàn cảnh đẹp', 'Nhiếp ảnh'],
    author: 'viet',
    status: 'approved'
  },
  {
    id: 'hue-dai-noi',
    provinceId: 'thua-thien-hue',
    name: 'Đại Nội Huế - Hoàng thành Cố Đô',
    type: 'history',
    rating: 5,
    description: 'Kinh đô của vương triều nhà Nguyễn suốt 143 năm, quần thể di tích kiến trúc cung đình vàng son nguy nga gồm Ngọ Môn, Điện Thái Hòa, Tử Cấm Thành mang đậm hồn cốt dân tộc.',
    image: 'https://images.unsplash.com/photo-1573492534282-c9a32f59cf56?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1573492534282-c9a32f59cf56?w=800&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'
    ],
    tags: ['Di sản UNESCO', 'Lịch sử', 'Kiến trúc', 'Cung đình'],
    author: 'admin',
    status: 'approved'
  },
  {
    id: 'hue-chua-thien-mu',
    provinceId: 'thua-thien-hue',
    name: 'Chùa Thiên Mụ & Tháp Phước Duyên',
    type: 'culture',
    rating: 5,
    description: 'Ngôi đệ nhất cổ tự xứ Huế tọa lạc trên đồi Hà Khê soi bóng xuống dòng sông Hương hiền hòa, với ngọn tháp Phước Duyên 7 tầng hình bát giác uy nghi trầm mặc.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'
    ],
    tags: ['Tâm linh', 'Văn hóa', 'Sông Hương', 'Cổ tự'],
    author: 'ngocanh',
    status: 'approved'
  },
  {
    id: 'khanh-hoa-thap-ba-ponagar',
    provinceId: 'khanh-hoa',
    name: 'Tháp Bà Ponagar Nha Trang',
    type: 'history',
    rating: 5,
    description: 'Kiệt tác kiến trúc và điêu khắc đất nung của nền văn hóa Chăm Pa cổ xưa, ngự trên ngọn đồi nhỏ lộng gió nhìn ra cửa biển Nha Trang xanh biếc hiền hòa.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80'
    ],
    tags: ['Văn hóa Chăm Pa', 'Di tích lịch sử', 'Kiến trúc cổ', 'Nha Trang'],
    author: 'admin',
    status: 'approved'
  },
  {
    id: 'kien-giang-bai-sao',
    provinceId: 'kien-giang',
    name: 'Bãi Sao Phú Quốc',
    type: 'nature',
    rating: 5,
    description: 'Bãi biển đẹp tựa thiên đường với dải cát trắng mịn màng như kem sữa uốn lượn hình cánh cung ôm lấy làn nước biển ngọc bích êm đềm và hàng dừa nghiêng bóng.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
    ],
    tags: ['Biển đảo', 'Nghỉ dưỡng', 'Cát trắng', 'Phú Quốc'],
    author: 'admin',
    status: 'approved'
  },
  {
    id: 'quang-binh-dong-phong-nha',
    provinceId: 'quang-binh',
    name: 'Động Phong Nha - Vườn Quốc Gia Phong Nha Kẻ Bàng',
    type: 'nature',
    rating: 5,
    description: 'Kỳ quan đệ nhất động ngầm thế giới với dòng sông ngầm kỳ ảo, bãi cát trong hang và những măng đá, nhũ đá thạch cao óng ánh như ngọc bích.',
    image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80'
    ],
    tags: ['Di sản UNESCO', 'Kỳ quan thiên nhiên', 'Hang động kỳ vĩ', 'Quảng Bình'],
    author: 'viet',
    status: 'approved'
  },
  {
    id: 'lam-dong-thac-datanla',
    provinceId: 'lam-dong',
    name: 'Khu Du Lịch Thác Datanla Đà Lạt',
    type: 'entertainment',
    rating: 5,
    description: 'Dòng thác bọt tung trắng xóa ẩn mình giữa hẻm sâu rừng thông nguyên sinh, trải nghiệm hệ thống máng trượt uốn lượn xuyên rừng thông dài nhất Đông Nam Á.',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'
    ],
    tags: ['Thác nước', 'Mạo hiểm', 'Máng trượt', 'Đà Lạt'],
    author: 'admin',
    status: 'approved'
  },
  {
    id: 'da-nang-chua-linh-ung',
    provinceId: 'da-nang',
    name: 'Bán Đảo Sơn Trà & Chùa Linh Ứng',
    type: 'culture',
    rating: 5,
    description: 'Tọa lạc trên bán đảo Sơn Trà xanh ngát với tượng Bồ Tát Quán Thế Âm cao 67m mặt hướng ra biển Đông, nơi hội tụ linh khí đất trời và phong cảnh non nước hữu tình.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'
    ],
    tags: ['Tâm linh', 'Biển trời', 'Bán đảo Sơn Trà', 'Đà Nẵng'],
    author: 'viet',
    status: 'approved'
  }
];

const pendingLocations = [
  {
    id: 'ha-giang-hem-tu-san-pending',
    provinceId: 'ha-giang',
    name: 'Hẻm Tu Sản & Chèo Thuyền Sông Nho Quế',
    type: 'discovery',
    rating: 5,
    description: 'Hẻm vực sâu nhất và hùng vĩ nhất Đông Nam Á với vách đá dựng đứng cao hơn 800m. Du khách có thể ngồi thuyền hoặc chèo kayak trên dòng nước xanh màu ngọc bích êm đềm dưới chân đèo Mã Pí Lèng.',
    image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
    ],
    tags: ['Hẻm Tu Sản', 'Sông Nho Quế', 'Khám phá', 'Cảnh đẹp hùng vĩ'],
    author: 'viet',
    status: 'pending'
  },
  {
    id: 'lao-cai-ban-cat-cat-pending',
    provinceId: 'lao-cai',
    name: 'Bản Cát Cát - Bản Cổ Đẹp Mộng Mơ Giữa Núi Rừng Sa Pa',
    type: 'culture',
    rating: 5,
    description: 'Ngôi làng cổ kính của đồng bào người H\'Mông nằm yên bình dưới chân đỉnh Fansipan. Bản làng thu hút du khách bởi những nếp nhà gỗ truyền thống, cối xay nước khổng lồ và dòng thác Tiên Sa róc rách thơ mộng.',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80'
    ],
    tags: ['Bản làng', 'Văn hóa H\'Mông', 'Check-in', 'Sa Pa'],
    author: 'ngocanh',
    status: 'pending'
  },
  {
    id: 'tay-ninh-nui-ba-den-pending',
    provinceId: 'tay-ninh',
    name: 'Quần Thể Núi Bà Đen - Nóc Nhà Nam Bộ',
    type: 'discovery',
    rating: 5,
    description: 'Đỉnh núi Bà Đen cao 986m được mệnh danh là Nóc nhà Nam Bộ, nổi tiếng với hệ thống cáp treo hiện đại, khí hậu mát mẻ và đại tượng Phật Bà Tây Bổ Đà Sơn bằng đồng uy nghiêm giữa biển mây bồng bềnh.',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80'
    ],
    tags: ['Nóc nhà Nam Bộ', 'Săn mây', 'Tâm linh', 'Cáp treo'],
    author: '1.đoànngọcanh823',
    status: 'pending'
  },
  {
    id: 'can-tho-cho-noi-cai-rang-pending',
    provinceId: 'can-tho',
    name: 'Chợ Nổi Cái Răng - Hồn Nước Miền Tây',
    type: 'culture',
    rating: 5,
    description: 'Nét sinh hoạt văn hóa giao thương sông nước đặc thù duy nhất tại ĐBSCL. Sáng sớm, hàng trăm ghe thuyền chở đầy hoa quả nông sản tụ hội, tiếng máy nổ và câu hò reo mời rộn ràng sông nước.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
    ],
    tags: ['Chợ nổi', 'Miền Tây', 'Ẩm thực sông nước', 'Văn hóa dân dã'],
    author: 'viet',
    status: 'pending'
  },
  {
    id: 'binh-dinh-ky-co-eo-gio-pending',
    provinceId: 'binh-dinh',
    name: 'Eo Gió & Bãi Biển Kỳ Co Quy Nhơn',
    type: 'nature',
    rating: 5,
    description: 'Cung đường đi bộ ven biển ngoạn mục ôm trọn rặng núi đá kỳ vĩ hướng ra đại dương lộng gió. Bãi Kỳ Co nổi bật với làn nước biển xanh hai màu trong vắt tựa thiên đường Maldives nhiệt đới.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
    ],
    tags: ['Eo Gió', 'Kỳ Co', 'Biển xanh', 'Quy Nhơn'],
    author: 'ngocanh',
    status: 'pending'
  },
  {
    id: 'quang-ninh-bao-tang-pending',
    provinceId: 'quang-ninh',
    name: 'Bảo Tàng Quảng Ninh - Khối Kim Cương Đen Bên Vịnh',
    type: 'culture',
    rating: 5,
    description: 'Kiệt tác kiến trúc hiện đại được ví như khối than đá khổng lồ phản chiếu mây trời Hạ Long. Không gian trưng bày kết hợp hiện đại giới thiệu sinh thái biển, lịch sử khai mỏ than và cổ vật văn hóa Đông Triều - Yên Tử.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80'
    ],
    tags: ['Bảo tàng', 'Kiến trúc độc đáo', 'Check-in', 'Hạ Long'],
    author: '1.đoànngọcanh823',
    status: 'pending'
  }
];

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vntourism'
  });

  console.log('Seeding locations to MySQL...');
  const allNewLocations = [...approvedLocations, ...pendingLocations];

  for (const loc of allNewLocations) {
    await pool.execute(
      `INSERT INTO locations (id, province_id, name, type, rating, description, image, images_json, tags_json, author, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         name = VALUES(name), 
         type = VALUES(type), 
         description = VALUES(description), 
         image = VALUES(image), 
         images_json = VALUES(images_json), 
         tags_json = VALUES(tags_json), 
         status = VALUES(status)`,
      [
        loc.id,
        loc.provinceId,
        loc.name,
        loc.type,
        loc.rating,
        loc.description,
        loc.image,
        JSON.stringify(loc.images || []),
        JSON.stringify(loc.tags || []),
        loc.author,
        loc.status
      ]
    );
    console.log(`✓ Inserted/Updated: [${loc.status.toUpperCase()}] ${loc.name} (${loc.provinceId})`);
  }

  // Insert notifications for admin for the pending locations
  for (const pLoc of pendingLocations) {
    const notifId = `notif-${pLoc.id}`;
    await pool.execute(
      `INSERT INTO notifications (id, type, message, location_id, target_user, is_read) 
       VALUES (?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE message = VALUES(message)`,
      [
        notifId,
        'pending_approval',
        `Người dùng ${pLoc.author} vừa gửi bài đăng "${pLoc.name}" đang chờ bạn duyệt.`,
        pLoc.id,
        'admin',
        false
      ]
    );
  }
  console.log('✓ Added pending notifications for admin.');

  // Also update local JSON files so persistence is guaranteed
  const locationsJsonPath = path.join(__dirname, '..', 'location-service', 'data', 'locations.json');
  if (fs.existsSync(locationsJsonPath)) {
    let existingLocations = JSON.parse(fs.readFileSync(locationsJsonPath, 'utf8'));
    for (const newLoc of allNewLocations) {
      const idx = existingLocations.findIndex(l => l.id === newLoc.id);
      if (idx >= 0) {
        existingLocations[idx] = newLoc;
      } else {
        existingLocations.push(newLoc);
      }
    }
    fs.writeFileSync(locationsJsonPath, JSON.stringify(existingLocations, null, 2), 'utf8');
    console.log('✓ Updated locations.json file.');
  }

  const notifsJsonPath = path.join(__dirname, '..', 'location-service', 'data', 'notifications.json');
  if (fs.existsSync(notifsJsonPath)) {
    let existingNotifs = JSON.parse(fs.readFileSync(notifsJsonPath, 'utf8'));
    for (const pLoc of pendingLocations) {
      const notifId = `notif-${pLoc.id}`;
      const idx = existingNotifs.findIndex(n => n.id === notifId);
      const notifObj = {
        id: notifId,
        type: 'pending_approval',
        message: `Người dùng ${pLoc.author} vừa gửi bài đăng "${pLoc.name}" đang chờ bạn duyệt.`,
        locationId: pLoc.id,
        target: 'admin',
        read: false,
        createdAt: new Date().toISOString()
      };
      if (idx >= 0) {
        existingNotifs[idx] = notifObj;
      } else {
        existingNotifs.unshift(notifObj);
      }
    }
    fs.writeFileSync(notifsJsonPath, JSON.stringify(existingNotifs, null, 2), 'utf8');
    console.log('✓ Updated notifications.json file.');
  }

  console.log('DONE!');
  await pool.end();
}

run().catch(err => {
  console.error('Error running seed:', err);
  process.exit(1);
});
