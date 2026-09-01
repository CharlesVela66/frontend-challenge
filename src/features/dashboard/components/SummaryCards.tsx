import { useMovimientos } from '@/features/movimientos/state/useMovimientos';
import { formatFechaSolo, formatMonto } from '@/features/movimientos/utils/movimiento.format';
import {
  NOTA_ALCANCE_GASTO,
  dayWithHighestSpend,
  spendByCategory,
  topCategory,
  totalIncome,
  totalSpent,
} from '../utils/spending.metrics';
import { CategoryBreakdownDialog } from './CategoryBreakdownDialog';
import { SummaryCard } from './SummaryCard';

/** The cards row: top category, total spent, total income (side by side on purpose), then day with highest spend last. */
export function SummaryCards() {
  const { transactions } = useMovimientos();

  const categoria = topCategory(transactions);
  const gastoTotal = totalSpent(transactions);
  const ingresoTotal = totalIncome(transactions);
  const diaTope = dayWithHighestSpend(transactions);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="Categoría con más gasto"
        value={categoria ? categoria.categoria : 'Sin datos'}
        hint={categoria ? formatMonto(categoria.total, 'MXN') : undefined}
      >
        {categoria ? <CategoryBreakdownDialog categorias={spendByCategory(transactions)} /> : null}
      </SummaryCard>
      <SummaryCard label="Total gastado este mes" value={formatMonto(gastoTotal, 'MXN')} tooltip={NOTA_ALCANCE_GASTO} />
      <SummaryCard
        label="Total ingresado este mes"
        value={formatMonto(ingresoTotal, 'MXN')}
        tooltip={NOTA_ALCANCE_GASTO}
      />
      <SummaryCard
        label="Día con más gasto"
        value={diaTope ? formatFechaSolo(diaTope.fecha) : 'Sin datos'}
        hint={diaTope ? formatMonto(diaTope.total, 'MXN') : undefined}
      />
    </div>
  );
}
