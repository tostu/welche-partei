# Epic Technical Specification: Ideological Matching Engine (Foundation First)

Date: 2025-11-17
Author: tostu
Epic ID: 1
Status: Draft

---

## Overview

The Ideological Matching Engine establishes the foundational data models and algorithms for the redesigned political quiz system. This epic transitions the quiz from direct preference matching to a sophisticated ideology-based matching approach that maps user responses to multi-dimensional ideological axes (e.g., Market vs. State, Individual vs. Collective). The engine calculates user ideological profiles from narrative quiz responses and matches them against pre-defined party ideological profiles using distance metrics to identify the closest alignment and recommend a "better alternative" when applicable.

This epic is critical as it provides the core infrastructure required before any user-facing quiz experience (Epic 2) can be implemented, ensuring all subsequent features are built on a robust, extensible ideological framework.

## Objectives and Scope

**In Scope:**
- Define TypeScript interfaces and data structures for ideological axes with configurable ranges
- Create data structures for party ideological profiles mapping each party to axis scores
- Implement user ideological profile calculation logic from quiz answer inputs
- Develop matching algorithm using distance metrics (e.g., Euclidean distance) to compare user and party profiles
- Adapt existing "better alternative" recommendation logic to work within the new ideological framework
- Ensure all data structures are configuration-driven (TypeScript/JSON files) for easy maintenance

**Out of Scope:**
- User interface components (covered in Epic 2)
- Profiling questions and narrative question banks (covered in Epic 2)
- Results display and justification UI (covered in Epic 2)
- Question selection logic (covered in Epic 2)
- Integration with backend persistence or analytics

## System Architecture Alignment

**Technology Stack:**
- **Framework:** SvelteKit (existing)
- **Language:** TypeScript for type-safe data models and algorithm implementation
- **State Management:** Svelte's `$state` for runtime profile calculations
- **Data Storage:** Configuration files (`.ts` or `.json`) for axes definitions and party profiles

**Architectural Constraints:**
- Mobile-first, client-side execution for performance (no backend API calls for matching)
- All ideological axis definitions and party scores must be maintainable via configuration files
- Type-safe interfaces to prevent runtime errors in matching calculations
- Extensible design to support adding new axes or parties without code changes

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Location |
|--------|---------------|---------|---------|----------|
| **IdeologicalAxes Config** | Define all ideological axes with ranges and metadata | None (static config) | Array of `IdeologicalAxis` objects | `src/lib/ideology/ideologicalAxes.ts` |
| **Party Profiles Config** | Store party ideological scores across all axes | None (static config) | Array of `PartyIdeologicalProfile` objects | `src/lib/ideology/partyIdeologies.ts` |
| **Profile Calculator** | Calculate user ideological profile from quiz answers | `UserQuizAnswers` (narrative quiz responses) | `UserIdeologicalProfile` (vector of axis scores) | `src/lib/ideology/calculateUserIdeology.ts` |
| **Matching Engine** | Find best party match using distance metrics | `UserIdeologicalProfile`, `PartyIdeologicalProfile[]` | `Party` (best match) | `src/lib/ideology/findBestMatch.ts` |
| **Alternative Recommender** | Suggest better alternative from smaller parties | `Party` (top match), `UserIdeologicalProfile` | `Party \| null` (alternative) | `src/lib/ideology/findAlternative.ts` |
| **Type Definitions** | Centralized TypeScript interfaces for type safety | N/A | Type exports | `src/lib/ideology/types.ts` |

**Module Organization:**
- New directory: `src/lib/ideology/` to house all ideological matching logic
- Maintains separation from existing `src/lib/` modules (questions, parties, categories)
- Enables parallel development with existing preference-matching system during transition

### Data Models and Contracts

**Core Type Definitions (`src/lib/ideology/types.ts`):**

