'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, Clock, AlertCircle } from 'lucide-react';
import { Doc } from '../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Doc<"agents">;
  compact?: boolean;
}

const statusConfig = {
  idle: {
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: Clock,
    label: 'Idle',
  },
  active: {
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: Activity,
    label: 'Active',
  },
  blocked: {
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    borderColor: 'border-rose-200 dark:border-rose-800',
    icon: AlertCircle,
    label: 'Blocked',
  },
};

export function AgentCard({ agent, compact }: AgentCardProps) {
  const status = statusConfig[agent.status];
  const StatusIcon = status.icon;

  if (compact) {
    return (
      <div className={cn(
        "flex-shrink-0 flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer",
        "hover:shadow-sm hover:-translate-y-0.5",
        "bg-slate-900/50 border-slate-800 hover:border-cyan-500/30"
      )}>
        <div className="relative">
          <Avatar className={cn("h-8 w-8", agent.color)}>
            <AvatarFallback className="text-white text-sm">
              {agent.emoji}
            </AvatarFallback>
          </Avatar>
          <span className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-900",
            status.color
          )} />
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-xs text-slate-200 truncate">{agent.name}</h3>
          <p className="text-[10px] text-slate-500 truncate">{agent.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
      "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
      status.bgColor,
      status.borderColor
    )}>
      {/* Avatar with Status Ring */}
      <div className="relative">
        <Avatar className={cn("h-10 w-10 ring-2 ring-white dark:ring-slate-800", agent.color)}>
          <AvatarFallback className="text-white text-lg">
            {agent.emoji}
          </AvatarFallback>
        </Avatar>
        <span className={cn(
          "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-slate-800",
          status.color
        )}></span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate">{agent.name}</h3>
          <Badge 
            variant="outline" 
            className={cn(
              "text-[10px] px-1.5 py-0 h-4 border-0",
              status.bgColor,
              agent.status === 'active' && "text-emerald-700 dark:text-emerald-300",
              agent.status === 'idle' && "text-amber-700 dark:text-amber-300",
              agent.status === 'blocked' && "text-rose-700 dark:text-rose-300",
            )}
          >
            <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {agent.role}
        </p>
      </div>
    </div>
  );
}
