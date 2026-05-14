---
title: Agrex
created: 2026-04-07
modified: 2026-04-29
published: 2026-04-07
tags:
  - project
  - open-source
  - ai-agents
status: Published package
role: Creator and maintainer
stack:
  - React
  - React Flow
  - TypeScript
  - Python
  - Vite
  - uv
---

## Summary

Agrex is a real-time graph visualizer for AI agent execution flows.

It includes a React package, a Python companion package, and a web viewer at [agrex.ppazosp.dev](https://agrex.ppazosp.dev) where you can drop a JSON or JSONL trace and scrub through an agent run without setting up a backend.

## Problem

Agent systems become hard to reason about once they involve tools, files, subagents, reads, writes, and streaming execution. Logs tell you what happened, but they do not make the shape of the run obvious.

## Approach

Agrex models agent execution as a graph. Nodes represent agents, tools, files, and related runtime events. Edges are generated automatically from fields like `parentId`, `reads`, and `writes`, so users do not need to wire graph relationships manually.

The project includes:

- `@ppazosp/agrex`, a React component package built on React Flow.
- `agrex`, a Python package for instrumenting Python agents.
- A standalone viewer for inspecting trace files.
- Trace format documentation and framework integration examples.

## Outcome

Agrex gives agent builders a visual debugging surface for understanding what an agent did, which tools it touched, and how the execution unfolded over time.
