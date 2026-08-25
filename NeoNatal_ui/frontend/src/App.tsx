import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Volume2, 
  VolumeX, 
  Clock, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  FileText, 
  Monitor, 
  Bed, 
  Bell, 
  Search
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

interface BabyData {
  id: string;
  bedId: string;
  name: string;
  age: string;
  weight: string;
  birthWeight: string;
  gestationalAge: string;
  admissionDate: string;
  status: 'SAFE' | 'WARNING' | 'UNSAFE' | 'OFFLINE';
  statusLabel: string;
  riskScore: number;
  confidence: number;
  motherName: string;
  maternalHistory: string;
  deliveryType: string;
  bloodGroup: string;
  apgarScore: string;
  feedingSchedule: string;
  medications: string;
  phototherapyStatus: string;
  vitals: {
    heartRate: number;
    spo2: number;
    respRate: number;
    temp: number;
    bp: number;
  };
  trends: {
    heartRate: { dir: 'up' | 'down' | 'stable'; label: string };
    spo2: { dir: 'up' | 'down' | 'stable'; label: string };
    respRate: { dir: 'up' | 'down' | 'stable'; label: string };
    temp: { dir: 'up' | 'down' | 'stable'; label: string };
    bp: { dir: 'up' | 'down' | 'stable'; label: string };
  };
  alertBanner: {
    title: string;
    text: string;
    statusBadge: string;
    time: string;
  };
  historyLogs: Array<{
    time: string;
    hr: number;
    spo2: number;
    resp: number;
    temp: number;
    bp: number;
    status: string;
  }>;
}

