---
title: CLIs vs MCP servers
tags:
  - tools
  - cli
  - mcp
  - agents
---

## CLIs

- Binary on disk, no runtime needed
- Inherit shell auth (env vars, SSH keys, config files)
- Composable — pipe into each other natively
- Zero infrastructure for coding agents already in a terminal
- Context windows grew from 4K-8K to 200K-1M, so agents can now read entire man pages

## MCPs

- Structured tool discovery via JSON schemas
- Work in environments without a shell (Slack, web chat UIs)
- Auth is its own layer of complexity
- Servers need to be running, configured, and toggled
- Tool schemas eat context too — loading 30 definitions isn't free

## Conclusion

CLIs win for devs working in local coding agents. MCPs win for enterprise chat UIs with no shell. As context windows grew, MCP's token efficiency advantage weakened — the original reason for compact JSON schemas over verbose CLI output mostly disappeared.

Related: [[manual-steps-are-the-weakest-link]]
