import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Languages, ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Languages className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-lg text-muted-foreground mt-2">Page not found</p>
          <p className="text-sm text-muted-foreground mt-1">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <Button asChild>
          <Link to={createPageUrl('AdminDashboard')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}