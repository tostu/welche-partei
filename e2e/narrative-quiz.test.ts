import { expect, test } from '@playwright/test';

// Helper to complete the profiling phase of the quiz
async function completeProfiling(page) {
	await page.goto('/fragen');
	await expect(page).toHaveURL(/\/fragen\/profiling\/age-group/);

	// Select "30-50 Jahre"
	await page.getByRole('button', { name: /30-50 Jahre/ }).click();

	// Select "Ich bin angestellt"
	await page.getByRole('button', { name: /Ich bin angestellt/ }).click();

	// Working priorities (slider): Click "Weiter" to finish profiling
	await page.getByRole('button', { name: 'Weiter' }).click();

	// Verify we land on the narrative quiz start
	await expect(page).toHaveURL(/\/fragen\/narrative\/0/);
}

// Robust helper to dynamically answer any narrative question depending on its UI type
async function answerQuestion(page) {
	// 1. Budget Allocation
	const joinElements = page.locator('.join');
	const joinCount = await joinElements.count();
	if (joinCount > 0) {
		const firstJoin = joinElements.first();
		const plusButton = firstJoin.locator('button').last();
		// Click plus button 5 times to allocate all points
		for (let i = 0; i < 5; i++) {
			await plusButton.click();
			await page.waitForTimeout(50);
		}
		// Click the Weiter/Submit button
		await page.getByRole('button', { name: 'Weiter' }).click();
		return;
	}

	// 2. Slider
	const rangeInput = page.locator('input[type="range"]');
	const rangeCount = await rangeInput.count();
	if (rangeCount > 0) {
		await page.getByRole('button', { name: 'Weiter' }).click();
		return;
	}

	// 3. Multiple Choice (Cards are buttons)
	const cards = page.locator('button.card');
	const cardCount = await cards.count();
	if (cardCount > 0) {
		await cards.first().click();
		return;
	}

	throw new Error('No recognized question format (budget, slider, or card) found on the page');
}

test.describe('Narrative Quiz Flow', () => {
	test('should complete the entire narrative quiz and display results', async ({ page }) => {
		// Step 1: Run through profiling
		await completeProfiling(page);

		// Step 2: Loop through all selected narrative questions
		let iteration = 0;
		while (iteration < 20) {
			const url = page.url();
			if (url.includes('/ergebnis')) {
				break;
			}
			await expect(page).toHaveURL(new RegExp(`/fragen/narrative/${iteration}`));
			await answerQuestion(page);
			await page.waitForTimeout(100);
			iteration++;
		}

		// Step 3: Verify transition to results page
		await expect(page).toHaveURL(/\/ergebnis/);
		await expect(page.getByText('Ihr Ergebnis')).toBeVisible();

		// Step 4: Interact with results dashboard (select a party)
		await expect(page.getByText('Alle Parteien im Vergleich')).toBeVisible();
		const partyButtons = page.locator('button:has-text("%")');
		const count = await partyButtons.count();
		expect(count).toBeGreaterThan(0);

		// Click the first party in the comparison sidebar
		await partyButtons.first().click();

		// Check that the tabs are visible on the right panel
		await expect(page.getByRole('button', { name: /Werte/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /Wahl-Einfluss/ })).toBeVisible();
	});

	test('should update progress indicator correctly', async ({ page }) => {
		await completeProfiling(page);

		// Check initial progress (Question 1)
		await expect(page.getByText(/Frage 1 von \d+/)).toBeVisible();

		// Answer first question
		await answerQuestion(page);
		await page.waitForTimeout(100);

		// Check updated progress (Question 2)
		await expect(page.getByText(/Frage 2 von \d+/)).toBeVisible();
	});

	test('should be mobile responsive', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await completeProfiling(page);

		// Check that elements render on mobile screen
		await expect(page.getByText(/Frage 1 von \d+/)).toBeVisible();
		
		// Answer the first question
		await answerQuestion(page);
		await page.waitForTimeout(100);

		// Verify we advanced successfully on mobile viewport
		await expect(page.getByText(/Frage 2 von \d+/)).toBeVisible();
	});
});
