'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Agent } from '@/lib/types';
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  UserCog,
  type LucideIcon 
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
  agents: Agent[];
}

const activityIcons: Record<Activity['type'], LucideIcon> = {
  task_created: CheckCircle2,
  task_updated: AlertCircle,
  message_sent: MessageSquare,
  agent_status_changed: UserCog,
};

const activityColors: Record<Activity['type'], string> = {
  task_created: 'text-green-500',
  task_updated: 'text-amber-500',
  message_sent: 'text-blue-500',
  agent_status_changed: 'text-purple-500',
};

export function ActivityFeed({ activities, agents }: ActivityFeedProps) {
  const getAgent = (agentId: string) => agents.find((a) => a.id === agentId);

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3 pr-4">
        {activities.map((activity) => {
          const agent = getAgent(activity.agentId);
          const Icon = activityIcons[activity.type];
          
          return (
            <div key={activity.id} className="flex items-start gap-3 text-sm">
              <div className={`mt-0.5 ${activityColors[activity.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  {agent && (
                    <span className="font-medium">
                      {agent.emoji} {agent.name}
                    </span>
                  )}
                  {' '}
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
