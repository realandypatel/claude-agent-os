#!/usr/bin/env node
/**
 * cstack-mcp-server
 *
 * Serves the claude-token-efficient-setup operating system as MCP tools so any
 * MCP client can read the agent swarm, docs, and operating law — and pull the
 * whole setup into a project via an install bundle. Read-only; transport: stdio.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CHARACTER_LIMIT, BUNDLE_PATHS } from "./constants.js";
import {
  listAgents,
  getAgent,
  listDocs,
  getDoc,
  getOperatingLaw,
  getInstallBundle,
  search,
} from "./repo.js";

const READONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const server = new McpServer({ name: "cstack-mcp-server", version: "1.0.0" });

function ok(text: string, structuredContent?: Record<string, unknown>) {
  return structuredContent
    ? { content: [{ type: "text" as const, text }], structuredContent }
    : { content: [{ type: "text" as const, text }] };
}
function notFound(text: string) {
  return { content: [{ type: "text" as const, text }], isError: true };
}

// 1. list agents -------------------------------------------------------------
server.registerTool(
  "cstack_list_agents",
  {
    title: "List cstack agents",
    description:
      "List every agent in the operating system's swarm with its group and a one-line description. " +
      "Groups: engineering, research, debug, reviewer, meta, business, media. " +
      "Use to discover which agent owns a task before fetching its full brief with cstack_get_agent. " +
      "Returns JSON { count, agents: [{ name, group, description }] }.",
    inputSchema: {},
    annotations: READONLY,
  },
  async () => {
    const agents = listAgents();
    if (!agents.length) return notFound("No agents found. Is CSTACK_ROOT pointing at the repo?");
    const out = { count: agents.length, agents };
    const md = [
      `# Agents (${agents.length})`,
      "",
      ...agents.map((a) => `- **${a.name}** (${a.group}) — ${a.description}`),
    ].join("\n");
    return ok(md, out);
  },
);

// 2. get agent ---------------------------------------------------------------
server.registerTool(
  "cstack_get_agent",
  {
    title: "Get a cstack agent",
    description:
      "Return the full markdown definition of one agent (frontmatter + system prompt). " +
      "Args: name (kebab-case, e.g. 'security-agent' or 'investigate'). " +
      "Returns the agent file content; use cstack_list_agents first if unsure of the name.",
    inputSchema: {
      name: z
        .string()
        .min(2)
        .max(64)
        .describe("Agent name in kebab-case, e.g. 'backend-agent', 'investigate'"),
    },
    annotations: READONLY,
  },
  async ({ name }: { name: string }) => {
    const md = getAgent(name);
    if (!md) {
      const names = listAgents().map((a) => a.name).join(", ");
      return notFound(`Agent '${name}' not found. Available: ${names}`);
    }
    return ok(md, { name, content: md });
  },
);

// 3. list docs ---------------------------------------------------------------
server.registerTool(
  "cstack_list_docs",
  {
    title: "List cstack docs",
    description:
      "List the doctrine documents (FOUNDATION, ROLE-MODES, SECURITY, AI_STACK, BUSINESS-ENGINE, " +
      "WEBSITE, CHANGELOG) with their titles. Fetch one with cstack_get_doc. " +
      "Returns JSON { count, docs: [{ name, title }] }.",
    inputSchema: {},
    annotations: READONLY,
  },
  async () => {
    const docs = listDocs();
    if (!docs.length) return notFound("No docs found. Is CSTACK_ROOT pointing at the repo?");
    const md = [`# Docs (${docs.length})`, "", ...docs.map((d) => `- **${d.name}** — ${d.title}`)].join("\n");
    return ok(md, { count: docs.length, docs });
  },
);

// 4. get doc -----------------------------------------------------------------
server.registerTool(
  "cstack_get_doc",
  {
    title: "Get a cstack doc",
    description:
      "Return the full markdown of one doctrine document. Args: name (e.g. 'FOUNDATION', " +
      "'ROLE-MODES', 'SECURITY' — case-insensitive, with or without .md). " +
      "Use cstack_list_docs first if unsure of the name.",
    inputSchema: {
      name: z.string().min(2).max(64).describe("Doc name, e.g. 'FOUNDATION', 'SECURITY'"),
    },
    annotations: READONLY,
  },
  async ({ name }: { name: string }) => {
    const md = getDoc(name);
    if (!md) {
      const names = listDocs().map((d) => d.name).join(", ");
      return notFound(`Doc '${name}' not found. Available: ${names}`);
    }
    return ok(md, { name, content: md });
  },
);

// 5. operating law -----------------------------------------------------------
server.registerTool(
  "cstack_get_operating_law",
  {
    title: "Get the operating law (AGENTS.md)",
    description:
      "Return AGENTS.md — the operating law: iron laws, operating mode, action authority, " +
      "role modes, the sub-agent routing table, security/brand/responsive rules, deploy. " +
      "This is the file every session should read first. Returns markdown.",
    inputSchema: {},
    annotations: READONLY,
  },
  async () => {
    const md = getOperatingLaw();
    if (!md) return notFound("AGENTS.md not found. Is CSTACK_ROOT pointing at the repo?");
    return ok(md, { content: md });
  },
);

// 6. search ------------------------------------------------------------------
server.registerTool(
  "cstack_search",
  {
    title: "Search the operating system",
    description:
      "Full-text search across all agents, docs, and the operating law. Args: query (>=2 chars), " +
      "limit (1-50, default 10). Returns JSON { count, matches: [{ source, name, snippet }] } where " +
      "source is 'agent' | 'doc' | 'law'.",
    inputSchema: {
      query: z.string().min(2).max(200).describe("Text to search for (case-insensitive)"),
      limit: z.number().int().min(1).max(50).default(10).describe("Max matches to return"),
    },
    annotations: READONLY,
  },
  async ({ query, limit }: { query: string; limit: number }) => {
    const matches = search(query, limit);
    if (!matches.length) return ok(`No matches for '${query}'.`, { count: 0, matches: [] });
    const md = [
      `# Search: '${query}' (${matches.length})`,
      "",
      ...matches.map((m) => `- **${m.name}** (${m.source}) — ${m.snippet}`),
    ].join("\n");
    return ok(md, { count: matches.length, matches });
  },
);

// 7. install bundle ----------------------------------------------------------
server.registerTool(
  "cstack_get_install_bundle",
  {
    title: "Get the install bundle",
    description:
      "Return every file needed to install the operating system into a project — AGENTS.md, CLAUDE.md, " +
      ".claude/ (settings, hook, agents, commands, skills), docs/, templates/, setup.sh — as " +
      "{ path, content } pairs an agent can write into a target repo. " +
      "Args: manifest_only (default false) — when true, returns paths with empty content (a file list). " +
      "If the full bundle exceeds the character limit, it falls back to the manifest with a message.",
    inputSchema: {
      manifest_only: z
        .boolean()
        .default(false)
        .describe("Return only the file list (paths, empty content) instead of full contents"),
    },
    annotations: READONLY,
  },
  async ({ manifest_only }: { manifest_only: boolean }) => {
    let files = getInstallBundle(BUNDLE_PATHS, manifest_only);
    if (!files.length) return notFound("No bundle files found. Is CSTACK_ROOT pointing at the repo?");
    let payload: Record<string, unknown> = { count: files.length, files };
    let text = JSON.stringify(payload, null, 2);
    let truncated = false;
    if (!manifest_only && text.length > CHARACTER_LIMIT) {
      files = getInstallBundle(BUNDLE_PATHS, true);
      truncated = true;
      payload = {
        count: files.length,
        truncated: true,
        truncation_message:
          "Full bundle exceeded the character limit. Returned the manifest (paths only). " +
          "Fetch individual files with cstack_get_agent / cstack_get_doc / cstack_get_operating_law, " +
          "or run setup.sh / the git clone quickstart from the README.",
        files,
      };
      text = JSON.stringify(payload, null, 2);
    }
    return ok(text, { ...payload, manifest_only: manifest_only || truncated });
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("cstack-mcp-server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
