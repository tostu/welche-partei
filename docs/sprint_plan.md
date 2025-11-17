# Sprint Plan: Integrated Profiling & Narrative Ideology Matching Quiz

## Overview

This document outlines the sprint plan for the development of the new Integrated Profiling & Narrative Ideology Matching Quiz. The plan is divided into two sprints, focusing on building the foundational ideological matching engine in Sprint 1 and then integrating the user experience in Sprint 2.

## Sprint 1: Foundation & Core Logic

*   **Goal:** Build the data models and core logic for the ideological matching engine. Establish the backend infrastructure for ideological matching.
*   **Duration:** [To be determined, e.g., 2 weeks]
*   **Sprint Goal:** "Amelia can successfully run a test script that takes a user's ideological choices and returns the best-matched party based on the new ideological data model."

### User Stories (from `docs/user_stories.md`)

1.  **US: Data Model for Ideological Axes**
    *   **As a developer,** I need a clear and extensible data structure (e.g., TypeScript interface and JSON/TS file) to define ideological axes (e.g., Market vs. State, Individual vs. Collective) with their respective ranges, **so that** the matching algorithm has a robust foundation.
    *   **Acceptance Criteria:**
        *   A `types.ts` file defines `IdeologicalAxis` interface with `id`, `name`, `min_value`, `max_value`.
        *   A `ideologicalAxes.ts` file exports an array of `IdeologicalAxis` objects.
        *   Each axis has a clear definition and range (e.g., 1-10).

2.  **US: Party Ideological Profiles**
    *   **As a developer,** I need a data structure (e.g., TypeScript interface and JSON/TS file) to store each political party's score across all defined ideological axes, **so that** the matching algorithm can compare user profiles against party profiles.
    *   **Acceptance Criteria:**
        *   A `types.ts` file defines `PartyIdeologicalProfile` interface with `party_id` and a map of `axis_id` to `score`.
        *   A `partyIdeologies.ts` file exports an array of `PartyIdeologicalProfile` objects.
        *   Each party has a score for every defined ideological axis.

3.  **US: User Ideological Profile Calculation**
    *   **As a system,** I need to calculate a user's ideological profile (a vector of scores across all ideological axes) based on their answers to the narrative quiz, **so that** it can be compared with party profiles.
    *   **Acceptance Criteria:**
        *   A function `calculateUserIdeology(quizAnswers: UserQuizAnswers): UserIdeologicalProfile` exists.
        *   The function correctly maps narrative quiz choices to changes in ideological axis scores.
        *   The output `UserIdeologicalProfile` matches the defined interface.

4.  **US: Best Match Identification**
    *   **As a system,** I need an algorithm to compare the user's calculated ideological profile with all `PartyIdeologicalProfile`s, **so that** the closest matching party can be identified.
    *   **Acceptance Criteria:**
        *   A function `findBestMatch(userProfile: UserIdeologicalProfile, partyProfiles: PartyIdeologicalProfile[]): Party` exists.
        *   The algorithm uses a robust distance metric (e.g., Euclidean distance) to determine closeness.
        *   The function returns the `Party` object of the best match.

## Sprint 2: User Experience & Integration

*   **Goal:** Build the new user-facing quiz experience, integrate it with the core logic, and present the results.
*   **Duration:** [To be determined, e.g., 2 weeks]
*   **Sprint Goal:** "Users can complete the new dynamic profiling and narrative quiz, receive a personalized party recommendation, and understand the justification for that recommendation."

### User Stories (from `docs/user_stories.md`)

1.  **US: Profiling Question Data Structure**
    *   **As a developer,** I need a data structure (e.g., TypeScript interface and JSON/TS file) to define profiling questions, including conditional `next_question_id` based on answers, **so that** the quiz can implement dynamic, branching logic.
    *   **Acceptance Criteria:**
        *   A `ProfilingQuestion` interface includes `id`, `text`, `answers`, and `conditional_next_question_id` logic.
        *   A `profilingQuestions.ts` file exports an array of `ProfilingQuestion` objects.
        *   The data structure supports a tree/graph like navigation.

2.  **US: Profiling UI**
    *   **As a user,** I want to answer 4-7 simple profiling questions presented in a conversational flow, **so that** the quiz feels tailored to my needs without being overwhelming.
    *   **Acceptance Criteria:**
        *   A Svelte component renders profiling questions dynamically.
        *   Navigation between questions is smooth and based on user answers.
        *   The UI is clean, mobile-responsive, and easy to use.

3.  **US: Narrative Question Data Structure**
    *   **As a developer,** I need a data structure (e.g., TypeScript interface and JSON/TS file) to define narrative questions, including story text, two answer options, and their impact on ideological axes, **so that** the quiz can present engaging dilemmas.
    *   **Acceptance Criteria:**
        *   A `NarrativeQuestion` interface includes `id`, `story_text`, `optionA`, `optionB`.
        *   Each option maps to changes in ideological axis scores.
        *   A `narrativeQuestions.ts` file exports a bank of `NarrativeQuestion` objects, tagged for demographic relevance.

4.  **US: Dynamic Narrative Question Selection**
    *   **As a system,** I need logic to select 7-8 relevant narrative questions from the bank based on the user's profiling answers, **so that** the main quiz feels highly personalized.
    *   **Acceptance Criteria:**
        *   A function `selectNarrativeQuestions(userProfile: UserProfile): NarrativeQuestion[]` exists.
        *   The function prioritizes questions tagged with matching demographic indicators.

5.  **US: Narrative Quiz UI (Tournament Bracket)**
    *   **As a user,** I want to interact with the narrative questions in a "this or that" tournament bracket style, **so that** the quiz is engaging and my choices feel impactful.
    *   **Acceptance Criteria:**
        *   A Svelte component presents two narrative options side-by-side.
        *   User taps on preferred option to advance.
        *   Visual feedback indicates progression through the "bracket."

6.  **US: Personalized Results Display**
    *   **As a user,** I want to see my recommended party, its ideological alignment, and how it connects to practical outcomes relevant to me, **so that** the result feels actionable and justified.
    *   **Acceptance Criteria:**
        *   The results page displays the best-matched party prominently.
        *   It explains the ideological alignment in user-friendly terms.
        *   It highlights 2-3 concrete outcomes the party would deliver based on the user's profile.
        *   The "better alternative" is presented clearly when applicable.

---
**Document Version:** 1.0
**Date:** {{date:system-generated}}
**Author:** Bob (Scrum Master)
---
