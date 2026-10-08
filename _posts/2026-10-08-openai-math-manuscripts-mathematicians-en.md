---
title: "OpenAI Releases 722 Mathematical Manuscripts: How Will the Value of Mathematicians Change?"
description: "As AI produces mathematical results at scale, how might problem selection, verification, understanding, and knowledge synthesis be shared? A reflection on OpenAI's mathematics release."
date: 2026-10-08 10:00:00 +0800
lang: en
permalink: /en/posts/2026/10/08/openai-math-manuscripts-mathematicians/
alternate_url: /posts/2026/10/08/openai-math-manuscripts-mathematicians/
search_id: openai-math-manuscripts-mathematicians
tags: [ai, scientific-computing]
---

The number “722 mathematical manuscripts” invites us to see a competition between people and machines. Can AI now solve, at scale, problems that mathematicians spend years studying? If proofs can be generated automatically too, what value will mathematicians still offer?

I am more interested in how research work is divided. Mathematics involves posing problems, finding proofs, checking arguments, explaining mechanisms, and connecting new results to existing knowledge. Progress by AI in one part of this process changes the cost and importance of the others.

**My view is that if AI can consistently produce correct and meaningful results, more of mathematicians' value will lie in judging problems, creating concepts, and synthesizing knowledge. At the same time, some work centered on independently producing proofs will face real pressure from automation.** This is an analysis of possible future roles, rather than an employment conclusion established by this release.

## What Do the 722 Manuscripts Actually Mean?

