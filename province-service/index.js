const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'OPTIONS'] }));
app.use(morgan('combined'));
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
  database: process.env.DB_NAME || 'vntourism',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const provinces63Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'provinces-63.json'), 'utf8'));
const provinces34Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'provinces-34.json'), 'utf8'));

const nameToSlug63 = new Map();
for (const p of provinces63Data) {
  if (p.name) nameToSlug63.set(p.name.trim().toLowerCase(), p.slug);
  if (p.slug) nameToSlug63.set(p.slug.trim().toLowerCase(), p.slug);
}

const json34BySlug = new Map(provinces34Data.map(p => [p.slug, p]));
const json63BySlug = new Map(provinces63Data.map(p => [p.slug, p]));

function parseMergedFrom(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function resolveMergedSlugs(prov) {
  const mergedFrom = parseMergedFrom(prov.mergedFrom || prov.merged_from);
  const jsonRef = json34BySlug.get(prov.slug);
  const slugs = new Set();
  if (prov.slug) slugs.add(prov.slug);
  if (prov.id) slugs.add(prov.id);
  if (Array.isArray(prov.mergedSlugs)) {
    prov.mergedSlugs.forEach(s => s && slugs.add(s));
  }
  if (jsonRef && Array.isArray(jsonRef.mergedSlugs) && (prov.type === '34' || mergedFrom)) {
    jsonRef.mergedSlugs.forEach(s => s && slugs.add(s));
  }
  if (Array.isArray(mergedFrom)) {
    for (const name of mergedFrom) {
      const mapped = nameToSlug63.get(String(name).trim().toLowerCase());
      if (mapped) slugs.add(mapped);
    }
  }
  return Array.from(slugs);
}

function normalizeProvinceRecord(r, fallbackType) {
  const type = r.type || fallbackType || '63';
  const jsonRef = type === '34' ? json34BySlug.get(r.slug) : json63BySlug.get(r.slug);
  const mergedFrom = parseMergedFrom(r.mergedFrom || r.merged_from) || (jsonRef?.mergedFrom || null);
  const highlights = r.highlights || jsonRef?.highlights || [];
  const note = r.note || jsonRef?.note || null;
  const normalized = {
    ...r,
    id: r.id || r.slug,
    slug: r.slug,
    type,
    regionCode: r.regionCode || r.region_code || jsonRef?.regionCode,
    mergedFrom,
    highlights,
    note
  };
  normalized.mergedSlugs = type === '34'
    ? resolveMergedSlugs(normalized)
    : [normalized.slug];
  return normalized;
}

async function initProvinces(retryAttempt = 0) {
  try {
    console.log('Syncing provinces from JSON to MySQL...');
    try {
      await pool.query('ALTER TABLE provinces DROP INDEX slug');
    } catch (e) { }
    try {
      await pool.query('ALTER TABLE provinces DROP PRIMARY KEY, ADD PRIMARY KEY (id, type)');
    } catch (e) { }

    const insertProvince = async (p, type) => {
      try {
        await pool.execute(
          'INSERT INTO provinces (id, slug, name, type, region_code, capital, image, area, population, description, region, merged_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE slug = VALUES(slug), region_code = VALUES(region_code), image = VALUES(image), description = VALUES(description), name = VALUES(name), capital = VALUES(capital), area = VALUES(area), population = VALUES(population), region = VALUES(region), merged_from = VALUES(merged_from)',
          [p.id || p.slug, p.slug, p.name, type, p.regionCode, p.capital || null, p.image || null, p.area || 0, p.population || 0, p.description || null, p.region || null, p.mergedFrom ? JSON.stringify(p.mergedFrom) : null]
        );
      } catch (e) {
        console.warn(`Failed to upsert province ${p.slug} (${type}):`, e.message);
      }
    };

    // Upsert all 63 & 34 rows FIRST before cleaning stale rows
    for (const p of provinces63Data) { await insertProvince(p, '63'); }
    for (const p of provinces34Data) { await insertProvince(p, '34'); }

    // Clean stale rows safely with FOREIGN_KEY_CHECKS=0 on a dedicated connection
    // so legacy locations_ibfk_2 ON DELETE CASCADE never deletes user locations
    const conn = await pool.getConnection();
    try {
      await conn.query('SET FOREIGN_KEY_CHECKS = 0');
      const valid34Ids = provinces34Data.map(p => p.id || p.slug);
      if (valid34Ids.length > 0) {
        const placeholders34 = valid34Ids.map(() => '?').join(',');
        await conn.execute(
          `DELETE FROM provinces WHERE type = '34' AND id NOT IN (${placeholders34})`,
          valid34Ids
        );
      }
      const valid63Ids = provinces63Data.map(p => p.id || p.slug);
      if (valid63Ids.length > 0) {
        const placeholders63 = valid63Ids.map(() => '?').join(',');
        await conn.execute(
          `DELETE FROM provinces WHERE type = '63' AND id NOT IN (${placeholders63})`,
          valid63Ids
        );
      }
    } finally {
      try { await conn.query('SET FOREIGN_KEY_CHECKS = 1'); } catch (e) { }
      conn.release();
    }

    console.log(`Province sync completed: 63-mode=${provinces63Data.length}, 34-mode=${provinces34Data.length}.`);
  } catch (error) {
    console.error('Failed to init provinces', error.message || error);
    if (retryAttempt < 12) setTimeout(() => initProvinces(retryAttempt + 1), 3000);
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

app.get('/api/provinces/meta/regions', (req, res) => {
  const regions = [
    { code: 'north', label: 'Miền Bắc', icon: '🏔️' },
    { code: 'central', label: 'Miền Trung', icon: '🌊' },
    { code: 'south', label: 'Miền Nam', icon: '🌴' },
    { code: 'highland', label: 'Tây Nguyên', icon: '🌿' }
  ];
  res.json({ success: true, data: regions });
});

app.get('/api/provinces', async (req, res) => {
  const mode = req.query.mode === '34' ? '34' : '63';
  const region = req.query.region;
  const search = req.query.search?.trim().toLowerCase();

  let rows = [];
  try {
    const [dbRows] = await pool.execute('SELECT * FROM provinces WHERE type = ?', [mode]);
    rows = dbRows;
  } catch (error) {
    console.warn('DB query error, fallback to JSON:', error.message);
  }

  const expectedLen = mode === '34' ? provinces34Data.length : provinces63Data.length;
  if (!rows || rows.length === 0 || (mode === '34' && rows.length < expectedLen)) {
    const sourceJSON = mode === '34' ? provinces34Data : provinces63Data;
    rows = sourceJSON.map(p => normalizeProvinceRecord(p, mode));
  } else {
    rows = rows.map(r => normalizeProvinceRecord(r, mode));
  }

  if (region && region !== 'all') {
    rows = rows.filter(r => r.regionCode === region);
  }

  if (search) {
    rows = rows.filter(r =>
      (r.name && r.name.toLowerCase().includes(search)) ||
      (r.capital && r.capital.toLowerCase().includes(search)) ||
      (r.slug && r.slug.toLowerCase().includes(search)) ||
      (Array.isArray(r.mergedFrom) && r.mergedFrom.some(m => String(m).toLowerCase().includes(search)))
    );
  }

  res.json({
    success: true,
    mode,
    total: rows.length,
    data: rows
  });
});

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
        data: normalizeProvinceRecord(rows[0], mode || rows[0].type)
      });
    }

    if (mode === '34') {
      const [all34] = await pool.execute("SELECT * FROM provinces WHERE type = '34'");
      for (const r of all34) {
        const norm = normalizeProvinceRecord(r, '34');
        if (norm.mergedSlugs.includes(slug)) {
          return res.json({ success: true, redirectedFrom: slug, data: norm });
        }
      }
    } else if (mode === '63' && slug === 'hue') {
      const [hue63] = await pool.execute("SELECT * FROM provinces WHERE slug = 'thua-thien-hue' AND type = '63'");
      if (hue63.length > 0) {
        return res.json({ success: true, redirectedFrom: slug, data: normalizeProvinceRecord(hue63[0], '63') });
      }
    }
  } catch (error) {
    console.warn('DB error on single province query, fallback to JSON:', error.message);
  }

  const targetList = mode === '34'
    ? provinces34Data
    : (mode === '63' ? provinces63Data : [...provinces34Data, ...provinces63Data]);

  let found = targetList.find(p => p.id === slug || p.slug === slug);
  if (!found && mode === '34') {
    found = provinces34Data.find(p => resolveMergedSlugs({ ...p, type: '34' }).includes(slug));
  } else if (!found && mode === '63' && slug === 'hue') {
    found = provinces63Data.find(p => p.slug === 'thua-thien-hue');
  }

  if (found) {
    const inferredMode = mode || (found.mergedFrom ? '34' : '63');
    return res.json({
      success: true,
      redirectedFrom: found.slug !== slug ? slug : undefined,
      data: normalizeProvinceRecord(found, inferredMode)
    });
  }

  res.status(404).json({ success: false, message: 'Tỉnh thành không tồn tại' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Province Service running on port ${PORT}`);
});
