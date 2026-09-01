import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCategoriasConocidas } from '../constants/categorias.constants';
import { useMovimientos } from '../state/useMovimientos';
import type { ColumnaOrden, DireccionOrden } from '../utils/movimientos.table.utils';
import { filtrarYOrdenarMovimientos } from '../utils/movimientos.table.utils';
import type { Estado } from '../types/movimiento.types';
import { MovimientoDetailDialog } from './MovimientoDetailDialog';
import { MovimientoRow } from './MovimientoRow';

const TAMANO_PAGINA = 10;
const TODAS_CATEGORIAS = '__todas__';
const TODOS_ESTADOS = '__todos__';

const COLUMNAS: { columna: ColumnaOrden; etiqueta: string }[] = [
  { columna: 'descripcion', etiqueta: 'Movimiento' },
  { columna: 'monto', etiqueta: 'Monto' },
  { columna: 'estado', etiqueta: 'Estado' },
  { columna: 'fecha', etiqueta: 'Fecha' },
  { columna: 'categoria', etiqueta: 'Categoría' },
];

interface EncabezadoOrdenableProps {
  columna: ColumnaOrden;
  etiqueta: string;
  ordenActual: ColumnaOrden;
  direccion: DireccionOrden;
  onOrdenar: (columna: ColumnaOrden) => void;
}

function EncabezadoOrdenable({ columna, etiqueta, ordenActual, direccion, onOrdenar }: EncabezadoOrdenableProps) {
  const activa = ordenActual === columna;

  return (
    <TableHead aria-sort={activa ? (direccion === 'asc' ? 'ascending' : 'descending') : undefined}>
      <button
        type="button"
        onClick={() => onOrdenar(columna)}
        className="inline-flex items-center gap-1 font-medium hover:text-foreground"
      >
        {etiqueta}
        {activa ? <span aria-hidden="true">{direccion === 'asc' ? '▲' : '▼'}</span> : null}
      </button>
    </TableHead>
  );
}

export function TransactionsTable() {
  const { transactions } = useMovimientos();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState(TODAS_CATEGORIAS);
  const [estadoFiltro, setEstadoFiltro] = useState(TODOS_ESTADOS);
  const [ordenarPor, setOrdenarPor] = useState<ColumnaOrden>('fecha');
  const [direccion, setDireccion] = useState<DireccionOrden>('desc');
  const [pagina, setPagina] = useState(1);

  const categorias = getCategoriasConocidas(transactions);
  const estados = [...new Set(transactions.map((t) => t.estado))];

  const resultado = filtrarYOrdenarMovimientos(transactions, {
    busqueda,
    categoria: categoriaFiltro === TODAS_CATEGORIAS ? undefined : categoriaFiltro,
    estado: estadoFiltro === TODOS_ESTADOS ? undefined : (estadoFiltro as Estado),
    ordenarPor,
    direccion,
  });

  const totalPaginas = Math.max(1, Math.ceil(resultado.length / TAMANO_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * TAMANO_PAGINA;
  const paginaActual = resultado.slice(inicio, inicio + TAMANO_PAGINA);

  function alternarOrden(columna: ColumnaOrden) {
    if (ordenarPor === columna) {
      setDireccion((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrdenarPor(columna);
      setDireccion('asc');
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(1);
          }}
          placeholder="Buscar por descripción…"
          className="sm:max-w-64"
        />
        <Select
          value={categoriaFiltro}
          onValueChange={(value) => {
            setCategoriaFiltro(value ?? TODAS_CATEGORIAS);
            setPagina(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS_CATEGORIAS}>Todas las categorías</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={estadoFiltro}
          onValueChange={(value) => {
            setEstadoFiltro(value ?? TODOS_ESTADOS);
            setPagina(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS_ESTADOS}>Todos los estados</SelectItem>
            {estados.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {resultado.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {transactions.length === 0
            ? 'No hay movimientos que mostrar.'
            : 'Ningún movimiento coincide con la búsqueda o los filtros.'}
        </p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNAS.map(({ columna, etiqueta }) => (
                  <EncabezadoOrdenable
                    key={columna}
                    columna={columna}
                    etiqueta={etiqueta}
                    ordenActual={ordenarPor}
                    direccion={direccion}
                    onOrdenar={alternarOrden}
                  />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginaActual.map((transaction) => (
                <MovimientoRow key={transaction.id} transaction={transaction} onSelect={setSelectedId} />
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Página {paginaSegura} de {totalPaginas} ({resultado.length} movimientos)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaSegura <= 1}
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaSegura >= totalPaginas}
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      <MovimientoDetailDialog
        transactionId={selectedId}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}
