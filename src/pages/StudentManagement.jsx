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

export default function StudentManagement() {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.User.filter({ role: 'student' }),
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => base44.entities.Enrollment.list(),
  });

  const handleInvite = async () => {
    if (!email) return;
    await base44.users.inviteUser(email, 'user');
    toast.success('Student invitation sent');
    setEmail('');
    setShowInvite(false);
  };

  const columns = [
    {
      header: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">{(row.full_name || 'S').charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-sm">{row.full_name || 'No name'}</p>
          </div>
        </div>
      ),
    },
    { header: 'Email', render: (row) => <span className="text-sm text-muted-foreground">{row.email}</span> },
    { header: 'Phone', render: (row) => <span className="text-sm">{row.phone || '—'}</span> },
    {
      header: 'Courses',
      render: (row) => {
        const count = enrollments.filter(e => e.student_email === row.email && e.status === 'active').length;
        return <span className="text-sm font-medium">{count}</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        subtitle={`${students.length} students registered`}
        action={() => setShowInvite(true)}
        actionLabel="Invite Student"
        actionIcon={UserPlus}
      />
      <DataTable columns={columns} data={students} isLoading={isLoading} emptyMessage="No students found" />

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite a Student</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input placeholder="student@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
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