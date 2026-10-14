---
title: "REA: An OpenClaw-Scale Ambition for AI Reverse Engineering"
description: "From Electron IPC to native binaries, REA connects professional reverse engineering tools to AI agents through MCP. A look at its architecture, public case studies, and approach to evidence."
date: 2026-10-14 00:00:00 +0800
lang: en
permalink: /en/posts/2026/10/14/rea-agent-reverse-engineering/
search_id: rea-agent-reverse-engineering
alternate_url: /posts/2026/10/14/rea-agent-reverse-engineering/
tags: [ai, open-source, cli]
---

Now that AI can write software from a description, another question follows: can it understand an existing program without access to its source code?

[REA (Reverse Engineer Anything)](https://github.com/morluto/rea) is exploring that question. It exposes capabilities for analyzing native binaries, JavaScript, Electron applications, and runtime behavior to AI agents through MCP. A developer asks a question, the agent uses specialized tools to investigate, and its explanation can be connected to the evidence it collected.

Calling it a project with an “OpenClaw-scale ambition” expresses my expectations for this direction. OpenClaw drew attention to agents that execute tasks; REA brings professional software analysis into an agent's toolset. Their purposes differ, and community attention alone cannot establish technical maturity. The more interesting question is whether REA changes how developers understand software.

## From writing code to investigating software

With source code, we can search for functions, inspect call relationships, and run tests. With only an installation package, the same questions become harder: which module does a button activate? How does rich text reach the system clipboard? How does an old game's sound-positioning algorithm work?

The traditional workflow involves moving between decompilers, debuggers, browsers, and dynamic instrumentation tools. Developers need to know how to use those tools, decide what to investigate next, and judge which observations they can trust.

REA turns some of those operations into tools an agent can call. You can describe a concrete goal:

> Analyze this Electron application's search feature. Find its entry module, trace the call chain and IPC channels, explain how it works, and identify the supporting evidence and unresolved questions.

The agent then investigates that goal step by step. Model reasoning, engineering judgment, and validation are still necessary. REA connects specialized observation capabilities to the process. Recovering complete source code, establishing behavioral equivalence, and demonstrating that a reconstruction runs across platforms all require separate proof.

## MCP connects different analysis engines

REA uses TypeScript and Node.js and provides a CLI and an MCP service. Native analysis can connect to Ghidra, Hopper, or IDA; JavaScript static analysis does not require a native decompiler. The setup process also configures workflow instructions for the selected agent. [Official README](https://github.com/morluto/rea)

Its workflow can be described as follows:

```text
Developer asks a question
          ↓
AI agent plans an investigation
          ↓
REA CLI / MCP
          ↓
Static analysis, decompilation, runtime observation
          ↓
Results, evidence, and limitations
          ↓
Agent explains, investigates further, or writes a reconstruction
          ↓
Independent validation
```

The useful part is how the tools can work together. An investigation of an Electron application might start at a JavaScript entry point in the page, follow it through the preload layer and main process, and eventually reach a native extension. For a binary, the agent can locate functions and then inspect instructions, call relationships, and constants.

A unified interface reduces the cost of switching tools, but the underlying tools still differ. Successfully installing an MCP service establishes that its entry point is registered. Whether it can analyze a particular target depends on the platform, file format, external dependencies, and actual execution results.

## Broad coverage needs to be evaluated one capability at a time

REA's documentation covers several kinds of software. Support in each area should be understood in terms of the relevant tools and workflows:

| Target | Main areas of investigation |
| --- | --- |
| Native binaries | Functions, instructions, pseudocode, and call relationships |
| JavaScript / Electron | Modules, imports, IPC, and package structure |
| Websites | Pages, scripts, network requests, and runtime observation |
| Android | APK code and resources, plus device observation through ADB |
| .NET | Assembly metadata and structures such as CIL |
| Go / Rust | Static information such as compiler and dependency metadata |
| Firmware / WASM / network captures | Extraction and investigation through the corresponding parsers |

Recognizing Go or Rust metadata does not establish that a tool can recover an entire project's source code. Format support, structural extraction, semantic interpretation, and behavioral reconstruction are distinct levels of capability. [Official documentation](https://github.com/morluto/rea/tree/main/docs)

For engineering work, three scenarios interest me most: investigating poorly documented desktop applications, recovering deterministic algorithms in legacy systems, and performing authorized troubleshooting and security research. All three require information from the program itself, beyond its existing documentation.

## DX-Ball: turning a hypothesis into a testable algorithm

The official DX-Ball case study examines a sound-positioning function in an early Windows game. The question is specific: how does a horizontal screen coordinate become a position between the left and right audio channels?

The initial decompilation exposed only a conversion function. The agent continued by inspecting instructions, callers, and data constants to recover the calculation. The reconstruction project then compared its implementation against the original x86 function and checked the machine code using a fixed historical compiler toolchain.

The official report describes **3,205 behavioral comparisons** and a **63-byte compiled-code match** after reviewing relocations and constants. These are results for one specific function. They cannot be generalized to arbitrary software, and they do not mean the entire game has been reconstructed. [Official DX-Ball case study](https://rea.tools/showcase/dx-ball/)

The value of this example lies in its validation method. Decompiler output is a starting point for an investigation. When it omits an input or part of the calculation, instructions and callers provide additional evidence. After recovering an expression, tests still need to check type conversions, floating-point precision, and boundary conditions.

This process has three stages: observe the original program, develop an explanation, and validate it independently. REA helps the agent obtain observations; the reconstruction project supplies the implementation and tests. Together, they support a result that can be checked.

## Notion: tracing a user feature across process boundaries

Another official case study investigates the clipboard mechanism in Notion Desktop 7.6.1. It follows the path from a page interface through the preload layer and Electron IPC to the main process's system clipboard calls.

```text
Editor page
     ↓
Preload clipboard interface
     ↓
ipcRenderer.invoke
     ↓
notion:clipboard:write
     ↓
Main-process handler
     ↓
Electron system clipboard API
```

The case study also examines how identifiers embedded in HTML work with local structured data to preserve richer block content. Some validation uses extracted modules and independent tests; that does not establish end-to-end validation of the complete desktop UI. [Official Notion case study](https://rea.tools/showcase/notion/)

For developers, this kind of investigation is instructive. A user sees a single copy operation, while the implementation spans a page, process boundaries, and system interfaces. An agent can help connect those layers while keeping the investigation focused on a specific feature.

## Evidence: helping an agent track what it still does not know

The design I find most interesting in REA is its structured Evidence.

In reverse engineering, “not found” and “does not exist” mean very different things. A function with no observed callers might be unused, or its callers might have been missed because of function pointers, dynamic dispatch, or incomplete analysis coverage. If a model treats a partial observation as a complete fact, the rest of its explanation can follow the wrong path.

REA's protocol preserves evidence identifiers, normalized results, and underlying results. Relevant responses also express coverage, limitations, and unknowns. This allows investigation results to be saved, read selectively, and compared. [MCP contract documentation](https://github.com/morluto/rea/blob/main/docs/mcp-contracts.md)

These structures do not guarantee that a conclusion is correct. They do, however, make it possible to ask: which target produced this conclusion? Which tool was used? What did the observation cover? Which indirect calls remain unresolved?

The same idea applies to operations and scientific research. A specialized agent needs to manage its observations in a form that people can review. Reasoning and evidence management both contribute to a reliable investigation.

## Version 6.4.0: handling scale and interrupted analysis

Version 6.4.0, released on October 11, 2026, improves Android device observation, summaries and selective reading of large analysis results, and resource controls for JavaScript analysis. Preserving completed facts and explicit unknowns when an analysis runs out of resources helps later investigations continue. [6.4.0 release notes](https://github.com/morluto/rea/releases/tag/rea-agents-6.4.0)

These improvements address practical engineering needs. Results from a large application can exceed a model's context window, so an agent needs to inspect an overview before reading a small amount of relevant detail. Long analyses can also be interrupted by memory limits or timeouts; retaining partial results helps avoid repeating work.

My expectation is that specialized agent tooling will increasingly resemble an external investigation system: it will preserve complete results, give the model summaries and addressable details, and record failures and unfinished coverage.

## Why discuss REA alongside OpenClaw?

OpenClaw and REA serve different kinds of tasks. OpenClaw is often discussed in the context of general-purpose agents and application automation, while REA focuses on reverse engineering software. The comparison here concerns a shared direction: connecting language models to real work through tools.

REA also shows how a specialized tool platform can fit into an existing agent without providing an entire general-purpose chat product. MCP connects the tools, workflow instructions provide investigation methods, the model reasons about the results, and tests validate the implementation.

This division of work changes how professional knowledge can be used. Developers can delegate repetitive operations to an agent while retaining responsibility for deciding whether a question is worth investigating, whether the evidence is sufficient, and whether a result can support further engineering work.

## Start with a small question

The official setup entry point is:

```bash
npx rea-agents setup
```

The setup program presents configuration options and connects REA to the selected agent. Consult the [installation documentation](https://github.com/morluto/rea/blob/main/docs/installation.md) for runtime and external-tool requirements.

For a first investigation, I suggest choosing a small, testable question: identify an Electron IPC channel, for example, or recover a mathematical function with clear inputs and outputs. A task description might look like this:

```text
Use REA to investigate this application's clipboard write flow.
Find the page entry point, preload interface, and main-process handler.
Provide the corresponding location and evidence for each conclusion.
Distinguish static observations, actual runtime results, and unverified inferences.
Finally, propose an independent experiment to validate the call chain.
```

This kind of task is easier to evaluate than “reverse engineer the entire application.” Verifying that the tools can observe the target before expanding the scope helps identify problems in the environment or investigation method sooner.

## Software understanding will become an important agent capability

REA still faces the inherent difficulties of reverse engineering: missing symbols, compiler optimizations, obfuscation, indirect calls, and runtime differences. Its observation and organizational capabilities cannot replace all engineering validation. This article is based on official documentation and public case studies; I have not rerun complete reproduction experiments against the targets discussed above.

Within the boundaries of authorization, software licenses, and intellectual property, REA offers a direction worth exploring for software preservation, compatibility research, legacy-system migration, and debugging.

What interests me most is the workflow behind it: a developer asks a specific question; an agent gathers evidence, forms hypotheses, and investigates further; independent tests then determine whether the conclusion should be accepted. Combining software understanding with code generation can bring AI tools into more complete engineering workflows.

We have mostly asked AI to write code from requirements. REA shows how it can also help discover knowledge in existing programs. The reliability of that knowledge ultimately depends on traceable evidence and repeatable validation.

## References

- [REA repository and README](https://github.com/morluto/rea)
- [REA installation guide](https://github.com/morluto/rea/blob/main/docs/installation.md)
- [REA MCP contracts](https://github.com/morluto/rea/blob/main/docs/mcp-contracts.md)
- [REA CLI and Evidence guide](https://github.com/morluto/rea/blob/main/docs/cli.md)
- [DX-Ball reverse engineering case study](https://rea.tools/showcase/dx-ball/)
- [Notion clipboard case study](https://rea.tools/showcase/notion/)
- [REA 6.4.0 release notes](https://github.com/morluto/rea/releases/tag/rea-agents-6.4.0)

Sources checked on October 14, 2026. Project capabilities may change between versions; case-study figures come from the project's published experiments.
