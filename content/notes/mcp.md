---
title: Model Context Protocol (MCP)
tags:
  - tools
  - protocols
---

Model Context Protocol (MCP) is an open standard from Anthropic that defines how AI models connect to external tools and data sources. Think of it as USB-C for AI integrations: one protocol, many compatible devices.

## Why It Matters

Before MCP, every agent framework invented its own tool interface. This meant tool implementations couldn't be shared across systems. MCP standardizes the contract so that a tool server written once works with any MCP-compatible client.

## How It Works

An MCP server exposes three primitives:

- **Tools** — functions the model can call (e.g., `run_query`, `read_file`)
- **Resources** — data the model can read (e.g., a database schema, a file tree)
- **Prompts** — reusable prompt templates the server provides

The client (your agent runtime) discovers available tools at startup and passes them to the model like any other tool definition.

## Practical Use

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
    }
  }
}
```

Many popular MCP servers are already available: filesystem, web search, GitHub, databases, and more.

## Related

- [[tool-use|Tool Use in AI Agents]]
