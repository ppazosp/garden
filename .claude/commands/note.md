---
name: note
description: Create a quick note from a link, post, or idea
arguments:
  - name: source
    description: URL, text, or topic for the note
    required: true
---

Create a quick note for the digital garden.

## Instructions

1. Use the `quartz-writing` skill for syntax and conventions
2. Read the source material (fetch URL if provided, or use the text/topic given)
3. Write a short, opinionated summary:
   - What's the key insight or takeaway?
   - Why does it matter?
   - Any personal opinion or connection to other ideas
4. Link to related existing notes — check `content/notes/` for what exists and use wikilinks
5. Add relevant tags
6. Run the `humanizer` skill on the content before saving
7. Save to `content/notes/<kebab-case-name>.md`
8. Start the dev server in the background: `npx quartz build --serve` from `/Users/ppazosp/projects/garden` — give the user the link `http://localhost:8080` so they can preview
9. Show the user the direct link to their note: `http://localhost:8080/notes/<kebab-case-name>`
10. Wait for user approval before continuing
11. Commit: `feat[content]: add note on <topic>`

## Note Format

Keep it short — 50 to 200 words of body. This is a quick take, not an essay.

```markdown
---
title: Note Title
tags:
  - relevant-tag
---

Brief summary of the source material and why it's interesting.

Key points or takeaways.

Personal opinion or connection to other ideas.

Source: [Original Title](url)

Related: [[existing-note]] [[another-note]]
```
