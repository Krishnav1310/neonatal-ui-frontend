import { useState, useEffect, useRef } from 'react';
import { 
  AlertCircle, Shield, Camera, Bell, Activity, Heart, Wind, Zap, Mic, RefreshCcw, 
  ArrowLeft, Sliders, LayoutGrid, AlertTriangle, Volume2, VolumeX, Key, Delete, 
  Flame, HelpCircle, Thermometer, Clock, FileText, ShieldAlert, ChevronRight, Check
} from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Fallback dynamic ward data for standalone Vercel preview or backend syncing
const getInitialWardData = () => ({
  activeBabyId: "NB-2026-001",
  motionMonitoring: {
    status: "SAFE",
    stillTime: 0,
    motion: 240,
    confidence: 98,
    breathingRate: 45,
    breathingStatus: "NORMAL",
    alertActive: false
  },
  cryDetection: {
    status: "normal",
    cryType: "Calm / None",
    confidence: 95
  },
  sleepPosition: {
    position: "Back",
    status: "safe",
    riskLevel: "low",
    timeInPosition: 42,
    confidence: 94
  },
  settings: {
    movementPixelThreshold: 50,
    minMotionArea: 100,
    significantMotionThreshold: 2000,
    apneaAlertTime: 20,
    stillnessWarningTime: 12,
    slowBreathingRate: 30
  },
  babies: [
    {
      id: "NB-2026-001",
      name: "Aarav Sharma",
      age: "3 days old",
      weight: "3.2 kg",
      gestationalAge: "38 weeks",
      admissionDate: "Jan 21, 2026",
      incubatorUnit: "Unit #01",
      status: "SAFE",
      simulationMode: "off",
      vitals: { heartRate: 142, respRate: 45, spo2: 98, temp: 36.8 },
      stillTime: 0,
      cryStatus: "normal",
      sleepPos: "Back",
      isLiveSource: true,
      apneaEpisodes: 0,
      shiftSummary: { hrMin: 134, hrMax: 152, spo2Min: 96, spo2Max: 99, tempMin: 36.6, tempMax: 37.0 }
    },
    {
      id: "NB-2026-002",
      name: "Kiara Patel",
      age: "5 days old",
      weight: "2.9 kg",
      gestationalAge: "37 weeks",
      admissionDate: "Jan 19, 2026",
      incubatorUnit: "Unit #02",
      status: "WARNING",
      simulationMode: "off",
      vitals: { heartRate: 135, respRate: 26, spo2: 96, temp: 36.5 },
      stillTime: 4,
      cryStatus: "normal",
      sleepPos: "Back",
      isLiveSource: false,
      apneaEpisodes: 1,
      shiftSummary: { hrMin: 128, hrMax: 146, spo2Min: 94, spo2Max: 98, tempMin: 36.4, tempMax: 36.8 }
    },
    {
      id: "NB-2026-003",
      name: "Aditya Rao",
      age: "2 days old",
      weight: "3.1 kg",
      gestationalAge: "39 weeks",
      admissionDate: "Jan 22, 2026",
      incubatorUnit: "Unit #03",
      status: "UNSAFE",
      simulationMode: "off",
      vitals: { heartRate: 92, respRate: 0, spo2: 90, temp: 36.2 },
      stillTime: 22,
      cryStatus: "normal",
      sleepPos: "Stomach",
      isLiveSource: false,
      apneaEpisodes: 3,
      shiftSummary: { hrMin: 88, hrMax: 140, spo2Min: 89, spo2Max: 97, tempMin: 36.0, tempMax: 36.6 }
    },
    {
      id: "NB-2026-004",
      name: "Riya Sen",
      age: "6 days old",
      weight: "3.4 kg",
      gestationalAge: "38 weeks",
      admissionDate: "Jan 18, 2026",
      incubatorUnit: "Unit #04",
      status: "SAFE",
      simulationMode: "off",
      vitals: { heartRate: 145, respRate: 48, spo2: 99, temp: 36.9 },
      stillTime: 0,
      cryStatus: "normal",
      sleepPos: "Side",
      isLiveSource: false,
      apneaEpisodes: 0,
      shiftSummary: { hrMin: 136, hrMax: 154, spo2Min: 97, spo2Max: 100, tempMin: 36.7, tempMax: 37.1 }
    },
    {
      id: "NB-2026-005",
      name: "Vivaan Kapoor",
      age: "4 days old",
      weight: "2.7 kg",
      gestationalAge: "36 weeks",
      admissionDate: "Jan 20, 2026",
      incubatorUnit: "Unit #05",
      status: "SAFE",
      simulationMode: "off",
      vitals: { heartRate: 152, respRate: 54, spo2: 97, temp: 37.1 },
      stillTime: 0,
      cryStatus: "distress",
      sleepPos: "Back",
      isLiveSource: false,
      apneaEpisodes: 0,
      shiftSummary: { hrMin: 142, hrMax: 165, spo2Min: 95, spo2Max: 99, tempMin: 36.8, tempMax: 37.3 }
    },
    {
      id: "NB-2026-006",
      name: "Ananya Nair",
      age: "7 days old",
      weight: "3.3 kg",
      gestationalAge: "39 weeks",
      admissionDate: "Jan 17, 2026",
      incubatorUnit: "Unit #06",
      status: "OFFLINE",
      simulationMode: "off",
      vitals: { heartRate: 0, respRate: 0, spo2: 0, temp: 0 },
      stillTime: 0,
      cryStatus: "normal",
      sleepPos: "Standby",
      isLiveSource: false,
      apneaEpisodes: 0,
      shiftSummary: { hrMin: 0, hrMax: 0, spo2Min: 0, spo2Max: 0, tempMin: 0, tempMax: 0 }
    }
  ],
  alerts: [
    { id: 1, type: "critical", message: "CRITICAL: Apnea threshold exceeded (22s stillness) - Incubator #03", timestamp: "12:44:10 PM", patientId: "NB-2026-003", acknowledged: false },
    { id: 2, type: "warning", message: "WARNING: Bradypnea slow breathing detected (26 BPM) - Incubator #02", timestamp: "12:40:05 PM", patientId: "NB-2026-002", acknowledged: false },
    { id: 3, type: "warning", message: "DISTRESS: High-intensity Cry Pattern recognized - Incubator #05", timestamp: "12:35:18 PM", patientId: "NB-2026-005", acknowledged: true },
    { id: 4, type: "info", message: "INFO: Normal sleep posture verified (Back supine) - Incubator #01", timestamp: "12:20:00 PM", patientId: "NB-2026-001", acknowledged: true },
    { id: 5, type: "info", message: "INFO: Clinical telemetry link initialized for 5 Ward incubators", timestamp: "12:00:00 PM", patientId: "ALL", acknowledged: true }
  ]
});

