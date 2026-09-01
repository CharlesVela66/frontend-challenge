import { TooltipProvider } from '@/components/ui/tooltip';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { MovimientosProvider } from '@/features/movimientos/state/movimientos.context';

const App = () => (
  <TooltipProvider>
    <MovimientosProvider>
      <DashboardPage />
    </MovimientosProvider>
  </TooltipProvider>
);

export default App;
