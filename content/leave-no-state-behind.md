---
title: Leave no state behind
date: 2026-08-17
description: An agent should be able to lose its machine at any turn boundary and carry on from a different one. Almost none of them can.
banner: /static/ships.webp
tags:
  - agents
  - harnesses
  - infrastructure
  - state
draft: false
---

Every step in the short history of agent infrastructure has been the same move performed again, which is putting a little more distance between the agent and the machine it was born on. We have made that move four times now, and each time it arrived looking like an operational detail rather than a change of kind. The fifth move is the one that matters, and it has not happened yet, which is not for lack of models or tooling but because a harness today drags its own state behind it like an installation.

## How the agent left home

<div class="ascii-diagram">

```
1  on your machine
   ┌─ your laptop ──────────────────┐
   │  ┌───────┐                     │
   │  │ agent │   its tools are     │
   │  └───────┘   your $PATH        │
   └────────────────────────────────┘

2  on your machine, boxed
   ┌─ your laptop ──────────────────┐
   │  ┌─ container ──────────┐      │
   │  │        agent         │      │
   │  └──────────────────────┘      │
   └────────────────────────────────┘

3  on a remote machine
   ┌─────┐    ┌─ remote machine ─────────────┐
   │ you │───▶│  ┌───────┐   boots in        │
   └─────┘    │  │ agent │   ~100ms          │
              │  └───────┘                   │
              └──────────────────────────────┘

4  execution on its own machine
   ┌─ machine A ────┐      ┌─ machine B ─────────┐
   │  ┌───────┐     │      │  ┌───────────────┐  │
   │  │ agent │     │─────▶│  │ shell + code  │  │
   │  └───────┘     │      │  └───────────────┘  │
   └────────────────┘      └─────────────────────┘
```

</div>

It began on our own machines, with Claude Code: a harness wrapping the model in a loop, with tools, context management and error recovery ([[anatomy-of-a-self-improving-agent]] goes into what a harness actually is). The tools were your shell, your files and your git, which meant the agent did not so much run on your machine as it *was* your machine, its capabilities being literally whatever happened to sit on your `$PATH`. Close the lid and everything stopped.

Then we got nervous and the agent moved into a container, because `--dangerously-skip-permissions` reads very differently inside a box with a mounted volume and nothing else. Devcontainers, worktrees, disposable images. The step was small but the admission underneath it was not: the agent needs an environment of its own, separate from ours. Once you have said that out loud, that environment becomes a thing with edges, something you can pick up and put down, and where it happens to sit stops being obvious.

From there it was a short walk off the laptop entirely, into Codex cloud, Claude Code on the web, which got easy because the sandbox category got very good very quickly: Vercel Sandbox went GA at the end of January, E2B boots a Firecracker microVM in about 200ms, and Daytona claims under 90. When a machine costs a tenth of a second and vanishes when the task ends, the question of which machine stops being an architecture decision and becomes a runtime one, and your laptop quietly demotes itself to a remote control.

The fourth move split the agent from what it runs. Isolating the agent from your laptop was never really the worry; the worry is the arbitrary code it writes and then executes, which is only ever as safe as the box it executes on. So the terminal stopped living where the agent lives. The harness sits on one machine while its shell, its installs, its dependency tree and its half-written scripts run on another, created for the task and destroyed with it, and a bad command takes down something disposable that was never holding anything. How the agent reaches that machine was settled early and is not the interesting part, since MCP landed in late 2024 and the tool layer has been fine ever since. What matters is that execution moved. Once the work happens somewhere the agent does not live, the agent is already operating a machine it is not installed on, which is most of the way to operating several.

## The work picks the hardware

<div class="ascii-diagram">

```
                           ┌─ 32 cores, 40 minutes ─────────┐
                       ┌──▶│  the compile                   │
                       │   └────────────────────────────────┘
                       │   ┌─ gpu at spot price, can wait ──┐
                       ├──▶│  the eval                      │
   ┌────────────────┐  │   └────────────────────────────────┘
   │   one agent    │──┤   ┌─ edge box, 20 seconds ─────────┐
   │  no subagents  │  ├──▶│  the browser check             │
   └────────────────┘  │   └────────────────────────────────┘
                       │   ┌─ no egress, prod credentials ──┐
                       └──▶│  the deploy                    │
                           └────────────────────────────────┘
```

</div>

