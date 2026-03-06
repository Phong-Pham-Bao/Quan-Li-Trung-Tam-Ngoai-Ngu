import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, User, Clock, MapPin } from 'lucide-react';

export default function StudentCourses({ currentUser }) {
  const email = currentUser?.email;

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['my-enrollments', email],
    queryFn: () => base44.entities.Enrollment.filter({ student_email: email }),
    enabled: !!email,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list(),
  });

  const myCourses = enrollments.map(e => {
    const course = courses.find(c => c.id === e.course_id);
    return { ...e, ...course, enrollment_status: e.status };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="My Courses" subtitle={`${myCourses.length} enrolled courses`} />

      {isLoading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <Card key={i} className="h-28 animate-pulse bg-muted" />)}</div>
      ) : myCourses.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">You are not enrolled in any courses yet</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myCourses.map(c => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{c.name || c.course_name}</h3>
                      <p className="text-xs text-muted-foreground">{c.subject} · {c.level?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.enrollment_status} />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {c.teacher_name && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {c.teacher_name}</span>}
                  {c.schedule && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.schedule}</span>}
                  {c.classroom && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.classroom}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}