---
title: Planning Patterns in AI Agents
tags:
  - agents
  - planning
---

Planning is how an agent decides what to do next. Different patterns trade off between flexibility and reliability.

## ReAct (Reason + Act)

The simplest effective pattern. Before each action, the model writes a short reasoning trace. This reduces impulsive tool calls and makes the agent's behavior more interpretable.

```
Thought: The user wants a summary of today's AI news. I should search first.
Action: search("AI news today")
Observation: [results]
Thought: I have enough context. I'll summarize.
```

Best for: single-agent tasks, short horizons.

## Plan-and-Execute

The agent first generates a full plan (list of steps), then executes each step, optionally revising the plan as new information arrives.

Best for: longer tasks where the full scope is known upfront, and where premature tool calls would waste tokens.

## Reflexion

After completing a task, the agent scores its own output and retries if below a threshold. Each attempt is conditioned on the previous attempt's critique.

Best for: tasks with a clear success criterion (code that passes tests, answers that match a rubric).

## Multi-Agent Orchestration

Complex tasks are split across specialized sub-agents. An orchestrator delegates, collects results, and synthesizes.

Best for: workflows with parallel workstreams or tasks requiring deep specialization.

## Related

- [[what-are-agents|What Are AI Agents?]]
- [[tool-use|Tool Use]]
