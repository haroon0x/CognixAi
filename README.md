CognixAi

### 🧠 Cognix Agent Overview

---

#### 🛠️ IngestAgent
- Pulls & normalizes data from calendar, notes, email, to‑dos.
- Also handles write‑back/integration (creates calendar events or tasks when PlannerAgent approves).

---

#### 📄 SummaryAgent
- Collates metrics:
  - Count of meetings
  - Word count of notes
  - Tasks completed
  - File edits

---

#### 🔍 InsightAgent
- Finds correlations/anomalies:
  - “Notion usage spikes before deliverables”
  - “Long admin days → fewer tasks done”

---

#### 📅 PlannerAgent
- Generates prioritized action items:
  - “Block 2h for deep work tomorrow”
  - “Reduce meetings on Friday”

---

#### 🧬 PersonalizationAgent
- Tunes thresholds and suggestion style based on past feedback and user preferences.

---

#### 🔔 NotificationAgent
- Pushes alerts or daily digest via email/Slack/UI when key insights or plans are ready.

---

#### 👍 FeedbackAgent
- Captures thumbs‑up/down on PlannerAgent suggestions.
- Feeds results back into PersonalizationAgent for adaptive planning.

---

#### 📊 VisualizationAgent
- Renders charts from Summary/Insight outputs:
  - Time allocation bars
  - Trend lines (tasks done over time)
  - Correlation plots
  - Plan vs. execution gauges

User uploads their “calendar.ics,” “notes.csv,” and “tasks.json.”

IngestAgent normalizes into unified JSON.

SummaryAgent produces metrics (e.g., 12 meetings, 8 tasks done).

InsightAgent highlights “50% of meetings are after 4 PM → low deep‑work productivity.”

VisualizationAgent builds:

A bar chart of “meetings by hour”

A line chart of “tasks completed per day”

PlannerAgent suggests: “Shift meetings to morning blocks.”

NotificationAgent emails the digest + embedded charts.

User clicks “👍” on the suggestion.

FeedbackAgent logs that preference for future tailoring.

