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
2. Understand the topic first:
   - If the brief is thin, ask clarifying questions one at a time about scope, angle and audience
   - If the user already gave a full brief and asked for a draft, skip the interrogation and draft it. Ask only what would change the work.
   - What is the main argument? What should the reader walk away believing?
3. Research it:
   - Search the web for recent, specific facts (dates, versions, numbers, product names). These are what make a post feel written by someone who was paying attention.
   - Check `content/posts/` for posts to link
   - Share findings and get the user's opinion before drafting
4. Draft:
   - Propose the structure first
   - Write the whole thing, then iterate. Section-by-section approval tends to stall.
   - Diagrams where they earn their place (see below)
5. Before saving:
   - Run the `humanizer` skill on the full post
   - Run the checks in "Before publishing" below
6. Save to `content/posts/<kebab-case-name>.md`
7. Preview: `npx quartz build --serve` from `/Users/ppazosp/projects/garden`, link them to `http://localhost:8080/posts/<kebab-case-name>`
8. Expect several rounds of revision, including structural ones. Reordering sections so the argument builds correctly is normal and worth doing.
9. Wait for approval, then commit: `feat[content]: add post on <topic>`. Garden-wide changes (styles, layout) go in a separate `feat[garden]:` commit.

## Prose style

This is the part most worth getting right.

**Write flowing prose, not stacked phrases.** The failure mode is a post made of short declarative sentences lined up one after another, each on its own line, like notes rather than writing. Sentences should carry their reasoning inside them, using subordinate clauses, so a paragraph reads as one continuous thought instead of a list that lost its bullets.

**No bold-lead label paragraphs.** `**The request.** Text here.` repeated down a section reads as a disguised list. Use real prose with a `##` heading, or an actual list if it is actually a list.

**Watch these tics**, all of which the humanizer will not fully catch:
- "It isn't X, it's Y" — powerful once or twice per post, cheap after that. Keep only the load-bearing ones.
- Punchy two-sentence pairs used as a drumbeat ("That's not a bigger context window. That's an operator.")
- Forced triads. Break them with a fourth item or cut to two.
- Em dashes and curly quotes: the garden uses neither. Commas and straight quotes.

**Argue from necessity where the subject is the future.** "The agent we need" lands harder than "the agent I want" when the claim is about where things are going. Keep the first person for judgement calls and opinions.

## Section titles

Every heading should be a claim or a pointed phrase, never a generic label. Read the headings top to bottom on their own: they should tell the story.

Never use `## Takeaway`, `## Conclusion`, `## Introduction` or `## Overview`. No post in this garden uses them.

Good, from posts already published:

```
Engineering was always the moat
The question
The perfect module that's wrong for you
How the agent left home
The work picks the hardware
Threads that should be machines
The part we never moved
The infrastructure of the future
```

If a section's closing line is sharper than its heading, promote the line. But do not spend a line in the heading that you want to land later in the body.

## Diagrams

Inline ASCII in a fenced code block, using Unicode box drawing (`┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼ ▶ ▼`). Never mermaid. Never SVG asset files: they hardcode a white background and turn into glaring white rectangles in dark mode, which is already true of the older diagrams in `content/images/`.

Wrap each one so it centres, blank lines required for the fence to parse:

````markdown
<div class="ascii-diagram">

```
   ┌─ machine A ────┐      ┌─ machine B ─────────┐
   │  ┌───────┐     │      │  ┌───────────────┐  │
   │  │ agent │     │─────▶│  │ shell + code  │  │
   │  └───────┘     │      │  └───────────────┘  │
   └────────────────┘      └─────────────────────┘
```

</div>
````

The `.ascii-diagram` rule lives in `quartz/styles/custom.scss`.

Rules that matter:
- Keep them under ~60 characters wide. They scroll sideways on mobile beyond that.
- Build them with a script rather than counting by hand, and verify every `┬ ┴ ┼ ▼` connects to something on the line above or below. Misaligned connectors are the standard failure.
- A diagram should show a mechanism the prose cannot say quickly. Do not illustrate a sentence.

## Frontmatter

```yaml
---
title: Post Title
date: YYYY-MM-DD
description: One compelling sentence for social media previews.
banner: /static/<name>.webp   # optional, see below
tags:
  - relevant-tag
draft: true                   # optional, see below
---
```

`draft: true` removes the page from the build **entirely**, so the local preview 404s. To preview a hidden post, flip it to `false`, and flip it back before committing if it is meant to stay hidden.

Banners: source art lives in `~/Documents/garden-banners/*.png` (1680x720). Convert with `magick <src>.png -quality 90 quartz/static/<name>.webp` and reference `/static/<name>.webp`. Without the field, `Banner.tsx` falls back to `/static/library.webp`. The component crops to 16:5 centred, so check nothing important sits at the top or bottom.

## Length

Aim for 1000 to 2000 words of prose, code blocks excluded. Flowing prose runs longer than a bullet-shaped draft of the same argument, and that is a fair trade. Past roughly 2000, cut a section rather than thinning every paragraph.

## Before publishing

- `humanizer` skill over the full text
- No em dashes, en dashes or curly quotes
- Every `[[wikilink]]` resolves to a file in `content/`
- ASCII diagrams aligned and under ~60 chars
- `npx quartz build` clean, and the page does not scroll sideways at 390px
- If pushing: check `git rev-list --left-right --count origin/main...main` first. This repo is often edited from elsewhere, so expect to rebase onto `origin/main` before pushing.

## Collaborative process

This is NOT a "generate and dump" command:
- Share research and get opinions before drafting
- Expect the user to correct the argument itself, not just the wording. When they do, rebuild the structure around the correction rather than patching a sentence.
- When a correction invalidates a diagram, redraw it. A diagram that quietly contradicts the prose is worse than no diagram.
