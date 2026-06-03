# .claude/skills/

Reusable capability bundles the agent can invoke (a `SKILL.md` + supporting assets), loaded
into the current context — distinct from agents (which are delegated workers with their own
context + tools).

```
.claude/skills/<skill-name>/
├── SKILL.md      # frontmatter: name + description (the description drives auto-triggering)
├── <assets>      # scripts, templates, data the skill uses
└── README.md
```

Write the `description` as "use this when the user asks to …" with concrete phrasings — it's
the trigger surface. Package repeatable domain procedures (a viral-hooks library, a media
pipeline, a doc/spreadsheet builder) here so they stay consistent and discoverable.
