import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { MovimientosProvider } from '@/features/movimientos/state/movimientos.context';

const App = () => (
  <MovimientosProvider>
    <DashboardPage />
  </MovimientosProvider>
);

export default App;