```typescript
// Ideological Axis Definition
export interface IdeologicalAxis {
  id: string;                    // e.g., 'market-state', 'individual-collective'
  name: string;                  // Display name
  description: string;           // Explanation of the axis
  min_value: number;             // Minimum score (e.g., 1)
  max_value: number;             // Maximum score (e.g., 10)
  min_label: string;             // Label for min end (e.g., 'Market-oriented')
  max_label: string;             // Label for max end (e.g., 'State-oriented')
}

// Party Ideological Profile
export interface PartyIdeologicalProfile {
  party_id: string;              // Matches Party type from existing parties.ts
  axis_scores: Record<string, number>;  // Map of axis_id to score
}

// User Ideological Profile (calculated from quiz)
export interface UserIdeologicalProfile {
  axis_scores: Record<string, number>;  // Map of axis_id to score
  confidence?: Record<string, number>;  // Optional: confidence level per axis
}

// Quiz Answer Impact (how narrative choices affect axes)
export interface NarrativeAnswerImpact {
  axis_id: string;
  delta: number;                 // Change to apply (+/- value)
}

// User Quiz Answers (input to calculation)
export interface UserQuizAnswers {
  narrative_choices: Record<number, 'A' | 'B'>;  // question_id -> selected option
}
```

**Sample Ideological Axes Configuration:**

```typescript
// src/lib/ideology/ideologicalAxes.ts
export const ideologicalAxes: IdeologicalAxis[] = [
  {
    id: 'market-state',
    name: 'Economic Approach',
    description: 'Market-driven solutions vs. State intervention',
    min_value: 1,
    max_value: 10,
    min_label: 'Free Market',
    max_label: 'State Control'
  },
  {
    id: 'individual-collective',
    name: 'Social Priority',
    description: 'Individual freedom vs. Collective responsibility',
    min_value: 1,
    max_value: 10,
    min_label: 'Individual First',
    max_label: 'Collective First'
  },
  {
    id: 'progressive-conservative',
    name: 'Social Values',
    description: 'Progressive change vs. Traditional values',
    min_value: 1,
    max_value: 10,
    min_label: 'Progressive',
    max_label: 'Conservative'
  },
  {
    id: 'ecology-economy',
    name: 'Environmental Priority',
    description: 'Ecological protection vs. Economic growth',
    min_value: 1,
    max_value: 10,
    min_label: 'Economy First',
    max_label: 'Ecology First'
  }
];
```

**Sample Party Profile:**

```typescript
// src/lib/ideology/partyIdeologies.ts
export const partyIdeologies: PartyIdeologicalProfile[] = [
  {
    party_id: 'Die Linke',
    axis_scores: {
      'market-state': 8,              // Strong state intervention
      'individual-collective': 8,      // Collective responsibility
      'progressive-conservative': 2,   // Progressive values
      'ecology-economy': 7             // Environmental priority
    }
  },
  {
    party_id: 'FDP',
    axis_scores: {
      'market-state': 2,              // Free market approach
      'individual-collective': 2,      // Individual freedom
      'progressive-conservative': 4,   // Moderately progressive
      'ecology-economy': 3             // Economy-leaning
    }
  }
  // ... other parties
];
```

### APIs and Interfaces

**1. Profile Calculation Function:**

```typescript
// src/lib/ideology/calculateUserIdeology.ts
import type { UserQuizAnswers, UserIdeologicalProfile } from './types';
import { narrativeQuestions } from '../narrativeQuestions'; // Epic 2 dependency
import { ideologicalAxes } from './ideologicalAxes';

/**
 * Calculate user's ideological profile from narrative quiz answers
 * @param quizAnswers - User's choices in narrative quiz
 * @returns UserIdeologicalProfile with axis scores
 */
export function calculateUserIdeology(
  quizAnswers: UserQuizAnswers
): UserIdeologicalProfile {
  // Initialize all axes at neutral midpoint
  const axis_scores: Record<string, number> = {};
  ideologicalAxes.forEach(axis => {
    axis_scores[axis.id] = (axis.min_value + axis.max_value) / 2;
  });

  // Apply deltas from narrative answer impacts
  Object.entries(quizAnswers.narrative_choices).forEach(([questionId, choice]) => {
    const question = narrativeQuestions.find(q => q.id === Number(questionId));
    if (!question) return;

    const selectedOption = choice === 'A' ? question.optionA : question.optionB;
    selectedOption.impacts.forEach(impact => {
      axis_scores[impact.axis_id] = clamp(
        axis_scores[impact.axis_id] + impact.delta,
        ideologicalAxes.find(a => a.id === impact.axis_id)!
      );
    });
  });

  return { axis_scores };
}
```

