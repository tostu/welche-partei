import { expect, test } from '@playwright/test';

test.describe('Profiling Quiz', () => {
	test('should render the starting question', async ({ page }) => {
		await page.goto('/profiling');

		// Check that the first question (age-group) is displayed
		await expect(page.getByText('Zu welcher Altersgruppe gehören Sie?')).toBeVisible();

		// Check that all three age group answers are present
		await expect(page.getByRole('button', { name: /Unter 30 Jahre/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /30-50 Jahre/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /Über 50 Jahre/ })).toBeVisible();
	});

	test('should navigate through a complete question path: under-30 → student', async ({
		page
	}) => {
		await page.goto('/profiling');

		// Step 1: Select "Unter 30 Jahre"
		await expect(page.getByText('Zu welcher Altersgruppe gehören Sie?')).toBeVisible();
		await page.getByRole('button', { name: /Unter 30 Jahre/ }).click();

		// Step 2: Verify employment-status-young question is displayed
		await expect(page.getByText('Was beschreibt Ihre aktuelle Situation am besten?')).toBeVisible();
		await expect(
			page.getByRole('button', { name: /Ich bin Student\/in oder in Ausbildung/ })
		).toBeVisible();

		// Step 3: Select "Student/in"
		await page.getByRole('button', { name: /Ich bin Student\/in oder in Ausbildung/ }).click();

		// Step 4: Verify student-priorities question is displayed
		await expect(page.getByText('Was ist Ihnen als Student/in am wichtigsten?')).toBeVisible();
		await expect(
			page.getByRole('button', { name: /Bezahlbares Wohnen und BAföG-Reform/ })
		).toBeVisible();

		// Step 5: Select an answer to complete the quiz
		await page.getByRole('button', { name: /Bezahlbares Wohnen und BAföG-Reform/ }).click();

		// Step 6: Verify quiz completion message
		await expect(page.getByText('Profiling abgeschlossen')).toBeVisible();
		await expect(page.getByText('Vielen Dank! Ihre Angaben wurden gespeichert.')).toBeVisible();
	});

	test('should navigate through a complete question path: 30-50 → employed', async ({ page }) => {
		await page.goto('/profiling');

		// Step 1: Select "30-50 Jahre"
		await page.getByRole('button', { name: /30-50 Jahre/ }).click();

		// Step 2: Verify employment-status-mid question is displayed
		await expect(page.getByText('Wie sieht Ihre berufliche Situation aus?')).toBeVisible();

		// Step 3: Select "Ich bin angestellt"
		await page.getByRole('button', { name: /Ich bin angestellt/ }).click();

		// Step 4: Verify working-priorities question is displayed
		await expect(
			page.getByText('Was ist Ihnen in dieser Lebensphase besonders wichtig?')
		).toBeVisible();

		// Step 5: Select an answer to complete the quiz
		await page
			.getByRole('button', { name: /Kinderbetreuung und Familienförderung/ })
			.first()
			.click();

		// Step 6: Verify quiz completion message
		await expect(page.getByText('Profiling abgeschlossen')).toBeVisible();
	});

	test('should navigate through a complete question path: over-50 → retired', async ({ page }) => {
		await page.goto('/profiling');

		// Step 1: Select "Über 50 Jahre"
		await page.getByRole('button', { name: /Über 50 Jahre/ }).click();

		// Step 2: Verify retirement-status question is displayed
		await expect(page.getByText('Sind Sie bereits im Ruhestand?')).toBeVisible();

		// Step 3: Select "Ja, ich bin im Ruhestand"
		await page.getByRole('button', { name: /Ja, ich bin im Ruhestand/ }).click();

		// Step 4: Verify retirement-priorities question is displayed
		await expect(
			page.getByText('Was ist Ihnen als Rentner/in am wichtigsten?')
		).toBeVisible();

		// Step 5: Select an answer to complete the quiz
		await page.getByRole('button', { name: /Rentenhöhe und Alterssicherheit/ }).first().click();

		// Step 6: Verify quiz completion message
		await expect(page.getByText('Profiling abgeschlossen')).toBeVisible();
	});

	test('should display all answer options as buttons', async ({ page }) => {
		await page.goto('/profiling');

		// Get all answer buttons on the first question
		const buttons = page.getByRole('button');
		const buttonCount = await buttons.count();

		// The first question (age-group) has 3 answers
		expect(buttonCount).toBe(3);

		// All buttons should be visible
		for (let i = 0; i < buttonCount; i++) {
			await expect(buttons.nth(i)).toBeVisible();
		}
	});

	test('should handle the young worker path', async ({ page }) => {
		await page.goto('/profiling');

		// Select "Unter 30 Jahre"
		await page.getByRole('button', { name: /Unter 30 Jahre/ }).click();

		// Select "Ich arbeite"
		await page.getByRole('button', { name: /Ich arbeite \(angestellt oder selbstständig\)/ }).click();

		// Verify young-worker-priorities question
		await expect(
			page.getByText('Welches Thema betrifft Sie aktuell am meisten?')
		).toBeVisible();

		// Complete the quiz
		await page
			.getByRole('button', { name: /Faire Löhne und Arbeitsbedingungen/ })
			.first()
			.click();

		// Verify completion
		await expect(page.getByText('Profiling abgeschlossen')).toBeVisible();
	});

	test('should be mobile responsive', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/profiling');

		// Check that elements are visible on mobile
		await expect(page.getByText('Zu welcher Altersgruppe gehören Sie?')).toBeVisible();
		await expect(page.getByRole('button', { name: /Unter 30 Jahre/ })).toBeVisible();

		// Click on mobile
		await page.getByRole('button', { name: /Unter 30 Jahre/ }).click();

		// Verify navigation works on mobile
		await expect(page.getByText('Was beschreibt Ihre aktuelle Situation am besten?')).toBeVisible();
	});
});
