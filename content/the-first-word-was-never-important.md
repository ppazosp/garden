---
title: Engineering remains
date: 2026-06-13
description: Coding is solved. Engineering is still where the real work lives.
tags:
  - agents
  - llms
  - software-engineering
  - careers
---

For about a year, I've been living inside coding agents. Most of what I ship day to day gets written by one of them. For most of that year the improvement felt gradual. At first they were prototyping toys, good for a demo if you babysat them long enough. Then they needed less babysitting. Then they started oneshotting the easy stuff.

A few weeks ago something changed, and I noticed it as an absence. I review an agent's work the same way every time: pull the branch, run the feature, go looking for the thing that doesn't work. Then the thing that doesn't work stopped showing up. I genuinely can't remember the last time I opened a feature an agent built and hit an error, or found the obvious case it forgot to handle. That is not "getting better." That is a step change.

So I'll say it plainly: coding is solved.

## What "solved" actually means

I know how that sounds, so let me draw the line before someone throws a counterexample at me.

By coding I mean the common case. The CRUD endpoint, the migration, the refactor, the bug with a stack trace attached, the component, the throwaway script. The work that is, honestly, most of what many of us do all day. Put a frontier model in front of one of those, whatever is topping the leaderboard the week you read this, and it oneshots it cleanly. More cleanly than I would, a lot of the time. And let me be blunt: writing that kind of code by hand now is a bad decision. Not noble. Not craftsmanship. Just slower work for a worse result. If the agent does it better and faster, typing it out yourself is choosing to lose on purpose.

The benchmarks tell the same story, with a catch. This generation clears about 80% on SWE-bench Verified, four out of five real GitHub issues resolved on its own. Move to SWE-bench Pro, which is harder and closer to actual multi-file work, and the same top models fall to around 23%. OpenAI has also flagged part of that Verified score as contamination: the model may have seen the answer in training instead of reasoning its way there.

```
SWE-bench Verified   ████████████████░░░░   ~80%   common coding
SWE-bench Pro        ████░░░░░░░░░░░░░░░░░   ~23%   real engineering
```

That gap is the post. The common 80% is solved. The hard, ambiguous, this-touches-nine-files-and-a-business-rule 20% is not. People who tell you "AI can't code" are talking about the 20%. They're right about that 20%, and wrong about what it means for the rest.

## The two words

Here's the part people skip over. "Software engineer" is two words, and the first one was never the important one.

The software part, by which I mean coding, is the half that just got solved. Engineering is everything else, and that is where agents are still bad. Architecture. Tradeoffs. Deciding what to build and, harder, what not to build. Keeping the thing pointed at where the business is actually going instead of where the ticket says it's going. A model can implement any module you can describe. What it can't do is tell you whether it's the right module.

Boris Cherny, who built Claude Code, says it out loud: "today coding is practically solved for me." He expects the title "software engineer" to start fading this year, with the work moving toward writing specs and talking to users. That does not read like a doom prediction to me. It reads like the first word retiring and the second one taking over.

## The perfect module that's wrong for you

The failure mode of a good coding agent isn't broken code anymore. It's perfect code aimed in the wrong direction.

It builds you a flawless module the business didn't need. It implements the feature exactly as written, when the feature as written was the wrong feature. It tidies up a dead code path you were quietly keeping alive for the thing you're shipping next quarter. Every one of those is a clean commit and a bad call. Most teams I see reach for the same phrase when they hit this wall: domain knowledge. The agent does not understand your codebase, your product, or your priorities well enough to make the decision. So you make it.

## Engineering was always the moat

None of this reads as a layoff notice to me. It reads as a promotion most of us didn't ask for.

Coding was always the commodity. We couldn't see it because, for thirty years, the commodity was also the bottleneck. The typing was the hard part, so we mistook the typing for the value. Now the typing is free, and what's left is the thing that was scarce the whole time: judgment. Knowing which problem is worth solving. Knowing what tradeoff you're making and why. Knowing which piece of ugly code is load-bearing for a plan only you can see.

You have a workforce now that can build almost anything you point it at. That does not help if you point it at the wrong thing. The job stopped being writing the code. The job is deciding what gets built, in what order, and why, and being right about it often enough to matter.

You're not a worse coder than the agent. You're just less of a coder now and more of an engineer. The valuable half of the title is the whole job now. Take it, or get managed by someone who already did.

Related: [[anatomy-of-a-self-improving-agent]] [[pursue-the-1]]
