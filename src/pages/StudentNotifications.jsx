import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, AlertCircle, Clock, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const typeConfig = {
  info: { icon: Info, color: 'bg-primary/10 text-primary' },
  warning: { icon: AlertTriangle, color: 'bg-chart-3/10 text-chart-3' },
  urgent: { icon: AlertCircle, color: 'bg-destructive/10 text-destructive' },
  reminder: { icon: Clock, color: 'bg-accent/10 text-accent' },
};

export default function StudentNotifications({ currentUser }) {
  const email = currentUser?.email;
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['my-notifications', email],
    queryFn: async () => {
      const personal = await base44.entities.Notification.filter({ target_email: email });
      const broadcast = await base44.entities.Notification.filter({ target_role: 'student' });
      const all = await base44.entities.Notification.filter({ target_role: 'all' });
      const unique = new Map();
      [...personal, ...broadcast, ...all].forEach(n => unique.set(n.id, n));
      return Array.from(unique.values()).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!email,
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle={`${notifications.filter(n => !n.is_read).length} unread`} />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="h-20 animate-pulse bg-muted" />)}</div>
      ) : notifications.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No notifications</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => {
            const config = typeConfig[n.type] || typeConfig.info;
            const Icon = config.icon;
            return (
              <Card key={n.id} className={cn("transition-all", !n.is_read && "border-primary/30 bg-primary/[0.02]")}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", config.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn("text-sm font-medium", !n.is_read && "font-semibold")}>{n.title}</h3>
                      {!n.is_read && <Badge className="bg-primary/10 text-primary text-[10px] px-1.5">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{format(new Date(n.created_date), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                  {!n.is_read && (
                    <Button variant="ghost" size="sm" onClick={() => markRead.mutate(n.id)} className="shrink-0">
                      <CheckCheck className="w-4 h-4 mr-1" /> Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}