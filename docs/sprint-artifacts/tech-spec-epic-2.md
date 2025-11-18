# Epic Technical Specification: Ideological Matching Engine

Date: 2025-11-17
Author: tostu
Epic ID: 2
Status: Draft

---

## Overview

## Overview

This epic focuses on the core "Ideological Matching Engine" for the political quiz redesign. The overall project aims to transition from a direct preference-matching system to an integrated profiling and narrative ideology-matching approach. The primary goal is to provide users with a highly engaging, personalized, and low-maintenance experience that guides them towards a "better alternative" political party, offering actionable recommendations relevant to the upcoming election cycle. This epic specifically addresses the backend logic and data structures required for the ideological matching.

## Objectives and Scope

## Objectives and Scope

**In-Scope:**
*   **Ideological Matching Engine:**
    *   Dynamic question selection logic based on initial profiling.
    *   Mapping user choices to scores on predefined ideological axes.
    *   Defining and maintaining ideological profiles for political parties.
    *   Algorithm to compare user and party ideological profiles for the closest match.
    *   Generating justification for recommended party, linking user worldview to party approach and practical outcomes.
*   **Functional Requirements:**
    *   Dynamic Question Loading logic.
    *   Ideological Scoring backend implementation.
    *   Party Ideology Data Management mechanism (e.g., configuration file).
    *   Matching Algorithm Implementation.

**Out-of-Scope (for this Epic):**
*   New Quiz User Experience (Epic 1 features).
*   Dynamic Profiling UI & Logic (FR3.1).
*   Narrative Quiz UI (FR3.3).
*   Results Display (FR3.7).
*   Alternative Recommendation Logic (FR3.8).

## System Architecture Alignment

## System Architecture Alignment

This epic's development will align with the existing technical stack:
*   **Frontend Framework:** SvelteKit (existing).
*   **Styling:** TailwindCSS, DaisyUI (existing).
*   **State Management:** Svelte's `$state` (existing).
*   **Data Storage:** Configuration files (`.ts` or `.json`) will be used for questions and party profiles.
*   **Matching Logic:** Will be implemented in TypeScript.

## Detailed Design

### Services and Modules

### Services and Modules

*   **IdeologicalScoringService:**
    *   **Responsibility:** Converts user's narrative quiz choices into a quantitative ideological profile (scores across defined axes).
    *   **Inputs:** User's selected choices for narrative questions.
    *   **Outputs:** `UserIdeologicalProfile` object.
    *   **Owner:** Backend Team
*   **PartyProfileService:**
    *   **Responsibility:** Manages the definition and retrieval of political party ideological profiles.
    *   **Inputs:** Configuration data (e.g., JSON/TS files) for party scores.
    *   **Outputs:** List of `PartyIdeologicalProfile` objects.
    *   **Owner:** Backend Team / Data Management
*   **MatchingService:**
    *   **Responsibility:** Implements the core algorithm to compare a user's ideological profile against all party profiles to find the best match.
    *   **Inputs:** `UserIdeologicalProfile`, list of `PartyIdeologicalProfile`s.
    *   **Outputs:** `PartyRecommendation` object (including justification).
    *   **Owner:** Backend Team

### Data Models and Contracts

### Data Models and Contracts

*   **IdeologicalAxis:**
    *   `id`: string (e.g., "market_state")
    *   `name`: string (e.g., "Market vs. State")
    *   `range`: { `min`: number, `max`: number } (e.g., { min: 1, max: 10 })
*   **NarrativeQuestion:**
    *   `id`: string
    *   `text`: string (story/scenario)
    *   `options`: [
        *   `optionA`: { `text`: string, `ideologicalImpact`: { [axisId: string]: number } }
        *   `optionB`: { `text`: string, `ideologicalImpact`: { [axisId: string]: number } }
      ]
    *   `tags`: string[] (e.g., ["#homeowner", "#parent"])
*   **PartyIdeologicalProfile:**
    *   `partyId`: string (e.g., "spd")
    *   `name`: string (e.g., "SPD")
    *   `scores`: { [axisId: string]: number } (e.g., { "market_state": 7, "individual_collective": 6 })
*   **UserIdeologicalProfile:**
    *   `userId`: string (anonymous)
    *   `profilingAnswers`: { [questionId: string]: string }
    *   `scores`: { [axisId: string]: number }
*   **PartyRecommendation:**
    *   `partyId`: string
    *   `justification`: string
    *   `alignmentScore`: number

### APIs and Interfaces

### APIs and Interfaces

The following internal interfaces are implied by the module breakdown:

