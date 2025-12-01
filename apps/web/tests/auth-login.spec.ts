import { expect, test } from "@playwright/test";

test.describe("login flow", () => {
	test("should load login page", async ({ page }) => {
		await page.goto("/auth/login");

		// Check for login form elements
		await expect(page.getByRole("heading", { name: /sign in|login/i })).toBeVisible();
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(
			page.getByRole("button", { name: /sign in|login/i }),
		).toBeVisible();
	});

	test("should show validation error for invalid credentials", async ({
		page,
	}) => {
		await page.goto("/auth/login");

		// Try to login with invalid credentials
		await page.fill('input[name="email"]', "nonexistent@example.com");
		await page.fill('input[name="password"]', "WrongPassword123!");

		await page.click('button[type="submit"]');

		// Wait for error message
		await expect(
			page.getByText(/invalid credentials|incorrect email or password/i),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show validation error for empty fields", async ({ page }) => {
		await page.goto("/auth/login");

		// Try to submit without filling fields
		await page.click('button[type="submit"]');

		// Check for validation errors
		await page.waitForTimeout(1000);

		// Email and password fields should show validation errors
		const emailError = page.locator('text=/email.*required|required/i').first();
		await expect(emailError).toBeVisible();
	});

	test("should navigate to signup page from login", async ({ page }) => {
		await page.goto("/auth/login");

		// Click signup link
		await page.click('a[href*="/auth/signup"]');

		// Verify navigation to signup page
		await expect(page).toHaveURL(/.*\/auth\/signup/);
	});

	test("should navigate to forgot password page", async ({ page }) => {
		await page.goto("/auth/login");

		// Click forgot password link
		await page.click('a[href*="/auth/forgot-password"]');

		// Verify navigation to forgot password page
		await expect(page).toHaveURL(/.*\/auth\/forgot-password/);
	});

	test("should show OAuth login options", async ({ page }) => {
		await page.goto("/auth/login");

		// Check for OAuth buttons (GitHub, Google)
		const githubButton = page.getByRole("button", { name: /github/i });
		const googleButton = page.getByRole("button", { name: /google/i });

		// At least one OAuth option should be visible
		const githubVisible = await githubButton.isVisible().catch(() => false);
		const googleVisible = await googleButton.isVisible().catch(() => false);

		expect(githubVisible || googleVisible).toBeTruthy();
	});
});
