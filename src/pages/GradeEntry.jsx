import React, { useState } from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award } from 'lucide-react';
import { toast } from 'sonner';

const TYPES = ['quiz', 'midterm', 'final', 'assignment', 'participation', 'speaking', 'listening', 'reading', 'writing'];
const empty = { student_email: '', student_name: '', course_id: '', course_name: '', assessment_type: 'quiz', score: 0, max_score: 100, comments: '', grade_date: new Date().toISOString().split('T')[0] };

export default function GradeEntry({ currentUser }) {
  const email = currentUser?.email;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const qc = useQueryClient();

  const { data: courses = [] } = useQuery({
    queryKey: ['my-courses', email],
    queryFn: () => demoClient.entities.Course.filter({ teacher_email: email }),
    enabled: !!email,
  });

  const { data: enrollments = [] } = useQuery({ queryKey: ['enrollments'], queryFn: () => demoClient.entities.Enrollment.list() });
  const { data: grades = [], isLoading } = useQuery({ queryKey: ['grades'], queryFn: () => demoClient.entities.Grade.list('-created_date') });

  const myCourseIds = courses.map(c => String(c.id));
  const myGrades = grades.filter(g => myCourseIds.includes(String(g.course_id)));
  const courseStudents = enrollments.filter(e => String(e.course_id) === String(form.course_id) && e.status === 'active');

  const save = useMutation({
    mutationFn: (d) => demoClient.entities.Grade.create({ ...d, graded_by: email }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['grades'] }); setShowForm(false); setForm(empty); toast.success('Grade saved'); },
  });

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const columns = [
    { header: 'Student', render: (r) => <span className="text-sm font-medium">{r.student_name || r.student_email}</span> },
    { header: 'Course', render: (r) => <span className="text-sm">{r.course_name}</span> },
    { header: 'Type', render: (r) => <span className="text-sm capitalize">{r.assessment_type}</span> },
    { header: 'Score', render: (r) => <span className="text-sm font-semibold">{r.score}/{r.max_score || 100}</span> },
    { header: 'Date', render: (r) => <span className="text-sm text-muted-foreground">{r.grade_date || '—'}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Grade Entry" subtitle="Record and manage student grades" action={() => { setForm(empty); setShowForm(true); }} actionLabel="Add Grade" actionIcon={Award} />
      <DataTable columns={columns} data={myGrades} isLoading={isLoading} emptyMessage="No grades recorded" />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Grade</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Course</Label>
              <Select value={form.course_id} onValueChange={v => { const c = courses.find(cr => String(cr.id) === String(v)); setField('course_id', v); setField('course_name', c?.name || ''); }}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{courses.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select value={form.student_email} onValueChange={v => { const s = courseStudents.find(e => e.student_email === v); setField('student_email', v); setField('student_name', s?.student_name || v); }}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{courseStudents.map(e => <SelectItem key={e.id} value={e.student_email}>{e.student_name || e.student_email}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Assessment Type</Label>
                <Select value={form.assessment_type} onValueChange={v => setField('assessment_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.grade_date} onChange={e => setField('grade_date', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Score</Label><Input type="number" min="0" value={form.score} onChange={e => setField('score', Number(e.target.value))} /></div>
              <div className="space-y-1.5"><Label>Max Score</Label><Input type="number" min="1" value={form.max_score} onChange={e => setField('max_score', Number(e.target.value))} /></div>
            </div>
            <div className="space-y-1.5"><Label>Comments</Label><Textarea value={form.comments} onChange={e => setField('comments', e.target.value)} rows={2} /></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => save.mutate(form)} disabled={save.isPending}>Save Grade</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
