import { test, expect } from '@playwright/test';

test.describe("Active Todo", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/");
    });

    test("should display only active todos when the active filter is clicked", async ({ page }) => {
        const activeTodoText1 = `Active Todo 1 ${Date.now()}`;
        const activeTodoText2 = `Active Todo 2 ${Date.now()}`;
        const completedTodoText = `Completed Todo ${Date.now()}`;

        await page.fill('input[placeholder="Enter your todo...."]', activeTodoText1);
        await page.keyboard.press('Enter');
        await page.fill('input[placeholder="Enter your todo...."]', activeTodoText2);
        await page.keyboard.press('Enter');

        await page.fill('input[placeholder="Enter your todo...."]', completedTodoText);
        await page.keyboard.press('Enter');
        const completedTodoItem = page.locator('li.task', { hasText: completedTodoText });
        await completedTodoItem.click(); 

        await page.click('button:has-text("Active")');

        const activeTodo1 = page.locator('li.task', { hasText: activeTodoText1 });
        const activeTodo2 = page.locator('li.task', { hasText: activeTodoText2 });
        const completedTodo = page.locator('li.task', { hasText: completedTodoText });

        await expect(activeTodo1).toBeVisible();
        await expect(activeTodo2).toBeVisible();
        await expect(completedTodo).not.toBeVisible();
    });
});