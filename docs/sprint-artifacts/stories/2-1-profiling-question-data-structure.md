# Story 2.1: profiling-question-data-structure

Status: review

## Story

As a developer,
I need a data structure (e.g., TypeScript interface and JSON/TS file) to define profiling questions, including conditional `next_question_id` based on answers,
so that the quiz can implement dynamic, branching logic.

## Acceptance Criteria

1. A `ProfilingQuestion` interface includes `id`, `text`, `answers`, and `conditional_next_question_id` logic.
2. A `profilingQuestions.ts` file exports an array of `ProfilingQuestion` objects.
3. The data structure supports a tree/graph like navigation.

## Tasks / Subtasks

- [x] Task 1: Define `ProfilingQuestion` interface in `src/lib/profiling/types.ts`. (AC: 1)
  - [x] Subtask 1.1: Include `id`, `text`, and `answers` properties.
  - [x] Subtask 1.2: Add `conditional_next_question_id` property to handle branching logic.
- [x] Task 2: Create `profilingQuestions.ts` data file. (AC: 2)
  - [x] Subtask 2.1: Create the file at `src/lib/profiling/questions.ts`.
  - [x] Subtask 2.2: Export an array of `ProfilingQuestion` objects.
- [x] Task 3: Implement a sample question tree. (AC: 3)
  - [x] Subtask 3.1: Create at least 3 sample questions that demonstrate a branching path.
  - [x] Subtask 3.2: Ensure the `conditional_next_question_id` logic correctly links the questions.
- [x] Task 4: Add unit tests.
  - [x] Subtask 4.1: Write a test to validate the schema of the `ProfilingQuestion` objects.
  - [x] Subtask 4.2: Write a test to verify the branching logic of the sample question tree.

## Dev Notes

- Based on existing conventions (e.g., `src/lib/ideology/` from Epic 1), new data models and types for this story should be placed in a new `src/lib/profiling/` directory.
- The primary file to create will be `src/lib/profiling/questions.ts`.
- A type definition file `src/lib/profiling/types.ts` should be created for the `ProfilingQuestion` interface.

### Project Structure Notes

- This is the first story in the "New Quiz User Experience" epic. It will establish the data structure for profiling questions.
- No predecessor context from previous stories is available.

### References

