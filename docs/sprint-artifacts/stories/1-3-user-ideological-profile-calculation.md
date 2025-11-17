# Story 1.3: User Ideological Profile Calculation

Status: ready-for-dev

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

- [ ] **Task 1: Implement `calculateUserIdeology` function** (AC: #1, #2, #3, #4, #5)
  - [ ] Create `src/lib/ideology/calculateUserIdeology.ts`
  - [ ] Import necessary types (`UserQuizAnswers`, `UserIdeologicalProfile`) from `./types`
  - [ ] Import `ideologicalAxes` from `./ideologicalAxes`
  - [ ] Implement function signature: `export function calculateUserIdeology(quizAnswers: UserQuizAnswers): UserIdeologicalProfile`
  - [ ] Initialize `axis_scores` for all `ideologicalAxes` at their neutral midpoint (`(min_value + max_value) / 2`)
  - [ ] Iterate through `quizAnswers.narrative_choices`
  - [ ] For each choice, find the corresponding narrative question (from `narrativeQuestions` - *Note: This is an Epic 2 dependency, will need a mock or placeholder*)
  - [ ] Apply `impact.delta` from the selected option to the respective `axis_id` in `axis_scores`
  - [ ] Implement `clamp` utility function to ensure scores stay within `min_value` and `max_value`
  - [ ] Return `UserIdeologicalProfile` object

- [ ] **Task 2: Create mock for `narrativeQuestions`** (AC: #2)
  - [ ] Create a mock `narrativeQuestions` array for development and testing purposes, matching the expected structure from Epic 2.

- [ ] **Task 3: Write unit tests for `calculateUserIdeology`**
  - [ ] Create `src/lib/ideology/calculateUserIdeology.test.ts`
  - [ ] Test: Verify function initializes axes at neutral midpoint (AC: #4)
  - [ ] Test: Verify correct application of positive delta values (AC: #2)
  - [ ] Test: Verify correct application of negative delta values (AC: #2)
  - [ ] Test: Verify clamping of scores within valid ranges (AC: #5)
  - [ ] Test: Verify output matches `UserIdeologicalProfile` interface (AC: #3)
  - [ ] Test: Handle cases with missing narrative questions (graceful degradation)
  - [ ] Run `npm run test:unit` to verify tests pass

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
