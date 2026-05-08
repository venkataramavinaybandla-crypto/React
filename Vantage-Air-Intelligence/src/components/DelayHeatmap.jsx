import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

// Hours 06:00 → 20:00
const hours = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

const routes = [
  { label: 'DXB→LHR', delays: [0, 0, 25, 10, 0, 0, 15, 0, 0, 5, 0, 0, 30, 45, 20] },
  { label: 'JFK→CDG', delays: [0, 0, 0,  0,  5, 0, 0,  0, 0, 0, 0, 0, 0,  10, 0 ] },
  { label: 'SIN→NRT', delays: [0, 25,0,  0,  0, 0, 0,  0, 0, 0, 0, 0, 0,  0,  0 ] },
  { label: 'LAX→ORD', delays: [0, 0, 0,  0,  0, 0, 0,  0, 0, 0, 0, 0, 0,  0,  0 ] },
  { label: 'MIA→ATL', delays: [0, 0, 0,  0,  0, 0, 0, 15, 0, 0, 0, 0, 0,  0,  0 ] },
  { label: 'SEA→DFW', delays: [0, 0, 0,  0,  0, 0, 0,  0, 0, 0, 0, 0, 0,  20, 0 ] },
]

function delayColor(min) {
  if (min === 0)   return 'bg-taupe-50 border border-taupe-100'
  if (min < 15)    return 'bg-orange-100'
  if (min < 30)    return 'bg-orange-300'
  return 'bg-signal'
}

function delayText(min) {
  if (min === 0)  return ''
  return `${min}m`
}

export default function DelayHeatmap() {
  return (
    <div className="card p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-label">Delay Heatmap</p>
          <p className="text-matte-black font-semibold text-sm mt-0.5">Route × Time (minutes)</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[9px] text-taupe-400">
            <span className="w-3 h-3 rounded bg-taupe-50 border border-taupe-100 inline-block" />None
          </div>
          <div className="flex items-center gap-1 text-[9px] text-taupe-400">
            <span className="w-3 h-3 rounded bg-orange-100 inline-block" />&lt;15m
          </div>
          <div className="flex items-center gap-1 text-[9px] text-taupe-400">
            <span className="w-3 h-3 rounded bg-orange-300 inline-block" />&lt;30m
          </div>
          <div className="flex items-center gap-1 text-[9px] text-taupe-400">
            <span className="w-3 h-3 rounded bg-signal inline-block" />30m+
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        {/* Hour headers */}
        <div className="flex gap-0.5 mb-0.5 ml-[70px]">
          {hours.map(h => (
            <div key={h} className="w-6 flex-shrink-0 text-center section-label">{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-0.5">
          {routes.map((route, ri) => (
            <div key={route.label} className="flex items-center gap-0.5">
              <span className="w-[70px] flex-shrink-0 text-[10px] font-mono font-medium text-taupe-600 pr-1.5 text-right">
                {route.label}
              </span>
              {route.delays.map((delay, hi) => (
                <motion.div
                  key={hi}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: ri * 0.06 + hi * 0.01, ease, duration: 0.3 }}
                  whileHover={{ scale: 1.25, zIndex: 10, transition: { ease, duration: 0.2 } }}
                  title={delay > 0 ? `${route.label} at ${hours[hi]}:00 — ${delay}min delay` : 'No delay'}
                  className={`relative w-6 h-6 flex-shrink-0 rounded-md flex items-center justify-center cursor-default ${delayColor(delay)}`}
                >
                  {delay > 0 && (
                    <span className={`text-[7px] font-bold leading-none ${delay >= 30 ? 'text-white' : 'text-matte-black'}`}>
                      {delayText(delay)}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
