import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Transaction } from '../types/movimiento.types';
import { getMovimientos } from '../services/movimientos.service';

interface MovimientosContextValue {
  transactions: Transaction[];
  /** The one correction path — used by the detail dialog now, and by the (stretch) suggestion engine later. Never applies a change on its own; something has to call this. */
  updateCategoria: (id: string, categoria: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const MovimientosContext = createContext<MovimientosContextValue | undefined>(undefined);

interface MovimientosProviderProps {
  children: ReactNode;
}

/**
 * Single in-memory source of truth for the transaction list. Seeded once
 * from `getMovimientos()` on mount; corrections live only in this state for
 * the session — nothing persists across a reload (see decisions doc).
 */
export function MovimientosProvider({ children }: MovimientosProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => getMovimientos());

  const updateCategoria = useCallback((id: string, categoria: string) => {
    setTransactions((current) =>
      current.map((transaction) => (transaction.id === id ? { ...transaction, categoria } : transaction)),
    );
  }, []);

  const value = useMemo<MovimientosContextValue>(
    () => ({ transactions, updateCategoria }),
    [transactions, updateCategoria],
  );

  return <MovimientosContext.Provider value={value}>{children}</MovimientosContext.Provider>;
}
