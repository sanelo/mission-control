// Task CRUD operations
import { v } from "convex/values";
import { query, mutation, internalQuery, internalMutation } from "./_generated/server";

// Get all tasks with optional status filter
export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    )),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      return await ctx.db
        .query("tasks")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    }
    return await ctx.db.query("tasks").collect();
  },
});

// Get task by ID
export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    if (!task) return null;

    // Get comments
    const comments = await ctx.db
      .query("messages")
      .withIndex("by_task", (q) => q.eq("taskId", id))
      .collect();

    return { ...task, comments };
  },
});

// Create task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    status: v.optional(v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    )),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    assigneeIds: v.optional(v.array(v.id("agents"))),
  },
  handler: async (ctx, { title, description, status, priority, assigneeIds }) => {
    const now = new Date().toISOString();
    const taskId = await ctx.db.insert("tasks", {
      title,
      description,
      status: status || (assigneeIds && assigneeIds.length > 0 ? "assigned" : "inbox"),
      priority: priority || "medium",
      assigneeIds: assigneeIds || [],
      createdAt: now,
      updatedAt: now,
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "task_created",
      agentId: assigneeIds?.[0] ?? (await ctx.db.query("agents").first())?._id ?? "jarvis" as any,
      message: `Created task: ${title}`,
      timestamp: now,
    });

    return taskId;
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
    agentId: v.id("agents"),
  },
  handler: async (ctx, { id, status, agentId }) => {
    await ctx.db.patch(id, {
      status,
      updatedAt: new Date().toISOString(),
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "task_updated",
      agentId,
      message: `Task status changed to ${status}`,
      timestamp: new Date().toISOString(),
    });

    return await ctx.db.get(id);
  },
});

// Assign task to agents
export const assign = mutation({
  args: {
    id: v.id("tasks"),
    assigneeIds: v.array(v.id("agents")),
    agentId: v.id("agents"),
  },
  handler: async (ctx, { id, assigneeIds, agentId }) => {
    await ctx.db.patch(id, {
      assigneeIds,
      status: "assigned",
      updatedAt: new Date().toISOString(),
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "task_updated",
      agentId,
      message: `Task assigned to ${assigneeIds.length} agent(s)`,
      timestamp: new Date().toISOString(),
    });

    return await ctx.db.get(id);
  },
});

// Internal mutations for HTTP actions
export const createInternal = internalMutation({
  args: {
    title: v.string(),
    description: v.string(),
    assigneeIds: v.optional(v.array(v.id("agents"))),
  },
  handler: async (ctx, { title, description, assigneeIds }) => {
    const now = new Date().toISOString();
    const taskId = await ctx.db.insert("tasks", {
      title,
      description,
      status: assigneeIds && assigneeIds.length > 0 ? "assigned" : "inbox",
      assigneeIds: assigneeIds || [],
      createdAt: now,
      updatedAt: now,
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "task_created",
      agentId: assigneeIds?.[0] ?? (await ctx.db.query("agents").first())?._id ?? "jarvis" as any,
      message: `Created task: ${title}`,
      timestamp: now,
    });

    return taskId;
  },
});

export const updateStatusInternal = internalMutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
    agentId: v.id("agents"),
  },
  handler: async (ctx, { id, status, agentId }) => {
    await ctx.db.patch(id, {
      status,
      updatedAt: new Date().toISOString(),
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "task_updated",
      agentId,
      message: `Task status changed to ${status}`,
      timestamp: new Date().toISOString(),
    });

    return await ctx.db.get(id);
  },
});
