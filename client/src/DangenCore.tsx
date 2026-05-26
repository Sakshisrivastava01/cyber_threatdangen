import { useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CommandCenterLayout from './command-center/CommandCenterLayout';
import LandingPage from './pages/LandingPage';
import NeuralIntrusion from './pages/NeuralIntrusion';
import QuantumRadar from './pages/QuantumRadar';
import DarknetSignals from './pages/DarknetSignals';
import DeviceAnalyzer from './pages/DeviceAnalyzer';
import ThreatPredictionLab from './pages/ThreatPredictionLab';
import AnalyticsCore from './pages/AnalyticsCore';
import ThreatIntelligenceEngine from './pages/ThreatIntelligenceEngine';
import LiveThreatConsole from './pages/LiveThreatConsole';
import IncidentInvestigationWorkspace from './pages/IncidentInvestigationWorkspace';
import NeuralAttackTimeline from './pages/NeuralAttackTimeline';
import ThreatHeatmapOverlay from './pages/ThreatHeatmapOverlay';
import ThreatAdvisoryPanel from './pages/ThreatAdvisoryPanel';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import GlitchTransition from './components/GlitchTransition';
import { useDangenTelemetry } from './neural-hooks/useDangenTelemetry';

const DangenRoutes = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  const navigate = useNavigate();
  const { blockedAttacks, confidenceScore, updateMetrics, connectWebSocket } = useDangenTelemetry();

  // Telemetry simulation loop
  useEffect(() => {
    connectWebSocket();
    const interval = setInterval(() => {
      const active = Math.floor(Math.random() * 20) + 5;
      const blocked = blockedAttacks + Math.floor(Math.random() * 5);
      const conf = Math.min(99, Math.max(85, confidenceScore + (Math.random() > 0.5 ? 1 : -1)));
      updateMetrics(active, blocked, conf);
    }, 5000);
    return () => clearInterval(interval);
  }, [blockedAttacks, confidenceScore, updateMetrics, connectWebSocket]);

  const handleLandingEnter = () => {
    setIsGlitching(true);
  };

  const isAuthenticated = () => window.localStorage.getItem('dangen_auth') === 'true';

  const handleGlitchComplete = () => {
    setIsGlitching(false);
    navigate(isAuthenticated() ? '/dashboard' : '/login');
  };

  const PrivateRoute = ({ children }: { children: ReactNode }) => (
    isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
  );

  const PublicRoute = ({ children }: { children: ReactNode }) => (
    isAuthenticated() ? <Navigate to="/dashboard" replace /> : <>{children}</>
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {isGlitching && <GlitchTransition key="glitch" onComplete={handleGlitchComplete} />}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<LandingPage onEnter={handleLandingEnter} />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/intrusion" element={<CommandCenterLayout><NeuralIntrusion /></CommandCenterLayout>} />
        <Route path="/radar" element={<CommandCenterLayout><QuantumRadar /></CommandCenterLayout>} />
        <Route path="/darknet" element={<CommandCenterLayout><DarknetSignals /></CommandCenterLayout>} />
        <Route path="/device-intelligence" element={<CommandCenterLayout><DeviceAnalyzer /></CommandCenterLayout>} />
        <Route path="/threat-lab" element={<CommandCenterLayout><ThreatPredictionLab /></CommandCenterLayout>} />
        <Route path="/analytics-core" element={<CommandCenterLayout><AnalyticsCore /></CommandCenterLayout>} />
        <Route path="/intelligence" element={<CommandCenterLayout><ThreatIntelligenceEngine /></CommandCenterLayout>} />
        <Route path="/threat-console" element={<CommandCenterLayout><LiveThreatConsole /></CommandCenterLayout>} />
        <Route path="/incident-workspace" element={<CommandCenterLayout><IncidentInvestigationWorkspace /></CommandCenterLayout>} />
        <Route path="/attack-timeline" element={<CommandCenterLayout><NeuralAttackTimeline /></CommandCenterLayout>} />
        <Route path="/heatmap" element={<CommandCenterLayout><ThreatHeatmapOverlay /></CommandCenterLayout>} />
        <Route path="/recommendations" element={<CommandCenterLayout><ThreatAdvisoryPanel /></CommandCenterLayout>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      </Routes>
    </>
  );
};

const DangenCore = () => {
  return (
    <BrowserRouter>
      <DangenRoutes />
    </BrowserRouter>
  );
};

export default DangenCore;
