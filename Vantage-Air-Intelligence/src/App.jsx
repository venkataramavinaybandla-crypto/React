import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'

import OverviewPage    from './pages/OverviewPage'
import FlightOpsPage   from './pages/FlightOpsPage'
import GateControlPage from './pages/GateControlPage'
import GroundNavPage   from './pages/GroundNavPage'
import AnalyticsPage   from './pages/AnalyticsPage'
import AlertsPage      from './pages/AlertsPage'
import SettingsPage    from './pages/SettingsPage'

// ── Settings Context ────────────────────────────────────────────────────────
const defaultPrefs = {
  liveAlerts:   true,
  soundAlerts:  false,
  autoResolve:  false,
  darkMode:     false,
  compactView:  false,
  autoRefresh:  true,
  radarFeed:    true,
  fidsSync:     true,
  greedyAlloc:  true,
  dijkstraOpt:  true,
  refreshInterval: '30 seconds',
  avlThreshold: '1 (Strict)',
  theme: 'Antigravity',
}

export const SettingsContext = createContext(null)

export function useSettings() {
  return useContext(SettingsContext)
}

// ── Page metadata ────────────────────────────────────────────────────────────
const pageTitles = {
  '/overview':   { title: 'Operations Briefing',  sub: 'Live Airport Intelligence'    },
  '/flights':    { title: 'Flight Operations',     sub: 'Schedule · Slots · BST Index' },
  '/gates':      { title: 'Gate Control',          sub: 'Real-time Assignment Monitor' },
  '/ground':     { title: 'Ground Navigation',     sub: 'Dijkstra Optimal Routing'     },
  '/analytics':  { title: 'Analytics',             sub: 'Traffic · Delay · Performance'},
  '/alerts':     { title: 'Alerts',                sub: 'Operational Notifications'    },
  '/settings':   { title: 'Settings',              sub: 'System · Admin · Preferences' },
}

function Header({ time }) {
  const location = useLocation()
  const meta = pageTitles[location.pathname] || pageTitles['/overview']

  const fmt     = d => d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
  const fmtDate = d => d.toLocaleDateString('en-GB',  { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-taupe-100 dark:border-white/5 bg-cream/80 dark:bg-[#111]/80 backdrop-blur-sm z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-matte-black dark:text-[#E8E2D9] font-bold text-lg tracking-tight leading-none">{meta.title}</h1>
          <p className="text-taupe-500 text-xs mt-0.5">{meta.sub} · {fmtDate(time)}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-live-blink" />
          <span className="section-label">Live</span>
        </div>
        <div className="font-mono text-sm font-medium text-matte-black dark:text-[#E8E2D9] tabular-nums">
          {fmt(time)} <span className="text-taupe-400 text-xs ml-1">IST</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-signal text-white text-xs font-semibold shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-blink" />
          2 Alerts
        </div>
      </div>
    </header>
  )
}

function Layout() {
  const location = useLocation()
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  return (
    <div className="flex h-full bg-cream dark:bg-[#111] overflow-hidden font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header time={time} />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 overflow-y-auto"
          >
            <Routes location={location}>
              <Route path="/"           element={<Navigate to="/overview" replace />} />
              <Route path="/overview"   element={<OverviewPage />}    />
              <Route path="/flights"    element={<FlightOpsPage />}   />
              <Route path="/gates"      element={<GateControlPage />} />
              <Route path="/ground"     element={<GroundNavPage />}   />
              <Route path="/analytics"  element={<AnalyticsPage />}   />
              <Route path="/alerts"     element={<AlertsPage />}      />
              <Route path="/settings"   element={<SettingsPage />}    />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function App() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('vantage_settings')
      return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs
    } catch { return defaultPrefs }
  })

  // Apply / remove dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', prefs.darkMode)
  }, [prefs.darkMode])

  const updatePrefs = (updates) => {
    setPrefs(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem('vantage_settings', JSON.stringify(next))
      return next
    })
  }

  return (
    <SettingsContext.Provider value={{ prefs, updatePrefs }}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </SettingsContext.Provider>
  )
}
