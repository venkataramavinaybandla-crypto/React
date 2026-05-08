import { motion } from 'framer-motion'
import { Activity, Plane, Clock, Users } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const kpis = [
  {
    id: 'health',
    icon: Activity,
    label: 'Airport Health',
    value: '94',
    unit: '%',
    sub: '+2.1% vs yesterday',
    positive: true,
    highlight: true,
  },
  {
    id: 'flights',
    icon: Plane,
    label: 'Active Flights',
    value: '38',
    unit: '',
    sub: '6 arriving · 32 departing',
    positive: true,
    highlight: false,
  },
  {
    id: 'ontime',
    icon: Clock,
    label: 'On-Time Rate',
    value: '81',
    unit: '%',
    sub: '↓ 4.3% from avg',
    positive: false,
    highlight: false,
  },
  {
    id: 'pax',
    icon: Users,
    label: 'Pax / Hour',
    value: '1,240',
    unit: '',
    sub: 'Peak capacity: 1,800',
    positive: true,
    highlight: false,
  },
]

export default function KPISummary() {
  return (
    <div className="grid grid-cols-4 gap-3 h-full">
      {kpis.map((k, i) => (
        <motion.div
          key={k.id}
          whileHover={{
            scale: 1.03,
            boxShadow: '0 20px 60px rgba(26,26,26,0.13)',
            transition: { ease, duration: 0.4 },
          }}
          className={`card p-4 flex flex-col justify-between cursor-default ${
            k.highlight ? 'border border-signal/20' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                k.highlight ? 'bg-signal text-white' : 'bg-taupe-50 text-taupe-500'
              }`}
            >
              <k.icon size={16} />
            </div>
            {k.highlight && (
              <span className="text-[9px] font-bold tracking-widest uppercase text-signal bg-signal/10 px-2 py-0.5 rounded-full">
                Live
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-end gap-0.5">
              <span className="text-3xl font-extrabold text-matte-black leading-none tabular-nums">
                {k.value}
              </span>
              {k.unit && (
                <span className="text-base font-semibold text-taupe-400 mb-0.5">{k.unit}</span>
              )}
            </div>
            <p className="section-label mt-1">{k.label}</p>
          </div>

          <p
            className={`text-[11px] font-medium mt-2 ${
              k.positive ? 'text-emerald-600' : 'text-signal'
            }`}
          >
            {k.sub}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
