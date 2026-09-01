import { useContext } from 'react';
import { MovimientosContext } from './movimientos.context';

/** Consuming hook for `MovimientosContext` — throws if used outside `MovimientosProvider` instead of silently returning empty data. */
export function useMovimientos() {
  const context = useContext(MovimientosContext);
  if (!context) {
    throw new Error('useMovimientos must be used within a MovimientosProvider');
  }
  return context;
}
