'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Doc } from '../../convex/_generated/dataModel';
import { Circle, Play, CheckCircle2, AlertCircle } from 'lucide-react';

interface TaskBoardProps {
  tasks: Doc<'tasks'>[];
  agents: Doc<'agents'>[];
}

const COLUMNS = [
  { 
    id: 'todo', 
    label: 'To Do', 
    icon: Circle,
    statuses: ['inbox', 'assigned', 'blocked'] as string[],
    color: 'text-slate-400',
    bgColor: 'bg-slate-800/50'
  },
  { 
    id: 'inprogress', 
    label: 'In Progress', 
    icon: Play,
    statuses: ['in_progress', 'review'] as string[],
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/30'
  },
  { 
    id: 'done', 
    label: 'Done', 
    icon: CheckCircle2,
    statuses: ['done'] as string[],
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/30'
  },
];

const PRIORITY_COLORS = {
  low: 'bg-slate-700 text-slate-300',
  medium: 'bg-blue-900/50 text-blue-300',
  high: 'bg-amber-900/50 text-amber-300',
  urgent: 'bg-red-900/50 text-red-300',
};

export function TaskBoard({ tasks, agents }: TaskBoardProps) {
  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a._id === agentId);
    return agent?.name || agentId.slice(0, 6);
  };

  const getAgentColor = (agentId: string) => {
    const agent = agents.find(a => a._id === agentId);
    return agent?.color || 'bg-slate-600';
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) =>
          column.statuses.includes(task.status)
        );
        const Icon = column.icon;

        return (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg ${column.bgColor}`}>
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${column.color}`} />
                <span className="text-sm font-semibold text-slate-200">
                  {column.label}
                </span>
              </div>
              <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                {columnTasks.length}
              </Badge>
            </div>

            {/* Tasks */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-3">
                {columnTasks.map((task) => (
                  <Card 
                    key={task._id} 
                    className="bg-slate-900/80 border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      {/* Priority Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] ${PRIORITY_COLORS[task.priority || 'medium']}`}
                        >
                          {task.priority || 'medium'}
                        </Badge>
                        
                        {task.status === 'blocked' && (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-medium text-slate-200 mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        {task.title}
                      </h4>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Footer: Status + Assignees */}
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className="text-[10px] border-slate-700 text-slate-500"
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>

                        {task.assigneeIds.length > 0 && (
                          <div className="flex -space-x-1.5">
                            {task.assigneeIds.slice(0, 3).map((agentId) => (
                              <div
                                key={agentId}
                                className={`h-6 w-6 rounded-full ${getAgentColor(agentId)} text-[9px] flex items-center justify-center text-white border-2 border-slate-900 font-medium`}
                                title={getAgentName(agentId)}
                              >
                                {getAgentName(agentId).slice(0, 2).toUpperCase()}
                              </div>
                            ))}
                            {task.assigneeIds.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-slate-700 text-[9px] flex items-center justify-center text-slate-300 border-2 border-slate-900">
                                +{task.assigneeIds.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-600">
                    <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
