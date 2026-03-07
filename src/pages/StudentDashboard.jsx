import React from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import { BookOpen, Award, CreditCard, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboard({ currentUser }) {
  const email = currentUser?.email;

  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollments', email],
    queryFn: () => demoClient.entities.Enrollment.filter({ student_email: email }),
    enabled: !!email,
  });

  const { data: grades = [] } = useQuery({
    queryKey: ['my-grades', email],
    queryFn: () => demoClient.entities.Grade.filter({ student_email: email }),
    enabled: !!email,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['my-payments', email],
    queryFn: () => demoClient.entities.TuitionPayment.filter({ student_email: email }),
    enabled: !!email,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['my-notifications', email],
    queryFn: () => demoClient.entities.Notification.filter({ target_email: email }),
    enabled: !!email,
  });

  const activeCourses = enrollments.filter(e => e.status === 'active');
  const avgGrade = grades.length > 0 ? (grades.reduce((s, g) => s + g.score, 0) / grades.length).toFixed(1) : '—';
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  const unreadNotifs = notifications.filter(n => !n.is_read);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, {currentUser?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Courses" value={activeCourses.length} icon={BookOpen} />
        <StatCard title="Avg Grade" value={avgGrade} icon={Award} />
        <StatCard title="Pending Fees" value={`$${pendingPayments.reduce((s, p) => s + (p.amount || 0), 0)}`} icon={CreditCard} />
        <StatCard title="Notifications" value={unreadNotifs.length} icon={Bell} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">My Courses</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {activeCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No active courses</p>
            ) : (
              activeCourses.map(e => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <p className="text-sm font-medium">{e.course_name}</p>
                  <StatusBadge status={e.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Grades</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {grades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No grades yet</p>
            ) : (
              grades.slice(0, 5).map(g => (
                <div key={g.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{g.course_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{g.assessment_type}</p>
                  </div>
                  <span className="text-sm font-bold">{g.score}/{g.max_score || 100}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
