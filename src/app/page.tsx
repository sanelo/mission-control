'use client';

import { AgentCard } from '@/components/AgentCard';
import { TaskBoard } from '@/components/TaskBoard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { StatsCard } from '@/components/StatsCard';
import { QuickActions } from '@/components/QuickActions';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  Users, 
  LayoutDashboard, 
  Activity, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const agents = useQuery(api.agents.list) || [];
  const tasks = useQuery(api.tasks.list, {}) || [];
  const activities = useQuery(api.activities.list, { limit: 50 }) || [];

  const activeAgents = agents.filter(a => a.status === 'active');
  const idleAgents = agents.filter(a => a.status === 'idle');
  const blockedAgents = agents.filter(a => a.status === 'blocked');
  
  const openTasks = tasks.filter(t => t.status !== 'done');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const blockedTasks = tasks.filter(t => t.status === 'blocked');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-500/20">
                🎯
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
                <p className="text-sm text-slate-400">
                  AI Agent Squad Management
                </p>
              </div>
            </div>
            <QuickActions />
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Active Agents"
            value={activeAgents.length}
            total={agents.length}
            icon={Zap}
            color="emerald"
            subtitle={`${idleAgents.length} idle`}
          />
          <StatsCard
            title="Open Tasks"
            value={openTasks.length}
            total={tasks.length}
            icon={LayoutDashboard}
            color="blue"
            subtitle={`${inProgressTasks.length} in progress`}
          />
          <StatsCard
            title="Blocked"
            value={blockedTasks.length + blockedAgents.length}
            icon={AlertCircle}
            color="rose"
            subtitle="Needs attention"
          />
          <StatsCard
            title="Completed"
            value={doneTasks.length}
            total={tasks.length}
            icon={CheckCircle2}
            color="violet"
            subtitle="This week"
          />
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Agents */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-500" />
                Squad
              </h2>
              <span className="text-sm text-muted-foreground">
                {agents.length} agents
              </span>
            </div>
            
            <div className="space-y-3">
              {agents.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <Users className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No agents yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Run the seed script to add agents
                  </p>
                </div>
              ) : (
                agents.map((agent) => (
                  <AgentCard key={agent._id} agent={agent} />
                ))
              )}
            </div>
          </aside>

          {/* Center - Task Board */}
          <section className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-slate-500" />
                Task Board
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {openTasks.length} open
                </span>
              </div>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <LayoutDashboard className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No tasks yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first task to get started
                </p>
              </div>
            ) : (
              <TaskBoard tasks={tasks} />
            )}
          </section>

          {/* Right Sidebar - Activity */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-500" />
                Activity
              </h2>
              <span className="text-xs text-muted-foreground">
                Live
              </span>
            </div>
            
            {activities.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <Activity className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No activity yet
                </p>
              </div>
            ) : (
              <ActivityFeed activities={activities} agents={agents} />
            )}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Mission Control — Built with Next.js + Convex + shadcn/ui</p>
          <p className="text-xs mt-1 opacity-60">
            Modernized dashboard v2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
