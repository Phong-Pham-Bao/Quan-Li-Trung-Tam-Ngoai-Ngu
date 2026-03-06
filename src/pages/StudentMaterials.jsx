import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Video, Headphones, Presentation, FileSpreadsheet, ExternalLink } from 'lucide-react';

const typeIcons = { document: FileText, video: Video, audio: Headphones, presentation: Presentation, worksheet: FileSpreadsheet, other: FileText };

export default function StudentMaterials({ currentUser }) {
  const email = currentUser?.email;

  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollments', email],
    queryFn: () => base44.entities.Enrollment.filter({ student_email: email }),
    enabled: !!email,
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => base44.entities.TeachingMaterial.list('-created_date'),
  });

  const myCourseIds = enrollments.filter(e => e.status === 'active').map(e => e.course_id);
  const myMaterials = materials.filter(m => myCourseIds.includes(m.course_id));

  return (
    <div className="space-y-6">
      <PageHeader title="Study Materials" subtitle="Resources from your courses" />

      {isLoading ? (
        <div className="grid gap-3">{[1,2,3].map(i => <Card key={i} className="h-20 animate-pulse bg-muted" />)}</div>
      ) : myMaterials.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No materials available for your courses</CardContent></Card>
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
                      {m.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{m.description}</p>}
                    </div>
                  </div>
                  {m.file_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Open
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}