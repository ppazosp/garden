---
name: note
description: Create a fact-based note for the knowledge graph
arguments:
  - name: source
    description: URL, text, or topic for the note
    required: true
---

Create a fact-based note for the digital garden's knowledge graph.

## Instructions

1. Use the `quartz-writing` skill for syntax and conventions
2. Read the source material (fetch URL if provided, or use the text/topic given)
3. Extract the core facts and structure them:
   - Break the topic into clear sections with bullet points
   - Straight to the points — no fluff, no narrative
   - End with a conclusion or takeaway
4. Add wikilinks to related topics — both existing notes in `content/notes/` and new topics that don't exist yet (red links are fine, they show gaps in the graph)
5. If the note is about a tool or resource, link to it directly in the content — but no "Sources" section
6. Add relevant tags
7. Run the `humanizer` skill on the content before saving
8. Save to `content/notes/<kebab-case-name>.md`
9. Start the dev server in the background: `npx quartz build --serve` from `/Users/ppazosp/projects/garden` — give the user the link `http://localhost:8080` so they can preview
10. Show the user the direct link to their note: `http://localhost:8080/notes/<kebab-case-name>`
11. Wait for user approval before continuing
12. Commit: `feat[content]: add note on <topic>`

## Note Format

Structured facts, not essays. Use sections and bullet points. Link heavily to build the graph.

```markdown
---
title: Topic Title
tags:
  - relevant-tag
---

## Section

- Fact or point
- Another point
- Links to [[related-topic]] where relevant

## Another Section

- More points

## Conclusion

Summary takeaway or judgment call.

Related: [[existing-note]] [[future-note]]
```