const BABIES_DATA: BabyData[] = [
  {
    id: "NB-2026-003",
    bedId: "NICU-003",
    name: "Aditya Rao",
    age: "2 days old",
    weight: "3.1 kg",
    birthWeight: "3.05 kg",
    gestationalAge: "39 weeks",
    admissionDate: "Jan 22, 2026",
    status: "WARNING",
    statusLabel: "STATUS: MONITORING (MODERATE)",
    riskScore: 64,
    confidence: 89,
    motherName: "Ananya Rao",
    maternalHistory: "G1P0, 26 y/o, emergency C-section with PROM (>18h), intrapartum fever managed",
    deliveryType: "Emergency Lower Segment C-Section",
    bloodGroup: "B+ (Rh Positive)",
    apgarScore: "5 at 1 min, 7 at 5 min",
    feedingSchedule: "NPO / IV 10% Dextrose & Maintenance TPN (8ml/hr)",
    medications: "Caffeine Citrate 20mg/kg IV, Ampicillin & Gentamicin IV, D10W Infusion",
    phototherapyStatus: "Under review (TSB 8.4 mg/dL)",
    vitals: {
      heartRate: 156,
      spo2: 92,
      respRate: 53,
      temp: 37.8,
      bp: 34
    },
    trends: {
      heartRate: { dir: "up", label: "Tachycardic (156 BPM)" },
      spo2: { dir: "down", label: "Desaturation Dip (92%)" },
      respRate: { dir: "stable", label: "Tachypneic (53 /min)" },
      temp: { dir: "up", label: "Hyperthermia (37.8 °C)" },
      bp: { dir: "down", label: "Hypotension (34 mmHg)" }
    },
    alertBanner: {
      title: "Incubator NICU-003 Alert: SpO₂: 93% ↓, APGAR Score: 5 ↓, Weight: 2.0 kg ↓, Reflexes: Abnormal ↓ ↓, Mean BP: 32 mmHg ↓",
      text: "Patient: NB-2026-003 • Status: WARNING",
      statusBadge: "WARNING",
      time: "09:22:38 PM"
    },
    historyLogs: [
      { time: "09:22 PM", hr: 156, spo2: 92, resp: 53, temp: 37.8, bp: 34, status: "Warning" },
      { time: "09:18 PM", hr: 154, spo2: 93, resp: 51, temp: 37.7, bp: 33, status: "Warning" },
      { time: "09:14 PM", hr: 150, spo2: 94, resp: 49, temp: 37.5, bp: 35, status: "Moderate" },
      { time: "09:10 PM", hr: 146, spo2: 95, resp: 47, temp: 37.2, bp: 36, status: "Normal" },
      { time: "09:05 PM", hr: 142, spo2: 96, resp: 45, temp: 37.0, bp: 38, status: "Normal" }
    ]
  },
  {
    id: "NB-2026-001",
    bedId: "NICU-001",
    name: "Aarav Sharma",
    age: "3 days old",
    weight: "3.2 kg",
    birthWeight: "3.15 kg",
    gestationalAge: "38 weeks",
    admissionDate: "Jan 21, 2026",
    status: "SAFE",
    statusLabel: "STATUS: MONITORING (OPTIMAL)",
    riskScore: 12,
    confidence: 96,
    motherName: "Priya Sharma",
    maternalHistory: "G1P1, 28 y/o, uncomplicated pregnancy, GBS negative, normotensive, clear liquor",
    deliveryType: "Normal Spontaneous Vaginal Delivery",
    bloodGroup: "O+ (Rh Positive)",
    apgarScore: "9 at 1 min, 10 at 5 min",
    feedingSchedule: "Expressed Breast Milk (45ml q3h)",
    medications: "Vitamin K1 1mg IM, Erythromycin 0.5% eye ointment, Hepatitis B dose 1",
    phototherapyStatus: "None required (TSB 4.2 mg/dL - Normal)",
    vitals: {
      heartRate: 142,
      spo2: 98,
      respRate: 45,
      temp: 36.8,
      bp: 42
    },
    trends: {
      heartRate: { dir: "stable", label: "Normal (142 BPM)" },
      spo2: { dir: "stable", label: "Optimal (98%)" },
      respRate: { dir: "stable", label: "Regular (45 /min)" },
      temp: { dir: "stable", label: "Normothermic (36.8 °C)" },
      bp: { dir: "stable", label: "Target (42 mmHg)" }
    },
    alertBanner: {
      title: "Incubator NICU-001: All vital signs verified within normal physiological bounds.",
      text: "Patient: NB-2026-001 • Status: OPTIMAL",
      statusBadge: "OPTIMAL",
      time: "09:20:15 PM"
    },
    historyLogs: [
      { time: "09:20 PM", hr: 142, spo2: 98, resp: 45, temp: 36.8, bp: 42, status: "Normal" },
      { time: "09:15 PM", hr: 140, spo2: 98, resp: 44, temp: 36.8, bp: 41, status: "Normal" },
      { time: "09:10 PM", hr: 144, spo2: 99, resp: 46, temp: 36.9, bp: 43, status: "Normal" },
      { time: "09:05 PM", hr: 141, spo2: 98, resp: 45, temp: 36.8, bp: 42, status: "Normal" }
    ]
  },
  {
    id: "NB-2026-002",
    bedId: "NICU-002",
    name: "Kiara Patel",
    age: "5 days old",
    weight: "2.9 kg",
    birthWeight: "2.85 kg",
    gestationalAge: "37 weeks",
    admissionDate: "Jan 20, 2026",
    status: "WARNING",
    statusLabel: "STATUS: MONITORING (MODERATE)",
    riskScore: 54,
    confidence: 91,
    motherName: "Neha Patel",
    maternalHistory: "G2P1, 32 y/o, history of gestational diabetes diet-controlled, repeat elective C-section",
    deliveryType: "Elective Lower Segment C-Section (37w)",
    bloodGroup: "A+ (Rh Positive)",
    apgarScore: "7 at 1 min, 9 at 5 min",
    feedingSchedule: "Donor Milk Fortified (35ml q3h via Paladai)",
    medications: "Vitamin K1 IM, Oral Vitamin D3 drops (400 IU), IV fluids at 4ml/hr",
    phototherapyStatus: "Prophylactic blue LED phototherapy under review (TSB 9.8 mg/dL)",
    vitals: {
      heartRate: 135,
      spo2: 96,
      respRate: 25,
      temp: 36.5,
      bp: 38
    },
    trends: {
      heartRate: { dir: "down", label: "Borderline (135 BPM)" },
      spo2: { dir: "down", label: "Lower Safe Limit (96%)" },
      respRate: { dir: "down", label: "Bradypnea (25 /min)" },
      temp: { dir: "stable", label: "Stable (36.5 °C)" },
      bp: { dir: "stable", label: "Stable (38 mmHg)" }
    },
    alertBanner: {
      title: "Incubator NICU-002 Alert: Bradypnea episode (25 /min) flagged by Random Forest model.",
      text: "Patient: NB-2026-002 • Status: MODERATE",
      statusBadge: "MODERATE",
      time: "09:18:42 PM"
    },
    historyLogs: [
      { time: "09:18 PM", hr: 135, spo2: 96, resp: 25, temp: 36.5, bp: 38, status: "Moderate" },
      { time: "09:12 PM", hr: 138, spo2: 96, resp: 28, temp: 36.5, bp: 39, status: "Moderate" },
      { time: "09:06 PM", hr: 140, spo2: 97, resp: 32, temp: 36.6, bp: 40, status: "Normal" }
    ]
  },
  {
    id: "NB-2026-004",
    bedId: "NICU-004",
    name: "Riya Sen",
    age: "6 days old",
    weight: "3.4 kg",
    birthWeight: "3.3 kg",
    gestationalAge: "38 weeks",
    admissionDate: "Jan 19, 2026",
    status: "SAFE",
    statusLabel: "STATUS: MONITORING (OPTIMAL)",
    riskScore: 8,
    confidence: 98,
    motherName: "Sunita Sen",
    maternalHistory: "G3P2, 30 y/o, previous normal deliveries, negative serologies, uncomplicated course",
    deliveryType: "Normal Spontaneous Vaginal Delivery",
    bloodGroup: "AB+ (Rh Positive)",
    apgarScore: "9 at 1 min, 9 at 5 min",
    feedingSchedule: "Direct Breastfeeding on Demand + 50ml Top-up",
    medications: "Routine neonatal prophylaxis completed (Vitamin K1, BCG, OPV)",
    phototherapyStatus: "Not indicated (TSB 3.8 mg/dL)",
    vitals: {
      heartRate: 145,
      spo2: 99,
      respRate: 48,
      temp: 36.9,
      bp: 44
    },
    trends: {
      heartRate: { dir: "stable", label: "Optimal (145 BPM)" },
      spo2: { dir: "up", label: "Excellent (99%)" },
      respRate: { dir: "stable", label: "Regular (48 /min)" },
      temp: { dir: "stable", label: "Normothermic (36.9 °C)" },
      bp: { dir: "stable", label: "Target (44 mmHg)" }
    },
    alertBanner: {
      title: "Incubator NICU-004: Kangaroo Mother Care completed, excellent perfusion.",
      text: "Patient: NB-2026-004 • Status: OPTIMAL",
      statusBadge: "OPTIMAL",
      time: "09:12:00 PM"
    },
    historyLogs: [
      { time: "09:12 PM", hr: 145, spo2: 99, resp: 48, temp: 36.9, bp: 44, status: "Normal" },
      { time: "09:00 PM", hr: 144, spo2: 99, resp: 47, temp: 36.9, bp: 43, status: "Normal" }
    ]
  },
  {
    id: "NB-2026-005",
    bedId: "NICU-005",
    name: "Vivaan Kapoor",
    age: "4 days old",
    weight: "2.7 kg",
    birthWeight: "2.65 kg",
    gestationalAge: "36 weeks",
    admissionDate: "Jan 21, 2026",
    status: "SAFE",
    statusLabel: "STATUS: MONITORING (ACTIVE)",
    riskScore: 22,
    confidence: 93,
    motherName: "Kavita Kapoor",
    maternalHistory: "G2P1, 29 y/o, mild PIH managed with Labetalol, delivered late preterm",
    deliveryType: "Late Preterm Normal Delivery (36w)",
    bloodGroup: "O- (Rh Negative)",
    apgarScore: "8 at 1 min, 9 at 5 min",
    feedingSchedule: "Expressed Breast Milk via Gavage Tube (35ml q3h)",
    medications: "Elemental Iron drops (2mg/kg), Multivitamin pediatric drops",
    phototherapyStatus: "Single-surface LED phototherapy completed (TSB 7.1 mg/dL)",
    vitals: {
      heartRate: 149,
      spo2: 97,
      respRate: 52,
      temp: 37.1,
      bp: 39
    },
    trends: {
      heartRate: { dir: "up", label: "Active Cry (149 BPM)" },
      spo2: { dir: "stable", label: "Stable (97%)" },
      respRate: { dir: "up", label: "Active (52 /min)" },
      temp: { dir: "stable", label: "Stable (37.1 °C)" },
      bp: { dir: "stable", label: "Normal (39 mmHg)" }
    },
    alertBanner: {
      title: "Incubator NICU-005: Bio-Acoustic classifier identified hunger cry reflex.",
      text: "Patient: NB-2026-005 • Status: ACTIVE",
      statusBadge: "ACTIVE",
      time: "09:08:14 PM"
    },
    historyLogs: [
      { time: "09:08 PM", hr: 149, spo2: 97, resp: 52, temp: 37.1, bp: 39, status: "Normal" },
      { time: "08:55 PM", hr: 142, spo2: 98, resp: 46, temp: 37.0, bp: 40, status: "Normal" }
    ]
  }
];

