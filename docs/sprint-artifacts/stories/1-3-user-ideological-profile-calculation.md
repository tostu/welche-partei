# Story 1.3: User Ideological Profile Calculation

Status: review

## Story

As a developer,
I want to implement the logic to calculate a user's ideological profile from their narrative quiz answers,
so that the matching algorithm can use this profile to find the best political party match.

## Acceptance Criteria

1. A function `calculateUserIdeology(quizAnswers: UserQuizAnswers): UserIdeologicalProfile` exists in `src/lib/ideology/`
2. The function correctly maps narrative quiz choices to changes in ideological axis scores using delta values from question impacts
3. The output `UserIdeologicalProfile` matches the defined interface with `axis_scores: Record<string, number>`
4. User profile initializes all axes at neutral midpoint before applying answer deltas
5. Axis scores are clamped to valid ranges after applying deltas

## Tasks / Subtasks

- [x] **Task 1: Implement `calculateUserIdeology` function** (AC: #1, #2, #3, #4, #5)
  - [x] Create `src/lib/ideology/calculateUserIdeology.ts`
  - [x] Import necessary types (`UserQuizAnswers`, `UserIdeologicalProfile`) from `./types`
  - [x] Import `ideologicalAxes` from `./ideologicalAxes`
  - [x] Implement function signature: `export function calculateUserIdeology(quizAnswers: UserQuizAnswers): UserIdeologicalProfile`
  - [x] Initialize `axis_scores` for all `ideologicalAxes` at their neutral midpoint (`(min_value + max_value) / 2`)
  - [x] Iterate through `quizAnswers.narrative_choices`
  - [x] For each choice, find the corresponding narrative question (from `narrativeQuestions` - *Note: This is an Epic 2 dependency, will need a mock or placeholder*)
  - [x] Apply `impact.delta` from the selected option to the respective `axis_id` in `axis_scores`
  - [x] Implement `clamp` utility function to ensure scores stay within `min_value` and `max_value`
  - [x] Return `UserIdeologicalProfile` object

- [x] **Task 2: Create mock for `narrativeQuestions`** (AC: #2)
  - [x] Create a mock `narrativeQuestions` array for development and testing purposes, matching the expected structure from Epic 2.

- [x] **Task 3: Write unit tests for `calculateUserIdeology`**
  - [x] Create `src/lib/ideology/calculateUserIdeology.test.ts`
  - [x] Test: Verify function initializes axes at neutral midpoint (AC: #4)
  - [x] Test: Verify correct application of positive delta values (AC: #2)
  - [x] Test: Verify correct application of negative delta values (AC: #2)
  - [x] Test: Verify clamping of scores within valid ranges (AC: #5)
  - [x] Test: Verify output matches `UserIdeologicalProfile` interface (AC: #3)
  - [x] Test: Handle cases with missing narrative questions (graceful degradation)
  - [x] Run `npm run test:unit` to verify tests pass

## Dev Notes

### Learnings from Previous Story

**From Story 1-2-party-ideological-profiles (Status: done)**

- **New Module**: `src/lib/ideology/types.ts` available with `PartyIdeologicalProfile` interface - use this file to add new types
- **New Data**: `partyIdeologies` array at `src/lib/ideology/partyIdeologies.ts` contains profiles for 7 parties
- **Naming Conventions**: kebab-case for axis IDs, PascalCase for interfaces, camelCase for arrays
- **Range**: All axes use 1-10 range (decimal values allowed)
- **Testing Pattern**: Co-located `.test.ts` files with comprehensive test coverage
- **Architectural Decision**: Followed tech spec party positioning guidance for political accuracy.
- **Integration Note**: This story (1.3) will use `partyIdeologies` array for matching algorithm.

### Project Structure Notes

- Continue using `src/lib/ideology/` directory for ideological matching logic.
- New files for this story will be `src/lib/ideology/calculateUserIdeology.ts` and its corresponding test file.
- Reuse existing `PartyIdeologicalProfile` interface from `src/lib/ideology/types.ts`.
- Reuse `ideologicalAxes` array from `src/lib/ideology/ideologicalAxes.ts`.
- Reference `Party` type from `src/lib/parties.ts`.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#AC3]
- [Source: docs/quiz_redesign_prd.md#US2.3]
- [Source: docs/sprint-artifacts/1-2-party-ideological-profiles.md#Dev-Agent-Record]


## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/1-3-user-ideological-profile-calculation.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**

1. **Type Additions (src/lib/ideology/types.ts:44-82)**
   - Added `UserIdeologicalProfile` interface with `axis_scores` and optional `confidence`
   - Added `NarrativeAnswerImpact` interface defining axis_id and delta
   - Added `UserQuizAnswers` interface for narrative_choices Record

2. **Core Algorithm (src/lib/ideology/calculateUserIdeology.ts:120-167)**
   - Implemented 3-step calculation algorithm:
     - Step 1: Initialize all axes at neutral midpoint (5.5 for 1-10 range)
     - Step 2: Apply deltas from quiz answers by iterating narrative_choices
     - Step 3: Clamp all scores to valid ranges using clamp utility
   - Added graceful degradation with console.warn for missing questions/axes

3. **Mock Data (src/lib/ideology/calculateUserIdeology.ts:31-82)**
   - Created `mockNarrativeQuestions` array with 3 questions as Epic 2 placeholder
   - Questions cover all 4 axes with realistic impacts
   - Structured to match expected Epic 2 interface

4. **Test Suite (src/lib/ideology/calculateUserIdeology.test.ts:1-349)**
   - 19 comprehensive tests organized into 8 describe blocks
   - Test Results: ✅ 19/19 passed (4ms execution)
   - Verified all 5 Acceptance Criteria with dedicated test cases

### Completion Notes List

**Acceptance Criteria Satisfaction:**

- **AC #1 ✅**: Function `calculateUserIdeology(quizAnswers: UserQuizAnswers): UserIdeologicalProfile` exists at src/lib/ideology/calculateUserIdeology.ts:120
- **AC #2 ✅**: Correctly maps narrative quiz choices to axis score changes using delta values from question impacts (tested with positive/negative deltas, accumulation)
- **AC #3 ✅**: Output `UserIdeologicalProfile` matches interface with `axis_scores: Record<string, number>` (validated in tests lines 169-206)
- **AC #4 ✅**: User profile initializes all axes at neutral midpoint (5.5 = (1+10)/2) before applying deltas (tested lines 7-32)
- **AC #5 ✅**: Axis scores are clamped to valid ranges [1, 10] after applying deltas using clamp utility (tested lines 101-167)

**Key Implementation Highlights:**

1. **Algorithm Correctness**: Neutral midpoint initialization (5.5) → delta application → clamping ensures mathematically sound ideological profile calculation
2. **Mock Data Pattern**: Created `mockNarrativeQuestions` as placeholder for Epic 2 dependency, allowing full implementation without blocking
3. **Graceful Degradation**: Handles missing questions (question ID 999 test) and invalid axes (non-existent-axis test) without crashing
4. **Type Safety**: All types defined in centralized types.ts with strict TypeScript compliance
5. **Test Coverage**: 19 tests covering initialization, positive/negative deltas, clamping, interface validation, edge cases, full scenarios

**Test Execution Summary:**
```
✓ src/lib/ideology/calculateUserIdeology.test.ts (19 tests) 4ms
Test Files  1 passed (1)
     Tests  19 passed (19)
```

**Technical Decisions:**

- Decimal scores allowed (e.g., 5.5, 7.5) for precision in ideological positioning
- clamp utility function using Math.max/Math.min for readable score bounding
- console.warn for graceful degradation (production logging can be enhanced later)
- Optional `narrativeQuestions` parameter for testability and future Epic 2 integration

**Integration Notes for Next Stories:**

- Story 1.4 (Best Match Identification) can now use `calculateUserIdeology()` to get user profile for matching
- Mock questions can be replaced with real Epic 2 narrative questions by passing as second parameter
- UserIdeologicalProfile type is ready for distance calculation algorithms

### File List

**New Files Created:**
- `src/lib/ideology/calculateUserIdeology.ts` (168 lines) - Core profile calculation logic with mock data
- `src/lib/ideology/calculateUserIdeology.test.ts` (349 lines) - Comprehensive test suite (19 tests)

**Modified Files:**
- `src/lib/ideology/types.ts` - Added 3 new interfaces: UserIdeologicalProfile, NarrativeAnswerImpact, UserQuizAnswers (lines 44-82)
