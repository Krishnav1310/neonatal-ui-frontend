import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Wind, 
  Zap, 
  Thermometer, 
  Activity, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  MoveRight, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Server, 
  Monitor, 
  Lock, 
  User, 
  Brain, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileText, 
  Baby, 
  Info,
  AlertTriangle 
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

const INITIAL_BABIES = [
  {
    id: "NB-2026-001",
    name: "Aarav Sharma",
    age: "3 days old",
    weight: "3.2 kg",
    birthWeight: "3.15 kg",
    gestationalAge: "38 weeks",
    admissionDate: "Jan 21, 2026",
    incubator: "Incubator #01",
    motherName: "Priya Sharma",
    maternalHistory: "G1P1, 28 y/o, uncomplicated pregnancy, GBS negative, normotensive, clear amniotic fluid",
    clinicalDiagnosis: "Full-term healthy neonate under routine 72h post-delivery observation & telemetry",
    apgarScore: "9 at 1 min, 10 at 5 min",
    deliveryType: "Full-Term Normal Vaginal Delivery",
    bloodGroup: "O+ (Rh Positive)",
    feedingSchedule: "Expressed Breast Milk (45ml q3h)",
    medications: "Vitamin K1 1mg IM administered, Erythromycin 0.5% eye ointment, Hepatitis B vaccine (Dose 1)",
    phototherapyStatus: "None required (Total Serum Bilirubin 4.2 mg/dL - Normal range)",
    status: "SAFE",
    riskLevel: "LOW",
    riskScore: 12,
    predictionReasons: [
      "All vital parameters within physiological target range (HR 142, SpO₂ 98%)",
      "Consistent diaphragmatic movement detected (45 BPM regular rhythm)",
      "Normal sinus rhythm with stable capillary refill (<2 sec)",
      "Zero stillness or apnea alarms flagged in last 12 hours"
    ],
    vitals: { heartRate: 142, respRate: 45, spo2: 98, temp: 36.8 },
    trends: {
      heartRate: { direction: "stable", symbol: "→", label: "Stable (142 bpm)" },
      respRate: { direction: "stable", symbol: "→", label: "Regular (45 bpm)" },
      spo2: { direction: "stable", symbol: "→", label: "Optimal (98%)" },
      temp: { direction: "stable", symbol: "→", label: "Normothermic (36.8°C)" }
    },
    stillTime: 0,
    cryStatus: "normal",
    isLiveSource: true,
    patientHistory: {
      admissionReason: "Routine neonatal telemetry and post-delivery maternal-infant observation",
      antenatalHistory: "Full antenatal care received (4 antenatal visits, all normal ultrasounds)",
      resuscitation: "Not required; spontaneous crying at birth",
      headCircumference: "34.5 cm (50th percentile)",
      length: "50 cm",
      allergies: "No known drug allergies (NKDA)"
    },
    alertHistory: [
      { time: "13:52", level: "info", title: "Routine Vitals Synchronized", desc: "All parameters verified within normal physiological bounds (HR 142, SpO₂ 98%)" },
      { time: "13:30", level: "info", title: "Positioning Checked", desc: "Supine alignment verified with comfortable breathing dynamics" },
      { time: "13:00", level: "care", title: "Feeding Completed", desc: "Scheduled 45ml expressed breast milk given with good sucking reflex" },
      { time: "12:45", level: "info", title: "Thermal Check", desc: "Infrared skin probe recorded 36.8°C (Optimal normothermia)" },
      { time: "11:15", level: "care", title: "Pediatric Rounds", desc: "Senior neonatologist verified clear bilateral breath sounds and soft abdomen" }
    ]
  },
  {
    id: "NB-2026-002",
    name: "Kiara Patel",
    age: "5 days old",
    weight: "2.9 kg",
    birthWeight: "2.85 kg",
    gestationalAge: "37 weeks",
    admissionDate: "Jan 20, 2026",
    incubator: "Incubator #02",
    motherName: "Neha Patel",
    maternalHistory: "G2P1, 32 y/o, history of gestational diabetes (diet controlled), elective repeat C-section",
    clinicalDiagnosis: "Transient Tachypnea of Newborn (TTN) resolving / Mild bradypnea episodes with borderline SpO₂",
    apgarScore: "7 at 1 min, 9 at 5 min",
    deliveryType: "Elective Lower Segment C-Section (37w)",
    bloodGroup: "A+ (Rh Positive)",
    feedingSchedule: "Donor Milk Fortified (35ml q3h via Paladai)",
    medications: "Vitamin K1 IM, Oral Vitamin D3 drops (400 IU/day), IV maintenance fluids running at 4ml/hr",
    phototherapyStatus: "Prophylactic blue LED phototherapy under review (TSB 9.8 mg/dL)",
    status: "WARNING",
    riskLevel: "MODERATE",
    riskScore: 54,
    predictionReasons: [
      "Reduced respiratory frequency (Bradypnea: 25 breaths/min below 30 threshold)",
      "Mild accumulation of stillness duration (2s) flagged by PC2 vision algorithm",
      "Oxygen saturation bordering lower safe threshold (SpO₂ 96%)",
      "Moderate thermal variance under incubator servo-control (36.5°C)"
    ],
    vitals: { heartRate: 135, respRate: 25, spo2: 96, temp: 36.5 },
    trends: {
      heartRate: { direction: "down", symbol: "↓", label: "Decreasing slightly" },
      respRate: { direction: "down", symbol: "↓", label: "Bradypnea (25 bpm)" },
      spo2: { direction: "down", symbol: "↓", label: "Borderline (96%)" },
      temp: { direction: "stable", symbol: "→", label: "Stable (36.5°C)" }
    },
    stillTime: 2,
    cryStatus: "normal",
    isLiveSource: false,
    patientHistory: {
      admissionReason: "Mild respiratory grunting and transient tachypnea shortly after elective C-section",
      antenatalHistory: "Mother screened for GDM at 24 weeks; managed with strict dietary control",
      resuscitation: "Tactile stimulation and brief bulb suctioning in delivery room",
      headCircumference: "33.8 cm",
      length: "48.5 cm",
      allergies: "NKDA"
    },
    alertHistory: [
      { time: "13:48", level: "warning", title: "Bradypnea Warning Triggered", desc: "Respiratory rate dipped to 25 BPM — Random Forest model increased risk score to 54" },
      { time: "13:15", level: "warning", title: "Borderline SpO₂ Reading", desc: "Oxygen saturation recorded at 96% — continuous pulse oximetry tracking enabled" },
      { time: "12:30", level: "care", title: "Incubator Temperature Adjusted", desc: "Thermal blanket setpoint raised to 36.5°C to prevent thermal stress" },
      { time: "11:45", level: "info", title: "Blood Glucose Evaluated", desc: "Capillary heelstick glucose recorded 58 mg/dL (Normoglycemic)" },
      { time: "10:20", level: "care", title: "Tactile Stimulation Given", desc: "Gentle back stroking prompted prompt recovery of respiratory cadence" }
    ]
  },
  {
    id: "NB-2026-003",
    name: "Aditya Rao",
    age: "2 days old",
    weight: "3.1 kg",
    birthWeight: "3.05 kg",
    gestationalAge: "39 weeks",
    admissionDate: "Jan 22, 2026",
    incubator: "Incubator #03",
    motherName: "Ananya Rao",
    maternalHistory: "G1P0, 26 y/o, emergency admission for prolonged premature rupture of membranes (PROM > 18 hrs)",
    clinicalDiagnosis: "Idiopathic Apnea of Newborn / Acute Severe Desaturation & Bradycardia Crisis",
    apgarScore: "4 at 1 min, 7 at 5 min",
    deliveryType: "Emergency C-Section under General Anesthesia",
    bloodGroup: "B+ (Rh Positive)",
    feedingSchedule: "NPO / TPN & IV 10% Dextrose Maintenance (8ml/hr)",
    medications: "Caffeine Citrate 20mg/kg IV loading dose, Ampicillin & Gentamicin IV, D10W maintenance",
    phototherapyStatus: "Suspended during acute stabilization",
    status: "UNSAFE",
    riskLevel: "HIGH",
    riskScore: 89,
    predictionReasons: [
      "Prolonged stillness (22s) exceeding clinical apnea emergency threshold (> 20s)",
      "Severe bradycardia: Heart rate dropped dangerously to 95 BPM (< 100 limit)",
      "Acute hypoxic desaturation event: SpO₂ plummeted to 91%",
      "Mild hypothermia: Core temperature dropped to 36.2°C"
    ],
    vitals: { heartRate: 95, respRate: 0, spo2: 91, temp: 36.2 },
    trends: {
      heartRate: { direction: "down", symbol: "↓", label: "Bradycardia (95 bpm)" },
      respRate: { direction: "down", symbol: "↓", label: "APNEA (0 bpm)" },
      spo2: { direction: "down", symbol: "↓", label: "Desaturation (91%)" },
      temp: { direction: "down", symbol: "↓", label: "Hypothermia (36.2°C)" }
    },
    stillTime: 22,
    cryStatus: "normal",
    isLiveSource: false,
    patientHistory: {
      admissionReason: "Emergency transfer to NICU for immediate resuscitation post emergency C-section with PROM",
      antenatalHistory: "Spontaneous membrane rupture at home 18 hours prior to delivery; intrapartum fever treated",
      resuscitation: "Positive pressure ventilation (PPV) administered for 90 seconds in delivery room",
      headCircumference: "34.0 cm",
      length: "49.0 cm",
      allergies: "NKDA"
    },
    alertHistory: [
      { time: "13:50", level: "critical", title: "🚨 CRITICAL APNEA ALARM", desc: "No respiratory motion detected for 22 seconds on PC2 computer vision node" },
      { time: "13:49", level: "critical", title: "🚨 Severe Bradycardia Alert", desc: "Heart rate plummeted to 95 BPM (<100 emergency limit) — bedside alarm activated" },
      { time: "13:48", level: "critical", title: "🚨 Hypoxic Desaturation Event", desc: "SpO₂ dropped rapidly to 91% — tactile stimulation and O₂ mask deployed" },
      { time: "13:20", level: "info", title: "Prone Sleep Alignment Logged", desc: "Patient rested in prone position under continuous optical monitoring" },
      { time: "12:00", level: "care", title: "Endotracheal Suctioning", desc: "Airway cleared of secretions; brief recovery before subsequent apnea episode" }
    ]
  },
  {
    id: "NB-2026-004",
    name: "Riya Sen",
    age: "6 days old",
    weight: "3.4 kg",
    birthWeight: "3.3 kg",
    gestationalAge: "38 weeks",
    admissionDate: "Jan 19, 2026",
    incubator: "Incubator #04",
    motherName: "Sunita Sen",
    maternalHistory: "G3P2, 30 y/o, previous normal deliveries, clean antenatal profile, negative serologies",
    clinicalDiagnosis: "Healthy term neonate with vigorous spontaneous activity, preparing for discharge",
    apgarScore: "9 at 1 min, 9 at 5 min",
    deliveryType: "Normal Spontaneous Vaginal Delivery",
    bloodGroup: "AB+ (Rh Positive)",
    feedingSchedule: "Direct Breastfeeding on demand + Formula Top-up (50ml)",
    medications: "Routine neonatal prophylaxis completed (Vitamin K1, BCG, Oral Polio Vaccine)",
    phototherapyStatus: "Not indicated (TSB 3.8 mg/dL)",
    status: "SAFE",
    riskLevel: "LOW",
    riskScore: 8,
    predictionReasons: [
      "Vigorous spontaneous movement and steady breathing cadence (48 BPM)",
      "Excellent oxygenation: SpO₂ consistently at 99%",
      "Heart rate stable at 145 BPM within ideal physiological center",
      "Stable weight gain trajectory (+100g over birth weight)"
    ],
    vitals: { heartRate: 145, respRate: 48, spo2: 99, temp: 36.9 },
    trends: {
      heartRate: { direction: "stable", symbol: "→", label: "Optimal (145 bpm)" },
      respRate: { direction: "stable", symbol: "→", label: "Regular (48 bpm)" },
      spo2: { direction: "up", symbol: "↑", label: "Excellent (99%)" },
      temp: { direction: "stable", symbol: "→", label: "Normothermic (36.9°C)" }
    },
    stillTime: 0,
    cryStatus: "normal",
    isLiveSource: false,
    patientHistory: {
      admissionReason: "Routine neonatal observation and maternal lactation establishment",
      antenatalHistory: "Normal antenatal scans; mother took daily prenatal multivitamins and iron",
      resuscitation: "Spontaneous cry, no active resuscitation required",
      headCircumference: "35.0 cm",
      length: "51.0 cm",
      allergies: "NKDA"
    },
    alertHistory: [
      { time: "13:40", level: "info", title: "Optimal Physiological Vitals", desc: "SpO₂ 99%, HR 145 bpm, RR 48 bpm — perfect clinical stability" },
      { time: "12:15", level: "care", title: "Kangaroo Mother Care Completed", desc: "45-minute skin-to-skin contact session with mother completed successfully" },
      { time: "11:00", level: "info", title: "Daily Weight Recorded", desc: "Current weight 3.4 kg (+100g weight gain confirmed)" },
      { time: "09:30", level: "care", title: "Neonatal Bath & Cord Care", desc: "Umbilical stump clean and dry, no signs of infection" }
    ]
  },
  {
    id: "NB-2026-005",
    name: "Vivaan Kapoor",
    age: "4 days old",
    weight: "2.7 kg",
    birthWeight: "2.65 kg",
    gestationalAge: "36 weeks",
    admissionDate: "Jan 21, 2026",
    incubator: "Incubator #05",
    motherName: "Kavita Kapoor",
    maternalHistory: "G2P1, 29 y/o, mild pregnancy-induced hypertension (PIH), managed with Labetalol",
    clinicalDiagnosis: "Late preterm infant (36w) with active hunger cry dynamics and healthy autonomic recovery",
    apgarScore: "8 at 1 min, 9 at 5 min",
    deliveryType: "Late Preterm Normal Delivery (36w)",
    bloodGroup: "O- (Rh Negative)",
    feedingSchedule: "Expressed Breast Milk via Gavage Tube (35ml q3h)",
    medications: "Elemental Iron drops (2mg/kg/day), Multivitamin pediatric solution, Probiotics",
    phototherapyStatus: "Single-surface LED phototherapy completed yesterday (TSB dropped to 7.1 mg/dL)",
    status: "SAFE",
    riskLevel: "LOW",
    riskScore: 22,
    predictionReasons: [
      "Elevated respiratory rate (52 BPM) and heart rate (149 BPM) during active hunger cry",
      "Vocal cry distress classified as benign hunger cue by PC3 Bio-Acoustic model",
      "Oxygen saturation and heart rate recovering normally following feeding",
      "Core body temperature stable at 37.1°C"
    ],
    vitals: { heartRate: 149, respRate: 52, spo2: 97, temp: 37.1 },
    trends: {
      heartRate: { direction: "up", symbol: "↑", label: "Tachycardia (Cry state)" },
      respRate: { direction: "up", symbol: "↑", label: "Active (52 bpm)" },
      spo2: { direction: "stable", symbol: "→", label: "Stable (97%)" },
      temp: { direction: "stable", symbol: "→", label: "Normal (37.1°C)" }
    },
    stillTime: 0,
    cryStatus: "distress",
    isLiveSource: false,
    patientHistory: {
      admissionReason: "Late preterm feeding maturation and physiological jaundice observation",
      antenatalHistory: "Mother admitted at 35+5 weeks with mild PIH; steroid cover completed (Betamethasone x 2)",
      resuscitation: "Mild oral suctioning and dry towel stimulation at birth",
      headCircumference: "33.2 cm",
      length: "47.5 cm",
      allergies: "NKDA"
    },
    alertHistory: [
      { time: "13:45", level: "info", title: "Acoustic Cry AI Triggered", desc: "Bio-Acoustic classifier on PC3 identified high-frequency hunger cry" },
      { time: "13:42", level: "info", title: "Physiological Tachycardia Logged", desc: "Heart rate rose to 149 BPM during cry — physiological autonomic response" },
      { time: "13:10", level: "care", title: "Diaper Changed & Comforted", desc: "Patient changed and calmed by nursing team; cry subsided" },
      { time: "12:00", level: "care", title: "Gavage Feed Administered", desc: "35ml expressed breast milk given via NG tube with nil aspirate" }
    ]
  },
  {
    id: "NB-2026-006",
    name: "Ananya Nair",
    age: "7 days old",
    weight: "3.3 kg",
    birthWeight: "3.2 kg",
    gestationalAge: "39 weeks",
    admissionDate: "Jan 18, 2026",
    incubator: "Incubator #06 (Discharged)",
    motherName: "Deepa Nair",
    maternalHistory: "G1P1, 31 y/o, normal antenatal course, negative infectious markers, no comorbidities",
    clinicalDiagnosis: "Full-term neonate — All clinical criteria met, safely discharged to step-down nursery",
    apgarScore: "9 at 1 min, 10 at 5 min",
    deliveryType: "Full-Term Normal Delivery",
    bloodGroup: "B+ (Rh Positive)",
    feedingSchedule: "Full Oral Direct Breastfeeding on Demand",
    medications: "Discharged with Vitamin D3 drops (400 IU daily)",
    phototherapyStatus: "Resolved (TSB 3.2 mg/dL on discharge check)",
    status: "OFFLINE",
    riskLevel: "DISCHARGED",
    riskScore: 0,
    predictionReasons: [
      "Incubator offline — Patient successfully met all clinical discharge criteria",
      "Consistent 72-hour normothermic vital stability",
      "Full oral feeding achieved without desaturations"
    ],
    vitals: { heartRate: 0, respRate: 0, spo2: 0, temp: 0 },
    trends: {
      heartRate: { direction: "stable", symbol: "—", label: "Offline" },
      respRate: { direction: "stable", symbol: "—", label: "Offline" },
      spo2: { direction: "stable", symbol: "—", label: "Offline" },
      temp: { direction: "stable", symbol: "—", label: "Offline" }
    },
    stillTime: 0,
    cryStatus: "normal",
    isLiveSource: false,
    patientHistory: {
      admissionReason: "Post-natal clinical observation and phototherapy assessment (successfully completed)",
      antenatalHistory: "Uncomplicated antenatal course",
      resuscitation: "Not required",
      headCircumference: "34.8 cm",
      length: "50.5 cm",
      allergies: "NKDA"
    },
    alertHistory: [
      { time: "10:00", level: "care", title: "Formal Discharge Clearance Signed", desc: "Senior neonatologist signed off discharge summary and follow-up plan" },
      { time: "09:30", level: "info", title: "Newborn Hearing Screen Passed", desc: "Otoacoustic emissions (OAE) test passed bilaterally" },
      { time: "09:00", level: "info", title: "Final Discharge Weight Verified", desc: "Final discharge weight confirmed at 3.3 kg (+100g weight gain)" }
    ]
  }
];

