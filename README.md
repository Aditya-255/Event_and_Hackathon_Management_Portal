
# 🏆 EventHub: Dynamic Event & Hackathon Management Portal
**Project Status:** `Checkpoint 1 - Architecture & Skeleton (T+4)`  
**Theme:** RKU-Inspired Academic Operations  

## 🎯 1. Problem Understanding & Scope
We chose the **Event & Hackathon Management Mini-Portal** problem statement. Academic environments require a tool that isn't just a hackathon tracker, but a **Dynamic Event Engine**. Whether it is a code-sprint (requiring teams and scoring) or a seminar (requiring individual RSVP), the system must adapt. 

### 🔄 Dynamic User Flow
![EventHub User Flow](./User%20Flow.png)

### The 4 Mission-Critical Flows:
1.  **Unique Team Registration Event:** Handling name-uniqueness and member limits via PostgreSQL level `UNIQUE` constraints.
2.  **Project Submission Event:** A secure gateway for teams to submit titles and GitHub URLs before the "T+24 Code Freeze."
3.  **Digital Judging Event:** A role-aware interface where Judges evaluate teams using a 50-point weighted rubric.
4.  **Live Leaderboard Event:** A real-time ranking engine that averages multi-judge scores and displays the Top 3 in RKU Gold.

---

## 🏗️ 2. Hybrid Architecture (Our Choice)
To balance speed and organization during a 24-hour sprint, we are using a **Hybrid Folder Structure**.



### Why Hybrid?
* **Backend (Layered MVC):** Logic is separated into `Routes -> Controllers -> Services -> Models`. Keeping Models centralized ensures the PostgreSQL schema remains the single source of truth.
* **Frontend (Feature-First):** UI is split into `/features/registration`, `/features/judging`, etc. This allows different developers to work on the "Registration Form" and "Leaderboard" simultaneously without merge conflicts.

### Folder Blueprint:
```text
src/
├── client/ (Feature-First)
│   ├── features/
│   │   ├── registration/  # Unique Team logic & Validation
│   │   ├── judging/       # Scoring Rubric & Judge Dashboard
│   │   └── leaderboard/   # Live Ranking & SQL averaging
│   └── shared/            # RKU Maroon/Gold UI components
└── server/ (Layered MVC)
    ├── routes/            # API Endpoints (Express)
    ├── controllers/       # Traffic management
    ├── services/          # "The Brains" (Scoring logic & averages)
    └── models/            # Postgres Schemas (Prisma/SQL)
```

---

## 📊 3. Data Model (PostgreSQL)
We chose **SQL** over NoSQL to ensure strict relational integrity for scoring and unique registrations.



* **Users Table:** Handles RBAC (Roles: `ADMIN`, `JUDGE`, `USER`).
* **Events Table:** The "Brain" containing toggles like `is_team_based` and `is_scored`.
* **Teams Table:** Enforces `UNIQUE` team names and links to a `captain_id`.
* **Scores Table:** Captures specific criteria (Innovation, Technical, UX) for multi-judge averaging.

---

## 🚀 4. Progressive Milestones
| Milestone | Focus Features |
| :--- | :--- |
| **T+4** | Home Screen, Event Overview, Basic Team Registration |
| **T+8** | Unique Name Validation, Team Member Logic, JWT Login |
| **T+16** | Submission Gateway, Judge Dashboard, Score Entry |
| **T+24** | Multi-Judge Averaging, Real-time Leaderboard, Winner Reveal |

---


## 🚧 5. Strategic Omissions
To ensure 100% stability within the 24h window:
* **No OAuth:** Using JWT with pre-seeded users to save integration time.
* **No WebSockets:** Using high-frequency polling (10s) for the leaderboard.
* **No File Uploads:** Teams submit GitHub URLs (validated via regex).
* **Email Notifications:** All status updates are handled via in-app "Toasts" and dashboard alerts.
---