**2. Matching Algorithm Function:**

```typescript
// src/lib/ideology/findBestMatch.ts
import type { UserIdeologicalProfile, PartyIdeologicalProfile } from './types';
import type { Party } from '$lib/parties';
import { partyIdeologies } from './partyIdeologies';

/**
 * Find best matching party using Euclidean distance
 * @param userProfile - User's ideological profile
 * @param partyProfiles - All party profiles (defaults to full list)
 * @returns Party object of closest match
 */
export function findBestMatch(
  userProfile: UserIdeologicalProfile,
  partyProfiles: PartyIdeologicalProfile[] = partyIdeologies
): Party {
  let minDistance = Infinity;
  let bestMatch: Party | null = null;

  partyProfiles.forEach(partyProfile => {
    const distance = calculateEuclideanDistance(
      userProfile.axis_scores,
      partyProfile.axis_scores
    );

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = partyProfile.party_id as Party;
    }
  });

  return bestMatch!;
}

function calculateEuclideanDistance(
  userScores: Record<string, number>,
  partyScores: Record<string, number>
): number {
  let sumSquaredDiffs = 0;

  Object.keys(userScores).forEach(axisId => {
    const diff = userScores[axisId] - partyScores[axisId];
    sumSquaredDiffs += diff * diff;
  });

  return Math.sqrt(sumSquaredDiffs);
}
```

**3. Alternative Recommendation Function:**

```typescript
// src/lib/ideology/findAlternative.ts
import type { Party } from '$lib/parties';
import type { UserIdeologicalProfile } from './types';
import { findBestMatch } from './findBestMatch';
import { partyIdeologies } from './partyIdeologies';

const establishmentParties: Party[] = ['CDU', 'SPD', 'FDP'];
const farRightParties: Party[] = ['AFD'];
const smallerParties: Party[] = ['Die Grünen', 'Die Linke', 'BSW'];

/**
 * Suggest better alternative if top match is establishment/far-right
 * Adapted from existing smallerParties logic in partyWeights system
 */
export function findAlternative(
  topMatch: Party,
  userProfile: UserIdeologicalProfile
): Party | null {
  const shouldSuggestAlternative =
    establishmentParties.includes(topMatch) ||
    farRightParties.includes(topMatch);

  if (!shouldSuggestAlternative) return null;

  // Find best match among smaller parties only
  const smallerPartyProfiles = partyIdeologies.filter(p =>
    smallerParties.includes(p.party_id as Party)
  );

  return findBestMatch(userProfile, smallerPartyProfiles);
}
```

### Workflows and Sequencing

**Epic 1 Internal Workflow (Data Flow):**

1. **Configuration Load** (Application startup)
   - Load `ideologicalAxes.ts` into memory
   - Load `partyIdeologies.ts` into memory
   - Validate: All parties have scores for all axes

2. **User Profile Calculation** (After narrative quiz completion - Epic 2)
   - INPUT: `UserQuizAnswers` (narrative choices from Epic 2 UI)
   - PROCESS: `calculateUserIdeology()`
     - Initialize all axes at neutral midpoint
     - Iterate through quiz answers
     - Apply axis deltas from narrative question impacts
     - Clamp values to axis min/max bounds
   - OUTPUT: `UserIdeologicalProfile` (vector of axis scores)

3. **Party Matching** (Immediately after profile calculation)
   - INPUT: `UserIdeologicalProfile`, `PartyIdeologicalProfile[]`
   - PROCESS: `findBestMatch()`
     - Calculate Euclidean distance between user and each party
     - Track minimum distance
   - OUTPUT: `Party` (best match party_id)

