import { test, expect } from '@playwright/test';

test.describe("Todo", () => {
    test.beforeEach(async({page})=> {
        await page.goto("http://localhost:3000/")
    });

    test("should add new todo", async({page})=> {
        const todoText = `Test Todo ${Date.now().toLocaleString()}`;

        await page.fill('input[placeholder="Enter your todo...."]', todoText);
        await page.keyboard.press('Enter');

        await expect(page.locator('li.task', { hasText: todoText }).first()).toBeVisible();
    });
});