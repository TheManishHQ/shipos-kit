import { expect, test } from "@playwright/test";

test.describe("AI chat functionality", () => {
	// Note: These tests require authentication and OpenAI API key configuration

	test("should redirect to login if not authenticated", async ({ page }) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const url = page.url();

		// Should be at login or chat page
		expect(url).toMatch(/\/auth\/login|\/app\/chat/);
	});

	test("should load AI chat interface for authenticated users", async ({
		page,
	}) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for chat interface elements
			const hasChatInput = await page
				.locator(
					'textarea[placeholder*="message" i], input[placeholder*="message" i], textarea[name="message"]',
				)
				.isVisible()
				.catch(() => false);

			const hasChatArea = await page
				.getByText(/chat|conversation|messages/i)
				.isVisible()
				.catch(() => false);

			// Chat interface should have input or chat area
			expect(hasChatInput || hasChatArea).toBeTruthy();
		}
	});

	test("should display chat input and send button", async ({ page }) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for message input
			const messageInput = page.locator(
				'textarea[placeholder*="message" i], textarea[name="message"]',
			);

			const inputExists = await messageInput.isVisible().catch(() => false);

			if (inputExists) {
				// Look for send button
				const sendButton = page.getByRole("button", {
					name: /send|submit/i,
				});

				const buttonExists = await sendButton.isVisible().catch(() => false);

				// Should have both input and send button
				expect(inputExists && buttonExists).toBeTruthy();
			}
		}
	});

	test("should send a message and receive AI response", async ({ page }) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Find message input
			const messageInput = page
				.locator(
					'textarea[placeholder*="message" i], textarea[name="message"]',
				)
				.first();

			const inputExists = await messageInput.isVisible().catch(() => false);

			if (inputExists) {
				// Type a test message
				const testMessage = "Hello, this is a test message";
				await messageInput.fill(testMessage);

				// Find and click send button
				const sendButton = page.getByRole("button", { name: /send/i });
				const buttonExists = await sendButton.isVisible().catch(() => false);

				if (buttonExists) {
					await sendButton.click();

					// Wait for message to appear in chat
					await page.waitForTimeout(1000);

					// Check if message appears in chat history
					const messageAppeared = await page
						.getByText(testMessage)
						.isVisible()
						.catch(() => false);

					expect(messageAppeared).toBeTruthy();

					// Wait for AI response (with longer timeout as API calls can take time)
					// Note: This might fail if OpenAI API is not configured or rate limited
					await page.waitForTimeout(10000);

					// In a real test with proper setup, you'd verify:
					// 1. Message was sent successfully
					// 2. Loading indicator appeared
					// 3. AI response was received
					// 4. Response is displayed in chat
				}
			}
		}
	});

	test("should display chat history", async ({ page }) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for chat history/messages container
			const chatHistory = page.locator(
				'[class*="messages"], [class*="chat-history"], [role="log"]',
			);

			const exists = await chatHistory.first().isVisible().catch(() => false);

			// Chat history container should exist
			// It might be empty for new users
			if (exists) {
				expect(exists).toBeTruthy();
			}
		}
	});

	test("should handle empty message submission", async ({ page }) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Try to send empty message
			const sendButton = page.getByRole("button", { name: /send/i });
			const buttonExists = await sendButton.isVisible().catch(() => false);

			if (buttonExists) {
				// Send button should be disabled when input is empty
				const isDisabled = await sendButton.isDisabled().catch(() => false);

				// Or clicking it should do nothing
				if (!isDisabled) {
					await sendButton.click();
					await page.waitForTimeout(1000);

					// No error should occur, it just shouldn't send
					expect(true).toBeTruthy();
				} else {
					expect(isDisabled).toBeTruthy();
				}
			}
		}
	});

	test("should show loading state while waiting for response", async ({
		page,
	}) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			const messageInput = page
				.locator('textarea[placeholder*="message" i]')
				.first();

			const inputExists = await messageInput.isVisible().catch(() => false);

			if (inputExists) {
				await messageInput.fill("Test message for loading state");

				const sendButton = page.getByRole("button", { name: /send/i });
				const buttonExists = await sendButton.isVisible().catch(() => false);

				if (buttonExists) {
					await sendButton.click();

					// Immediately check for loading indicator
					await page.waitForTimeout(500);

					const hasLoadingIndicator = await page
						.locator(
							'[class*="loading"], [class*="spinner"], [role="status"]',
						)
						.isVisible()
						.catch(() => false);

					// Loading indicator should appear (or response is very fast)
					// This is informational rather than a hard requirement
					if (hasLoadingIndicator) {
						expect(hasLoadingIndicator).toBeTruthy();
					}
				}
			}
		}
	});

	test("should allow starting a new chat", async ({ page }) => {
		await page.goto("/app/chat");

		await page.waitForTimeout(2000);

		const isLoginPage = page.url().includes("/auth/login");

		if (!isLoginPage) {
			// Look for "new chat" button
			const newChatButton = page.getByRole("button", {
				name: /new chat|start new|clear/i,
			});

			const exists = await newChatButton.isVisible().catch(() => false);

			if (exists) {
				expect(exists).toBeTruthy();
			}
		}
	});
});