On October 6, 2026, OpenAI [announced the release of a collection of mathematical research results](https://openai.com/index/sharing-ai-progress-in-mathematics/). At the time of checking for this article, the [official repository](https://github.com/openai/math) lists **722 manuscripts organized into 372 result families**. A family can include a principal result, companion arguments, consequences, or an alternative proof, so the manuscript count cannot be directly converted into a count of open problems solved.

The repository says that these results came from an unreleased internal model, are at different stages of verification, and that some unformalized results may have issues. There is still work to do between making manuscripts public and gaining acceptance from the mathematical community. [Source: repository README](https://github.com/openai/math#readme)

Three things need to be distinguished here: a model has proposed an argument; that argument has been reliably verified; researchers understand its ideas and can use them on other problems. Each step has value, and an earlier step does not automatically establish the next.

I have not reviewed these proofs individually or run the entire Lean project. This article discusses the organization of research prompted by the release; it does not independently endorse claims that particular major conjectures have been resolved.

## What Becomes Scarce When Proofs Are Easier to Produce?

Imagine a future in which researchers can obtain multiple candidate proofs for a precisely stated problem at relatively low cost, some with materials that a machine can check.

Their daily task might then expand from “How can I find a viable approach?” to “Which of these approaches are correct, important, and worth pursuing?” An increase in supply brings selection and understanding into greater prominence.

But there is a condition: **the increase must be in usable results, rather than merely in text that resembles a paper.** If every output requires experts to spend substantial time eliminating subtle errors, faster generation may create a larger verification backlog. Conversely, if formalization tools and AI-assisted checking also continue to improve, verification costs may fall too.

“Mathematicians will mostly grade AI's work” is therefore only one possible transitional stage. The longer-term change depends on how quickly generation, verification, and understanding each advance.

The following is my framework for thinking about this changing division of work:

| Research activity | What AI progress might change | Contributions that need renewed evaluation |
| --- | --- | --- |
| Posing problems | Conjectures and candidate directions become easier to generate | Judging importance, feasibility, and connections |
| Finding proofs | More constructions and lines of argument can be explored | Designing effective search directions and identifying key ideas |
| Verifying results | Formal checks and automated assistance become more widely usable | Checking statements, assumptions, dependencies, and actual coverage |
| Explaining proofs | Different versions of an explanation become easier to generate | Extracting transferable mechanisms and checking explanations for accuracy |
| Organizing knowledge | Retrieval, classification, and comparison can be assisted | Building conceptual connections and developing new research programs |

AI may assist with these contributions as well. Human advantages need to be demonstrated in actual research; saying “machines lack intuition” does not guarantee them.

## Lean Can Check a Proof. Who Checks What It Proves?

OpenAI has also released Lean formalizations for some results, along with a [formalization catalogue](https://github.com/openai/math/blob/main/lean/formalization.yaml). That file describes its entries as papers with a formalized main result; this does not imply that every assertion in each manuscript has been covered.

For a reader, checking a formal proof involves at least two layers. The first concerns the formal system itself: does the proof object pass checking in the specified environment and with the specified dependencies? The second concerns the correspondence between mathematical expressions: does the formalized statement accurately express what the paper claims?

For example, a paper might discuss all objects satisfying a certain condition, while the formalized statement introduces an additional, very strong assumption. Even if the latter passes checking, the gap between it and the original statement needs to be explained. Likewise, if a key conclusion depends on an unproved premise, that dependency should be made explicit.

This does not diminish the value of formalization. It makes conditions that natural language can obscure visible, and provides a more precise object for collective verification. But reviewers still need to ask what has been covered, what remains to be supplied, and whether the definitions and assumptions fit the research goal.

Mathematicians' domain knowledge has a concrete role here: identifying what a statement means, how strong its conditions are, and how the conclusion relates to previous results. Formalization specialists help turn that judgment into checkable materials. The two kinds of work can reinforce one another.

## How Much Understanding Can a Correct Proof Provide?

A valid proof gives a conclusion a reliable basis. Researchers may still ask which step does the essential work, why a condition is necessary, whether a simpler proof exists, and whether the method can be generalized.

Suppose a model produces a long, correct proof that combines several techniques. Another researcher finds a short lemma that explains why the whole argument works, and shows that it applies to another class of problems. That researcher creates new value even though the original theorem has already been proved.

This is central to how I understand the changing value of mathematicians: **extracting a reusable idea from a result can have a broader impact than the result itself.** Textbooks, lecture notes, conceptual unification, and new proof methods all expand the range of uses for mathematical knowledge.

Of course, AI may also help simplify proofs, find generalizations, and propose concepts. We cannot reserve “explanation” in advance as a domain that machines cannot enter. A more useful question is whose contribution makes a problem clearer and makes the next piece of research easier to begin.

## How Is Judgment That Is Hard to Delegate Developed?

A good problem usually involves several judgments: whether it connects to important structures, why existing methods are stuck, what a possible answer would change, and which new tools a solution might require.

These judgments grow out of research experience, but they can also be discussed, compared, and revised. AI can supply many candidate problems; researchers need to explain why they choose a particular one. When a model proposes a new definition, it is also necessary to check whether it merely restates an old concept or actually unifies different phenomena.

For young researchers, this means that foundations still matter. Trying to prove statements, constructing counterexamples, and checking boundary conditions develops both problem-solving skills and the ability to judge other people's arguments. Without that experience, fluent prose can easily be mistaken for a reliable explanation.

Training can change, however. Given an AI-generated proof, students could be asked to fill in hidden steps, identify the strongest assumptions, try to weaken the conditions, and independently explain the core mechanism. Such exercises are closer to real research than simply checking a final answer.

## Professional Value Also Depends on Institutions and Access to Tools

How academic contributions translate into credit, jobs, and funding depends on more than technical ability. If evaluation continues to rely heavily on publication counts while the cost of producing candidate manuscripts falls, that metric may become less effective at distinguishing important contributions from large volumes of similar output.

My suggestion is to make contribution statements more specific: who posed the problem, designed the research process, found or repaired the argument, completed the formalization, checked the literature, and took responsibility for the final content? Independent verification, proof simplification, and knowledge organization should also have routes to recognition. This is a proposal for institutional change, not a description of a universally adopted standard.

In its [recommendations for responsible release](https://agmai.org/general-sep29/), the Advisory Group on Mathematics and Artificial Intelligence, AGMAI, emphasizes support for human understanding and leadership by the mathematical community. It also explicitly opposes testing advanced mathematics on proprietary models inaccessible to that community. OpenAI's consultation with the group therefore cannot be taken as the group's endorsement of all its practices.

This disagreement has practical consequences. Everyone may be able to read a manuscript without being able to use the tool that produced it. If model access, computing budgets, and verification resources are concentrated in a few institutions, research opportunities may become more unequal. Public results, open tools, and equitable access to resources are different things.

Even if some of mathematicians' capabilities become more important, it does not follow that jobs, income, or bargaining power will increase. How the value of knowledge production is distributed also depends on funding, evaluation, and access to tools.

## What Evidence Will I Watch Next?

To judge the long-term significance of this release, I will focus on four kinds of progress:

1. **Independent verification.** Which conclusions gain recognition from domain experts, which are revised, and which remain disputed?
2. **Understanding and reuse.** Do clear independent explanations, simpler proofs, and new research using these ideas emerge?
3. **Transparency of the process.** Can outside researchers learn about problem selection, failed attempts, and actual costs, and obtain the means to reproduce related exploration?
4. **Allocation of credit.** Do people who correct errors, complete formalizations, fill gaps in citations, and organize understanding receive explicit academic recognition?

This evidence will tell us more than a manuscript count about how AI changes mathematical research.

The 722 manuscripts make a question concrete: as machines become better at finding arguments, how do we turn their outputs into knowledge that a community can understand, check, and build upon?

Mathematicians' work will change with their tools. A direction worth pursuing is to give researchers more time to ask important questions, create useful concepts, and turn reliable results into shared understanding. That requires technical progress as well as deliberate changes to the organization and evaluation of research.

---

### Sources and Verification Note

Facts checked on **October 8, 2026**. Repository contents and verification status may continue to change; the discussion of professional roles and institutions expresses the author's views.

- [OpenAI: Sharing AI progress in mathematics](https://openai.com/index/sharing-ai-progress-in-mathematics/), October 6, 2026.
- [OpenAI mathematics repository and release notes](https://github.com/openai/math): manuscript counts, the definition of result families, and verification status.
- [Lean formalization catalogue](https://github.com/openai/math/blob/main/lean/formalization.yaml): the mapping between formalized main results and their associated papers.
- [AGMAI: Responsible Release of AI-Generated Mathematics](https://agmai.org/general-sep29/), September 29, 2026.
