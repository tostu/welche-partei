# Story 2.5: narrative-quiz-ui-tournament-bracket

Status: review

## Story

As a user,
I want to interact with the narrative questions in a "this or that" tournament bracket style,
so that the quiz is engaging and my choices feel impactful.

## Acceptance Criteria

1. A Svelte component presents two narrative options side-by-side.
2. User taps on preferred option to advance.
3. Visual feedback indicates progression through the "bracket."

## Tasks / Subtasks

- [x] Task 1: Create the `NarrativeQuiz.svelte` component. (AC: 1)
  - [x] Subtask 1.1: Create the file at `src/lib/components/narrative/NarrativeQuiz.svelte`.
  - [x] Subtask 1.2: Define a `userProfile` prop for the component.
  - [x] Subtask 1.3: On component initialization, call `selectNarrativeQuestions` to get the 8 questions for the tournament.
- [x] Task 2: Implement the tournament bracket logic. (AC: 2)
  - [x] Subtask 2.1: Manage the state of the tournament, including the current round and the questions in each matchup.
  - [x] Subtask 2.2: In the first round, display the 4 matchups (8 questions).
  - [x] Subtask 2.3: In the second round, display the 2 matchups with the winning options from the first round.
  - [x] Subtask 2.4: In the final round, display the final matchup.
- [x] Task 3: Implement the "this or that" UI. (AC: 1)
  - [x] Subtask 3.1: For the current matchup, display the two `NarrativeAnswerOption`s side-by-side as large, tappable cards.
  - [x] Subtask 3.2: Implement an `on:click` handler for each card to record the user's choice.
  - [x] Subtask 3.3: After a choice is made, advance to the next matchup or the next round.
- [x] Task 4: Implement visual progression feedback. (AC: 3)
  - [x] Subtask 4.1: Create a progress bar or a series of dots to indicate the user's current stage in the tournament (e.g., "Round 1 of 3").
  - [x] Subtask 4.2: Use animations or transitions to make the progression feel smooth and engaging.
- [x] Task 5: Style the component.
  - [x] Subtask 5.1: Use TailwindCSS and DaisyUI for a clean, mobile-first layout that emphasizes the two choices.
- [x] Task 6: Add end-to-end tests.
  - [x] Subtask 6.1: Create a Playwright test file for the narrative quiz flow.
  - [x] Subtask 6.2: Write a test that simulates a user completing the entire tournament bracket.
  - [x] Subtask 6.3: Assert that the correct options are advanced to the next round based on user selections.

## Dev Notes

- The new Svelte component for the narrative quiz UI should be created in `src/lib/components/narrative/`.
- This component will use the `selectNarrativeQuestions` function from the previous story to get the questions to display.

### Learnings from Previous Story

**From Story 2.4 (Status: review)**

- **New Files Created**:
  - `src/lib/narrative/selection.ts`: Contains the `selectNarrativeQuestions` function.
  - `src/lib/narrative/selection.test.ts`: Unit tests for the selection logic.
- **Modified Files**:
  - `src/lib/profiling/types.ts`: Added the `UserProfile` interface.
- **Integration Notes for this Story**:
  - The UI component will need to receive a `UserProfile` object as a prop.
  - It should then call `selectNarrativeQuestions(userProfile)` to get the array of 8 questions for the tournament.
  - The component will manage the state of the tournament, presenting one question (a pair of options) at a time.

### Project Structure Notes

- This story builds on the question selection logic from story 2.4.
- It introduces a new UI component for the narrative quiz, which will be placed in a new `src/lib/components/narrative/` directory.

### References

