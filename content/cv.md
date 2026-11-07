---
title: CV
date: 2026-11-07
description: Pablo Pazos Parada, engineer at Omnia. Builds AI agents and the systems that keep them reliable.
banner: none
aliases:
  - resume
---

**Pablo Pazos Parada** · O Grove, Spain · [LinkedIn](https://www.linkedin.com/in/pablo-pazos-parada) · [GitHub](https://github.com/ppazosp) · [pablopazosp3@gmail.com](mailto:pablopazosp3@gmail.com)

I build AI agents and the systems that keep them up: sandboxes, durable state, recovery, provisioning. I co-founded an AI startup, then built Omnia's agent from an empty repo to production. Most of my code is now written with coding agents, so a lot of my work goes into checking it: formal models before the code, and tests that run against the real system.

## Experience

### Engineer, OCTO · [Omnia](https://useomnia.com)

*June 2026 – present · Santiago de Compostela, Spain*

I built Omnio (Omnia Agent) from scratch, end to end. It's Omnia's AI marketing agent: every user gets their own agent in its own sandbox, with persistent memory of their brand. I've written over 900 commits across the Omnia app and our fork of the Hermes agent harness.

- Designed the Turn system: a Responses-style streaming protocol with a resumable event log, durable recovery and cold-load resume. On top of it I built steering a running turn, a Stop that ends the reply and everything it started, background subagents, blocking questions and write approvals, a skills system, and parallel MCP tool calls with bounded failures.
- Each user gets a sandbox pair on Fly Sprites, provisioned from immutable release capsules out of prewarmed pools. Reprovisioning swaps them with no downtime. Brand files live in a git-backed durable filesystem with an R2 file store. Messages wait in a server-side queue that decides when a sandbox has room. Browser automation runs in an isolated Toolbox with a live view. Nearly 20 third-party connectors (HubSpot, Slack, Google Drive, Shopify, Notion and more) go through Composio.
- Cut gateway boot from 14s to 2.9s and provisioning time by 37%. Built fleet health and provisioning dashboards in the backoffice, SLO alerting in Axiom, and self-service recovery for broken sandboxes.
- Wrote ~50 TLA+ models of the agent's state machines (conversation queue, Stop, steering, recovery, reprovisioning, releases), checked with TLC. Each property is shown failing against a broken variant of the code it guards. Built a conformance suite of real-user scenarios that runs on disposable Fly Machines, nightly and per PR, with a live dashboard and Slack reports.
- I write code with coding agents, and our workflow agrees the invariants first, proves them in the model, then implements and verifies against the running system, with cross-model review (Claude and Codex) before merge.

### CTO & Co-Founder · OSIX Tech

*June 2025 – June 2026 · Santiago de Compostela, Spain*

- Built a 7-person AI startup from zero, as technical lead and main decision-maker on architecture, business logic and product.
- Architected Nessie, a B2B AI agent platform with hybrid-search RAG, specialised agents and multi-source document ingestion. Ran enterprise pilots in professional services. Designed Nessie Industrial for Pescanova: knowledge retrieval plus automated label verification on the factory floor.
- Built APEC, a multi-agent "automated CMO": scraping agents for market research (NORA) and financial data (SARA) feeding an end-to-end cold email pipeline.
- Shipped IRIS for a B2B client: multi-agent email triage by client, intent and priority, with replies grounded in their product database and CRM.
- Built ACTA, an internal meeting platform with transcription, speaker diarisation, summaries and per-person task assignment.

### Freelance Software Developer · Residential Complex Z4, A Toxa

*Summers 2023 and 2024 · O Grove, Spain*

- Spotted a need while working there as a security guard, then designed and shipped a padel court booking system used by 150+ residents.

## Projects

- [[agrex|Agrex]]: an open-source, real-time graph viewer for AI agent runs (React package, Python tracer and web viewer).
- This garden: notes on agents, retrieval and infrastructure. I run it on a forked and optimised Quartz 5.

## Education

**B.Sc. Computer Engineering** · Universidade de Santiago de Compostela · 2022 – 2026

## Skills

- **Languages:** TypeScript, Python, SQL, TLA+
- **Agents:** agent harnesses, MCP, multi-agent systems, RAG, prompt and context engineering, LLM APIs (Anthropic, OpenAI, Google, DeepSeek, OpenRouter)
- **Systems:** Next.js, Node.js, PostgreSQL and Supabase, Fly.io, Cloudflare R2, Docker, Trigger.dev, Axiom, PostHog
- **Reliability:** formal verification (TLA+/TLC), conformance and end-to-end testing, observability, SLOs
