import { test, expect } from "@playwright/test";

test.describe("with edit e2e", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.goto("http://localhost:3000/");

    const res = await request.delete("http://localhost:8000/todos");
    if (!res.ok()) {
      throw new Error(`Failed to reset todos: ${res.status()}`);
    }
  });

  test("should edit the todo and save on enter", async ({ page }) => {
    await page.locator(".input").fill("First task");
    await page.keyboard.press("Enter");

    const task = page.locator(".task", { hasText: "First task" });
    await expect(task).toBeVisible();

    await task.locator(".fa-pen").click();
    await task.locator(".edit-todo").fill("Updated task");
    await task.locator(".edit-todo").press("Enter");

    await expect(
      page.locator(".task", { hasText: "Updated task" })
    ).toBeVisible();
  });

  test("should cancel edit and delete the todo", async ({ page }) => {
    // Add todo
    await page.locator(".input").fill("Todo task");
    await page.keyboard.press("Enter");

    const task = page.locator(".task", { hasText: "Todo task" });
    await expect(task).toBeVisible();

    // Click edit
    await task.locator(".fa-pen").click();

    // Edit text but cancel by clicking edit again
    await task.locator(".edit-todo").fill("Edited to do");
    await task.locator(".fa-pen").click(); // Toggling edit mode again (cancel edit)


    await expect(page.locator(".task", { hasText: "Todo task" })).toBeVisible();
    await expect(
      page.locator(".task", { hasText: "Edited to do" })
    ).toHaveCount(0);

    // Delete the todo
    await task.locator(".fa-trash").click();
    await expect(page.locator(".task", { hasText: "Todo task" })).toHaveCount(
      0
    );
  });
  test("should reopen edit after cancelling and allow further editing", async ({
    page,
  }) => {
    const timestamp = new Date().toLocaleString();
    const originalText = `To do ${timestamp}`;
    const firstEdit = `Edit text ${timestamp}`;
    const secondEdit = `Edit the edited text ${timestamp}`;

    // Add todo
    await page.locator(".input").fill(originalText);
    await page.keyboard.press("Enter");

    const task = page.locator(".task", { hasText: originalText });
    await expect(task).toBeVisible();

    // Click edit icon
    await task.locator(".fa-pen").click();

    // Edit text
    const input = task.locator(".edit-todo");
    await input.fill(firstEdit);

    // Cancel the edit (toggle off edit mode)
    await task.locator(".fa-pen").click();
    //expect after cancel edit, the old text shows
    await expect(task).toBeVisible();

    // Reopen edit
    await task.locator(".fa-pen").click();
    await expect(input).toBeVisible();
    await expect(input).toHaveValue(firstEdit);

    // Edit again but this time save the edited text
    await input.fill(secondEdit);
    await input.press("Enter");

    // Verify the final edited text is visible
    const updatedTask = page.locator(".task", { hasText: secondEdit });
    await expect(updatedTask).toBeVisible();
  });

  test("should edit one todo and add another", async ({ page }) => {

    //add a todo
    await page.waitForSelector(".input"); 
    const input = page.locator(".input");
    await input.fill("First item");
    await page.keyboard.press("Enter");

    const first = page.locator(".task", { hasText: "First item" });

    await first.locator(".fa-pen").click();
    await first.locator(".edit-todo").fill("First edited item");
    await first.locator(".edit-todo").press("Enter");

    await page.locator(".input").fill("Second item");
    await page.keyboard.press("Enter");

    await expect(
      page.locator(".task", { hasText: "First edited item" })
    ).toBeVisible();
    await expect(
      page.locator(".task", { hasText: "Second item" })
    ).toBeVisible();
  });

  test("edit all the added to dos, mark as done", async ({ page }) => {
    // Add todos
    await page.waitForSelector(".input");
    const input = page.locator(
      'input.input[placeholder="Enter your todo...."]'
    );

    await input.fill("item one done");
    await page.keyboard.press("Enter");

    await page.waitForSelector(".input");
    await input.fill("item two done");
    await page.keyboard.press("Enter");

    await page.waitForSelector(".input");
    await input.fill("item three done");
    await page.keyboard.press("Enter");

    // Verify todos are added
    await expect(page.locator(".task").nth(0)).toContainText("item three done");
    await expect(page.locator(".task").nth(1)).toContainText("item two done");
    await expect(page.locator(".task").nth(2)).toContainText("item one done");

    // Mark all items as done by clicking them
    const tasks = await page.locator(".task").all();
    for (const task of tasks) {
      await task.click();
    }

    // Verify items are marked as done
    for (const task of tasks) {
      await expect(task).toHaveCSS("text-decoration", /line-through/);
    }

  });

  test("should delete the todo in an editing state", async({page})=> {
    //add todo
    const input = page.locator(".input");
    await input.fill("Not in editing state");
    await page.keyboard.press("Enter");

    const task = page.locator(".task", { hasText: "Not in editing state" });
    await expect(task).toBeVisible();
    //edit
    await task.locator(".fa-pen").click();

    // Edit text
    const inputEdit = task.locator(".edit-todo")
    await inputEdit.fill("In editing state");

    const editingStateTask = page.locator(".task", { hasText: "In editing state" });
    await expect(editingStateTask).toBeVisible();

    //click delete while in editing state
    await task.locator(".fa-trash").click();

    await expect(editingStateTask).not.toBeVisible();
    await expect(page.locator(".task")).toHaveCount(0);


  
  })
});
