// OpenClaw Integration Module
// This provides functions for OpenClaw agents to interact with Mission Control

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

// Action to handle agent heartbeat and sync status
export const agentHeartbeat = action({
  args: {
    sessionKey: v.string(),
    status: v.union(v.literal("idle"), v.literal("active"), v.literal("blocked")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { sessionKey, status, message }) => {
    // Find or create agent
    let agent = await ctx.runQuery(api.agents.getBySessionKey, { sessionKey });
    
    if (!agent) {
      // Auto-create agent if it doesn't exist
      const agentId = await ctx.runMutation(api.agents.create, {
        name: sessionKey.split(":")[1] || "Unknown",
        role: "Agent",
        emoji: "🤖",
        color: "bg-gray-500",
        sessionKey,
        description: "Auto-created agent",
      });
      agent = await ctx.runQuery(api.agents.get, { id: agentId });
    }

    if (!agent) {
      throw new Error(`Failed to create/find agent: ${sessionKey}`);
    }

    // Update agent status
    await ctx.runMutation(api.agents.updateStatus, {
      id: agent._id,
      status,
    });

    // If message provided, create activity
    if (message) {
      await ctx.runMutation(api.internal.activities.create, {
        type: "agent_status_changed",
        agentId: agent._id,
        message,
      });
    }

    return { success: true, agentId: agent._id };
  },
});

// Action to create a task from an agent
export const createTask = action({
  args: {
    sessionKey: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { sessionKey, title, description }) => {
    const agent = await ctx.runQuery(api.agents.getBySessionKey, { sessionKey });
    
    if (!agent) {
      throw new Error(`Agent not found: ${sessionKey}`);
    }

    const taskId = await ctx.runMutation(api.tasks.create, {
      title,
      description,
      assigneeIds: [],
    });

    return { success: true, taskId };
  },
});

// Action to post a message/comment
export const postMessage = action({
  args: {
    sessionKey: v.string(),
    taskId: v.id("tasks"),
    content: v.string(),
  },
  handler: async (ctx, { sessionKey, taskId, content }) => {
    const agent = await ctx.runQuery(api.agents.getBySessionKey, { sessionKey });
    
    if (!agent) {
      throw new Error(`Agent not found: ${sessionKey}`);
    }

    const messageId = await ctx.runMutation(api.messages.create, {
      taskId,
      fromAgentId: agent._id,
      content,
    });

    return { success: true, messageId };
  },
});
