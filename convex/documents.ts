// Document operations
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all documents
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

// Get documents by task
export const listByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_task", (q) => q.eq("taskId", taskId))
      .collect();
  },
});

// Get document by ID
export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Create document
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("deliverable"), v.literal("research"), v.literal("protocol")),
    taskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, { title, content, type, taskId }) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("documents", {
      title,
      content,
      type,
      taskId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update document
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { id, title, content }) => {
    const updates: Record<string, string> = {
      updatedAt: new Date().toISOString(),
    };
    if (title) updates.title = title;
    if (content) updates.content = content;

    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});
