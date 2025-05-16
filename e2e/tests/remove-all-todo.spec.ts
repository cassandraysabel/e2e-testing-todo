import { test, expect } from "@playwright/test";

test.describe("remove all done todos", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.goto("http://localhost:3000/");

    const res = await request.delete("http://localhost:8000/todos");
    if (!res.ok()) {
      throw new Error(`Failed to reset todos: ${res.status()}`);
    }
  });
  test("should add todos, mark it as done and remove all the done todos", async ({
    page,
  }) => {
    await page.locator(".input").fill("First task to mark as done");
    await page.keyboard.press("Enter");
    const task1 = page.locator(".task", {
      hasText: "First task to mark as done",
    });
    await expect(task1).toBeVisible();

    await page.locator(".input").fill("Second task to mark as done");
    await page.keyboard.press("Enter");
    const task2 = page.locator(".task", {
      hasText: "Second task to mark as done",
    });
    await expect(task2).toBeVisible();

    await page.locator(".input").fill("Third task to mark as done");
    await page.keyboard.press("Enter");
    const task3 = page.locator(".task", {
      hasText: "Third task to mark as done",
    });
    await expect(task3).toBeVisible();

    await page.locator(".input").fill("Fourth task to mark as done");
    await page.keyboard.press("Enter");
    const task4 = page.locator(".task", {
      hasText: "Fourth task to mark as done",
    });
    await expect(task4).toBeVisible();

    await page.locator(".input").fill("Fifth task to mark as done");
    await page.keyboard.press("Enter");
    const task5 = page.locator(".task", {
      hasText: "Fifth task to mark as done",
    });
    await expect(task5).toBeVisible();

    await expect(page.locator(".task").nth(0)).toContainText(
      "Fifth task to mark as done"
    );
    await expect(page.locator(".task").nth(1)).toContainText(
      "Fourth task to mark as done"
    );
    await expect(page.locator(".task").nth(2)).toContainText(
      "Third task to mark as done"
    );
    await expect(page.locator(".task").nth(3)).toContainText(
      "Second task to mark as done"
    );
    await expect(page.locator(".task").nth(4)).toContainText(
      "First task to mark as done"
    );

    const tasks = await page.locator(".task").all();
    for (const task of tasks) {
      await task.click();
    }

    for (const task of tasks) {
      await expect(task).toHaveCSS("text-decoration", /line-through/);
    }

    const removeDoneButton = page.locator(
      'button:has-text("Remove Done Todos")'
    );
    if (await removeDoneButton.isVisible()) {
      await removeDoneButton.click();
    }

    await expect(page.locator(".task")).toHaveCount(0);
  });

  test("should be able to remove all done to do even in active todo tab", async({page})=> {
    await page.locator(".input").fill("First task to mark as done");
    await page.keyboard.press("Enter");
    const task1 = page.locator(".task", {
      hasText: "First task to mark as done",
    });
    await expect(task1).toBeVisible();

    await page.locator(".input").fill("Second task to mark as done");
    await page.keyboard.press("Enter");
    const task2 = page.locator(".task", {
      hasText: "Second task to mark as done",
    });
    await expect(task2).toBeVisible();

    await page.locator(".input").fill("Third task to mark as done");
    await page.keyboard.press("Enter");
    const task3 = page.locator(".task", {
      hasText: "Third task to mark as done",
    });
    await expect(task3).toBeVisible();

    await page.locator(".input").fill("Fourth task to mark as done");
    await page.keyboard.press("Enter");
    const task4 = page.locator(".task", {
      hasText: "Fourth task to mark as done",
    });
    await expect(task4).toBeVisible();

    await page.locator(".input").fill("Fifth task to mark as done");
    await page.keyboard.press("Enter");
    const task5 = page.locator(".task", {
      hasText: "Fifth task to mark as done",
    });
    await expect(task5).toBeVisible();

    await expect(page.locator(".task").nth(0)).toContainText(
      "Fifth task to mark as done"
    );
    await expect(page.locator(".task").nth(1)).toContainText(
      "Fourth task to mark as done"
    );
    await expect(page.locator(".task").nth(2)).toContainText(
      "Third task to mark as done"
    );
    await expect(page.locator(".task").nth(3)).toContainText(
      "Second task to mark as done"
    );
    await expect(page.locator(".task").nth(4)).toContainText(
      "First task to mark as done"
    );

    const tasks = await page.locator(".task").all();
    for (const task of tasks) {
      await task.click();
    }

    for (const task of tasks) {
      await expect(task).toHaveCSS("text-decoration", /line-through/);
    }

    
    const removeDoneButton = page.locator(
        'button:has-text("Remove Done Todos")'
    );
    
    await expect(removeDoneButton).toBeVisible();
    
    await page.locator("text=ACTIVE").click()

    await expect(removeDoneButton).toBeVisible();

    await removeDoneButton.click();

    await expect(page.locator(".task")).toHaveCount(0);


  })
});