4. **Alternative Check** (After initial match)
   - INPUT: `Party` (top match), `UserIdeologicalProfile`
   - PROCESS: `findAlternative()`
     - Check if top match is establishment/far-right
     - If yes: Re-run matching with smaller parties only
   - OUTPUT: `Party | null` (alternative recommendation)

5. **Results Handoff** (To Epic 2 Results UI)
   - OUTPUT: `{ topMatch: Party, alternative: Party | null, userProfile: UserIdeologicalProfile }`
   - Epic 2 consumes this for results display and justification

**Sequence Diagram (Text Format):**

```
User -> QuizUI(Epic2): Complete narrative quiz
QuizUI -> ProfileCalculator: calculateUserIdeology(answers)
ProfileCalculator -> ProfileCalculator: Initialize neutral profile
ProfileCalculator -> ProfileCalculator: Apply answer deltas
ProfileCalculator -> MatchingEngine: UserIdeologicalProfile
MatchingEngine -> MatchingEngine: Calculate distances to all parties
MatchingEngine -> AlternativeRecommender: topMatch + userProfile
AlternativeRecommender -> AlternativeRecommender: Check if alternative needed
AlternativeRecommender -> MatchingEngine: Re-match with smaller parties (conditional)
AlternativeRecommender -> ResultsUI(Epic2): { topMatch, alternative }
ResultsUI -> User: Display recommendation
```

## Non-Functional Requirements

### Performance

**Target Metrics:**
- **Profile Calculation Latency:** < 50ms for calculateUserIdeology() with 8 narrative questions
- **Matching Algorithm Latency:** < 20ms for findBestMatch() across 7 parties
- **Total End-to-End:** < 100ms from quiz completion to match result
- **Memory Footprint:** < 50KB for all ideology configuration data (axes + party profiles)

**Performance Requirements (from PRD NFR4.1):**
- Instantaneous transitions between questions (no blocking operations)
- Client-side execution eliminates network latency
- Pre-loaded configuration data (no runtime fetches)
- Algorithm complexity: O(n*m) where n = number of parties, m = number of axes (acceptable for small n, m)

**Optimization Notes:**
- Use array iterations over object loops where possible
- Pre-calculate axis midpoints at load time
- Consider memoization for distance calculations if user can re-take quiz

### Security

**Data Handling (from PRD NFR4.5):**
- **Anonymous Processing:** No user PII collected or stored
- **Client-Side Only:** All calculations happen in browser, no server transmission of quiz answers
- **No Persistence:** User profiles exist only in memory during session
- **Configuration Integrity:** Party profiles and axes are static build-time assets (no runtime modification)

**Threat Mitigation:**
- **Input Validation:** Validate all quiz answers against expected question IDs and option values ('A' | 'B')
- **Type Safety:** TypeScript strict mode prevents type coercion vulnerabilities
- **Injection Protection:** No dynamic code evaluation; all data is static configuration

**Security Requirements:**
- No authentication/authorization needed (public quiz)
- HTTPS enforced at deployment level (SvelteKit default)
- No external API calls that could leak user data

### Reliability/Availability

**Error Handling:**
- **Graceful Degradation:** If party profile missing axis score, use neutral midpoint (5) as fallback
- **Validation on Load:** Verify all parties have complete axis coverage at application startup
- **Null Safety:** TypeScript non-null assertions only after explicit validation
- **Missing Question Handling:** Skip questions not found in narrativeQuestions array (log warning in dev mode)

**Availability Requirements:**
- **100% Client-Side:** No backend dependencies for matching logic
- **Offline Capable:** Once page loaded, matching works without network
- **No Single Points of Failure:** Pure functions with no external state dependencies

**Recovery Behavior:**
- Invalid quiz answers → Log error, exclude from calculation, proceed with partial profile
- Missing axis in party profile → Use neutral value, flag in console
- Matching returns no result → Fallback to first party in smallerParties list

### Observability

