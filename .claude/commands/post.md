---
name: post
description: Write a polished post collaboratively through questions and research
arguments:
  - name: topic
    description: Topic or idea for the post
    required: true
---

Write a polished post for the digital garden, meant to be shared on LinkedIn/X.

## Instructions

1. Use the `quartz-writing` skill for syntax and conventions
2. Start by understanding the topic:
   - Ask clarifying questions one at a time about scope, angle, audience
   - What's the main argument or takeaway?
   - What should readers walk away with?
3. Research the topic:
   - Search the web for recent, relevant information
   - Check existing notes in `content/notes/` for related content to reference
   - Share findings and ask for the user's opinion
4. Draft the post collaboratively:
   - Propose an outline first, get approval
   - Write section by section, asking for feedback
   - Include code examples, callouts, or diagrams where they add value
   - Link to existing notes and external sources
5. Before saving:
   - Run the `humanizer` skill on the full post
   - Verify all wikilinks resolve
   - Ensure frontmatter has title, date, description, and tags
6. Save to `content/posts/<kebab-case-name>.md`
7. Build: `npx quartz build` from `/Users/ppazosp/projects/garden`
8. Commit: `feat[content]: add post on <topic>`

## Post Format

Posts should be 500-1500 words. Structured with clear headers, practical examples, and a strong opinion.

```markdown
---
title: Post Title
date: YYYY-MM-DD
description: One compelling sentence for social media previews.
tags:
  - relevant-tag
---

Opening hook — why should anyone care about this?

## Section 1

Content with examples, code, or data.

## Section 2

More depth, practical advice, or analysis.

## Takeaway

What's the one thing to remember? Strong closing.

Related: [[existing-note]] [[another-note]]
```

## Collaborative Process

This is NOT a "generate and dump" command. The post is built through conversation:
- Ask questions before writing
- Share research and get opinions
- Propose structure, iterate on feedback
- Write incrementally, section by section
