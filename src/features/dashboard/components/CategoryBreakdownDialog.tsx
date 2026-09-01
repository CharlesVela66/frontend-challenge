import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { CategorySpend } from '../utils/spending.metrics';
import { CategoryBreakdownBars } from './CategoryBreakdownBars';

interface CategoryBreakdownDialogProps {
  categorias: CategorySpend[];
}

/**
 * "Ver más" opens this instead of expanding inline in the card (reverses
 * Phase 12's original decision — see DECISIONES.md/PLAN.md for why). The
 * dialog owns its own open state; nothing in `SummaryCards` needs to know
 * whether the breakdown is showing.
 */
export function CategoryBreakdownDialog({ categorias }: CategoryBreakdownDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="mt-2 -ml-2.5" />}>Ver más</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gasto por categoría</DialogTitle>
        </DialogHeader>
        <CategoryBreakdownBars categorias={categorias} />
      </DialogContent>
    </Dialog>
  );
}
