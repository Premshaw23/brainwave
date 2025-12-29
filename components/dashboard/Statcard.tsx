
// components/dashboard/StatsCard.tsx
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'bg-indigo-500',
}: StatsCardProps) {
  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-xl rounded-2xl border border-indigo-100">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-indigo-500 mb-1">{title}</p>
            <p className="text-4xl font-extrabold text-indigo-700 mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-2 font-semibold">{trend}</p>
            )}
          </div>
          <div className={`${color} p-4 rounded-xl shadow-md flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
