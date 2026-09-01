import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMovimientos } from '@/features/movimientos/state/useMovimientos';
import { CATEGORIA_POR_DEFECTO } from '@/features/movimientos/transformers/normalize.movimiento.transformer';
import { formatFechaSolo, formatMonto } from '@/features/movimientos/utils/movimiento.format';
import { dayWithHighestSpend, spendByCategory, topCategory, totalSpent } from '../utils/spending.metrics';
import { CategoryBreakdownBars } from './CategoryBreakdownBars';
import { SummaryCard } from './SummaryCard';

/**
 * The cards row. Three cards answer the brief's "where did the money go"
 * requirement; the 4th ("Sin categorizar") is a self-added metric, not
 * something RETO asked for — it makes the `"Otros"` bucket visible as a
 * number instead of something you'd only notice by scrolling the table.
 */
export function SummaryCards() {
  const { transactions } = useMovimientos();
  const [mostrarDesglose, setMostrarDesglose] = useState(false);

  const categoria = topCategory(transactions);
  const gastoTotal = totalSpent(transactions);
  const diaTope = dayWithHighestSpend(transactions);
  const sinCategorizar = transactions.filter((t) => t.enPeriodo && t.categoria === CATEGORIA_POR_DEFECTO).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="Categoría con más gasto"
        value={categoria ? categoria.categoria : 'Sin datos'}
        hint={categoria ? formatMonto(categoria.total, 'MXN') : undefined}
      >
        {categoria ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 -ml-2.5"
              aria-expanded={mostrarDesglose}
              onClick={() => setMostrarDesglose((v) => !v)}
            >
              {mostrarDesglose ? 'Ver menos' : 'Ver más'}
            </Button>
            {mostrarDesglose ? <CategoryBreakdownBars categorias={spendByCategory(transactions)} /> : null}
          </>
        ) : null}
      </SummaryCard>
      <SummaryCard label="Total gastado este mes" value={formatMonto(gastoTotal, 'MXN')} />
      <SummaryCard
        label="Día con más gasto"
        value={diaTope ? formatFechaSolo(diaTope.fecha) : 'Sin datos'}
        hint={diaTope ? formatMonto(diaTope.total, 'MXN') : undefined}
      />
      <SummaryCard
        label="Sin categorizar"
        value={sinCategorizar}
        hint={sinCategorizar > 0 ? 'movimientos por revisar' : 'todo categorizado'}
      />
    </div>
  );
}
