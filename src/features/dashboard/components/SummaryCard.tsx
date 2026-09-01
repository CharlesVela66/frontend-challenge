import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from './InfoTooltip';

interface SummaryCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Caveat shown via a hover/focus info icon next to the label, instead of always-visible text competing with the headline number. */
  tooltip?: ReactNode;
  /** Slot for Phase 12's expandable category breakdown — unused by cards that don't need it. */
  children?: ReactNode;
}

export function SummaryCard({ label, value, hint, tooltip, children }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          {label}
          {tooltip ? <InfoTooltip>{tooltip}</InfoTooltip> : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
        {children}
      </CardContent>
    </Card>
  );
}
