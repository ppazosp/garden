---
title: Tool Use in AI Agents
tags:
  - agents
  - tools
---

Tool use is the mechanism that lets agents interact with the world beyond the model's weights. Without tools, an agent can only reason; with tools, it can search, compute, read files, call APIs, and more.

## How It Works

The model receives a list of tool definitions (name, description, input schema). When it decides to use one, it emits a structured tool call instead of plain text. The runtime executes the call and appends the result to the conversation, then the model continues.

## Principles for Good Tool Design

- **One responsibility per tool.** A `search_and_summarize` tool is harder to use correctly than separate `search` and `summarize` tools.
- **Return rich errors.** When a tool fails, return a message the model can act on: `"No results found for query: X — try broader terms."` rather than a stack trace.
- **Document the schema.** The description and parameter names are the interface. Treat them like public API docs.

## Tool Categories

| Category | Examples |
|---|---|
| Information retrieval | web search, RAG, SQL queries |
| Computation | code execution, calculators |
| Side effects | email, file writes, API calls |
| Agent control | spawn sub-agent, ask user |

## Related

- [[garden/agents/what-are-agents|What Are AI Agents?]]
- [[garden/tools/index|Tools & Frameworks]]
