const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'OPTIONS'] }));
app.use(morgan('combined'));
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
  database: process.env.DB_NAME || 'vntourism',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Load JSON data in memory as reliable fallback
const provinces63Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'provinces-63.json'), 'utf8'));
const provinces34Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'provinces-34.json'), 'utf8'));

// Sync data on startup
async function initProvinces() {
  try {
    console.log('Syncing provinces from JSON to MySQL...');
    // Ensure table structure supports type if needed or drop/recreate constraint
    try {
      await pool.query('ALTER TABLE provinces DROP INDEX slug');
    } catch (e) { }
    try {
      await pool.query('ALTER TABLE provinces DROP PRIMARY KEY, ADD PRIMARY KEY (id, type)');
    } catch (e) { }

    const insertProvince = async (p, type) => {
      try {
        await pool.execute(
          'INSERT INTO provinces (id, slug, name, type, region_code, capital, image, area, population, description, region, merged_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE image = VALUES(image), description = VALUES(description), name = VALUES(name), capital = VALUES(capital), area = VALUES(area), population = VALUES(population), region = VALUES(region), merged_from = VALUES(merged_from)',
          [p.id || p.slug, p.slug, p.name, type, p.regionCode, p.capital || null, p.image || null, p.area || 0, p.population || 0, p.description || null, p.region || null, p.mergedFrom ? JSON.stringify(p.mergedFrom) : null]
        );
      } catch (e) {
        // Silently ignore DB insertion error as fallback will serve JSON
      }
    };

    for (let p of provinces63Data) { await insertProvince(p, '63'); }
    for (let p of provinces34Data) { await insertProvince(p, '34'); }
    console.log('Province sync completed.');
  } catch (error) {
    console.error('Failed to init provinces', error);
  }
}

setTimeout(initProvinces, 3000);
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      service: 'province-service',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// GET /api/provinces?mode=63|34
app.get('/api/provinces', async (req, res) => {
  const mode = req.query.mode === '34' ? '34' : '63';
  const region = req.query.region; // north | central | south | highland
  const search = req.query.search?.toLowerCase();

  let rows = [];
  try {
    const [dbRows] = await pool.execute('SELECT * FROM provinces WHERE type = ?', [mode]);
    rows = dbRows;
  } catch (error) {
    console.warn('DB query error, fallback to JSON:', error.message);
  }

  // Fallback to JSON if DB returned 0 rows for this mode
  if (!rows || rows.length === 0) {
    const sourceJSON = mode === '34' ? provinces34Data : provinces63Data;
    rows = sourceJSON.map(p => ({
      id: p.id || p.slug,
      slug: p.slug,
      name: p.name,
      type: mode,
      region_code: p.regionCode,
      capital: p.capital,
      image: p.image,
      area: p.area,
      population: p.population,
      description: p.description,
      region: p.region,
      merged_from: p.mergedFrom ? p.mergedFrom : null
    }));
  } else {
    rows = rows.map(r => ({
      ...r,
      mergedFrom: typeof r.merged_from === 'string' ? JSON.parse(r.merged_from) : (r.merged_from || null),
      regionCode: r.region_code
    }));
  }

  // Apply filtering
  if (region && region !== 'all') {
    rows = rows.filter(r => (r.region_code || r.regionCode) === region);
  }

  if (search) {
    rows = rows.filter(r =>
      (r.name && r.name.toLowerCase().includes(search)) ||
      (r.capital && r.capital.toLowerCase().includes(search))
    );
  }

  res.json({
    success: true,
    mode,
    total: rows.length,
    data: rows.map(r => ({
      ...r,
      mergedFrom: r.mergedFrom || (r.merged_from ? r.merged_from : null),
      regionCode: r.regionCode || r.region_code
    }))
  });
});

// GET /api/provinces/:slug
app.get('/api/provinces/:slug', async (req, res) => {
  const { slug } = req.params;
  const mode = req.query.mode === '34' ? '34' : (req.query.mode === '63' ? '63' : null);

  try {
    let query = 'SELECT * FROM provinces WHERE (id = ? OR slug = ?)';
    const params = [slug, slug];
    if (mode) {
      query += ' AND type = ?';
      params.push(mode);
    }
    const [rows] = await pool.execute(query, params);
    if (rows.length > 0) {
      return res.json({
        success: true,
        data: {
          ...rows[0],
          mergedFrom: typeof rows[0].merged_from === 'string' ? JSON.parse(rows[0].merged_from) : (rows[0].merged_from || null),
          regionCode: rows[0].region_code
        }
      });
    }
  } catch (error) {
    console.warn('DB error on single province query, fallback to JSON:', error.message);
  }

  // Fallback to JSON
  const targetList = mode === '34' ? provinces34Data : (mode === '63' ? provinces63Data : [...provinces34Data, ...provinces63Data]);
  const found = targetList.find(p => p.id === slug || p.slug === slug);
  if (found) {
    return res.json({
      success: true,
      data: {
        ...found,
        mergedFrom: found.mergedFrom || null,
        regionCode: found.regionCode
      }
    });
  }

  res.status(404).json({ success: false, message: 'Tỉnh thành không tồn tại' });
});

// GET /api/provinces/region/list - get regions
app.get('/api/provinces/meta/regions', (req, res) => {
  const regions = [
    { code: 'north', label: 'Miền Bắc', icon: '🏔️' },
    { code: 'central', label: 'Miền Trung', icon: '🌊' },
    { code: 'south', label: 'Miền Nam', icon: '🌴' },
    { code: 'highland', label: 'Tây Nguyên', icon: '🌿' }
  ];
  res.json({ success: true, data: regions });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Province Service running on port ${PORT}`);
});