- [Source: docs/user_stories.md#Feature-Dynamic-Profiling-Step]

## Dev Agent Record

### Context Reference

- /Users/tostu/Code/welche-partei/docs/sprint-artifacts/stories/2-1-profiling-question-data-structure.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**

1. **Directory Structure (Task 0)**
   - Created new directory `src/lib/profiling/` following Epic 1 conventions
   - Parallel structure to `src/lib/ideology/` for consistency

2. **Type Definitions (Task 1 - src/lib/profiling/types.ts:1-66)**
   - Defined `ProfilingAnswer` interface with `text`, optional `next_question_id`, and optional `value`
   - Defined `ProfilingQuestion` interface with:
     - Required: `id`, `text`, `answers` array
     - Optional: `default_next_question_id`, `category`
   - Comprehensive JSDoc documentation with examples
   - Support for conditional branching via `next_question_id` in each answer

3. **Question Data (Task 2 & 3 - src/lib/profiling/questions.ts:1-273)**
   - Created `profilingQuestions` array with 10 sample questions
   - Implemented branching tree structure with 3 main paths based on age group
   - Question tree design:
     - START: age-group (3 branches)
     - Path 1 (under-30): employment-status-young → student-priorities OR young-worker-priorities
     - Path 2 (30-50): employment-status-mid → working-priorities OR economic-concerns
     - Path 3 (over-50): retirement-status → retirement-priorities OR senior-working-priorities
   - All questions in German for German political quiz context
   - Helper functions: `getStartingQuestion()`, `getQuestionById()`, `validateQuestionTree()`

4. **Test Suite (Task 4 - src/lib/profiling/questions.test.ts:1-395)**
   - 29 comprehensive tests organized into 10 describe blocks
   - Test Results: ✅ 29/29 passed (6ms execution)
   - Verified all 3 Acceptance Criteria with dedicated test scenarios

### Completion Notes List

**Acceptance Criteria Satisfaction:**

- **AC #1 ✅**: `ProfilingQuestion` interface includes `id`, `text`, `answers`, and conditional navigation logic
  - Interface defined in src/lib/profiling/types.ts:30-66
  - `answers` array contains `ProfilingAnswer` objects with optional `next_question_id`
  - Additional `default_next_question_id` property for mixed branching scenarios
  - Schema validated in tests (lines 12-77)

- **AC #2 ✅**: `profilingQuestions.ts` file exports array of `ProfilingQuestion` objects
  - File created at src/lib/profiling/questions.ts
  - Exports `profilingQuestions` array with 10 sample questions
  - Array export tested (lines 79-94)
  - All questions conform to ProfilingQuestion interface

- **AC #3 ✅**: Data structure supports tree/graph-like navigation
  - Implemented via `next_question_id` in answer objects
  - Demonstrated with 3-level branching tree (age → employment → priorities)
  - Multiple terminal nodes (end questions with no further navigation)
  - Branch validation ensures all references point to valid question IDs
  - Tree navigation tested (lines 96-156)

**Key Implementation Highlights:**

1. **Modular Interface Design**: Separated `ProfilingAnswer` and `ProfilingQuestion` for clarity and reusability
2. **Flexible Branching**: Supports both answer-specific branching and default fallback navigation
3. **German Content**: All questions and answers in German for authentic German political quiz experience
4. **Helper Functions**: Utility functions for common operations (get starting question, find by ID, validate tree)
5. **Type Safety**: Full TypeScript strict mode compliance with comprehensive type annotations
6. **Realistic Content**: Questions cover demographics (age, employment) and priorities relevant to German politics

**Test Execution Summary:**
```
✓ src/lib/profiling/questions.test.ts (29 tests) 6ms
Test Files  1 passed (1)
     Tests  29 passed (29)
```

**Test Coverage:**
- Schema validation (6 tests)
- Question array export (3 tests)
- Tree/graph navigation (5 tests)
- Helper functions (9 tests)
- Content validation (2 tests)
- Question categories (2 tests)
- Real-world branching scenarios (2 tests)

**Technical Decisions:**

- **Answer-level branching**: Placed `next_question_id` in answer objects rather than question level for maximum flexibility
- **Optional default**: Added `default_next_question_id` to support mixed scenarios (some answers branch, others use default)
- **Category tags**: Added optional `category` field for organization and potential analytics
- **Value storage**: Included optional `value` field in answers for storing normalized data
- **Validation helper**: Created `validateQuestionTree()` to ensure referential integrity at runtime

**Question Tree Structure:**

```
age-group (START)
├─→ under-30 → employment-status-young
│   ├─→ student → student-priorities (END)
│   └─→ employed/unemployed → young-worker-priorities (END)
├─→ 30-50 → employment-status-mid
│   ├─→ employed → working-priorities (END)
│   └─→ unemployed/self-employed → economic-concerns (END)
└─→ over-50 → retirement-status
    ├─→ working → senior-working-priorities (END)
    └─→ retired → retirement-priorities (END)
```

**Integration Notes for Next Stories:**

- Story 2.2 (Profiling UI) can use `getStartingQuestion()` to begin the quiz flow
- UI should call `getQuestionById(answer.next_question_id)` to navigate the tree
- `validateQuestionTree()` can be called at app startup to ensure data integrity
- Category field can be used for UI styling or progress tracking
- Value field can be stored in user profile for analytics or personalization

**Real-World Scenarios Covered:**

- Young students: Education and housing priorities
- Young workers: Career and work-life balance
- Mid-career professionals: Family support and job security
- Self-employed/unemployed: Economic concerns and social security
- Pre-retirement workers: Health and retirement planning
- Retirees: Pension, healthcare, and environmental legacy

**Comparison with Legacy System:**

This is the first Epic 2 story - no legacy profiling system exists yet. The structure follows Epic 1 patterns for consistency.

### File List

**New Files Created:**
- `src/lib/profiling/types.ts` (66 lines) - Type definitions for ProfilingQuestion and ProfilingAnswer
- `src/lib/profiling/questions.ts` (273 lines) - Question data and helper functions
- `src/lib/profiling/questions.test.ts` (395 lines) - Comprehensive test suite (29 tests)

**No Modified Files:**
- All files are new for this Epic 2 foundation story
