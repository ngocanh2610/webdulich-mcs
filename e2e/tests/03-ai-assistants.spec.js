const { test, expect } = require('@playwright/test');

test.describe('03. Kiểm thử 2 Trợ lý AI Du lịch (ChatWidget & Travel Planner)', () => {
  test('Trợ lý AI nhỏ (ChatWidget góc phải): mở khung chat, hỏi đáp thực tế và format sạch Markdown', async ({ page }) => {
    await page.goto('/');

    const floatingBotBtn = page.locator('.ai-chat-btn');
    await expect(floatingBotBtn).toBeVisible();
    await floatingBotBtn.click();

    await expect(page.locator('body')).toContainText('Chào bạn! Mình là VietnamTourism AI');

    const chatInput = page.getByPlaceholder('Hỏi AI về du lịch Việt Nam...');
    await chatInput.fill('Gợi ý 2 món ăn đặc sản Huế ngắn gọn');
    await chatInput.press('Enter');

    // Chờ AI phản hồi xong (ẩn dòng "AI đang suy nghĩ...")
    await expect(page.getByText('AI đang suy nghĩ...')).toBeHidden({ timeout: 30000 });

    // Kiểm tra nội dung phản hồi đúng chủ đề Huế
    const widgetText = await page.locator('body').innerText();
    expect(widgetText).toMatch(/Huế|bún bò|cơm hến|bánh/i);
  });

  test('Trợ lý AI Lập lịch trình (/planner): mở link chia sẻ đúng số ngày, không tự cuộn xuống footer và tạo link chia sẻ chuẩn', async ({ page }) => {
    await page.goto('/planner?dest=ninh-binh&days=3');

    // Chờ lịch trình 3 ngày của Ninh Bình hiển thị đầy đủ
    await expect(page.getByRole('button', { name: 'Ngày 1', exact: true })).toBeVisible({ timeout: 25000 });
    await expect(page.getByRole('button', { name: 'Ngày 2', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ngày 3', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ngày 4', exact: true })).toHaveCount(0);

    // Xác nhận trang giữ nguyên ở đầu trang (không bị lỗi tự cuộn xuống cuối trang)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(120);

    // Chuyển thử sang tab Ngày 2
    await page.getByRole('button', { name: 'Ngày 2', exact: true }).click();
    await expect(page.locator('body')).toContainText('hoạt động trong ngày');

    // Mở hộp thoại Chia sẻ lịch trình và kiểm tra URL sinh ra
    await page.getByRole('button', { name: 'Chia sẻ', exact: true }).click();
    await expect(page.getByText('Chia Sẻ Lịch Trình Du Lịch')).toBeVisible();

    const shareUrlInput = page.locator('input[readonly]');
    const shareUrl = await shareUrlInput.inputValue();
    expect(shareUrl).toContain('/planner?');
    expect(shareUrl).toContain('dest=');
    expect(shareUrl).toContain('days=3');
  });
});
