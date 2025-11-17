# Story 1.1: Data Model for Ideological Axes

Status: done

## Story

As a developer,
I want a clear and extensible data structure to define ideological axes (e.g., Market vs. State, Individual vs. Collective) with their respective ranges,
so that the matching algorithm has a robust foundation for comparing user and party ideological profiles.

## Acceptance Criteria

1. A `types.ts` file defines `IdeologicalAxis` interface with `id`, `name`, `min_value`, `max_value`, `description`, `min_label`, `max_label`
2. An `ideologicalAxes.ts` file exports an array of `IdeologicalAxis` objects
3. Each axis has a clear definition and range (e.g., 1-10)
4. At minimum, 4 axes are defined: `market-state`, `individual-collective`, `progressive-conservative`, `ecology-economy`
5. All TypeScript interfaces are exported from `src/lib/ideology/types.ts`
6. TypeScript strict mode compiles without errors
7. No use of `any` type in production code

## Tasks / Subtasks

- [x] **Task 1: Create ideology directory and types file** (AC: #1, #5)
  - [x] Create directory `src/lib/ideology/`
  - [x] Create `src/lib/ideology/types.ts` file
  - [x] Define `IdeologicalAxis` interface with all required fields
  - [x] Export the interface

- [x] **Task 2: Create ideological axes configuration** (AC: #2, #3, #4)
  - [x] Create `src/lib/ideology/ideologicalAxes.ts` file
  - [x] Import `IdeologicalAxis` type from `./types`
  - [x] Define array of 4 ideological axes:
    - `market-state`: Economic Approach (Market-driven vs. State intervention)
    - `individual-collective`: Social Priority (Individual freedom vs. Collective responsibility)
    - `progressive-conservative`: Social Values (Progressive change vs. Traditional values)
    - `ecology-economy`: Environmental Priority (Ecological protection vs. Economic growth)
  - [x] Set range 1-10 for all axes
  - [x] Add clear descriptions and labels for min/max ends
  - [x] Export `ideologicalAxes` array

- [x] **Task 3: Type safety validation** (AC: #6, #7)
  - [x] Run `npm run check` to verify TypeScript compilation
  - [x] Verify no `any` types used
  - [x] Verify all exports are typed correctly
  - [x] Fix any type errors

- [x] **Task 4: Write unit tests** (Test Strategy T1 from Tech Spec)
  - [x] Create `src/lib/ideology/ideologicalAxes.test.ts`
  - [x] Test: Verify axes load successfully
  - [x] Test: Validate schema (all fields present for each axis)
  - [x] Test: Check count >= 4 axes
  - [x] Test: Verify all axes have valid ranges (min_value < max_value)
  - [x] Test: Verify all axes have unique IDs
  - [x] Run `npm run test:unit` to verify tests pass

## Dev Notes

### Architecture Patterns

**Module Organization** [Source: tech-spec-epic-1.md#Services-and-Modules]
- New directory: `src/lib/ideology/` to house all ideological matching logic
- Maintains separation from existing `src/lib/` modules (questions, parties, categories)
- Enables parallel development with existing preference-matching system during transition

**Type Safety Requirements** [Source: tech-spec-epic-1.md#NFR-Security]
- TypeScript strict mode must be enabled
- No `any` types allowed in production code
- All interfaces must be explicitly typed

### Project Structure Notes

**File Locations:**
- Types: `src/lib/ideology/types.ts` (foundation module, no dependencies)
- Configuration: `src/lib/ideology/ideologicalAxes.ts`
- Tests: `src/lib/ideology/ideologicalAxes.test.ts`

**Naming Conventions:**
- Use kebab-case for axis IDs (e.g., `market-state`, not `marketState`)
- Use PascalCase for TypeScript interfaces (e.g., `IdeologicalAxis`)
- Use camelCase for exported arrays (e.g., `ideologicalAxes`)

### Technical Constraints

**Data Model Requirements** [Source: tech-spec-epic-1.md#Data-Models]
```typescript
export interface IdeologicalAxis {
  id: string;                    // e.g., 'market-state', 'individual-collective'
  name: string;                  // Display name
  description: string;           // Explanation of the axis
  min_value: number;             // Minimum score (e.g., 1)
  max_value: number;             // Maximum score (e.g., 10)
  min_label: string;             // Label for min end (e.g., 'Market-oriented')
  max_label: string;             // Label for max end (e.g., 'State-oriented')
}
```

**Sample Axis Configuration** [Source: tech-spec-epic-1.md#Sample-Ideological-Axes-Configuration]
```typescript
{
  id: 'market-state',
  name: 'Economic Approach',
  description: 'Market-driven solutions vs. State intervention',
  min_value: 1,
  max_value: 10,
  min_label: 'Free Market',
  max_label: 'State Control'
}
```

### Testing Standards

**Unit Test Framework:** Vitest (already in package.json)

**Test Coverage Goals** [Source: tech-spec-epic-1.md#Test-Strategy]
- Line Coverage: 85% target
- Branch Coverage: 80% target
- Test all edge cases and validation logic

**Required Test Cases:**
- T1: Axis configuration loads successfully (4+ axes, no validation errors)
- Schema validation for each axis
- Unique ID validation
- Range validation (min_value < max_value)

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Acceptance-Criteria]
- [Source: docs/user_stories.md#Data-Model-for-Ideological-Axes]
- [Source: docs/quiz_redesign_prd.md#Data-Model]
- [Source: tech-spec-epic-1.md#Data-Models-and-Contracts]
- [Source: tech-spec-epic-1.md#Test-Strategy-Summary]

### Implementation Notes

**Open Questions Resolved** [Source: tech-spec-epic-1.md#QUESTION-1]
- Axis Score Granularity: Use decimals (number type) for finer granularity
- Range: Standard 1-10 for all axes (can be adjusted per-axis if needed)
- Starting Point: Neutral midpoint calculated as `(min_value + max_value) / 2 = 5.5`

**Risks to Be Aware Of** [Source: tech-spec-epic-1.md#RISK-1]
- Axis definitions are subjective - validate against published party platforms
- Configuration must be easily updatable for rapid iteration
- Consider future A/B testing different axis definitions

**Integration with Future Stories:**
- Story 1.2 will use these type definitions for Party Ideological Profiles
- Story 1.3 will use `ideologicalAxes` array for profile calculation initialization
- Epic 2 will reference `NarrativeAnswerImpact` type (not needed in this story)

## Dev Agent Record

### Context Reference

- [Story Context XML](1-1-data-model-for-ideological-axes.context.xml)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**
1. Created new `src/lib/ideology/` directory following architectural constraint for module separation
2. Implemented foundation types file with zero dependencies (types.ts)
3. Created configuration file with 4 required ideological axes matching tech spec exactly
4. Validated TypeScript compilation - new files have zero errors (existing codebase has pre-existing errors unrelated to this story)
5. Authored comprehensive test suite with 20 test cases covering all acceptance criteria
6. All tests pass successfully

### Completion Notes List

**✅ Acceptance Criteria Satisfied:**
- AC1: `types.ts` file created with complete `IdeologicalAxis` interface (7 fields)
- AC2: `ideologicalAxes.ts` exports array of `IdeologicalAxis` objects
- AC3: Each axis has clear definition and 1-10 range
- AC4: All 4 required axes defined: market-state, individual-collective, progressive-conservative, ecology-economy
- AC5: All interfaces exported from `src/lib/ideology/types.ts`
- AC6: New code compiles without TypeScript errors in strict mode
- AC7: No `any` types used in production code

**Implementation Highlights:**
- Followed kebab-case naming convention for axis IDs
- Added comprehensive JSDoc comments for maintainability
- Implemented neutral midpoint calculation ((min_value + max_value) / 2 = 5.5)
- All axes use consistent 1-10 range for simplicity
- Configuration is easily updatable for rapid iteration

**Test Coverage:**
- 20 test cases implemented covering:
  - T1: Axes load successfully (2 tests)
  - Schema validation (2 tests)
  - Range validation (3 tests)
  - ID uniqueness (2 tests)
  - Required axes presence (5 tests)
  - Axis content quality (3 tests)
  - Neutral midpoint calculation (1 test)
  - Edge cases (2 tests)
- All tests passing (100% pass rate)
- Exceeds 85% line coverage target

**Integration Notes:**
- Foundation types ready for Story 1.2 (Party Ideological Profiles)
- Axes configuration ready for Story 1.3 (User Profile Calculation)
- No breaking changes to existing codebase

### File List

**NEW:**
- `src/lib/ideology/types.ts` - IdeologicalAxis interface definition
- `src/lib/ideology/ideologicalAxes.ts` - Configuration of 4 ideological axes
- `src/lib/ideology/ideologicalAxes.test.ts` - Comprehensive test suite (20 tests)

**MODIFIED:**
- None (clean implementation with no changes to existing files)
