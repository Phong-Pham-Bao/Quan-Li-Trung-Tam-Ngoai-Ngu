import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import StatCard from '../components/shared/StatCard';
import { CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentTuition({ currentUser }) {
  const email = currentUser?.email;

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['my-payments', email],
    queryFn: () => base44.entities.TuitionPayment.filter({ student_email: email }),
    enabled: !!email,
  });

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + (p.amount || 0), 0);

  const columns = [
    { header: 'Course', render: (r) => <span className="text-sm font-medium">{r.course_name || '—'}</span> },
    { header: 'Amount', render: (r) => <span className="text-sm font-semibold">${r.amount}</span> },
    { header: 'Method', render: (r) => <span className="text-sm capitalize">{r.method?.replace(/_/g, ' ') || '—'}</span> },
    { header: 'Date', render: (r) => <span className="text-sm text-muted-foreground">{r.payment_date ? format(new Date(r.payment_date), 'MMM d, yyyy') : '—'}</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tuition & Fees" subtitle="Your payment history and balance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Total Paid" value={`$${totalPaid.toLocaleString()}`} icon={CheckCircle} iconClassName="bg-accent/10" />
        <StatCard title="Outstanding" value={`$${totalPending.toLocaleString()}`} icon={Clock} iconClassName="bg-chart-3/10" />
      </div>

      <DataTable columns={columns} data={payments} isLoading={isLoading} emptyMessage="No payment records" />
    </div>
  );
}