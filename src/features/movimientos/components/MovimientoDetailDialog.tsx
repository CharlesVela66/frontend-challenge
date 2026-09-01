import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategoriasConocidas } from '../constants/categorias.constants';
import { VARIANTE_POR_ESTADO } from '../constants/estado.constants';
import { useMovimientos } from '../state/useMovimientos';
import { formatFechaHora, formatMonto } from '../utils/movimiento.format';

interface MovimientoDetailDialogProps {
  /** `null` means closed — there's no separate `open` prop, the dialog is only ever showing one transaction or nothing. */
  transactionId: string | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Does double duty on purpose (requirement #4): shows the full transaction
 * detail AND hosts the category-correction `Select` in the same view,
 * instead of a separate "view" and "edit" UI. `updateCategoria` is the
 * only thing that ever changes a transaction's category — this dialog
 * calls it, it never applies a change on its own initiative.
 */
export function MovimientoDetailDialog({ transactionId, onOpenChange }: MovimientoDetailDialogProps) {
  const { transactions, updateCategoria } = useMovimientos();
  const transaction = transactions.find((t) => t.id === transactionId);
  const categorias = getCategoriasConocidas(transactions);

  return (
    <Dialog open={transactionId !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {transaction ? (
          <>
            <DialogHeader>
              <DialogTitle>{transaction.descripcion}</DialogTitle>
              <DialogDescription>{transaction.id}</DialogDescription>
            </DialogHeader>

            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Cuenta</dt>
              <dd>{transaction.cuenta}</dd>

              <dt className="text-muted-foreground">Fecha</dt>
              <dd>{formatFechaHora(transaction.fecha)}</dd>

              <dt className="text-muted-foreground">Monto</dt>
              <dd className={transaction.monto >= 0 ? 'text-emerald-600 dark:text-emerald-400' : undefined}>
                {formatMonto(transaction.monto, transaction.moneda)}
              </dd>

              <dt className="text-muted-foreground">Estado</dt>
              <dd>
                <Badge variant={VARIANTE_POR_ESTADO[transaction.estado]}>{transaction.estado}</Badge>
              </dd>
            </dl>

            <div className="flex flex-col gap-1.5">
              <span id="movimiento-categoria-label" className="text-sm text-muted-foreground">
                Categoría
              </span>
              <Select
                value={transaction.categoria}
                onValueChange={(categoria) => updateCategoria(transaction.id, categoria!)}
              >
                <SelectTrigger aria-labelledby="movimiento-categoria-label" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
