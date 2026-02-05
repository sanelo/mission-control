// HTTP actions for external integration (OpenClaw)
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Webhook endpoint for OpenClaw agents to report activity
http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
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
        const agent = await ctx.runQuery(internal.agents.getBySessionKey, { sessionKey });
        
        if (!agent) {
          return new Response(JSON.stringify({ error: "Agent not found" }), { 
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        // Update heartbeat
        await ctx.runMutation(internal.agents.updateStatus, { 
          id: agent._id,
          status: agent.status,
        });

        return new Response(JSON.stringify({ success: true, agentId: agent._id }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "task.create": {
        const taskId = await ctx.runMutation(internal.tasks.createInternal, {
          title: payload.title,
          description: payload.description,
          assigneeIds: payload.assigneeIds || [],
        });
        
        return new Response(JSON.stringify({ success: true, taskId }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "task.update": {
        await ctx.runMutation(internal.tasks.updateStatusInternal, {
          id: payload.taskId,
          status: payload.status,
          agentId: payload.agentId,
        });
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "message.create": {
        const messageId = await ctx.runMutation(internal.messages.createInternal, {
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
  }),
});

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: "ok", service: "mission-control" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
