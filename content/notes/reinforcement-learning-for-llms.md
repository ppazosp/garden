---
title: Reinforcement learning for LLMs
tags:
  - llms
  - agents
---

## The evolution

Four major phases, each one simplifying the previous:

- **RLHF + PPO** (2022) — OpenAI's InstructGPT showed a 1.3B model trained with RLHF could beat the unaligned 175B GPT-3 in human evals. Required 4 models in memory: policy, reward model, critic, reference. Expensive and finicky
- **DPO** (2023) — Stanford's insight: the policy itself can act as the reward model. Eliminates the reward model and critic entirely. Trains directly on preference pairs. Simpler, more stable, became the default for open source fine-tuning
- **GRPO** (2024) — DeepSeek's contribution. Eliminates the critic by sampling K outputs per prompt and computing advantages relative to the group mean. Cuts memory from 4 models to 2. Roughly halves GPU requirements
- **RLVR** (2025+) — reinforcement learning with verifiable rewards. The reward comes from deterministic checks (math correctness, code tests) instead of learned reward models. Non-gameable, scales without human annotation. The catch: only works where answers are automatically checkable

## Key concepts

- **Reward models** — neural networks trained on human preference data. Proxy for human judgment. Susceptible to reward hacking — models learn to game the reward model rather than actually improve
- **Process reward models (PRM)** — score each intermediate reasoning step, not just the final answer. Dense signal that pinpoints where errors happen. OpenAI's PRM800K dataset has 800K step-level labels. Improved performance +7% and sample efficiency 6x when combined with outcome rewards. Downside: annotation is expensive and automated PRM annotation is unreliable
- **Outcome reward models (ORM)** — score only the final output. Sparse signal but more generalizable
- **Constitutional AI** (Anthropic, 2022) — the model self-critiques against written principles, revises its outputs, then gets trained on AI-generated preferences (RLAIF) instead of human labels. The Jan 2026 constitution is an 80-page document

## What DeepSeek did

DeepSeek-R1-Zero was trained with pure RL using GRPO — no supervised fine-tuning at all. Only rule-based rewards: did you get the right answer, did you format it correctly. No neural reward model.

Results on AIME 2024: pass@1 went from 15.6% to 71.0%. With majority voting: 86.7%, matching OpenAI's o1.

The interesting part is what emerged during training. The model started self-reflecting, trying alternative approaches, and allocating more thinking time on harder problems — all without being told to. There's a documented instance where an intermediate checkpoint literally output "That's an aha moment." The word "wait" went from virtually absent to frequent after step 8K of training.

R1-Zero had readability issues (language mixing, endless repetition), so the production R1 added a cold-start SFT phase to fix that. Distilled versions (R1-Distill-Qwen-32B) outperformed o1-mini on multiple benchmarks.

Why it mattered: first open proof that pure RL can produce sophisticated reasoning without human-labeled reasoning traces. GRPO became the community standard — adopted by HuggingFace TRL and dozens of projects. And it cost a fraction of what OpenAI spent.

## How the big labs differ

- **OpenAI** — RLHF + "deliberative alignment" where the model reasons about safety policies in its chain of thought. o1/o3 are RL-trained reasoning models
- **Anthropic** — Constitutional AI with RLAIF. Written constitution guides self-critique. Less human labeling. Found that a single-line system prompt change during RL reduced misalignment by 75-90%
- **DeepSeek** — pure RL with verifiable rewards. No neural reward models. Rule-based verification. Open weights
- **Zhipu (GLM)** — joint RL across 30+ task types simultaneously. Cross-domain synergy: GUI agent data improves grounding and vice versa. This is what [[glm-5v-turbo]] does
- **Moonshot (Kimi)** — parallel-agent RL. Trains an orchestrator to decompose tasks into subtasks run by frozen sub-agents. Up to 100 sub-agents, 1500 coordinated steps

## The emergence debate

This one is genuinely unresolved:

- **"RL creates new capabilities"** — DeepSeek-R1-Zero went from 15.6% to 71%+ on AIME. Self-reflection appeared on its own. These behaviors weren't in the base model's typical outputs
- **"RL only surfaces what's already there"** — at high pass@k (e.g., k=256), base models cover the same reasoning paths. RL just makes the model find them faster, in fewer samples
- **The middle ground** (Feb 2026 paper) — RLVR can create novel composite capabilities by combining existing primitives in new ways, even if individual primitives already exist in the base model

Whether that counts as "creating" or "eliciting" depends on your definition. The practical result is the same: models go from 15% to 77% on hard benchmarks.

## Takeaway

The field moved from "train a reward model on expensive human labels" to "just check if the answer is right." Each step removed a component and made things cheaper. The open question is what happens for domains where you can't automatically check answers — writing, social reasoning, scientific discovery. That's where RL either needs new ideas or hits a wall.

Related: [[glm-5v-turbo]] [[gui-agents]]
