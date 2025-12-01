import { expect, test } from "@playwright/test";

test.describe("password reset flow", () => {
	test("should load forgot password page", async ({ page }) => {
		await page.goto("/auth/forgot-password");

		await expect(
			page.getByRole("heading", { name: /forgot password|reset password/i }),
		).toBeVisible();
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(
			page.getByRole("button", { name: /send|reset/i }),
		).toBeVisible();
	});

	test("should submit forgot password request", async ({ page }) => {
		await page.goto("/auth/forgot-password");

		const testEmail = "test@example.com";

		// Fill in email
		await page.fill('input[name="email"]', testEmail);

		// Submit form
		await page.click('button[type="submit"]');

		// Check for success message
		await expect(
			page.getByText(/check your email|sent a link|reset link/i),
		).toBeVisible({ timeout: 10000 });

		// Note: In a real E2E test with a test email service,
		// you would:
		// 1. Fetch the password reset email
		// 2. Extract the reset link
		// 3. Navigate to the reset link
		// 4. Submit new password
		// 5. Verify successful password reset
		// 6. Login with new password
	});

	test("should show validation error for empty email", async ({ page }) => {
		await page.goto("/auth/forgot-password");

		// Try to submit without email
		await page.click('button[type="submit"]');

		// Check for validation error
		await page.waitForTimeout(1000);
		const emailError = page.locator('text=/email.*required|required/i').first();
		await expect(emailError).toBeVisible();
	});

	test("should show validation error for invalid email format", async ({
		page,
	}) => {
		await page.goto("/auth/forgot-password");

		// Fill with invalid email
		await page.fill('input[name="email"]', "not-an-email");

		// Submit form
		await page.click('button[type="submit"]');

		// Check for validation error
		await expect(page.getByText(/invalid email|valid email/i)).toBeVisible({
			timeout: 5000,
		});
	});

	test("should navigate back to login from forgot password", async ({
		page,
	}) => {
		await page.goto("/auth/forgot-password");

		// Click back to login link
		await page.click('a[href*="/auth/login"]');

		// Verify navigation to login page
		await expect(page).toHaveURL(/.*\/auth\/login/);
	});

	test("should handle password reset with token (mock scenario)", async ({
		page,
	}) => {
		// This test simulates having a reset token
		// In a real scenario, the token would come from the email
		const mockToken = "test-reset-token-123";

		// Navigate to reset password page with token
		await page.goto(`/auth/reset-password?token=${mockToken}`);

		// Check if page loaded (might show error for invalid token)
		await page.waitForTimeout(2000);

		// The page should either show:
		// 1. A form to enter new password (if token is valid)
		// 2. An error message (if token is invalid)
		const hasPasswordInput = await page
			.locator('input[name="password"]')
			.isVisible()
			.catch(() => false);
		const hasError = await page
			.getByText(/invalid|expired|error/i)
			.isVisible()
			.catch(() => false);

		// At least one should be true
		expect(hasPasswordInput || hasError).toBeTruthy();
	});
});