Start with the simplest case, a single agent working alone that spawns nothing at all. Even that agent should be able to hold more than one computer at once and choose between them according to the work in front of it: the forty minute compile belongs on a thirty-two core box, the eval belongs on a GPU at spot price and can afford to wait, the browser check belongs on a cheap edge sandbox for twenty seconds, and anything touching production credentials belongs on the locked down machine with no egress. None of that requires a second agent. It requires an agent that treats machines as something it requisitions rather than something it was installed on. Once everything we run already lives in the cloud, the cloud becomes a thing that can be operated, and an agent is a reasonable candidate to operate it.

## Threads that should be machines

<div class="ascii-diagram">

```
today
   ┌─ one machine ───────────────┐      ┌─ execution ────┐
   │  ┌───────────────────────┐  │  ┌──▶│  shell + code  │
   │  │     orchestrator      │  │  │   └────────────────┘
   │  └───────────────────────┘  │──┤
   │  ┌──────────┐ ┌──────────┐  │  │   ┌─ execution ────┐
   │  │ subagent │ │ subagent │  │  └──▶│  shell + code  │
   │  └──────────┘ └──────────┘  │      └────────────────┘
   │      one cpu, one disk      │
   └─────────────────────────────┘

what we need
   ┌─ machine 1 ──────────┐     ┌─ execution ──────────┐
   │     orchestrator     │────▶│   its own machines   │
   └──────────────────────┘     └──────────────────────┘
   ┌─ machine 2 ──────────┐     ┌─ execution ──────────┐
   │   subagent harness   │────▶│   its own machines   │
   └──────────────────────┘     └──────────────────────┘
   ┌─ machine 3 ──────────┐     ┌─ execution ──────────┐
   │   subagent harness   │────▶│   its own machines   │
   └──────────────────────┘     └──────────────────────┘
```

</div>

When Claude Code spawns a subagent today, or Codex runs parallel agents across git worktrees, what actually gets created is another context window inside the same process, competing for the same CPU and writing to the same disk. February was full of this and the speedups are real, but the orchestration is linguistic while the infrastructure stays a single box. A subagent is a thread that talks.

The subagent has to leave. The orchestrator launches one and, instead of opening another context beside itself, it provisions a machine and installs a full harness on it, so the subagent arrives as a complete agent with its own loop, its own context, its own tools and its own judgment about what to do next. It runs its own tools on its own execution machines, exactly the way step four already works, because that layer was never the problem. And since every machine in this picture is asked for on demand, execution boxes included, there is no single place where the work lands: each harness gets its own, spun up for as long as the task runs and gone afterwards.

## The same move, one level up

<div class="ascii-diagram">

```
                  ┌─ machine 1 ────────────┐
                  │      orchestrator      │
                  └────────────┬───────────┘
                ┌──────────────┴──────────────┐
                ▼                             ▼
   ┌─ machine 2 ────────────┐    ┌─ machine 3 ────────────┐
   │    subagent harness    │    │    subagent harness    │
   └─────┬─────────────┬────┘    └─────┬─────────────┬────┘
         ▼             ▼               ▼             ▼
   ┌──────────┐  ┌──────────┐    ┌──────────┐  ┌──────────┐
   │ 32 cores │  │ gpu spot │    │ edge box │  │ prod box │
   │  build   │  │   eval   │    │ browser  │  │  deploy  │
   └──────────┘  └──────────┘    └──────────┘  └──────────┘
```

</div>

Those two ideas are the same idea, and they compose. An orchestrator hires a subagent and hands it a machine, and that subagent, being a whole harness rather than a prompt, then does exactly what the solo agent did: it requisitions machines of its own, one per kind of work, each running whichever tools that work needs. The tree runs orchestrator, then harnesses, then the machines each harness holds, and every box in it is asked for when the work starts and gone when the work ends. A subagent stops being a unit of context and becomes a unit of capacity.

Read the tree downward and it is just delegation, which we already know how to do. Read it upward and the problem appears, because a branch three machines deep is making decisions that only make sense if it knows what the rest of the tree has already done. That is the fifth step, and it is the one we have not taken.

## The part we never moved

A tree like that only holds together if every box in it is working from the same picture of what has already happened, and today none of them are, because the state lives wherever the harness was installed. So it is worth walking the same four steps again, watching the state instead of the compute, to see how we ended up here.

On your own machine, state is files: transcripts, memory, skills, a project directory, all of it real and all of it welded to a path on a disk, which is why `claude --resume` is a local mechanism that does not survive a move to another path or another machine. That is less a flaw than the honest design for a tool that assumed your laptop was the world.

