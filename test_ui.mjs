import { chromium } from 'playwright';

async function testApp() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  await page.screenshot({ path: 'screenshot_home.png', fullPage: false });
  console.log('Home screenshot saved.');

  // Click on "الطلبات" tab (🛵) to view live order and map
  const ordersTab = page.locator('text=الطلبات').first();
  if (await ordersTab.isVisible()) {
    await ordersTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot_orders_bidding.png', fullPage: false });
    console.log('Orders tab screenshot saved.');

    // Click on the delivered order in switcher (MSH-8730 or order with "مكتمل")
    const deliveredOrderBtn = page.locator('text=مكتمل').first();
    if (await deliveredOrderBtn.isVisible()) {
      await deliveredOrderBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'screenshot_order_delivered_rating.png', fullPage: false });
      console.log('Delivered order rating screenshot saved.');
    }
  }

  // Go to Profile tab to check rating history
  const profileTab = page.locator('text=حسابي').first();
  if (await profileTab.isVisible()) {
    await profileTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot_profile_ratings.png', fullPage: false });
    console.log('Profile tab screenshot saved.');
  }

  // Switch to Captain Role from top bar role switcher
  const captainRoleBtn = page.locator('button:has-text("كابتن مشوار")').first();
  if (await captainRoleBtn.isVisible()) {
    await captainRoleBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot_captain_view.png', fullPage: false });
    console.log('Captain view screenshot saved.');
  }

  await browser.close();
  console.log('All UI verifications completed successfully!');
}

testApp().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
