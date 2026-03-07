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

const empty = { name: '', code: '', description: '', status: 'active' };

export default function SubjectManagement() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const qc = useQueryClient();

  const { data: subjects = [], isLoading } = useQuery({ queryKey: ['subjects'], queryFn: () => demoClient.entities.Subject.list() });

  const save = useMutation({
    mutationFn: (d) => editId ? demoClient.entities.Subject.update(editId, d) : demoClient.entities.Subject.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); setShowForm(false); setForm(empty); setEditId(null); toast.success('Saved'); },
  });

  const del = useMutation({
    mutationFn: (id) => demoClient.entities.Subject.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); toast.success('Deleted'); },
  });

  const columns = [
    { header: 'Code', render: (r) => <span className="font-mono text-sm font-medium">{r.code}</span> },
    { header: 'Name', render: (r) => <span className="text-sm font-medium">{r.name}</span> },
    { header: 'Description', render: (r) => <span className="text-sm text-muted-foreground line-clamp-1">{r.description || '—'}</span> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: '',
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setForm({ ...empty, ...r }); setEditId(r.id); setShowForm(true); }}><Pencil className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); del.mutate(r.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Subject Management" subtitle="Manage languages and subjects" action={() => { setForm(empty); setEditId(null); setShowForm(true); }} actionLabel="Add Subject" />
      <DataTable columns={columns} data={subjects} isLoading={isLoading} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Subject' : 'New Subject'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g., English" /></div>
              <div className="space-y-1.5"><Label>Code</Label><Input value={form.code} onChange={e => setField('code', e.target.value)} placeholder="e.g., ENG" /></div>
            </div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={2} /></div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setField('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => save.mutate(form)} disabled={save.isPending}>{editId ? 'Update' : 'Create'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
