// Agent CRUD operations
import { v } from "convex/values";
import { query, mutation, internalQuery, internalMutation } from "./_generated/server";

// Get all agents
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

// Get agent by ID
export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Get agent by session key (internal)
export const getBySessionKey = internalQuery({
  args: { sessionKey: v.string() },
  handler: async (ctx, { sessionKey }) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_session_key", (q) => q.eq("sessionKey", sessionKey))
      .first();
  },
});

// Create agent
export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    color: v.string(),
    sessionKey: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      ...args,
      status: "idle",
      lastHeartbeat: new Date().toISOString(),
    });
  },
});

// Update agent status
export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(v.literal("idle"), v.literal("active"), v.literal("blocked")),
    currentTaskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, { id, status, currentTaskId }) => {
    await ctx.db.patch(id, {
      status,
      currentTaskId,
      lastHeartbeat: new Date().toISOString(),
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "agent_status_changed",
      agentId: id,
      message: `Status changed to ${status}`,
      timestamp: new Date().toISOString(),
    });

    return await ctx.db.get(id);
  },
});

// Update agent heartbeat
export const heartbeat = mutation({
  args: {
    sessionKey: v.string(),
  },
  handler: async (ctx, { sessionKey }) => {
    const agent = await ctx.db
      .query("agents")
      .withIndex("by_session_key", (q) => q.eq("sessionKey", sessionKey))
      .first();

    if (!agent) {
      throw new Error(`Agent not found: ${sessionKey}`);
    }

    await ctx.db.patch(agent._id, {
      lastHeartbeat: new Date().toISOString(),
    });

    return agent._id;
  },
});
