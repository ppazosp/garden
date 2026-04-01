---
title: Back to the CLI
tags:
  - tools
  - agents
  - cli
  - mcp
---

Perplexity's cofounder and CTO is moving the company away from MCPs internally, back to APIs and CLIs. Morgan Linton flagged that one. Meanwhile Garry Tan went on a rant about MCP eating too much context window, bad auth, and having to toggle servers on and off. He got so fed up with Claude's MCP-based browser automation that he vibe coded a Playwright CLI wrapper in 30 minutes, 100 lines of code. Worked way better than the MCP version. Turns out Vercel had already built the same thing.

## Why now?

Part of it is context windows getting bigger. When models had 4K-8K tokens, you couldn't afford to dump `--help` output or parse verbose CLI responses. MCP's compact JSON tool schemas made sense — structured discovery in fewer tokens. Now with 200K-1M context, an agent can read a whole man page and still have room to think. MCP's token efficiency story got a lot weaker.

But it's not just context. MCP has problems that don't go away with bigger windows:

- MCP servers need to be running, configured, toggled. A CLI is a binary on disk.
- MCP auth is its own layer of pain. CLIs inherit whatever the shell already has — env vars, config files, SSH keys.
- MCP tool schemas eat context too. Loading 30 tool definitions isn't free. The context advantage over CLIs is smaller than it sounds.
- CLIs pipe into each other. MCP tools are isolated by design.

The real thing is simpler than all of this. Coding agents live in a terminal. They already have a shell. Calling a CLI is zero infrastructure. Why add a protocol layer on top of something that already works?

## Where each one fits

Nick Schrock (GraphQL cocreator) has the clearest take: this isn't one-size-fits-all.

```
                YOU ARE HERE
                     |
                     v
  CHAT UIs -------- ??? -------- TERMINAL
  (Slack, Web)                   (coding agents)
       |                              |
       v                              v
   MCP makes sense              CLI makes sense
   (no shell, need              (shell exists,
    tool discovery,              composable,
    structured I/O)              zero setup)
```

CLIs win for devs working in local coding agents. MCPs win for enterprise stuff plugged into Slack and web chat UIs where there's no shell to call. Different contexts, different tools.

And neither is probably where we end up in a few years anyway. We're arguing over plumbing while the whole house is still being designed.

Source: [Morgan Linton on X](https://x.com/morganlinton/status/2031795683897077965) · [Garry Tan on X](https://x.com/garrytan/status/2031910564344262988) · Nick Schrock on X
