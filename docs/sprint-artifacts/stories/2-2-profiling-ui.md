# Story 2.2: profiling-ui

Status: review

## Story

As a user,
I want to answer 4-7 simple profiling questions presented in a conversational flow,
so that the quiz feels tailored to my needs without being overwhelming.

## Acceptance Criteria

1. A Svelte component renders profiling questions dynamically.
2. Navigation between questions is smooth and based on user answers.
3. The UI is clean, mobile-responsive, and easy to use.

## Tasks / Subtasks

- [x] Task 1: Create the `ProfilingQuiz.svelte` component. (AC: 1)
  - [x] Subtask 1.1: Create the file at `src/lib/components/profiling/ProfilingQuiz.svelte`.
  - [x] Subtask 1.2: Import `getStartingQuestion` and `getQuestionById` from `src/lib/profiling/questions.ts`.
- [x] Task 2: Implement dynamic question rendering. (AC: 1)
  - [x] Subtask 2.1: Use a Svelte state variable to hold the current question object.
  - [x] Subtask 2.2: Initialize the component by calling `getStartingQuestion()` to load the first question.
  - [x] Subtask 2.3: Render the `text` of the current question.
  - [x] Subtask 2.4: Use an `#each` block to render a button for each answer in the `answers` array.
- [x] Task 3: Implement navigation logic. (AC: 2)
  - [x] Subtask 3.1: Create an `on:click` handler for the answer buttons.
  - [x] Subtask 3.2: In the handler, get the `next_question_id` from the selected answer.
  - [x] Subtask 3.3: Call `getQuestionById()` with the `next_question_id` to get the next question.
  - [x] Subtask 3.4: Update the state variable to render the new question.
  - [x] Subtask 3.5: Handle the end of the quiz flow when `next_question_id` is undefined.
- [x] Task 4: Style the component. (AC: 3)
  - [x] Subtask 4.1: Use TailwindCSS and DaisyUI classes for a clean, mobile-responsive layout.
  - [x] Subtask 4.2: Ensure the component is easy to use on both mobile and desktop screens.
- [x] Task 5: Add end-to-end tests.
  - [x] Subtask 5.1: Create a Playwright test file for the profiling quiz flow.
  - [x] Subtask 5.2: Write a test that simulates a user clicking through a complete path of the question tree.
  - [x] Subtask 5.3: Assert that the correct questions are displayed based on the selected answers.

## Dev Notes

- The new Svelte component for the profiling UI should be created in `src/lib/components/profiling/`.
- The component should utilize the data structures and helper functions from the previous story.

### Learnings from Previous Story

**From Story 2.1 (Status: review)**

- **New Files Created**:
  - `src/lib/profiling/types.ts`: Defines `ProfilingQuestion` and `ProfilingAnswer` interfaces.
  - `src/lib/profiling/questions.ts`: Contains the question data and helper functions.
  - `src/lib/profiling/questions.test.ts`: Unit tests for the data structures.
- **Integration Notes for this Story**:
  - Use `getStartingQuestion()` from `src/lib/profiling/questions.ts` to begin the quiz flow.
  - The UI should call `getQuestionById(answer.next_question_id)` to navigate the question tree.
  - `validateQuestionTree()` can be called at app startup to ensure data integrity.

### Project Structure Notes

- This story builds directly on the data structures created in story 2.1.
- The new UI component will be the first visual element of the "New Quiz User Experience" epic.

### References