**Logging Requirements:**
- **Development Mode:**
  - Log calculated user profile (axis scores) to console
  - Log top 3 party matches with distances
  - Log when alternative is suggested and why
  - Warn on configuration validation failures

**Metrics (Future Enhancement):**
- Track distribution of user axis scores (anonymized)
- Monitor frequency of alternative recommendations
- Measure actual algorithm performance vs. targets

**Tracing:**
- Function call chain visible in browser dev tools
- Each calculation step returns intermediate values for debugging
- Configuration loaded at startup logged with hash for version tracking

**Required Signals:**
- `ideology.profileCalculated` - User profile computed successfully
- `ideology.matchFound` - Party match identified
- `ideology.alternativeSuggested` - Alternative recommendation triggered
- `ideology.validationError` - Configuration or input validation failed

## Dependencies and Integrations

**External Dependencies:**

| Dependency | Version | Purpose | Used In |
|------------|---------|---------|---------|
| **TypeScript** | ^5.7.3 | Type safety for all ideology modules | All `.ts` files |
| **Svelte** | ^5.19.4 | Reactive state management | Profile calculation state |
| **SvelteKit** | ^2.16.1 | Application framework, routing | Module imports, path aliases |

**Internal Module Dependencies:**

| This Epic Module | Depends On | Dependency Type | Notes |
|------------------|------------|-----------------|-------|
| `types.ts` | None | - | Foundation module, no dependencies |
| `ideologicalAxes.ts` | `types.ts` | Type import | Uses `IdeologicalAxis` interface |
| `partyIdeologies.ts` | `types.ts`, `parties.ts` | Type import | Uses `PartyIdeologicalProfile` and `Party` type |
| `calculateUserIdeology.ts` | `types.ts`, `ideologicalAxes.ts` | Runtime + Type | Needs axis definitions for calculations |
| `findBestMatch.ts` | `types.ts`, `partyIdeologies.ts`, `parties.ts` | Runtime + Type | Needs party profiles for matching |
| `findAlternative.ts` | `types.ts`, `parties.ts`, `findBestMatch.ts` | Runtime + Type | Re-uses matching logic |

**Epic 2 Integration Points:**

| Epic 2 Module (Future) | Epic 1 Provides | Interface Contract |
|------------------------|-----------------|-------------------|
| **Narrative Questions** | `NarrativeAnswerImpact` type | Each question option includes `impacts: NarrativeAnswerImpact[]` |
| **Quiz State Manager** | `calculateUserIdeology()`, `findBestMatch()`, `findAlternative()` | Functions called on quiz completion |
| **Results UI** | `UserIdeologicalProfile`, `Party` (match), `Party` (alternative) | Display calculated profile and recommendations |

**No External Integrations Required:**
- ✓ No backend API calls
- ✓ No third-party matching services
- ✓ No database connections
- ✓ No authentication providers

**Build-Time Dependencies:**
- Vite bundler will tree-shake unused party profiles
- TypeScript compiler ensures type safety across module boundaries
- SvelteKit adapter-static for client-side-only deployment

## Acceptance Criteria (Authoritative)

**AC1: Ideological Axis Data Model** (Story 1.1)
1. A `types.ts` file defines `IdeologicalAxis` interface with `id`, `name`, `min_value`, `max_value`, `description`, `min_label`, `max_label`
2. An `ideologicalAxes.ts` file exports an array of `IdeologicalAxis` objects
3. Each axis has a clear definition and range (e.g., 1-10)
4. At minimum, 4 axes are defined: market-state, individual-collective, progressive-conservative, ecology-economy

**AC2: Party Ideological Profile Data Model** (Story 1.2)
1. A `types.ts` file defines `PartyIdeologicalProfile` interface with `party_id` and `axis_scores: Record<string, number>`
2. A `partyIdeologies.ts` file exports an array of `PartyIdeologicalProfile` objects
3. Each party (AFD, BSW, CDU, Die Linke, FDP, Die Grünen, SPD) has a score for every defined ideological axis
4. Party scores are within valid axis ranges (min_value to max_value)

