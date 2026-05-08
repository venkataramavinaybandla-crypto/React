import { motion } from 'framer-motion'
import { Wind, Eye, Cloud, Thermometer, Navigation } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const weather = {
  station: 'VABB — Chhatrapati Shivaji Intl',
  condition: 'Partly Cloudy',
  temp: 34,
  feels: 38,
  wind: { speed: 14, dir: 220, label: 'SSW' },
  visibility: 6.2,
  ceiling: 4500,
  humidity: 62,
  qnh: 1008,
  runways: [
    { id: '09/27', condition: 'DRY', ok: true },
    { id: '14/32', condition: 'WET', ok: false },
  ],
}

function WindRose({ dir }) {
  return (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-2 border-taupe-100" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: dir }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="flex flex-col items-center"
        >
          <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[14px] border-l-transparent border-r-transparent border-b-signal" />
          <div className="w-[2px] h-4 bg-taupe-300" />
          <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent border-t-taupe-300" />
        </motion.div>
      </div>
      {['N','E','S','W'].map((d, i) => (
        <span key={d} className={`absolute text-[8px] font-bold text-taupe-400 ${
          i === 0 ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-0.5' :
          i === 1 ? 'right-0 top-1/2 -translate-y-1/2 translate-x-0.5' :
          i === 2 ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-0.5' :
                   'left-0 top-1/2 -translate-y-1/2 -translate-x-0.5'
        }`}>{d}</span>
      ))}
    </div>
  )
}

export default function WeatherWidget() {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 20px 60px rgba(26,26,26,0.13)', transition: { ease, duration: 0.4 } }}
      className="card p-4 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-label">Weather · METAR</p>
          <p className="text-[11px] text-taupe-400 mt-0.5">{weather.station}</p>
        </div>
        <Cloud size={16} className="text-taupe-400" />
      </div>

      {/* Temp + Wind */}
      <div className="flex items-center gap-4 mb-3">
        <div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-extrabold text-matte-black leading-none">{weather.temp}</span>
            <span className="text-lg font-semibold text-taupe-400 mb-1">°C</span>
          </div>
          <p className="text-xs text-taupe-500">{weather.condition}</p>
          <p className="text-[10px] text-taupe-400">Feels {weather.feels}°C · {weather.humidity}% RH</p>
        </div>
        <div className="flex flex-col items-center ml-auto">
          <WindRose dir={weather.wind.dir} />
          <p className="text-[10px] text-taupe-500 mt-1 font-medium">
            {weather.wind.speed} kt {weather.wind.label}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { icon: Eye,         label: 'Vis',    value: `${weather.visibility} km` },
          { icon: Cloud,       label: 'Ceiling', value: `${weather.ceiling} ft`  },
          { icon: Navigation,  label: 'QNH',     value: `${weather.qnh} hPa`     },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-taupe-50 rounded-xl p-2 text-center">
            <Icon size={12} className="text-taupe-400 mx-auto mb-0.5" />
            <p className="text-[10px] font-bold text-matte-black">{value}</p>
            <p className="text-[9px] text-taupe-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Runway status */}
      <div className="mt-auto">
        <p className="section-label mb-1.5">Runway Conditions</p>
        {weather.runways.map(r => (
          <div key={r.id} className="flex items-center justify-between py-1 border-b border-taupe-50 last:border-0">
            <span className="font-mono text-xs font-medium text-matte-black">{r.id}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              r.ok ? 'bg-emerald-50 text-emerald-600' : 'bg-signal/10 text-signal'
            }`}>{r.condition}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
