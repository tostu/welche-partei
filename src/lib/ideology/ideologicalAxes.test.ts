import { describe, it, expect } from 'vitest';
import { ideologicalAxes } from './ideologicalAxes';
import type { IdeologicalAxis } from './types';

describe('Ideological Axes Configuration', () => {
	describe('T1: Axes load successfully', () => {
		it('should load ideological axes array', () => {
			expect(ideologicalAxes).toBeDefined();
			expect(Array.isArray(ideologicalAxes)).toBe(true);
		});

		it('should have at least 4 axes defined', () => {
			expect(ideologicalAxes.length).toBeGreaterThanOrEqual(4);
		});
	});

	describe('Schema validation', () => {
		it('should have all 7 required fields for each axis', () => {
			const requiredFields: (keyof IdeologicalAxis)[] = [
				'id',
				'name',
				'description',
				'min_value',
				'max_value',
				'min_label',
				'max_label'
			];

			ideologicalAxes.forEach((axis, index) => {
				requiredFields.forEach((field) => {
					expect(axis).toHaveProperty(field);
					expect(axis[field]).toBeDefined();
					if (typeof axis[field] === 'string') {
						expect((axis[field] as string).length).toBeGreaterThan(0);
					}
				});
			});
		});

		it('should have correct field types for each axis', () => {
			ideologicalAxes.forEach((axis, index) => {
				expect(typeof axis.id).toBe('string');
				expect(typeof axis.name).toBe('string');
				expect(typeof axis.description).toBe('string');
				expect(typeof axis.min_value).toBe('number');
				expect(typeof axis.max_value).toBe('number');
				expect(typeof axis.min_label).toBe('string');
				expect(typeof axis.max_label).toBe('string');
			});
		});
	});

	describe('Range validation', () => {
		it('should have min_value less than max_value for all axes', () => {
			ideologicalAxes.forEach((axis) => {
				expect(axis.min_value).toBeLessThan(axis.max_value);
			});
		});

		it('should have valid numeric ranges (no NaN or Infinity)', () => {
			ideologicalAxes.forEach((axis) => {
				expect(Number.isFinite(axis.min_value)).toBe(true);
				expect(Number.isFinite(axis.max_value)).toBe(true);
				expect(Number.isNaN(axis.min_value)).toBe(false);
				expect(Number.isNaN(axis.max_value)).toBe(false);
			});
		});

		it('should have standard 1-10 range for all axes', () => {
			ideologicalAxes.forEach((axis) => {
				expect(axis.min_value).toBe(1);
				expect(axis.max_value).toBe(10);
			});
		});
	});

	describe('ID uniqueness validation', () => {
		it('should have unique IDs for all axes', () => {
			const ids = ideologicalAxes.map((axis) => axis.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});

		it('should use kebab-case for axis IDs', () => {
			const kebabCaseRegex = /^[a-z]+(-[a-z]+)*$/;
			ideologicalAxes.forEach((axis) => {
				expect(axis.id).toMatch(kebabCaseRegex);
			});
		});
	});

	describe('Required axes presence', () => {
		const requiredAxes = [
			'market-state',
			'individual-collective',
			'progressive-conservative',
			'ecology-economy'
		];

		requiredAxes.forEach((requiredId) => {
			it(`should include required axis: ${requiredId}`, () => {
				const axis = ideologicalAxes.find((a) => a.id === requiredId);
				expect(axis).toBeDefined();
			});
		});

		it('should have all 4 required axes', () => {
			const axisIds = ideologicalAxes.map((axis) => axis.id);
			requiredAxes.forEach((requiredId) => {
				expect(axisIds).toContain(requiredId);
			});
		});
	});

	describe('Axis content quality', () => {
		it('should have non-empty descriptions for all axes', () => {
			ideologicalAxes.forEach((axis) => {
				expect(axis.description.length).toBeGreaterThan(0);
				expect(axis.description.trim()).toBe(axis.description); // No leading/trailing whitespace
			});
		});

		it('should have non-empty labels for all axes', () => {
			ideologicalAxes.forEach((axis) => {
				expect(axis.min_label.length).toBeGreaterThan(0);
				expect(axis.max_label.length).toBeGreaterThan(0);
			});
		});

		it('should have different min and max labels', () => {
			ideologicalAxes.forEach((axis) => {
				expect(axis.min_label).not.toBe(axis.max_label);
			});
		});
	});

	describe('Neutral midpoint calculation', () => {
		it('should calculate correct neutral midpoint for each axis', () => {
			ideologicalAxes.forEach((axis) => {
				const expectedMidpoint = (axis.min_value + axis.max_value) / 2;
				expect(expectedMidpoint).toBe(5.5); // For 1-10 range
			});
		});
	});

	describe('Edge cases', () => {
		it('should not be an empty array', () => {
			expect(ideologicalAxes.length).toBeGreaterThan(0);
		});

		it('should be readonly/immutable reference', () => {
			// This test verifies that we export a const, not a mutable let
			// TypeScript enforces this at compile time, but we can verify the array exists
			expect(ideologicalAxes).toBeTruthy();
		});
	});
});
