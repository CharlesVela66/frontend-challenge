import { Separator } from '@/components/ui/separator';
import { useMovimientos } from '@/features/movimientos/state/useMovimientos';
import { formatMonto } from '@/features/movimientos/utils/movimiento.format';
import { netMovement, pendingTotal } from '../utils/top-bar.metrics';

/**
 * Deliberately does not say "saldo disponible" anywhere — this dataset has
 * no opening balance, so "movimiento neto" is the honest label for a net
 * delta of the visible movements, not a balance.
 */
export function TopBar() {
  const { transactions } = useMovimientos();

  const neto = netMovement(transactions);
  const pendiente = pendingTotal(transactions);

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Movimiento neto este mes</p>
        <p
          className={
            neto >= 0
              ? 'text-2xl font-semibold text-emerald-600 dark:text-emerald-400'
              : 'text-2xl font-semibold text-destructive'
          }
        >
          {formatMonto(neto, 'MXN')}
        </p>
      </div>
      <Separator orientation="vertical" className="hidden h-10 sm:block" />
      <div>
        <p className="text-sm text-muted-foreground">Pagos pendientes</p>
        <p className="text-2xl font-semibold">{formatMonto(pendiente, 'MXN')}</p>
      </div>
    </div>
  );
}
