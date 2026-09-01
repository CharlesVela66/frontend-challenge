import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMovimientos } from '../state/useMovimientos';
import { MovimientoRow } from './MovimientoRow';

export function TransactionsTable() {
  const { transactions } = useMovimientos();

  // Newest first. `localeCompare` on `fecha` works as a chronological sort
  // here because every record shares the same `-06:00` offset — lexical
  // order and chronological order coincide.
  const ordenadas = [...transactions].sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (ordenadas.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay movimientos que mostrar.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Movimiento</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Categoría</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordenadas.map((transaction) => (
          <MovimientoRow key={transaction.id} transaction={transaction} />
        ))}
      </TableBody>
    </Table>
  );
}
