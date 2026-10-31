const { test, expect } = require('@playwright/test');

test.describe('01. Kiểm thử API Gateway & 5 Microservices', () => {
  test('API Gateway /health hoạt động và các route /api hỗ trợ đầy đủ CORS (bao gồm PATCH)', async ({ request }) => {
    const res = await request.get('/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('api-gateway');

    const apiRes = await request.get('/api/provinces?mode=34');
    expect(apiRes.status()).toBe(200);
    const allowMethods = apiRes.headers()['access-control-allow-methods'] || '';
    expect(allowMethods).toContain('PATCH');
    expect(allowMethods).toContain('PUT');
    expect(allowMethods).toContain('DELETE');
  });

  test('Province Service: trả về đủ 63 tỉnh và 34 tỉnh sáp nhập bao phủ trọn vẹn 63 tỉnh cũ', async ({ request }) => {
    const res63 = await request.get('/api/provinces?mode=63');
    expect(res63.status()).toBe(200);
    const body63 = await res63.json();
    expect(body63.success).toBe(true);
    expect(body63.data).toHaveLength(63);

    for (const p of body63.data) {
      expect(p.thumbnail || '').not.toContain('wikimedia.org');
    }

    const res34 = await request.get('/api/provinces?mode=34');
    expect(res34.status()).toBe(200);
    const body34 = await res34.json();
    expect(body34.success).toBe(true);
    expect(body34.data).toHaveLength(34);

    const coveredSlugs = new Set();
    for (const p of body34.data) {
      expect(Array.isArray(p.mergedSlugs)).toBe(true);
      expect(p.mergedSlugs.length).toBeGreaterThan(0);
      for (const s of p.mergedSlugs) coveredSlugs.add(s);
    }

    // Toàn bộ 63 slug tỉnh cũ đều phải nằm trong tập mergedSlugs của 34 tỉnh mới
    for (const p63 of body63.data) {
      expect(coveredSlugs.has(p63.slug)).toBe(true);
    }
  });

  test('Province Service: tự động ánh xạ slug tỉnh cũ sang tỉnh mới ở chế độ 34 tỉnh', async ({ request }) => {
    const resMerged = await request.get('/api/provinces/ha-nam?mode=34');
    expect(resMerged.status()).toBe(200);
    const bodyMerged = await resMerged.json();
    expect(bodyMerged.success).toBe(true);
    expect(bodyMerged.data.slug).toBe('ninh-binh');
    expect(bodyMerged.data.mergedFrom).toContain('Hà Nam');

    const resSearch = await request.get('/api/provinces?mode=34&q=' + encodeURIComponent('Bà Rịa'));
    expect(resSearch.status()).toBe(200);
    const bodySearch = await resSearch.json();
    expect(bodySearch.success).toBe(true);
    const slugs = bodySearch.data.map(p => p.slug);
    expect(slugs).toContain('tp-hcm');
  });

  test('Location Service & Media Service: dữ liệu địa điểm hợp lệ, phục vụ ảnh thật và chặn upload file rác', async ({ request }) => {
    const locRes = await request.get('/api/locations');
    expect(locRes.status()).toBe(200);
    const locBody = await locRes.json();
    expect(locBody.success).toBe(true);
    expect(locBody.data.length).toBeGreaterThan(0);

    for (const loc of locBody.data) {
      expect(loc.status).toBe('approved');
      expect(loc.image || '').not.toContain('wikimedia.org');
    }

    const imgRes = await request.get('/api/media/uploads/ha-nam-tam-chuc.jpg');
    expect(imgRes.status()).toBe(200);
    expect(imgRes.headers()['content-type'] || '').toContain('image/');

    const badUploadRes = await request.post('/api/media/upload', {
      multipart: {
        image: {
          name: 'malicious.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('not an image file')
        }
      }
    });
    expect(badUploadRes.status()).toBe(400);
  });

  test('User Service & Phân quyền RBAC: chặn token Google giả mạo và chặn truy cập API Admin không phép', async ({ request }) => {
    const fakeHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const fakePayload = Buffer.from(JSON.stringify({ email: 'attacker@gmail.com', name: 'Attacker', sub: '123456' })).toString('base64url');
    const forgedJwt = `${fakeHeader}.${fakePayload}.forged_signature`;

    const googleRes = await request.post('/api/auth/google', {
      data: { credential: forgedJwt }
    });
    expect(googleRes.status()).toBe(401);

    const usersRes = await request.get('/api/users');
    expect([401, 403]).toContain(usersRes.status());

    const pendingRes = await request.get('/api/locations/admin/pending');
    expect([401, 403]).toContain(pendingRes.status());
  });

  test('AI Service: chat đa lượt, giữ chuẩn số ngày/số khách khi có tháng và nhận diện slug tỉnh không dấu', async ({ request }) => {
    const chatRes = await request.post('/api/chat', {
      data: {
        message: 'Gợi ý ngắn gọn 2 món đặc sản Huế',
        conversationHistory: []
      }
    });
    expect(chatRes.status()).toBe(200);
    const chatBody = await chatRes.json();
    expect(chatBody.success).toBe(true);
    expect((chatBody.reply || '').length).toBeGreaterThan(10);

    const tripRes = await request.post('/api/chat/make-your-trip', {
      data: {
        message: 'Lập lịch trình đi Đà Nẵng 3 ngày 2 người vào tháng 11',
        currentPlan: null,
        conversationHistory: []
      }
    });
    expect(tripRes.status()).toBe(200);
    const tripBody = await tripRes.json();
    expect(tripBody.success).toBe(true);
    expect(tripBody.plan.days).toBe(3);
    expect(tripBody.plan.guests).toBe(2);
    expect(tripBody.plan.dailyItinerary).toHaveLength(3);

    const planRes = await request.post('/api/ai/plan', {
      data: {
        destination: 'gia-lai',
        days: 2,
        guests: 2,
        rooms: 1
      }
    });
    expect(planRes.status()).toBe(200);
    const planBody = await planRes.json();
    expect(planBody.success).toBe(true);
    expect(planBody.plan.destination).toBe('Gia Lai');
    const firstAct = planBody.plan.dailyItinerary[0]?.activities?.[0];
    expect(firstAct.lat).toBeGreaterThan(13.0);
    expect(firstAct.lat).toBeLessThan(15.0);
  });
});
