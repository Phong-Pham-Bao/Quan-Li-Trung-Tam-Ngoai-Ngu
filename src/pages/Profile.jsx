import React, { useState, useEffect } from 'react';
import { demoClient } from '@/api/demoClient';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile({ currentUser }) {
  const [form, setForm] = useState({
    phone: '',
    address: '',
    date_of_birth: '',
    bio: '',
    specialization: '',
    hourly_rate: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        date_of_birth: currentUser.date_of_birth || '',
        bio: currentUser.bio || '',
        specialization: currentUser.specialization || '',
        hourly_rate: currentUser.hourly_rate || '',
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    await demoClient.auth.updateMe(form);
    setSaving(false);
    toast.success('Profile updated');
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isTeacher = currentUser?.role === 'teacher';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{(currentUser?.full_name || 'U').charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{currentUser?.full_name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">Role: {currentUser?.role || 'student'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="Your phone number" /></div>
            <div className="space-y-1.5"><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={e => setField('date_of_birth', e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={e => setField('address', e.target.value)} placeholder="Your address" /></div>
          <div className="space-y-1.5"><Label>Bio</Label><Textarea value={form.bio} onChange={e => setField('bio', e.target.value)} placeholder="Tell us about yourself" rows={3} /></div>

          {isTeacher && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Specialization</Label><Input value={form.specialization} onChange={e => setField('specialization', e.target.value)} placeholder="e.g., English, French" /></div>
              <div className="space-y-1.5"><Label>Hourly Rate ($)</Label><Input type="number" value={form.hourly_rate} onChange={e => setField('hourly_rate', Number(e.target.value))} /></div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
