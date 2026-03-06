import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';

const COLORS = ['hsl(252,85%,60%)', 'hsl(170,75%,42%)', 'hsl(38,95%,55%)', 'hsl(0,72%,58%)', 'hsl(200,80%,55%)', 'hsl(280,70%,55%)'];

export default function Statistics() {
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: () => base44.entities.Course.list() });
  const { data: payments = [] } = useQuery({ queryKey: ['payments'], queryFn: () => base44.entities.TuitionPayment.list() });
  const { data: attendance = [] } = useQuery({ queryKey: ['attendance'], queryFn: () => base44.entities.Attendance.list() });

  const coursesBySubject = courses.reduce((a, c) => { a[c.subject || 'Other'] = (a[c.subject || 'Other'] || 0) + 1; return a; }, {});
  const subjectChart = Object.entries(coursesBySubject).map(([name, value]) => ({ name, value }));

  const coursesByLevel = courses.reduce((a, c) => { a[c.level || 'unknown'] = (a[c.level || 'unknown'] || 0) + 1; return a; }, {});
  const levelChart = Object.entries(coursesByLevel).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const paymentsByStatus = payments.reduce((a, p) => { a[p.status || 'pending'] = (a[p.status || 'pending'] || 0) + (p.amount || 0); return a; }, {});
  const paymentChart = Object.entries(paymentsByStatus).map(([name, value]) => ({ name, value }));

  const attendanceStats = attendance.reduce((a, att) => { a[att.status || 'present'] = (a[att.status || 'present'] || 0) + 1; return a; }, {});
  const attendanceChart = Object.entries(attendanceStats).map(([name, value]) => ({ name, value }));

  const EmptyState = () => <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No data available yet</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Statistics & Analytics" subtitle="Insights into your language center performance" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Courses by Language</CardTitle></CardHeader>
          <CardContent>
            {subjectChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={subjectChart} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {subjectChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Courses by Level</CardTitle></CardHeader>
          <CardContent>
            {levelChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={levelChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(252,85%,60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Status</CardTitle></CardHeader>
          <CardContent>
            {paymentChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={paymentChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Bar dataKey="value" fill="hsl(170,75%,42%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Attendance Overview</CardTitle></CardHeader>
          <CardContent>
            {attendanceChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={attendanceChart} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {attendanceChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}