---
title: Nessie
created: 2025-07-01
modified: 2026-05-04
published: 2025-07-01
tags:
  - project
  - rag
  - osix
status: Enterprise pilots
role: Technical lead and AI engineer
stack:
  - React
  - Vite
  - TypeScript
  - FastAPI
  - uv
  - Supabase
  - PostgreSQL
  - pgvector
  - Realtime
  - OAuth 2.0
  - Google Drive API
  - LLM APIs
---

## Summary

Nessie is an AI-powered document intelligence platform at [[about|OSIX Tech]].

It combines agentic RAG, semantic/keyword/hybrid search, document ingestion, secure access, and citation-backed answers. A manufacturing variant, Nessie Industrial, combines knowledge retrieval with automated label verification for factory workflows.

## Problem

Companies already have a lot of the knowledge they need, but it is spread across documents, drives, PDFs, and internal systems. Existing tools tend to be slow, disconnected from daily workflows, or too shallow to support high-trust answers.

## Approach

I designed and led the core architecture: retrieval, agent orchestration, document ingestion, secure access, and product workflow. Nessie is built around contextual answers, citations, and automated document workflows.

For Nessie Industrial, the work started with discovery sessions with plant operations teams, then adapted the platform to manufacturing realities: documents, labels, checks, exceptions, and processes that need to be reliable under pressure.

## Outcome

- Enterprise pilots across professional services and industrial contexts.
- Three companies interested in pilots.
- Under 5 second average query time in the current build.
- Architecture designed for millions of indexed documents.
