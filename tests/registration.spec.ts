import { test, expect } from "@playwright/test";

test("успішна реєстрація", async ({ page }) => {
    await page.goto("http://localhost:5173/register");

    await page.getByTestId("email-input").fill("user@example.com");
    await page.getByTestId("password-input").fill("12345678");
    await page.getByTestId("submit-button").click();

    await expect(page.getByText("Registration successful")).toBeVisible();
});
