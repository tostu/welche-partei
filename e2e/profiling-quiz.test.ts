import { expect, test } from '@playwright/test';

test.describe('Profiling Quiz', () => {
	test('should render the starting question', async ({ page }) => {
		await page.goto('/fragen');

		// Redirects to first profiling question
		await expect(page).toHaveURL(/\/fragen\/profiling\/age-group/);

		// Check that the first question (age-group) is displayed
		await expect(page.getByText('Zu welcher Altersgruppe gehörst du?')).toBeVisible();

		// Check that all three age group answers are present
		await expect(page.getByRole('button', { name: /Unter 30 Jahre/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /30-50 Jahre/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /Über 50 Jahre/ })).toBeVisible();
	});

	test('should navigate through a complete question path: under-30 → student', async ({ page }) => {
		await page.goto('/fragen');

		// Step 1: Select "Unter 30 Jahre"
		await page.getByRole('button', { name: /Unter 30 Jahre/ }).click();

		// Step 2: Verify employment-status-young question is displayed
		await expect(page.getByText('Was beschreibt deine aktuelle Situation am besten?')).toBeVisible();

		// Step 3: Select "Student/in"
		await page.getByRole('button', { name: /Ich bin Student\/in oder in Ausbildung/ }).click();

		// Step 4: Verify student-priorities (budget allocation) question is displayed
		await expect(
			page.getByText('Das Budget ist knapp, die Zukunft ungewiss. Wo setzt du im Studien- oder Ausbildungsalltag deine Prioritäten?')
		).toBeVisible();

		// Step 5: Allocate all 5 points to the first option
		const firstJoin = page.locator('.join').first();
		const plusButton = firstJoin.locator('button').last();
		for (let i = 0; i < 5; i++) {
			await plusButton.click();
			await page.waitForTimeout(50);
		}

		// Click the 'Weiter' button to submit and finish profiling
		await page.getByRole('button', { name: 'Weiter' }).click();

		// Step 6: Verify redirect to the narrative quiz
		await expect(page).toHaveURL(/\/fragen\/narrative\/0/);
	});

	test('should navigate through a complete question path: 30-50 → employed', async ({ page }) => {
		await page.goto('/fragen');

		// Step 1: Select "30-50 Jahre"
		await page.getByRole('button', { name: /30-50 Jahre/ }).click();

		// Step 2: Verify employment-status-mid question is displayed
		await expect(page.getByText('Wie sieht deine berufliche Situation aus?')).toBeVisible();

		// Step 3: Select "Ich bin angestellt"
		await page.getByRole('button', { name: /Ich bin angestellt/ }).click();

		// Step 4: Verify working-priorities (slider) question is displayed
		await expect(
			page.getByText('In der Rushhour des Lebens (Familie, Job, Verpflichtungen): Was leitet dich aktuell?')
		).toBeVisible();

		// Step 5: Click the 'Weiter' button to submit slider and finish profiling
		await page.getByRole('button', { name: 'Weiter' }).click();

		// Step 6: Verify redirect to the narrative quiz
		await expect(page).toHaveURL(/\/fragen\/narrative\/0/);
	});

	test('should navigate through a complete question path: over-50 → retired', async ({ page }) => {
		await page.goto('/fragen');

		// Step 1: Select "Über 50 Jahre"
		await page.getByRole('button', { name: /Über 50 Jahre/ }).click();

		// Step 2: Verify retirement-status question is displayed
		await expect(page.getByText('Sind Sie bereits im Ruhestand?')).toBeVisible();

		// Step 3: Select "Ja, ich bin im Ruhestand"
		await page.getByRole('button', { name: /Ja, ich bin im Ruhestand/ }).click();

		// Step 4: Verify retirement-priorities (slider) question is displayed
		await expect(page.getByText('Wo liegt Ihr Hauptfokus im wohlverdienten Ruhestand?')).toBeVisible();

		// Step 5: Click the 'Weiter' button to submit slider and finish profiling
		await page.getByRole('button', { name: 'Weiter' }).click();

		// Step 6: Verify redirect to the narrative quiz
		await expect(page).toHaveURL(/\/fragen\/narrative\/0/);
	});

	test('should handle the young worker path', async ({ page }) => {
		await page.goto('/fragen');

		// Select "Unter 30 Jahre"
		await page.getByRole('button', { name: /Unter 30 Jahre/ }).click();

		// Select "Ich arbeite"
		await page.getByRole('button', { name: /Ich arbeite \(angestellt oder selbstständig\)/ }).click();

		// Verify young-worker-priorities (slider) question is displayed
		await expect(page.getByText('Wie nimmst du deine aktuelle Rolle auf dem Arbeitsmarkt wahr?')).toBeVisible();

		// Click the 'Weiter' button to submit slider and finish profiling
		await page.getByRole('button', { name: 'Weiter' }).click();

		// Verify redirect to the narrative quiz
		await expect(page).toHaveURL(/\/fragen\/narrative\/0/);
	});
});
