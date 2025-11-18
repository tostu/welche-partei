# Story 1.4: Best Match Identification

Status: review

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

- [x] **Task 1: Implement `findBestMatch` function** (AC: #1, #2, #3, #4, #5)
  - [x] Create `src/lib/ideology/findBestMatch.ts`
  - [x] Import necessary types (`UserIdeologicalProfile`, `PartyIdeologicalProfile`, `Party`) from `./types` and `$lib/parties`
  - [x] Import `partyIdeologies` from `./partyIdeologies`
  - [x] Implement function signature: `export function findBestMatch(userProfile: UserIdeologicalProfile, partyProfiles: PartyIdeologicalProfile[] = partyIdeologies): Party`
  - [x] Implement `calculateEuclideanDistance` helper function: `function calculateEuclideanDistance(userScores: Record<string, number>, partyScores: Record<string, number>): number`
  - [x] Initialize `minDistance` to `Infinity` and `bestMatch` to `null`
  - [x] Iterate through `partyProfiles`
  - [x] Calculate Euclidean distance between `userProfile.axis_scores` and `partyProfile.axis_scores`
  - [x] Update `minDistance` and `bestMatch` if a closer match is found
  - [x] Handle edge case: empty `partyProfiles` list (e.g., throw an error or return a default)
  - [x] Handle edge case: single party in `partyProfiles` (return that party)
  - [x] Return `bestMatch` as `Party` type

- [x] **Task 2: Write unit tests for `findBestMatch`**
  - [x] Create `src/lib/ideology/findBestMatch.test.ts`
  - [x] Test: Known user profile → verify correct party returned (AC: #3)
  - [x] Test: Distance calculation accuracy (AC: #4)
  - [x] Test: Edge case - empty party list (AC: #5)
  - [x] Test: Edge case - single party in list (AC: #5)
  - [x] Test: Verify algorithm uses Euclidean distance (AC: #2)
  - [x] Run `npm run test:unit` to verify tests pass

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

- docs/sprint-artifacts/stories/1-4-best-match-identification.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**

1. **Core Algorithm (src/lib/ideology/findBestMatch.ts:17-43)**
   - Implemented `calculateEuclideanDistance` helper function using the formula: sqrt(sum((userScore[axis] - partyScore[axis])^2))
   - Function iterates through all user profile axes and calculates squared differences
   - Returns square root of sum of squares for accurate distance metric

2. **Main Matching Function (src/lib/ideology/findBestMatch.ts:66-107)**
   - Implemented `findBestMatch` function with proper edge case handling
   - Edge case 1: Empty party list throws descriptive error (line 75-77)
   - Edge case 2: Single party list returns that party immediately (line 80-82)
   - Algorithm: Iterate through parties, calculate distance for each, track minimum
   - Returns Party type (string literal) of closest match

3. **Test Suite (src/lib/ideology/findBestMatch.test.ts:1-347)**
   - 17 comprehensive tests organized into 6 describe blocks
   - Test Results: ✅ 17/17 passed (3ms execution)
   - Verified all 5 Acceptance Criteria with multiple test scenarios

### Completion Notes List

**Acceptance Criteria Satisfaction:**

- **AC #1 ✅**: Function `findBestMatch(userProfile: UserIdeologicalProfile, partyProfiles: PartyIdeologicalProfile[]): Party` exists at src/lib/ideology/findBestMatch.ts:66
- **AC #2 ✅**: Algorithm uses Euclidean distance metric (tested in lines 7-82 of test file, verified with distance calculations)
- **AC #3 ✅**: Function returns Party type (string literal) - tested in lines 84-108, all return values are valid Party types
- **AC #4 ✅**: Distance calculation correctly computes sqrt(sum((userScore[axis] - partyScore[axis])^2)) (tested in lines 166-197)
- **AC #5 ✅**: Handles edge cases - empty party list throws error (lines 110-129), single party returns that party (lines 131-173)

**Key Implementation Highlights:**

1. **Euclidean Distance Accuracy**: Precise mathematical implementation using Math.sqrt and squared differences
2. **Edge Case Robustness**: Explicit handling of empty list (throws error) and single party (immediate return)
3. **Type Safety**: Proper Party type casting with TypeScript strict mode compliance
4. **Real-World Testing**: Tests include all 7 German political parties with realistic ideological profiles
5. **Algorithm Consistency**: Multiple tests verify consistent results for same input

**Test Execution Summary:**
```
✓ src/lib/ideology/findBestMatch.test.ts (17 tests) 3ms
Test Files  1 passed (1)
     Tests  17 passed (17)

Full Ideology Module (4 test files):
✓ findBestMatch.test.ts (17 tests)
✓ ideologicalAxes.test.ts (20 tests)
✓ calculateUserIdeology.test.ts (19 tests)
✓ partyIdeologies.test.ts (26 tests)
Total: 82 tests passed
```

**Technical Decisions:**

- Helper function `calculateEuclideanDistance` kept private (not exported) as it's an implementation detail
- Used Infinity for initial minDistance to ensure any real distance will be smaller
- Throws descriptive error for empty party list rather than returning undefined/null
- Optional `partyProfiles` parameter defaults to `partyIdeologies` for convenience
- Algorithm optimized for correctness over performance (acceptable for <10 parties)

**Integration Notes for Next Stories:**

- Story 1.5 (Alternative Recommendation Logic) can build on this by using distance calculations to find 2nd/3rd best matches
- The `findBestMatch` function is production-ready and can be integrated into UI components
- Distance metric could be enhanced in future (weighted axes, confidence adjustments)
- Function can be used with filtered party lists for scenario testing

**Real-World Validation:**

- Tested with realistic user profiles for each German party (AFD, BSW, CDU, Die Linke, FDP, Die Grünen, SPD)
- Verified centrist profiles match centrist parties (SPD, CDU, BSW)
- Verified extremes match correctly (far-left → Die Linke, far-right → AFD)
- Confirmed exact matches return correct party with zero distance

### File List

**New Files Created:**
- `src/lib/ideology/findBestMatch.ts` (107 lines) - Best match algorithm with Euclidean distance
- `src/lib/ideology/findBestMatch.test.ts` (347 lines) - Comprehensive test suite (17 tests)

**No Modified Files:**
- All existing files remain unchanged
