'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentCard } from '@/components/AgentCard';
import { TaskBoard } from '@/components/TaskBoard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Activity, Users, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const agents = useQuery(api.agents.list) || [];
  const tasks = useQuery(api.tasks.list, {}) || [];
  const activities = useQuery(api.activities.list, { limit: 50 }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl">
                🎯
              </div>
              <div>
                <h1 className="text-xl font-bold">Mission Control</h1>
                <p className="text-xs text-muted-foreground">
                  AI Agent Squad Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                {agents.filter(a => a.status === 'active').length} Active
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                {agents.filter(a => a.status === 'idle').length} Idle
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                {tasks.length} Tasks
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agents ({agents.length})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Task Board ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            {agents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No agents yet. Run the seed script to add agents.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <AgentCard key={agent._id} agent={agent} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks">
            <div className="h-[600px]">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No tasks yet. Create one to get started.
                </div>
              ) : (
                <TaskBoard tasks={tasks} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No activity yet.
              </div>
            ) : (
              <ActivityFeed activities={activities} agents={agents} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Mission Control — Built with Next.js + Convex + shadcn/ui
        </div>
      </footer>
    </div>
  );
}
