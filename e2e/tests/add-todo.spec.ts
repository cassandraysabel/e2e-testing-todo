import { test, expect } from '@playwright/test';

test.describe("Todo", () => {
    test.beforeEach(async({page})=> {
        await page.goto("http://localhost:3000/")
    })
})