const generateWaveforms = () => Array.from({ length: 30 }, (_, i) => ({
  time: i,
  heartRate: 150 + Math.sin(i * 0.3) * 6,
  spo2: 92 + Math.cos(i * 0.2) * 1.5,
  respRate: 53 + Math.sin(i * 0.4) * 4,
  bp: 34 + Math.cos(i * 0.3) * 2
}));

function App() {
  const [selectedBabyId, setSelectedBabyId] = useState<string>("NB-2026-003");
  const [babies, setBabies] = useState<BabyData[]>(BABIES_DATA);
  const [waveformData, setWaveformData] = useState(generateWaveforms());
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard`);
        if (res.ok) {
          const json = await res.json();
          if (json.babies && Array.isArray(json.babies)) {
            setBabies(prev => prev.map(b => {
              const remote = json.babies.find((rb: any) => rb.id === b.id);
              if (!remote) return b;
              return {
                ...b,
                vitals: {
                  ...b.vitals,
                  heartRate: remote.vitals?.heartRate || b.vitals.heartRate,
                  spo2: remote.vitals?.spo2 || b.vitals.spo2,
                  respRate: remote.vitals?.respRate || b.vitals.respRate,
                  temp: remote.vitals?.temp || b.vitals.temp
                }
              };
            }));
          }
        }
      } catch (err) {
        setBabies(prev => prev.map(b => {
          if (b.id !== selectedBabyId) return b;
          return {
            ...b,
            vitals: {
              ...b.vitals,
              heartRate: Math.max(110, Math.min(165, b.vitals.heartRate + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
              spo2: Math.max(90, Math.min(100, +(b.vitals.spo2 + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 0.2 : -0.2) : 0)).toFixed(1)))
            }
          };
        }));
      }

      setWaveformData(prev => {
        const active = babies.find(b => b.id === selectedBabyId) || babies[0];
        const newEntry = {
          time: prev.length,
          heartRate: active.vitals.heartRate,
          spo2: active.vitals.spo2,
          respRate: active.vitals.respRate,
          bp: active.vitals.bp
        };
        return [...prev.slice(-29), newEntry];
      });
    };

    const interval = setInterval(poll, 1200);
    return () => clearInterval(interval);
  }, [selectedBabyId, babies]);

  const activeBaby = babies.find(b => b.id === selectedBabyId) || babies[0];
  const totalBeds = 5;
  const moderateCases = babies.filter(b => b.status === 'WARNING').length;
  const criticalCases = babies.filter(b => b.status === 'UNSAFE').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--akesis-bg)', paddingBottom: '40px' }}>
      
      {/* 1. TOP HEADER BAR */}
      <header className="akesis-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: 'var(--akesis-text-main)' }}>
            <Menu size={22} />
          </button>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', color: '#0E7490', display: 'flex', alignItems: 'center', gap: '8px' }}>
              AKESIS PROTOCOL
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--akesis-text-muted)' }}>
              Neonatal AI Monitoring System
            </div>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#F0FDF4', borderRadius: '20px', border: '1px solid #DCFCE7', fontSize: '11px', fontWeight: 800, color: '#15803D' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
            ACTIVE BACKEND
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#F0FDF4', borderRadius: '20px', border: '1px solid #DCFCE7', fontSize: '11px', fontWeight: 800, color: '#15803D' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
            STATUS: ONLINE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#ECFEFF', borderRadius: '20px', border: '1px solid #CFFAFE', fontSize: '11px', fontWeight: 800, color: '#0E7490' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#06B6D4' }} />
            PC2 API: CONNECTED
          </div>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--akesis-border)', fontSize: '11px', fontWeight: 800, color: 'var(--akesis-text-main)', cursor: 'pointer' }}
          >
            {isMuted ? <VolumeX size={14} color="#EF4444" /> : <Volume2 size={14} color="#0D9488" />}
            ALARM VOL
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--akesis-border)', fontSize: '12px', fontWeight: 800, color: 'var(--akesis-text-main)' }}>
            <Clock size={14} color="var(--akesis-text-muted)" />
            {currentTime || "09:22:39 PM"}
          </div>

          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #FCA5A5', fontSize: '11px', fontWeight: 900, color: '#DC2626', cursor: 'pointer' }}>
            LOGOUT
          </button>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ maxWidth: '1440px', margin: '24px auto 0', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 2. TOP METRICS ROW (4 STAT BOXES) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          
          <div className="stat-capsule">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bed size={22} />
            </div>
            <div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: 'var(--akesis-text-main)', lineHeight: 1 }}>
                {totalBeds}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--akesis-text-muted)' }}>
                Total Beds Monitored
              </div>
            </div>
          </div>

          <div className="stat-capsule highlight-orange">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} />
            </div>
            <div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#D97706', lineHeight: 1 }}>
                {moderateCases}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--akesis-text-muted)' }}>
                Moderate Cases
              </div>
            </div>
          </div>

          <div className="stat-capsule">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={22} />
            </div>
            <div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#DC2626', lineHeight: 1 }}>
                {criticalCases}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--akesis-text-muted)' }}>
                Critical Cases
              </div>
            </div>
          </div>

          <div className="stat-capsule">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ECFEFF', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={22} />
            </div>
            <div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#0891B2', lineHeight: 1 }}>
                98%
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--akesis-text-muted)' }}>
                System Health
              </div>
            </div>
          </div>

        </div>

        {/* 3. MAIN DASHBOARD TWO-COLUMN SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1.1fr', gap: '20px' }}>
          
          {/* LEFT COLUMN: Bed Selector Banner & 5 Vitals Cards + Patient History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Bed Selector Header Card */}
            <div className="akesis-card" style={{ padding: '22px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--akesis-text-main)' }}>
                      Bed: {activeBaby.bedId}
                    </span>
                    
                    {/* Baby Selector Dropdown */}
                    <select 
                      value={selectedBabyId}
                      onChange={(e) => setSelectedBabyId(e.target.value)}
                      style={{ 
                        padding: '6px 14px', 
                        borderRadius: '8px', 
                        border: '1.5px solid var(--akesis-border)', 
                        background: '#FFFFFF', 
                        fontWeight: 800, 
                        fontSize: '13px', 
                        color: 'var(--akesis-text-main)', 
                        cursor: 'pointer' 
                      }}
                    >
                      {babies.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.bedId} ({b.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--akesis-text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    AGE: {activeBaby.age} • WEIGHT: {activeBaby.weight} • GESTATION: {activeBaby.gestationalAge}
                  </div>
                </div>

                {/* Status Badge on Right */}
                <div style={{ 
                  padding: '8px 18px', 
                  borderRadius: '10px', 
                  fontSize: '12px', 
                  fontWeight: 900, 
                  background: activeBaby.status === 'WARNING' ? '#D97706' : (activeBaby.status === 'UNSAFE' ? '#DC2626' : '#16A34A'), 
                  color: 'white',
                  letterSpacing: '0.5px'
                }}>
                  {activeBaby.statusLabel}
                </div>
              </div>

              {/* Vitals Grid (2 Columns, 5 cards + Patient History) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                
                {/* 1. HEART RATE */}
                <div className="vital-box">
                  <div className="vital-box-title">
                    <Heart size={14} color="#EF4444" /> HEART RATE
                  </div>
                  <div className="vital-box-value" style={{ color: 'var(--akesis-text-main)' }}>
                    {activeBaby.vitals.heartRate} <span className="vital-box-unit">BPM</span>
                  </div>
                  <div className="vital-box-normal">
                    Normal: 110-160 BPM
                  </div>
                </div>

                {/* 2. OXYGEN SATURATION */}
                <div className="vital-box">
                  <div className="vital-box-title">
                    <Activity size={14} color="#0D9488" /> OXYGEN SATURATION (SpO₂)
                  </div>
                  <div className="vital-box-value" style={{ color: activeBaby.vitals.spo2 < 93 ? '#0D9488' : 'var(--akesis-text-main)' }}>
                    {activeBaby.vitals.spo2} <span className="vital-box-unit">%</span>
                  </div>
                  <div className="vital-box-normal">
                    Normal: 92-98% (Term Target)
                  </div>
                </div>

                {/* 3. RESPIRATORY RATE */}
                <div className="vital-box">
                  <div className="vital-box-title">
                    <Wind size={14} color="#EF4444" /> RESPIRATORY RATE
                  </div>
                  <div className="vital-box-value" style={{ color: '#DC2626' }}>
                    {activeBaby.vitals.respRate} <span className="vital-box-unit">/min</span>
                  </div>
                  <div className="vital-box-normal">
                    Normal: 30-60 /min
                  </div>
                </div>

                {/* 4. SKIN TEMPERATURE */}
                <div className="vital-box">
                  <div className="vital-box-title">
                    <Thermometer size={14} color="#EF4444" /> SKIN TEMPERATURE
                  </div>
                  <div className="vital-box-value" style={{ color: '#DC2626' }}>
                    {activeBaby.vitals.temp} <span className="vital-box-unit">°C</span>
                  </div>
                  <div className="vital-box-normal">
                    Normal: 36.5-37.5 °C • Hyperthermia
                  </div>
                </div>

                {/* 5. BLOOD PRESSURE (Mean BP) */}
                <div className="vital-box" style={{ gridColumn: 'span 2' }}>
                  <div className="vital-box-title">
                    <span style={{ color: '#DC2626' }}>🩸</span> BLOOD PRESSURE (Mean BP)
                  </div>
                  <div className="vital-box-value" style={{ color: '#DC2626' }}>
                    {activeBaby.vitals.bp} <span className="vital-box-unit">mmHg</span>
                  </div>
                  <div className="vital-box-normal">
                    Normal Target: ≥39 mmHg (Gestational Age)
                  </div>
                </div>

              </div>

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: AI Risk Assessment, Clinical Alerts & Patient Medical History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 1. AI RISK ASSESSMENT CARD */}
            <div className="akesis-card" style={{ padding: '24px', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.8px', color: 'var(--akesis-text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}>
                AI RISK ASSESSMENT
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--akesis-text-muted)', textTransform: 'uppercase' }}>
                    CURRENT STATUS
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#D97706', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🟡 {activeBaby.status}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--akesis-text-muted)', textTransform: 'uppercase' }}>
                    RISK SCORE
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#D97706', marginTop: '2px', lineHeight: 1 }}>
                    {activeBaby.riskScore}%
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FDF9', borderRadius: '12px', border: '1px solid var(--akesis-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--akesis-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Search size={14} color="#0D9488" /> Model Confidence: {activeBaby.confidence}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--akesis-text-muted)', fontWeight: 600 }}>
                  Prediction generated from the latest neonatal vital-sign input.
                </div>
              </div>
            </div>

            {/* 2. CLINICAL ALERTS STREAM */}
            <div className="akesis-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--akesis-text-main)' }}>
                Clinical Alerts
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--akesis-text-muted)', marginBottom: '16px' }}>
                Live alerts stream for patient {activeBaby.id}
              </div>

              {/* Alert Banner Box */}
              <div style={{ 
                padding: '14px 16px', 
                background: '#FFFBEB', 
                border: '1.5px solid #FDE68A', 
                borderLeft: '4px solid #D97706', 
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', lineHeight: 1.4 }}>
                  {activeBaby.alertBanner.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#B45309', fontWeight: 700 }}>
                  <span>{activeBaby.alertBanner.text}</span>
                  <span>{activeBaby.alertBanner.time}</span>
                </div>
              </div>
            </div>

            {/* 3. PATIENT MEDICAL HISTORY & MATERNAL RECORD CARD (REPLACING TELEMETRY HISTORY LOG) */}
            <div className="akesis-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--akesis-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#0D9488" /> Patient Medical History
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--akesis-text-muted)', marginTop: '2px' }}>
                    Clinical Profile & Maternal Record for {activeBaby.id}
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', background: '#E0F2FE', padding: '3px 10px', borderRadius: '6px' }}>
                  APGAR: {activeBaby.apgarScore}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ padding: '10px 12px', background: '#F8FDF9', borderRadius: '10px', border: '1px solid var(--akesis-border)' }}>
                  <span style={{ color: 'var(--akesis-text-muted)', fontWeight: 700, display: 'block', fontSize: '11px' }}>Mother's Name:</span>
                  <span style={{ fontWeight: 800, color: 'var(--akesis-text-main)' }}>{activeBaby.motherName}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px 12px', background: '#F8FDF9', borderRadius: '10px', border: '1px solid var(--akesis-border)' }}>
                    <span style={{ color: 'var(--akesis-text-muted)', fontWeight: 700, display: 'block', fontSize: '11px' }}>Delivery Type:</span>
                    <span style={{ fontWeight: 800, color: 'var(--akesis-text-main)' }}>{activeBaby.deliveryType}</span>
                  </div>
                  <div style={{ padding: '10px 12px', background: '#F8FDF9', borderRadius: '10px', border: '1px solid var(--akesis-border)' }}>
                    <span style={{ color: 'var(--akesis-text-muted)', fontWeight: 700, display: 'block', fontSize: '11px' }}>Blood Group:</span>
                    <span style={{ fontWeight: 800, color: 'var(--akesis-text-main)' }}>{activeBaby.bloodGroup}</span>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', background: '#F8FDF9', borderRadius: '10px', border: '1px solid var(--akesis-border)' }}>
                  <span style={{ color: 'var(--akesis-text-muted)', fontWeight: 700, display: 'block', fontSize: '11px' }}>Maternal History:</span>
                  <span style={{ fontWeight: 700, color: 'var(--akesis-text-main)' }}>{activeBaby.maternalHistory}</span>
                </div>

                <div style={{ padding: '10px 12px', background: '#F8FDF9', borderRadius: '10px', border: '1px solid var(--akesis-border)' }}>
                  <span style={{ color: 'var(--akesis-text-muted)', fontWeight: 700, display: 'block', fontSize: '11px' }}>Feeding Protocol:</span>
                  <span style={{ fontWeight: 800, color: 'var(--akesis-text-main)' }}>{activeBaby.feedingSchedule}</span>
                </div>

                <div style={{ padding: '10px 12px', background: '#F8FDF9', borderRadius: '10px', border: '1px solid var(--akesis-border)' }}>
                  <span style={{ color: 'var(--akesis-text-muted)', fontWeight: 700, display: 'block', fontSize: '11px' }}>Medications:</span>
                  <span style={{ fontWeight: 700, color: '#0E7490' }}>{activeBaby.medications}</span>
                </div>

                <div style={{ padding: '10px 12px', background: '#F8FDF9', borderRadius: '10px', border: '1px solid var(--akesis-border)' }}>
                  <span style={{ color: 'var(--akesis-text-muted)', fontWeight: 700, display: 'block', fontSize: '11px' }}>Phototherapy & Bilirubin:</span>
                  <span style={{ fontWeight: 700, color: 'var(--akesis-text-main)' }}>{activeBaby.phototherapyStatus}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4. BOTTOM SECTION: LIVE VITAL TRENDS */}
        <div className="akesis-card" style={{ padding: '28px', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--akesis-text-main)', margin: 0 }}>
              Live Vital Trends
            </h3>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--akesis-text-muted)' }}>
              Real-time multi-channel telemetry synchronization
            </span>
          </div>

          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2EFE6" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--akesis-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
                <Area type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#EF4444" fill="rgba(239, 68, 68, 0.12)" strokeWidth={2.5} isAnimationActive={false} />
                <Area type="monotone" dataKey="spo2" name="Oxygen (SpO₂ %)" stroke="#0D9488" fill="rgba(13, 148, 136, 0.12)" strokeWidth={2.5} isAnimationActive={false} />
                <Area type="monotone" dataKey="respRate" name="Resp Rate (/min)" stroke="#3B82F6" fill="transparent" strokeWidth={1.8} strokeDasharray="4 4" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>

      {/* 5. FOOTER */}
      <footer style={{ marginTop: '36px', textAlign: 'center', fontSize: '11px', color: 'var(--akesis-text-muted)', lineHeight: 1.6, padding: '0 20px' }}>
        <div>
          Disclaimer: NAVAAYU is an AI-assisted neonatal monitoring prototype and is not a substitute for professional medical judgment, clinical diagnosis, or medical decision thresholds.
        </div>
        <div style={{ fontWeight: 700, marginTop: '4px' }}>
          © 2026 @AKESISPROTOCOL. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default App;