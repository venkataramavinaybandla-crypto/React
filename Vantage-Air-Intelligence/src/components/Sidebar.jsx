import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Plane, DoorOpen, Map,
  BarChart2, Bell, Settings, Zap,
} from 'lucide-react'

const nav = [
  { to: '/overview',  icon: LayoutDashboard, label: 'Overview'     },
  { to: '/flights',   icon: Plane,           label: 'Flight Ops'   },
  { to: '/gates',     icon: DoorOpen,        label: 'Gate Control' },
  { to: '/ground',    icon: Map,             label: 'Ground Nav'   },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics'    },
  { to: '/alerts',    icon: Bell,            label: 'Alerts', badge: 2 },
]

const ease = [0.16, 1, 0.3, 1]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease, duration: 0.55 }}
      className="glass-panel w-[240px] flex-shrink-0 h-full flex flex-col z-20"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-taupe-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-matte-black rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-signal fill-signal" />
          </div>
          <div>
            <div className="text-matte-black font-extrabold text-sm tracking-[0.14em] uppercase leading-none">Aizen</div>
            <div className="text-taupe-500 text-[9px] tracking-[0.22em] uppercase mt-0.5">Air Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="section-label px-3 mb-3">Navigation</p>
        {nav.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.05, ease, duration: 0.4 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 relative group ${
                  isActive
                    ? 'bg-matte-black text-white'
                    : 'text-taupe-600 hover:bg-taupe-50 hover:text-matte-black'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} className={isActive ? 'text-signal' : ''} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-signal text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-1 h-4 bg-signal rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-taupe-100 pt-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
              isActive ? 'bg-matte-black text-white' : 'text-taupe-600 hover:bg-taupe-50 hover:text-matte-black'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={16} className={isActive ? 'text-signal' : ''} />
              Settings
            </>
          )}
        </NavLink>

        {/* System Status */}
        <div className="mt-3 mx-1 p-3 rounded-xl bg-taupe-50 border border-taupe-100">
          <p className="section-label mb-2">System Status</p>
          {[['ATIS Feed', true], ['Radar Link', true], ['FIDS Sync', true]].map(([label, ok]) => (
            <div key={label} className="flex items-center justify-between py-0.5">
              <span className="text-xs text-taupe-500">{label}</span>
              <span className={`w-1.5 h-1.5 rounded-full animate-live-blink ${ok ? 'bg-emerald-500' : 'bg-signal'}`} />
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
