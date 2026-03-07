import React from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import { BookOpen, GraduationCap, Calendar, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherDashboard({ currentUser }) {
  const email = currentUser?.email;

  const { data: courses = [] } = useQuery({
    queryKey: ['my-courses', email],
    queryFn: () => demoClient.entities.Course.filter({ teacher_email: email }),
    enabled: !!email,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => demoClient.entities.Enrollment.list(),
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ['my-attendance', email],
    queryFn: () => demoClient.entities.Attendance.filter({ marked_by: email }),
    enabled: !!email,
  });

  const myCourseIds = courses.map(c => c.id);
  const myStudentCount = new Set(enrollments.filter(e => myCourseIds.includes(e.course_id) && e.status === 'active').map(e => e.student_email)).size;
  const activeCourses = courses.filter(c => c.status === 'active');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, {currentUser?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Courses" value={activeCourses.length} icon={BookOpen} />
        <StatCard title="My Students" value={myStudentCount} icon={GraduationCap} />
        <StatCard title="Total Sessions" value={attendance.length} icon={ClipboardCheck} />
        <StatCard title="This Week" value={courses.filter(c => c.status === 'active').length + ' classes'} icon={Calendar} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">My Courses</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No courses assigned yet</p>
          ) : (
            courses.map(c => (
              <div key={c.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.subject} · {c.level?.replace(/_/g, ' ')} · {c.schedule || 'No schedule'}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
