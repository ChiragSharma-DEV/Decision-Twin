# 🎨 DecisionTwin: Visual Identity & UI/UX Style Guide

**Prepared by:** Creative Director & Lead UI/UX
**Vibe:** High-End Enterprise SaaS | Dark Mode | Professional | Trustworthy & Forensic

---

## 🎨 1. Color Palette
*The palette must evoke the precision of a cybersecurity forensic tool and the premium feel of a modern fintech platform. A deep dark mode reduces eye strain during heavy data analysis.*

### Foundational Colors (Dark Mode)
*   **Background (Deep Space):** `#09090B` (Zinc-950) — A near-black, ultra-matte background to make colors pop.
*   **Surface / Panels:** `#18181B` (Zinc-900) — Used for cards, modals, and elevating elements.
*   **Border / Dividers:** `#27272A` (Zinc-800) — Subtle, barely-there separation lines.

### Brand & Interactive Colors
*   **Primary (Forensic Blue):** `#3B82F6` (Blue-500) to `#2563EB` (Blue-600) — Used for primary actions, active states, and "true/neutral" data lines.
*   **Secondary (SaaS Silver):** `#A1A1AA` (Zinc-400) — Used for secondary text, disabled states, and metadata.

### Semantic Colors (The "Ethics" Palette)
*   **Metric: Equitable / Fair (Trust Emerald):** `#10B981` (Emerald-500) — Indicates fairness, parity achieved, or positive social impact.
*   **Metric: Warning / Disparity (Alert Amber):** `#F59E0B` (Amber-500) — Triggers when algorithms approach legal compliance limits (e.g., 80% rule boundary).
*   **Metric: Severe Bias / Systemic Failure (Critical Crimson):** `#E11D48` (Rose-600) — Sharp, aggressive red used when a group is actively being penalized or locked out by the algorithm.

---

## 🔤 2. Typography
*Legibility is paramount. We need a typeface that looks razor-sharp in dark mode and supports 'tabular numbers' so fast-changing simulation data doesn't jitter.*

*   **Primary Font (Headings & UI):** **`Inter`** or **`Plus Jakarta Sans`**
    *   *Why:* Premium, strictly geometric, and feels inherently like modern SaaS.
    *   *Usage:* Bold (700) for Section Headers, Medium (500) for Buttons.
*   **Secondary Font (Data & Tables):** **`JetBrains Mono`** or **`Geist Mono`**
    *   *Why:* Monospaced numbers ensure that when the "Time-Travel Slider" is moving, the metrics tick predictably without horizontally shifting the table columns.
    *   *Usage:* Numbers inside cards, data table cells, axis labels on charts.

---

## 🧱 3. Component Library (Shadcn/UI + Tailwind CSS)
*We leverage Shadcn for accessibility and Tailwind for rapid styling, modified heavily for our "glass-and-glow" aesthetic.*

*   **Cards (The Sandbox Modules):**
    *   *Look:* Matte dark `bg-zinc-900/80` with a backdrop blur `backdrop-blur-md` (subtle glassmorphism).
    *   *Border:* `border border-zinc-800/50`. Upon hovering over interactive metrics, the border shifts softly to `border-blue-500/30`.
*   **Buttons:**
    *   *Primary:* Solid Forensic Blue, no borders, with a subtle glowing box-shadow `shadow-[0_0_15px_rgba(59,130,246,0.3)]`.
    *   *Secondary:* Transparent background, `border-zinc-700`, `text-zinc-300`, turning solid `bg-zinc-800` on hover.
*   **The Simulation Slider (Custom):**
    *   *Look:* Instead of a standard gray track, the track's completed portion is a gradient from Blue to whatever Semantic color is currently true.
    *   *Thumb (Handle):* A prominent, pill-shaped white thumb containing the current "Year" (e.g., "Year 5"). As it drags, the thumb emits a soft pulse to signify active computation.
*   **Radar Charts (Multi-dimensional Bias):**
    *   *Look:* Used to show "Feature Fairness". The polygon fills are `fill-opacity-10`. The strokes are crisp 2px neon lines.
    *   *Vibe:* Looks like a targeting reticle. Overlapping polygons (e.g., Male vs. Female model accuracy) beautifully highlight disparities.

---

## 📈 4. Visual Storytelling in Data
*How we visualize the brutal reality of compounding bias over 10 years without overwhelming the user.*

*   **The Widening Gap (Diverging Area Charts):**
    *   To visualize the "Social Wealth Gap" over 10 years, we use an **Area Chart** divided by a baseline (Zero).
    *   Instead of standard lines, we use filled areas. As the years progress, if Group A gains wealth, the area expands upwards in a soft Emerald gradient. If Group B is denied loans, their area expands downwards in a Crimson gradient.
    *   *Visual Impact:* The user physically sees the chart "split open" like a chasm as compounding bias takes effect over time.
*   **Bar Charts (Rejection Rates):**
    *   We use horizontal, stacked bar charts. For rejected demographics, we apply a striped SVG pattern over the red to visually signify "locked out / restricted."

---

## ✨ 5. Micro-interactions & Motion
*Motion conveys that the DecisionTwin is a live, thinking engine, not a static spreadsheet.*

*   **Value Ticking (Slot Machine Effect):**
    *   When the Time-Travel slider moves, the percentage metrics (e.g., "Approval Rate: 42%") don't just instantly snap to the new number. They use `framer-motion` to smoothly tick up/down through the intermediate numbers, keeping the user anchored in the transition.
*   **The "What-If" Morph:**
    *   In the Policy Lab, when a user changes a policy threshold (e.g., lowering risk tolerance), the Area Charts use **morphing SVG paths** to smoothly bend from the "Old Future" into the "New Future."
*   **Warning Pulses:**
    *   If a specific year creates a severe bias event, a subtle `animate-ping` (a soft wave expanding outward) originates from that point on the chart's timeline to draw the user's eye instantly to the point of failure.
*   **Hover States (Tooltips):**
    *   Data tooltips appear with a crisp 100ms fade-in and a slightly delayed entry (stagger) to feel extremely snappy and responsive.
