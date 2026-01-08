import { test, expect } from '@playwright/test';

test('login and load companies list', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username / email').fill('admin');
  await page.getByLabel('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Companies' })).toBeVisible();
  await expect(page.locator('table')).toBeVisible();
});

