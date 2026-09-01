import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface InfoTooltipProps {
  children: ReactNode;
}

/** A small info-icon trigger revealing `children` on hover/focus — for a caveat that matters but shouldn't compete with the headline number for attention. */
export function InfoTooltip({ children }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button type="button" className="inline-flex text-muted-foreground hover:text-foreground" />
        }
      >
        <Info className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Más información</span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}
