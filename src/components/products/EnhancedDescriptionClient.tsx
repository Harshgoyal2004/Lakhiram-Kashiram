"use client";

import { useState, useEffect } from 'react';
import { getEnhancedOilDescription, type EnhancedOilDescriptionOutput } from '@/ai/flows/enhanced-oil-descriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EnhancedDescriptionClientProps {
  oilName: string;
}

export default function EnhancedDescriptionClient({ oilName }: EnhancedDescriptionClientProps) {
  const [descriptionData, setDescriptionData] = useState<EnhancedOilDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDescription() {
      if (!oilName) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEnhancedOilDescription({ oilName });
        setDescriptionData(data);
      } catch (err) {
        console.error("Failed to fetch enhanced description:", err);
        setError("Could not load detailed information at this time. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDescription();
  }, [oilName]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] bg-card rounded-lg shadow">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Unearthing historical details for {oilName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!descriptionData || !descriptionData.enhancedDescription) {
    return (
        <Card>
            <CardContent className="pt-6">
                <p className="text-muted-foreground">No additional information available for this oil.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="bg-transparent p-0 md:p-0">
      <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line text-center md:text-left">
        {descriptionData.enhancedDescription}
      </p>
    </div>
  );
}
