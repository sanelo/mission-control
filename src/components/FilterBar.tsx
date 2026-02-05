'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Doc } from '../../convex/_generated/dataModel';

interface FilterBarProps {
  agents: Doc<'agents'>[];
  filterAgent: string;
  setFilterAgent: (agent: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FilterBar({ 
  agents, 
  filterAgent, 
  setFilterAgent, 
  searchQuery, 
  setSearchQuery 
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 pl-10 bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50"
        />
      </div>
      
      <Select value={filterAgent} onValueChange={setFilterAgent}>
        <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700 text-slate-200">
          <Filter className="h-4 w-4 mr-2 text-slate-500" />
          <SelectValue placeholder="Filter by agent" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700">
          <SelectItem value="all" className="text-slate-200">All Agents</SelectItem>
          {agents.map((agent) => (
            <SelectItem key={agent._id} value={agent._id} className="text-slate-200">
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
