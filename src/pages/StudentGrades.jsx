import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StudentGrades({ currentUser }) {
  const email = currentUser?.email;

  const { data: grades = [], isLoading } = useQuery({
    queryKey: ['my-grades', email],
    queryFn: () => base44.entities.Grade.filter({ student_email: email }),
    enabled: !!email,
  });

  const courseAverages = grades.reduce((acc, g) => {
    if (!acc[g.course_name]) acc[g.course_name] = { total: 0, count: 0 };
    acc[g.course_name].total += g.score;
    acc[g.course_name].count += 1;
    return acc;
  }, {});

  const chartData = Object.entries(courseAverages).map(([name, data]) => ({
    name,
    average: Math.round(data.total / data.count),
  }));

  const columns = [
    { header: 'Course', render: (r) => <span className="text-sm font-medium">{r.course_name}</span> },
    { header: 'Type', render: (r) => <span className="text-sm capitalize">{r.assessment_type}</span> },
    { header: 'Score', render: (r) => {
      const pct = (r.score / (r.max_score || 100)) * 100;
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{r.score}/{r.max_score || 100}</span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    }},
    { header: 'Date', render: (r) => <span className="text-sm text-muted-foreground">{r.grade_date || '—'}</span> },
    { header: 'Comments', render: (r) => <span className="text-sm text-muted-foreground line-clamp-1">{r.comments || '—'}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Grades" subtitle="Academic performance overview" />

      {chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Average by Course</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="average" fill="hsl(252,85%,60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={grades} isLoading={isLoading} emptyMessage="No grades yet" />
    </div>
  );
}