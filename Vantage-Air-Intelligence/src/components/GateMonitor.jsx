import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const terminals = [
  {
    id: 'T-A',
    label: 'Terminal A',
    gates: [
      { id: 'A1', status: 'open',        flight: null,     ac: null    },
      { id: 'A2', status: 'boarding',    flight: 'VT-422', ac: 'A320'  },
      { id: 'A3', status: 'boarding',    flight: 'VT-101', ac: 'B777'  },
      { id: 'A4', status: 'open',        flight: null,     ac: null    },
      { id: 'A5', status: 'delayed',     flight: 'VT-721', ac: 'E175'  },
      { id: 'A6', status: 'conflict',    flight: 'VT-509', ac: 'B737'  },
      { id: 'A7', status: 'maintenance', flight: null,     ac: null    },
      { id: 'A8', status: 'open',        flight: null,     ac: null    },
    ],
  },
  {
    id: 'T-B',
    label: 'Terminal B',
    gates: [
      { id: 'B1', status: 'boarding',    flight: 'VT-204', ac: 'A380'  },
      { id: 'B2', status: 'open',        flight: null,     ac: null    },
      { id: 'B3', status: 'conflict',    flight: 'VT-509', ac: 'B737'  },
      { id: 'B4', status: 'open',        flight: null,     ac: null    },
      { id: 'B5', status: 'boarding',    flight: 'VT-833', ac: 'B737'  },
      { id: 'B9', status: 'on-time',     flight: 'VT-614', ac: 'A321'  },
    ],
  },
  {
    id: 'T-C',
    label: 'Terminal C',
    gates: [
      { id: 'C1', status: 'open',        flight: null,     ac: null    },
      { id: 'C2', status: 'boarding',    flight: 'VT-318', ac: 'B787'  },
      { id: 'C3', status: 'open',        flight: null,     ac: null    },
      { id: 'C4', status: 'maintenance', flight: null,     ac: null    },
      { id: 'C5', status: 'open',        flight: null,     ac: null    },
      { id: 'C6', status: 'boarding',    flight: 'VT-614', ac: 'A321'  },
    ],
  },
]

const statusConfig = {
  open:        { bg: 'bg-taupe-50',        text: 'text-taupe-400',   dot: 'bg-taupe-300'  },
  boarding:    { bg: 'bg-blue-50',         text: 'text-blue-600',    dot: 'bg-blue-500'   },
  'on-time':   { bg: 'bg-emerald-50',      text: 'text-emerald-600', dot: 'bg-emerald-500'},
  delayed:     { bg: 'bg-orange-50',       text: 'text-signal',      dot: 'bg-signal'     },
  conflict:    { bg: 'bg-red-50',          text: 'text-red-600',     dot: 'bg-red-500'    },
  maintenance: { bg: 'bg-taupe-100',       text: 'text-taupe-500',   dot: 'bg-taupe-400'  },
}

export default function GateMonitor() {
  const conflictCount = terminals.flatMap(t => t.gates).filter(g => g.status === 'conflict').length

  return (
    <div className="card p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-label">Gate Monitor</p>
          <p className="text-matte-black font-semibold text-sm mt-0.5">Real-time Status</p>
        </div>
        {conflictCount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200"
          >
            <AlertTriangle size={11} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-600">{conflictCount} Conflicts</span>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {Object.entries(statusConfig).map(([s, c]) => (
          <div key={s} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            <span className="text-[9px] text-taupe-400 capitalize">{s}</span>
          </div>
        ))}
      </div>

      {/* Terminals */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {terminals.map((term) => (
          <div key={term.id}>
            <p className="section-label mb-1.5">{term.label}</p>
            <div className="grid grid-cols-4 gap-1.5">
              {term.gates.map((gate, i) => {
                const cfg = statusConfig[gate.status] || statusConfig.open
                const isConflict = gate.status === 'conflict'
                return (
                  <motion.div
                    key={gate.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, ease, duration: 0.35 }}
                    whileHover={{ scale: 1.07, transition: { ease, duration: 0.25 } }}
                    className={`relative p-2 rounded-xl ${cfg.bg} cursor-default ${
                      isConflict ? 'animate-signal-pulse ring-1 ring-red-300' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-matte-black">{gate.id}</span>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot} ${
                        isConflict ? 'animate-live-blink' : ''
                      }`} />
                    </div>
                    {gate.flight ? (
                      <>
                        <p className={`text-[9px] font-semibold ${cfg.text}`}>{gate.flight}</p>
                        <p className="text-[8px] text-taupe-400 font-mono">{gate.ac}</p>
                      </>
                    ) : (
                      <p className="text-[9px] text-taupe-400 capitalize">{gate.status}</p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
