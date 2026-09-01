import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Slot for Phase 12's expandable category breakdown — unused by cards that don't need it. */
  children?: ReactNode;
}

export function SummaryCard({ label, value, hint, children }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
        {children}
      </CardContent>
    </Card>
  );
}
