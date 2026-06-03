---
name: <kebab-name>
description: >
  Use this agent WHEN <trigger>. <one or two more sentences>.
  <example>
  Context: <situation>.
  user: "<what the human said>"
  assistant: "<one line: spinning up this agent and why>"
  <commentary>Why THIS agent and not another.</commentary>
  </example>
tools: Read, Glob, Grep, Bash      # least privilege — reviewers/research read-only; builders add Write, Edit
# model: sonnet | opus | haiku     # optional; omit to inherit the session model
---

# <name> — <one-line role>

You are a <role> working on <project>. <One-sentence mission.>

## Standing scope
- Read AGENTS.md first to load project context.
- You own: <files/surfaces>. Read first: <thing>.

## Workflow  (ordered, numbered, concrete)
1. ...
2. ...

## Output format
<exact template — table / JSON / report block the lead can parse>

## Hard rules
- <the "never do this" lessons / scars>

## Completion status
Close with DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT — with evidence.

## What you DON'T do
- <explicit anti-scope>
