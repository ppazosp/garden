---
title: Prompt Engineering Tips for Agent Systems
date: 2026-03-28
description: Practical techniques for writing prompts that make LLMs more reliable inside agent loops.
tags:
  - prompting
  - llms
---

Prompting a model inside an agent is different from prompting it for a one-shot task. The model needs to stay on track across many turns, use tools correctly, and know when it's done.

## Be Explicit About the Task Format

Vague instructions produce vague behavior. Tell the model exactly what a correct answer looks like.

```python
SYSTEM_PROMPT = """
You are a research assistant. When given a question:
1. Search for relevant sources using the `search` tool.
2. Synthesize findings into a concise answer (3-5 sentences).
3. Cite your sources with URLs.

Do not answer from memory alone — always search first.
"""
```

## Use Structured Output for Tool Arguments

Instead of asking the model to format tool calls in prose, define a schema and enforce it. This cuts parsing errors significantly.

```python
class SearchQuery(BaseModel):
    query: str
    max_results: int = 5
    date_range: str | None = None
```

## Few-Shot Examples for Complex Tools

When a tool has non-obvious usage, include one or two examples in the system prompt. Show a correct call and the expected result shape.

## Separate Reasoning from Action

Ask the model to write its reasoning as a scratchpad before it commits to a tool call. This is the core insight behind ReAct and most modern agent prompts.

```
Think: I need to find the current price. I should search for it rather than guess.
Act: search(query="AAPL stock price today")
```

## Related Notes

See [[prompt-templates|Prompt Templates]] for reusable template patterns you can drop into your projects.
