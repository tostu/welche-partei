# Story 2.3: narrative-question-data-structure

Status: review

## Story

As a developer,
I need a data structure (e.g., TypeScript interface and JSON/TS file) to define narrative questions, including story text, two answer options, and their impact on ideological axes,
so that the quiz can present engaging dilemmas.

## Acceptance Criteria

1. A `NarrativeQuestion` interface includes `id`, `story_text`, `optionA`, `optionB`.
2. Each option maps to changes in ideological axis scores.
3. A `narrativeQuestions.ts` file exports a bank of `NarrativeQuestion` objects, tagged for demographic relevance.

## Tasks / Subtasks

- [x] Task 1: Define `NarrativeQuestion` interface in `src/lib/narrative/types.ts`. (AC: 1)
  - [x] Subtask 1.1: Include `id`, `story_text`, `optionA`, `optionB` properties.
  - [x] Subtask 1.2: Define `NarrativeAnswerOption` interface for `optionA` and `optionB`.
- [x] Task 2: Implement ideological axis impact mapping. (AC: 2)
  - [x] Subtask 2.1: Ensure `NarrativeAnswerOption` includes an `impacts: NarrativeAnswerImpact[]` property.
  - [x] Subtask 2.2: Reference `NarrativeAnswerImpact` and `IdeologicalAxis` from `src/lib/ideology/types.ts`.
- [x] Task 3: Create `narrativeQuestions.ts` data file. (AC: 3)
  - [x] Subtask 3.1: Create the file at `src/lib/narrative/questions.ts`.
  - [x] Subtask 3.2: Export an array of `NarrativeQuestion` objects.
  - [x] Subtask 3.3: Include `tags: string[]` property in `NarrativeQuestion` for demographic relevance.
  - [x] Subtask 3.4: Create at least 3 sample narrative questions with demographic tags and ideological impacts.
- [x] Task 4: Add unit tests.
  - [x] Subtask 4.1: Write a test to validate the schema of the `NarrativeQuestion` objects.
  - [x] Subtask 4.2: Write a test to verify that ideological impacts are correctly defined and within expected ranges.
  - [x] Subtask 4.3: Write a test to ensure demographic tags are present.

## Dev Notes

- New data models and types for narrative questions should be placed in `src/lib/narrative/`.
- The primary file to create will be `src/lib/narrative/questions.ts`.
- A type definition file `src/lib/narrative/types.ts` should be created for the `NarrativeQuestion` interface.

### Learnings from Previous Story

**From Story 2.2 (Status: review)**

- **New Files Created**:
  - `src/lib/components/profiling/ProfilingQuiz.svelte`: The UI component for the profiling quiz.
  - `src/routes/profiling/+page.svelte`: Test route for the profiling quiz.
  - `e2e/profiling-quiz.test.ts`: End-to-end tests for the profiling quiz.
- **Integration Notes for this Story**:
  - This story will define the data structure for narrative questions, which will be used by the `IdeologicalScoringService` (from Epic 1) to calculate ideological axis scores.
  - The `NarrativeQuestion` interface should include `id`, `story_text`, `optionA`, `optionB`, where each option maps to changes in ideological axis scores.
  - The `narrativeQuestions.ts` file should export a bank of `NarrativeQuestion` objects, tagged for demographic relevance.

### Project Structure Notes

- This story builds on the `src/lib/profiling/` data structures and UI from previous stories.
- It introduces a new `src/lib/narrative/` directory for narrative-specific data.

### References

