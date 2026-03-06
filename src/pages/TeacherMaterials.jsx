import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Video, Headphones, Presentation, FileSpreadsheet, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const typeIcons = { document: FileText, video: Video, audio: Headphones, presentation: Presentation, worksheet: FileSpreadsheet, other: FileText };

export default function TeacherMaterials({ currentUser }) {
  const email = currentUser?.email;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', course_id: '', course_name: '', type: 'document', file_url: '' });
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const { data: courses = [] } = useQuery({
    queryKey: ['my-courses', email],
    queryFn: () => base44.entities.Course.filter({ teacher_email: email }),
    enabled: !!email,
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => base44.entities.TeachingMaterial.list('-created_date'),
  });

  const myMaterials = materials.filter(m => m.uploaded_by === email || courses.some(c => c.id === m.course_id));

  const save = useMutation({
    mutationFn: (d) => base44.entities.TeachingMaterial.create({ ...d, uploaded_by: email }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['materials'] }); setShowForm(false); toast.success('Material uploaded'); },
  });

  const del = useMutation({
    mutationFn: (id) => base44.entities.TeachingMaterial.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['materials'] }); toast.success('Deleted'); },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, file_url }));
    setUploading(false);
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Teaching Materials" subtitle="Upload and manage study resources" action={() => setShowForm(true)} actionLabel="Upload Material" actionIcon={Upload} />

      {isLoading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <Card key={i} className="h-24 animate-pulse bg-muted" />)}</div>
      ) : myMaterials.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No materials uploaded yet</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {myMaterials.map(m => {
            const Icon = typeIcons[m.type] || FileText;
            return (
              <Card key={m.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.course_name} · {m.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {m.file_url && (
                      <Button variant="ghost" size="icon" asChild><a href={m.file_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a></Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => del.mutate(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Material</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={e => setField('title', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Select value={form.course_id} onValueChange={v => { const c = courses.find(cr => cr.id === v); setField('course_id', v); setField('course_name', c?.name || ''); }}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setField('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['document','video','audio','presentation','worksheet','other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>File</Label>
              <Input type="file" onChange={handleFileUpload} disabled={uploading} />
              {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
              {form.file_url && <p className="text-xs text-accent">File uploaded ✓</p>}
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => save.mutate(form)} disabled={save.isPending || uploading}>Upload</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}