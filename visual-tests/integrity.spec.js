import { test, expect } from '@playwright/test';

/**
 * ELITE VISUAL REGRESSION TESTING
 * Objective: Detect UI breakage across MFEs during cross-modular deployments.
 */

const TARGET_URL = process.env.BASE_URL || 'https://stuffy-supermarket.onrender.com';

test.describe('Stuffy Supermarket - Cross-MFE Visual Integrity', () => {
  
  test('Home Page Visual Consistency', async ({ page }) => {
    // Increase timeout for cold starts on Render
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    
    await expect(page).toHaveScreenshot('homepage-baseline.png', {
       maxDiffPixels: 200, 
       threshold: 0.2,
    });
  });

  test('Module Header Integrity', async ({ page }) => {
    await page.goto(TARGET_URL, { timeout: 60000 });
    const header = page.locator('header');
    await header.waitFor({ state: 'visible', timeout: 15000 });
    
    await expect(header).toHaveScreenshot('header-module.png');
  });

  test('Product Catalog Layout Verification', async ({ page }) => {
    await page.goto(`${TARGET_URL}/products`, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Using the real class defined in Design System
    await page.waitForSelector('.ds-glass-card', { timeout: 20000 });
    
    await expect(page).toHaveScreenshot('product-grid.png');
  });

  test('AI Copilot UI State', async ({ page }) => {
    await page.goto(TARGET_URL, { timeout: 60000 });
    
    const copilotBtn = page.locator('.ai-copilot-toggle');
    await copilotBtn.waitFor({ state: 'visible', timeout: 15000 });
    await copilotBtn.click();
    
    const chatWindow = page.locator('.ai-copilot-window');
    await chatWindow.waitFor({ state: 'visible', timeout: 10000 });
    
    await expect(chatWindow).toHaveScreenshot('ai-copilot-active.png', {
      mask: [page.locator('.chat-messages')] // Mask dynamic chat content
    });
  });
});
