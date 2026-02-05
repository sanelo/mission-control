// Seed script for Convex database
// Run with: npx tsx convex/seed.ts

import { api } from "./_generated/api";
import { useConvex, useMutation } from "convex/react";

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

// This would be run as a one-time setup script
// For now, we'll create a Convex mutation that can be called
