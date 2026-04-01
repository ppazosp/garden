---
title: Back to the CLI
tags:
  - tools
  - agents
  - cli
---

MCP is getting pushback and honestly, good. Garry Tan and Morgan Linton both posted about ditching it in favor of going back to plain CLI. The argument: we overengineered the interface between humans and AI tools.

Hard to disagree. MCP tried to be the universal protocol for tool calls, but the command line already was that. Pipes, stdout, exit codes. Works fine. Has been working for decades. You don't need a protocol spec and an SDK to call a tool when stdin and stdout exist.

Feels like we built a cathedral when a shed would do. Give me a binary that takes input and returns output. That's the whole protocol.

Source: [Morgan Linton on X](https://x.com/morganlinton/status/2031795683897077965) · [Garry Tan on X](https://x.com/garrytan/status/2031910564344262988)
