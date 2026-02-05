'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task, TaskStatus, TASK_STATUS_COLORS, TASK_STATUS_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskBoardProps {
  tasks: Task[];
}

const columns: TaskStatus[] = ['inbox', 'assigned', 'in_progress', 'review', 'done', 'blocked'];

export function TaskBoard({ tasks }: TaskBoardProps) {
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

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
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
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
        {task.comments.length > 0 && (
          <div className="mt-2 pt-2 border-t text-[10px] text-muted-foreground">
            💬 {task.comments.length} comment{task.comments.length > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
