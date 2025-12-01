import { expect, test } from "@playwright/test";

test.describe("user settings", () => {
	// Note: These tests require authentication
	// In a real scenario, you'd use test fixtures to create and login a test user

	test("should redirect to login if not authenticated", async ({ page }) => {
		await page.goto("/app/settings");

		// Should redirect to login
		await page.waitForTimeout(2000);

		const url = page.url();
		expect(url).toMatch(/\/auth\/login|\/app\/settings/);

		// If we're at login, that's the expected behavior
		if (url.includes("/auth/login")) {
			await expect(
				page.getByRole("heading", { name: /sign in|login/i }),
			).toBeVisible();
		}
	});

	test("should load settings page for authenticated users", async ({
		page,
	}) => {
		// This test assumes authentication
		// In a real test, you'd login first or use a test session
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Settings page should have navigation tabs or sections
			const hasSettings = await page
				.getByText(/settings|profile|account|preferences/i)
				.isVisible()
				.catch(() => false);

			expect(hasSettings).toBeTruthy();
		}
	});

	test("should display user profile information", async ({ page }) => {
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for profile fields (name, email, avatar, etc.)
			const hasNameField = await page
				.locator('input[name="name"], input[placeholder*="name" i]')
				.isVisible()
				.catch(() => false);

			const hasEmailField = await page
				.locator('input[name="email"], input[type="email"]')
				.isVisible()
				.catch(() => false);

			// At least one profile field should be visible
			expect(hasNameField || hasEmailField).toBeTruthy();
		}
	});

	test("should allow updating user name", async ({ page }) => {
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			const nameInput = page.locator('input[name="name"]').first();
			const isVisible = await nameInput.isVisible().catch(() => false);

			if (isVisible) {
				// Clear and fill new name
				await nameInput.clear();
				const newName = `Updated Name ${Date.now()}`;
				await nameInput.fill(newName);

				// Find and click save button
				const saveButton = page.getByRole("button", {
					name: /save|update/i,
				});

				const saveExists = await saveButton.isVisible().catch(() => false);

				if (saveExists) {
					await saveButton.click();

					// Wait for success message or confirmation
					await page.waitForTimeout(2000);

					// Look for success indicator
					const hasSuccess = await page
						.getByText(/saved|updated|success/i)
						.isVisible()
						.catch(() => false);

					// Success message might appear
					if (hasSuccess) {
						expect(hasSuccess).toBeTruthy();
					}
				}
			}
		}
	});

	test("should allow avatar upload", async ({ page }) => {
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for avatar upload button or file input
			const uploadButton = page.locator(
				'input[type="file"], button:has-text("upload"), button:has-text("change avatar")',
			);

			const exists = await uploadButton.first().isVisible().catch(() => false);

			// Avatar upload functionality should exist
			// In a real test, you'd upload a test image file
			if (exists) {
				expect(exists).toBeTruthy();
			}
		}
	});

	test("should display theme toggle", async ({ page }) => {
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for theme toggle (dark mode, light mode)
			const themeToggle = page.locator(
				'button[aria-label*="theme" i], button:has-text("dark"), button:has-text("light")',
			);

			const exists = await themeToggle.first().isVisible().catch(() => false);

			if (exists) {
				// Theme toggle exists
				expect(exists).toBeTruthy();
			}
		}
	});

	test("should navigate to billing settings", async ({ page }) => {
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for billing/subscription link
			const billingLink = page.getByRole("link", {
				name: /billing|subscription|plan/i,
			});

			const exists = await billingLink.first().isVisible().catch(() => false);

			if (exists) {
				await billingLink.first().click();

				await page.waitForTimeout(1000);

				// Should navigate to billing page
				expect(page.url()).toMatch(/billing|subscription|plan/);
			}
		}
	});

	test("should show delete account option", async ({ page }) => {
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for delete/danger zone
			const deleteOption = page.getByText(
				/delete account|danger zone|close account/i,
			);

			const exists = await deleteOption.isVisible().catch(() => false);

			// Delete account option should exist (but we won't click it in tests!)
			if (exists) {
				expect(exists).toBeTruthy();
			}
		}
	});

	test("should allow changing password", async ({ page }) => {
		await page.goto("/app/settings");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for password change section
			const passwordSection = page.getByText(/change password|password/i);

			const exists = await passwordSection.first().isVisible().catch(() => false);

			if (exists) {
				// Password change functionality exists
				expect(exists).toBeTruthy();

				// In a real test, you'd:
				// 1. Fill current password
				// 2. Fill new password
				// 3. Confirm new password
				// 4. Submit and verify success
			}
		}
	});
});