const generateInitialWaveforms = () => Array.from({ length: 30 }, (_, i) => ({
  time: i,
  breathing: 40 + Math.sin(i * 0.5) * 6,
  motion: 1.2 + Math.cos(i * 0.4) * 0.4,
  heartRate: 140 + Math.sin(i * 0.3) * 4,
  spo2: 98
}));

function App() {
  const [activeView, setActiveView] = useState<'landing' | 'login' | 'dashboard'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [babies, setBabies] = useState<any[]>(INITIAL_BABIES);
  const [selectedBabyId, setSelectedBabyId] = useState<string>("NB-2026-001");
  const [waveformData, setWaveformData] = useState<any[]>(generateInitialWaveforms());
  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<string>('doctor');
  const [loginPass, setLoginPass] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  useEffect(() => {
    if (activeView !== 'dashboard') return;

    const pollBackend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard`);
        if (res.ok) {
          const json = await res.json();
          if (json.babies && Array.isArray(json.babies)) {
            setBabies(prevBabies => prevBabies.map(b => {
              const remote = json.babies.find((rb: any) => rb.id === b.id);
              if (!remote) return b;
              return {
                ...b,
                status: remote.status || b.status,
                vitals: { ...b.vitals, ...(remote.vitals || {}) },
                stillTime: typeof remote.stillTime === 'number' ? remote.stillTime : b.stillTime
              };
            }));
          }
        }
      } catch (err) {
        setBabies(prev => prev.map(b => {
          if (b.status === 'OFFLINE' || b.id === 'NB-2026-003') return b;
          return {
            ...b,
            vitals: {
              ...b.vitals,
              heartRate: Math.max(120, Math.min(160, b.vitals.heartRate + Math.floor(Math.random() * 3 - 1))),
              spo2: Math.max(95, Math.min(100, b.vitals.spo2 + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
            }
          };
        }));
      }

      setWaveformData(prev => {
        const active = babies.find(b => b.id === selectedBabyId) || babies[0];
        const newPoint = {
          time: prev.length,
          breathing: active.vitals.respRate || 0,
          motion: active.status === 'UNSAFE' ? 0.05 : +(Math.random() * 0.8 + 1.1).toFixed(2),
          heartRate: active.vitals.heartRate || 140,
          spo2: active.vitals.spo2 || 98
        };
        return [...prev.slice(-29), newPoint];
      });
    };

    const interval = setInterval(pollBackend, 1000);
    return () => clearInterval(interval);
  }, [activeView, selectedBabyId, babies]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPass === '1234' || loginPass === 'admin') {
      setIsAuthenticated(true);
      setActiveView('dashboard');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Demo Password is: 1234');
    }
  };

  const activeBaby = babies.find(b => b.id === selectedBabyId) || babies[0];
  const anyCritical = babies.some(b => b.status === 'UNSAFE');

  // =========================================================================
  // VIEW 1: LANDING PAGE
  // =========================================================================
  if (activeView === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Navigation Bar */}
        <header style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)', 
          borderBottom: '1px solid var(--surface-border)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          padding: '16px 32px' 
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, var(--primary), #0369A1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Baby size={24} />
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--text-main)' }}>NAVAAYU</span>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>INTELLIGENT NEONATAL MONITORING</span>
              </div>
            </div>

            {/* Nav Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <a href="#about" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>What is NAVAAYU?</a>
              <a href="#problem" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>The Problem</a>
              <a href="#monitors" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>Parameters</a>
              <a href="#ai" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>ML Risk Model</a>
              <a href="#architecture" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>3-PC Architecture</a>
            </nav>

            {/* CTA */}
            <button 
              onClick={() => setActiveView(isAuthenticated ? 'dashboard' : 'login')} 
              className="btn-primary"
            >
              Enter Dashboard <ArrowRight size={16} />
            </button>

          </div>
        </header>

        {/* Hero Section */}
        <section id="about" className="hero-wrapper">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '30px', fontSize: '12px', fontWeight: 800, marginBottom: '24px' }}>
              <Sparkles size={14} /> AI-ASSISTED CLINICAL NEONATAL TELEMETRY
            </div>

            <h1 style={{ fontSize: '56px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.5px', marginBottom: '8px', lineHeight: 1.1 }}>
              NAVAAYU
            </h1>

            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>
              Intelligent Neonatal Monitoring
            </h2>

            <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '760px', margin: '0 auto 36px', fontWeight: 500 }}>
              NAVAAYU is an AI-assisted neonatal monitoring system designed to continuously monitor vital parameters, identify risk patterns and provide healthcare teams with a clear view of a baby's condition.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
              <button 
                onClick={() => setActiveView(isAuthenticated ? 'dashboard' : 'login')}
                className="btn-primary"
                style={{ padding: '14px 32px', fontSize: '16px' }}
              >
                Enter Dashboard <ArrowRight size={18} />
              </button>
              <a 
                href="#problem"
                className="btn-secondary"
                style={{ padding: '14px 32px', fontSize: '16px' }}
              >
                Explore NAVAAYU
              </a>
            </div>

            {/* Medical / Technology Flow Visual */}
            <div style={{ marginTop: '60px', background: 'white', border: '1.5px solid var(--surface-border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                End-to-End Clinical Flow
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div className="workflow-step">
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>👶</div>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>Neonatal Monitoring</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Incubator Sensors</div>
                </div>
                <MoveRight size={20} color="var(--primary)" />
                <div className="workflow-step">
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📊</div>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>Vital Signs</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HR, SpO₂, RR, Temp</div>
                </div>
                <MoveRight size={20} color="var(--primary)" />
                <div className="workflow-step" style={{ borderColor: 'var(--lavender)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🧠</div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--lavender)' }}>AI Analysis</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Random Forest Model</div>
                </div>
                <MoveRight size={20} color="var(--primary)" />
                <div className="workflow-step">
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>⚠️</div>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>Risk Prediction</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pattern Detection</div>
                </div>
                <MoveRight size={20} color="var(--primary)" />
                <div className="workflow-step" style={{ borderColor: 'var(--primary)', background: 'var(--primary-light)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🩺</div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--primary)' }}>NAVAAYU Dashboard</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clinical View</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section: The Problem */}
        <section id="problem" style={{ padding: '80px 24px', background: 'white', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: 'var(--secondary)', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
              CRITICAL CLINICAL NEED
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px', marginBottom: '20px' }}>
              Every second matters in neonatal care.
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto 30px' }}>
              Neonatal patients require continuous observation because subtle changes in vital parameters can indicate sudden clinical deterioration or onset of apnea. NAVAAYU helps organize this continuous monitoring and provides an AI-assisted risk indication to support the vigilance of healthcare teams.
            </p>
            <div style={{ padding: '16px 24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--surface-border)', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <Info size={18} color="var(--primary)" />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                NAVAAYU is an assistive monitoring tool designed to alert staff to risk patterns — it does not replace medical judgment or clinical diagnosis.
              </span>
            </div>
          </div>
        </section>

        {/* Section: What NAVAAYU Monitors (4 Core Parameters) */}
        <section id="monitors" style={{ padding: '80px 24px', background: 'var(--background)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                CONTINUOUS PHYSIOLOGICAL TELEMETRY
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>
                What NAVAAYU Monitors
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '8px' }}>
                Continuous tracking of essential neonatal physiological vital signs.
              </p>
            </div>

            <div className="params-4grid">
              
              {/* Parameter 1: Heart Rate */}
              <div className="medical-card" style={{ padding: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Heart size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  ❤️ Heart Rate
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Continuous monitoring of heart-rate information, rhythm dynamics, and early detection of bradycardia or tachycardia episodes.
                </p>
                <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: 'var(--secondary)' }}>
                  Normal Range: 120 – 160 BPM
                </div>
              </div>

              {/* Parameter 2: SpO2 */}
              <div className="medical-card" style={{ padding: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Zap size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  🫁 SpO₂
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Continuous monitoring of blood oxygen saturation levels with instant alerts for hypoxic desaturation events.
                </p>
                <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                  Target Range: 95% – 100%
                </div>
              </div>

              {/* Parameter 3: Respiratory Rate */}
              <div className="medical-card" style={{ padding: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--mint-light)', color: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Wind size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  🌬️ Respiratory Rate
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Monitoring respiratory activity, breathing patterns, chest displacement, and stillness countdowns for apnea identification.
                </p>
                <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: 'var(--mint)' }}>
                  Normal Range: 40 – 60 Breaths/min
                </div>
              </div>

              {/* Parameter 4: Temperature */}
              <div className="medical-card" style={{ padding: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Thermometer size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  🌡️ Temperature
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Infrared thermal monitoring to ensure stable neonatal normothermia and flag early cold stress or fever onset.
                </p>
                <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                  Normal Range: 36.5°C – 37.5°C
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section: AI Random Forest Model */}
        <section id="ai" style={{ padding: '80px 24px', background: 'white', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: 'var(--lavender)', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              MACHINE LEARNING PIPELINE
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px', marginBottom: '16px' }}>
              From Vital Signs to Risk Prediction
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '780px', margin: '0 auto 40px' }}>
              NAVAAYU uses a <strong>Random Forest machine-learning model</strong> to analyze neonatal vital-sign data and provide a risk prediction that can support healthcare professionals in monitoring the patient.
            </p>

            {/* AI Architecture Box */}
            <div style={{ background: '#F8FAFC', border: '2px solid var(--surface-border)', borderRadius: '24px', padding: '36px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flex: 1, minWidth: '120px' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '14px', border: '1px solid var(--surface-border)', fontWeight: 800, fontSize: '13px' }}>
                    Vital Data
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>HR, SpO2, RR, Temp</span>
                </div>
                <ArrowRight color="var(--lavender)" size={20} />
                <div style={{ textAlign: 'center', flex: 1, minWidth: '120px' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '14px', border: '1px solid var(--surface-border)', fontWeight: 800, fontSize: '13px' }}>
                    Preprocessing
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Normalization</span>
                </div>
                <ArrowRight color="var(--lavender)" size={20} />
                <div style={{ textAlign: 'center', flex: 1, minWidth: '140px' }}>
                  <div style={{ padding: '12px', background: 'var(--lavender-light)', color: 'var(--lavender)', borderRadius: '14px', border: '2px solid var(--lavender)', fontWeight: 900, fontSize: '13px' }}>
                    Random Forest Model
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--lavender)', marginTop: '4px', display: 'block', fontWeight: 700 }}>Risk Classifier</span>
                </div>
                <ArrowRight color="var(--lavender)" size={20} />
                <div style={{ textAlign: 'center', flex: 1, minWidth: '120px' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '14px', border: '1px solid var(--surface-border)', fontWeight: 800, fontSize: '13px' }}>
                    Risk Prediction
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Low / Mod / High</span>
                </div>
                <ArrowRight color="var(--lavender)" size={20} />
                <div style={{ textAlign: 'center', flex: 1, minWidth: '120px' }}>
                  <div style={{ padding: '12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '14px', border: '1px solid var(--primary)', fontWeight: 800, fontSize: '13px' }}>
                    Dashboard
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px', display: 'block', fontWeight: 700 }}>Telemetry View</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section: 3-PC Architecture */}
        <section id="architecture" style={{ padding: '80px 24px', background: 'var(--background)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                DISTRIBUTED HARDWARE ARCHITECTURE
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>
                The 3-PC Prototype Architecture
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '8px', maxWidth: '750px', margin: '8px auto 0' }}>
                The prototype uses a three-PC architecture to separate data generation/monitoring, AI processing and dashboard visualization.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              {/* PC 1 */}
              <div className="pc-node-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Server size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>PC 1: Data Node</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>INCUBATOR TELEMETRY</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Collects sensor input, frame captures, and vital signs directly from patient bedside monitoring apparatus.
                </p>
                <div style={{ marginTop: '16px', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Outputs: Raw Vital Data & Video Stream
                </div>
              </div>

              {/* PC 2 */}
              <div className="pc-node-card" style={{ borderColor: 'var(--lavender)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--lavender-light)', color: 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Cpu size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>PC 2: ML Engine</h3>
                    <span style={{ fontSize: '11px', color: 'var(--lavender)', fontWeight: 700 }}>AI PROCESSING & PREDICTION</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Runs OpenCV motion detection algorithms and the Random Forest machine-learning risk prediction model in real time.
                </p>
                <div style={{ marginTop: '16px', padding: '8px 12px', background: 'var(--lavender-light)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--lavender)' }}>
                  Outputs: ML Predictions & Apnea Alerts
                </div>
              </div>

              {/* PC 3 */}
              <div className="pc-node-card" style={{ borderColor: 'var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Monitor size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>PC 3: NAVAAYU Dashboard</h3>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>CENTRAL CLINICAL DISPLAY</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Displays ward overview, individual patient telemetry, directional trend indicators, and event audit histories for doctors.
                </p>
                <div style={{ marginTop: '16px', padding: '8px 12px', background: 'var(--primary-light)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                  Outputs: Live Interactive Visualization
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section: Final CTA */}
        <section style={{ padding: '80px 24px', background: 'white', textAlign: 'center', borderTop: '1px solid var(--surface-border)' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px', marginBottom: '12px' }}>
              Smarter Monitoring. Clearer Decisions.
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '32px' }}>
              Explore the NAVAAYU neonatal monitoring dashboard.
            </p>
            <button 
              onClick={() => setActiveView(isAuthenticated ? 'dashboard' : 'login')} 
              className="btn-primary"
              style={{ padding: '16px 36px', fontSize: '17px' }}
            >
              Enter NAVAAYU <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '30px 24px', background: '#0F172A', color: '#94A3B8', textAlign: 'center', fontSize: '13px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 800 }}>
              <Baby size={18} color="var(--primary)" /> NAVAAYU Neonatal Monitoring
            </div>
            <div>
              © 2026 NAVAAYU. Intelligent AI-Assisted Clinical Telemetry.
            </div>
          </div>
        </footer>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGIN PAGE (WITH 3D ANIMATED MEDICAL ORB BACKGROUND)
  // =========================================================================
  if (activeView === 'login') {
    return (
      <div className="login-bg-container">
        
        {/* Floating 3D Orbs */}
        <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />
        <div className="floating-orb orb-3" />
        <div className="mesh-grid-overlay" />

        {/* Login Box */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '440px', 
          background: 'rgba(255, 255, 255, 0.96)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '28px', 
          padding: '44px 36px', 
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)', 
          border: '1px solid rgba(255,255,255,0.4)',
          zIndex: 10
        }}>
          
          <button 
            onClick={() => setActiveView('landing')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginBottom: '20px' }}
          >
            <ArrowLeft size={16} /> Back to Overview
          </button>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--primary), #0369A1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 16px', boxShadow: '0 8px 20px var(--glow)' }}>
              <Baby size={32} />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              Welcome to NAVAAYU
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Neonatal Monitoring Dashboard
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Username / User ID
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                <input 
                  type="text"
                  required
                  placeholder="Doctor / Nurse ID"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="medical-input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                <input 
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="medical-input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            {loginError && (
              <div style={{ padding: '10px 14px', background: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '10px', fontSize: '12px', fontWeight: 700 }}>
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '15px', justifyContent: 'center', fontSize: '16px', marginTop: '6px' }}
            >
              Login to NAVAAYU <ArrowRight size={18} />
            </button>

          </form>

          {/* Demo Password Indicator */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--surface-border)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#F1F5F9', borderRadius: '8px', fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>
              🔑 Demo Password: <span style={{ color: 'var(--primary)', fontWeight: 900 }}>1234</span>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 3: CLINICAL DASHBOARD (WITH SAME-PAGE EXPANSION & ML PREDICTIONS)
  // =========================================================================
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Clinical Header */}
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid var(--surface-border)', 
        padding: '16px 36px', 
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo & Clinical Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, var(--primary), #0369A1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Baby size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>NAVAAYU</h1>
                <span style={{ fontSize: '11px', padding: '3px 8px', background: 'var(--mint-light)', color: '#047857', borderRadius: '6px', fontWeight: 800 }}>
                  NICU STATION ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
                Intelligent Neonatal Monitoring & Risk Prediction Hub
              </p>
            </div>
          </div>

          {/* 3-PC Architecture Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#F8FAFC', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
              <Server size={14} color="var(--primary)" />
              <span>PC1 Data</span>
              <span style={{ color: 'var(--text-light)' }}>➔</span>
              <Cpu size={14} color="var(--lavender)" />
              <span>PC2 ML Model</span>
              <span style={{ color: 'var(--text-light)' }}>➔</span>
              <Monitor size={14} color="var(--mint)" />
              <span style={{ color: 'var(--mint)', fontWeight: 800 }}>PC3 Live</span>
            </div>

            {/* Alarm Mute Button */}
            <button 
              onClick={() => setIsMasterMuted(!isMasterMuted)}
              style={{
                padding: '8px 16px',
                background: 'white',
                border: '1px solid var(--surface-border)',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 700,
                color: isMasterMuted ? 'var(--secondary)' : 'var(--mint)'
              }}
            >
              {isMasterMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMasterMuted ? "Alarms Muted" : "Audio Alarms: On"}
            </button>

            {/* Landing Page Link */}
            <button 
              onClick={() => setActiveView('landing')}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              Overview
            </button>

            {/* Logout */}
            <button 
              onClick={() => { setIsAuthenticated(false); setActiveView('landing'); }}
              style={{ padding: '8px 16px', background: '#F1F5F9', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* Main Dashboard Body */}
      <main style={{ maxWidth: '1600px', width: '100%', margin: '0 auto', padding: '32px 36px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Ward Emergency Banner if any baby is in UNSAFE state */}
        {anyCritical && (
          <div style={{ padding: '16px 24px', background: 'var(--secondary-light)', border: '2px solid var(--secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'pulse-soft 1.5s infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={24} color="var(--secondary)" />
              <div>
                <span style={{ fontWeight: 900, color: '#991B1B', fontSize: '14px' }}>WARD ATTENTION REQUIRED:</span>
                <span style={{ fontSize: '13px', color: '#B91C1C', marginLeft: '8px', fontWeight: 600 }}>
                  Incubator #03 (Aditya Rao) is currently flagging critical apnea stillness.
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedBabyId("NB-2026-003")}
              style={{ padding: '8px 18px', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
            >
              Inspect Telemetry
            </button>
          </div>
        )}

        {/* SECTION 1: WARD INCUBATORS OVERVIEW (BABY CARDS) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                NICU Ward Patient Monitors
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Select any patient card to expand full telemetry, ML risk predictions, and history below on this page.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '8px' }}>
              {babies.filter(b => b.status !== 'OFFLINE').length} Active Incubators
            </span>
          </div>

          {/* Baby Card Grid */}
          <div className="baby-card-grid">
            {babies.map((baby) => {
              const isSelected = baby.id === selectedBabyId;
              const isCritical = baby.status === 'UNSAFE';
              const isWarning = baby.status === 'WARNING';
              const isOffline = baby.status === 'OFFLINE';

              return (
                <div 
                  key={baby.id}
                  onClick={() => setSelectedBabyId(baby.id)}
                  className={`baby-summary-card ${
                    isCritical ? 'status-unsafe' : 
                    isWarning ? 'status-warning' : 
                    isOffline ? 'status-offline' : 'status-safe'
                  } ${isSelected ? 'active-selected' : ''}`}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)' }}>
                          {baby.name}
                        </span>
                        {baby.isLiveSource && (
                          <span style={{ padding: '2px 6px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>
                            LIVE
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {baby.id} • {baby.incubator}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: isCritical ? 'var(--secondary-light)' : (isWarning ? 'var(--accent-light)' : (isOffline ? '#F1F5F9' : 'var(--mint-light)')),
                      color: isCritical ? 'var(--secondary)' : (isWarning ? '#B45309' : (isOffline ? '#64748B' : '#047857'))
                    }}>
                      {baby.status === 'UNSAFE' ? 'CRITICAL APNEA' : baby.status}
                    </span>
                  </div>

                  {/* Vitals Summary Strip (with Trend Arrows) */}
                  {!isOffline ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--surface-border)', marginBottom: '14px' }}>
                      
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>HR</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: baby.vitals.heartRate < 100 ? 'var(--secondary)' : 'var(--text-main)' }}>
                          {baby.vitals.heartRate}
                        </span>
                        <span className={`trend-arrow ${baby.trends.heartRate.direction}`} style={{ marginTop: '2px' }}>
                          {baby.trends.heartRate.symbol}
                        </span>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>SpO₂</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: baby.vitals.spo2 < 93 ? 'var(--secondary)' : 'var(--text-main)' }}>
                          {baby.vitals.spo2}%
                        </span>
                        <span className={`trend-arrow ${baby.trends.spo2.direction}`} style={{ marginTop: '2px' }}>
                          {baby.trends.spo2.symbol}
                        </span>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>RESP</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: baby.vitals.respRate < 30 ? 'var(--accent)' : 'var(--text-main)' }}>
                          {baby.vitals.respRate}
                        </span>
                        <span className={`trend-arrow ${baby.trends.respRate.direction}`} style={{ marginTop: '2px' }}>
                          {baby.trends.respRate.symbol}
                        </span>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>TEMP</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                          {baby.vitals.temp}°C
                        </span>
                        <span className={`trend-arrow ${baby.trends.temp.direction}`} style={{ marginTop: '2px' }}>
                          {baby.trends.temp.symbol}
                        </span>
                      </div>

                    </div>
                  ) : (
                    <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center', fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '14px' }}>
                      Incubator currently vacant / Discharged
                    </div>
                  )}

                  {/* Card Bottom Strip: Risk Level & Expand Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Brain size={13} color="var(--lavender)" />
                      <span style={{ fontWeight: 800, color: isCritical ? 'var(--secondary)' : (isWarning ? '#B45309' : 'var(--primary)') }}>
                        ML Risk: {baby.riskLevel}
                      </span>
                    </div>

                    <span style={{ fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isSelected ? "Expanded Active" : "Click to View Details"}
                      {isSelected ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: SAME-PAGE EXPANDED TELEMETRY & PREDICTION VIEW */}
        <div className="expanded-patient-panel" style={{ padding: '32px' }}>
          
          {/* Header of Expanded Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--surface-border)', paddingBottom: '20px', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900 }}>
                  {activeBaby.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                      {activeBaby.name}
                    </h2>
                    <span style={{ padding: '3px 10px', background: '#F1F5F9', borderRadius: '6px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>
                      {activeBaby.id}
                    </span>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      background: activeBaby.status === 'UNSAFE' ? 'var(--secondary-light)' : (activeBaby.status === 'WARNING' ? 'var(--accent-light)' : 'var(--mint-light)'),
                      color: activeBaby.status === 'UNSAFE' ? 'var(--secondary)' : (activeBaby.status === 'WARNING' ? '#B45309' : '#047857')
                    }}>
                      Status: {activeBaby.status}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {activeBaby.incubator} • {activeBaby.age} • Gestation: {activeBaby.gestationalAge} • Current Weight: {activeBaby.weight}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Switcher dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>FOCUSED PATIENT:</span>
              <select 
                value={selectedBabyId}
                onChange={(e) => setSelectedBabyId(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border)', background: '#F8FAFC', fontWeight: 800, fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                {babies.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Layout: Left Column (Vitals & ML Prediction) | Right Column (Waveforms & History) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }}>
            
            {/* Left Column: Vitals, ML Prediction & Contributing Reasons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* 1. Vital Parameters & Directional Trend Detection */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary)" /> Vital Parameters & Real-Time Trend Detection
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  
                  {/* Heart Rate Card */}
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>HEART RATE</span>
                      <span className={`trend-arrow ${activeBaby.trends.heartRate.direction}`}>
                        {activeBaby.trends.heartRate.symbol}
                      </span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: activeBaby.vitals.heartRate < 100 ? 'var(--secondary)' : 'var(--text-main)' }}>
                      {activeBaby.vitals.heartRate} <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>BPM</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                      Trend: {activeBaby.trends.heartRate.label}
                    </div>
                  </div>

                  {/* SpO2 Card */}
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>OXYGEN (SpO₂)</span>
                      <span className={`trend-arrow ${activeBaby.trends.spo2.direction}`}>
                        {activeBaby.trends.spo2.symbol}
                      </span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: activeBaby.vitals.spo2 < 93 ? 'var(--secondary)' : 'var(--text-main)' }}>
                      {activeBaby.vitals.spo2} <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                      Trend: {activeBaby.trends.spo2.label}
                    </div>
                  </div>

                  {/* Respiratory Rate Card */}
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>RESPIRATORY RATE</span>
                      <span className={`trend-arrow ${activeBaby.trends.respRate.direction}`}>
                        {activeBaby.trends.respRate.symbol}
                      </span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: activeBaby.vitals.respRate < 30 ? 'var(--accent)' : 'var(--text-main)' }}>
                      {activeBaby.vitals.respRate} <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>BPM</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                      Trend: {activeBaby.trends.respRate.label}
                    </div>
                  </div>

                  {/* Temperature Card */}
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>TEMPERATURE</span>
                      <span className={`trend-arrow ${activeBaby.trends.temp.direction}`}>
                        {activeBaby.trends.temp.symbol}
                      </span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)' }}>
                      {activeBaby.vitals.temp} <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>°C</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                      Trend: {activeBaby.trends.temp.label}
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. Random Forest ML Risk Prediction & Contributing Reasons */}
              <div style={{ 
                padding: '24px', 
                background: activeBaby.status === 'UNSAFE' ? 'var(--secondary-light)' : (activeBaby.status === 'WARNING' ? 'var(--accent-light)' : 'var(--lavender-light)'), 
                borderRadius: '16px', 
                border: `1.5px solid ${activeBaby.status === 'UNSAFE' ? 'var(--secondary)' : (activeBaby.status === 'WARNING' ? 'var(--accent)' : 'var(--lavender)')}` 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Brain size={22} color={activeBaby.status === 'UNSAFE' ? 'var(--secondary)' : 'var(--lavender)'} />
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                      Random Forest Risk Prediction
                    </h3>
                  </div>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 900,
                    background: activeBaby.status === 'UNSAFE' ? 'var(--secondary)' : (activeBaby.status === 'WARNING' ? 'var(--accent)' : 'var(--lavender)'),
                    color: 'white'
                  }}>
                    RISK LEVEL: {activeBaby.riskLevel}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Contributing Physiological Factors Identified:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeBaby.predictionReasons.map((reason: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E293B', fontWeight: 600 }}>
                      <span style={{ color: activeBaby.status === 'UNSAFE' ? 'var(--secondary)' : 'var(--primary)', fontWeight: 900 }}>•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span>Model Architecture: Random Forest Classifier (PC2 Node)</span>
                  <span>Confidence: {activeBaby.riskLevel === 'HIGH' ? '96%' : '94%'}</span>
                </div>
              </div>

              {/* 3. Detailed Patient Medical History & Clinical Profile */}
              <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--primary)" /> Patient Medical History & Maternal Record
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px' }}>
                    APGAR: {activeBaby.apgarScore}
                  </span>
                </div>

                <div style={{ padding: '10px 14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid var(--surface-border)', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Clinical Diagnosis & Admission Reason:</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>{activeBaby.clinicalDiagnosis}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Mother's Profile:</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{activeBaby.motherName}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Delivery Type:</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{activeBaby.deliveryType}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Birth Weight & Growth:</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{activeBaby.birthWeight} (Now: {activeBaby.weight})</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Blood Group & Rh:</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{activeBaby.bloodGroup}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Maternal Obstetric History:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeBaby.maternalHistory}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Feeding Protocol:</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{activeBaby.feedingSchedule}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Active Neonatal Medications:</span>
                    <span style={{ fontWeight: 700, color: '#0369A1' }}>{activeBaby.medications}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Phototherapy & Bilirubin:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeBaby.phototherapyStatus}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Waveform Trends, PC2 Vision Telemetry, & Shift History Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Real-time Trend Chart: Respiratory Activity & Chest Displacement */}
              <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Continuous Trend: Respiratory Rate & Motion Signal
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    30-sec sliding telemetry
                  </span>
                </div>
                
                <div style={{ height: '140px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveformData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="breathing" stroke="var(--primary)" fill="rgba(2,132,199,0.15)" strokeWidth={2.5} isAnimationActive={false} />
                      <Area type="monotone" dataKey="motion" stroke="var(--lavender)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Real-time Trend Chart: Heart Rate & SpO2 */}
              <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Bedside Trend: Heart Rate (BPM) & Oxygen (SpO₂ %)
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Continuous vitals sync
                  </span>
                </div>
                
                <div style={{ height: '140px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveformData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="heartRate" stroke="var(--secondary)" fill="rgba(239,68,68,0.15)" strokeWidth={2.5} isAnimationActive={false} />
                      <Area type="monotone" dataKey="spo2" stroke="var(--mint)" fill="transparent" strokeWidth={2} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PC2 & PC3 Vision & Audio Telemetry Node */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                
                {/* PC2 Vision Node Card */}
                <div style={{ padding: '16px', background: '#0F172A', color: 'white', borderRadius: '14px', border: '1px solid #1E293B' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8' }}>PC2 VISION NODE</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeBaby.status === 'UNSAFE' ? 'var(--secondary)' : 'var(--mint)' }} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>
                    Stillness: {activeBaby.stillTime}s
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                    Motion: {activeBaby.status === 'UNSAFE' ? '0.00 px (Apnea)' : '1.24 px (Active)'}
                  </div>
                </div>

                {/* PC3 Audio Cry Node Card */}
                <div style={{ padding: '16px', background: '#0F172A', color: 'white', borderRadius: '14px', border: '1px solid #1E293B' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8' }}>PC3 BIO-ACOUSTIC NODE</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeBaby.cryStatus === 'distress' ? 'var(--accent)' : 'var(--mint)' }} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>
                    {activeBaby.cryStatus === 'distress' ? 'Distress Cry Detected' : 'Calm / Silent'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                    Acoustic Classifier Link: Active
                  </div>
                </div>

              </div>

              {/* Dedicated Alert History & Clinical History Log */}
              <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={17} color={activeBaby.status === 'UNSAFE' ? 'var(--secondary)' : 'var(--primary)'} />
                    Alert History & Clinical Event Log ({activeBaby.name})
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {(activeBaby.alertHistory || []).length} Logged Events
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                  {(activeBaby.alertHistory || []).map((evt: any, i: number) => {
                    const isCritical = evt.level === 'critical';
                    const isWarning = evt.level === 'warning';
                    const isCare = evt.level === 'care';

                    return (
                      <div 
                        key={i} 
                        style={{ 
                          padding: '12px 14px', 
                          background: isCritical ? 'var(--secondary-light)' : (isWarning ? 'var(--accent-light)' : (isCare ? '#F0FDF4' : 'white')), 
                          borderRadius: '12px', 
                          border: `1px solid ${isCritical ? '#FECACA' : (isWarning ? '#FDE68A' : (isCare ? '#BBF7D0' : '#E2E8F0'))}`,
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: '3px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 800, 
                            textTransform: 'uppercase',
                            color: isCritical ? '#991B1B' : (isWarning ? '#B45309' : (isCare ? '#15803D' : 'var(--primary)')) 
                          }}>
                            {isCritical ? '🚨 ' : (isWarning ? '⚠️ ' : (isCare ? '🍼 ' : 'ℹ️ '))}
                            {evt.title}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                            {evt.time}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: isCritical ? '#7F1D1D' : '#334155', fontWeight: 600 }}>
                          {evt.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Clean Bottom Bar */}
      <footer style={{ padding: '20px 36px', background: 'white', borderTop: '1px solid var(--surface-border)', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        NAVAAYU Clinical Telemetry • Connected to 3-PC Architecture (PC1 Sensor ➔ PC2 Random Forest ML ➔ PC3 Clinical Display)
      </footer>

    </div>
  );
}

export default App;