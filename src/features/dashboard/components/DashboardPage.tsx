import { TransactionsTable } from '@/features/movimientos/components/MovimientosTable';
import { getPeriodo } from '@/features/movimientos/services/movimientos.service';
import { SummaryCards } from './SummaryCards';
import { TopBar } from './TopBar';

function periodoLegible(periodo: string): string {
  // periodo is "YYYY-MM"; append a day + neutral time so it parses as
  // local time instead of UTC midnight (see formatFechaSolo's doc comment
  // for why that distinction matters here).
  return new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date(`${periodo}-01T00:00:00`));
}

export function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-xl font-semibold">Tus movimientos de {periodoLegible(getPeriodo())}</h1>
        <p className="text-sm text-muted-foreground">En qué se fue tu dinero este mes, de un vistazo.</p>
      </header>
      <TopBar />
      <SummaryCards />
      <TransactionsTable />
    </div>
  );
}
