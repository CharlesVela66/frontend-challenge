export const ESTADOS_CONOCIDOS = ['confirmada', 'pendiente', 'programada', 'en_disputa'] as const;

export type EstadoConocido = (typeof ESTADOS_CONOCIDOS)[number];

export type Estado = EstadoConocido | 'desconocido';

export function isEstadoConocido(value: string): value is EstadoConocido {
  return (ESTADOS_CONOCIDOS as readonly string[]).includes(value);
}

export interface Transaction {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number;
  moneda: string;
  categoria: string;
  cuenta: string | null;
  cuentaDesconocida: boolean;
  estado: Estado;
  /**
   * True when `fecha`'s `YYYY-MM` matches the dataset's `periodo`. False
   * only for the one deliberate exception: a `programada` record dated
   */
  enPeriodo: boolean;
}
