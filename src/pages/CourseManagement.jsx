import React, { useState } from 'react';
import { demoClient } from '@/api/demoClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const LEVELS = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficiency'];
const STATUSES = ['active', 'upcoming', 'completed', 'cancelled'];

const emptyForm = { name: '', subject: '', level: 'beginner', description: '', teacher_email: '', teacher_name: '', classroom: '', schedule: '', start_date: '', end_date: '', max_students: 30, tuition_fee: 0, status: 'upcoming' };

export default function CourseManagement() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({ queryKey: ['courses'], queryFn: () => demoClient.entities.Course.list('-created_date') });
  const { data: teachers = [] } = useQuery({ queryKey: ['teachers'], queryFn: () => demoClient.entities.User.filter({ role: 'teacher' }) });
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: () => demoClient.entities.Subject.list() });
  const { data: classrooms = [] } = useQuery({ queryKey: ['classrooms'], queryFn: () => demoClient.entities.Classroom.list() });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? demoClient.entities.Course.update(editId, data) : demoClient.entities.Course.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['courses'] }); setShowForm(false); setForm(emptyForm); setEditId(null); toast.success(editId ? 'Course updated' : 'Course created'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => demoClient.entities.Course.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['courses'] }); toast.success('Course deleted'); },
  });

  const handleEdit = (course) => {
    setForm({ ...emptyForm, ...course });
    setEditId(course.id);
    setShowForm(true);
  };

  const handleSave = () => {
    const teacher = teachers.find(t => t.email === form.teacher_email);
    saveMutation.mutate({ ...form, teacher_name: teacher?.full_name || form.teacher_name });
  };

  const columns = [
    { header: 'Course', render: (r) => <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.subject} · {r.level}</p></div> },
    { header: 'Teacher', render: (r) => <span className="text-sm">{r.teacher_name || '—'}</span> },
    { header: 'Schedule', render: (r) => <span className="text-sm text-muted-foreground">{r.schedule || '—'}</span> },
    { header: 'Fee', render: (r) => <span className="text-sm font-medium">{r.tuition_fee ? `$${r.tuition_fee}` : '—'}</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: '',
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(r); }}><Pencil className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(r.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Course Management" subtitle={`${courses.length} courses`} action={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} actionLabel="Add Course" />
      <DataTable columns={columns} data={courses} isLoading={isLoading} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit Course' : 'New Course'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={e => setField('name', e.target.value)} /></div>
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select value={form.subject} onValueChange={v => setField('subject', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Level</Label>
                <Select value={form.level} onValueChange={v => setField('level', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Teacher</Label>
                <Select value={form.teacher_email} onValueChange={v => setField('teacher_email', v)}>
                  <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                  <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.email}>{t.full_name || t.email}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Classroom</Label>
                <Select value={form.classroom} onValueChange={v => setField('classroom', v)}>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>{classrooms.map(c => <SelectItem key={c.id} value={c.name}>{c.name} (cap: {c.capacity})</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Schedule</Label><Input placeholder="e.g., Mon/Wed/Fri 9:00-10:30" value={form.schedule} onChange={e => setField('schedule', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setField('start_date', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setField('end_date', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Max Students</Label><Input type="number" value={form.max_students} onChange={e => setField('max_students', Number(e.target.value))} /></div>
              <div className="space-y-1.5"><Label>Tuition Fee ($)</Label><Input type="number" value={form.tuition_fee} onChange={e => setField('tuition_fee', Number(e.target.value))} /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>{editId ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
