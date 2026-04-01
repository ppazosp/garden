---
title: Back to the CLI
tags:
  - tools
  - agents
  - cli
---

Perplexity's cofounder and CTO is moving the company away from MCPs internally, back to APIs and CLIs. Morgan Linton flagged that one. Meanwhile Garry Tan went on a rant about MCP eating too much context window, bad auth, and having to toggle servers on and off. He got so fed up with Claude's MCP-based browser automation that he vibe coded a Playwright CLI wrapper in 30 minutes, 100 lines of code. Worked way better than the MCP version. Turns out Vercel had already built the same thing.

The pattern here is obvious. MCP adds overhead that plain CLIs just don't have. A CLI is a binary with stdin and stdout. No protocol spec, no SDK, no auth dance, no context window tax. It just works, and it's been working for decades.

We built a cathedral when a shed would do.

Nick Schrock (GraphQL cocreator) has a cooler take though: CLIs win for devs working in local coding agents, MCPs win for enterprise stuff integrating with Slack and web chat UIs. Different tools for different contexts. And neither is probably where we end up in a few years anyway.

That last part is what sticks with me. We're arguing over plumbing while the whole house is still being designed.

Source: [Morgan Linton on X](https://x.com/morganlinton/status/2031795683897077965) · [Garry Tan on X](https://x.com/garrytan/status/2031910564344262988) · Nick Schrock on X
