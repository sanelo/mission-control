'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Doc } from '../../convex/_generated/dataModel';

interface TaskBoardProps {
  tasks: Doc<"tasks">[];
}

const TASK_STATUS_LABELS = {
  inbox: 'Inbox',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
  blocked: 'Blocked',
};

const TASK_STATUS_COLORS = {
  inbox: 'bg-gray-100 text-gray-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
  review: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
};

const columns = ['inbox', 'assigned', 'in_progress', 'review', 'done', 'blocked'] as const;

export function TaskBoard({ tasks }: TaskBoardProps) {
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<typeof columns[number], Doc<"tasks">[]>);

  return (
    <div className="grid grid-cols-6 gap-3 h-full">
      {columns.map((status) => (
        <div key={status} className="flex flex-col min-w-[180px]">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-medium">{TASK_STATUS_LABELS[status]}</h3>
            <Badge variant="secondary" className="text-xs">
              {tasksByStatus[status].length}
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-3">
              {tasksByStatus[status].map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: Doc<"tasks"> }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-3">
        <h4 className="text-sm font-medium mb-2 line-clamp-2">{task.title}</h4>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={`text-[10px] ${TASK_STATUS_COLORS[task.status]}`}
          >
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
          {task.assigneeIds.length > 0 && (
            <div className="flex -space-x-1">
              {task.assigneeIds.map((agentId) => (
                <div
                  key={agentId}
                  className="h-5 w-5 rounded-full bg-primary text-[8px] flex items-center justify-center text-primary-foreground border-2 border-background"
                >
                  {agentId.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
