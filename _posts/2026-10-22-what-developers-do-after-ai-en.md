---
title: "Once AI Can Build a Feature, What Is Left for Developers to Do?"
description: "Lessons from taobook, tbnb, and BaoCut on requirements, verification, data preservation, and delivery as AI makes implementation faster."
date: 2026-10-22 16:00:00 +0800
lang: en
permalink: /en/posts/2026/10/22/what-developers-do-after-ai/
alternate_url: /posts/2026/10/22/what-developers-do-after-ai/
search_id: what-developers-do-after-ai
tags: [ai, cross-platform]
---

While building taobook, I ran into a problem that changed how I think about a feature being “done.”

To support DRM-free MOBI and AZW3 books, the app first converts them to EPUB and passes the result to its reading engine. The converter finished, a file appeared, and the book opened. The feature seemed complete.

Then I turned to later chapters and found that some of the content would not display correctly.

The problem was in the generated XHTML: parts of the content had been serialized incorrectly. Being able to read the opening chapters did not prove that the whole book was readable. Fixing the conversion logic and checking the documents throughout the book closed that gap.

It was a small incident, but it left me with a question: **once AI can help me write the converter, the reading interface, and the tests, what work remains for me as a developer?**

Across my projects, I find myself spending more time clarifying requirements, checking actual behavior, handling platform differences, protecting existing data, and deciding whether a result is ready to ship.

As code generation gets faster, this work becomes more visible.

## A feature request contains decisions we have not made yet

The easiest way to give AI a task is often to name a feature: add text-to-speech, add filters, support another file format.

These instructions are enough to start writing code. They rarely determine the full experience a user will receive.

Consider taobook’s playback toolbar. It shows playback status, and readers can tap to expand or collapse it. Each part sounds straightforward.

But as playback status keeps changing, what determines whether the toolbar stays visible?

If a reader has just collapsed it and the next playback update opens it again, the app may report no errors and every button may work. Yet the interface keeps interrupting the reading experience.

A rule needs to come first: later state updates should respect the reader’s deliberate actions. Playback changes can update icons and labels, but should not casually override the reader’s control over the toolbar’s visibility.

Once that rule is clear, AI has a more precise implementation target, and tests have a concrete behavior to check.

I increasingly find that these decisions, absent from the feature’s name, are where my attention is needed.

What does canceling mean? What survives a failure? Where should a page resume when the user returns? Will a new flag change the existing unread state?

If we leave these questions unanswered, the implementation will still make choices for us. Sometimes they match our expectations; sometimes they merely happen to run.

Developers need to uncover those implicit choices and make them explicit in the product’s behavior.

## Verification needs to follow the user further

The ebook conversion problem gave me a habit: whenever I see “success,” I ask what it actually proves.

A successful conversion shows that the conversion process finished. Opening the file shows that the reader can recognize it. A working first chapter shows that this chapter renders. To establish whether the whole book is readable, I still need to check later chapters, the table of contents, and the document structure.

The same distinction matters in tbnb.

tbnb is a travel app I continue to develop. Automated checks passing, the app compiling, signing completing, installation on an iPhone, and a sequence of actions working on the phone each answer different questions.

During one device check, I opened the accommodation search page, opened the filters, then canceled and returned. That established that this particular path worked at that time. It did not cover submitting a booking, and it could not establish that the entire booking flow was complete.

This wording may sound restrained, but it helps the next round of development: I know how far the checks reached and what still needs attention.

If partial success becomes “everything works,” the missing checks can easily disappear from the task list.

I now prefer to organize acceptance checks around the user’s path: where it starts, which choices the user makes, how the interface changes, whether data is written, where canceling leads, and how to continue after a failure.

**Verification needs to extend beyond an individual method in the code to a sequence a user actually follows.**

AI can help run checks, analyze results, and add tests. Developers still need to judge what the evidence covers and which conclusions remain premature.

[![Requirements define behavior, implementation produces changes, verification gathers evidence, and delivery states support and limits. Failed verification returns to implementation.]({{ '/assets/images/developer-workflow-en.svg' | relative_url }})]({{ '/assets/images/developer-workflow-en.svg' | relative_url }})

*A practical workflow distilled from these projects. Click to enlarge; the dashed path returns failed verification to implementation.*

## The easier features are to add, the more direction matters

One immediate effect of AI is that adding features takes less effort.

A new entry point can appear quickly. Seeing a capability in another product makes it tempting to add something similar.

But another page usually brings another set of states, another data relationship, and more behavior to maintain.

Working on tbnb taught me that comparisons with established products need a clear question too. When I see a different interface, I first need to determine whether an existing capability lacks an entry point, the client has not been connected to an API, or the underlying business rules do not exist yet.

Those three situations require very different amounts of work.

