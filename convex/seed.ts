// Seed script for Convex database
// Run with: npx convex run seed:run

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

const INITIAL_AGENTS = [
  {
    name: 'Jarvis',
    role: 'Squad Lead',
    emoji: '🤖',
    color: 'bg-blue-500',
    sessionKey: 'agent:main:main',
    description: 'Coordinator. Handles direct requests, delegates, monitors progress. Primary interface.',
  },
  {
    name: 'Shuri',
    role: 'Product Analyst',
    emoji: '🔍',
    color: 'bg-purple-500',
    sessionKey: 'agent:product-analyst:main',
    description: 'Skeptical tester. Finds edge cases and UX issues. Tests competitors.',
  },
  {
    name: 'Fury',
    role: 'Customer Researcher',
    emoji: '📊',
    color: 'bg-red-500',
    sessionKey: 'agent:customer-researcher:main',
    description: 'Deep researcher. Every claim comes with receipts. Reads G2 reviews for fun.',
  },
  {
    name: 'Vision',
    role: 'SEO Analyst',
    emoji: '👁️',
    color: 'bg-indigo-500',
    sessionKey: 'agent:seo-analyst:main',
    description: 'Thinks in keywords and search intent. Makes sure content can rank.',
  },
  {
    name: 'Loki',
    role: 'Content Writer',
    emoji: '✍️',
    color: 'bg-green-500',
    sessionKey: 'agent:content-writer:main',
    description: 'Words are his craft. Pro-Oxford comma. Anti-passive voice.',
  },
  {
    name: 'Friday',
    role: 'Developer',
    emoji: '⚡',
    color: 'bg-cyan-500',
    sessionKey: 'agent:developer:main',
    description: 'Code is poetry. Clean, tested, documented.',
  },
];

const INITIAL_TASKS = [
  {
    title: 'Set up Mission Control Dashboard',
    description: 'Create the initial dashboard with agent cards and task board',
  },
  {
    title: 'Research competitor pricing',
    description: 'Gather intel on competitor pricing strategies for architop.agency',
  },
  {
    title: 'Write landing page copy',
    description: 'Draft compelling copy for architop.agency landing page',
  },
];

// Internal mutation to seed the database
export const run = internalMutation({
  handler: async (ctx) => {
    const results = {
      agents: { created: 0, skipped: 0 },
      tasks: { created: 0, skipped: 0 },
    };

    // Seed agents (idempotent - check by sessionKey)
    for (const agentData of INITIAL_AGENTS) {
      const existing = await ctx.db
        .query("agents")
        .withIndex("by_session_key", (q) =>
          q.eq("sessionKey", agentData.sessionKey)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("agents", {
          ...agentData,
          status: agentData.name === 'Jarvis' ? 'active' : 'idle',
          lastHeartbeat: new Date().toISOString(),
        });
        results.agents.created++;
        console.log(`Created agent: ${agentData.name}`);
      } else {
        results.agents.skipped++;
        console.log(`Skipped agent (exists): ${agentData.name}`);
      }
    }

    // Seed tasks (idempotent - check by title)
    for (const taskData of INITIAL_TASKS) {
      const existing = await ctx.db
        .query("tasks")
        .filter((q) => q.eq(q.field("title"), taskData.title))
        .first();

      if (!existing) {
        const now = new Date().toISOString();
        await ctx.db.insert("tasks", {
          ...taskData,
          status: 'inbox',
          assigneeIds: [],
          createdAt: now,
          updatedAt: now,
        });
        results.tasks.created++;
        console.log(`Created task: ${taskData.title}`);
      } else {
        results.tasks.skipped++;
        console.log(`Skipped task (exists): ${taskData.title}`);
      }
    }

    return results;
  },
});
