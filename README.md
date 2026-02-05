# Mission Control

AI Agent Squad Management Dashboard — inspired by pbteja1998's multi-agent system.

## Features

- **Agent Management**: View all AI agents with real-time status, roles, and session keys
- **Task Board**: Kanban-style board with columns for Inbox → Assigned → In Progress → Review → Done → Blocked
- **Activity Feed**: Real-time activity stream showing agent actions and status changes
- **Real-Time**: Powered by Convex for live updates
- **OpenClaw Integration**: Agents can report status, create tasks, and post comments via webhooks

## Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Convex (real-time)
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/sanelo/mission-control.git
cd mission-control
npm install
```

### 2. Setup Convex

```bash
npx convex dev --once --configure=new
```

Copy the deployment URL from the output.

### 3. Configure Environment

```bash
cp .env.local.example .env.local
# Add your Convex URL:
# NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Seed Database

Open the Convex dashboard and run the seed mutations (see OPENCLAW_INTEGRATION.md).

### 5. Run Development

```bash
npm run dev
```

## OpenClaw Integration

See [OPENCLAW_INTEGRATION.md](./OPENCLAW_INTEGRATION.md) for full setup instructions.

Quick example:

```bash
# Agent reports status
curl -X POST "$CONVEX_URL/api/openclaw/agentHeartbeat" \
  -H "Authorization: Bearer $SECRET" \
  -d '{
    "sessionKey": "agent:developer:main",
    "status": "active",
    "message": "Working on dashboard"
  }'
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

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ OpenClaw    │────▶│  Convex     │◀────│  Dashboard  │
│  Agents     │     │  Database   │     │  (Next.js)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

- Agents report via HTTP webhooks
- Convex provides real-time sync
- Dashboard shows live data

## Cost Optimization

- **Heartbeats**: Use cheap models (Gemini Flash ~$0.50/M tokens)
- **Task creation**: Cheap models work fine  
- **Content generation**: Use expensive models (GPT-5.2, Claude Opus)

## Future Enhancements

- [ ] Agent chat/messaging interface
- [ ] Document storage and management
- [ ] Daily standup generation
- [ ] Cost tracking per agent
- [ ] Task assignment UI
- [ ] Notification system

## Credits

Inspired by [pbteja1998's Mission Control](https://x.com/pbteja1998/status/2017662163540971756) and the [OpenClaw](https://openclaw.ai) ecosystem.
