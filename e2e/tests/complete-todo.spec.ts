import { test, expect } from '@playwright/test';

test.describe("Complete Todo", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/");
    });

    test("should mark a todo as completed", async ({ page }) => {
        const todoText = `Complete Todo ${Date.now()}`;

        await page.fill('input[placeholder="Enter your todo...."]', todoText);
        await page.keyboard.press('Enter');

        const todoItem = page.locator('li.task', { hasText: todoText });

        await todoItem.click();

        await expect(todoItem).toHaveCSS('text-decoration-line', 'line-through');
    });
});