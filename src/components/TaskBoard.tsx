'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Doc } from '../../convex/_generated/dataModel';
import { Circle, Play, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface TaskBoardProps {
  tasks: Doc<'tasks'>[];
  agents: Doc<'agents'>[];
}

const COLUMNS = [
  { 
    id: 'todo', 
    label: 'To Do', 
    icon: Circle,
    statuses: ['inbox', 'assigned'],
    color: 'text-slate-400',
    bgColor: 'bg-slate-800/50'
  },
  { 
    id: 'inprogress', 
    label: 'In Progress', 
    icon: Play,
    statuses: ['in_progress', 'review'],
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/30'
  },
  { 
    id: 'done', 
    label: 'Done', 
    icon: CheckCircle2,
    statuses: ['done'],
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/30'
  },
] as const;

const PRIORITY_COLORS = {
  low: 'bg-slate-700 text-slate-300',
  medium: 'bg-blue-900/50 text-blue-300',
  high: 'bg-amber-900/50 text-amber-300',
  urgent: 'bg-red-900/50 text-red-300',
};

export function TaskBoard({ tasks, agents }: TaskBoardProps) {
  const updateStatus = useMutation(api.tasks.updateStatus);

  const handleStartTask = async (taskId: string) => {
    // Use the first agent as the one starting it
    const agentId = agents[0]?._id;
    if (agentId) {
      await updateStatus({ id: taskId as any, status: 'in_progress', agentId: agentId as any });
    }
  };

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
          (column.statuses as readonly string[]).includes(task.status)
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
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    agents={agents}
                    getAgentName={getAgentName}
                    getAgentColor={getAgentColor}
                    onStart={() => handleStartTask(task._id)}
                    canStart={column.id === 'todo' && task.status === 'assigned'}
                  />
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

interface TaskCardProps {
  task: Doc<'tasks'>;
  agents: Doc<'agents'>[];
  getAgentName: (id: string) => string;
  getAgentColor: (id: string) => string;
  onStart: () => void;
  canStart: boolean;
}

function TaskCard({ task, agents, getAgentName, getAgentColor, onStart, canStart }: TaskCardProps) {
  const isAssigned = task.status === 'assigned';
  const isInbox = task.status === 'inbox';

  return (
    <Card 
      className={`bg-slate-900/80 border transition-all cursor-pointer group hover:border-cyan-500/30 ${
        isAssigned ? 'border-cyan-800/50' : 'border-slate-800'
      }`}
    >
      <CardContent className="p-4">
        {/* Status indicator for assigned tasks */}
        {isAssigned && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-cyan-400">
            <User className="h-3 w-3" />
            <span>Assigned to {task.assigneeIds.length} agent{task.assigneeIds.length !== 1 ? 's' : ''}</span>
          </div>
        )}

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

        {/* Start Button for assigned tasks */}
        {canStart && (
          <Button 
            size="sm" 
            className="w-full mb-3 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-600/30"
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
          >
            <Play className="h-3 w-3 mr-1" />
            Start Task
          </Button>
        )}

        {/* Footer: Status + Assignees */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-[10px] ${
              isInbox 
                ? 'border-slate-700 text-slate-500' 
                : isAssigned
                ? 'border-cyan-700/50 text-cyan-400'
                : 'border-slate-700 text-slate-500'
            }`}
          >
            {isInbox ? '📥 inbox' : isAssigned ? '👤 assigned' : task.status.replace('_', ' ')}
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
  );
}
