/** Shared constants for the cstack MCP server. */

// Maximum response size in characters before truncation.
export const CHARACTER_LIMIT = 25000;

// Classifies each agent (by kebab name) into a swarm group, for list output.
export const AGENT_GROUPS: Record<string, string> = {
  // Engineering — build
  "backend-agent": "engineering",
  "ui-agent": "engineering",
  "unit-test-agent": "engineering",
  "architect-agent": "engineering",
  "refactor-agent": "engineering",
  "performance-agent": "engineering",
  "devops-agent": "engineering",
  // Research
  "api-finder": "research",
  // Debug
  "investigate": "debug",
  // Reviewers (gates)
  "security-agent": "reviewer",
  "code-review-agent": "reviewer",
  "qa-agent": "reviewer",
  "build-agent": "reviewer",
  // Meta
  "pm-agent": "meta",
  "memory-agent": "meta",
  "website-keeper": "meta",
  // Business engine
  "marketing-agent": "business",
  "sales-agent": "business",
  "sales-followup-agent": "business",
  "legal-agent": "business",
  // Media
  "video-planner": "media",
  "video-producer": "media",
  "video-quality-auditor": "media",
};

// Files included in the install bundle, relative to the repo root.
// Directories are expanded recursively by the loader.
export const BUNDLE_PATHS: string[] = [
  "AGENTS.md",
  "CLAUDE.md",
  ".gitignore",
  ".claude/settings.json",
  ".claude/hooks/check-destructive.sh",
  ".claude/agents",
  ".claude/commands",
  ".claude/skills",
  "docs",
  "templates",
  "setup.sh",
];
