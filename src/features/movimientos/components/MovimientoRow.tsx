import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { CATEGORIA_POR_DEFECTO } from '../transformers/normalize.movimiento.transformer';
import { CLASE_POR_ESTADO, ETIQUETA_POR_ESTADO, VARIANTE_POR_ESTADO } from '../constants/estado.constants';
import type { Transaction } from '../types/movimiento.types';
import { formatFecha, formatMonto } from '../utils/movimiento.format';

interface MovimientoRowProps {
  transaction: Transaction;
  onSelect: (id: string) => void;
}

export function MovimientoRow({ transaction, onSelect }: MovimientoRowProps) {
  const esIngreso = transaction.monto >= 0;
  const esSinCategoria = transaction.categoria === CATEGORIA_POR_DEFECTO;

  return (
    <TableRow
      tabIndex={0}
      className="cursor-pointer"
      onClick={() => onSelect(transaction.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(transaction.id);
        }
      }}
    >
      <TableCell className="max-w-64 truncate" title={transaction.descripcion}>
        {transaction.descripcion}
      </TableCell>
      <TableCell className={esIngreso ? 'text-emerald-600 dark:text-emerald-400' : undefined}>
        {formatMonto(transaction.monto, transaction.moneda)}
      </TableCell>
      <TableCell>
        <Badge variant={VARIANTE_POR_ESTADO[transaction.estado]} className={CLASE_POR_ESTADO[transaction.estado]}>
          {ETIQUETA_POR_ESTADO[transaction.estado]}
        </Badge>
      </TableCell>
      <TableCell>{formatFecha(transaction.fecha)}</TableCell>
      <TableCell>
        <Badge variant={esSinCategoria ? 'outline' : 'secondary'}>{transaction.categoria}</Badge>
      </TableCell>
    </TableRow>
  );
}
