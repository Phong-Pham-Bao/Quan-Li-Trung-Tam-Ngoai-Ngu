import React, { useState } from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ClipboardCheck } from 'lucide-react';

export default function AttendanceManagement() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const qc = useQueryClient();

  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: () => demoClient.entities.Course.list() });
  const { data: enrollments = [] } = useQuery({ queryKey: ['enrollments'], queryFn: () => demoClient.entities.Enrollment.list() });
  const { data: attendance = [] } = useQuery({ queryKey: ['attendance'], queryFn: () => demoClient.entities.Attendance.list('-created_date') });

  const courseStudents = enrollments.filter(e => String(e.course_id) === String(selectedCourse) && e.status === 'active');
  const course = courses.find(c => String(c.id) === String(selectedCourse));

  const markAttendance = useMutation({
    mutationFn: (data) => demoClient.entities.Attendance.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['attendance'] }); toast.success('Attendance marked'); },
  });

  const handleMark = (studentEmail, studentName, status) => {
    markAttendance.mutate({
      student_email: studentEmail,
      student_name: studentName,
      course_id: selectedCourse,
      course_name: course?.name || '',
      date,
      status,
    });
  };

  const getExistingAttendance = (email) => {
    return attendance.find(a => a.student_email === email && String(a.course_id) === String(selectedCourse) && a.date === date);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Management" subtitle="Track student attendance" actionIcon={ClipboardCheck} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Select Course</Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger><SelectValue placeholder="Choose a course" /></SelectTrigger>
            <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>

      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Students in {course?.name} — {date}</CardTitle>
          </CardHeader>
          <CardContent>
            {courseStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No students enrolled in this course</p>
            ) : (
              <div className="space-y-3">
                {courseStudents.map(e => {
                  const existing = getExistingAttendance(e.student_email);
                  return (
                    <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{(e.student_name || 'S').charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{e.student_name || e.student_email}</p>
                          {existing && <StatusBadge status={existing.status} />}
                        </div>
                      </div>
                      {!existing && (
                        <div className="flex gap-2">
                          {['present', 'absent', 'late', 'excused'].map(s => (
                            <Button key={s} variant="outline" size="sm" className="text-xs capitalize" onClick={() => handleMark(e.student_email, e.student_name, s)}>
                              {s}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