// Robust history generator
const generateHistory = () => Array.from({ length: 30 }, (_, i) => ({ 
  time: i, 
  motion: Math.floor(Math.random() * 80) + 160, 
  breathing: Math.floor(Math.random() * 8) + 42,
  heartRate: Math.floor(Math.random() * 6) + 138,
  spo2: Math.floor(Math.random() * 2) + 98,
  temp: 36.8
}));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [data, setData] = useState<any>(getInitialWardData());
  const [history, setHistory] = useState<any[]>(generateHistory());
  const [error, setError] = useState<string | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'monitor' | 'history' | 'alerts' | 'settings'>('overview');
  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(false);
  const [isSimPanelExpanded, setIsSimPanelExpanded] = useState<boolean>(true);
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  
  // Settings Form values
  const [settingsForm, setSettingsForm] = useState({
    movementPixelThreshold: 50,
    minMotionArea: 100,
    significantMotionThreshold: 2000,
    apneaAlertTime: 20,
    stillnessWarningTime: 12,
    slowBreathingRate: 30
  });

  // 0. Sync Camera Status with Backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/camera_status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: isCameraEnabled })
    }).catch(err => console.error("Camera sync error:", err));
  }, [isCameraEnabled]);

  // 1. Data Polling with Local Fallback Simulation
  useEffect(() => {
    if (!isAuthenticated) return;

    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard`);
        if (!res.ok) throw new Error("Using Local Telemetry Simulator");
        const json = await res.json();
        setData(json);
        setError(null);

        // Update Waveform Data from backend
        setHistory(prev => {
          const activeBaby = json.babies?.find((b: any) => b.id === json.activeBabyId) || {};
          const newEntry = {
            time: prev.length,
            motion: json.motionMonitoring?.motion || 0,
            breathing: json.motionMonitoring?.breathingRate || activeBaby.vitals?.respRate || 45,
            heartRate: activeBaby.vitals?.heartRate || 140,
            spo2: activeBaby.vitals?.spo2 || 98,
            temp: activeBaby.vitals?.temp || 36.8
          };
          return [...prev.slice(-29), newEntry];
        });
      } catch (err: any) {
        // Standalone simulator fallback loop when backend is unreachable
        setData((prevData: any) => {
          const activeId = prevData.activeBabyId;
          const updatedBabies = prevData.babies.map((baby: any) => {
            if (baby.status === 'OFFLINE') return baby;
            
            // If manual simulation mode is active
            if (baby.simulationMode === 'apnea') {
              const newStill = baby.stillTime + 1;
              return {
                ...baby,
                stillTime: newStill,
                status: newStill >= 20 ? 'UNSAFE' : (newStill >= 12 ? 'WARNING' : 'SAFE'),
                vitals: { ...baby.vitals, respRate: 0, heartRate: Math.max(85, baby.vitals.heartRate - 1), spo2: Math.max(88, baby.vitals.spo2 - 1) }
              };
            }
            if (baby.simulationMode === 'crying') {
              return {
                ...baby,
                stillTime: 0,
                status: 'SAFE',
                cryStatus: 'distress',
                vitals: { ...baby.vitals, respRate: 54, heartRate: 156, spo2: 97, temp: 37.2 }
              };
            }
            if (baby.simulationMode === 'normal') {
              return {
                ...baby,
                stillTime: 0,
                status: 'SAFE',
                cryStatus: 'normal',
                vitals: { ...baby.vitals, respRate: 45, heartRate: 142, spo2: 98, temp: 36.8 }
              };
            }

            // Default auto simulation for Aditya Rao (NB-003)
            if (baby.id === 'NB-2026-003') {
              return {
                ...baby,
                stillTime: 22,
                status: 'UNSAFE',
                vitals: { ...baby.vitals, heartRate: 92, respRate: 0, spo2: 90, temp: 36.2 }
              };
            }

            // Normal subtle vital jitter
            const hrJitter = Math.floor(Math.random() * 3) - 1;
            const respJitter = Math.floor(Math.random() * 3) - 1;
            return {
              ...baby,
              vitals: {
                ...baby.vitals,
                heartRate: Math.min(160, Math.max(120, baby.vitals.heartRate + hrJitter)),
                respRate: Math.min(60, Math.max(35, baby.vitals.respRate + respJitter))
              }
            };
          });

          const activeBaby = updatedBabies.find((b: any) => b.id === activeId) || updatedBabies[0];
          
          return {
            ...prevData,
            babies: updatedBabies,
            motionMonitoring: {
              ...prevData.motionMonitoring,
              motion: activeBaby.isLiveSource && isCameraEnabled ? prevData.motionMonitoring.motion : (activeBaby.status === 'UNSAFE' ? 12 : 240),
              breathingRate: activeBaby.vitals.respRate,
              breathingStatus: activeBaby.vitals.respRate === 0 ? 'APNEA' : (activeBaby.vitals.respRate < 30 ? 'SLOW' : 'NORMAL'),
              stillTime: activeBaby.stillTime,
              status: activeBaby.status
            }
          };
        });

        // Push to local waveform history
        setHistory(prev => {
          const activeBaby = data.babies?.find((b: any) => b.id === data.activeBabyId) || {};
          const newEntry = {
            time: prev.length,
            motion: activeBaby.status === 'UNSAFE' ? 10 : (Math.floor(Math.random() * 60) + 200),
            breathing: activeBaby.vitals?.respRate || 45,
            heartRate: activeBaby.vitals?.heartRate || 140,
            spo2: activeBaby.vitals?.spo2 || 98,
            temp: activeBaby.vitals?.temp || 36.8
          };
          return [...prev.slice(-29), newEntry];
        });
      }
    };

    const interval = setInterval(poll, 800);
    return () => clearInterval(interval);
  }, [isAuthenticated, isCameraEnabled, data.activeBabyId]);

  // Sync settings when backend dashboard data loads
  useEffect(() => {
    if (data?.settings) {
      setSettingsForm(data.settings);
    }
  }, [data?.settings]);

  // 2. Apnea Alarm Sound Logic
  useEffect(() => {
    let alarm: any;
    
    // Check if active baby has a crisis, OR if ANY simulated/inactive baby is in UNSAFE status
    const isLocalCrisis = isCameraEnabled && (data?.motionMonitoring?.status === 'UNSAFE' || (data?.motionMonitoring?.stillTime >= (data?.settings?.apneaAlertTime || 20)));
    const isSimulatedCrisis = data?.babies?.some((b: any) => b.status === 'UNSAFE');
    const isCrisis = isLocalCrisis || isSimulatedCrisis;

    if (isCrisis && isAuthenticated && !isMasterMuted) {
      const playAlarm = () => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1000, ctx.currentTime);
          g.gain.setValueAtTime(0.08, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
          setTimeout(() => ctx.close(), 800);
        } catch (e) { }
      };
      playAlarm();
      alarm = setInterval(playAlarm, 1000);
    }
    return () => clearInterval(alarm);
  }, [data, isAuthenticated, isCameraEnabled, isMasterMuted]);

  // Select baby and request selection from API
  const handleSelectBaby = async (babyId: string) => {
    setData((prev: any) => ({ ...prev, activeBabyId: babyId }));
    try {
      await fetch(`${API_BASE_URL}/api/select_baby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: babyId })
      });
      const dashboardRes = await fetch(`${API_BASE_URL}/api/dashboard`);
      if (dashboardRes.ok) {
        setData(await dashboardRes.json());
      }
    } catch (e) {
      // Local fallback handled by state update
    }
    setActiveTab('monitor');
  };

  // Acknowledge Alert Handler
  const handleAcknowledgeAlert = (alertId: number) => {
    setData((prev: any) => ({
      ...prev,
      alerts: prev.alerts.map((a: any) => a.id === alertId ? { ...a, acknowledged: true } : a)
    }));
  };

  // Submit revised settings thresholds to backend
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setData((prev: any) => ({ ...prev, settings: settingsForm }));
    try {
      await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      alert("Framework thresholds updated successfully!");
      setActiveTab('overview');
    } catch (e) {
      alert("Applied locally in simulation mode.");
      setActiveTab('overview');
    }
  };

  // Trigger simulation state on backend or local state
  const handleSimulateState = async (babyId: string, mode: string) => {
    setData((prev: any) => ({
      ...prev,
      babies: prev.babies.map((b: any) => b.id === babyId ? { ...b, simulationMode: mode } : b)
    }));
    try {
      await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: babyId, mode: mode })
      });
      const dashboardRes = await fetch(`${API_BASE_URL}/api/dashboard`);
      if (dashboardRes.ok) {
        setData(await dashboardRes.json());
      }
    } catch (e) { }
  };

  // Dynamic AI Clinical Risk Calculator
  const computePatientRisk = (baby: any, mm: any) => {
    if (!baby || baby.status === 'OFFLINE') {
      return { overall: 'OFFLINE', score: 0, color: '#94A3B8', respRisk: 0, cardiacRisk: 0, thermalRisk: 0, neuroRisk: 0, recommendation: 'Incubator is currently on standby.' };
    }

    const hr = baby.vitals?.heartRate || 140;
    const rr = baby.vitals?.respRate ?? mm?.breathingRate ?? 45;
    const spo2 = baby.vitals?.spo2 || 98;
    const temp = baby.vitals?.temp || 36.8;
    const still = baby.stillTime || 0;

    let respScore = 5;
    if (rr === 0 || still >= 15) respScore = 95;
    else if (rr < 30 || rr > 65 || still >= 8) respScore = 65;
    else if (spo2 < 92) respScore = 80;
    else if (spo2 < 95) respScore = 40;

    let cardiacScore = 5;
    if (hr < 95 || hr > 185) cardiacScore = 90;
    else if (hr < 110 || hr > 170) cardiacScore = 55;

    let thermalScore = 5;
    if (temp < 36.0 || temp > 38.0) thermalScore = 85;
    else if (temp < 36.5 || temp > 37.5) thermalScore = 45;

    let neuroScore = 5;
    if (baby.cryStatus === 'distress') neuroScore = 65;
    if (baby.sleepPos === 'Stomach') neuroScore = Math.max(neuroScore, 70);

    const overallScore = Math.round((respScore * 0.4) + (cardiacScore * 0.3) + (thermalScore * 0.15) + (neuroScore * 0.15));

    let overall = 'LOW';
    let color = 'var(--mint)';
    let recommendation = 'Vitals within normal neonatal physiological range. Routine surveillance active.';

    if (overallScore >= 70 || baby.status === 'UNSAFE' || still >= 15) {
      overall = 'CRITICAL RISK';
      color = 'var(--secondary)';
      recommendation = '🚨 Immediate clinical intervention required: Apnea or Bradycardia event active. Stimulate infant breathing.';
    } else if (overallScore >= 35 || baby.status === 'WARNING' || still >= 8) {
      overall = 'MODERATE RISK';
      color = 'var(--accent)';
      recommendation = '⚠️ Borderline physiological variance detected. Monitor chest wall excursion and SpO2 closely.';
    }

    return { overall, score: overallScore, color, respRisk: respScore, cardiacRisk: cardiacScore, thermalRisk: thermalScore, neuroRisk: neuroScore, recommendation };
  };

  // 3. Render Handling
  try {
    if (!isAuthenticated) return <AuthFlow onLogin={() => setIsAuthenticated(true)} />;

    const mm = data.motionMonitoring || {};
    const cd = data.cryDetection || {};
    const al = data.alerts || [];
    const babiesList = data.babies || [];
    const settings = data.settings || {};

    const activeBabyObj = babiesList.find((b: any) => b.id === data.activeBabyId) || babiesList[0] || {};
    
    // Check local crisis thresholds based on settings
    const apneaLimit = settings.apneaAlertTime || 20;
    const isCritical = activeBabyObj.status === 'UNSAFE' || mm.status === 'UNSAFE' || (mm.stillTime >= apneaLimit);
    const isWarning = activeBabyObj.status === 'WARNING' || mm.status === 'WARNING';
    const isCrisis = isCritical || isWarning;

    // Check if any baby in the entire ward is in crisis
    const anyWardCritical = babiesList.some((b: any) => b.status === 'UNSAFE');

    // Initials Helper
    const getInitials = (name: string) => {
      if (!name) return "NB";
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Active Patient Risk Assessment
    const risk = computePatientRisk(activeBabyObj, mm);

    // Filtered alerts
    const filteredAlerts = al.filter((a: any) => {
      if (alertFilter === 'all') return true;
      return a.type === alertFilter;
    });

    return (
      <div className={`fade-up ${isCrisis || anyWardCritical ? 'alert-pulse' : ''}`} style={{ minHeight: '100vh', padding: '40px', display: 'flex', gap: '40px' }}>
        
        {/* Sidebar Nav */}
        <aside className="premium-card glass-panel" style={{ width: '320px', padding: '40px 24px', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px', paddingLeft: '8px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 20px var(--glow)' }}>
              <Heart fill="white" size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px' }}>NEO-CARE</h1>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px' }}>CLINICAL WARD HUB</span>
            </div>
          </div>

          <nav style={{ flex: 1 }}>
            <div 
              className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}
            >
              <LayoutGrid size={20} /> Ward Overview
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'monitor' ? 'active' : ''}`} 
              onClick={() => setActiveTab('monitor')}
            >
              <Activity size={20} /> Detailed Monitor
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`} 
              onClick={() => setActiveTab('history')}
            >
              <Clock size={20} /> Patient History Log
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'alerts' ? 'active' : ''}`} 
              onClick={() => setActiveTab('alerts')}
            >
              <Bell size={20} /> Alert History ({al.filter((a: any) => !a.acknowledged && a.type === 'critical').length > 0 ? '🚨' : al.length})
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('settings')}
            >
              <Sliders size={20} /> Threshold Settings
            </div>
          </nav>

          {/* Active Patient Card in Sidebar */}
          <div style={{ marginTop: '20px', padding: '16px 20px', background: 'rgba(255,255,255,0.6)', borderRadius: '20px', border: '1px solid var(--surface-border)', marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>ACTIVE PATIENT</div>
            <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '15px', marginTop: '4px' }}>{activeBabyObj.name || "Aarav Sharma"}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>{activeBabyObj.id} • {activeBabyObj.incubatorUnit || "Unit #01"}</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px', fontSize: '11px', fontWeight: 800, color: activeBabyObj.simulationMode !== 'off' ? 'var(--accent)' : 'var(--mint)' }}>
              <div style={{ width: '8px', height: '8px', background: activeBabyObj.simulationMode !== 'off' ? 'var(--accent)' : 'var(--mint)', borderRadius: '50%', animation: 'pulse-soft 1s infinite' }} />
              {activeBabyObj.simulationMode !== 'off' ? `Sim Mode (${activeBabyObj.simulationMode})` : "Vision Feed Active"}
            </div>
          </div>

          <button onClick={() => window.location.reload()} className="vibrant-btn" style={{ width: '100%', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <RefreshCcw size={18} /> RESET TELEMETRY
          </button>
        </aside>

        {/* Main Workspace */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '35px', overflowX: 'hidden' }}>
          
          {/* ============================================================== */}
          {/* VIEW: WARD OVERVIEW (GOOGLE MEET GRID STYLE - 5 BABIES + STANDBY) */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Ward Overview Dashboard</h2>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Active Neonatal ICU Incubators (Central 5-Patient Ward Telemetry)</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button 
                    onClick={() => setIsMasterMuted(!isMasterMuted)} 
                    style={{ padding: '12px 20px', background: 'white', border: '1px solid var(--surface-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                  >
                    {isMasterMuted ? <VolumeX size={18} color="var(--secondary)" /> : <Volume2 size={18} color="var(--mint)" />}
                    {isMasterMuted ? "WARD MUTED" : "ALARM VOL: 100%"}
                  </button>
                  {anyWardCritical && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', background: 'var(--secondary)', color: 'white', borderRadius: '20px', fontWeight: 900, animation: 'pulse-soft 1s infinite' }}>
                      <AlertTriangle size={20} /> WARD ALARM ACTIVE
                    </div>
                  )}
                </div>
              </header>

              <div className="meet-grid">
                {babiesList.map((baby: any) => {
                  const isCurrentActive = baby.id === data.activeBabyId;
                  const isBabyCritical = baby.status === 'UNSAFE';
                  const isBabyWarning = baby.status === 'WARNING' || baby.status === 'STILL';
                  
                  return (
                    <div 
                      key={baby.id} 
                      className={`meet-tile ${isCurrentActive ? 'active-focus' : ''} ${isBabyCritical ? 'critical-pulse' : (isBabyWarning ? 'warning-pulse' : '')}`}
                      onClick={() => handleSelectBaby(baby.id)}
                    >
                      {/* Vitals Overlay Chip Row (HR, Resp Rate, SpO2, and Temperature) */}
                      {baby.status !== 'OFFLINE' && (
                        <div className="meet-vitals-overlay">
                          <div className="meet-vital-item" title="Heart Rate (BPM)">
                            <Heart size={12} fill="var(--secondary)" color="var(--secondary)" className={baby.vitals?.heartRate > 0 ? "heartbeat-icon" : ""} /> 
                            {baby.vitals?.heartRate} <span style={{ fontSize: '9px', opacity: 0.7 }}>BPM</span>
                          </div>
                          <div className="meet-vital-item" title="Respiratory Rate (BPM)">
                            <Wind size={12} color="var(--primary)" /> 
                            {baby.vitals?.respRate} <span style={{ fontSize: '9px', opacity: 0.7 }}>RR</span>
                          </div>
                          <div className="meet-vital-item" title="Oxygen Saturation (SpO2)">
                            <Zap size={12} color="var(--mint)" /> 
                            {baby.vitals?.spo2}%
                          </div>
                          <div className="meet-vital-item" title="Body Temperature (°C)">
                            <Thermometer size={12} color="var(--accent)" /> 
                            {baby.vitals?.temp || 36.8}°C
                          </div>
                        </div>
                      )}

                      {/* Participant Tile Center (Camera feed or Initials Avatar) */}
                      <div className="meet-avatar-container">
                        {baby.isLiveSource && isCameraEnabled && isCurrentActive && baby.simulationMode === 'off' ? (
                          <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, borderRadius: '22px', overflow: 'hidden' }}>
                            <CameraPreview isAlert={isCritical} isEnabled={isCameraEnabled} />
                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '8px', fontSize: '9px', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '6px', height: '6px', background: 'var(--secondary)', borderRadius: '50%', animation: 'pulse-soft 0.8s infinite' }} />
                              WEBCAM ACTIVE
                            </div>
                          </div>
                        ) : (
                          <div className="meet-avatar" style={{
                            background: baby.status === 'OFFLINE' ? '#475569' : 
                                       isBabyCritical ? 'linear-gradient(135deg, var(--secondary), #be123c)' : 
                                       isBabyWarning ? 'linear-gradient(135deg, var(--accent), #d97706)' : 
                                       'linear-gradient(135deg, var(--primary), var(--lavender))'
                          }}>
                            {getInitials(baby.name)}
                          </div>
                        )}
                      </div>

                      {/* Bottom Info bar */}
                      <div className="meet-bottom-info">
                        <div>
                          <div className="meet-name">{baby.name}</div>
                          <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700 }}>
                            {baby.incubatorUnit || "Unit"} • {baby.age} • {baby.weight} • GA {baby.gestationalAge}
                          </div>
                        </div>
                        <span className={`meet-status-badge ${
                          baby.status === 'SAFE' ? 'safe' : 
                          baby.status === 'OFFLINE' ? 'offline' : 
                          baby.status === 'UNSAFE' ? 'danger' : 'warning'
                        }`}>
                          {baby.status === 'UNSAFE' ? 'Apnea Crisis' : (baby.cryStatus === 'distress' ? 'Cry Distress' : baby.status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* VIEW: DETAILED VITALS & CLINICAL MONITOR */}
          {/* ============================================================== */}
          {activeTab === 'monitor' && (
            <>
              {/* Header Navigation & Quick Patient Switcher */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button 
                      onClick={() => setActiveTab('overview')} 
                      style={{ background: 'white', border: '1px solid var(--surface-border)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                      title="Back to Ward Overview"
                    >
                      <ArrowLeft size={20} color="var(--text-main)" />
                    </button>
                    <div>
                      <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Detailed Patient Monitor</h2>
                      <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Real-time Bedside Telemetry & Multi-Modal AI Surveillance</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button 
                      onClick={() => setIsMasterMuted(!isMasterMuted)} 
                      style={{ padding: '12px 20px', background: 'white', border: '1px solid var(--surface-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                    >
                      {isMasterMuted ? <VolumeX size={18} color="var(--secondary)" /> : <Volume2 size={18} color="var(--mint)" />}
                      {isMasterMuted ? "MUTED" : "UNMUTED"}
                    </button>
                    <div style={{ padding: '12px 24px', borderRadius: '20px', background: 'white', border: '1px solid var(--surface-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>PATIENT CLINICAL STATE</div>
                      <div style={{ fontWeight: 900, color: isCritical ? 'var(--secondary)' : (isWarning ? 'var(--accent)' : 'var(--mint)') }}>
                        {isCritical ? '🚨 CRITICAL APNEA CRISIS' : (isWarning ? (mm.breathingStatus === 'SLOW' ? '⚠️ SLOW BREATHING' : '⚠️ SHALLOW BREATHING') : '🟢 STABLE SURVEILLANCE')}
                      </div>
                    </div>
                  </div>
                </header>

                {/* Patient Profile Card & Quick Patient Switcher */}
                <div className="premium-card glass-panel" style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, var(--primary), var(--lavender))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '20px' }}>
                      {getInitials(activeBabyObj.name)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 900 }}>{activeBabyObj.name}</h3>
                        <span style={{ padding: '4px 10px', background: '#F1F5F9', borderRadius: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>{activeBabyObj.id}</span>
                        <span style={{ padding: '4px 10px', background: 'rgba(93,183,255,0.1)', borderRadius: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>{activeBabyObj.incubatorUnit || "Unit #01"}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>
                        <span><strong>Age:</strong> {activeBabyObj.age}</span>
                        <span>•</span>
                        <span><strong>Weight:</strong> {activeBabyObj.weight}</span>
                        <span>•</span>
                        <span><strong>Gestational Age:</strong> {activeBabyObj.gestationalAge}</span>
                        <span>•</span>
                        <span><strong>Admitted:</strong> {activeBabyObj.admissionDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Switcher Pill Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginRight: '4px' }}>SWITCH:</span>
                    {babiesList.filter((b: any) => b.status !== 'OFFLINE').map((b: any) => (
                      <button 
                        key={b.id}
                        onClick={() => handleSelectBaby(b.id)}
                        className={`patient-pill ${b.id === activeBabyObj.id ? 'active' : ''}`}
                      >
                        {b.name.split(' ')[0]} ({b.id.split('-')[2]})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* PRIMARY 4 CLINICAL STATS: HR, SpO2, RESPIRATORY RATE, TEMPERATURE */}
              {/* ============================================================== */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                
                {/* 1. Heart Rate (HR) */}
                <StatCard
                  label="Heart Rate (HR)"
                  value={activeBabyObj.vitals?.heartRate || 142}
                  unit="BPM"
                  color={activeBabyObj.vitals?.heartRate < 100 ? 'var(--secondary)' : (activeBabyObj.vitals?.heartRate > 170 ? 'var(--accent)' : 'var(--secondary)')}
                  icon={<Heart fill="var(--secondary)" className={activeBabyObj.vitals?.heartRate > 0 ? "heartbeat-icon" : ""} />}
                  rangeInfo="Normal: 120 - 160 BPM"
                  statusBadge={activeBabyObj.vitals?.heartRate < 100 ? "Bradycardia Alert" : (activeBabyObj.vitals?.heartRate > 170 ? "Tachycardia" : "Normal Sinus Rhythm")}
                  trendBadge="Stable ➡️"
                  isFlashing={activeBabyObj.vitals?.heartRate < 100}
                />

                {/* 2. Oxygen Saturation (SpO2) */}
                <StatCard
                  label="Oxygen Saturation (SpO₂)"
                  value={activeBabyObj.vitals?.spo2 || 98}
                  unit="%"
                  color={activeBabyObj.vitals?.spo2 < 92 ? 'var(--secondary)' : (activeBabyObj.vitals?.spo2 < 95 ? 'var(--accent)' : 'var(--mint)')}
                  icon={<Zap />}
                  rangeInfo="Target: 95% - 100%"
                  statusBadge={activeBabyObj.vitals?.spo2 < 92 ? "Hypoxia Warning" : "Optimal Perfusion"}
                  trendBadge="Optimal 🟢"
                  isFlashing={activeBabyObj.vitals?.spo2 < 92}
                />

                {/* 3. Respiratory Rate (RR) */}
                <StatCard
                  label="Respiratory Rate (RR)"
                  value={mm.breathingRate || activeBabyObj.vitals?.respRate || 0}
                  unit="BPM"
                  color={mm.breathingRate === 0 || activeBabyObj.vitals?.respRate === 0 ? 'var(--secondary)' : (mm.breathingRate < 30 ? 'var(--accent)' : 'var(--primary)')}
                  icon={<Wind />}
                  rangeInfo="Target: 40 - 60 BPM"
                  statusBadge={mm.breathingRate === 0 ? "Apnea Detected" : (mm.breathingRate < 30 ? "Bradypnea Slow" : "Normal Respiration")}
                  trendBadge={mm.breathingRate === 0 ? "Critical 🔴" : "Normal ➡️"}
                  isFlashing={mm.breathingRate === 0 || mm.breathingRate < 30}
                />

                {/* 4. Body Temperature */}
                <StatCard
                  label="Body Temperature"
                  value={activeBabyObj.vitals?.temp || 36.8}
                  unit="°C"
                  color={activeBabyObj.vitals?.temp < 36.5 ? 'var(--accent)' : 'var(--lavender)'}
                  icon={<Thermometer />}
                  rangeInfo={`Normal: 36.5°C - 37.5°C (${(((activeBabyObj.vitals?.temp || 36.8) * 9/5) + 32).toFixed(1)}°F)`}
                  statusBadge={activeBabyObj.vitals?.temp < 36.5 ? "Mild Hypothermia" : "Normothermic"}
                  trendBadge="Optimal 🟢"
                  isFlashing={activeBabyObj.vitals?.temp < 36.0}
                />

              </div>

              {/* Secondary Computer Vision Telemetry Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <MiniTelemetryCard label="Motion Displacement" value={`${Math.round(mm.motion || 0)} px`} sub="Chest Area Movement" icon={<Activity size={18} color="var(--primary)" />} />
                <MiniTelemetryCard label="Apnea Countdown Timer" value={`${mm.stillTime || 0}s`} sub={`Alarm at ${settings.apneaAlertTime || 20}s`} icon={<Clock size={18} color={mm.stillTime >= 12 ? 'var(--secondary)' : 'var(--mint)'} />} isAlert={mm.stillTime >= 12} />
                <MiniTelemetryCard label="Sleep Posture" value={activeBabyObj.sleepPos || "Back"} sub="Position: Optimal" icon={<Shield size={18} color="var(--lavender)" />} />
                <MiniTelemetryCard label="Acoustic Cry AI" value={activeBabyObj.cryStatus === 'distress' ? "DISTRESS DETECTED" : "Calm / Quiet"} sub="Audio Neural Net" icon={<Mic size={18} color={activeBabyObj.cryStatus === 'distress' ? 'var(--secondary)' : 'var(--mint)'} />} isAlert={activeBabyObj.cryStatus === 'distress'} />
              </div>

              {/* Live Video Feed & Dual Trend Waveforms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '30px' }}>
                
                {/* Vision Camera Preview Panel */}
                <div className="premium-card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '20px 26px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontWeight: 900, fontSize: '17px' }}>Optical Vision Core</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Live pixel difference chest excursion tracker</p>
                    </div>
                    {activeBabyObj.isLiveSource && activeBabyObj.simulationMode === 'off' ? (
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>CAMERA CONTROL</span>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={isCameraEnabled}
                              onChange={() => setIsCameraEnabled(!isCameraEnabled)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{ width: '8px', height: '8px', background: isCameraEnabled ? 'var(--mint)' : 'var(--text-muted)', borderRadius: '50%', animation: isCameraEnabled ? 'pulse-soft 1s infinite' : 'none' }} />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: isCameraEnabled ? 'var(--mint)' : 'var(--text-muted)' }}>{isCameraEnabled ? 'LIVE' : 'OFFLINE'}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,210,63,0.1)', padding: '6px 12px', borderRadius: '10px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', animation: 'pulse-soft 1.2s infinite' }} />
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)' }}>SIMULATION OVERRIDE</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, position: 'relative', minHeight: '320px' }}>
                    {activeBabyObj.isLiveSource && activeBabyObj.simulationMode === 'off' ? (
                      <CameraPreview isAlert={isCritical} isEnabled={isCameraEnabled} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'absolute', inset: 0 }}>
                        <div className="meet-avatar" style={{ marginBottom: '20px', width: '100px', height: '100px', fontSize: '36px', background: activeBabyObj.status === 'UNSAFE' ? 'var(--secondary)' : 'var(--primary)' }}>{getInitials(activeBabyObj.name)}</div>
                        <h4 style={{ fontSize: '20px', fontWeight: 800 }}>{activeBabyObj.name}</h4>
                        <p style={{ opacity: 0.6, fontSize: '13px', marginTop: '5px' }}>
                          {activeBabyObj.simulationMode !== 'off' 
                            ? `Simulation Mode active: ${activeBabyObj.simulationMode.toUpperCase()}`
                            : 'Patient vitals simulated electronically over telemetry'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Double Trend Charts Container (Trend Detection) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Chart 1: Respiration & Chest Motion Trend */}
                  <div className="premium-card glass-panel" style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontWeight: 900, fontSize: '14px' }}>Respiratory Rate & Motion Signal</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="trend-badge stable">Respiration: {activeBabyObj.vitals?.respRate || mm.breathingRate || 45} BPM ➡️</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800 }}>Apnea Count: {activeBabyObj.apneaEpisodes || 0}</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, minHeight: '120px' }}>
                      <LiveWaveform data={history} line1="breathing" line2="motion" stroke1="var(--primary)" stroke2="var(--lavender)" gradientId="breathG" />
                    </div>
                  </div>

                  {/* Chart 2: Bedside Trend: Heart Rate & SpO2 */}
                  <div className="premium-card glass-panel" style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontWeight: 900, fontSize: '14px' }}>Bedside Trend: Heart Rate (BPM) & SpO₂ (%)</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="trend-badge stable">HR: {activeBabyObj.vitals?.heartRate || 142} BPM</span>
                        <span className="trend-badge stable">SpO₂: {activeBabyObj.vitals?.spo2 || 98}%</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, minHeight: '120px' }}>
                      <LiveWaveform data={history} line1="heartRate" line2="spo2" stroke1="var(--secondary)" stroke2="var(--mint)" gradientId="vitalsG" />
                    </div>
                  </div>

                </div>

              </div>

              {/* ============================================================== */}
              {/* AI RISK PREDICTION & RECENT CLINICAL EVENT LOG */}
              {/* ============================================================== */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                
                {/* Clinical AI Risk Prediction Panel */}
                <div className="premium-card glass-panel" style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldAlert size={22} color={risk.color} />
                      <h3 style={{ fontWeight: 900, fontSize: '18px' }}>AI Clinical Risk Prediction</h3>
                    </div>
                    <span style={{ padding: '6px 16px', background: `${risk.color}20`, color: risk.color, borderRadius: '12px', fontWeight: 900, fontSize: '13px' }}>
                      {risk.overall} (Score: {risk.score}/100)
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                    {risk.recommendation}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>🫁 Respiratory Risk</span>
                        <span style={{ color: risk.respRisk > 50 ? 'var(--secondary)' : 'var(--mint)' }}>{risk.respRisk}%</span>
                      </div>
                      <div className="risk-meter-track">
                        <div className="risk-meter-fill" style={{ width: `${risk.respRisk}%`, background: risk.respRisk > 50 ? 'var(--secondary)' : 'var(--mint)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>❤️ Cardiac / Bradycardia Risk</span>
                        <span style={{ color: risk.cardiacRisk > 50 ? 'var(--secondary)' : 'var(--mint)' }}>{risk.cardiacRisk}%</span>
                      </div>
                      <div className="risk-meter-track">
                        <div className="risk-meter-fill" style={{ width: `${risk.cardiacRisk}%`, background: risk.cardiacRisk > 50 ? 'var(--secondary)' : 'var(--mint)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>🌡️ Thermal Stability</span>
                        <span style={{ color: risk.thermalRisk > 50 ? 'var(--accent)' : 'var(--mint)' }}>{risk.thermalRisk}%</span>
                      </div>
                      <div className="risk-meter-track">
                        <div className="risk-meter-fill" style={{ width: `${risk.thermalRisk}%`, background: risk.thermalRisk > 50 ? 'var(--accent)' : 'var(--mint)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>🧠 Neurological Distress</span>
                        <span style={{ color: risk.neuroRisk > 50 ? 'var(--accent)' : 'var(--mint)' }}>{risk.neuroRisk}%</span>
                      </div>
                      <div className="risk-meter-track">
                        <div className="risk-meter-fill" style={{ width: `${risk.neuroRisk}%`, background: risk.neuroRisk > 50 ? 'var(--accent)' : 'var(--mint)' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Event Log Preview */}
                <div className="premium-card glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ fontWeight: 900, fontSize: '16px' }}>Security & Clinical Events</h3>
                    <button 
                      onClick={() => setActiveTab('alerts')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {al.slice(0, 3).map((a: any) => {
                      const isCriticalLog = a.type === 'critical';
                      const isWarningLog = a.type === 'warning';
                      return (
                        <div 
                          key={a.id} 
                          style={{ 
                            padding: '12px 18px', 
                            background: isCriticalLog ? 'rgba(255,133,161,0.08)' : (isWarningLog ? 'rgba(255,210,63,0.08)' : '#F8FAFC'), 
                            borderRadius: '14px', 
                            fontSize: '12px', 
                            fontWeight: 700, 
                            borderLeft: `4px solid ${isCriticalLog ? 'var(--secondary)' : (isWarningLog ? 'var(--accent)' : 'var(--primary)')}`, 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid rgba(0,0,0,0.04)'
                          }}
                        >
                          <span style={{ color: isCriticalLog ? '#9f1239' : '#1e293b' }}>{a.message}</span>
                          <span style={{ opacity: 0.5, fontSize: '10px' }}>{a.timestamp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* VIEW: PATIENT CLINICAL HISTORY & CARE LOG */}
          {/* ============================================================== */}
          {activeTab === 'history' && (
            <>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Patient Clinical History & Shift Log</h2>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Chronological care milestone tracking and vital ranges for {activeBabyObj.name} ({activeBabyObj.id})</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {babiesList.filter((b: any) => b.status !== 'OFFLINE').map((b: any) => (
                    <button 
                      key={b.id}
                      onClick={() => handleSelectBaby(b.id)}
                      className={`patient-pill ${b.id === activeBabyObj.id ? 'active' : ''}`}
                    >
                      {b.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </header>

              {/* 24-Hour Shift Vital Sign Min/Max Ranges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <div className="premium-card glass-panel" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>24H HEART RATE RANGE</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--secondary)', margin: '6px 0' }}>
                    {activeBabyObj.shiftSummary?.hrMin || 132} - {activeBabyObj.shiftSummary?.hrMax || 156} <span style={{ fontSize: '12px' }}>BPM</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Mean HR: 144 BPM • 0 Arrhythmias</div>
                </div>

                <div className="premium-card glass-panel" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>24H SpO₂ RANGE</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--mint)', margin: '6px 0' }}>
                    {activeBabyObj.shiftSummary?.spo2Min || 94}% - {activeBabyObj.shiftSummary?.spo2Max || 100}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Optimal Perfusion Time: 99.2%</div>
                </div>

                <div className="premium-card glass-panel" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>24H TEMPERATURE RANGE</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--lavender)', margin: '6px 0' }}>
                    {activeBabyObj.shiftSummary?.tempMin || 36.5}°C - {activeBabyObj.shiftSummary?.tempMax || 37.1}°C
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Normothermic Incubator Air Shield</div>
                </div>

                <div className="premium-card glass-panel" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>APNEA & CRISIS EPISODES</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: activeBabyObj.apneaEpisodes > 0 ? 'var(--secondary)' : 'var(--mint)', margin: '6px 0' }}>
                    {activeBabyObj.apneaEpisodes || 0} <span style={{ fontSize: '12px' }}>Episodes</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Auto Tactile Alarms Triggered</div>
                </div>
              </div>

              {/* Patient Care Timeline */}
              <div className="premium-card glass-panel" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '24px' }}>Clinical Care Milestones & Shift Activity Timeline</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="timeline-item">
                    <div className="timeline-dot" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '14px', color: 'var(--text-main)' }}>Physician Neonatologist Rounds Completed</div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>14:30 PM (Today)</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Baby evaluated for respiratory regularity and feeding tolerance. Gestational milestone on track.</p>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-dot" style={{ background: 'var(--lavender)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '14px', color: 'var(--text-main)' }}>Sleep Posture Adjusted to Back (Supine)</div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>13:45 PM</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Nurse swaddled infant into back-sleeping position to minimize SIDS risk and ensure clear airway.</p>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-dot" style={{ background: 'var(--mint)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '14px', color: 'var(--text-main)' }}>Enteral Feeding Administered (35ml)</div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>12:15 PM</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Expressed maternal breast milk administered via orogastric feed. No desaturation episodes noted.</p>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-dot" style={{ background: 'var(--primary)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '14px', color: 'var(--text-main)' }}>Telemetry Calibration & Baseline Setup</div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>10:00 AM</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Computer vision camera aligned with incubator frame. YAMNet acoustic baby cry detection linked.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* VIEW: COMPLETE ALERT & EVENT AUDIT HISTORY */}
          {/* ============================================================== */}
          {activeTab === 'alerts' && (
            <>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Alert & Event Audit History</h2>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Comprehensive multi-incubator clinical telemetry alarm logs</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setAlertFilter('all')} 
                    className={`alert-filter-btn ${alertFilter === 'all' ? 'active' : ''}`}
                  >
                    All ({al.length})
                  </button>
                  <button 
                    onClick={() => setAlertFilter('critical')} 
                    className={`alert-filter-btn ${alertFilter === 'critical' ? 'active' : ''}`}
                  >
                    🔴 Critical ({al.filter((a: any) => a.type === 'critical').length})
                  </button>
                  <button 
                    onClick={() => setAlertFilter('warning')} 
                    className={`alert-filter-btn ${alertFilter === 'warning' ? 'active' : ''}`}
                  >
                    🟡 Warnings ({al.filter((a: any) => a.type === 'warning').length})
                  </button>
                  <button 
                    onClick={() => setAlertFilter('info')} 
                    className={`alert-filter-btn ${alertFilter === 'info' ? 'active' : ''}`}
                  >
                    🔵 Info ({al.filter((a: any) => a.type === 'info').length})
                  </button>
                </div>
              </header>

              <div className="premium-card glass-panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredAlerts.length > 0 ? filteredAlerts.map((a: any) => {
                    const isCritical = a.type === 'critical';
                    const isWarning = a.type === 'warning';
                    return (
                      <div 
                        key={a.id} 
                        style={{ 
                          padding: '16px 24px', 
                          background: isCritical ? 'rgba(255,133,161,0.08)' : (isWarning ? 'rgba(255,210,63,0.08)' : '#F8FAFC'), 
                          borderRadius: '16px', 
                          borderLeft: `5px solid ${isCritical ? 'var(--secondary)' : (isWarning ? 'var(--accent)' : 'var(--primary)')}`, 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          border: '1px solid rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: isCritical ? 'var(--secondary)' : (isWarning ? 'var(--accent)' : 'var(--primary)'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isCritical ? <AlertTriangle size={18} /> : (isWarning ? <Bell size={18} /> : <FileText size={18} />)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: isCritical ? '#9f1239' : '#1e293b' }}>
                              {a.message}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 700 }}>
                              Patient: {a.patientId || "All"} • Timestamp: {a.timestamp}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {a.acknowledged ? (
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--mint)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={14} /> Acknowledged
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleAcknowledgeAlert(a.id)}
                              style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', color: 'var(--text-main)' }}
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontWeight: 700 }}>
                      No alerts matching filter criteria.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* VIEW: FRAMEWORK SETTINGS */}
          {activeTab === 'settings' && (
            <>
              <header>
                <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Framework Parameter Settings</h2>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Fine-tune computer vision motion sensitivities and timing thresholds</p>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                <div className="premium-card glass-panel" style={{ padding: '40px' }}>
                  <form onSubmit={handleSaveSettings}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '24px', color: 'var(--primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>Computer Vision Sensitivities</h3>
                        
                        <div className="settings-group">
                          <label className="settings-label">
                            <span>Pixel Motion Sensitivity</span>
                            <span className="settings-value">{settingsForm.movementPixelThreshold} Lvl</span>
                          </label>
                          <input 
                            type="range" min="10" max="150" step="5"
                            value={settingsForm.movementPixelThreshold}
                            onChange={e => setSettingsForm({...settingsForm, movementPixelThreshold: parseInt(e.target.value)})}
                            className="settings-slider"
                          />
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Higher values require stronger pixel differences to count as movement (filters noise).</p>
                        </div>

                        <div className="settings-group">
                          <label className="settings-label">
                            <span>Minimum Motion Area</span>
                            <span className="settings-value">{settingsForm.minMotionArea} px</span>
                          </label>
                          <input 
                            type="range" min="20" max="400" step="10"
                            value={settingsForm.minMotionArea}
                            onChange={e => setSettingsForm({...settingsForm, minMotionArea: parseInt(e.target.value)})}
                            className="settings-slider"
                          />
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Minimum area block (in pixels) of localized movement to register chest displacement.</p>
                        </div>

                        <div className="settings-group">
                          <label className="settings-label">
                            <span>Significant Motion Reset</span>
                            <span className="settings-value">{settingsForm.significantMotionThreshold} px</span>
                          </label>
                          <input 
                            type="range" min="500" max="5000" step="100"
                            value={settingsForm.significantMotionThreshold}
                            onChange={e => setSettingsForm({...settingsForm, significantMotionThreshold: parseInt(e.target.value)})}
                            className="settings-slider"
                          />
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Movement pixel count threshold required to reset the clinical apnea timer.</p>
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '24px', color: 'var(--secondary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>Apnea & Breathing Alarm timings</h3>

                        <div className="settings-group">
                          <label className="settings-label">
                            <span>Apnea Alert Trigger</span>
                            <span className="settings-value">{settingsForm.apneaAlertTime} seconds</span>
                          </label>
                          <input 
                            type="range" min="5" max="40" step="1"
                            value={settingsForm.apneaAlertTime}
                            onChange={e => setSettingsForm({...settingsForm, apneaAlertTime: parseInt(e.target.value)})}
                            className="settings-slider"
                          />
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Stillness duration required to trigger a CRITICAL APNEA alarm alert (Default 20s).</p>
                        </div>

                        <div className="settings-group">
                          <label className="settings-label">
                            <span>Stillness Warning Time</span>
                            <span className="settings-value">{settingsForm.stillnessWarningTime} seconds</span>
                          </label>
                          <input 
                            type="range" min="3" max="25" step="1"
                            value={settingsForm.stillnessWarningTime}
                            onChange={e => setSettingsForm({...settingsForm, stillnessWarningTime: parseInt(e.target.value)})}
                            className="settings-slider"
                          />
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Stillness duration before transitioning to STILL warning state (Default 12s).</p>
                        </div>

                        <div className="settings-group">
                          <label className="settings-label">
                            <span>Bradypnea Limit (Slow Breath)</span>
                            <span className="settings-value">{settingsForm.slowBreathingRate} BPM</span>
                          </label>
                          <input 
                            type="range" min="15" max="35" step="1"
                            value={settingsForm.slowBreathingRate}
                            onChange={e => setSettingsForm({...settingsForm, slowBreathingRate: parseInt(e.target.value)})}
                            className="settings-slider"
                          />
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Breathing rate threshold under which a slow breathing warning is flagged (Default 30 BPM).</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: '40px', borderTop: '1px solid var(--surface-border)', paddingTop: '20px' }}>
                      <button 
                        type="button" 
                        onClick={() => {
                          setSettingsForm({
                            movementPixelThreshold: 50,
                            minMotionArea: 100,
                            significantMotionThreshold: 2000,
                            apneaAlertTime: 20,
                            stillnessWarningTime: 12,
                            slowBreathingRate: 30
                          });
                        }} 
                        style={{ padding: '15px 30px', background: '#F1F5F9', border: 'none', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        Reset Defaults
                      </button>
                      <button 
                        type="submit" 
                        className="vibrant-btn" 
                        style={{ padding: '15px 40px' }}
                      >
                        Apply Framework Settings
                      </button>
                    </div>

                  </form>
                </div>

                {/* Real-time Threshold Preview Feedback Gauge */}
                <div className="premium-card glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '20px', color: 'var(--primary)' }}>Live Motion Threshold Preview</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                    Adjust parameters on the left and see how the live camera feed motion registers relative to your Significant Motion Reset threshold.
                  </p>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
                    
                    {/* Live Gauge */}
                    <div style={{ position: 'relative', marginTop: '20px' }}>
                      <div className="settings-label">
                        <span>Webcam Chest Movement Feed</span>
                        <span>{Math.round(mm.motion || 0)} px</span>
                      </div>
                      
                      <div className="live-gauge-track">
                        {/* Gauge filling */}
                        <div 
                          className={`live-gauge-bar ${mm.motion > settingsForm.significantMotionThreshold ? 'over-threshold' : ''}`}
                          style={{ width: `${Math.min(100, ((mm.motion || 0) / 4000) * 100)}%` }} 
                        />
                        {/* Threshold Marker */}
                        <div 
                          className="live-gauge-marker"
                          style={{ left: `${Math.min(100, (settingsForm.significantMotionThreshold / 4000) * 100)}%` }}
                        >
                          <div className="live-gauge-marker-label">THRESHOLD</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '20px', border: '1px solid var(--surface-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: mm.motion > settingsForm.significantMotionThreshold ? 'var(--mint)' : 'var(--secondary)', borderRadius: '50%' }} />
                        <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-main)' }}>
                          {mm.motion > settingsForm.significantMotionThreshold 
                            ? "TIMERS RESET: Movement Detected" 
                            : "STILLNESS ACCUMULATING: No significant motion"}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        When the motion bar (Webcam displacement) crosses to the right of the red THRESHOLD line, the apnea countdown timer resets back to 0.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </>
          )}

        </main>

        {/* ============================================================== */}
        {/* INTERACTIVE CLINICAL STATE SIMULATOR (FLOATING WIDGET) */}
        {/* ============================================================== */}
        <div className="sim-controller-card" style={{ height: isSimPanelExpanded ? 'auto' : '52px' }}>
          <div 
            className="sim-controller-header" 
            onClick={() => setIsSimPanelExpanded(!isSimPanelExpanded)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame size={16} color="var(--secondary)" />
              <span style={{ fontSize: '12px', fontWeight: 900 }}>CLINICAL STATE SIMULATOR</span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 800, opacity: 0.7 }}>
              {isSimPanelExpanded ? "COLLAPSE" : "EXPAND"}
            </span>
          </div>

          {isSimPanelExpanded && (
            <div className="sim-controller-content">
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800 }}>
                SELECT SIM STATE FOR: {activeBabyObj.name?.toUpperCase()}
              </div>

              <button 
                className={`sim-btn normal ${activeBabyObj.simulationMode === 'normal' ? 'active' : ''}`}
                onClick={() => handleSimulateState(activeBabyObj.id, 'normal')}
              >
                <span>Force Normal Vitals</span>
                <Sliders size={14} />
              </button>

              <button 
                className={`sim-btn warning ${activeBabyObj.simulationMode === 'crying' ? 'active' : ''}`}
                onClick={() => handleSimulateState(activeBabyObj.id, 'crying')}
              >
                <span>Trigger Cry Distress</span>
                <Mic size={14} />
              </button>

              <button 
                className={`sim-btn danger ${activeBabyObj.simulationMode === 'apnea' ? 'active' : ''}`}
                onClick={() => handleSimulateState(activeBabyObj.id, 'apnea')}
              >
                <span>Trigger Apnea Crisis</span>
                <AlertCircle size={14} />
              </button>

              <button 
                className={`sim-btn off ${activeBabyObj.simulationMode === 'off' ? 'active' : ''}`}
                onClick={() => handleSimulateState(activeBabyObj.id, 'off')}
              >
                <span>Disable Overrides (Webcam Feed)</span>
                <Camera size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Apnea Alarm Overlay */}
        {isCritical && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(255, 133, 161, 0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ padding: '60px 80px', background: 'var(--secondary)', color: 'white', borderRadius: '40px', textAlign: 'center', boxShadow: '0 40px 100px rgba(255,133,161,0.5)', animation: 'fadeUp 0.4s ease-out' }}>
              <AlertCircle size={80} style={{ marginBottom: '20px' }} />
              <h1 style={{ fontSize: '48px', fontWeight: 1000 }}>CRITICAL WARD ALARM</h1>
              <p style={{ fontSize: '20px', fontWeight: 700, opacity: 0.9 }}>APNEA EMERGENCY DETECTED: STILLNESS ALARM</p>
              <div style={{ marginTop: '20px', padding: '10px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', fontSize: '15px', fontWeight: 800 }}>
                Patient: {activeBabyObj.name} ({activeBabyObj.id}) • {activeBabyObj.incubatorUnit}
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
                <button 
                  onClick={() => {
                    handleSimulateState(activeBabyObj.id, 'normal');
                  }} 
                  style={{ padding: '12px 30px', background: 'white', color: 'var(--secondary)', border: 'none', borderRadius: '14px', fontWeight: 900, cursor: 'pointer' }}
                >
                  Force Recovery (Normal Vitals)
                </button>
                <button 
                  onClick={() => {
                    handleSimulateState(activeBabyObj.id, 'off');
                  }} 
                  style={{ padding: '12px 30px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '14px', fontWeight: 900, cursor: 'pointer' }}
                >
                  Clear Override
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (renderError: any) {
    console.error("Dashboard Render Failed:", renderError);
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF1F2' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ color: '#E11D48', fontWeight: 900 }}>DASHBOARD RENDER CRASH</h1>
          <pre style={{ background: 'white', padding: '20px', borderRadius: '15px', marginTop: '20px', color: '#64748B', overflow: 'auto' }}>{renderError.message}</pre>
          <button onClick={() => window.location.reload()} className="vibrant-btn" style={{ marginTop: '20px', padding: '15px 30px' }}>RECOVERY REBOOT</button>
        </div>
      </div>
    );
  }
}

// Enhanced Primary Stats Card Component
function StatCard({ label, value, unit, color, icon, rangeInfo, statusBadge, trendBadge, isFlashing }: any) {
  return (
    <div className={`premium-card glass-panel ${isFlashing ? 'alert-border-flash' : ''}`} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
          {icon}
        </div>
        {trendBadge && (
          <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 8px', background: '#F8FAFC', borderRadius: '8px', color: 'var(--text-muted)', border: '1px solid var(--surface-border)' }}>
            {trendBadge}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 900, color, marginTop: '2px' }}>
          {value} <span style={{ fontSize: '13px', fontWeight: 700, opacity: 0.6 }}>{unit}</span>
        </div>
      </div>
      <div style={{ paddingTop: '10px', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{rangeInfo}</span>
        <span style={{ fontWeight: 800, color }}>{statusBadge}</span>
      </div>
    </div>
  );
}

// Mini Telemetry Card Component
function MiniTelemetryCard({ label, value, sub, icon, isAlert }: any) {
  return (
    <div className="premium-card glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: isAlert ? '4px solid var(--secondary)' : '1px solid var(--surface-border)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '15px', fontWeight: 900, color: isAlert ? 'var(--secondary)' : 'var(--text-main)' }}>{value}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{sub}</div>
      </div>
    </div>
  );
}

// Waveform Chart Component (Live Trend Detection)
function LiveWaveform({ data, line1, line2, stroke1, stroke2, gradientId }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stroke1} stopOpacity={0.35} />
            <stop offset="95%" stopColor={stroke1} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="time" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)' }} />
        <Area type="monotone" dataKey={line1} stroke={stroke1} fill={`url(#${gradientId})`} strokeWidth={3} isAnimationActive={false} />
        {line2 && <Area type="monotone" dataKey={line2} stroke={stroke2} fill="transparent" strokeWidth={1.8} strokeDasharray="4 4" isAnimationActive={false} />}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Camera Feed Component
function CameraPreview({ isAlert, isEnabled }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isEnabled) {
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }

    let stream: MediaStream | null = null;
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) { }
    }
    start();

    const loop = setInterval(() => {
      if (videoRef.current && canvasRef.current && stream && isEnabled) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          canvasRef.current.toBlob(blob => {
            if (blob) {
              const form = new FormData();
              form.append('file', blob, 'f.jpg');
              fetch(`${API_BASE_URL}/api/process_frame`, { method: 'POST', body: form }).catch(() => { });
            }
          }, 'image/jpeg', 0.5);
        }
      }
    }, 500);

    return () => {
      stream?.getTracks().forEach(t => t.stop());
      clearInterval(loop);
    };
  }, [isEnabled]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000', overflow: 'hidden' }}>
      {!isEnabled && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 10, background: 'rgba(0,0,0,0.8)' }}>
          <Camera size={48} opacity={0.3} style={{ marginBottom: '15px' }} />
          <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '2px', opacity: 0.5 }}>VISION SYSTEM OFFLINE</div>
        </div>
      )}
      <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isEnabled ? 0.9 : 0.2 }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
      {isEnabled && <div className="scanner" />}
      <div style={{ position: 'absolute', inset: 0, boxShadow: isAlert && isEnabled ? 'inset 0 0 50px rgba(255,133,161,0.5)' : 'none', border: isAlert && isEnabled ? '4px solid var(--secondary)' : 'none', transition: 'all 0.3s' }} />
    </div>
  );
}

