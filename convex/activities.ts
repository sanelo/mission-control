// Activity operations
import { v } from "convex/values";
import { query } from "./_generated/server";

// Get recent activities
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    return await ctx.db
      .query("activities")
      .withIndex("by_timestamp", (q) => q)
      .order("desc")
      .take(limit);
  },
});

// Get activities by agent
export const listByAgent = query({
  args: {
    agentId: v.id("agents"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { agentId, limit = 20 }) => {
    return await ctx.db
      .query("activities")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .order("desc")
      .take(limit);
  },
});