- [Source: docs/user_stories.md#Feature-Dynamic-Profiling-Step]
- [Source: docs/sprint-artifacts/stories/2-1-profiling-question-data-structure.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference

- /Users/tostu/Code/welche-partei/docs/sprint-artifacts/stories/2-2-profiling-ui.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**

1. **Component Structure (Task 1 - src/lib/components/profiling/ProfilingQuiz.svelte:1-59)**
   - Created Svelte 5 component using `$state()` rune for reactive state management
   - Imported `getStartingQuestion` and `getQuestionById` helper functions
   - Used TypeScript with strict typing for `ProfilingQuestion` interface

2. **Dynamic Question Rendering (Task 2 - src/lib/components/profiling/ProfilingQuiz.svelte:9-59)**
   - State variables: `currentQuestion` (ProfilingQuestion) and `quizComplete` (boolean)
   - Initialized with `getStartingQuestion()` to load first question
   - Rendered question text in card title (line 37)
   - Used `{#each}` block to iterate over answers array (lines 41-48)

3. **Navigation Logic (Task 3 - src/lib/components/profiling/ProfilingQuiz.svelte:11-26)**
   - Created `handleAnswerClick(nextQuestionId)` function
   - Retrieves next question using `getQuestionById()`
   - Updates `currentQuestion` state to trigger re-render
   - Handles quiz completion when `next_question_id` is undefined
   - Displays completion message when `quizComplete` is true (lines 51-56)

4. **Styling (Task 4 - src/lib/components/profiling/ProfilingQuiz.svelte:30-59)**
   - TailwindCSS utility classes for layout: `flex`, `min-h-screen`, `w-full`, `items-center`, `justify-center`
   - DaisyUI components: `card`, `card-body`, `card-title`, `btn`, `btn-primary`, `btn-lg`
   - Mobile-responsive: `max-w-2xl` for card width, `text-2xl md:text-3xl` for responsive text
   - Button styling: `text-left`, `justify-start`, `normal-case`, `h-auto`, `min-h-[4rem]`, `whitespace-normal`
   - Clean card-based design with proper spacing (`p-4`, `mt-6`, `gap-3`)

5. **Test Route (src/routes/profiling/+page.svelte:1-5)**
   - Created dedicated route at `/profiling` for testing and development
   - Simple page component importing and rendering ProfilingQuiz

6. **End-to-End Tests (Task 5 - e2e/profiling-quiz.test.ts:1-151)**
   - 7 comprehensive Playwright tests
   - Test Results: ✅ 7/7 passed (10.1s execution)
   - Coverage includes:
     - Starting question rendering
     - Three complete navigation paths (under-30→student, 30-50→employed, over-50→retired)
     - Button rendering verification
     - Young worker path
     - Mobile responsiveness (375x667 viewport)

### Completion Notes List

**Acceptance Criteria Satisfaction:**

- **AC #1 ✅**: A Svelte component renders profiling questions dynamically
  - Component created at src/lib/components/profiling/ProfilingQuiz.svelte
  - Uses Svelte 5 `$state()` for reactive state management
  - Dynamically renders current question text and answers from data structure
  - Integrates with helper functions from Story 2.1 (`getStartingQuestion`, `getQuestionById`)
  - Tested in e2e test "should render the starting question" (line 4)

- **AC #2 ✅**: Navigation between questions is smooth and based on user answers
  - `handleAnswerClick` function handles navigation (lines 11-26)
  - Retrieves next question based on answer's `next_question_id` property
  - State update triggers smooth re-render with new question
  - Gracefully handles quiz completion (no more questions)
  - Tested in multiple e2e navigation path tests (lines 16-137)

- **AC #3 ✅**: The UI is clean, mobile-responsive, and easy to use
  - Clean card-based design with DaisyUI components
  - Mobile-first approach with responsive text sizes (`md:` breakpoints)
  - Large, easily tappable buttons with proper whitespace
  - Tested mobile responsiveness at 375x667 viewport (line 139)
  - Centered layout works across all screen sizes

**Key Implementation Highlights:**

1. **Svelte 5 Modern Syntax**: Used `$state()` rune instead of deprecated reactive declarations
2. **Type Safety**: Full TypeScript typing with ProfilingQuestion interface
3. **Error Handling**: Graceful handling of missing questions with console.error and quiz completion
4. **Conversational Flow**: Card-based UI with question text as title and answers as large buttons
5. **Quiz Completion**: Clear end state with German completion message
6. **Accessibility**: Semantic HTML with proper button roles and visible text

**Test Execution Summary:**
```
✓ e2e/profiling-quiz.test.ts (7 tests) 10.1s
Test Files  1 passed (1)
     Tests  7 passed (7)
```

**Test Coverage:**
- Starting question rendering (1 test)
- Complete navigation paths (4 tests)
- Button count verification (1 test)
- Mobile responsiveness (1 test)

**Technical Decisions:**

- **Svelte 5 Runes**: Used `$state()` for reactive state management (modern Svelte 5 approach)
- **Card Layout**: DaisyUI card component provides clean, consistent UI
- **Button Styling**: Large, auto-height buttons with left-aligned text for long German phrases
- **Quiz Completion**: Separate UI state with completion message instead of empty screen
- **Test Route**: Created `/profiling` route for development and e2e testing
- **Error Logging**: Console.error for missing questions to aid debugging

**Integration with Story 2.1:**

Successfully integrated with all data structures and helper functions from Story 2.1:
- `ProfilingQuestion` and `ProfilingAnswer` interfaces (src/lib/profiling/types.ts)
- `getStartingQuestion()` initializes the quiz
- `getQuestionById()` navigates the question tree
- Question tree structure with 10 questions across 3 age-based paths

**UX Features:**

- Clean, distraction-free interface focusing on one question at a time
- Large, tappable buttons for easy mobile interaction
- German language throughout for German political quiz context
- Clear visual hierarchy with question as card title, answers as primary buttons
- Completion message providing closure to the profiling step

### File List

**New Files Created:**
- `src/lib/components/profiling/ProfilingQuiz.svelte` (59 lines) - Main profiling quiz component
- `src/routes/profiling/+page.svelte` (5 lines) - Test route for profiling quiz
- `e2e/profiling-quiz.test.ts` (151 lines) - Comprehensive e2e test suite (7 tests)

**No Modified Files:**
- All implementation is new for this story
