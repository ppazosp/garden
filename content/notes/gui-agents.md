---
title: GUI agents
tags:
  - agents
  - llms
  - automation
---

## What they are

Software agents that interact with computers the way humans do — looking at the screen, clicking buttons, typing text. Instead of calling APIs, they take screenshots, reason about what they see, and output mouse/keyboard actions.

The core loop is dead simple: perceive (screenshot) → reason (VLM figures out what to do) → act (click, type, scroll) → repeat until done.

## Approaches

There are a few ways to build these, and none of them are clearly winning yet:

- **Pure vision** — agent only sees pixels. No DOM, no accessibility tree. Works on any platform but struggles with tiny UI elements. [[glm-5v-turbo|GLM-5V-Turbo]], UI-TARS, and CogAgent all use this
- **Set-of-mark prompting** — overlay numbered bounding boxes on detected UI elements, then the model references elements by number instead of coordinates. Microsoft's OmniParser does this
- **DOM/HTML parsing** — extract the page structure and feed it as text. Precise but brittle, and obviously only works where a DOM exists
- **Hybrid** — combine vision with structure. Microsoft's UFO framework prefers API calls and falls back to GUI interaction when no API exists. This is probably where things are heading

## Notable systems

Proprietary:
- **Claude Computer Use** (Anthropic, Oct 2024) — screenshot-based, outputs coordinate actions. Now supports Opus 4.6
- **Operator** (OpenAI, Jan 2025) — GPT-4o + RL, later upgraded to o3. WebVoyager: 87%. Integrated into ChatGPT as "agent mode" in Jul 2025
- **Project Mariner** (Google, Dec 2024) — browser-focused. WebVoyager: 83.5%. Supports 10 concurrent tasks

Open source:
- **UI-TARS** (ByteDance) — end-to-end VLM, screenshot-only. Multiple versions since Jan 2025, steadily climbing benchmarks
- **CogAgent-9B** (Zhipu AI / Tsinghua) — foundation for GLM-PC, bilingual
- **OmniParser** (Microsoft) — not an agent itself, but a screen parsing tool that turns any LLM into one

## Benchmarks

- **OSWorld** — desktop tasks (Ubuntu/Win/Mac), 369 tasks. GPT-5 hit ~69.9% with best-of-N sampling. Human baseline: ~72.4%
- **AndroidWorld** — mobile, 116 tasks. Approaching saturation, top models above 90%
- **WebVoyager** — real website navigation. OpenAI's Operator leads at 87%
- **ScreenSpot-Pro** — professional desktop UIs with tiny icons and dense interfaces. The hardest grounding benchmark — initial best was only 18.9%

## Where they fall apart

- **Compound errors** — each step is ~90% accurate, but a 10-step task drops to ~35%. Long tasks are the killer
- **Irreversible actions** — unlike chatbots, these things submit forms and delete files. No undo
- **Speed** — screenshot capture + VLM inference + action execution per step. Much slower than an API call
- **Adversarial attacks** — agents that see full screens are vulnerable to prompt injection via on-screen text

## GUI agents vs API agents

Microsoft published a good comparison (March 2025): API agents are faster, more reliable per step, and easier to secure. GUI agents work everywhere — legacy systems, cross-app workflows, anything with a screen. The trend is convergence: prefer APIs when available, fall back to GUI when not.

## Takeaway

The gap between GUI agents and human performance is closing fast on benchmarks. AndroidWorld is basically solved. OSWorld went from impossible to GPT-5 nearing human-level in about a year. The real test is compound reliability — not whether the agent can do one thing, but whether it can do ten things in a row without breaking.

Related: [[glm-5v-turbo]] [[visual-code-generation]] [[clis-vs-mcp-servers]]
