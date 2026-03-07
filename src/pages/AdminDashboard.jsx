import React from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import { Users, GraduationCap, BookOpen, DollarSign, Building2, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(252,85%,60%)', 'hsl(170,75%,42%)', 'hsl(38,95%,55%)', 'hsl(0,72%,58%)', 'hsl(200,80%,55%)'];

export default function AdminDashboard() {
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: () => demoClient.entities.Course.list() });
  const { data: enrollments = [] } = useQuery({ queryKey: ['enrollments'], queryFn: () => demoClient.entities.Enrollment.list() });
  const { data: payments = [] } = useQuery({ queryKey: ['payments'], queryFn: () => demoClient.entities.TuitionPayment.list() });
  const { data: teachers = [] } = useQuery({ queryKey: ['teachers'], queryFn: () => demoClient.entities.User.filter({ role: 'teacher' }) });
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: () => demoClient.entities.User.filter({ role: 'student' }) });
  const { data: classrooms = [] } = useQuery({ queryKey: ['classrooms'], queryFn: () => demoClient.entities.Classroom.list() });

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue');

  const coursesBySubject = courses.reduce((acc, c) => {
    acc[c.subject] = (acc[c.subject] || 0) + 1;
    return acc;
  }, {});
  const subjectData = Object.entries(coursesBySubject).map(([name, value]) => ({ name, value }));

  const enrollmentsByStatus = enrollments.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  const enrollmentData = Object.entries(enrollmentsByStatus).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your language center</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Teachers" value={teachers.length} icon={Users} />
        <StatCard title="Students" value={students.length} icon={GraduationCap} />
        <StatCard title="Courses" value={courses.filter(c => c.status === 'active').length} icon={BookOpen} />
        <StatCard title="Classrooms" value={classrooms.length} icon={Building2} />
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} iconClassName="bg-accent/10" />
        <StatCard title="Enrollments" value={enrollments.length} icon={ClipboardCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Courses by Language</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={subjectData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No course data yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Enrollment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={enrollmentData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(252,85%,60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No enrollment data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.subject} · {c.teacher_name || 'Unassigned'}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
            {courses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No courses yet</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingPayments.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.student_name || p.student_email}</p>
                  <p className="text-xs text-muted-foreground">{p.course_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${p.amount}</p>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
            {pendingPayments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No pending payments</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
