import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  active: 'bg-accent/10 text-accent border-accent/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
  upcoming: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  pending: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  paid: 'bg-accent/10 text-accent border-accent/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  partial: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  present: 'bg-accent/10 text-accent border-accent/20',
  absent: 'bg-destructive/10 text-destructive border-destructive/20',
  late: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  excused: 'bg-muted text-muted-foreground border-border',
  dropped: 'bg-muted text-muted-foreground border-border',
  available: 'bg-accent/10 text-accent border-accent/20',
  occupied: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  maintenance: 'bg-destructive/10 text-destructive border-destructive/20',
  inactive: 'bg-muted text-muted-foreground border-border',
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const style = statusStyles[status] || 'bg-muted text-muted-foreground border-border';
  return (
    <Badge variant="outline" className={cn('text-xs font-medium capitalize border', style)}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
