---
title: Agrex
created: 2026-04-07
modified: 2026-07-12
published: 2026-04-07
description: A real-time graph visualizer for AI agent execution flows — React package, Python tracer, and a drop-in web viewer.
tags:
  - agents
  - open-source
  - tools
aliases:
  - Projects/Agrex
---

Agrex is a real-time graph visualizer for AI agent execution flows. You instrument your agent, and Agrex draws the run as a live graph: agents, tools, and files as nodes, edges showing who spawned what and what got read or written.

[agrex.ppazosp.dev](https://agrex.ppazosp.dev) · [GitHub](https://github.com/ppazosp/agrex)

## Why

Agent systems get hard to reason about fast. Once a run involves tools, files, subagents, and streaming output, logs still tell you what happened, but they hide the shape of the run: which agent called which tool, what fanned out in parallel, where things got stuck. Agrex makes that shape visible.

## How it works

Everything is built around a small trace format. A tracer records events as the agent runs. Each event carries fields like `parentId`, `reads`, and `writes`, and Agrex generates the graph edges from those automatically, so you never wire relationships by hand. Nodes update live as work moves from `running` to `done`.

There are three ways to use it:

- `@ppazosp/agrex`, a React component built on React Flow. Embed it in your own UI and feed it events in real time.
- `agrex` on PyPI, a Python tracer that mirrors the JS API. Same trace format, same viewer.
- The [web viewer](https://agrex.ppazosp.dev): drop a JSON or JSONL trace file and scrub through the run. No backend, no setup.

## Quick start

```bash
# JavaScript / React
npm install @ppazosp/agrex @xyflow/react

# Python
uv add agrex
```

Create a tracer, register your agents, wrap their work in spans, and export with `.toJSONL()`. The repo has integration examples for the Vercel AI SDK, the Anthropic SDK, the OpenAI SDK, and LangChain.

Layout engines and theming are pluggable. MIT licensed.
