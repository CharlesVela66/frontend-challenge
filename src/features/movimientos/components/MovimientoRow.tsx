import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { CATEGORIA_POR_DEFECTO } from '../transformers/normalize.movimiento.transformer';
import type { Estado, Transaction } from '../types/movimiento.types';
import { formatFecha, formatMonto } from '../utils/movimiento.format';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

/** `en_disputa` reads as destructive on purpose — it's the one status that means "something's wrong here," not just "not settled yet." */
const VARIANTE_POR_ESTADO: Record<Estado, BadgeVariant> = {
  confirmada: 'secondary',
  pendiente: 'outline',
  programada: 'outline',
  en_disputa: 'destructive',
  desconocido: 'outline',
};

interface MovimientoRowProps {
  transaction: Transaction;
}

export function MovimientoRow({ transaction }: MovimientoRowProps) {
  const esIngreso = transaction.monto >= 0;
  const esSinCategoria = transaction.categoria === CATEGORIA_POR_DEFECTO;

  return (
    <TableRow>
      <TableCell className="max-w-64 truncate" title={transaction.descripcion}>
        {transaction.descripcion}
      </TableCell>
      <TableCell className={esIngreso ? 'text-emerald-600 dark:text-emerald-400' : undefined}>
        {formatMonto(transaction.monto, transaction.moneda)}
      </TableCell>
      <TableCell>
        <Badge variant={VARIANTE_POR_ESTADO[transaction.estado]}>{transaction.estado}</Badge>
      </TableCell>
      <TableCell>{formatFecha(transaction.fecha)}</TableCell>
      <TableCell>
        <Badge variant={esSinCategoria ? 'outline' : 'secondary'}>{transaction.categoria}</Badge>
      </TableCell>
    </TableRow>
  );
}
