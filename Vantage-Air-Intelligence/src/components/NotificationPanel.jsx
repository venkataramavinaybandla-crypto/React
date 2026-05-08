import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle, Bell, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ease = [0.16, 1, 0.3, 1]

const initialNotifications = [
  {
    id: 1,
    type: 'critical',
    icon: AlertTriangle,
    title: 'Gate Conflict Detected',
    body: 'VT-509 double-assigned: B3 & A6. Reassignment required.',
    time: '06:51',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    icon: AlertTriangle,
    title: 'Delay Cascade Risk',
    body: 'VT-721 (+40min) may impact B1 turnaround slot.',
    time: '06:38',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    icon: Info,
    title: 'Runway 14/32 WET',
    body: 'Surface condition updated. 10kt crosswind limit active.',
    time: '06:20',
    read: true,
  },
  {
    id: 4,
    type: 'success',
    icon: CheckCircle,
    title: 'VT-204 Cleared',
    body: 'JFK→CDG flight cleared for pushback. Gate B1.',
    time: '06:10',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    icon: Info,
    title: 'Peak Load Approaching',
    body: 'Pax throughput forecast: 1,620/hr at 08:30.',
    time: '06:02',
    read: true,
  },
  {
    id: 6,
    type: 'success',
    icon: CheckCircle,
    title: 'Greedy Alloc Complete',
    body: 'Gate scheduling optimized. 9/9 flights assigned.',
    time: '05:55',
    read: true,
  },
]

const typeConfig = {
  critical: { bg: 'bg-red-50 dark:bg-red-950/40',     border: 'border-l-red-500',    text: 'text-red-600 dark:text-red-400',     icon: 'text-red-500'      },
  warning:  { bg: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-l-signal',    text: 'text-signal',                         icon: 'text-signal'       },
  info:     { bg: 'bg-blue-50 dark:bg-blue-950/40',   border: 'border-l-blue-400',   text: 'text-blue-700 dark:text-blue-400',    icon: 'text-blue-500'     },
  success:  { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-l-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-500' },
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const navigate = useNavigate()

  const unread = notifications.filter(n => !n.read).length

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const dismiss = (e, id) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="card p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-label">Notifications</p>
          <p className="text-matte-black dark:text-[#E8E2D9] font-semibold text-sm mt-0.5">Ops Alerts</p>
        </div>
        {unread > 0 && (
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-signal text-white"
          >
            <Bell size={10} />
            <span className="text-[10px] font-bold">{unread}</span>
          </motion.div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        <AnimatePresence>
          {notifications.map((n, i) => {
            const cfg = typeConfig[n.type]
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: n.read ? 0.65 : 1, x: 0 }}
                exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.04, ease, duration: 0.4 }}
                whileHover={{
                  scale: 1.02,
                  opacity: 1,
                  boxShadow: '0 6px 20px rgba(26,26,26,0.09)',
                  transition: { ease, duration: 0.25 },
                }}
                onClick={() => markRead(n.id)}
                className={`group relative rounded-xl border-l-[3px] p-2.5 cursor-pointer ${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-start gap-2">
                  <n.icon size={13} className={`flex-shrink-0 mt-0.5 ${cfg.icon}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-[11px] font-semibold truncate ${cfg.text}`}>{n.title}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[9px] text-taupe-400 font-mono">{n.time}</span>
                        <button
                          type="button"
                          onClick={(e) => dismiss(e, n.id)}
                          className="opacity-0 group-hover:opacity-100 hover:text-matte-black text-taupe-300 transition-opacity"
                        >
                          <X size={9} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-taupe-500 leading-relaxed mt-0.5">{n.body}</p>
                  </div>
                </div>
                {!n.read && (
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-signal animate-live-blink" />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-taupe-300">
            <Bell size={22} className="mb-2 opacity-40" />
            <p className="text-[11px]">All clear — no notifications</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-taupe-100 dark:border-white/5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          className="text-[11px] text-taupe-400 hover:text-taupe-600 transition-colors relative z-10"
        >
          Mark all read
        </button>
        <button
          type="button"
          onClick={() => navigate('/alerts')}
          className="text-[11px] font-semibold text-signal hover:underline relative z-10"
        >
          View full log →
        </button>
      </div>
    </div>
  )
}
