'use client';

import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="secondary" 
        size="sm" 
        className="bg-white/10 text-white hover:bg-white/20 border-0"
      >
        <MessageSquare className="h-4 w-4 mr-1.5" />
        Message Squad
      </Button>
      <Button 
        size="sm"
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-500/25"
      >
        <Plus className="h-4 w-4 mr-1.5" />
        New Task
      </Button>
    </div>
  );
}
