import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Users } from 'lucide-react';

export default function TeacherSchedule({ currentUser }) {
  const email = currentUser?.email;

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['my-courses', email],
    queryFn: () => base44.entities.Course.filter({ teacher_email: email }),
    enabled: !!email,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => base44.entities.Enrollment.list(),
  });

  const activeCourses = courses.filter(c => c.status === 'active' || c.status === 'upcoming');

  return (
    <div className="space-y-6">
      <PageHeader title="My Teaching Schedule" subtitle={`${activeCourses.length} active/upcoming courses`} />

      {isLoading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <Card key={i} className="h-32 animate-pulse bg-muted" />)}</div>
      ) : activeCourses.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No courses scheduled</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {activeCourses.map(c => {
            const studentCount = enrollments.filter(e => e.course_id === c.id && e.status === 'active').length;
            return (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{c.name}</h3>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{c.subject} · {c.level?.replace(/_/g, ' ')}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.schedule || 'TBD'}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.classroom || 'TBD'}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {studentCount}/{c.max_students} students</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {c.start_date && <p>From: {c.start_date}</p>}
                      {c.end_date && <p>To: {c.end_date}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}