// Auth Flow Component (Passcode Keypad with 1234 Pin)
function AuthFlow({ onLogin }: any) {
  const [pin, setPin] = useState<string>('');
  const [fallbackId, setFallbackId] = useState<string>('');
  const [showFallback, setShowFallback] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    setAuthError(null);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      // Auto submit on 4 digits
      if (newPin === '1234') {
        setTimeout(() => onLogin(), 300);
      } else if (newPin.length === 4) {
        setTimeout(() => {
          setAuthError("Invalid Passcode. Hint: Use 1234");
          setPin('');
        }, 500);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fallbackId === 'admin') {
      onLogin();
    } else {
      setAuthError("Invalid Secure ID");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="premium-card glass-panel" style={{ width: '450px', padding: '50px 40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.6)' }}>
        <div style={{ fontSize: '50px', marginBottom: '20px', filter: 'drop-shadow(0 10px 15px rgba(93,183,255,0.25))' }}>👶</div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.5px' }}>NEO-CARE</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Clinical Telemetry Terminal
        </p>

        {showFallback ? (
          <form onSubmit={handleTextSubmit}>
            <input 
              type="text" 
              placeholder="SECURE ID" 
              value={fallbackId} 
              onChange={e => setFallbackId(e.target.value)} 
              className="vibrant-input" 
              style={{ width: '100%', marginBottom: '20px', textAlign: 'center', fontWeight: 800 }} 
            />
            <button type="submit" className="vibrant-btn" style={{ width: '100%', height: '60px', fontSize: '16px' }}>
              INITIALIZE LINK
            </button>
            <button 
              type="button" 
              onClick={() => setShowFallback(false)} 
              style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
            >
              Use Numeric Keypad
            </button>
          </form>
        ) : (
          <div>
            {/* Dots */}
            <div className="passcode-dots-container">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className={`passcode-dot ${pin.length > idx ? 'filled' : ''}`} 
                />
              ))}
            </div>

            {/* Grid */}
            <div className="pin-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button key={num} className="pin-btn" onClick={() => handleKeyPress(num)}>
                  {num}
                </button>
              ))}
              <button className="pin-btn" style={{ border: 'none', background: 'none', fontSize: '12px' }} onClick={() => setShowFallback(true)}>
                <Key size={18} />
              </button>
              <button className="pin-btn" onClick={() => handleKeyPress('0')}>
                0
              </button>
              <button className="pin-btn" style={{ border: 'none', background: 'none', fontSize: '12px' }} onClick={handleBackspace}>
                <Delete size={20} />
              </button>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 800 }}>
              <HelpCircle size={14} />
              <span>PASSCODE: 1234 OR CLICK THE KEY FOR ID</span>
            </div>
          </div>
        )}

        {authError && (
          <div style={{ marginTop: '20px', padding: '10px 20px', background: 'rgba(255,133,161,0.1)', color: 'var(--secondary)', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
            {authError}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;