**AC3: User Ideological Profile Calculation** (Story 1.3)
1. A function `calculateUserIdeology(quizAnswers: UserQuizAnswers): UserIdeologicalProfile` exists in `src/lib/ideology/`
2. The function correctly maps narrative quiz choices to changes in ideological axis scores using delta values from question impacts
3. The output `UserIdeologicalProfile` matches the defined interface with `axis_scores: Record<string, number>`
4. User profile initializes all axes at neutral midpoint before applying answer deltas
5. Axis scores are clamped to valid ranges after applying deltas

**AC4: Best Match Identification** (Story 1.4)
1. A function `findBestMatch(userProfile: UserIdeologicalProfile, partyProfiles: PartyIdeologicalProfile[]): Party` exists in `src/lib/ideology/`
2. The algorithm uses Euclidean distance metric to determine closeness between user and party profiles
3. The function returns the `Party` type (string literal) of the best match
4. Distance calculation correctly computes: `sqrt(sum((userScore[axis] - partyScore[axis])^2))`
5. Function handles edge cases: empty party list (throws error), single party (returns that party)

**AC5: Alternative Recommendation Logic** (Story 1.5)
1. A function `findAlternative(topMatch: Party, userProfile: UserIdeologicalProfile): Party | null` exists in `src/lib/ideology/`
2. The existing establishment/far-right party detection logic is implemented (CDU, SPD, FDP → establishment; AFD → far-right)
3. The alternative is selected based on ideological closeness among smaller parties (Die Grünen, Die Linke, BSW)
4. Function returns `null` if top match is already a smaller party
5. Alternative calculation uses same `findBestMatch()` logic with filtered party list

**AC6: Type Safety and Validation** (Cross-cutting)
1. All TypeScript interfaces are exported from `src/lib/ideology/types.ts`
2. TypeScript strict mode compiles without errors
3. No use of `any` type in production code
4. Runtime validation at app startup confirms all parties have complete axis coverage

**AC7: Configuration Maintainability** (Cross-cutting, from PRD NFR4.3)
1. Ideological axes can be added/modified by editing `ideologicalAxes.ts` without code changes
2. Party scores can be updated by editing `partyIdeologies.ts` without code changes
3. Adding a new party requires only: (a) adding to `parties.ts`, (b) adding profile to `partyIdeologies.ts`

## Traceability Mapping

| AC ID | PRD Requirement | User Story | Spec Section | Component/Module | Test Idea |
|-------|-----------------|------------|--------------|------------------|-----------|
| **AC1** | FR3.5 (Party ideology data management), NFR4.3 (Maintainability) | US 1.1: Data Model for Ideological Axes | Data Models > Core Type Definitions | `types.ts`, `ideologicalAxes.ts` | Unit test: Load axes, validate schema, check count >= 4 |
| **AC2** | FR3.5 (Party ideology data management), NFR4.3 (Maintainability) | US 1.2: Party Ideological Profiles | Data Models > Sample Party Profile | `types.ts`, `partyIdeologies.ts` | Unit test: Load party profiles, validate all 7 parties present, all have complete axis coverage |
| **AC3** | FR3.4 (Ideological scoring), US2.3 (Ideological axis mapping) | US 1.3: User Ideological Profile Calculation | APIs > Profile Calculation Function | `calculateUserIdeology.ts` | Unit test: Mock quiz answers, verify deltas applied correctly, verify clamping, integration test with sample narrative questions |
| **AC4** | FR3.6 (Matching algorithm implementation), US2.5 (Matching algorithm) | US 1.4: Best Match Identification | APIs > Matching Algorithm Function | `findBestMatch.ts` | Unit test: Known user profile → verify correct party returned, test distance calculation accuracy, edge cases |
| **AC5** | FR3.8 (Alternative recommendation logic), US2.5 (Matching algorithm) | US 1.5: Alternative Recommendation Logic | APIs > Alternative Recommendation Function | `findAlternative.ts` | Unit test: Top match = CDU → verify alternative from smaller parties, top match = Die Grünen → verify null returned |
| **AC6** | Technical requirement (type safety) | Cross-cutting | All sections | All `src/lib/ideology/*` files | Build-time: `npm run check` passes, runtime: startup validation logs success |
| **AC7** | NFR4.3 (Maintainability), FR3.5 (Data management) | Cross-cutting | Dependencies > Build-Time Dependencies | `ideologicalAxes.ts`, `partyIdeologies.ts` | Manual test: Add new axis, verify app still compiles and runs without code changes |

