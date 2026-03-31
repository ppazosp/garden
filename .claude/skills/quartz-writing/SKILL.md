---
name: quartz-writing
description: This skill should be used when writing content for the Quartz digital garden — creating notes, posts, or any markdown file in content/. Provides syntax reference (wikilinks, callouts, frontmatter, tags) and content conventions for garden.ppazosp.dev.
---

# Quartz Writing

Write content for the Quartz digital garden at `garden.ppazosp.dev`. The garden repo lives at `/Users/ppazosp/projects/garden`.

## Content Types

### Notes (`content/notes/`)

Quick takes — summaries of posts from X/LinkedIn, ideas, concepts. Informal, short, useful.

Frontmatter: `title` and `tags` required. No `date` or `description` needed.

### Posts (`content/posts/`)

Polished articles meant to be shared on LinkedIn/X. Longer, structured, with clear takeaways.

Frontmatter: `title`, `date`, `description`, and `tags` all required. The `description` is used for Open Graph previews on social media.

## Writing Process

1. Read `references/syntax.md` for the full Quartz markdown syntax reference (wikilinks, callouts, frontmatter, tags, code blocks, etc.)
2. Write content following the conventions below
3. Always use the `humanizer` skill on the final text before saving — this removes AI writing patterns
4. Link to related existing notes using wikilinks (`[[note-name]]`)
5. Use tags for topic categorization
6. Build with `npx quartz build` to verify
7. Commit with pattern: `feat[content]: <message>`

## Conventions

- **Tone**: Informal, direct, useful. No fluff. Write like explaining to a friend.
- **Language**: English
- **Wikilinks**: Use shortest path (`[[mcp]]` not `[[notes/mcp]]`) when filename is unique. Add display text when the filename isn't clear: `[[mcp|Model Context Protocol]]`.
- **Tags**: Use lowercase kebab-case. Common tags: `agents`, `llms`, `tools`, `prompting`, `automation`, `startups`, `open-source`.
- **Callouts**: Use sparingly. No icons are shown. Keep them for genuinely important tips or warnings.
- **Code blocks**: Include when showing examples, commands, or config. Use appropriate language identifier.
- **Diagrams**: NEVER use mermaid. Always use ASCII art diagrams inside code blocks. They're simpler, more readable, and fit the garden's minimal style.
- **File naming**: kebab-case, no spaces. Example: `react-agent-patterns.md`.

## Before Saving

1. Run the `humanizer` skill on all written content
2. Verify wikilinks point to existing notes (check `content/notes/` and `content/posts/`)
3. Ensure frontmatter is correct for the content type
4. Build: `npx quartz build` from `/Users/ppazosp/projects/garden`

## Reference Files

- **`references/syntax.md`** — Full Quartz/Obsidian markdown syntax reference (frontmatter fields, wikilinks, callouts, tags, code blocks, content structure)
