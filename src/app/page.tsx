'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentCard } from '@/components/AgentCard';
import { TaskBoard } from '@/components/TaskBoard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { initialAgents, initialTasks, initialActivities } from '@/lib/data';
import { Activity, Users, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
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
                {initialAgents.filter(a => a.status === 'active').length} Active
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                {initialAgents.filter(a => a.status === 'idle').length} Idle
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                {initialTasks.length} Tasks
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
              Agents
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Task Board
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="h-[600px]">
              <TaskBoard tasks={initialTasks} />
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeed activities={initialActivities} agents={initialAgents} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Mission Control — Built with Next.js + shadcn/ui
        </div>
      </footer>
    </div>
  );
}
