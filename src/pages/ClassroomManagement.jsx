import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const empty = { name: '', capacity: 30, equipment: '', status: 'available' };

export default function ClassroomManagement() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const qc = useQueryClient();

  const { data: classrooms = [], isLoading } = useQuery({ queryKey: ['classrooms'], queryFn: () => base44.entities.Classroom.list() });

  const save = useMutation({
    mutationFn: (d) => editId ? base44.entities.Classroom.update(editId, d) : base44.entities.Classroom.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classrooms'] }); setShowForm(false); setForm(empty); setEditId(null); toast.success('Saved'); },
  });

  const del = useMutation({
    mutationFn: (id) => base44.entities.Classroom.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classrooms'] }); toast.success('Deleted'); },
  });

  const columns = [
    { header: 'Room', render: (r) => <span className="font-medium text-sm">{r.name}</span> },
    { header: 'Capacity', render: (r) => <span className="text-sm">{r.capacity} seats</span> },
    { header: 'Equipment', render: (r) => <span className="text-sm text-muted-foreground">{r.equipment || '—'}</span> },
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
      <PageHeader title="Classroom Management" subtitle="Manage rooms and facilities" action={() => { setForm(empty); setEditId(null); setShowForm(true); }} actionLabel="Add Classroom" />
      <DataTable columns={columns} data={classrooms} isLoading={isLoading} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Classroom' : 'New Classroom'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Room Name</Label><Input value={form.name} onChange={e => setField('name', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => setField('capacity', Number(e.target.value))} /></div>
            </div>
            <div className="space-y-1.5"><Label>Equipment</Label><Input value={form.equipment} onChange={e => setField('equipment', e.target.value)} placeholder="Projector, Whiteboard, etc." /></div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setField('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => save.mutate(form)} disabled={save.isPending}>{editId ? 'Update' : 'Create'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}