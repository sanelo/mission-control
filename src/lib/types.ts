// Types for Mission Control

export type AgentStatus = 'idle' | 'active' | 'blocked';
export type TaskStatus = 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done' | 'blocked';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  emoji: string;
  color: string;
  currentTaskId?: string;
  sessionKey: string;
  lastHeartbeat: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeIds: string[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  agentId: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'task_created' | 'task_updated' | 'message_sent' | 'agent_status_changed';
  agentId: string;
  message: string;
  timestamp: string;
}

export const AGENT_STATUS_COLORS: Record<AgentStatus, string> = {
  idle: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  blocked: 'bg-red-100 text-red-800 border-red-200',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  inbox: 'bg-gray-100 text-gray-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
  review: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  inbox: 'Inbox',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
  blocked: 'Blocked',
};
