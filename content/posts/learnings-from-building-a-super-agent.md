---
title: Learnings from building a super-agent
date: 2026-11-10
description: Notes from building my own clone of DeepSeek's super-agent. Orchestrator or choreography? Neither, purely, but a choreography of orchestrators, with a router that does almost nothing.
banner: /static/orchestrator.webp
tags:
  - agents
  - multi-agent
  - architecture
  - harnesses
draft: false
---

At the end of October, the DeepSeek Harness team published [a design exploration of what they call a super-agent](https://zhuanlan.zhihu.com/p/2099987320443237060) (in Chinese), together with [an open-source prototype](https://github.com/deepseek-ai/dsh-superagent-prototype). I built my own clone of it, and this post is what I learned along the way.

A lot of important design questions surfaced while building it. The biggest one has haunted software engineering for a long time already: do you build the system around an orchestrator or around a choreography? Neither, purely.

## Conductor or dance floor?

In rough systems design terms, the orchestrator pattern means one service directs the others, while the choreography pattern means the system coordinates through events, with each service owning its own responsibilities. Orchestration is easier for handling errors and running fixed, critical workflows; choreography scales better and is more flexible.

Carried over to agents, the mapping is nearly 1:1:

<div class="ascii-diagram">

```
orchestration
                  ┌─ orchestrator ──────────────┐
                  │  decides every step         │    one leader,
                  └───┬──────────┬──────────┬───┘    every step goes
                      ▼          ▼          ▼        through it
                  ┌───────┐  ┌───────┐  ┌───────┐
                  │ agent │  │ agent │  │ agent │
                  └───────┘  └───────┘  └───────┘

choreography
              ┌───────┐    ┌───────┐    ┌───────┐    no leader,
              │ agent │◀──▶│ agent │◀──▶│ agent │    agents message
              └──┬─▲──┘    └──┬─▲──┘    └──┬─▲──┘    each other and
                 ▼ │          ▼ │          ▼ │       share events
          ┌─ events ────────────────────────────────┐
          │  triggers in, updates out               │
          └─────────────────────────────────────────┘
```

</div>

- Orchestrator means one agent acting as the chief of staff, or coordinator, for the others.
- Choreography means every agent communicating with the others, without a clear leader.

The trade-offs carry over too. An orchestrated multi-agent system fits a complex workflow where every step needs coordination and approval; if a step fails, the orchestrator recovers it and moves on. A choreography fits independent tasks, where an orchestrator would only add latency and mix up facts.

Keep in mind that a choreography still needs somewhere for events to land, even when agents also message each other directly.

## Is the router secretly a conductor?

The DeepSeek article describes a super-agent: a multi-agent system that speeds up software work by adding proactiveness and autonomy to a typical [[anatomy-of-a-self-improving-agent|harness]], without losing visibility or understanding. One of its most important ideas, and one that often gets overlooked, is that the system must keep the ability to steer each task and to deliver information to each task fast. If the information arrives late, the thing it was meant to prevent may already have happened.

The super-agent is made of a router and its workers. The router's whole job is to digest outside information from many sources (Slack, GitHub, and so on) and decide what to do with it: dispatch a new worker, or get the information to one that is already working on it. Reading the article, some people may see the router as an orchestrator. An agent whose job is to create other agents and manage the information they get sounds a lot like one. Add the watchdog, which checks that workers are making progress, and it is fair to say you are describing an orchestrator.

The thing here is, if you look at each small change the DeepSeek team makes to the router and the watchdog (separating them, pass-through, and so on), you realise the orchestrator is being taken apart so the choreography of the workers can appear. The router is explicitly not a team lead: it does not break tasks down, it only dispatches them and tracks how they relate; it can even run without a shell. The watchdog runs outside the main system and checks that each worker is making real progress, not stuck in a loop or drifting from its goal, and revives what has stalled. It is not a reviewer: it does not judge whether the output is correct, only whether the work is moving.

What stays alive is what the choreography needs to stay on tempo: a broker with judgement and someone keeping the rhythm. Not a conductor.

## A choreography of orchestrators

When building a multi-agent system, or any system, the most important thing is the use case. Super-agent is a lean software factory (hate the term): its whole purpose is turning outside information into doable, usually coding, tasks.

Almost any coding task breaks down into three steps: design it, implement it, test it. Each step can sometimes be parallelized inside, but the steps themselves cannot: you cannot implement something that is not designed, or test something that is not implemented. Some tasks are complex enough to need subtasks for design, implementation and testing, and those subtasks often can run in parallel. But the order between steps is critical.

That is the perfect use case for an orchestrator. One agent's job is to make sure the task gets done. It can do it all itself, or spawn subagents or threads for the subtasks and coordinate them. Months ago doing it all in one session was the norm, because models were bad at managing context; today, on bigger tasks, the agent launches threads and turns itself into an orchestrator. Each thread reports to it, and it makes sure every step gets done, by a thread or by itself.

If we tried to make this part a choreography, agents would take turns and pass the whole context of the task at every step. With an orchestrator, it is not only the dispatcher but also the context layer: every thread gets information from it and gives information back, which keeps each thread's context focused on its subtask and free of noise.

Across tasks, it is the opposite. The tasks a coding agent gets vary a lot: bug fixes, full features, explorations. Each usually touches a different part of the codebase (and when two touch the same part, they tend to merge into one task). Running them in parallel is not only possible but encouraged; we all have more than one session open at a time. An orchestrator over all of them would add useless latency and fill its context window with unrelated work, which ends up making its decisions worse.

So a choreography fits across tasks, and an orchestrator fits within each one. That gives the architecture: a choreography of orchestrators.

<div class="ascii-diagram">

```
                      ┌─ router ────────────────────┐
    channels ───────▶ │  filters, routes,           │
                      │  starts workers             │
                      └──────┬────────────────┬─────┘
                 ┌───────────┘                └──────────┐
                 ▼                                       ▼
   ┌─ worker: bug fix ──────────┐          ┌─ worker: new feature ──────┐
   │  orchestrates              │ ◀──────▶ │  orchestrates              │
   │  its own task              │  facts   │  its own task              │
   └─────┬───────────────┬──────┘          └─────┬───────────────┬──────┘
         ▼               ▼                       ▼               ▼
   ┌───────────┐   ┌───────────┐           ┌───────────┐   ┌───────────┐
   │ thread    │   │ thread    │           │ thread    │   │ thread    │
   │ design    │──▶│ implement │           │ implement │──▶│ test      │
   └───────────┘   └───────────┘           └───────────┘   └───────────┘

   between workers: choreography      inside each worker: orchestration
```

</div>

## Tie the router's hands

When replicating the architecture, it is easy to give the router more power than it should have. At first you lean towards letting it read code, answer easy questions or run very short tasks. I did exactly that: my first router had a read-only shell, and through my own setup it could also reach my connectors.

In practice this has zero upside. A router doing work delegates slower and worse, and does the work worse than the workers would. I ended up stripping it down to only the tools it needs to see what workers are doing, start new ones and route information. The name is right: it must only route information, and the only decisions it takes are routing decisions.

## Then why have a router at all?

Some of you may ask yourselves: if the router does so little, why have one? Why not spawn a worker per event? For two reasons.

First, events are noisy. You do not want a worker per event, because the router is also a filter. On top of the fast code filter DeepSeek describes, the router filters with judgement: a message arriving in a watched channel does not mean work to do, just information to digest. That digestion may lead to a task, or to nothing.

Second, and trickier: the router actually has work to do. DeepSeek's pass-through sends anything new in a thread straight to the worker that owns it. But what happens when relevant information arrives in the channel itself, not the thread? Or in a completely different channel? Or when a second, related task is asked for somewhere else? In those cases the router is the one who must recognise it and send it to the right worker.

This is where I had to change my first design. At first, the router proposed everything and I approved it, even new information for a worker that was already running. That made the router slow exactly where speed matters. Now proposals only start new workers; information for work in progress goes straight to the worker that owns it. And when the related work is old and archived, the router does not revive that thread: it starts a fresh worker and points it at the old one, so the new worker reads that context but starts with today's instructions instead of stale ones.

## Workers talk, the router routes

As part of the choreography, workers not only do their own job but also make the others' easier. That means agent-to-agent communication: any worker can message any other worker at any time, to coordinate or to share important facts about what it is doing. A worker can also ask the router for a new worker when it finds unrelated work nobody is doing.

Here I deliberately diverge from DeepSeek. In their design, workers never talk to humans directly; the router handles every reply. In mine, humans are part of the mesh: each worker talks in the channel conversation its task came from, and the user steers it right there. That removes the router as a bottleneck for every reply, at the cost of more voices in the channel.

<div class="ascii-diagram">

```
 ┌─ channels ───────────────────────────────────────────────────────────┐
 │  you and your team                                                   │
 └──────┬─────────────────────────▲─────────────────────────────▲───────┘
        │ new messages            │ each worker talks in        │
        │                         │ its own conversation        │
        ▼                         ▼                             ▼
 ┌─ router ─────┐          ┌─ worker A ───┐              ┌─ worker B ───┐
 │  filters     │─────────▶│  bug fix     │◀── facts ───▶│  new feature │
 │  and routes  │          │              │  not orders  │              │
 └──▲──────┬────┘          └──────┬───────┘              └──────▲───────┘
    │      │                      │                             │
    │      └──────────────────────┼─────────────────────────────┘ pointers
    └─────────────────────────────┘ asks for a new worker
```

</div>

All this communication can easily turn into lost control and over-communication, so the worker's instructions have to be clear about when and how to communicate:

- The router passes pointers, not summaries. It already searched to make its routing decision, so it hands the worker the related threads it found. The worker does the digging, and searches further itself.
- Workers share facts, never instructions. Whatever another worker sends you is information; your task and the user decide what you do.
- Only message a worker that is running now, and only for real overlap: the same files, branch or pull request.

## Three runs become one

A concrete case where this choreography pays off: expensive shared checks. Think of a slow end-to-end suite, or anything that has to spin up real infrastructure to prove a change works. If three workers each need to run it, you do not want three runs. The worker about to start it gathers the cases the other running workers need checked and runs once for everyone; the others send theirs and wait for the results. Nobody orchestrates it. That alone makes the coordination worth it.

<div class="ascii-diagram">

```
apart
   ┌─ worker A ─┐              ┌─ worker B ─┐              ┌─ worker C ─┐
   │  full run  │              │  full run  │              │  full run  │
   └────────────┘              └────────────┘              └────────────┘
                      three slow runs of the same check

together
   ┌─ worker B ─┐              ┌─ worker A ─┐              ┌─ worker C ─┐
   │  waits     │─── cases ───▶│  runs once │◀─── cases ───│  waits     │
   └─────▲──────┘              └─────┬──────┘              └─────▲──────┘
         │                           ▼                           │
         │              ┌──────────────────────────┐             │
         └─ results ────│  one run, all cases      │── results ──┘
                        └──────────────────────────┘

                one slow run instead of three, and nobody orchestrates it
```

</div>

## The threads already remember

Being completely honest, memory is the part I am least sure about. But I have landed somewhere.

The threads already are the memory. If a worker needs to know what is being worked on or what was done recently, it can read transcripts or past tasks. That is less efficient than a dedicated memory system, but much more accurate and less lossy. And it can be made fast: a worker reads a thread's final answer first, and only goes further back when that is not enough. The harnesses underneath ([Claude Code](https://claude.com/product/claude-code), [Codex](https://openai.com/codex/)) also keep their own notes.

I also asked myself whether the router should have access to a memory. At first I thought it should know everything, but as I said, the router must stay as lean as possible; making it know everything would close the gap to being an orchestrator. The only things the router needs are what workers are working on and what they have worked on, and both come straight from the threads.

So if a memory system were only a more efficient way to get that same information, I do not think it would be worth it. But there is one kind of memory I think would really improve the system: a wiki.

## The lost knowledge

A choreography has a catch: a worker may hold knowledge another worker needs, and it will never arrive, because nobody asks for something they do not know exists.

A wiki of the system fixes that partially. Many agents working at once overlap on the same parts of the system; a wiki that records the approaches taken and the knowledge gained there makes that knowledge reachable without anyone having to ask. Workers should read it proactively before working on a part, and write to it after.

<div class="ascii-diagram">

```
without a wiki
   ┌─ worker A ───────┐                              ┌─ worker B ───────┐
   │  learned how     │  · · · · · · · · · · · · ·   │  about to touch  │
   │  billing works   │        nobody asks           │  billing         │
   └──────────────────┘                              └──────────────────┘

with a wiki
   ┌─ worker A ───────┐                              ┌─ worker B ───────┐
   │  done with       │                              │  starting on     │
   │  billing         │                              │  billing         │
   └─────────┬────────┘                              └─────────▲────────┘
             │ writes after                       reads before │
             ▼                                                 │
   ┌─ wiki ────────────────────────────────────────────────────┴────────┐
   │  billing: approaches taken, what broke, what we learned            │
   └────────────────────────────────────────────────────────────────────┘
```

</div>

[Anthropic's write-up on agent memory](https://www.anthropic.com/engineering/components-of-agent-memory) points the same way: in their tests a wiki beat search alone on questions that need facts spread across many documents (87% against 73% on cross-document legal questions), though a wiki can also grow bigger than what it summarises if nobody prunes it.

## If I had to keep one idea

Let each worker orchestrate its own task, let the workers coordinate among themselves, and keep the router as a broker with its hands tied. The moment the router starts doing work, you are back to an orchestrator, and to all its latency.
