'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogClose } from '@/components/ui/dialog';
import { Play, Plus } from 'lucide-react';

interface TaskFormProps {
  agents: Doc<'agents'>[];
  onSuccess?: () => void;
}

export function TaskForm({ agents, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('inbox');
  const [priority, setPriority] = useState('medium');
  const [assigneeIds, setAssigneeIds] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createTask = useMutation(api.tasks.create);

  const handleSubmit = async (e: React.FormEvent, startImmediately = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // If starting immediately, set status to in_progress
    const finalStatus = startImmediately ? 'in_progress' : 
      (assigneeIds.length > 0 ? 'assigned' : 'inbox');
    
    await createTask({
      title,
      description,
      status: finalStatus as any,
      priority: priority as any,
      assigneeIds: assigneeIds as any,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('inbox');
    setPriority('medium');
    setAssigneeIds([]);
    setIsSubmitting(false);
    
    onSuccess?.();
  };

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="bg-slate-800 border-slate-700 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description..."
          className="bg-slate-800 border-slate-700 text-white"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Initial Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="inbox">📥 Inbox (Backlog)</SelectItem>
              <SelectItem value="assigned">👤 Assigned (Ready)</SelectItem>
              <SelectItem value="in_progress">🚀 In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Assignees</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {agents.map((agent) => (
            <button
              key={agent._id}
              type="button"
              onClick={() => {
                if (assigneeIds.includes(agent._id)) {
                  setAssigneeIds(assigneeIds.filter(id => id !== agent._id));
                } else {
                  setAssigneeIds([...assigneeIds, agent._id]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors flex items-center gap-1.5 ${
                assigneeIds.includes(agent._id)
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span>{agent.emoji}</span>
              <span>{agent.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <DialogClose asChild>
          <Button 
            type="button"
            variant="outline"
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={(e) => handleSubmit(e as any, false)}
            disabled={isSubmitting || !title}
          >
            <Plus className="h-4 w-4 mr-2" />
            Submit Task
          </Button>
        </DialogClose>
        
        <DialogClose asChild>
          <Button 
            type="button"
            className="flex-1 bg-cyan-600 hover:bg-cyan-500"
            onClick={(e) => handleSubmit(e as any, true)}
            disabled={isSubmitting || !title}
          >
            <Play className="h-4 w-4 mr-2" />
            Submit & Start
          </Button>
        </DialogClose>
      </div>
    </form>
  );
}
