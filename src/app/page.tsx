'use client';

import { useState } from 'react';
import { AgentCard } from '@/components/AgentCard';
import { TaskBoard } from '@/components/TaskBoard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { QuotaWidget } from '@/components/QuotaWidget';
import { FilterBar } from '@/components/FilterBar';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  Users, 
  LayoutDashboard, 
  Activity, 
  AlertCircle,
  CheckCircle2,
  Zap,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from '@/components/TaskForm';

export default function Dashboard() {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActivity, setShowActivity] = useState(false);
  
  const agents = useQuery(api.agents.list) || [];
  const tasks = useQuery(api.tasks.list, {}) || [];
  const activities = useQuery(api.activities.list, { limit: 50 }) || [];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesAgent = filterAgent === 'all' || task.assigneeIds.includes(filterAgent);
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgent && matchesSearch;
  });

  const activeAgents = agents.filter(a => a.status === 'active');
  const blockedAgents = agents.filter(a => a.status === 'blocked');
  
  const openTasks = filteredTasks.filter(t => t.status !== 'done' && t.status !== 'blocked');
  const blockedTasks = filteredTasks.filter(t => t.status === 'blocked');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f0f14] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                ⌘
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control</h1>
                <p className="text-xs text-slate-500 uppercase tracking-wider">AI Agent Squad</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowActivity(!showActivity)}
                className="text-slate-400 hover:text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700 text-slate-200">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm agents={agents} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Blocked Alert */}
      {(blockedTasks.length > 0 || blockedAgents.length > 0) && (
        <div className="bg-red-900/20 border-b border-red-800/50">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                {blockedTasks.length} blocked tasks, {blockedAgents.length} blocked agents
              </span>
              <span className="text-red-400/60 text-sm">— requires attention</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-3 grid grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-sm">Active Agents</span>
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">{activeAgents.length}</div>
                <div className="text-xs text-slate-500 mt-1">{agents.length} total</div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-sm">Open Tasks</span>
                  <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">{openTasks.length}</div>
                <div className="text-xs text-slate-500 mt-1">{tasks.length} total</div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-sm">Completed</span>
                  <CheckCircle2 className="h-4 w-4 text-violet-400" />
                </div>
                <div className="text-2xl font-bold text-white">{doneTasks.length}</div>
                <div className="text-xs text-slate-500 mt-1">This week</div>
              </div>
            </div>
            
            <QuotaWidget />
          </div>

          {/* Task Board */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-cyan-400" />
                  Task Board
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {filteredTasks.length} tasks • {openTasks.length} open
                </p>
              </div>
              <FilterBar 
                agents={agents}
                filterAgent={filterAgent}
                setFilterAgent={setFilterAgent}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            
            <TaskBoard tasks={filteredTasks} agents={agents} />
          </section>

          {/* Agents Row */}
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-400" />
                Squad
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {agents.map((agent) => (
                <AgentCard key={agent._id} agent={agent} compact />
              ))}
            </div>
          </section>
        </main>

        {/* Activity Sidebar */}
        {showActivity && (
          <aside className="w-80 border-l border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                Activity
              </h2>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
            <ActivityFeed activities={activities} agents={agents} />
          </aside>
        )}
      </div>
    </div>
  );
}
