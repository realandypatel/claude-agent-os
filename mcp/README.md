# cstack-mcp-server

An MCP server that serves the **claude-agent-os** operating system — the agent
swarm, doctrine docs, the operating law, and a one-shot install bundle — as MCP tools. Point
any MCP client at it and your AI can read the whole setup, or pull it into a project, without
copying files by hand.

It reads the repo it lives in (the parent of this `mcp/` folder), so it's always in sync with
your agents and docs. Read-only. Transport: stdio.

## Tools

| Tool | What it returns |
|---|---|
| `cstack_list_agents` | Every agent with group + one-line description |
| `cstack_get_agent` | Full markdown of one agent (`name`) |
| `cstack_list_docs` | Doctrine docs with titles |
| `cstack_get_doc` | Full markdown of one doc (`name`) |
| `cstack_get_operating_law` | `AGENTS.md` — the operating law |
| `cstack_search` | Full-text search across agents + docs + law (`query`, `limit`) |
| `cstack_get_install_bundle` | All install files as `{ path, content }` (`manifest_only`) |

All tools are read-only (`readOnlyHint: true`).

## Build & run

```bash
cd mcp
npm install
npm run build
node dist/index.js     # speaks MCP over stdio
```

By default the server resolves the repo root as the parent of `mcp/`. Override with
`CSTACK_ROOT=/path/to/claude-agent-os`.

## Connect it (Claude Code / Cowork)

Add to your MCP client config (e.g. `.mcp.json` or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "cstack": {
      "command": "node",
      "args": ["/absolute/path/to/claude-agent-os/mcp/dist/index.js"],
      "env": { "CSTACK_ROOT": "/absolute/path/to/claude-agent-os" }
    }
  }
}
```

Then ask: *"list cstack agents"*, *"get the security-agent"*, *"give me the install bundle"*.

## Test with the MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

See `evaluation.xml` for read-only evaluation questions covering the tools.