*   **`IdeologicalScoringService` Interface:**
    ```typescript
    interface IdeologicalScoringService {
      score(userChoices: UserChoice[]): UserIdeologicalProfile;
    }
    ```
*   **`PartyProfileService` Interface:**
    ```typescript
    interface PartyProfileService {
      getProfiles(): PartyIdeologicalProfile[];
      // Potentially add methods for updating/managing profiles if needed by admin tools
    }
    ```
*   **`MatchingService` Interface:**
    ```typescript
    interface MatchingService {
      findBestMatch(
        userProfile: UserIdeologicalProfile,
        partyProfiles: PartyIdeologicalProfile[]
      ): PartyRecommendation;
    }
    ```

### Workflows and Sequencing

### Workflows and Sequencing

This epic primarily focuses on the backend logic that supports the overall quiz workflow.

1.  **Initial Profiling (Epic 1):** User answers initial profiling questions, which inform dynamic question selection.
2.  **Dynamic Narrative Question Selection:** Based on profiling answers, the system (`IdeologicalScoringService`) dynamically selects 7-8 narrative questions from the question bank.
3.  **Narrative Quiz Interaction (Epic 1):** User interacts with the narrative quiz, making choices for each question.
4.  **Ideological Scoring:** User choices are fed into the `IdeologicalScoringService` to calculate the `UserIdeologicalProfile`.
5.  **Party Profile Retrieval:** The `PartyProfileService` provides the latest `PartyIdeologicalProfile`s.
6.  **Best Match Identification:** The `MatchingService` compares the `UserIdeologicalProfile` with `PartyIdeologicalProfile`s to determine the closest match.
7.  **Result Justification Generation:** The `MatchingService` generates a justification for the recommended party.
8.  **Results Display (Epic 1):** The recommended party and justification are presented to the user.

## Non-Functional Requirements

### Performance

### Performance

*   **NFR4.1 - Responsiveness:** Ideological scoring and matching algorithm execution should complete within 100ms to ensure a fluid user experience.
*   **NFR4.2 - Scalability:** The matching engine must scale to handle an increasing number of concurrent users and a growing question/party profile dataset without significant performance degradation. Caching strategies for party profiles should be considered.

### Security

### Security

*   **NFR4.5 - Data Anonymity:** User ideological profiles and quiz choices must be processed anonymously. No personally identifiable information will be stored or associated with the ideological profile within this epic's scope.
*   **Data Integrity:** Configuration files for party profiles and questions must be stored securely and managed via version control to ensure integrity and traceability of changes.

### Reliability/Availability

### Reliability/Availability

*   **High Availability:** The ideological matching engine is a core component and must be highly available to ensure the quiz functions continuously.
*   **Graceful Degradation:** In scenarios where external data sources for party profiles or question banks might be temporarily unavailable, the system should employ caching or fallback mechanisms to ensure the quiz can still provide a result, even if potentially less precise.

### Observability

### Observability

*   **Logging:** Implement comprehensive logging for key events within the ideological matching engine, including:
    *   Start and end of profile calculation.
    *   Start and end of matching algorithm execution.
    *   Any errors or exceptions encountered.
    *   Input parameters and output results (anonymized).
*   **Metrics:** Expose metrics for:
    *   Execution time of `IdeologicalScoringService` and `MatchingService`.
    *   Number of user profiles processed.
    *   Number of party profiles loaded.
    *   Error rates for core services.
*   **Tracing:** Integrate with distributed tracing (if applicable to the overall system architecture) to allow end-to-end visibility of requests through the matching engine.

## Dependencies and Integrations

## Dependencies and Integrations

This epic will leverage the existing project dependencies and integrate with the current architecture.

**Core Technologies:**
*   **Frontend Framework:** SvelteKit (`@sveltejs/kit`, `svelte`)
*   **Styling:** TailwindCSS (`tailwindcss`), DaisyUI (`daisyui`)
*   **Language:** TypeScript (`typescript`)

