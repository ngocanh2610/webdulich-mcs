const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(morgan('combined'));
app.use(express.json());

app.use('/api/media/uploads', express.static(uploadsDir));

const heroImages = [
  { id: 'halong-hero', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=90', caption: 'Vịnh Hạ Long hùng vĩ', credit: 'Unsplash' },
  { id: 'hoian-hero', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=90', caption: 'Phố cổ Hội An lung linh', credit: 'Unsplash' },
  { id: 'sapa-hero', url: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920&q=90', caption: 'Ruộng bậc thang Sa Pa', credit: 'Unsplash' },
  { id: 'hanoi-hero', url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1920&q=90', caption: 'Hồ Hoàn Kiếm về đêm', credit: 'Unsplash' },
  { id: 'hue-hero', url: 'https://images.unsplash.com/photo-1573492534282-c9a32f59cf56?w=1920&q=90', caption: 'Đại Nội Huế cổ kính', credit: 'Unsplash' }
];

const bannerImages = {
  north: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80',
  central: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
  south: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  highland: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80'
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'media-service', port: PORT, timestamp: new Date().toISOString() });
});

app.get('/api/media/heroes', (req, res) => {
  res.json({ success: true, data: heroImages });
});

app.get('/api/media/banners/:region', (req, res) => {
  const url = bannerImages[req.params.region] || bannerImages.north;
  res.json({ success: true, url });
});

app.get('/api/media/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalHeroImages: heroImages.length,
      regions: Object.keys(bannerImages).length,
      provider: 'Unsplash'
    }
  });
});

app.post('/api/media/upload', upload.array('images', 50), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const host = req.get('host');
  const protocol = req.protocol;
  
  const urls = req.files.map(file => `/api/media/uploads/${file.filename}`);

  res.json({
    success: true,
    message: 'Files uploaded successfully',
    data: urls
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Media Service running on port ${PORT}`);
});
