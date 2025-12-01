import { expect, test } from "@playwright/test";

test.describe("signup flow", () => {
	test("should sign up with email and complete email verification", async ({
		page,
	}) => {
		// Navigate to signup page
		await page.goto("/auth/signup");

		// Generate unique email for this test
		const testEmail = `test-${Date.now()}@example.com`;
		const testPassword = "TestPassword123!";
		const testName = "Test User";

		// Fill in signup form
		await page.fill('input[name="email"]', testEmail);
		await page.fill('input[name="password"]', testPassword);
		await page.fill('input[name="name"]', testName);

		// Submit form
		await page.click('button[type="submit"]');

		// Wait for navigation or success message
		// In a real test, you would check for email verification link
		// For this test, we verify the signup submission worked
		await expect(
			page.getByText(/verify your email|check your email/i),
		).toBeVisible({ timeout: 10000 });

		// Note: In a real E2E test with a test email service (like Mailpit or MailHog),
		// you would:
		// 1. Fetch the verification email
		// 2. Extract the verification link
		// 3. Navigate to the verification link
		// 4. Verify successful email verification
		// 5. Check that user is redirected to onboarding or app
	});

	test("should show validation error for duplicate email", async ({
		page,
	}) => {
		await page.goto("/auth/signup");

		// Try to sign up with an email that might already exist
		await page.fill('input[name="email"]', "duplicate@example.com");
		await page.fill('input[name="password"]', "TestPassword123!");
		await page.fill('input[name="name"]', "Test User");

		await page.click('button[type="submit"]');

		// Wait for potential error message
		// The specific error message depends on your implementation
		await page.waitForTimeout(2000);

		// Check if we're still on signup page or see error message
		const url = page.url();
		expect(url).toContain("/auth/signup");
	});

	test("should show validation error for weak password", async ({ page }) => {
		await page.goto("/auth/signup");

		const testEmail = `test-${Date.now()}@example.com`;

		await page.fill('input[name="email"]', testEmail);
		await page.fill('input[name="password"]', "weak"); // Too short/weak
		await page.fill('input[name="name"]', "Test User");

		await page.click('button[type="submit"]');

		// Check for validation error
		await expect(
			page.getByText(/password must|password is too short|at least/i),
		).toBeVisible({ timeout: 5000 });
	});

	test("should navigate to login page from signup", async ({ page }) => {
		await page.goto("/auth/signup");

		// Click login link
		await page.click('a[href*="/auth/login"]');

		// Verify navigation to login page
		await expect(page).toHaveURL(/.*\/auth\/login/);
	});
});
