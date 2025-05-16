import { test, expect } from '@playwright/test';

test.describe("Add todo and filters the active ones", () => {
  test.beforeEach(async ({ page, request }) => {
    const res = await request.delete("http://localhost:8000/todos");
    if (!res.ok()) {
      throw new Error(`Failed to reset todos: ${res.status()}`);
    }
    await page.goto("http://localhost:3000/");
  });

  test("should add a todo and verify it exists in the active filter", async ({ page }) => {
    const todoText = `Active Todo ${Date.now()}`;
    await page.fill('input[placeholder="Enter your todo...."]', todoText);
    await page.keyboard.press('Enter');

    await page.click('button:has-text("Active")');

    const activeTodo = page.locator('li.task', { hasText: todoText });
    await expect(activeTodo).toBeVisible();
  });

  test("should add multiple todos and verify only active todos are displayed", async ({ page }) => {
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