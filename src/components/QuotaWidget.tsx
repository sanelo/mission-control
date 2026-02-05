'use client';

import { useState, useEffect } from 'react';
import { Cpu, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuotaData {
  daily: { used: number; limit: number; percentage: number };
  weekly: { used: number; limit: number; percentage: number };
}

export function QuotaWidget() {
  const [quota, setQuota] = useState<QuotaData>({
    daily: { used: 0, limit: 1000, percentage: 0 },
    weekly: { used: 0, limit: 7000, percentage: 0 },
  });

  useEffect(() => {
    // TODO: Fetch real quota data from API
    // For now, show mock data
    setQuota({
      daily: { used: 450, limit: 1000, percentage: 45 },
      weekly: { used: 3200, limit: 7000, percentage: 46 },
    });
  }, []);

  const dailyWarning = quota.daily.percentage > 80;
  const weeklyWarning = quota.weekly.percentage > 80;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          API Usage
        </span>
        {(dailyWarning || weeklyWarning) && (
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Daily</span>
            <span className={dailyWarning ? 'text-amber-400' : 'text-slate-300'}>
              {quota.daily.used} / {quota.daily.limit}
            </span>
          </div>
          <Progress 
            value={quota.daily.percentage} 
            className="h-1.5 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Weekly</span>
            <span className={weeklyWarning ? 'text-amber-400' : 'text-slate-300'}>
              {quota.weekly.used} / {quota.weekly.limit}
            </span>
          </div>
          <Progress 
            value={quota.weekly.percentage} 
            className="h-1.5 bg-slate-800"
          />
        </div>
      </div>
    </div>
  );
}
