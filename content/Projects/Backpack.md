---
title: Backpack
created: 2026-04-08
modified: 2026-04-10
published: 2026-04-08
tags:
  - project
  - developer-tools
status: Plugin marketplace
role: Creator and maintainer
stack:
  - Claude Code plugins
  - GitHub
---

## Summary

Backpack is a Claude Code plugin marketplace.

It is a place to publish and install plugins from my ecosystem. The first listed plugin is [anvil](https://github.com/ppazosp/anvil), a spec-driven project management plugin for solo developers.

## Problem

Agent tooling gets messy when useful workflows are scattered across repos, local scripts, and one-off setup notes. A marketplace gives those tools a stable place to live and a consistent installation path.

## Approach

Backpack exposes a known marketplace source that can be added to Claude Code settings or used through plugin commands.

```json
{
  "extraKnownMarketplaces": {
    "backpack": {
      "source": { "source": "github", "repo": "ppazosp/backpack" }
    }
  }
}
```

## Outcome

Backpack is the distribution layer for my Claude Code plugins, starting with Anvil.
