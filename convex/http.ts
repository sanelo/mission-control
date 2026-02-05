// HTTP actions for external integration (OpenClaw)
import { httpRouter } from "convex/server";
import { v } from "convex/values";

const http = httpRouter();

// Webhook endpoint for OpenClaw agents to report activity
http.route({
  path: "/webhook",
  method: "POST",
  handler: async (ctx, request) => {
    // Simple auth check - in production use proper API keys
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { sessionKey, action, payload } = body;

    switch (action) {
      case "heartbeat": {
        // Find agent by session key
        const agent = await ctx.db
          .query("agents")
          .withIndex("by_session_key", (q) => q.eq("sessionKey", sessionKey))
          .first();
        
        if (!agent) {
          return new Response(JSON.stringify({ error: "Agent not found" }), { 
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        await ctx.db.patch(agent._id, {
          lastHeartbeat: new Date().toISOString(),
        });

        return new Response(JSON.stringify({ success: true, agentId: agent._id }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "task.create": {
        const now = new Date().toISOString();
        const taskId = await ctx.db.insert("tasks", {
          title: payload.title,
          description: payload.description,
          status: payload.assigneeIds ? "assigned" : "inbox",
          assigneeIds: payload.assigneeIds || [],
          createdAt: now,
          updatedAt: now,
        });
        
        return new Response(JSON.stringify({ success: true, taskId }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "task.update": {
        await ctx.db.patch(payload.taskId, {
          status: payload.status,
          updatedAt: new Date().toISOString(),
        });
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "message.create": {
        const messageId = await ctx.db.insert("messages", {
          taskId: payload.taskId,
          fromAgentId: payload.agentId,
          content: payload.content,
          createdAt: new Date().toISOString(),
        });
        
        return new Response(JSON.stringify({ success: true, messageId }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  },
});

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: async () => {
    return new Response(JSON.stringify({ status: "ok", service: "mission-control" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});

export default http;
