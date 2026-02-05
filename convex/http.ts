// HTTP actions for external integration (OpenClaw)
import { v } from "convex/values";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// Webhook endpoint for OpenClaw agents to report activity
export const webhook = httpAction({
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
        // Update agent heartbeat
        const agent = await ctx.runMutation(api.agents.heartbeat, { sessionKey });
        return new Response(JSON.stringify({ success: true, agent }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "task.create": {
        const taskId = await ctx.runMutation(api.tasks.create, {
          title: payload.title,
          description: payload.description,
          assigneeIds: payload.assigneeIds,
        });
        return new Response(JSON.stringify({ success: true, taskId }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "task.update": {
        const task = await ctx.runMutation(api.tasks.updateStatus, {
          id: payload.taskId,
          status: payload.status,
          agentId: payload.agentId,
        });
        return new Response(JSON.stringify({ success: true, task }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "message.create": {
        const messageId = await ctx.runMutation(api.messages.create, {
          taskId: payload.taskId,
          fromAgentId: payload.agentId,
          content: payload.content,
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
export const health = httpAction({
  handler: async () => {
    return new Response(JSON.stringify({ status: "ok", service: "mission-control" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
