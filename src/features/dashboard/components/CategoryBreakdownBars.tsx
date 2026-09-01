import { formatMonto } from '@/features/movimientos/utils/movimiento.format';
import type { CategorySpend } from '../utils/spending.metrics';

interface CategoryBreakdownBarsProps {
  categorias: CategorySpend[];
}

/**
 * Hand-rolled bars, not a chart library — a single sorted list with a
 * width-percentage div per row does this in a few lines with zero bundle
 * cost. See PLAN.md's stack-decisions table for the full rationale;
 * `recharts` is an explicit optional swap (stretch), not assumed here.
 */
export function CategoryBreakdownBars({ categorias }: CategoryBreakdownBarsProps) {
  if (categorias.length === 0) {
    return <p className="mt-3 text-sm text-muted-foreground">Sin gastos que mostrar.</p>;
  }

  const max = categorias[0]?.total ?? 0;

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {categorias.map((c) => (
        <li key={c.categoria} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">{c.categoria}</span>
            <span className="text-muted-foreground">{formatMonto(c.total, 'MXN')}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${max > 0 ? (c.total / max) * 100 : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
