// Message operations
import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

// Get messages for a task
export const listByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_task", (q) => q.eq("taskId", taskId))
      .order("asc")
      .collect();
  },
});

// Create message (public)
export const create = mutation({
  args: {
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
  },
  handler: async (ctx, { taskId, fromAgentId, content }) => {
    const messageId = await ctx.db.insert("messages", {
      taskId,
      fromAgentId,
      content,
      createdAt: new Date().toISOString(),
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "message_sent",
      agentId: fromAgentId,
      message: `Commented on task`,
      timestamp: new Date().toISOString(),
    });

    // Update task
    await ctx.db.patch(taskId, {
      updatedAt: new Date().toISOString(),
    });

    return messageId;
  },
});

// Create message (internal for HTTP actions)
export const createInternal = internalMutation({
  args: {
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
  },
  handler: async (ctx, { taskId, fromAgentId, content }) => {
    const messageId = await ctx.db.insert("messages", {
      taskId,
      fromAgentId,
      content,
      createdAt: new Date().toISOString(),
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "message_sent",
      agentId: fromAgentId,
      message: `Commented on task`,
      timestamp: new Date().toISOString(),
    });

    // Update task
    await ctx.db.patch(taskId, {
      updatedAt: new Date().toISOString(),
    });

    return messageId;
  },
});
