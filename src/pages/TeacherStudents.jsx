import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function TeacherStudents({ currentUser }) {
  const email = currentUser?.email;
  const [selectedCourse, setSelectedCourse] = useState('all');

  const { data: courses = [] } = useQuery({
    queryKey: ['my-courses', email],
    queryFn: () => base44.entities.Course.filter({ teacher_email: email }),
    enabled: !!email,
  });

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => base44.entities.Enrollment.list(),
  });

  const { data: grades = [] } = useQuery({
    queryKey: ['grades'],
    queryFn: () => base44.entities.Grade.list(),
  });

  const myCourseIds = courses.map(c => c.id);
  const myEnrollments = enrollments.filter(e => myCourseIds.includes(e.course_id));
  const filtered = selectedCourse === 'all' ? myEnrollments : myEnrollments.filter(e => e.course_id === selectedCourse);

  const columns = [
    {
      header: 'Student',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">{(r.student_name || 'S').charAt(0)}</span>
          </div>
          <span className="font-medium text-sm">{r.student_name || r.student_email}</span>
        </div>
      ),
    },
    { header: 'Course', render: (r) => <span className="text-sm">{r.course_name || courses.find(c => c.id === r.course_id)?.name || '—'}</span> },
    {
      header: 'Avg Grade',
      render: (r) => {
        const studentGrades = grades.filter(g => g.student_email === r.student_email && g.course_id === r.course_id);
        const avg = studentGrades.length > 0 ? (studentGrades.reduce((s, g) => s + g.score, 0) / studentGrades.length).toFixed(1) : '—';
        return <span className="text-sm font-medium">{avg}</span>;
      },
    },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Students" subtitle={`${filtered.length} students across your courses`} />

      <div className="max-w-xs space-y-1.5">
        <Label>Filter by Course</Label>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} emptyMessage="No students found" />
    </div>
  );
}