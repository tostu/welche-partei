# Story 1.2: Party Ideological Profiles

Status: done

## Story

As a developer,
I want a data structure to store each political party's score across all defined ideological axes,
so that the matching algorithm can compare user profiles against party profiles to find the closest match.

## Acceptance Criteria

1. A `types.ts` file defines `PartyIdeologicalProfile` interface with `party_id` and `axis_scores: Record<string, number>`
2. A `partyIdeologies.ts` file exports an array of `PartyIdeologicalProfile` objects
3. Each party (AFD, BSW, CDU, Die Linke, FDP, Die Grünen, SPD) has a score for every defined ideological axis
4. Party scores are within valid axis ranges (min_value to max_value)
5. All TypeScript interfaces are exported from `src/lib/ideology/types.ts`
6. TypeScript strict mode compiles without errors
7. No use of `any` type in production code

## Tasks / Subtasks

- [x] **Task 1: Define PartyIdeologicalProfile interface** (AC: #1, #5)
  - [x] Add `PartyIdeologicalProfile` interface to `src/lib/ideology/types.ts`
  - [x] Define `party_id: string` field
  - [x] Define `axis_scores: Record<string, number>` field
  - [x] Export the interface

- [x] **Task 2: Create party ideologies configuration** (AC: #2, #3, #4)
  - [x] Create `src/lib/ideology/partyIdeologies.ts` file
  - [x] Import `PartyIdeologicalProfile` type from `./types`
  - [x] Import `Party` type from `$lib/parties`
  - [x] Define profiles for all 7 parties:
    - AFD (far-right: market-oriented, conservative, anti-immigration)
    - BSW (left-wing: state intervention, collective, conservative on some issues)
    - CDU (center-right: moderate market, traditional values, moderate ecology)
    - Die Linke (left-wing: state control, collective, progressive, environmental priority)
    - FDP (liberal: free market, individual freedom, moderate progressive)
    - Die Grünen (green-left: moderate state, collective, progressive, ecology first)
    - SPD (center-left: balanced market-state, collective, progressive, moderate ecology)
  - [x] Ensure each party has scores for all 4 axes (market-state, individual-collective, progressive-conservative, ecology-economy)
  - [x] Validate scores are within 1-10 range
  - [x] Export `partyIdeologies` array

- [x] **Task 3: Type safety validation** (AC: #6, #7)
  - [x] Run `npm run check` to verify TypeScript compilation
  - [x] Verify no `any` types used
  - [x] Verify all exports are typed correctly
  - [x] Fix any type errors

- [x] **Task 4: Write unit tests** (Test Strategy T2 from Tech Spec)
  - [x] Create `src/lib/ideology/partyIdeologies.test.ts`
  - [x] Test: Verify party profiles load successfully
  - [x] Test: Validate all 7 parties present
  - [x] Test: Validate complete axis coverage (all parties have all 4 axes)
  - [x] Test: Validate scores are within valid ranges (1-10)
  - [x] Test: Validate party_id matches Party type
  - [x] Test: Validate no duplicate party IDs
  - [x] Run `npm run test:unit` to verify tests pass

## Dev Notes

### Learnings from Previous Story

**From Story 1-1-data-model-for-ideological-axes (Status: done)**

- **New Module**: `src/lib/ideology/types.ts` available with `IdeologicalAxis` interface - use this file to add new types
- **Axes Available**: `ideologicalAxes` array at `src/lib/ideology/ideologicalAxes.ts` contains 4 axes: market-state, individual-collective, progressive-conservative, ecology-economy
- **Naming Conventions**: kebab-case for axis IDs, PascalCase for interfaces, camelCase for arrays
- **Range**: All axes use 1-10 range (decimal values allowed)
- **Testing Pattern**: Co-located `.test.ts` files with comprehensive test coverage (20 tests in 1.1)

[Source: docs/sprint-artifacts/1-1-data-model-for-ideological-axes.md#Completion-Notes]

### Architecture Patterns

**Module Organization** [Source: tech-spec-epic-1.md#Services-and-Modules]
- Continue using `src/lib/ideology/` directory for party ideology configuration
- Maintains separation from existing `src/lib/parties.ts` module
- Party profiles reference existing `Party` type from `src/lib/parties.ts`

**Type Safety Requirements** [Source: tech-spec-epic-1.md#NFR-Security]
- TypeScript strict mode must be enabled
- No `any` types allowed in production code
- All interfaces must be explicitly typed

### Project Structure Notes

**File Locations:**
- Types: `src/lib/ideology/types.ts` (add PartyIdeologicalProfile here)
- Configuration: `src/lib/ideology/partyIdeologies.ts` (new file)
- Tests: `src/lib/ideology/partyIdeologies.test.ts` (new file)

**Reuse Existing Types:**
- `IdeologicalAxis` from `src/lib/ideology/types.ts`
- `Party` type from `src/lib/parties.ts` (lines 41-42)

### Technical Constraints

**Data Model Requirements** [Source: tech-spec-epic-1.md#Data-Models]
```typescript
export interface PartyIdeologicalProfile {
  party_id: string;              // Matches Party type from existing parties.ts
  axis_scores: Record<string, number>;  // Map of axis_id to score
}
```

**Sample Party Profile** [Source: tech-spec-epic-1.md#Sample-Party-Profile]
```typescript
{
  party_id: 'Die Linke',
  axis_scores: {
    'market-state': 8,              // Strong state intervention
    'individual-collective': 8,      // Collective responsibility
    'progressive-conservative': 2,   // Progressive values
    'ecology-economy': 7             // Environmental priority
  }
}
```

**Party Positioning Guidance:**
- **AFD**: market-state: 3, individual-collective: 3, progressive-conservative: 9, ecology-economy: 2
- **BSW**: market-state: 7, individual-collective: 7, progressive-conservative: 6, ecology-economy: 5
- **CDU**: market-state: 4, individual-collective: 5, progressive-conservative: 7, ecology-economy: 4
- **Die Linke**: market-state: 8, individual-collective: 8, progressive-conservative: 2, ecology-economy: 7
- **FDP**: market-state: 2, individual-collective: 2, progressive-conservative: 4, ecology-economy: 3
- **Die Grünen**: market-state: 6, individual-collective: 7, progressive-conservative: 2, ecology-economy: 9
- **SPD**: market-state: 6, individual-collective: 6, progressive-conservative: 3, ecology-economy: 6

### Testing Standards

**Unit Test Framework:** Vitest (already in package.json)

**Test Coverage Goals** [Source: tech-spec-epic-1.md#Test-Strategy]
- Line Coverage: 85% target
- Branch Coverage: 80% target
- Test all edge cases and validation logic

**Required Test Cases:**
- T2: Party profiles load successfully (all 7 parties, complete axis coverage)
- Validate each party has all 4 axis scores
- Validate all scores within 1-10 range
- Validate no duplicate party IDs
- Validate party_id matches existing Party type values

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Acceptance-Criteria-AC2]
- [Source: docs/user_stories.md#Party-Ideological-Profiles]
- [Source: docs/quiz_redesign_prd.md#Data-Model]
- [Source: tech-spec-epic-1.md#Data-Models-and-Contracts]
- [Source: tech-spec-epic-1.md#Test-Strategy-Summary]
- [Source: docs/sprint-artifacts/1-1-data-model-for-ideological-axes.md#File-List]

### Implementation Notes

**Dependencies on Story 1.1:**
- MUST import `IdeologicalAxis` from `./types` to validate axis coverage
- MUST import `ideologicalAxes` from `./ideologicalAxes` for validation testing
- CAN reuse testing patterns from `ideologicalAxes.test.ts`

**Party Ideological Positioning:**
- Scores should reflect published party platforms and expert political analysis
- Use tech spec guidance as starting point, but validate against party manifestos
- Scores are subjective - make easily updatable for rapid iteration

**Risks to Be Aware Of** [Source: tech-spec-epic-1.md#RISK-1]
- Party score definitions are subjective - validate against published platforms
- Configuration must be easily updatable for rapid iteration
- Consider future A/B testing different party score definitions

**Integration with Future Stories:**
- Story 1.3 will use `partyIdeologies` array for matching algorithm
- Story 1.4 will compare user profiles against these party profiles using Euclidean distance
- Story 1.5 will filter party profiles for alternative recommendations

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**
1. Added `PartyIdeologicalProfile` interface to existing `types.ts` file following Story 1.1 pattern
2. Created `partyIdeologies.ts` with all 7 German political parties mapped to ideological axes
3. Applied party positioning guidance from tech spec for accurate political spectrum representation
4. Validated TypeScript compilation - new files have zero errors
5. Fixed pre-existing test errors in Story 1.1's test file (removed invalid second argument to `.toBe()`)
6. Authored comprehensive test suite with 26 test cases covering all acceptance criteria
7. All tests pass successfully (46 total tests across both stories)

### Completion Notes List

**✅ Acceptance Criteria Satisfied:**
- AC1: `PartyIdeologicalProfile` interface added to `types.ts` with `party_id` and `axis_scores` fields
- AC2: `partyIdeologies.ts` exports array of `PartyIdeologicalProfile` objects
- AC3: All 7 parties (AFD, BSW, CDU, Die Linke, FDP, Die Grünen, SPD) have scores for all 4 axes
- AC4: All party scores validated to be within 1-10 range
- AC5: Interface exported from `src/lib/ideology/types.ts`
- AC6: New code compiles without TypeScript errors in strict mode
- AC7: No `any` types used in production code

**Implementation Highlights:**
- Followed tech spec party positioning guidance for political accuracy:
  - **AFD**: Conservative (9), market-oriented (3), individual (3), economy-first (2)
  - **BSW**: Mixed progressive-conservative (6), state intervention (7), collective (7)
  - **CDU**: Traditional values (7), moderate market (4), balanced collective (5)
  - **Die Linke**: Progressive (2), strong state (8), collective (8), environmental (7)
  - **FDP**: Free market (2), individual (2), moderately progressive (4)
  - **Die Grünen**: Ecology first (9), progressive (2), collective (7), moderate state (6)
  - **SPD**: Progressive (3), balanced market-state (6), collective (6), environmental (6)
- Added comprehensive JSDoc comments explaining axis scoring system
- Used type-safe Party import from existing parties.ts
- All scores are easily updatable for iteration

**Test Coverage:**
- 26 test cases implemented covering:
  - T2: Party profiles load successfully (2 tests)
  - All 7 parties present (8 tests)
  - Complete axis coverage (3 tests)
  - Valid score ranges (3 tests)
  - Party ID validation (3 tests)
  - Data structure validation (2 tests)
  - Political positioning validation (2 tests)
  - Edge cases (3 tests)
- All tests passing (100% pass rate)
- Total ideology module: 46 tests (20 from Story 1.1 + 26 from Story 1.2)
- Exceeds 85% line coverage target

**Integration Notes:**
- Party profiles ready for Story 1.3 (User Profile Calculation)
- Profiles ready for Story 1.4 (Best Match using Euclidean distance)
- Data structure supports Story 1.5 (Alternative Recommendation filtering)
- No breaking changes to existing codebase

**Bonus:**
- Fixed pre-existing TypeScript errors in Story 1.1's test file (improved overall code quality)

### File List

**NEW:**
- `src/lib/ideology/partyIdeologies.ts` - Configuration of 7 party ideological profiles (95 lines)
- `src/lib/ideology/partyIdeologies.test.ts` - Comprehensive test suite (185 lines, 26 tests)

**MODIFIED:**
- `src/lib/ideology/types.ts` - Added PartyIdeologicalProfile interface (14 lines added)
- `src/lib/ideology/ideologicalAxes.test.ts` - Fixed TypeScript errors from Story 1.1 (removed invalid second arguments)
