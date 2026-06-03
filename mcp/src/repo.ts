/** Repo loader: reads the claude-token-efficient-setup operating-system files
 *  (agents, docs, operating law, templates) and exposes typed accessors. */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AGENT_GROUPS } from "./constants.js";

export interface AgentSummary {
  name: string;
  group: string;
  description: string;
}
export interface DocSummary {
  name: string;
  title: string;
}
export interface BundleFile {
  path: string;
  content: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Repo root = two levels up from dist/ (mcp/dist/index.js -> repo root), or $CSTACK_ROOT. */
export function getRoot(): string {
  const override = process.env.CSTACK_ROOT;
  if (override) return resolve(override);
  // dist/index.js -> mcp/ -> repo root
  return resolve(__dirname, "..", "..");
}

function readIfExists(abs: string): string | null {
  try {
    return existsSync(abs) ? readFileSync(abs, "utf8") : null;
  } catch {
    return null;
  }
}

/** Extract a field's value from YAML-ish frontmatter (handles `>` / `|` folded blocks). */
function frontmatter(md: string): Record<string, string> {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const body = m[1];
  const out: Record<string, string> = {};
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if (val === ">" || val === "|" || val === ">-" || val === "|-" || val === "") {
      // folded/literal block: gather subsequent more-indented lines
      const collected: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        if (/^\s+\S/.test(lines[j]) || lines[j].trim() === "") {
          collected.push(lines[j].trim());
          i = j;
        } else break;
      }
      val = collected.join(" ").trim();
    }
    out[key] = val;
  }
  return out;
}

function firstSentence(text: string, max = 240): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

const agentsDir = () => join(getRoot(), ".claude", "agents");
const docsDir = () => join(getRoot(), "docs");

export function listAgents(): AgentSummary[] {
  const dir = agentsDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const name = f.replace(/\.md$/, "");
      const fm = frontmatter(readFileSync(join(dir, f), "utf8"));
      return {
        name,
        group: AGENT_GROUPS[name] ?? "other",
        description: firstSentence(fm.description ?? ""),
      };
    })
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
}

export function getAgent(name: string): string | null {
  const safe = name.replace(/[^a-z0-9-]/gi, "").replace(/\.md$/, "");
  return readIfExists(join(agentsDir(), `${safe}.md`));
}

export function listDocs(): DocSummary[] {
  const dir = docsDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = readFileSync(join(dir, f), "utf8");
      const h1 = content.match(/^#\s+(.+)$/m);
      return { name: f.replace(/\.md$/, ""), title: h1 ? h1[1].trim() : f };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getDoc(name: string): string | null {
  const safe = name.replace(/[^a-z0-9_-]/gi, "").replace(/\.md$/i, "");
  // case-insensitive resolve against the docs dir
  const dir = docsDir();
  if (!existsSync(dir)) return null;
  const match = readdirSync(dir).find(
    (f) => f.toLowerCase() === `${safe.toLowerCase()}.md`,
  );
  return match ? readIfExists(join(dir, match)) : null;
}

export function getOperatingLaw(): string | null {
  return readIfExists(join(getRoot(), "AGENTS.md"));
}

/** Recursively collect files under a path (relative to root), skipping noise. */
function walk(absPath: string, root: string, acc: BundleFile[]): void {
  if (!existsSync(absPath)) return;
  const st = statSync(absPath);
  if (st.isDirectory()) {
    for (const entry of readdirSync(absPath)) {
      if (entry === "node_modules" || entry === "dist" || entry === ".git") continue;
      walk(join(absPath, entry), root, acc);
    }
  } else if (st.isFile()) {
    acc.push({ path: relative(root, absPath), content: readFileSync(absPath, "utf8") });
  }
}

export function getInstallBundle(paths: string[], manifestOnly: boolean): BundleFile[] {
  const root = getRoot();
  const acc: BundleFile[] = [];
  for (const p of paths) walk(join(root, p), root, acc);
  acc.sort((a, b) => a.path.localeCompare(b.path));
  return manifestOnly ? acc.map((f) => ({ path: f.path, content: "" })) : acc;
}

/** Search agents + docs for a query; returns matches with a snippet. */
export function search(query: string, limit: number): Array<{
  source: string;
  name: string;
  snippet: string;
}> {
  const q = query.toLowerCase();
  const results: Array<{ source: string; name: string; snippet: string }> = [];
  const scan = (source: string, name: string, content: string) => {
    const idx = content.toLowerCase().indexOf(q);
    if (idx === -1) return;
    const start = Math.max(0, idx - 80);
    const snippet =
      (start > 0 ? "…" : "") +
      content.slice(start, idx + q.length + 120).replace(/\s+/g, " ").trim() +
      "…";
    results.push({ source, name, snippet });
  };
  for (const a of listAgents()) {
    const c = getAgent(a.name);
    if (c) scan("agent", a.name, c);
  }
  for (const d of listDocs()) {
    const c = getDoc(d.name);
    if (c) scan("doc", d.name, c);
  }
  const law = getOperatingLaw();
  if (law) scan("law", "AGENTS.md", law);
  return results.slice(0, limit);
}
