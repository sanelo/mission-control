// Convex schema for Mission Control
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    status: v.union(v.literal("idle"), v.literal("active"), v.literal("blocked")),
    emoji: v.string(),
    color: v.string(),
    currentTaskId: v.optional(v.id("tasks")),
    sessionKey: v.string(),
    lastHeartbeat: v.string(),
    description: v.string(),
  })
    .index("by_session_key", ["sessionKey"])
    .index("by_status", ["status"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    assigneeIds: v.array(v.id("agents")),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_assignee", ["assigneeIds"]),

  messages: defineTable({
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
    createdAt: v.string(),
  })
    .index("by_task", ["taskId"])
    .index("by_agent", ["fromAgentId"]),

  activities: defineTable({
    type: v.union(
      v.literal("task_created"),
      v.literal("task_updated"),
      v.literal("message_sent"),
      v.literal("agent_status_changed")
    ),
    agentId: v.id("agents"),
    message: v.string(),
    timestamp: v.string(),
  })
    .index("by_agent", ["agentId"])
    .index("by_timestamp", ["timestamp"]),

  documents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("deliverable"),
      v.literal("research"),
      v.literal("protocol")
    ),
    taskId: v.optional(v.id("tasks")),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_task", ["taskId"])
    .index("by_type", ["type"]),

  notifications: defineTable({
    mentionedAgentId: v.id("agents"),
    content: v.string(),
    delivered: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_agent", ["mentionedAgentId"])
    .index("by_delivered", ["delivered"]),
});
