const { test, expect } = require('@playwright/test');

const ADMIN_USER = process.env.E2E_ADMIN_USER || 'e2e_admin';
const ADMIN_PASS = process.env.E2E_ADMIN_PASS || '';
const NORMAL_USER = process.env.E2E_USER_USER || 'e2e_user';
const NORMAL_PASS = process.env.E2E_USER_PASS || '';

test.describe('04. Kiểm thử Xác thực, Phân quyền & Luồng Đăng bài - Admin Duyệt bài', () => {
  test('Trang /auth: báo lỗi khi sai mật khẩu, chuyển mượt giữa Đăng nhập / Đăng ký / Quên mật khẩu và chặn khách vào trang Admin', async ({ page }) => {
    await page.goto('/auth');
    const main = page.getByRole('main');
    await expect(main.locator('h1')).toHaveText('Chào mừng trở lại');

    await main.getByPlaceholder('Nhập username hoặc email').fill('khong_ton_tai_user_e2e');
    await main.getByPlaceholder('Nhập mật khẩu').fill('SaiMatKhau123!');
    await main.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

    // Phải hiển thị thông báo lỗi đăng nhập
    await expect(main.locator('form')).toBeVisible();
    await expect(main).toContainText(/không tồn tại|không chính xác|sai|thất bại/i);

    // Chuyển sang form Đăng ký
    await main.getByRole('button', { name: 'Đăng ký ngay', exact: true }).click();
    await expect(main.locator('h1')).toHaveText('Tạo tài khoản mới');

    // Quay lại Đăng nhập rồi sang Quên mật khẩu
    await main.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await main.getByRole('button', { name: 'Quên mật khẩu?', exact: true }).click();
    await expect(main.locator('h1')).toHaveText('Khôi phục mật khẩu');

    // Khách chưa đăng nhập cố truy cập /admin/approvals phải bị đẩy về /auth
    await page.goto('/admin/approvals');
    await expect(page).toHaveURL(/\/auth/);
  });

  test('Luồng E2E khép kín: User đăng nhập gửi bài chờ duyệt -> Admin duyệt bài trên giao diện -> Tương tác & Dọn sạch dữ liệu', async ({ browser, request }) => {
    test.skip(
      !ADMIN_PASS || !NORMAL_PASS,
      'Bỏ qua test ghi dữ liệu khi không cấu hình tài khoản E2E (tự động chạy 100% trên GitHub Actions CI)'
    );

    let createdLocationId = null;
    let adminToken = '';

    try {
      // 1. User đăng nhập thật trên giao diện /auth
      const userContext = await browser.newContext();
      const userPage = await userContext.newPage();
      await userPage.goto('/auth');
      const userMain = userPage.getByRole('main');
      await userMain.getByPlaceholder('Nhập username hoặc email').fill(NORMAL_USER);
      await userMain.getByPlaceholder('Nhập mật khẩu').fill(NORMAL_PASS);
      await userMain.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

      await expect(userPage).toHaveURL('/');
      const userToken = await userPage.evaluate(() => localStorage.getItem('token'));
      expect(userToken).toBeTruthy();

      // 2. User gửi bài đăng địa điểm mới -> Trạng thái phải là "pending"
      const uniqueName = `[E2E CI] Điểm du lịch kiểm thử ${Date.now()}`;
      const createRes = await request.post('/api/locations', {
        headers: { Authorization: `Bearer ${userToken}` },
        data: {
          provinceId: 'ha-nam',
          name: uniqueName,
          type: 'discovery',
          description: 'Bài đăng tự động từ Playwright CI/CD để kiểm thử luồng duyệt bài của Admin.',
          tags: ['Playwright', 'E2E'],
          images: ['/api/media/uploads/ha-nam-tam-chuc.jpg']
        }
      });
      expect(createRes.status()).toBe(200);
      const createBody = await createRes.json();
      expect(createBody.success).toBe(true);
      expect(createBody.data.status).toBe('pending');
      createdLocationId = createBody.data.id;

      // Bài chờ duyệt chưa được phép lộ ra danh sách công khai
      const publicBeforeRes = await request.get(`/api/locations?search=${encodeURIComponent(uniqueName)}`);
      const publicBeforeBody = await publicBeforeRes.json();
      expect(publicBeforeBody.data.some((l) => l.id === createdLocationId)).toBe(false);

      await userContext.close();

      // 3. Admin đăng nhập trên trình duyệt và vào trang /admin/approvals bấm nút "Duyệt bài"
      const adminContext = await browser.newContext();
      const adminPage = await adminContext.newPage();
      await adminPage.goto('/auth');
      const adminMain = adminPage.getByRole('main');
      await adminMain.getByPlaceholder('Nhập username hoặc email').fill(ADMIN_USER);
      await adminMain.getByPlaceholder('Nhập mật khẩu').fill(ADMIN_PASS);
      await adminMain.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

      await expect(adminPage).toHaveURL('/');
      adminToken = await adminPage.evaluate(() => localStorage.getItem('token'));
      expect(adminToken).toBeTruthy();

      await adminPage.goto('/admin/approvals');
      await expect(adminPage.locator('h1')).toContainText('Duyệt Bài Đăng');
      const cardHeading = adminPage.locator('h3', { hasText: uniqueName });
      await expect(cardHeading).toBeVisible();

      // Tìm đúng thẻ bài viết vừa tạo (ancestor::div[2]) và bấm "Duyệt bài"
      const targetCard = cardHeading.locator('xpath=ancestor::div[2]');
      await targetCard.getByRole('button', { name: 'Duyệt bài', exact: true }).click();

      await expect(adminPage.locator('body')).toContainText(`Đã duyệt bài viết "${uniqueName}" thành công`);
      await adminContext.close();

      // 4. Kiểm tra bài viết đã xuất hiện công khai + User nhận thông báo hợp lệ + Thả tim & Bình luận thành công
      const publicAfterRes = await request.get(`/api/locations/${createdLocationId}`);
      expect(publicAfterRes.status()).toBe(200);
      const publicAfterBody = await publicAfterRes.json();
      expect(publicAfterBody.data.status).toBe('approved');

      let approvedNotif = null;
      await expect
        .poll(
          async () => {
            const notifRes = await request.get('/api/locations/notifications', {
              headers: { Authorization: `Bearer ${userToken}` }
            });
            if (notifRes.status() !== 200) return false;
            const notifBody = await notifRes.json();
            approvedNotif = (notifBody.data || []).find((n) => n.locationId === createdLocationId) || null;
            return Boolean(approvedNotif);
          },
          { timeout: 10000 }
        )
        .toBe(true);
      expect(String(new Date(approvedNotif.createdAt))).not.toBe('Invalid Date');

      const reactRes = await request.post(`/api/locations/${createdLocationId}/react`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      expect(reactRes.status()).toBe(200);

      const commentRes = await request.post(`/api/locations/${createdLocationId}/comments`, {
        headers: { Authorization: `Bearer ${userToken}` },
        data: { content: 'Bình luận tự động từ Playwright E2E!' }
      });
      expect(commentRes.status()).toBe(200);
    } finally {
      // 5. Luôn dọn sạch dữ liệu kiểm thử sau khi chạy xong
      if (createdLocationId && adminToken) {
        await request.delete(`/api/locations/${createdLocationId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      }
    }
  });
});
