import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FleetDashboard from './pages/FleetDashboard';
import VehicleDetail from './pages/VehicleDetail';
import Insights from './pages/Insights';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<FleetDashboard />} />
                    <Route path="/vehicle/:id" element={<VehicleDetail />} />
                    <Route path="/insights" element={<Insights />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
