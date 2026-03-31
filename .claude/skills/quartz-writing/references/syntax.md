# Quartz/Obsidian Markdown Syntax Reference

## Frontmatter

Delimited by `---` (YAML). Required fields depend on content type.

### Posts (content/posts/)

```yaml
---
title: Post Title
date: YYYY-MM-DD
description: One-line description for OG tags and RSS.
tags:
  - tag1
  - tag2
---
```

### Notes (content/notes/)

```yaml
---
title: Note Title
tags:
  - tag1
  - tag2
---
```

Notes don't require `date` or `description`. Keep frontmatter minimal.

### All Supported Fields

| Field | Type | Notes |
|---|---|---|
| `title` | string | Falls back to filename if absent |
| `tags` | string[] | YAML list or comma-separated |
| `date` | YYYY-MM-DD | Used as created AND published |
| `description` | string | Meta description, OG tags |
| `draft` | boolean | Excluded from build if true |
| `aliases` | string[] | Creates redirect pages |

## Wikilinks

Resolution: **shortest path** — use just the filename if unique.

| Syntax | Meaning |
|---|---|
| `[[note-name]]` | Link to note |
| `[[note-name\|display text]]` | Link with alias |
| `[[note-name#Heading]]` | Link to heading |
| `![[note-name]]` | Embed/transclude note |
| `![[image.png]]` | Embed image |

### Examples

```markdown
Related: [[what-are-agents]]
See also [[mcp|Model Context Protocol]]
As discussed in [[tool-use#Key Principles]]
```

## Callouts

```markdown
> [!TYPE] Optional Title
> Body content.
```

Supported types: `note`, `tip`, `info`, `warning`, `question`, `success`, `failure`, `danger`, `bug`, `example`, `quote`, `abstract`, `todo`.

Collapsible: `> [!tip]+` (expanded) or `> [!tip]-` (collapsed).

No icons are shown (disabled in this garden's theme).

## Tags

### Frontmatter

```yaml
tags:
  - agents
  - tools
```

### Inline

```markdown
This is about #agents and #tool-use.
```

Hierarchical: `#area/sub-area`. Auto-generates tag pages at `/tags/<name>`.

## Code Blocks

````markdown
```python
def example():
    pass
```
````

Themes: `github-light` / `github-dark`. Font: JetBrains Mono.

Mermaid diagrams:

````markdown
```mermaid
graph TD
  A --> B
```
````

## Other Syntax

| Feature | Syntax |
|---|---|
| Highlights | `==highlighted text==` |
| LaTeX inline | `$E = mc^2$` |
| LaTeX block | `$$\int_0^\infty ...$$` |
| Arrows | `->` → `→`, `<-` → `←` |
| Block refs | `^block-id` at end of paragraph |
| Comments | `%%hidden comment%%` |

## Content Structure

```
content/
├── index.md          # Home
├── about.md          # About
├── notes/            # Quick notes (flat, no subfolders)
│   ├── index.md
│   └── *.md
└── posts/            # Polished articles
    ├── index.md
    └── *.md
```

## File Naming

- Use kebab-case: `what-are-agents.md`, `prompt-engineering-tips.md`
- No spaces in filenames
- Keep names short but descriptive