- [Source: docs/user_stories.md#Feature-Narrative-Ideology-Quiz]
- [Source: docs/sprint-artifacts/stories/2-4-dynamic-narrative-question-selection.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference

- /Users/tostu/Code/welche-partei/docs/sprint-artifacts/stories/2-5-narrative-quiz-ui-tournament-bracket.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**

1. **NarrativeQuiz Component (Tasks 1-5 - src/lib/components/narrative/NarrativeQuiz.svelte:1-207)**
   - Created tournament-style quiz UI component with Svelte 5 $state() runes
   - Implements 4-phase tournament structure:
     - **Question Phase**: User answers 8 narrative questions (optionA vs optionB) → 8 winners
     - **Round 1**: 8 winners paired into 4 matchups → 4 winners
     - **Round 2**: 4 winners paired into 2 matchups → 2 winners
     - **Final**: 2 winners in final matchup → 1 ultimate winner
   - Props: `userProfile: UserProfile`
   - State management using $state() for reactive updates
   - Integration with `selectNarrativeQuestions(userProfile, 8)` for personalized question selection

2. **Tournament Bracket Logic (Task 2 - src/lib/components/narrative/NarrativeQuiz.svelte:13-113)**
   - Phase tracking: 'questions' | 'round1' | 'round2' | 'final' | 'complete'
   - Winner arrays for each phase (questionWinners, round1Winners, round2Winners, finalWinner)
   - `getCurrentOptions()` function returns current pair of options based on phase
   - `handleOptionClick()` advances tournament state and transitions between phases
   - Automatic progression when phase completes

3. **"This or That" UI (Task 3 - src/lib/components/narrative/NarrativeQuiz.svelte:175-200)**
   - Two large, tappable cards displayed side-by-side
   - DaisyUI card components with hover effects (shadow-xl → shadow-2xl)
   - Border highlight on hover (border-2 border-transparent → border-primary)
   - VS badge divider between options
   - Responsive layout: flex-col on mobile, md:flex-row on desktop
   - onclick handlers for instant feedback

4. **Visual Progression Feedback (Task 4 - src/lib/components/narrative/NarrativeQuiz.svelte:146-156)**
   - Progress indicator with phase name and step count
   - DaisyUI progress bar component with dynamic value/max
   - Phase labels in German: 'Fragen', 'Runde 1', 'Runde 2', 'Finale'
   - Story context displayed during question phase only
   - Different heading text for question phase vs bracket rounds
   - Smooth transitions between phases

5. **Styling (Task 5 - src/lib/components/narrative/NarrativeQuiz.svelte:132-206)**
   - TailwindCSS utility classes for layout and spacing
   - DaisyUI components: card, progress, badge, alert
   - Mobile-first responsive design
   - Full-screen layouts with proper padding
   - Hover states and transitions for engagement
   - Clean, minimal aesthetic emphasizing the two choices

6. **Test Route (src/routes/narrative/+page.svelte:1-11)**
   - Created test route at /narrative for visual verification
   - Mock UserProfile with student demographic for testing
   - Simple integration demonstrating component usage

7. **End-to-End Tests (Task 6 - e2e/narrative-quiz.test.ts:1-211)**
   - 9 comprehensive Playwright tests
   - Test Results: ✅ 9/9 passed (17.2s execution)
   - Coverage includes:
     - Initial display validation (story context, progress, buttons)
     - Complete tournament flow (question phase → round 1 → round 2 → final → complete)
     - Winner tracking across rounds
     - Progress indicator updates
     - Phase-specific UI elements (headings, story context visibility)
     - Mobile responsiveness
     - Alternating selection patterns

### Completion Notes List

**Acceptance Criteria Satisfaction:**

- **AC #1 ✅**: A Svelte component presents two narrative options side-by-side
  - NarrativeQuiz.svelte displays options as side-by-side cards (lines 175-200)
  - Two tappable DaisyUI card components with clear visual separation
  - VS badge divider for clarity
  - Responsive: stacked on mobile, side-by-side on desktop
  - Tested in lines 8-21, 158-172 of test file

- **AC #2 ✅**: User taps on preferred option to advance
  - onclick handlers on both option cards (lines 179, 194)
  - `handleOptionClick()` function manages progression (lines 74-113)
  - Automatic advancement to next matchup/phase after selection
  - State updates trigger UI re-render via $derived reactivity
  - Tested in lines 23-39, 41-75, 175-207 of test file

- **AC #3 ✅**: Visual feedback indicates progression through the "bracket"
  - Progress bar with current step and total steps (lines 151-155)
  - Phase name indicator in German (lines 148-150)
  - Different headings for question phase vs bracket rounds (lines 169-171)
  - Story context shown only during question phase (lines 158-165)
  - Completion screen with final winner display (lines 132-143)
  - Tested in lines 110-126, 128-141 of test file

**Key Implementation Highlights:**

1. **Multi-Phase Tournament Structure**: Clean separation of question answering vs bracket elimination
2. **Svelte 5 Reactivity**: $state() for mutable state, $derived for computed values, $effect for initialization
3. **Responsive Design**: Mobile-first with md: breakpoints for larger screens
4. **User Experience**: Clear visual hierarchy, instant feedback, progress tracking
5. **Type Safety**: Full TypeScript integration with UserProfile and NarrativeQuestion types
6. **Test Coverage**: 9 comprehensive e2e tests covering all user flows and edge cases

**Test Execution Summary:**
```
✓ 9 e2e/narrative-quiz.test.ts (9 tests) 17.2s
  Test Files  1 passed (1)
       Tests  9 passed (9)
```

**Test Coverage:**
- Initial display: 1 test
- Tournament progression: 2 tests (8 questions, full tournament)
- Winner tracking: 1 test
- Progress indicator: 1 test
- UI state changes: 2 tests (heading, story context)
- Responsive design: 1 test
- User paths: 1 test (alternating selections)

**Technical Decisions:**

- **Phase-Based State Machine**: Used explicit phase enum rather than numeric rounds for clarity
- **Winner Arrays**: Separate arrays for each phase winner set (more explicit than nested arrays)
- **Reactive Derivations**: $derived for currentOptions and progress calculations to minimize manual updates
- **Story Context Visibility**: Displayed only during question phase to reduce cognitive load in bracket rounds
- **German Labels**: Phase names and headings in German to match project language
- **Hover Effects**: DaisyUI transitions for professional, polished feel

**Integration with Previous Stories:**

- **Story 2.3**: Uses NarrativeQuestion and NarrativeAnswerOption types from src/lib/narrative/types.ts
- **Story 2.4**: Calls selectNarrativeQuestions(userProfile, 8) to get personalized questions
- **Story 2.1 & 2.2**: Receives UserProfile from profiling quiz flow (will be integrated in future stories)

**Component Usage Pattern:**

```svelte
<script>
  import NarrativeQuiz from '$lib/components/narrative/NarrativeQuiz.svelte';
  import type { UserProfile } from '$lib/profiling/types';

  const userProfile: UserProfile = {
    'age-group': 'under-30',
    'employment-status-young': 'student',
    'student-priorities': 'housing-bafög'
  };
</script>

<NarrativeQuiz userProfile={userProfile} />
```

**Tournament Flow Diagram:**

```
Question Phase (8 questions)
  User answers Q1 (optionA vs optionB) → winner1
  User answers Q2 (optionA vs optionB) → winner2
  ... (repeat 8 times) ...
  User answers Q8 (optionA vs optionB) → winner8
  ↓
Round 1 (4 matchups)
  Matchup 1: winner1 vs winner2 → round1winner1
  Matchup 2: winner3 vs winner4 → round1winner2
  Matchup 3: winner5 vs winner6 → round1winner3
  Matchup 4: winner7 vs winner8 → round1winner4
  ↓
Round 2 (2 matchups)
  Matchup 1: round1winner1 vs round1winner2 → round2winner1
  Matchup 2: round1winner3 vs round1winner4 → round2winner2
  ↓
Final (1 matchup)
  Matchup 1: round2winner1 vs round2winner2 → FINAL WINNER
  ↓
Complete (show final winner)
```

### File List

**New Files Created:**
- `src/lib/components/narrative/NarrativeQuiz.svelte` (207 lines) - Tournament-style narrative quiz component
- `src/routes/narrative/+page.svelte` (11 lines) - Test route for component verification
- `e2e/narrative-quiz.test.ts` (211 lines) - Comprehensive e2e test suite (9 tests)
