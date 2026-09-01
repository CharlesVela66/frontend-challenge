export interface RawMovimiento {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number | string;
  moneda: string;
  categoria: string | null;
  cuenta: string | null;
  estado: string;
}

/** The shape of the JSON file's top level, imported directly (no backend). */
export interface RawMovimientosFile {
  periodo: string;
  generado_en: string;
  movimientos: RawMovimiento[];
}
