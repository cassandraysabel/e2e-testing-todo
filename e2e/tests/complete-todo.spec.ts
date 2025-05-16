import { test, expect } from '@playwright/test';

test.describe("Completed Todo Filter", () => {
  test.beforeEach(async ({ page, request }) => {
    const res = await request.delete("http://localhost:8000/todos");
    if (!res.ok()) {
      throw new Error(`Failed to reset todos: ${res.status()}`);
    }

    await page.goto("http://localhost:3000/");
  });

  test("should display only completed todos when the Done Todo filter is clicked", async ({ page }) => {
    const activeTodoText1 = `Active Todo 1 ni Casi ${Date.now()}`;
    const activeTodoText2 = `Active Todo 2 ni Casi ${Date.now()}`;
    const completedTodoText1 = `Completed Todo 1 ni Casi ${Date.now()}`;
    const completedTodoText2 = `Completed Todo 2 ni Casi ${Date.now()}`;

    // Add active todos
    await page.fill('input[placeholder="Enter your todo...."]', activeTodoText1);
    await page.keyboard.press('Enter');
    await page.fill('input[placeholder="Enter your todo...."]', activeTodoText2);
    await page.keyboard.press('Enter');

    await page.fill('input[placeholder="Enter your todo...."]', completedTodoText1);
    await page.keyboard.press('Enter');
    const completedTodoItem1 = page.locator('li.task', { hasText: completedTodoText1 });
    await completedTodoItem1.click(); 

    await page.fill('input[placeholder="Enter your todo...."]', completedTodoText2);
    await page.keyboard.press('Enter');
    const completedTodoItem2 = page.locator('li.task', { hasText: completedTodoText2 });
    await completedTodoItem2.click(); 

    await page.click('button:has-text("Done Todo")');

    const activeTodo1 = page.locator('li.task', { hasText: activeTodoText1 });
    const activeTodo2 = page.locator('li.task', { hasText: activeTodoText2 });
    const completedTodo1 = page.locator('li.task', { hasText: completedTodoText1 });
    const completedTodo2 = page.locator('li.task', { hasText: completedTodoText2 });

    await expect(completedTodo1).toBeVisible();
    await expect(completedTodo2).toBeVisible();
    await expect(activeTodo1).not.toBeVisible();
    await expect(activeTodo2).not.toBeVisible();
  });
});