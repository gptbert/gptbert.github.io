---
title: "The Bitter Lesson and the Hardware Lottery: Making Compute Work for AI"
description: "Reading Sutton and Hooker together, from Transformer and FlashAttention to AI agents: compute scaling, infrastructure, and engineering evaluation."
date: 2026-09-30 10:50:00 +0800
lang: en
permalink: /en/posts/2026/09/30/bitter-lesson-hardware-lottery/
alternate_url: /posts/2026/09/30/bitter-lesson-hardware-lottery/
search_id: bitter-lesson-hardware-lottery
tags: [machine-learning, ai, performance]
---

When building AI systems, we often encounter two explanations for a method's success: it can keep making use of more compute, or the available hardware and software happen to suit it. Reading Richard Sutton's *The Bitter Lesson* alongside Sara Hooker's *The Hardware Lottery* helps clarify both questions.

My interpretation is that Sutton focuses on how methods use additional computation, while Hooker focuses on the computing conditions available to different methods. The essays largely complement each other, but there is tension over whether the benefits of cheaper computation can continue and reach different research directions. For engineering practice, they encourage us to ask: **Through what mechanism do additional resources improve results, and how much do the observed results depend on the current implementation environment?**

## The Bitter Lesson: Leaving Room for a Method to Scale

In his [essay dated March 13, 2019](http://www.incompleteideas.net/IncIdeas/BitterLesson.html), Sutton reviews developments in games, speech recognition, and computer vision. He argues that as the cost per unit of computation falls, general methods that can use more computation often have a long-term advantage over approaches that encode substantial amounts of domain knowledge by hand. He highlights two especially important mechanisms: search and learning.

The bitterness comes from a familiar research experience: carefully designed rules and representations deliver short-term progress, only to be overtaken by methods better able to use additional compute. The human effort was real, and so were the early gains, but those designs can gradually become constraints on further scaling.

I turn this argument into an engineering question:

> If the compute budget increased by an order of magnitude, through what mechanism would this method turn the additional computation into better results?

Consider code repair. One system relies on manually written error patterns and repair templates. Another can propose several candidate patches, run tests in a reproducible environment, and use the feedback to select or revise a patch. The first can quickly solve familiar problems; the second provides a way to expand the search.

More candidates, however, do not automatically produce a better repair. If tests cover only the visible symptom, search may select a patch with a hidden regression. **Compute investment, the exploration mechanism, and evaluation quality need to be examined together.** This is my engineering inference from Sutton's argument.

## The Hardware Lottery: Performance Comes with Environmental Conditions

Hooker's [*The Hardware Lottery*](https://arxiv.org/abs/2009.06489) appeared as a preprint in 2020 and was later published in *Communications of the ACM* in 2021. She uses the term "hardware lottery" to describe how a research direction can succeed because it fits the available hardware and software. Its current performance is insufficient to establish a general advantage over alternative directions.

Imagine two algorithms. Algorithm A performs more mathematical operations, but those operations are regular, contiguous, and easy to parallelize. Algorithm B performs fewer operations, yet depends on irregular memory access and dynamic control flow. If chips, compilers, and computing libraries support A more effectively, A may run faster and be easier for researchers to experiment with repeatedly.

Three questions then need separate answers: which method requires fewer operations, which runs faster on existing devices, and which has more potential under sustained research and different implementation conditions. The answers need not point to the same method.

Hooker also warns that specialized hardware developed around established methods can make exploring other directions increasingly expensive. Research opportunities depend on tools: mature implementations make experiments cheaper, and more experiments can in turn attract further optimization.

Actual speed and cost clearly matter when choosing a method for a product today. When judging a research direction's long-term potential, we also need to understand whether poor performance comes from the method itself or from limitations in its implementation environment. The latter is a hypothesis to test; it does not establish that the method would win if it received better support.

## Bringing the Two Perspectives Together

The following comparison is my analytical summary:

| Question | Sutton's focus | Hooker's focus |
| --- | --- | --- |
| Why can a method improve? | Can it continue to use additional computation? | What computing support does it actually receive? |
| How should we interpret current leadership? | Examine how search and learning scale. | Examine the effects of hardware and software fit. |
| What should investment decisions watch for? | Scaling bottlenecks introduced by manually encoded knowledge. | Constraints on exploration imposed by infrastructure. |

[![Compute, methods, and infrastructure: budgets feed search and learning to produce results requiring evaluation, while hardware and software affect computing conditions]({{ '/assets/images/compute-method-environment-en.svg' | relative_url }})]({{ '/assets/images/compute-method-environment-en.svg' | relative_url }})

*Figure 1. A conceptual synthesis of the two perspectives. Arrows show analytical relationships, not measured causal effects. Click to view at full size.*

First, general methods and general-purpose hardware operate at different levels. A learning method applicable to several tasks can run on hardware specialized for matrix operations. When evaluating an accelerator, we can examine both how much efficiency it adds and how readily it supports other methods. Efficiency gains and a narrowing of the space for exploration can occur together.

Second, the presence of human design in an algorithm does not by itself imply a lack of long-term value. Architectures, optimizers, data representations, and search procedures all require design. We need to observe how those designs help the system learn and explore, and whether they constrain later improvements.

The tension between the essays concerns how the benefits of computation are distributed. Sutton treats the continuing fall in the cost per unit of computation as a central premise. Hooker reminds us that specialization can give different research directions unequal benefits. Taken together, the claim that "compute will become cheaper" needs to be unpacked: **What kinds of computation become cheaper, for which methods, and at what implementation and migration cost?**

These essays offer historical analysis and judgments about research strategy. Whether a particular system benefits still needs to be answered through experiments.

## Transformer and FlashAttention: Design Changes How Compute Is Used

The following applies the essays' perspectives to later work. It is not a statement of Sutton's or Hooker's own assessments of that work.

The 2017 paper [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762) introduces Transformer and reports greater parallelizability and shorter training times in machine translation experiments. To me, this illustrates how architecture design can reorganize computation and help existing hardware participate more effectively in training. Learning performance and implementation efficiency jointly influence a method's practical results.

The 2022 paper [*FlashAttention*](https://arxiv.org/abs/2205.14135) further shows that speed depends on how data moves. It presents an IO-aware exact attention algorithm that uses tiling to reduce reads and writes between GPU high-bandwidth memory and on-chip SRAM. The paper also notes that some approximate attention methods with lower theoretical compute complexity did not deliver corresponding wall-clock speedups.

These examples connect the two perspectives: understanding hardware and memory hierarchies can help learning methods use computation more effectively, expanding the range of models and tasks that can be studied. Algorithm innovation, systems optimization, and compute investment should therefore be evaluated under the same experimental conditions.

## Engineering Implications for AI Agents

The recommendations below are my engineering inferences. They apply to coding agents, data analysis, root-cause analysis, and computer-use systems.

### Connect Additional Compute to Actions That Can Be Evaluated

Increasing reasoning tokens, attempts, or the number of agents first means spending more resources. To determine whether that spending helps, we need to examine whether additional attempts explore different solutions, whether the system can identify better results, whether failure feedback changes subsequent actions, and whether human intervention decreases.

For example, if a root-cause analysis agent proposes ten explanations without testing or eliminating them against evidence, their value is hard to judge. Candidate causes should lead to log queries, timeline checks, or reproducible attempts to disprove them. A coding agent likewise needs to connect candidate patches to effective acceptance checks.

Feedback and learning also need to be distinguished. Revising a patch based on test results within one task can improve that search. Whether this constitutes continual learning across tasks depends on whether the system retains and uses experience; a single retry does not establish that.

[![An agent workflow for candidates, execution, feedback, and acceptance: deliver on success, revise within budget on failure, and hand over to a human when the budget is exhausted]({{ '/assets/images/agent-compute-feedback-en.svg' | relative_url }})]({{ '/assets/images/agent-compute-feedback-en.svg' | relative_url }})

*Figure 2. An engineering illustration connecting additional compute to actions, evidence, and acceptance. Retries have a budget limit; whether feedback produces continual learning requires separate verification. Click to view at full size.*

### Reevaluate Workflows as Models Improve

The value of complex orchestration should be established through comparisons. With the same task set and acceptance criteria, we can define four experimental configurations:

| Configuration | Question to answer |
| --- | --- |
| Current model + full workflow | What level does the existing system reach? |
| Stronger model + full workflow | How much does the model upgrade help? |
| Stronger model + simplified workflow | Which prompt branches and manual task decomposition steps can be removed? |
| Stronger model + streamlined workflow, retaining feedback and acceptance checks | How much do the execution environment and evaluation mechanisms contribute? |

These comparisons should hold input data, tool permissions, and acceptance procedures fixed, while recording actual resource consumption. To assess gains per unit of computation, each configuration also needs several budget levels. Workflow comparisons ask whether a design helps; budget comparisons ask whether more resources help.

As models improve, some prompt branches may lose their value, while execution environments, tool feedback, and acceptance mechanisms may remain useful. Adjusting the workflow based on measurements reveals which sources of complexity are worth keeping.

### Evaluate Interface Coverage and Execution Reliability Separately

Computer-use systems can operate several applications through a GUI. APIs, command-line tools, and structured browser interfaces provide other ways to act. Interface coverage affects the range of tasks an agent can perform, but adaptability, time, cost, and success rate also need to be measured separately.

A system's ability to enter many applications does not establish equal efficiency across tasks. For a task available through both a GUI and an API, we can compare the two execution paths while holding the input and acceptance criteria fixed. The ability to adapt to a new state or a failure should also be evaluated.

### Measure the Cost of the Complete Task

For a business system, I would track task success rate, total cost per successful task, completion time, human intervention rate, and changes in performance when the model, tools, or environment change.

Total cost per successful task needs to include failed attempts and retries. Completion time should also account for the slow end of the distribution, such as P95. A cheap request or a quick answer does not establish that a complete task is equally cheap or fast.

These measurements help locate the bottleneck: insufficient model capability, unclear tool feedback, too much serial waiting, or an inefficient implementation. Identifying the bottleneck provides a basis for deciding where to spend the next increment of compute.

## Returning to Two Questions

I place *The Bitter Lesson* in the discussion of AI research methodology and computational scalability, and *The Hardware Lottery* in the discussion of technological evolution, infrastructure choices, and path dependence. Together, they add two questions that engineering judgments need to answer:

> Through what mechanism does my system turn more computation into better results?
>
> How much of the apparent lead or lag depends on the experimental conditions provided by the current hardware and software?

Answering the first requires designing exploration, feedback, and evaluation. Answering the second requires measuring implementation conditions and complete task costs. For me, the systems worth sustained investment are those that can use verifiable results to show how they improve across different budgets and environments.

## References

- Richard Sutton: [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html), March 13, 2019.
- Sara Hooker: [The Hardware Lottery](https://arxiv.org/abs/2009.06489), 2020 preprint; [Communications of the ACM version](https://doi.org/10.1145/3467017), 2021.
- Ashish Vaswani et al.: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), 2017.
- Tri Dao et al.: [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135), 2022.

This article was developed from [a discussion of the two essays](https://chatgpt.com/share/6abc734e-915c-83ec-938f-1edc1af41b9b) and checked against the original sources listed above. The agent evaluation methods and engineering examples are this article's extensions of the discussion.
