# Mission Control

AI Agent Squad Management Dashboard — inspired by pbteja1998's multi-agent system.

## Features

- **Agent Management**: View all AI agents with their status, roles, and session keys
- **Task Board**: Kanban-style board with columns for Inbox → Assigned → In Progress → Review → Done → Blocked
- **Activity Feed**: Real-time activity stream showing agent actions and status changes
- **Cost Optimized**: Designed for use with cheap models for heartbeats, expensive models for creative work

## Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Agent Roles

| Agent | Role | Emoji | Description |
|-------|------|-------|-------------|
| Jarvis | Squad Lead | 🤖 | Coordinator, primary interface |
| Shuri | Product Analyst | 🔍 | Skeptical tester, finds edge cases |
| Fury | Customer Researcher | 📊 | Deep researcher, provides receipts |
| Vision | SEO Analyst | 👁️ | Keywords, search intent |
| Loki | Content Writer | ✍️ | Wordsmith, opinionated on style |
| Friday | Developer | ⚡ | Clean, tested, documented code |

## Architecture

This dashboard is the frontend for a multi-agent system where:
- Each agent runs as an isolated OpenClaw session
- Agents communicate via shared workspace files
- Heartbeat system wakes agents every 15-30 minutes
- Tasks flow through a kanban board

## Future Enhancements

- [ ] Convex database integration for real-time updates
- [ ] WebSocket connection to OpenClaw gateway
- [ ] Agent chat/messaging interface
- [ ] Document storage and management
- [ ] Daily standup generation
- [ ] Cost tracking per agent

## Credits

Inspired by [pbteja1998's Mission Control](https://x.com/pbteja1998/status/2017662163540971756) and the [OpenClaw](https://openclaw.ai) ecosystem.
