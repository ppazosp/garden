---
title: Prompt Templates
tags:
  - llms
  - prompting
---

Prompt templates are reusable scaffolds that separate static instructions from dynamic inputs. They make prompts testable, versionable, and easier to improve systematically.

## Basic Variable Substitution

```python
TEMPLATE = """
You are a {role}.

Task: {task}

Constraints:
{constraints}
"""

prompt = TEMPLATE.format(
    role="senior software engineer",
    task="Review this diff and identify bugs",
    constraints="- Focus on logic errors, not style\n- Be concise"
)
```

## System + User Split

Keep persona and standing instructions in the system prompt. Put task-specific content in the user turn. This makes it easier to swap tasks without losing the agent's character.

## Chain-of-Thought Template

```
{task}

Think step by step before answering. Write your reasoning inside <thinking> tags, then give your final answer.
```

## Few-Shot Template

```
Here are examples of {task_type}:

Example 1:
Input: {example_1_input}
Output: {example_1_output}

Example 2:
Input: {example_2_input}
Output: {example_2_output}

Now complete:
Input: {input}
Output:
```

## Tips

- Version your templates alongside your code.
- Log (template, inputs, output) triples to build an eval dataset.
- Test template changes against a held-out set before deploying.
