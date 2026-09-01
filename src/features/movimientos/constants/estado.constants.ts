import type { Estado } from '../types/movimiento.types';

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

/**
 * `en_disputa` reads as destructive on purpose — it's the one status that
 * means "something's wrong here," not just "not settled yet." Shared
 * between the table row and the detail dialog so the badge always matches.
 */
export const VARIANTE_POR_ESTADO: Record<Estado, BadgeVariant> = {
  confirmada: 'secondary',
  pendiente: 'outline',
  programada: 'outline',
  en_disputa: 'destructive',
  desconocido: 'outline',
};
export const ETIQUETA_POR_ESTADO: Record<Estado, string> = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  programada: 'Programada',
  en_disputa: 'En disputa',
  desconocido: 'Desconocido',
};

export const CLASE_POR_ESTADO: Partial<Record<Estado, string>> = {
  confirmada: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
};
