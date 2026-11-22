---
title: Be more ambitious
date: 2026-11-14
description: My DevFest Santiago talk, written down. Software has always been built and used by humans. Agents now build it, and are starting to use it. The next wave is agents building for agents, and it asks which parts of the path we only walked because we were the ones on it.
banner: /static/hill.webp
tags:
  - talks
  - agents
  - software
  - architecture
draft: false
---

On 5 November I gave a talk at DevFest Santiago called _Software Post-IA_, about the future of software. I shared a vision I have, so people could think about it and be a bit more ambitious when building their next projects. This post is that vision, written down.

## Who is who

Since software has existed, it has been built and consumed by the same actor: humans. A person wrote it and a person used it, and almost every decision in between assumed exactly that.

A few months ago the builder started to shift from humans to agents. The consumer has shifted too, more slowly: humans are still there, but agents are starting to show up as the main consumers of some services. I call these two shifts waves, and neither of them is a prediction. They are already happening, and you can point at them.

My prediction is the third one: agents producing for agents.

## Wave one: agents build what we use

In 2000 Joel Spolsky wrote [Things You Should Never Do](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/), arguing that rewriting your code from scratch is the single worst strategic mistake a software company can make. Netscape spent almost three years rewriting its browser without shipping and lost the market while it did. For two decades that was the rule, and it was a good one, because it rested on a simple fact: a rewrite cost years of people's time.

That fact stopped being true this year. GitHub [ported the Copilot runtime from TypeScript to Rust](https://github.blog/news-insights/product-news/migrating-the-github-copilot-runtime-to-rust-using-copilot/), more than 800,000 lines of production Rust in about fourteen and a half weeks, with one engineer and Copilot writing most of the code while the rest of the team kept shipping. Jarred Sumner [rewrote Bun from Zig to Rust](https://bun.com/blog/bun-in-rust) in eleven days with a fleet of Claude agents. OpenAI moved the storage service under ChatGPT from Python to Rust, and the React Compiler went the same way.

What changes is where the human work goes. Nobody translates files by hand; engineers write the rules of the migration and the loops that check it, and the agents grind until the new system behaves like the old one. Still, every one of these rewrites is the same software for the same user. The agent builds it and a person still uses it.

## Wave two: agents start using what we build

The second wave is when agents stop only building what we use and start using it themselves. Karpathy described it well: there used to be two consumers of digital information, people through interfaces and programs through APIs, and now there is a third, agents, which understand like people and operate like programs.

You can already see products adapting. Sites publish an [`llms.txt`](https://llmstxt.org) so models can read them without parsing a page made for eyes, most developer tools now ship an MCP server, and Cloudflare found that agents do better when they [write code against an API](https://blog.cloudflare.com/code-mode/) than when they call tools one at a time like a person clicking buttons. Supabase says that [70% of its new databases](https://supabase.com/blog/supabase-is-acquiring-turso) are now created by agents or AI tools, which means the main user of a database company is no longer a person.

Humans are not leaving this picture. The product just gets a second door, and the interesting part is what you find when you build it: a lot of what we built (the onboarding, the navigation, the pagination, the confirmation dialogs) was there so a human could operate the machine, and an agent does not need any of it.

## Wave three: agents producing for agents

Look at what agents are trying to do: automate as much work as possible, so the person can do what they like without worrying about the boring parts. To get there, those agents need to talk to services that were created for humans and now have to evolve to be used by agents. Fast forward, and you get a future where almost every action on the internet is abstracted away and done by agents talking to services that were made by agents, for agents.

In that scenario, pre-AI software has two options: adapt or die.

The adaptation has already started, and it keeps running into obstacles that exist only because we built everything for humans. My favourite example is the number of sandbox startups being created right now. Agents work so fast that compute has become the bottleneck: a laptop is no longer enough for a developer, because their agents need machines of their own or they slow down. [E2B](https://e2b.dev), [Daytona](https://www.daytona.io), [Modal](https://modal.com), [Vercel Sandbox](https://vercel.com/sandbox) and [Sprites](https://sprites.dev) all sell some version of a computer an agent can start in a fraction of a second and throw away when it is done. Building those is not only an infrastructure problem; it forces a software question too. Are our operating systems ready for agents, or do we need something different?

And the agent-for-agent products are already appearing, even if they look strange today. [AgentMail](https://www.agentmail.to) gives agents their own email inboxes. [Browserbase](https://www.browserbase.com) runs browsers that no human will ever look at. [Exa](https://exa.ai) is a search engine whose users are models. Supabase bought Turso so it can hand [a database to every agent](https://supabase.com/blog/supabase-is-acquiring-turso), millions of tiny ones that wake up when needed and sleep when not. And agents can now pay each other: [x402](https://www.x402.org) revives the HTTP 402 "Payment Required" status code, reserved since the nineties and never really used, so a server can answer a request with a price and the agent can pay and retry, with no account and no API key. It now sits under the Linux Foundation, backed by Google, Visa, Stripe and AWS among others.

## The path we walked for ourselves

This is the idea I most wanted people to leave the room with.

Over all these years of handmade software, we built a path starting from nothing. Every time it changed direction, someone made a decision, and many of those decisions were taken because we, humans, were the ones building and consuming. So the question is which of those turns we would take again if the one walking the path were an agent.

Think about programming languages. We designed them to be written and read by people. If agents are writing almost all the code, and we are starting not to even review it, why are we not creating languages that are as efficient as possible for an AI to use? Some people already are. [Zero](https://zerolang.ai), from Vercel Labs, is a language where the program is a graph instead of text: agents query it and send checked edits, and the compiler rejects a stale or broken change before it ever lands.

Languages are just the clearest case. Here are some of the crazier ones I showed in the talk.

**Memory and disk.** We keep things on disk because people switch their computers off and want their work back tomorrow. Cheng Lou [asked](https://x.com/_chenglou) what would happen if a machine ditched main memory altogether, and whether AI could fix the problems that would cause. Hard, maybe wrong, but exactly the kind of question I mean.

**Everything is a file.** Models learned from an internet written by developers who think in files and shell commands, so bash is the interface they know best. [AgentFS](https://turso.tech/blog/agentfs) gives an agent a filesystem that is really a SQLite database underneath, and [TigerFS](https://www.infoq.com/news/2026/04/tigerfs-postgresql-filesystem/) does the same with Postgres. The database stays; the door changes.

**Apps that last ten minutes.** We build apps to live for years because people need time to learn an interface. If building one costs almost nothing, an app can be [written for one task](https://arxiv.org/abs/2609.10248) and deleted when it is done, and "maintaining software" stops meaning what it means today.

**An operating system that is generated.** Google [simulated an operating system](https://developers.googleblog.com/en/simulating-a-neural-operating-system-with-gemini-2-5-flash-lite/) where every screen is generated by Gemini at the moment you click. It is slow today, the way video on the internet was slow in 2000.

None of these is a recommendation, and most of them may turn out to be dead ends. That is fine. The point is the question behind all of them: what other systems that we keep building on top of could be rethought for an agent era?

## Take a different turn

Humans are not going away, and a lot of what we built for ourselves will stay, because we are staying too. But for the first time in a long while we can walk back down the path and check each turn, and the people building now have a real chance to take a different one.

That was the whole point of the talk: not to predict exactly what comes next, but to make people a little more ambitious about what they build next. If you have a turn in the path you think is worth walking again, I would love to hear it.

Related: [[leave-no-state-behind]], [[learnings-from-building-a-super-agent]]
