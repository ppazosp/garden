---
title: Visual code generation
tags:
  - llms
  - tools
  - automation
---

## What it is

Give an AI model a screenshot or a Figma mockup, and it writes frontend code from it. The hard part isn't the coding — it's the seeing. The model has to parse layout, color, typography, and component hierarchy from raw pixels before it can produce anything.

A text-only code LLM scores near zero on these tasks. Not because it can't code, but because it can't see.

## Models doing this

Frontier multimodal models all support it to some degree:
- **GPT-4o / GPT-5** — GPT-5 holds the top ArtifactsBench score at 72.55. Interestingly, chain-of-thought prompting actually hurts — 70% of CoT outputs produce CSS-less HTML
- **Claude** — Opus 4.1 scores 59.76 on ArtifactsBench. Recommended model for the screenshot-to-code open source tool
- **Qwen3-VL 235B** — currently leads the Design2Code leaderboard at 0.934
- [[glm-5v-turbo|GLM-5V-Turbo]] — Zhipu's dedicated vision coding model with custom CogViT encoder and 30+ task joint [[reinforcement-learning-for-llms|RL]]

Specialized approaches:
- **Design2Code-18B** (Stanford, 2024) — open source, matched Gemini Pro Vision performance
- **VisCodex** (2025) — merges a VLM backbone with a code LLM using task vectors, keeping both visual and coding skills without joint training

## Tools

- **[screenshot-to-code](https://github.com/abi/screenshot-to-code)** — open source, 53k+ GitHub stars. Supports HTML+Tailwind, React, Vue. Also handles video/screen recording to prototype
- **Vercel v0** — text-to-UI and image-to-UI. Outputs React + Next.js + Tailwind + shadcn/ui. Feb 2026 update added Git integration and database connectivity
- **Replit** — screenshot-to-app feature, cloud IDE with instant deployment
- **Bolt.new** — token-metered browser IDE, reads Figma mockups
- **Lovable** — chat to live web app, focused on MVPs

## Benchmarks

- **Design2Code** (Stanford, 484 real webpages) — the main one. Original finding: GPT-4V generated pages could replace originals in 49% of cases
- **ArtifactsBench** (Tencent, 1825 queries) — tests dynamic/interactive artifacts, not just static HTML. 94.4% ranking consistency with human preferences
- **WebSight** (HuggingFace) — not really a benchmark, more a training dataset. 2M synthetic HTML+screenshot pairs

## What works, what doesn't

Works well:
- Simple to medium single-page UIs
- Tailwind CSS output — utility-first CSS maps naturally to AI generation
- Rapid prototyping — tools like v0 and Replit turn screenshots into working apps in minutes

Doesn't work:
- Complex layouts, especially with open source models
- Dynamic behavior and state transitions — even GPT-5 only hits 72.55/100 on ArtifactsBench
- Pixel-perfect accuracy — AI-generated code typically needs 20-40% more CSS than necessary, with excessive wrapper divs and hardcoded pixel values
- Responsive design — layout reflow during resizing remains rough

## Figma connection

Figma is leaning hard into this:
- **Figma Make** generates interactive React apps from design frames
- **Figma MCP Server** feeds design tokens and component properties to coding assistants like [[claude-code|Claude Code]] and Cursor as a live reference
- Third party plugins like Builder.io and Anima do one-click Figma-to-code, but output quality depends heavily on how well the Figma file is organized

## Takeaway

The "screenshot to working code" pipeline works for prototyping. For production code, treat the output as a rough draft. The gap between "this looks right" and "this works correctly at every breakpoint" is still significant. CoT hurting performance is a weird finding worth watching — suggests these models work better when they just look and code rather than overthinking it.

Related: [[gui-agents]] [[glm-5v-turbo]]
