# Story 1.4: Best Match Identification

Status: drafted

## Story

As a developer,
I want to implement the algorithm to find the best matching political party for a user's ideological profile,
so that the system can recommend the most aligned party.

## Acceptance Criteria

1. A function `findBestMatch(userProfile: UserIdeologicalProfile, partyProfiles: PartyIdeologicalProfile[]): Party` exists in `src/lib/ideology/`
2. The algorithm uses Euclidean distance metric to determine closeness between user and party profiles
3. The function returns the `Party` type (string literal) of the best match
4. Distance calculation correctly computes: `sqrt(sum((userScore[axis] - partyScore[axis])^2))`
5. Function handles edge cases: empty party list (throws error), single party (returns that party)

## Tasks / Subtasks

- [ ] **Task 1: Implement `findBestMatch` function** (AC: #1, #2, #3, #4, #5)
  - [ ] Create `src/lib/ideology/findBestMatch.ts`
  - [ ] Import necessary types (`UserIdeologicalProfile`, `PartyIdeologicalProfile`, `Party`) from `./types` and `$lib/parties`
  - [ ] Import `partyIdeologies` from `./partyIdeologies`
  - [ ] Implement function signature: `export function findBestMatch(userProfile: UserIdeologicalProfile, partyProfiles: PartyIdeologicalProfile[] = partyIdeologies): Party`
  - [ ] Implement `calculateEuclideanDistance` helper function: `function calculateEuclideanDistance(userScores: Record<string, number>, partyScores: Record<string, number>): number`
  - [ ] Initialize `minDistance` to `Infinity` and `bestMatch` to `null`
  - [ ] Iterate through `partyProfiles`
  - [ ] Calculate Euclidean distance between `userProfile.axis_scores` and `partyProfile.axis_scores`
  - [ ] Update `minDistance` and `bestMatch` if a closer match is found
  - [ ] Handle edge case: empty `partyProfiles` list (e.g., throw an error or return a default)
  - [ ] Handle edge case: single party in `partyProfiles` (return that party)
  - [ ] Return `bestMatch` as `Party` type

- [ ] **Task 2: Write unit tests for `findBestMatch`**
  - [ ] Create `src/lib/ideology/findBestMatch.test.ts`
  - [ ] Test: Known user profile → verify correct party returned (AC: #3)
  - [ ] Test: Distance calculation accuracy (AC: #4)
  - [ ] Test: Edge case - empty party list (AC: #5)
  - [ ] Test: Edge case - single party in list (AC: #5)
  - [ ] Test: Verify algorithm uses Euclidean distance (AC: #2)
  - [ ] Run `npm run test:unit` to verify tests pass

## Dev Notes

### Learnings from Previous Story

**From Story 1-3-user-ideological-profile-calculation (Status: ready-for-dev)**

- **New Module**: `src/lib/ideology/calculateUserIdeology.ts` available for calculating user profiles.
- **New Interfaces**: `UserIdeologicalProfile`, `NarrativeAnswerImpact`, `UserQuizAnswers` defined in `src/lib/ideology/types.ts`.
- **Dependencies**: This story will depend on the output of `calculateUserIdeology.ts`.
- **Testing Pattern**: Co-located `.test.ts` files with comprehensive test coverage.

### Project Structure Notes

- Continue using `src/lib/ideology/` directory for ideological matching logic.
- New files for this story will be `src/lib/ideology/findBestMatch.ts` and its corresponding test file.
- Reuse existing `UserIdeologicalProfile` and `PartyIdeologicalProfile` interfaces from `src/lib/ideology/types.ts`.
- Reuse `Party` type from `src/lib/parties.ts`.
- Reuse `partyIdeologies` array from `src/lib/ideology/partyIdeologies.ts`.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#AC4]
- [Source: docs/quiz_redesign_prd.md#US2.5]
- [Source: docs/sprint-artifacts/stories/1-3-user-ideological-profile-calculation.md#Dev-Agent-Record]


## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
