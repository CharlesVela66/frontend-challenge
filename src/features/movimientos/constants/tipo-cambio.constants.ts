/**
 * Fixed rate to MXN, keyed by currency code. `'MXN'` deliberately has no
 * entry — it needs no conversion, and the transformer's lookup already
 * treats "not in this table" as "pass through unchanged."
 *
 * This is a static rate, not the transaction date's actual historical
 * rate — there's no FX API wired up for this challenge. See
 * `DECISIONES.md` for what a real version of this would do instead
 * (fetch the daily rate for each transaction's date).
 */
export const TIPOS_CAMBIO_A_MXN: Record<string, number> = {
  USD: 17,
};
