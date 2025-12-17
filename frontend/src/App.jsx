import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FleetDashboard from './pages/FleetDashboard';
import VehicleDetail from './pages/VehicleDetail';
import Insights from './pages/Insights';
import Alerts from './pages/Alerts';
import AgentSecurityConsole from './components/AgentSecurityConsole';
import WireframePage from './pages/WireframePage';
import AppLayout from './components/layout/AppLayout';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<FleetDashboard />} />
                        <Route path="/vehicle/:id" element={<VehicleDetail />} />
                        <Route path="/insights" element={<Insights />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/security" element={<AgentSecurityConsole />} />
                        <Route path="/wireframe" element={<WireframePage />} />
                    </Routes>
                </AppLayout>
            </div>
        </Router>
    );
}

export default App;