In a container we made the split and made it backwards. The container is disposable, so the state gets mounted in from the host, which means we containerized the part that was already cheap to recreate and left the part that actually matters bolted to the laptop. Nobody objected, because at that point the laptop was always going to be there.

On a remote machine, state becomes a snapshot living inside a provider. Vercel snapshots the sandbox filesystem when it stops and resumes a new session from it, and AWS shipped managed session storage for AgentCore Runtime in March, where anything written to a mounted path outlives the microVM and resuming with the same session ID attaches that storage to a fresh one, git history and `node_modules` intact. It is good work that stops one step short, because a session ID plus a mount path is an address inside somebody else's cloud: the state survives the machine while never leaving the provider, so you can restart but you cannot migrate.

And once execution moved to its own machine, the state stopped being in one place at all. The conversation sits with the agent while the work sits in the sandbox: the repo, the branch, the installed dependencies, the build cache, everything the agent actually did. We solved that by making the sandbox sticky, pinning a session to a box so the work is still there next time, which is a reasonable fix for one agent and exactly the wrong instinct for several. It re-attaches the state to a machine at the very moment we had finally got it loose.

So we moved the compute four times and never once moved the state, which was survivable while there was one box and stops being survivable the moment there is a tree of them. The fifth step is exactly this: the global state of an orchestrator and every subagent it spawns has to live remotely and be shared between them. Not a copy per machine to be reconciled afterwards, and not a parent holding the truth while children report back, but one state that all of them read and write, so a subagent three machines deep is working inside the same reality as the orchestrator that hired it, and the orchestrator can see what that subagent found without being told.

<div class="ascii-diagram">

```
today: fused
   ┌─ machine A ──────────────┐
   │   ┌──────────────────┐   │
   │   │     harness      │   │
   │   │   + its state    │   │
   │   └──────────────────┘   │
   └──────────────────────────┘

needed: split and shared
   ┌─ machine ────┐ ┌─ machine ──┐ ┌─ machine ──┐
   │ orchestrator │ │  subagent  │ │  subagent  │
   └───────┬──────┘ └──────┬─────┘ └──────┬─────┘
           └───────────────┼──────────────┘
                           │
   ┌───────────────────────┴────────────────────┐
   │              one shared state              │
   │   journal, memory, workspace. nobody owns  │
   │   it, and every box reads and writes it    │
   └────────────────────────────────────────────┘
```

</div>

Which puts a requirement on the harness. A harness is code and has no business being unique, so two copies of it on two machines should be as interchangeable as two copies of `bash`. The state is what makes an agent this particular agent, and today the two are fused into a single install, so "the agent" means a directory on a specific box and moving it is a project. Separate them and the shape falls out on its own: the harness becomes an image you stamp onto anything with a CPU, the state becomes something with an address, and a machine joins the fleet by running the image and pointing at that address.

Migration then comes free, which is the part I care about most. A machine dying mid-task stops being an incident, because the next turn simply continues somewhere else, and a run can start on your laptop and finish on a rented GPU box. The bar this sets is harsher than "save your state", because the rule is to leave none of it behind: an agent should be able to lose its machine at any turn boundary and carry on from a different one. So kill the box mid-run, boot a fresh one elsewhere with a different provider if you can manage it, point it at the state, and see whether the next turn continues as though nothing had happened. If it does not, you do not have an agent running on infrastructure, you have an installation.

Most of the work involved is less exotic than it sounds. The journal is JSON and the memory is a directory, so neither is hard to move and we have simply never agreed on a format for either, while the workspace is gigabytes but is really a caching problem that content addressing turns into a matter of seconds. The only genuinely unportable layer is live process state, the open sockets and the dev server on `:3000` and the credentials scoped to this box, which does not move and should not, so the discipline is to make sure nothing depends on it surviving.

## The infrastructure of the future

Everyone is building the fleet first, because parallel agents and worktrees and teams demo well, while shared remote state demos as nothing at all. It is still the piece that decides whether an orchestrator can put its subagents on other machines, and whether an agent working alone can hold four computers instead of one.

The agent we need does not have a computer. It has computers, it hands them work, it does not much care which one it wakes up on, and the thing that makes them all one agent is a state that none of them owns. That is not a preference about tooling, it is what the next few months of this are going to require: the work is already spread across machines we do not own and cannot keep, so anything that assumes a home is a thing that will eventually be somewhere else. Getting there is not a model problem. It is deciding that the harness is a copy, the state is the agent, and nothing that matters gets written to a place that exists exactly once.

Related: [[anatomy-of-a-self-improving-agent]]
