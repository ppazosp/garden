---
title: ACTA
created: 2025-09-16
modified: 2025-09-16
published: 2025-09-16
tags:
  - project
  - voice-ai
  - osix
status: Internal production tool
role: AI engineer and full-stack builder
stack:
  - Whisper
  - Pyannote
  - LLM APIs
  - Python
  - TypeScript
---

## Summary

ACTA is an internal meeting platform built at [[about|OSIX Tech]].

It handles transcription, speaker diarization, summary generation, and automatic task assignment per team member. The goal is simple: meetings should produce useful operational output without relying on someone to manually clean up notes afterward.

## Problem

Meetings often contain decisions and tasks, but the follow-through gets lost because notes are inconsistent, ownership is unclear, or nobody wants to do the cleanup work after the call.

## Approach

ACTA uses voice AI to transcribe meetings and identify speakers, then uses LLMs to structure the result into summaries and task assignments.

## Outcome

ACTA turns meetings into a cleaner operational record: what happened, who said what, and what needs to happen next.
