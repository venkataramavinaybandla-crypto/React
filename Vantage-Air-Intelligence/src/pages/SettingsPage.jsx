import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Users, Bell, Database, Shield, Download, Monitor, Save } from 'lucide-react'
import { useSettings } from '../App'

const ease = [0.16, 1, 0.3, 1]

function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-signal' : 'bg-taupe-200'}`}>
      <motion.span
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <motion.div whileHover={{ scale: 1.005, boxShadow: '0 8px 30px rgba(26,26,26,0.07)', transition: { ease, duration: 0.35 } }}
      className="card p-5"
    >
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-taupe-100">
        <div className="w-8 h-8 bg-taupe-50 rounded-xl flex items-center justify-center">
          <Icon size={15} className="text-taupe-500" />
        </div>
        <h3 className="text-sm font-bold text-matte-black">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  )
}

function SettingRow({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-matte-black">{label}</p>
        {sub && <p className="text-[10px] text-taupe-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { prefs: globalPrefs, updatePrefs } = useSettings()
  const [prefs, setPrefs] = useState(globalPrefs)

  // Sync if global prefs change outside
  useEffect(() => {
    setPrefs(globalPrefs)
  }, [globalPrefs])

  const set = key => val => setPrefs(p => ({ ...p, [key]: val }))

  const handleSave = () => {
    updatePrefs(prefs)
  }

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left column */}
        <div className="col-span-8 space-y-4">
          {/* System config */}
          <Section icon={Monitor} title="System Configuration">
            <SettingRow label="Auto Refresh" sub="Sync all feeds every 30 seconds">
              <Toggle value={prefs.autoRefresh} onChange={set('autoRefresh')} />
            </SettingRow>
            <SettingRow label="Radar Feed" sub="Live radar data from ATC">
              <Toggle value={prefs.radarFeed} onChange={set('radarFeed')} />
            </SettingRow>
            <SettingRow label="FIDS Sync" sub="Flight Information Display System">
              <Toggle value={prefs.fidsSync} onChange={set('fidsSync')} />
            </SettingRow>
            <SettingRow label="Refresh Interval" sub="Data polling frequency">
              <select className="text-xs border border-taupe-100 rounded-lg px-2 py-1.5 bg-taupe-50 text-matte-black focus:outline-none focus:border-signal">
                <option>30 seconds</option>
                <option>1 minute</option>
                <option>5 minutes</option>
              </select>
            </SettingRow>
          </Section>

          {/* Algorithms */}
          <Section icon={Database} title="Algorithm Configuration">
            <SettingRow label="Greedy Gate Allocation" sub="Activity selection for gate scheduling">
              <Toggle value={prefs.greedyAlloc} onChange={set('greedyAlloc')} />
            </SettingRow>
            <SettingRow label="Dijkstra Ground Routing" sub="Shortest path computation for ground ops">
              <Toggle value={prefs.dijkstraOpt} onChange={set('dijkstraOpt')} />
            </SettingRow>
            <SettingRow label="BST Flight Index" sub="Binary Search Tree for O(log n) lookups">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Always On</span>
            </SettingRow>
            <SettingRow label="AVL Rebalance Threshold" sub="Rotate when height diff exceeds">
              <select className="text-xs border border-taupe-100 rounded-lg px-2 py-1.5 bg-taupe-50 text-matte-black focus:outline-none focus:border-signal">
                <option>1 (Strict)</option>
                <option>2 (Balanced)</option>
              </select>
            </SettingRow>
          </Section>

          {/* Notifications */}
          <Section icon={Bell} title="Notification Preferences">
            <SettingRow label="Live Alerts" sub="Real-time critical notifications">
              <Toggle value={prefs.liveAlerts} onChange={set('liveAlerts')} />
            </SettingRow>
            <SettingRow label="Sound Alerts" sub="Audible alarm for critical events">
              <Toggle value={prefs.soundAlerts} onChange={set('soundAlerts')} />
            </SettingRow>
            <SettingRow label="Auto Resolve Warnings" sub="Automatically close low-priority alerts after 1hr">
              <Toggle value={prefs.autoResolve} onChange={set('autoResolve')} />
            </SettingRow>
          </Section>
        </div>

        {/* Right column */}
        <div className="col-span-4 space-y-4">
          {/* Display */}
          <Section icon={Settings} title="Display">
            <SettingRow label="Compact View" sub="Denser information layout">
              <Toggle value={prefs.compactView} onChange={set('compactView')} />
            </SettingRow>
            <SettingRow label="Dark Mode" sub="Enable dark color scheme">
              <Toggle value={prefs.darkMode} onChange={set('darkMode')} />
            </SettingRow>
            <SettingRow label="Theme" sub="Interface color scheme">
              <select className="text-xs border border-taupe-100 rounded-lg px-2 py-1.5 bg-taupe-50 text-matte-black focus:outline-none focus:border-signal">
                <option>Antigravity</option>
                <option>Monochrome</option>
              </select>
            </SettingRow>
          </Section>

          {/* Security */}
          <Section icon={Shield} title="Security">
            {[['Session Timeout','30 min idle'],['Role','Administrator'],['2FA','Enabled']].map(([k,v])=>(
              <SettingRow key={k} label={k} sub="">
                <span className="text-[10px] font-semibold text-taupe-600 bg-taupe-50 px-2 py-1 rounded-lg">{v}</span>
              </SettingRow>
            ))}
            <button className="w-full mt-1 py-2 rounded-xl border border-taupe-200 text-xs font-semibold text-taupe-600 hover:bg-taupe-50">
              Change Password
            </button>
          </Section>

          {/* Export */}
          <Section icon={Download} title="Export & Reports">
            {[['Export Daily Brief','PDF'],['Export Flight Log','CSV'],['Export Alert Log','JSON']].map(([label,format])=>(
              <button key={label}
                className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-taupe-50 hover:bg-taupe-100 transition-colors text-xs text-matte-black font-medium">
                {label}
                <span className="font-mono font-bold text-taupe-400 text-[10px]">{format}</span>
              </button>
            ))}
          </Section>

          {/* Save */}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.03, transition: { ease, duration: 0.3 } }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-signal text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
          >
            <Save size={15} /> Save Settings
          </motion.button>
        </div>
      </div>
    </div>
  )
}
