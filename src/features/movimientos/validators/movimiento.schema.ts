import { z } from 'zod';

export const movimientoSchema = z.object({
  id: z.string(),
  fecha: z.string(),
  descripcion: z.string(),
  monto: z
    .union([z.number(), z.string()])
    .transform((value) => (typeof value === 'number' ? value : Number(value)))
    .refine((value) => Number.isFinite(value), {
      message: 'monto did not parse to a finite number',
    }),
  moneda: z.string(),
  categoria: z.string().nullable(),
  cuenta: z.string().nullable(),
  estado: z.string(),
});

export type MovimientoValidado = z.infer<typeof movimientoSchema>;
