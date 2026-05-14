---
title: IRIS
created: 2025-09-01
modified: 2026-01-12
published: 2025-09-01
tags:
  - project
  - ai-agents
  - osix
status: Shipped client system
role: CTO, forward deployed AI engineer, full-stack builder
stack:
  - FastAPI
  - React
  - Supabase
  - OpenAI API
  - Anthropic API
  - CRM integration
  - ERP integration
---

## Summary

IRIS is a multi-agent email management system shipped for a B2B client.

It classifies incoming emails by client, provider, intent, and priority, then generates context-aware responses using live business data from the client's CRM, product database, and ERP context.

## Problem

The client's bottleneck was not "too many emails" in the abstract. It was manual classification, missing context, repeated lookups, and slow response drafting across operational emails that depended on product and customer data.

## Approach

IRIS separates the workflow into two model responsibilities:

- A classification and tool-calling model that decides what the email is about and what information it needs.
- A response generation model that drafts a useful reply from retrieved client, product, invoice, stock, and payment context.

Near-instant ingestion happens through push notifications, and processing updates stream into a dashboard so operators can follow the system's decisions.

## Outcome

IRIS turned the inbox into a structured operational workflow and reduced the amount of manual context gathering needed before replying to customers and providers.
