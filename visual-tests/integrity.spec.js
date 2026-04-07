import { test, expect } from '@playwright/test';

/**
 * ELITE VISUAL REGRESSION TESTING
 * Objective: Detect UI breakage across MFEs during cross-modular deployments.
 */

const TARGET_URL = process.env.BASE_URL || 'https://stuffy-supermarket.onrender.com';

test.describe('Stuffy Supermarket - Cross-MFE Visual Integrity', () => {
  
  test('Home Page Visual Consistency', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    
    // 1. Snapshot the whole page
    await expect(page).toHaveScreenshot('homepage-baseline.png', {
       maxDiffPixels: 100, // Strict threshold for premium quality
       threshold: 0.1,    // Sensitivity
    });
  });

  test('Module Header Integrity', async ({ page }) => {
    await page.goto(TARGET_URL);
    const header = page.locator('header');
    
    // Ensure Header hasn't shifted or broken layout of following elements
    await expect(header).toHaveScreenshot('header-module.png');
  });

  test('Product Catalog Layout Verification', async ({ page }) => {
    await page.goto(`${TARGET_URL}/products`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    
    // Detect if Header changes overlapped the product grid
    await expect(page).toHaveScreenshot('product-grid.png');
  });

  test('AI Copilot UI State', async ({ page }) => {
    await page.goto(TARGET_URL);
    const copilotBtn = page.locator('button:has-text("💬")');
    await copilotBtn.click();
    
    // Capture AI Chat window visual state
    const chatWindow = page.locator('.chat-window'); // adjust selector
    await expect(chatWindow).toHaveScreenshot('ai-copilot-active.png');
  });
});
