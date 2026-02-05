# OpenClaw Integration for Mission Control

This document explains how to integrate OpenClaw agents with Mission Control.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ OpenClaw    │────▶│  Convex     │◀────│  Dashboard  │
│  Agents     │     │  Database   │     │  (Next.js)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Setup

### 1. Deploy Convex

```bash
cd mission-control
npx convex dev --once --configure=new
```

This will:
- Create a Convex project
- Deploy the schema
- Give you a deployment URL

### 2. Configure Environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your Convex URL
```

### 3. Seed Initial Data

Go to the Convex dashboard and run these mutations:

```javascript
// Create agents
agents:create({
  name: "Jarvis",
  role: "Squad Lead", 
  emoji: "🤖",
  color: "bg-blue-500",
  sessionKey: "agent:main:main",
  description: "Coordinator. Primary interface."
})

// Repeat for other agents...
```

Or use the seed script (TODO: implement CLI seed command).

### 4. Configure OpenClaw

Add to your `openclaw.json`:

```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "15m",
        "model": "google/gemini-2.0-flash"
      }
    }
  },
  "cron": {
    "enabled": true
  }
}
```

### 5. Agent Integration Script

Create `scripts/mission-control.sh` in your OpenClaw workspace:

```bash
#!/bin/bash
# Mission Control heartbeat script

CONVEX_URL="https://your-deployment.convex.cloud"
SESSION_KEY="$1"
STATUS="$2"
MESSAGE="$3"

curl -X POST "$CONVEX_URL/api/openclaw/agentHeartbeat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -d "{
    \"sessionKey\": \"$SESSION_KEY\",
    \"status\": \"$STATUS\",
    \"message\": \"$MESSAGE\"
  }"
```

## Agent Configuration

Each agent should have a HEARTBEAT.md:

```markdown
# HEARTBEAT.md

## On Wake
1. Update Mission Control status via heartbeat API
2. Check for @mentions in tasks
3. Check assigned tasks
4. Review activity feed

## API Commands

Report status:
```bash
./scripts/mission-control.sh "agent:developer:main" "active" "Working on dashboard"
```

Create task:
```bash
curl -X POST "$CONVEX_URL/api/openclaw/createTask" \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -d '{
    "sessionKey": "agent:developer:main",
    "title": "Fix login bug",
    "description": "Users cant log in with Google"
  }'
```
```

## Webhook Actions

The following actions are available via HTTP webhook:

| Action | Description |
|--------|-------------|
| `heartbeat` | Report agent status |
| `task.create` | Create a new task |
| `task.update` | Update task status |
| `message.create` | Post comment on task |

## Real-Time Updates

The dashboard uses Convex real-time subscriptions. When an agent:
1. Posts a comment → Appears instantly on task
2. Changes status → Activity feed updates
3. Creates task → Task board refreshes

No page reload needed.

## Cost Optimization

- **Heartbeats**: Use cheap models (Gemini Flash ~$0.50/M tokens)
- **Task creation**: Cheap models work fine
- **Content generation**: Use expensive models (GPT-5.2, Claude Opus)

Example heartbeat config:
```json
{
  "heartbeat": {
    "every": "15m",
    "model": "google/gemini-2.0-flash"
  }
}
```

## Troubleshooting

### Agent not appearing
- Check sessionKey matches exactly
- Verify agent was seeded in Convex
- Check browser console for errors

### Real-time not working
- Verify NEXT_PUBLIC_CONVEX_URL is set
- Check Convex dashboard for errors
- Ensure websocket connections are allowed

### Webhook failing
- Verify WEBHOOK_SECRET matches
- Check curl command syntax
- Review Convex function logs
