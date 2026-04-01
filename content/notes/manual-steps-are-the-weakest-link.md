---
title: Manual steps are the weakest link
tags:
  - automation
  - agents
  - devops
---

## The Pattern

When you automate a workflow but leave a few manual steps, those manual steps become the single point of failure. The more you automate, the more the remaining human touchpoints concentrate risk.

## Example

Claude Code's source code leaked — not through an AI flaw or exploit, but because the deploy process had manual steps and someone skipped one.

## Fix

- More automation, not more process
- Automate the checks themselves
- Fewer spots where a person has to remember to do the thing
- Go faster, not slower — speed reduces the window for human error

## Takeaway

After all the discourse about AI replacing developers, the human was the bug. Whatever manual step you leave behind becomes your weakest link.

Related: [[clis-vs-mcp-servers]]
