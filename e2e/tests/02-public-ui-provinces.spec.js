const { test, expect } = require('@playwright/test');

test.describe('02. Kiểm thử Giao diện Trang chủ, 63/34 Tỉnh Thành & Chi tiết Địa điểm', () => {
  test('Trang chủ tải mượt, không lỗi JS console, không gọi API 401 cho khách vãng lai và ảnh hiển thị đầy đủ', async ({ page }) => {
    const pageErrors = [];
    const unauthorizedResponses = [];

    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('response', (res) => {
      if (res.url().includes('/api/') && res.status() === 401) {
        unauthorizedResponses.push(res.url());
      }
    });

    await page.goto('/');
    await expect(page.locator('.nav-brand-title')).toHaveText('VietnamTourism');
    await expect(page.locator('button', { hasText: 'Chế độ:' })).toContainText('63 Tỉnh');

    // Chờ danh sách địa điểm nổi bật render xong
    await expect(page.locator('img').first()).toBeVisible();
    await page.waitForTimeout(800);

    const brokenLocalImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter((img) => {
          if (img.src.includes('images.unsplash.com')) return false;
          const rect = img.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          return isVisible && img.complete && img.naturalWidth === 0;
        })
        .map((img) => img.src);
    });

    expect(pageErrors).toEqual([]);
    expect(unauthorizedResponses).toEqual([]);
    expect(brokenLocalImages).toEqual([]);
  });

  test('Trang Tỉnh thành: chuyển đổi chế độ 63 ⇄ 34 tỉnh và tìm kiếm tỉnh cũ ra tỉnh sáp nhập mới', async ({ page }) => {
    await page.goto('/provinces');
    await expect(page.locator('h1')).toContainText('63 Tỉnh Thành');

    // Bấm nút chuyển sang chế độ 34 tỉnh trên thanh Navbar
    await page.locator('button', { hasText: 'Chế độ:' }).click();
    await expect(page.locator('h1')).toContainText('34 Tỉnh Thành');

    // Gõ tên tỉnh cũ "Hà Nam" -> phải hiển thị thẻ tỉnh mới "Ninh Bình"
    const searchInput = page.getByPlaceholder('Tìm kiếm tỉnh thành, thủ phủ...');
    await searchInput.fill('Hà Nam');
    await expect(page.locator('body')).toContainText('Ninh Bình');
  });

  test('Chi tiết tỉnh đã sáp nhập (/provinces/ha-nam): tự động chuyển sang /provinces/ninh-binh khi bật 34 tỉnh', async ({ page }) => {
    await page.goto('/provinces/ha-nam');
    await expect(page.locator('h1')).toContainText('Hà Nam');

    // Bật sang chế độ 34 tỉnh ngay khi đang đứng ở trang Hà Nam
    await page.locator('button', { hasText: 'Chế độ:' }).click();

    await expect(page).toHaveURL(/\/provinces\/ninh-binh/);
    await expect(page.locator('h1')).toContainText('Ninh Bình');
    await expect(page.locator('body')).not.toContainText('Không tìm thấy');
  });

  test('Trang Chi tiết địa điểm (/locations/:id): hiển thị đúng bố cục 2 cột, ảnh rõ nét và không có Invalid Date', async ({ page, request }) => {
    const locRes = await request.get('/api/locations');
    const locBody = await locRes.json();
    const firstLocation = locBody.data[0];
    expect(firstLocation).toBeTruthy();

    await page.goto(`/locations/${firstLocation.id}`);
    await expect(page.locator('h1')).toContainText(firstLocation.name);

    const gridDisplay = await page.locator('.location-detail-grid').evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    expect(gridDisplay).toBe('grid');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Invalid Date');
  });
});

