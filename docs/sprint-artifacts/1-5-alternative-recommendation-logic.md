# Story 1.5: Alternative Recommendation Logic

Status: review

## Story

As a system,
I need to identify a "better alternative" party based on ideological alignment, especially if the top match is an establishment or far-right party,
so that the user is guided towards a more impactful choice.

## Acceptance Criteria

1. The existing `smallerParties` logic is adapted to the new ideological framework.
2. The alternative is selected based on ideological closeness among the `smallerParties`.

## Tasks / Subtasks

- [x] **Task 1: Adapt `smallerParties` logic to ideological framework** (AC: #1)
  - [x] Identify existing `smallerParties` logic (if any) in the codebase.
  - [x] Determine how to filter parties based on "establishment or far-right" criteria within the ideological framework.
  - [x] Define a new function or modify an existing one to return a subset of `PartyIdeologicalProfile[]` representing `smallerParties`.

- [x] **Task 2: Implement alternative selection based on ideological closeness** (AC: #2)
  - [x] Create `src/lib/ideology/findAlternativeMatch.ts`.
  - [x] Import necessary types (`UserIdeologicalProfile`, `PartyIdeologicalProfile`, `Party`) and `findBestMatch` function.
  - [x] Implement function signature: `export function findAlternativeMatch(userProfile: UserIdeologicalProfile, topMatch: Party, allPartyProfiles: PartyIdeologicalProfile[] = partyIdeologies): Party | null`
  - [x] Filter `allPartyProfiles` to get `smallerParties` based on criteria from Task 1.
  - [x] Use `findBestMatch` or a similar distance calculation to find the closest match among `smallerParties` to the `userProfile`.
  - [x] Ensure the alternative is not the `topMatch` itself.
  - [x] Return the `Party` type of the best alternative match, or `null` if no suitable alternative is found.

- [x] **Task 3: Write unit tests for `findAlternativeMatch`**
  - [x] Create `src/lib/ideology/findAlternativeMatch.test.ts`.
  - [x] Test: Verify correct alternative is selected when top match is "establishment" or "far-right".
  - [x] Test: Verify alternative is selected from `smallerParties` subset.
  - [x] Test: Edge case - no suitable `smallerParties` found.
  - [x] Test: Edge case - `topMatch` is already a `smallerParty`.
  - [x] Run `npm run test:unit` to verify tests pass.

## Dev Notes

### Learnings from Previous Story

**From Story 1-4-best-match-identification (Status: ready-for-dev)**

- **New Module**: `src/lib/ideology/findBestMatch.ts` available for finding the best matching party.
- **New Function**: `calculateEuclideanDistance` helper function available in `src/lib/ideology/findBestMatch.ts`.
- **Dependencies**: This story will depend on the output of `findBestMatch.ts`.
- **Testing Pattern**: Co-located `.test.ts` files with comprehensive test coverage.

### Project Structure Notes

- Continue using `src/lib/ideology/` directory for ideological matching logic.
- New files for this story will be `src/lib/ideology/findAlternativeMatch.ts` and its corresponding test file.
- Reuse existing `UserIdeologicalProfile` and `PartyIdeologicalProfile` interfaces from `src/lib/ideology/types.ts`.
- Reuse `Party` type from `src/lib/parties.ts`.
- Reuse `partyIdeologies` array from `src/lib/ideology/partyIdeologies.ts`.

### References

- [Source: docs/user_stories.md#US:-Alternative-Recommendation-Logic-(Ideology-based)]
- [Source: docs/quiz_redesign_prd.md#FR3.8]
- [Source: docs/sprint-artifacts/stories/1-4-best-match-identification.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/1-5-alternative-recommendation-logic.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**

1. **Research Existing Logic (Task 1)**
   - Searched codebase for existing `smallerParties` logic
   - Found legacy implementation in `src/routes/ergebnis/+page.svelte:47`
   - Analyzed legacy party classifications:
     - `smallerParties = ['Grüne', 'Die Linke', 'FDP', 'BSW']` (legacy)
     - Establishment check: `bestMatch.name === 'CDU' || bestMatch.name === 'SPD'`
     - Far-right check: `bestMatch.name === 'AfD'`
   - Tech spec review revealed updated classifications per ideological framework

2. **Party Classifications (src/lib/ideology/findAlternativeMatch.ts:17-24)**
   - Defined `establishmentParties: ['CDU', 'SPD', 'FDP']` (major coalition parties)
   - Defined `farRightParties: ['AFD']` (far-right parties)
   - Defined `smallerParties: ['Die Grünen', 'Die Linke', 'BSW']` (non-establishment, non-far-right)
   - **Key Adaptation:** FDP moved from legacy "smallerParties" to "establishment" in new ideological framework
   - All 7 German parties classified into exactly one category (no overlap)

3. **Core Algorithm (src/lib/ideology/findAlternativeMatch.ts:59-108)**
   - Implemented `findAlternativeMatch` function with signature: `(userProfile, topMatch, allPartyProfiles?): Party | null`
   - Algorithm steps:
     - Step 1: Check if `topMatch` is establishment or far-right (line 71-72)
     - Step 2: If no, return `null` (user already matched with smaller party) (line 75-77)
     - Step 3: If yes, filter `allPartyProfiles` to get only `smallerParties` (line 80-82)
     - Step 4: Use `findBestMatch` to find closest ideological match among smaller parties (line 92)
     - Step 5: Ensure alternative ≠ topMatch as safety check (line 97-100)
   - Edge case handling: Empty smaller party list → returns `null` with console warning (line 85-88)
   - Error handling: Catches `findBestMatch` errors → returns `null` (line 102-106)

4. **Test Suite (src/lib/ideology/findAlternativeMatch.test.ts:1-471)**
   - 24 comprehensive tests organized into 9 describe blocks
   - Test Results: ✅ 24/24 passed (3ms execution)
   - Verified both Acceptance Criteria with dedicated test scenarios

### Completion Notes List

**Acceptance Criteria Satisfaction:**

- **AC #1 ✅**: Existing `smallerParties` logic adapted to new ideological framework
  - Researched legacy implementation in results page (src/routes/ergebnis/+page.svelte:47)
  - Adapted classifications to match tech spec guidelines:
    - **Changed:** FDP moved from legacy "smallerParties" to "establishmentParties" (reflects coalition role)
    - **Kept:** Die Grünen, Die Linke, BSW remain as smaller parties
    - **Added:** Explicit far-right classification (AFD)
  - Exported party classification constants for reuse (lines 17-24)
  - Classification tested in dedicated test suite (lines 12-30)

- **AC #2 ✅**: Alternative selected based on ideological closeness among `smallerParties`
  - Implemented filtering to get only smaller parties (lines 80-82)
  - Reused `findBestMatch` with filtered list to calculate closest ideological match (line 92)
  - Verified with distance-based tests showing correct party selection:
    - Eco-progressive user + CDU top match → Die Grünen alternative (test line 410)
    - Far-left user + SPD top match → Die Linke alternative (test line 419)
    - Populist-left user + AFD top match → BSW alternative (test line 428)
  - Returns `null` when top match is already a smaller party (tests lines 166-214)

**Key Implementation Highlights:**

1. **Legacy Logic Adaptation**: Successfully migrated from legacy party weights system to ideological framework while maintaining core behavior
2. **Party Reclassification**: FDP correctly reclassified from "smaller" to "establishment" based on coalition participation
3. **Reuse of Matching Logic**: Leveraged existing `findBestMatch` function with filtered party list (no duplicate distance calculations)
4. **Type Safety**: Full TypeScript strict mode compliance with proper Party type handling
5. **Edge Case Robustness**: Handles empty smaller party list, errors from matching, and top match already being alternative

**Test Execution Summary:**
```
✓ src/lib/ideology/findAlternativeMatch.test.ts (24 tests) 3ms
Test Files  1 passed (1)
     Tests  24 passed (24)

Full Ideology Module (5 test files):
✓ findAlternativeMatch.test.ts (24 tests) - NEW
✓ findBestMatch.test.ts (17 tests)
✓ ideologicalAxes.test.ts (20 tests)
✓ calculateUserIdeology.test.ts (19 tests)
✓ partyIdeologies.test.ts (26 tests)
Total: 106 tests passed ✅
```

**Technical Decisions:**

- **Party classifications exported as constants** for potential reuse in UI components
- **Always suggests alternatives** for establishment/far-right (no distance threshold) per tech spec recommendation (QUESTION-2)
- **Returns null instead of throwing errors** for edge cases (graceful degradation pattern)
- **Console warnings for edge cases** to aid debugging without breaking execution
- **Safety check for alternative === topMatch** even though logic prevents it (defensive programming)

**Integration Notes for Epic 2:**

- Story 2.6 (Personalized Results Display) can use `findAlternativeMatch` to show alternative recommendations
- UI should handle `null` return value (no alternative needed when smaller party is top match)
- Party classification constants can be displayed in UI ("Why this alternative?" tooltip)
- Alternative distance could be shown to users for transparency (future enhancement)

**Real-World Validation:**

- Tested with realistic scenarios for all party categories:
  - CDU/SPD/FDP top match → correctly suggests ideologically closest smaller party
  - AFD top match → correctly suggests smaller party alternative
  - Die Grünen/Die Linke/BSW top match → correctly returns `null` (no alternative needed)
- Verified ideological closeness drives selection (Die Grünen for eco-progressive, Die Linke for far-left, BSW for populist-left)

**Comparison with Legacy System:**

| Aspect | Legacy (partyWeights) | New (Ideological Framework) |
|--------|----------------------|----------------------------|
| Smaller Parties | Grüne, Die Linke, FDP, BSW | Die Grünen, Die Linke, BSW |
| Establishment | CDU, SPD | CDU, SPD, FDP |
| Far-Right | AfD (implicit) | AFD (explicit) |
| Alternative Logic | Consistency score + ranked list | Euclidean distance on ideological axes |
| Selection Basis | Weighted question scoring | Multi-axis ideological positioning |

**Migration Path for UI:**

The legacy `ergebnis/+page.svelte` can be updated to use this new function:
```typescript
// OLD (line 133-147)
const smallerPartyAlternatives = normalizedScores
  .filter((ranked) => smallerParties.includes(ranked.party.name))
  .map((ranked) => { /* consistency calculations */ })

// NEW (replacement)
const alternative = findAlternativeMatch(userProfile, topMatch);
if (alternative !== null) {
  // Display alternative recommendation
}
```

### File List

**New Files Created:**
- `src/lib/ideology/findAlternativeMatch.ts` (108 lines) - Alternative recommendation logic with party classifications
- `src/lib/ideology/findAlternativeMatch.test.ts` (471 lines) - Comprehensive test suite (24 tests)

**No Modified Files:**
- All existing files remain unchanged
