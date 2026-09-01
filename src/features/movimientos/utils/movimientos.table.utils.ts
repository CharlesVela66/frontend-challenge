import type { Estado, Transaction } from '../types/movimiento.types';

export type ColumnaOrden = 'fecha' | 'monto' | 'descripcion' | 'categoria' | 'estado';
export type DireccionOrden = 'asc' | 'desc';

export interface FiltrosTabla {
  busqueda?: string;
  /** `undefined` = sin filtro de categoría. */
  categoria?: string;
  /** `undefined` = sin filtro de estado. */
  estado?: Estado;
  ordenarPor?: ColumnaOrden;
  direccion?: DireccionOrden;
}

/** Lowercase + strip diacritics, so a search for "cafe" matches "CAFÉ BRÚJULA" (finding #13). */
function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Search (on `descripcion` only), category filter, estado filter — combined
 * with AND — then a single-column sort. Pure and React-free on purpose:
 * the component owns the state, this just answers "given these options,
 * what's the resulting list."
 */
export function filtrarYOrdenarMovimientos(transactions: Transaction[], filtros: FiltrosTabla): Transaction[] {
  const { busqueda = '', categoria, estado, ordenarPor = 'fecha', direccion = 'desc' } = filtros;
  const busquedaNormalizada = normalizarTexto(busqueda.trim());

  const filtrados = transactions.filter((t) => {
    if (categoria && t.categoria !== categoria) return false;
    if (estado && t.estado !== estado) return false;
    if (busquedaNormalizada && !normalizarTexto(t.descripcion).includes(busquedaNormalizada)) return false;
    return true;
  });

  const signo = direccion === 'asc' ? 1 : -1;

  return filtrados.sort((a, b) => {
    switch (ordenarPor) {
      case 'monto':
        return (a.monto - b.monto) * signo;
      case 'descripcion':
        return a.descripcion.localeCompare(b.descripcion, 'es') * signo;
      case 'categoria':
        return a.categoria.localeCompare(b.categoria, 'es') * signo;
      case 'estado':
        return a.estado.localeCompare(b.estado, 'es') * signo;
      case 'fecha':
      default:
        // Lexical order == chronological order: every fecha shares the same `-06:00` offset.
        return a.fecha.localeCompare(b.fecha) * signo;
    }
  });
}
