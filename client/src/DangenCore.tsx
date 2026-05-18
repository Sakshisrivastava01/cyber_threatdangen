import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CommandCenterLayout from './command-center/CommandCenterLayout';
import LandingPage from './pages/LandingPage';
import CommandCenter from './pages/CommandCenter';
import NeuralIntrusion from './pages/NeuralIntrusion';
import QuantumRadar from './pages/QuantumRadar';
import DarknetSignals from './pages/DarknetSignals';
import DeviceAnalyzer from './pages/DeviceAnalyzer';
import ThreatPredictionLab from './pages/ThreatPredictionLab';
import AIAnalyticsCore from './pages/AIAnalyticsCore';
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

  const handleGlitchComplete = () => {
    setIsGlitching(false);
    navigate('/dashboard');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isGlitching && <GlitchTransition key="glitch" onComplete={handleGlitchComplete} />}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<LandingPage onEnter={handleLandingEnter} />} />
        <Route path="/dashboard" element={<CommandCenterLayout><CommandCenter /></CommandCenterLayout>} />
        <Route path="/intrusion" element={<CommandCenterLayout><NeuralIntrusion /></CommandCenterLayout>} />
        <Route path="/radar" element={<CommandCenterLayout><QuantumRadar /></CommandCenterLayout>} />
        <Route path="/darknet" element={<CommandCenterLayout><DarknetSignals /></CommandCenterLayout>} />
        <Route path="/device-intelligence" element={<CommandCenterLayout><DeviceAnalyzer /></CommandCenterLayout>} />
        <Route path="/threat-lab" element={<CommandCenterLayout><ThreatPredictionLab /></CommandCenterLayout>} />
        <Route path="/ai-analytics" element={<CommandCenterLayout><AIAnalyticsCore /></CommandCenterLayout>} />
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
