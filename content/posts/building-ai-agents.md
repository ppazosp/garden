---
title: Building AI Agents
date: 2026-03-31
description: A practical guide to architecting AI agents — from the basic loop to multi-step planners with tool use.
tags:
  - agents
  - architecture
---

AI agents are programs where an LLM drives the control flow. Instead of a single prompt → response, the model decides what to do next, calls tools, observes results, and keeps going until the goal is met.

## The Core Loop

Every agent, no matter how complex, boils down to the same cycle: **think → act → observe → repeat**.

```python
def run_agent(goal: str, tools: list[Tool]) -> str:
    messages = [{"role": "user", "content": goal}]

    while True:
        response = llm.chat(messages, tools=tools)

        if response.stop_reason == "end_turn":
            return response.text

        # Execute requested tool calls
        for call in response.tool_calls:
            result = call.tool.run(**call.arguments)
            messages.append({"role": "tool", "content": result, "tool_call_id": call.id})

        messages.append(response.message)
```

## Key Design Decisions

**Tool design matters more than model choice.** Agents are only as capable as the tools you give them. Keep tools narrow, composable, and well-documented — the docstring is the interface the model sees.

**Control loop termination.** Always set a max-iteration limit. Models can get stuck in loops, especially when tool results are ambiguous.

**Memory management.** Long conversations hit context limits. Use a sliding window, summarize older turns, or store them in a retrieval layer.

> [!tip] Start with ReAct
> Before building a custom loop, try a ReAct-style prompt. It forces the model to reason before each action, which significantly reduces tool misuse.

## Architecture Patterns

See [[garden/agents/planning-patterns|Planning Patterns]] for a breakdown of ReAct, Plan-and-Execute, and reflection loops.

For a deep dive on tools, see [[garden/agents/tool-use|Tool Use]].

## What to Build First

Start with the simplest agent that could solve your problem. A two-tool agent (web search + code execution) can handle a surprising range of tasks. Add complexity only when the simpler version provably fails.
