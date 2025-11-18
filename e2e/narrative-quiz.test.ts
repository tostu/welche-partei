import { expect, test } from '@playwright/test';

test.describe('Narrative Quiz Tournament Bracket', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/narrative');
	});

	test('should display the initial question phase with story context', async ({ page }) => {
		// Should show the first question's story context
		await expect(page.locator('.card.bg-base-200')).toBeVisible();

		// Should show progress indicator
		await expect(page.getByText(/Fragen - Auswahl 1 von 8/)).toBeVisible();

		// Should show two option buttons
		const buttons = page.locator('button.card');
		await expect(buttons).toHaveCount(2);

		// Should show VS divider
		await expect(page.getByText('VS')).toBeVisible();
	});

	test('should advance through all 8 initial questions', async ({ page }) => {
		// Answer all 8 questions in the initial phase
		for (let i = 1; i <= 8; i++) {
			// Verify we're on question i
			await expect(page.getByText(`Fragen - Auswahl ${i} von 8`)).toBeVisible();

			// Click the first option
			const buttons = page.locator('button.card');
			await buttons.first().click();

			// Wait a bit for state update
			await page.waitForTimeout(100);
		}

		// After 8 questions, should move to Round 1
		await expect(page.getByText(/Runde 1 - Auswahl 1 von 4/)).toBeVisible();
	});

	test('should complete the entire tournament bracket', async ({ page }) => {
		// Phase 1: Answer all 8 questions
		for (let i = 1; i <= 8; i++) {
			const buttons = page.locator('button.card');
			await buttons.first().click();
			await page.waitForTimeout(100);
		}

		// Round 1: 4 matchups (8 winners → 4 winners)
		for (let i = 1; i <= 4; i++) {
			await expect(page.getByText(`Runde 1 - Auswahl ${i} von 4`)).toBeVisible();
			const buttons = page.locator('button.card');
			await buttons.first().click();
			await page.waitForTimeout(100);
		}

		// Round 2: 2 matchups (4 winners → 2 winners)
		for (let i = 1; i <= 2; i++) {
			await expect(page.getByText(`Runde 2 - Auswahl ${i} von 2`)).toBeVisible();
			const buttons = page.locator('button.card');
			await buttons.first().click();
			await page.waitForTimeout(100);
		}

		// Final: 1 matchup (2 winners → 1 winner)
		await expect(page.getByText(/Finale - Auswahl 1 von 1/)).toBeVisible();
		const buttons = page.locator('button.card');
		await buttons.first().click();
		await page.waitForTimeout(100);

		// Should show completion screen
		await expect(page.getByText('Quiz abgeschlossen!')).toBeVisible();
		await expect(page.getByText('Ihre bevorzugte Position:')).toBeVisible();
		await expect(page.locator('.alert.alert-success')).toBeVisible();
	});

	test('should track selected options correctly through rounds', async ({ page }) => {
		// Answer all 8 questions, always selecting option A (first button)
		const selectedTexts: string[] = [];

		for (let i = 1; i <= 8; i++) {
			const buttons = page.locator('button.card');
			const firstButton = buttons.first();

			// Get the text of the option we're selecting
			const text = await firstButton.locator('p').textContent();
			if (text) selectedTexts.push(text);

			await firstButton.click();
			await page.waitForTimeout(100);
		}

		// In Round 1, we should see the selected texts from Phase 1
		// We always picked the first option in each matchup
		await expect(page.getByText(/Runde 1 - Auswahl 1 von 4/)).toBeVisible();

		// The first matchup in Round 1 should contain options from our Phase 1 selections
		const round1Buttons = page.locator('button.card');
		await expect(round1Buttons).toHaveCount(2);

		// Verify that the buttons contain text (they should be our previous winners)
		const option1Text = await round1Buttons.first().locator('p').textContent();
		const option2Text = await round1Buttons.last().locator('p').textContent();

		expect(option1Text).toBeTruthy();
		expect(option2Text).toBeTruthy();
		expect(option1Text).not.toBe(option2Text);
	});

	test('should update progress indicator correctly', async ({ page }) => {
		// Check initial progress (Question 1 of 8)
		await expect(page.getByText('Fragen - Auswahl 1 von 8')).toBeVisible();
		const initialProgress = page.locator('progress');
		await expect(initialProgress).toHaveAttribute('value', '1');
		await expect(initialProgress).toHaveAttribute('max', '8');

		// Answer first question
		const buttons = page.locator('button.card');
		await buttons.first().click();
		await page.waitForTimeout(100);

		// Check updated progress (Question 2 of 8)
		await expect(page.getByText('Fragen - Auswahl 2 von 8')).toBeVisible();
		await expect(initialProgress).toHaveAttribute('value', '2');
		await expect(initialProgress).toHaveAttribute('max', '8');
	});

	test('should show different heading text for question phase vs bracket rounds', async ({ page }) => {
		// In question phase, should show "Was würden Sie bevorzugen?"
		await expect(page.getByText('Was würden Sie bevorzugen?')).toBeVisible();

		// Answer all 8 questions to get to Round 1
		for (let i = 1; i <= 8; i++) {
			const buttons = page.locator('button.card');
			await buttons.first().click();
			await page.waitForTimeout(100);
		}

		// In bracket rounds, should show "Welche Position bevorzugen Sie?"
		await expect(page.getByText('Welche Position bevorzugen Sie?')).toBeVisible();
	});

	test('should hide story context during bracket rounds', async ({ page }) => {
		// Initially should show story context
		await expect(page.locator('.card.bg-base-200')).toBeVisible();

		// Answer all 8 questions
		for (let i = 1; i <= 8; i++) {
			const buttons = page.locator('button.card');
			await buttons.first().click();
			await page.waitForTimeout(100);
		}

		// In Round 1, story context should not be visible
		await expect(page.locator('.card.bg-base-200')).not.toBeVisible();
	});

	test('should be mobile responsive', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still display all elements
		await expect(page.locator('.card.bg-base-200')).toBeVisible();
		await expect(page.getByText(/Fragen - Auswahl 1 von 8/)).toBeVisible();

		const buttons = page.locator('button.card');
		await expect(buttons).toHaveCount(2);
		await expect(page.getByText('VS')).toBeVisible();

		// Cards should be stacked vertically on mobile (flex-col)
		const container = page.locator('.flex.flex-col.md\\:flex-row');
		await expect(container).toBeVisible();
	});

	test('should handle alternating selections correctly', async ({ page }) => {
		// Answer questions alternating between first and second option
		for (let i = 1; i <= 8; i++) {
			const buttons = page.locator('button.card');

			if (i % 2 === 1) {
				// Odd questions: select first option
				await buttons.first().click();
			} else {
				// Even questions: select second option
				await buttons.last().click();
			}

			await page.waitForTimeout(100);
		}

		// Should successfully reach Round 1
		await expect(page.getByText(/Runde 1 - Auswahl 1 von 4/)).toBeVisible();

		// Complete the rest of the tournament
		for (let i = 1; i <= 4; i++) {
			const buttons = page.locator('button.card');
			await buttons.first().click();
			await page.waitForTimeout(100);
		}

		for (let i = 1; i <= 2; i++) {
			const buttons = page.locator('button.card');
			await buttons.first().click();
			await page.waitForTimeout(100);
		}

		// Final
		const buttons = page.locator('button.card');
		await buttons.first().click();
		await page.waitForTimeout(100);

		// Should complete successfully
		await expect(page.getByText('Quiz abgeschlossen!')).toBeVisible();
	});
});
