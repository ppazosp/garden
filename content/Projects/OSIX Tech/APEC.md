---
title: APEC
created: 2025-08-01
modified: 2026-02-07
published: 2025-08-01
tags:
  - project
  - ai-agents
  - osix
status: Internal production tool
role: CTO, AI engineer, product engineer
stack:
  - Python
  - Next.js
  - Supabase
  - Playwright
  - Anthropic API
  - Gmail API
---

## Summary

APEC is an internal multi-agent system at [[about|OSIX Tech]] that acts as an automated CMO.

It coordinates scraping agents for market research and financial data extraction, then feeds an end-to-end outbound sales pipeline with prospect targeting, personalized messaging, automated follow-ups, tracking, and anti-detection scheduling.

## Problem

Outbound sales has a lot of repeated judgment work: finding relevant prospects, researching them, extracting the right context, writing useful messages, and tracking the campaign without turning the whole thing into a spreadsheet swamp.

## Approach

APEC uses specialized agents for different parts of the workflow:

- Market research and prospect discovery.
- Financial data extraction.
- Campaign planning and message generation.
- Follow-up scheduling and tracking.

The system streams agent state and campaign updates into a dashboard so the operator can see what is happening while the pipeline runs.

## Outcome

APEC turned a scattered research and outreach process into a coordinated internal tool. It also became a practical testbed for the agent orchestration patterns we use in client systems.