## Risks, Assumptions, Open Questions

**RISK-1: Axis Definition Subjectivity**
- **Type:** Risk
- **Description:** Defining party scores on ideological axes is inherently subjective and may not reflect voter perceptions accurately
- **Impact:** High - Could lead to inaccurate recommendations
- **Mitigation:**
  - Start with 4 well-understood axes (market-state, individual-collective, progressive-conservative, ecology-economy)
  - Validate party scores against published party platforms and expert analysis
  - Consider A/B testing different axis definitions with real users
  - Make scores easily updatable via configuration for rapid iteration

**RISK-2: Distance Metric Limitations**
- **Type:** Risk
- **Description:** Euclidean distance treats all axes as equally important; users may weight some axes more heavily
- **Impact:** Medium - May not capture nuanced user preferences
- **Mitigation:**
  - Start with unweighted Euclidean distance for simplicity
  - Monitor user feedback on recommendation accuracy
  - Future enhancement: Allow users to weight axes (post-Epic 1)
  - Future enhancement: Experiment with Manhattan distance or weighted metrics

**RISK-3: Epic 2 Dependency**
- **Type:** Risk
- **Description:** Epic 1 cannot be fully tested until Epic 2 provides narrative questions with axis impacts
- **Impact:** Medium - Delayed integration testing
- **Mitigation:**
  - Create mock narrative questions with synthetic impacts for Epic 1 unit tests
  - Define clear interface contract (`NarrativeAnswerImpact`) that Epic 2 must follow
  - Implement Epic 1 functions with defensive validation to handle malformed Epic 2 data

**ASSUMPTION-1: Four Axes Sufficient**
- **Type:** Assumption
- **Description:** Four ideological axes (market-state, individual-collective, progressive-conservative, ecology-economy) are sufficient to meaningfully differentiate German political parties
- **Validation Needed:** Review with political science expert or validate against existing political compass models
- **Fallback:** Design allows easy addition of axes via configuration

**ASSUMPTION-2: Static Party Profiles**
- **Type:** Assumption
- **Description:** Party ideological positions are stable enough to be hard-coded in configuration files rather than dynamically updated
- **Validation Needed:** Determine update frequency needed (e.g., before each election cycle)
- **Fallback:** Configuration files can be updated and redeployed without code changes

**ASSUMPTION-3: Client-Side Calculation Sufficient**
- **Type:** Assumption
- **Description:** No server-side calculation or personalization needed; all users get same matching algorithm
- **Validation Needed:** Confirm no need for A/B testing different algorithms or personalized weighting
- **Fallback:** Algorithm is modular enough to swap implementations if needed

**QUESTION-1: Axis Score Granularity**
- **Type:** Open Question
- **Question:** Should party axis scores use integer values (1-10) or allow decimals (1.0-10.0)?
- **Decision Needed By:** Before implementing `partyIdeologies.ts`
- **Recommendation:** Start with decimals for finer granularity; round for display if needed

**QUESTION-2: Alternative Recommendation Threshold**
- **Type:** Open Question
- **Question:** Should we ALWAYS suggest alternatives for establishment/far-right parties, or only if the distance to the alternative is below a threshold (e.g., within 20% distance)?
- **Decision Needed By:** Before implementing `findAlternative()`
- **Recommendation:** Start with always suggesting (matches existing behavior in current system)

