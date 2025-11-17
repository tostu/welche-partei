# Product Requirements Document (PRD): Integrated Profiling & Narrative Ideology Matching Quiz

## 1. Introduction

This document outlines the requirements for the redesign of the political quiz, transitioning from a direct preference-matching system to an integrated profiling and narrative ideology-matching approach. The primary goal is to provide users with a highly engaging, personalized, and low-maintenance experience that guides them towards a "better alternative" political party, offering actionable recommendations relevant to the upcoming election cycle.

## 2. User Stories

### Epic 1: New Quiz User Experience

*   **US1.1 - Dynamic Initial Profiling:** As a user, I want to answer 4-7 simple, dynamic profiling questions so that the quiz feels like an intelligent conversation tailored to my life situation.
*   **US1.2 - Personalized Narrative Questions:** As a user, I want to be presented with 7-8 story-based questions that are relevant to my life context so that the quiz feels personal and engaging.
*   **US1.3 - Engaging Choice Mechanism:** As a user, I want to choose between two competing narrative scenarios (a "this or that" format) for each question so that I can easily express my priorities without high mental load.
*   **US1.4 - Clear Progression:** As a user, I want the quiz interaction to feel dynamic and progressive (e.g., like a tournament bracket) so that I remain engaged and understand how my choices are building towards a result.
*   **US1.5 - Actionable Results:** As a user, I want to receive a clear recommendation for a political party that aligns with my core problem-solving philosophy, presented in a way that connects to concrete, near-term issues relevant to the next election.

### Epic 2: Ideological Matching Engine

*   **US2.1 - Ideological Question Bank:** As an administrator, I want a bank of narrative questions, each tagged with relevant demographic indicators and designed to reveal a user's preference on specific ideological axes (e.g., Market vs. State, Individual vs. Collective).
*   **US2.2 - Dynamic Question Selection Logic:** As a system, I need to dynamically select 7-8 narrative questions from the question bank based on the user's initial profiling answers to ensure relevance.
*   **US2.3 - Ideological Axis Mapping:** As a system, I need to map user choices in the narrative quiz to a score on predefined ideological axes.
*   **US2.4 - Party Ideological Profiles:** As an administrator, I need to define and maintain ideological profiles for each political party, scoring them on the same set of ideological axes.
*   **US2.5 - Matching Algorithm:** As a system, I need an algorithm to compare the user's ideological profile (vector) with party ideological profiles to find the closest match.
*   **US2.6 - Result Justification:** As a system, I need to generate a justification for the recommended party that explains the alignment between the user's worldview and the party's approach, linking it to practical outcomes.

## 3. Functional Requirements

*   **FR3.1 - Dynamic Profiling UI & Logic:** Implement a UI for 4-7 profiling questions with conditional, branching logic. The answer to a question can determine the next question shown.
*   **FR3.2 - Dynamic Question Loading:** Implement logic to select and load narrative questions based on profiling answers.
*   **FR3.3 - Narrative Quiz UI:** Develop a card-based "this or that" UI for narrative questions, supporting tap interactions.
*   **FR3.4 - Ideological Scoring:** Implement backend logic to convert user choices into ideological axis scores.
*   **FR3.5 - Party Ideology Data Management:** Provide a mechanism (e.g., a configuration file) to define and update party ideological scores.
*   **FR3.6 - Matching Algorithm Implementation:** Implement the core algorithm to match user and party ideological profiles.
*   **FR3.7 - Results Display:** Design and implement a results page that clearly presents the recommended party, its ideological alignment, and its connection to practical outcomes.
*   **FR3.8 - Alternative Recommendation Logic:** Maintain the existing logic for suggesting a "better alternative" if the top ideological match is an establishment or far-right party, adapting it to the new ideological framework.

## 4. Non-Functional Requirements

*   **NFR4.1 - Performance:** The quiz should load quickly and transitions between questions should be instantaneous.
*   **NFR4.2 - Scalability:** The system should be able to handle an increasing number of users and a growing question bank without performance degradation.
*   **NFR4.3 - Maintainability:** The ideological axis definitions, party scores, and narrative questions should be easily configurable and updatable.
*   **NFR4.4 - Usability:** The quiz UI must be intuitive and accessible across devices (mobile-first design).
*   **NFR4.5 - Security:** User data (profiling answers, quiz choices) must be handled securely and anonymously.

## 5. Data Model

*   **Profiling Questions:** A tree or graph data structure where each question object contains a `next_question` field, conditional on the user's answer.
*   **Ideological Axes:** A set of predefined axes (e.g., Market vs. State, Individual vs. Collective, Regulation vs. Deregulation), each with a defined range (e.g., 1-10).
*   **Narrative Questions:** Each question will include:
    *   Question text (story/scenario).
    *   Two answer options (A and B).
    *   Mapping for each option to its impact on ideological axis scores.
    *   Tags for demographic relevance (e.g., #homeowner, #parent).
*   **Party Ideological Profiles:** Each party will have a score (or vector) across all defined ideological axes.
*   **User Profile:** Stores initial profiling answers and the calculated ideological axis scores.

## 6. Technical Considerations

*   **Frontend Framework:** SvelteKit (existing).
*   **Styling:** TailwindCSS, DaisyUI (existing).
*   **State Management:** Svelte's `$state` (existing).
*   **Data Storage:** Configuration files (`.ts` or `.json`) for questions and party profiles.
*   **Matching Logic:** Implemented in TypeScript.
*   **Development Complexity:** The dynamic, branching logic for the profiling quiz represents a higher level of complexity than a simple, static list of questions.

## 7. Success Metrics

*   **User Engagement:** Completion rate of the quiz.
*   **User Satisfaction:** Feedback on the quiz experience (e.g., "Did the quiz feel personal?", "Did the result make sense?").
*   **Recommendation Acceptance:** User interaction with the recommended party (e.g., clicks on "Mehr erfahren" button).
*   **Maintainability:** Time taken to update party profiles or add new questions.

---
**Document Version:** 1.1
**Date:** {{date:system-generated}}
**Author:** John (Product Manager)
---