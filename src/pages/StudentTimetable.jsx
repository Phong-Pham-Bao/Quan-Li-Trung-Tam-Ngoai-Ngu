import React from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, User } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';

export default function StudentTimetable({ currentUser }) {
  const email = currentUser?.email;

  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollments', email],
    queryFn: () => demoClient.entities.Enrollment.filter({ student_email: email }),
    enabled: !!email,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => demoClient.entities.Course.list(),
  });

  const activeCourses = enrollments
    .filter(e => e.status === 'active')
    .map(e => courses.find(c => c.id === e.course_id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" subtitle="Your weekly schedule" />

      {activeCourses.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No active courses in your timetable</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {activeCourses.map(c => (
            <Card key={c.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{c.name}</h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{c.subject} · {c.level?.replace(/_/g, ' ')}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.schedule || 'TBD'}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.classroom || 'TBD'}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {c.teacher_name || 'TBD'}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    {c.start_date && <p>{c.start_date}</p>}
                    {c.end_date && <p>to {c.end_date}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
