---
title: LangChain
tags:
  - tools
  - frameworks
---

LangChain is a Python (and JS) framework for building LLM-powered applications. It provides abstractions for chains, agents, memory, and tool integration, letting you wire together common patterns without reimplementing them.

## What It's Good For

- Rapid prototyping of agent workflows
- Built-in integrations with 100+ tools and data sources (vector stores, APIs, document loaders)
- LangGraph for stateful, graph-based agent flows

## What to Watch Out For

LangChain's abstractions can get in the way once you understand what you're building. Many teams start with LangChain and later replace the layer they needed full control over. Start with it, but don't be afraid to drop down to raw API calls when the abstraction leaks.

## LangGraph

LangGraph is LangChain's more recent offering for agent loops. It models the agent as a directed graph of nodes (each node is a function or LLM call), which makes complex branching and cycles explicit and debuggable.

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("act", tool_node)
graph.add_edge("reason", "act")
graph.add_conditional_edges("act", should_continue)
```

## Related

- [[planning-patterns|Planning Patterns]]
- [[tool-use|Tool Use]]