- [Source: docs/user_stories.md#Feature-Narrative-Ideology-Quiz]
- [Source: docs/sprint-artifacts/stories/2-2-profiling-ui.md#Dev-Agent-Record]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models-and-Contracts] (for `NarrativeAnswerImpact` and `IdeologicalAxis` context)

## Dev Agent Record

### Context Reference

- /Users/tostu/Code/welche-partei/docs/sprint-artifacts/stories/2-3-narrative-question-data-structure.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**

1. **Type Definitions (Task 1 & 2 - src/lib/narrative/types.ts:1-92)**
   - Created `NarrativeAnswerOption` interface with `text` and `impacts` properties
   - Created `NarrativeQuestion` interface with all required properties:
     - `id` (number): Unique identifier
     - `story_text` (string): Engaging scenario description
     - `optionA` and `optionB` (NarrativeAnswerOption): Two answer choices
     - `tags` (string[]): Demographic and thematic tags
   - Imported `NarrativeAnswerImpact` from `$lib/ideology/types`
   - Comprehensive JSDoc documentation with examples and design principles

2. **Narrative Questions Data (Task 3 - src/lib/narrative/questions.ts:1-394)**
   - Created `narrativeQuestions` array with 12 German narrative questions
   - Topics covered:
     1. Housing & Urban Development (Mietpreisbremse)
     2. Climate & Environment (Factory vs. Nature)
     3. Education & Family (Kita-Plätze)
     4. Healthcare (Private vs. Public)
     5. Immigration & Integration (Moschee)
     6. Labor & Employment (Amazon warehouse)
     7. Digital & Technology (Data privacy)
     8. Pension & Retirement (Rentensystem)
     9. Energy & Infrastructure (Benzinpreise)
     10. Gender & Equality (Frauenquote)
     11. Taxation & Wealth (Vermögensteuer)
     12. Education & Merit (Gesamtschulen)
   - All questions in German for authentic political quiz experience
   - Demographic tags: urban, rural, student, parent, worker, senior, young-professional, etc.
   - Helper functions: `getNarrativeQuestionById()`, `getNarrativeQuestionsByTag()`, `validateNarrativeQuestions()`

3. **Ideological Impact Design:**
   - Delta guidelines: Small (±0.5-1.0), Medium (±1.0-2.0), Large (±2.0-3.0)
   - Balanced impacts across all four axes:
     - market-state: Free market vs. state intervention
     - individual-collective: Individual freedom vs. collective responsibility
     - progressive-conservative: Progressive change vs. traditional values
     - ecology-economy: Economic growth vs. ecological protection
   - Options present genuine ideological trade-offs (not obvious good/bad choices)

4. **Test Suite (Task 4 - src/lib/narrative/questions.test.ts:1-386)**
   - 32 comprehensive tests organized into 10 describe blocks
   - Test Results: ✅ 32/32 passed (10ms execution)
   - Coverage includes:
     - Schema validation (6 tests)
     - Ideological impacts mapping (5 tests)
     - Demographic tags (4 tests)
     - Helper functions (9 tests)
     - Content quality (2 tests)
     - Question bank size (2 tests)
     - Data quality checks (3 tests)
     - Ideological coverage (2 tests)

### Completion Notes List

**Acceptance Criteria Satisfaction:**

- **AC #1 ✅**: A `NarrativeQuestion` interface includes `id`, `story_text`, `optionA`, `optionB`
  - Interface defined in src/lib/narrative/types.ts:45-92
  - All required properties present with proper TypeScript typing
  - `optionA` and `optionB` use `NarrativeAnswerOption` interface
  - Comprehensive JSDoc documentation
  - Schema validated in tests (lines 9-55)

- **AC #2 ✅**: Each option maps to changes in ideological axis scores
  - `NarrativeAnswerOption` interface includes `impacts: NarrativeAnswerImpact[]` property
  - References existing `NarrativeAnswerImpact` from `src/lib/ideology/types.ts`
  - Each impact specifies `axis_id` and `delta` (change to apply)
  - All 12 questions have properly defined impacts
  - Impact validation tested (lines 79-131)

- **AC #3 ✅**: A `narrativeQuestions.ts` file exports a bank of `NarrativeQuestion` objects, tagged for demographic relevance
  - File created at src/lib/narrative/questions.ts
  - Exports `narrativeQuestions` array with 12 sample questions (exceeds minimum of 3)
  - All questions include demographic tags
  - 25+ unique tags for demographic diversity
  - Tag validation tested (lines 133-167)

**Key Implementation Highlights:**

1. **Realistic German Scenarios**: All questions present relatable, real-world dilemmas from German politics
2. **Balanced Ideological Design**: Questions cover all four ideological axes with genuine trade-offs
3. **Demographic Personalization**: Rich tagging system enables targeted question selection
4. **Type Safety**: Full TypeScript strict mode compliance with comprehensive interfaces
5. **Validation Helpers**: `validateNarrativeQuestions()` ensures data integrity at runtime
6. **Query Helpers**: Functions to retrieve questions by ID or by demographic tag

**Test Execution Summary:**
```
✓ src/lib/narrative/questions.test.ts (32 tests) 10ms
Test Files  1 passed (1)
     Tests  32 passed (32)
```

**Test Coverage:**
- Schema validation: 6 tests
- Ideological impacts: 5 tests
- Demographic tags: 4 tests
- Helper functions: 9 tests
- Content quality: 2 tests
- Question bank: 2 tests
- Data quality: 3 tests
- Ideological coverage: 2 tests

**Technical Decisions:**

- **Number IDs**: Used numeric IDs for questions (unlike string IDs in profiling) to align with Epic 1's existing `UserQuizAnswers` interface
- **German Content**: All questions in German to match the target audience and ensure authentic political discourse
- **Balanced Impacts**: Carefully designed delta values to ensure both options are viable (no "obviously correct" answers)
- **Demographic Tags**: Used descriptive tags (urban, rural, student, parent, worker, senior) to enable personalized question selection
- **Helper Functions**: Provided utility functions for common operations (get by ID, filter by tag, validate)
- **Validation Function**: Runtime validation ensures all axis_id references are valid

**Question Design Quality:**

1. **Realistic Scenarios**: Each question presents a plausible dilemma from German politics
2. **Genuine Trade-offs**: Options represent different ideological perspectives, not good vs. bad
3. **Demographic Relevance**: Tags enable targeting questions to user profiles from Story 2.1
4. **Balanced Impacts**: Both positive and negative deltas across different axes
5. **Substantive Content**: Story texts average 50+ words, answer options 15+ words

**Integration with Previous Stories:**

- **Story 1.1-1.2 (Epic 1)**: Uses existing `NarrativeAnswerImpact` interface and ideological axes
- **Story 1.3 (Epic 1)**: Questions designed to work with `calculateUserIdeology()` function
- **Story 2.1-2.2 (Epic 2)**: Demographic tags align with profiling question categories

**Ideological Coverage:**

All four axes represented across the question bank:
- **market-state**: 11 questions (Housing, Healthcare, Labor, Digital, Pension, Wealth)
- **individual-collective**: 10 questions (Housing, Climate, Family, Healthcare, Labor, Pension, Wealth)
- **progressive-conservative**: 4 questions (Immigration, Gender, Education)
- **ecology-economy**: 3 questions (Climate, Housing, Energy)

**Demographic Coverage:**

Questions tagged for diverse user profiles:
- Urban vs. Rural: 7 questions
- Young (student, young-professional, young-worker): 6 questions
- Middle-aged (parent, worker, middle-aged): 8 questions
- Senior (senior, retirement): 3 questions
- Thematic (climate, economy, equality, healthcare): 12 questions

**Example Question Breakdown (Question 1 - Housing):**

```typescript
{
  id: 1,
  story_text: 'In Ihrer Stadt steigen die Mieten dramatisch...',
  optionA: {
    text: 'Eine strikte Mietpreisbremse einführen...',
    impacts: [
      { axis_id: 'market-state', delta: +2.0 },           // Pro state intervention
      { axis_id: 'individual-collective', delta: +1.2 }   // Pro collective solution
    ]
  },
  optionB: {
    text: 'Bauvorschriften lockern und mehr Wohnungen bauen...',
    impacts: [
      { axis_id: 'market-state', delta: -1.8 },           // Pro free market
      { axis_id: 'ecology-economy', delta: -0.8 }         // Pro economic growth
    ]
  },
  tags: ['housing', 'urban', 'young-professional', 'economic']
}
```

This demonstrates:
- Balanced impact magnitudes (±1.8 to ±2.0)
- Different axes affected by each option (creates genuine trade-off)
- Multiple demographic tags for targeted selection
- Realistic German political scenario

### File List

**New Files Created:**
- `src/lib/narrative/types.ts` (92 lines) - Type definitions for NarrativeQuestion and NarrativeAnswerOption
- `src/lib/narrative/questions.ts` (394 lines) - Question data bank and helper functions (12 questions)
- `src/lib/narrative/questions.test.ts` (386 lines) - Comprehensive test suite (32 tests)

**No Modified Files:**
- All implementation is new for this story
