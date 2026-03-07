import React, { useState } from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import StatCard from '../components/shared/StatCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, AlertTriangle, CheckCircle, Clock, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const empty = { student_email: '', student_name: '', course_id: '', course_name: '', amount: 0, payment_date: '', method: 'cash', status: 'pending', notes: '' };

export default function TuitionManagement() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const qc = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({ queryKey: ['payments'], queryFn: () => demoClient.entities.TuitionPayment.list('-created_date') });
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: () => demoClient.entities.User.filter({ role: 'student' }) });
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: () => demoClient.entities.Course.list() });

  const save = useMutation({
    mutationFn: (d) => editId ? demoClient.entities.TuitionPayment.update(editId, d) : demoClient.entities.TuitionPayment.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payments'] }); setShowForm(false); setForm(empty); setEditId(null); toast.success('Saved'); },
  });

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + (p.amount || 0), 0);

  const columns = [
    { header: 'Student', render: (r) => <div><p className="text-sm font-medium">{r.student_name || r.student_email}</p></div> },
    { header: 'Course', render: (r) => <span className="text-sm">{r.course_name || '—'}</span> },
    { header: 'Amount', render: (r) => <span className="text-sm font-semibold">${r.amount}</span> },
    { header: 'Method', render: (r) => <span className="text-sm capitalize">{r.method?.replace(/_/g, ' ') || '—'}</span> },
    { header: 'Date', render: (r) => <span className="text-sm text-muted-foreground">{r.payment_date ? format(new Date(r.payment_date), 'MMM d, yyyy') : '—'}</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: '',
      render: (r) => (
        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setForm({ ...empty, ...r }); setEditId(r.id); setShowForm(true); }}><Pencil className="w-4 h-4" /></Button>
      ),
    },
  ];

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Tuition & Fees" subtitle="Manage payments and track debts" action={() => { setForm(empty); setEditId(null); setShowForm(true); }} actionLabel="Record Payment" actionIcon={DollarSign} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Collected" value={`$${totalPaid.toLocaleString()}`} icon={CheckCircle} iconClassName="bg-accent/10" />
        <StatCard title="Pending" value={`$${totalPending.toLocaleString()}`} icon={Clock} iconClassName="bg-chart-3/10" />
        <StatCard title="Overdue" value={`$${totalOverdue.toLocaleString()}`} icon={AlertTriangle} iconClassName="bg-destructive/10" />
      </div>

      <DataTable columns={columns} data={payments} isLoading={isLoading} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Payment' : 'Record Payment'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select value={form.student_email} onValueChange={v => { const s = students.find(st => st.email === v); setField('student_email', v); setField('student_name', s?.full_name || v); }}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.email}>{s.full_name || s.email}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Course</Label>
              <Select value={form.course_id} onValueChange={v => { const c = courses.find(cr => cr.id === v); setField('course_id', v); setField('course_name', c?.name || ''); }}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={e => setField('amount', Number(e.target.value))} /></div>
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.payment_date} onChange={e => setField('payment_date', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Method</Label>
                <Select value={form.method} onValueChange={v => setField('method', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => save.mutate(form)} disabled={save.isPending}>{editId ? 'Update' : 'Save'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
