'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Agent, AGENT_STATUS_COLORS } from '@/lib/types';
import { Activity, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const statusIcon = {
    idle: <Clock className="h-3 w-3" />,
    active: <Activity className="h-3 w-3" />,
    blocked: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className={`h-10 w-10 ${agent.color}`}>
              <AvatarFallback className="text-white text-lg">
                {agent.emoji}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{agent.name}</h3>
              <p className="text-xs text-muted-foreground">{agent.role}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${AGENT_STATUS_COLORS[agent.status]} flex items-center gap-1`}
          >
            {statusIcon[agent.status]}
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {agent.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono text-[10px] truncate max-w-[120px]">
            {agent.sessionKey}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {new Date(agent.lastHeartbeat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
