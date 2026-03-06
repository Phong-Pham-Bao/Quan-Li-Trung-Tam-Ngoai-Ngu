import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherManagement() {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => base44.entities.User.filter({ role: 'teacher' }),
  });

  const handleInvite = async () => {
    if (!email) return;
    await base44.users.inviteUser(email, 'user');
    toast.success('Teacher invitation sent');
    setEmail('');
    setShowInvite(false);
  };

  const columns = [
    {
      header: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{(row.full_name || 'T').charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-sm">{row.full_name || 'No name'}</p>
            <p className="text-xs text-muted-foreground">{row.specialization || 'General'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      render: (row) => <span className="text-sm text-muted-foreground">{row.email}</span>,
    },
    {
      header: 'Phone',
      render: (row) => <span className="text-sm">{row.phone || '—'}</span>,
    },
    {
      header: 'Rate/hr',
      render: (row) => <span className="text-sm font-medium">{row.hourly_rate ? `$${row.hourly_rate}` : '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Management"
        subtitle={`${teachers.length} teachers registered`}
        action={() => setShowInvite(true)}
        actionLabel="Invite Teacher"
        actionIcon={UserPlus}
      />

      <DataTable columns={columns} data={teachers} isLoading={isLoading} emptyMessage="No teachers found" />

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input placeholder="teacher@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">The teacher will receive an invitation email to join the platform. You can set their role to "teacher" after they join.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button onClick={handleInvite}>Send Invitation</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}