Copying screens can produce a similar appearance before questions about inventory, pricing, permissions, and duplicate submissions emerge. The interface is already there, while the rules underneath remain undecided.

Developing taobook across platforms has involved similar choices.

iOS, Android, and HarmonyOS each have their own conditions for file handling, rendering, speech services, and app lifecycles. Wanting people to read comfortably on different devices does not mean every platform must immediately offer the same feature list.

Prioritizing local imports, reading progress, and listening on one platform is a concrete product decision. It also means leaving some capabilities outside the current scope.

As implementation gets faster, I need to ask more often: does this capability serve the original goal? Is it worth adding now? Can I take on the maintenance that follows?

## Once software holds data, every change inherits a history

Early in a project, reinstalling the app, clearing a database, and starting again can feel easy.

Those actions mean something different once the app contains reading progress, favorites, conversations, and records of daily use.

As tbnb evolves, I pay more attention to what happens after a new version starts: is the old data still there, does it belong to the right identity, and can the user continue what they were doing?

Rolling code back does not automatically undo database changes. Identities, sessions, and business data already written have states of their own.

That is why I began requiring separate records for backups, migration checks, and data comparisons after installation.

A backup before installation preserves a possible recovery path. Launching successfully afterward does not establish that every category of data survived intact. Data that needs to be read back and compared still needs that actual check.

If a device connection drops before a check finishes, the check should remain marked incomplete.

For software people keep using, being able to continue after an update is an important product capability in its own right. It belongs in the development plan and needs real verification time.

## Shipping also means saying who can use it, and how far

This became particularly concrete while I was working on Intel Mac support for BaoCut.

BaoCut organizes AI video processing around an editable timeline. The version I maintain is a fork of the upstream project; Intel Mac adaptation is one part of that work.

After the source compiles, native components, packaging, signing, notarization, and installation still need attention. Only then can users begin to open it on their own computers.

Hardware and model backends introduce further differences. The upstream capability list cannot simply become the Intel version’s list of available features. Some platform-dependent capabilities need to be disabled, and some paths need separate validation.

Release notes therefore need to explain the supported operating system and architecture, external dependencies, functional limits, and the scope of checks actually performed.

Successful packaging and notarization support those specific delivery claims. Real model inference, a complete editing workflow, and export still require verification if they have not been exercised.

This work does not make the feature list longer, but it affects whether other people can use the software appropriately and understand the problems they encounter.

BaoCut also has a design direction I appreciate: AI changes remain in an editable project, where a person can inspect, adjust, and take over the work.

That shapes what I want from AI-assisted development too. I want clear change records, verification results, and unfinished items, so the next round of work has something reliable to build on.

## Turn repeated reminders into rules the project can execute

When I first used AI for long development sessions, many requirements depended on reminders in the conversation.

Check the physical device. Leave everyday data alone. Cover the relevant modules with tests. Explain what has not been verified.

I could repeat these requests many times, but as conversations grew longer, repeating them became a burden of its own.

In tbnb, I began moving these requirements into development documentation, flow checklists, check scripts, and change templates. Common checks gained a shared entry point, and each change could leave a record of its goal, scope, results, and unverified items.

People and AI could then continue from concrete records without retelling the whole project each time.

The cost of these rules matters too. A small wording change does not need the same acceptance process as a database migration. Changes involving identity, data, or release need stronger evidence.

The development approach I want is one where recurring work can be repeated reliably and important judgments have a clear basis.

AI can handle much of the execution. Developers need to keep adjusting the rules in response to actual problems.

## I still need to decide what “done” means

These projects have made me more comfortable treating AI as a collaborator that can participate deeply in development.

It can write code, analyze problems, add tests, organize documentation, and help with builds and device operations. Much work that once demanded a long investment now has a faster starting point.

At the same time, my definition of “done” has become more concrete.

After taobook imports a book, I still need to know whether later chapters are readable. After a tbnb page opens, I still need to know whether cancellation, recovery, and data persistence behave as intended. After BaoCut produces an installation package, I still need to explain which machines it supports and which workflows remain unverified.

These judgments ultimately return to actual use.

Code performs a particular behavior, while the files, devices, habits, and existing data users bring will always exceed what fits into a single instruction.

So once AI can build a feature, I still have plenty to do: choose problems worth solving, turn vague requirements into explicit behavior, gather enough evidence, and bring the result into everyday use.

I want the software I ship to pass this test: users install it, complete what they need to do with their own data, and return the next day able to carry on.

### Related posts

- [Building taobook: It Started with a Book](/en/posts/2026/09/29/taobook-development/)
- [BaoCut: Keeping AI Video Editing on an Editable Timeline](/en/posts/2026/10/20/baocut-editable-ai-video/)