**Key Dependencies for this Epic:**
*   **Data Storage:** Configuration files (e.g., `.ts` or `.json`) for ideological axes, narrative questions, and party profiles. These will be managed within the application's codebase.
*   **Database Client:** `@libsql/client` (if persistent storage beyond config files is required for dynamic question banks or user profiles).
*   **Charting/Visualization:** `d3` (if any visualization of ideological profiles or matching results is required within this epic's scope).

**Development Dependencies:**
*   **Testing:** `vitest` (unit testing), `@playwright/test` (e2e testing).
*   **Linting/Formatting:** `eslint`, `prettier`.

## Acceptance Criteria (Authoritative)

## Acceptance Criteria (Authoritative)

1.  The system shall store a bank of narrative questions, each tagged with demographic indicators and designed to reveal preferences on specific ideological axes. (US2.1)
2.  The system shall dynamically select 7-8 narrative questions from the question bank based on the user's initial profiling answers. (US2.2, FR3.2)
3.  The system shall map user choices in the narrative quiz to a score on predefined ideological axes. (US2.3, FR3.4)
4.  The system shall allow administrators to define and maintain ideological profiles for each political party, scoring them on the same set of ideological axes. (US2.4, FR3.5)
5.  The system shall implement an algorithm to compare the user's ideological profile (vector) with party ideological profiles to find the closest match. (US2.5, FR3.6)
6.  The system shall generate a justification for the recommended party, explaining the alignment between the user's worldview and the party's approach, linked to practical outcomes. (US2.6)

## Traceability Mapping

## Traceability Mapping

| AC ID | Description                                                                                          | Spec Section(s)             | Component(s)/API(s)                  | Test Idea                                                                                                     |
| :---- | :--------------------------------------------------------------------------------------------------- | :-------------------------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| 1     | System stores tagged narrative questions.                                                            | Data Models                 | Configuration files for questions    | Verify question data structure and tag application.                                                           |
| 2     | System dynamically selects narrative questions based on profiling.                                   | Workflows, Services & Modules | `IdeologicalScoringService`          | Test dynamic question selection with varied profiling inputs.                                                 |
| 3     | System maps user choices to ideological axis scores.                                                 | Workflows, Services & Modules | `IdeologicalScoringService`          | Verify correct score calculation for different user choices.                                                  |
| 4     | Admins define/maintain party ideological profiles.                                                   | Data Models                 | Configuration files for party profiles | Test administration interface or direct file updates for party profiles.                                      |
| 5     | System algorithm compares user/party profiles for best match.                                        | Workflows, Services & Modules | `MatchingService`                    | Verify matching algorithm outputs closest party for various user profiles.                                    |
| 6     | System generates justification for recommended party.                                                | Workflows, Services & Modules | `MatchingService`                    | Verify generated justification aligns with user/party profiles and is understandable.                         |

## Risks, Assumptions, Open Questions

## Risks, Assumptions, Open Questions

*   **Risk:** Defining and quantifying ideological axes accurately can be complex and subjective.
    *   **Mitigation:** Start with a minimal, well-researched set of axes. Involve political science expertise for validation. Plan for iterative refinement based on feedback.
*   **Risk:** Potential for bias in question design or scoring logic leading to skewed results.
    *   **Mitigation:** Implement a rigorous review process for all questions and scoring algorithms. Conduct A/B testing and user studies to detect and mitigate bias.
*   **Assumption:** Political party ideologies can be reasonably represented by quantitative scores across a defined set of axes.
    *   **Mitigation:** Continuously validate this assumption with political experts and through user feedback on result accuracy.
*   **Open Question:** How will the existing "better alternative" recommendation logic (FR3.8) be integrated with the new ideological matching engine?
    *   **Next Step:** Define the specific integration points and data flow between the new `MatchingService` and the legacy alternative recommendation system.

## Test Strategy Summary

## Test Strategy Summary

A multi-layered testing approach will be employed:

*   **Unit Testing:**
    *   **Scope:** Individual functions and methods within `IdeologicalScoringService`, `PartyProfileService`, and `MatchingService`.
    *   **Framework:** `vitest`.
    *   **Coverage:** Focus on algorithmic correctness, data transformations, and edge cases (e.g., empty inputs, invalid scores).
*   **Integration Testing:**
    *   **Scope:** Verify the interaction between the core services and the correct loading/parsing of configuration files (questions, party profiles).
    *   **Framework:** `vitest` (or similar for backend integration).
    *   **Coverage:** Ensure data flows correctly between modules and that external data sources are consumed as expected.
*   **Acceptance Testing:**
    *   **Scope:** Validate that all Acceptance Criteria (ACs) are met from an end-to-end perspective, simulating user interactions where possible.
    *   **Framework:** `playwright` (for end-to-end quiz flow, integrating with Epic 1 UI) and manual testing for complex justification logic.
    *   **Coverage:** Ensure the system correctly selects questions, scores profiles, matches parties, and generates justifications.
*   **Data Validation Testing:**
    *   **Scope:** Verify the integrity and consistency of ideological axis definitions, narrative questions, and party ideological profiles.
    *   **Method:** Automated checks on configuration files and manual review by domain experts.