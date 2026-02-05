'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Doc } from '../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  UserCog,
  Plus,
  Edit3,
  type LucideIcon 
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Doc<"activities">[];
  agents: Doc<"agents">[];
}

const activityConfig: Record<Doc<"activities">["type"], {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}> = {
  task_created: {
    icon: Plus,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  task_updated: {
    icon: Edit3,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
  },
  message_sent: {
    icon: MessageSquare,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  agent_status_changed: {
    icon: UserCog,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
  },
};

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function groupActivitiesByTime(activities: Doc<"activities">[]) {
  const groups: { label: string; activities: Doc<"activities">[] }[] = [];
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  const todayActivities = activities.filter(a => new Date(a.timestamp).toDateString() === today);
  const yesterdayActivities = activities.filter(a => new Date(a.timestamp).toDateString() === yesterday);
  const earlierActivities = activities.filter(a => {
    const d = new Date(a.timestamp).toDateString();
    return d !== today && d !== yesterday;
  });
  
  if (todayActivities.length > 0) {
    groups.push({ label: 'Today', activities: todayActivities });
  }
  if (yesterdayActivities.length > 0) {
    groups.push({ label: 'Yesterday', activities: yesterdayActivities });
  }
  if (earlierActivities.length > 0) {
    groups.push({ label: 'Earlier', activities: earlierActivities });
  }
  
  return groups;
}

export function ActivityFeed({ activities, agents }: ActivityFeedProps) {
  const getAgent = (agentId: string) => agents.find((a) => a._id === agentId);
  const groups = groupActivitiesByTime(activities);

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4 pr-3">
        {groups.map((group) => (
          <div key={group.label}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-1">
              {group.label}
            </h4>
            <div className="space-y-3">
              {group.activities.map((activity) => {
                const agent = getAgent(activity.agentId);
                const config = activityConfig[activity.type];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={activity._id} 
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl transition-colors",
                      "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      config.bgColor
                    )}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        {agent && (
                          <span className="font-semibold">
                            {agent.emoji} {agent.name}
                          </span>
                        )}
                        {' '}
                        <span className="text-muted-foreground">{activity.message}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