**QUESTION-3: Neutral Axis Starting Point**
- **Type:** Open Question
- **Question:** Should user profiles start at axis midpoint (5.5 for 1-10 range) or a different neutral value?
- **Decision Needed By:** Before implementing `calculateUserIdeology()`
- **Recommendation:** Use mathematical midpoint: `(min_value + max_value) / 2`

## Test Strategy Summary

**Test Pyramid:**

1. **Unit Tests** (Primary Focus - 70% coverage target)
   - **Framework:** Vitest (already in package.json)
   - **Location:** `src/lib/ideology/*.test.ts` (co-located with modules)
   - **Coverage:**
     - `types.ts` - No tests (pure types)
     - `ideologicalAxes.ts` - Schema validation, axis count, range validity
     - `partyIdeologies.ts` - All parties present, complete axis coverage, scores in range
     - `calculateUserIdeology.ts` - Mock quiz answers → verify correct profile, test delta application, test clamping
     - `findBestMatch.ts` - Known profiles → verify correct party, test distance calculation, edge cases (empty list, ties)
     - `findAlternative.ts` - Test all party categories (establishment → alternative, smaller → null)

2. **Integration Tests** (20% coverage target)
   - **Framework:** Vitest
   - **Location:** `src/lib/ideology/integration.test.ts`
   - **Coverage:**
     - End-to-end: Mock quiz answers → calculateUserIdeology → findBestMatch → findAlternative → verify result
     - Cross-module: Verify axes from `ideologicalAxes.ts` match keys in `partyIdeologies.ts`
     - Epic 2 interface: Mock narrative questions with impacts → verify profile calculation works

3. **Type Checking** (Build-time validation)
   - **Framework:** TypeScript compiler + svelte-check
   - **Command:** `npm run check`
   - **Coverage:**
     - All interfaces properly exported and imported
     - No `any` types in production code
     - Strict mode enabled (no implicit any, strict null checks)

4. **Manual Testing** (10% - smoke tests)
   - Load app in browser, open dev console
   - Verify configuration loads successfully (no errors)
   - Test with mock quiz completion (once Epic 2 interface available)
   - Verify all 7 parties can be returned as matches/alternatives

**Test Cases (Key Scenarios):**

| Test ID | Scenario | Input | Expected Output | Level |
|---------|----------|-------|-----------------|-------|
| **T1** | Axis configuration loads | App startup | 4+ axes loaded, no validation errors | Unit |
| **T2** | Party profiles complete | App startup | All 7 parties have all axis scores | Unit |
| **T3** | Profile calculation neutral | Empty quiz answers | All axes at midpoint (5.5) | Unit |
| **T4** | Profile calculation with deltas | Answers favoring market+individual | market-state < 5, individual-collective < 5 | Unit |
| **T5** | Best match - exact match | User profile = Die Linke profile | Returns 'Die Linke' | Unit |
| **T6** | Best match - closest distance | User profile between SPD and Die Grünen | Returns party with smaller Euclidean distance | Unit |
| **T7** | Alternative - establishment match | Top match = CDU | Returns one of: Die Grünen, Die Linke, BSW | Unit |
| **T8** | Alternative - smaller party match | Top match = Die Linke | Returns null (no alternative needed) | Unit |
| **T9** | End-to-end flow | Complete quiz answers | Valid party match + optional alternative | Integration |
| **T10** | Type safety | Build project | `npm run check` passes with no errors | Build-time |

**Coverage Goals:**
- **Line Coverage:** 85% for all `src/lib/ideology/*.ts` files (excluding type definitions)
- **Branch Coverage:** 80% (ensure all conditional paths tested)
- **Edge Cases:** All error handling paths tested (invalid inputs, missing data)

**Test Data Strategy:**
- **Mock Narrative Questions:** Create 3-5 sample questions with known axis impacts for testing
- **Known Profiles:** Define test user profiles with expected party matches for regression testing
- **Boundary Values:** Test with min/max axis values, empty inputs, single party scenarios

**Continuous Integration:**
- Run `npm run test:unit` on every commit
- Fail build if coverage drops below 85%
- Run `npm run check` to ensure type safety before merge
