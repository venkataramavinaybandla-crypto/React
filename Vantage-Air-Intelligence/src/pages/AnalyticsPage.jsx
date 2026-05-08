import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

// Pax throughput per hour (06:00 – 20:00)
const paxData = [320,480,860,1240,1420,1180,980,1380,1520,1440,1260,1090,880,650,410]
const hours   = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20']

// Delay by route (avg minutes)
const delayRoutes = [
  { route:'DXB→LHR', avg:18, color:'#FF6B00' },
  { route:'SIN→NRT', avg:25, color:'#FF8C3A' },
  { route:'VT-721',  avg:40, color:'#E0360B' },
  { route:'BOS→IAD', avg:12, color:'#FFB380' },
  { route:'MIA→ATL', avg:5,  color:'#FFD4B3' },
  { route:'JFK→CDG', avg:2,  color:'#F5F0EB' },
]

// OTP trend (last 7 days)
const otpData = [88, 84, 91, 79, 85, 83, 81]
const otpDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function SVGAreaChart({ data, max, color = '#FF6B00', height = 100 }) {
  const w = 400, h = height, pad = 4
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad)
    const y = h - pad - ((v / max) * (h - 2 * pad))
    return [x, y]
  })
  const poly = pts.map(p => p.join(',')).join(' ')
  const area = `M${pts[0][0]},${h} ` + pts.map(p => `L${p[0]},${p[1]}`).join(' ') + ` L${pts[pts.length-1][0]},${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{height}}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#areaGrad)" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3,duration:0.6}}/>
      <motion.polyline points={poly} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.2,ease}}
      />
      {pts.map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="3" fill={color}
          initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.8+i*0.05,ease,duration:0.3}}
        />
      ))}
    </svg>
  )
}

function SVGBarChart({ data, max, height = 80 }) {
  const w = 400, h = height, pad = 4
  const bw = (w - 2*pad) / data.length - 4

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{height}}>
      {data.map((item, i) => {
        const bh = ((item.avg / max) * (h - 2*pad))
        const x  = pad + i*(bw+4)
        const y  = h - pad - bh
        return (
          <motion.rect key={i} x={x} y={y} width={bw} height={bh} rx="3" fill={item.color}
            initial={{scaleY:0,originY:'100%'}} animate={{scaleY:1}} transition={{delay:0.1+i*0.07,ease,duration:0.5}}
          />
        )
      })}
    </svg>
  )
}

const maxPax = Math.max(...paxData)

export default function AnalyticsPage() {
  const avgOtp = Math.round(otpData.reduce((a,b)=>a+b,0)/otpData.length)
  const avgDelay = Math.round(delayRoutes.reduce((a,r)=>a+r.avg,0)/delayRoutes.length)

  return (
    <div className="p-5 space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Avg OTP (7d)',      value:`${avgOtp}%`, trend:'+2.1%',  up:true  },
          { label:'Peak Pax/hr',       value:'1,520',      trend:'14:00',  up:true  },
          { label:'Avg Delay',         value:`${avgDelay}m`,trend:'+8m',   up:false },
          { label:'Flights Analysed',  value:'10',         trend:'Today',  up:true  },
        ].map(k => (
          <motion.div key={k.label} whileHover={{scale:1.03,boxShadow:'0 20px 50px rgba(26,26,26,0.12)',transition:{ease,duration:0.4}}} className="card p-4">
            <p className="section-label">{k.label}</p>
            <p className="text-3xl font-extrabold text-matte-black mt-1">{k.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${k.up?'text-emerald-600':'text-signal'}`}>
              {k.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {k.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Pax Throughput Area Chart */}
        <motion.div whileHover={{scale:1.01,boxShadow:'0 12px 40px rgba(26,26,26,0.09)',transition:{ease,duration:0.4}}} className="col-span-8 card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="section-label">Passenger Throughput</p>
              <p className="text-matte-black font-semibold text-sm mt-0.5">Hourly volume · Today</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-matte-black">1,520</p>
              <p className="text-xs text-taupe-500">Peak at 14:00</p>
            </div>
          </div>
          <SVGAreaChart data={paxData} max={maxPax} height={120}/>
          <div className="flex justify-between mt-1">
            {hours.map(h => <span key={h} className="text-[8px] text-taupe-400 font-mono">{h}</span>)}
          </div>
        </motion.div>

        {/* OTP Trend */}
        <motion.div whileHover={{scale:1.01,boxShadow:'0 12px 40px rgba(26,26,26,0.09)',transition:{ease,duration:0.4}}} className="col-span-4 card p-4">
          <p className="section-label mb-0.5">On-Time Performance</p>
          <p className="text-matte-black font-semibold text-sm mb-3">7-day trend</p>
          <SVGAreaChart data={otpData} max={100} color="#22863A" height={100}/>
          <div className="flex justify-between mt-1">
            {otpDays.map(d => <span key={d} className="text-[8px] text-taupe-400">{d}</span>)}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-matte-black">{avgOtp}%</span>
            <span className="text-xs text-emerald-600 font-semibold">7-day avg</span>
          </div>
        </motion.div>
      </div>

      {/* Delay + Rankings */}
      <div className="grid grid-cols-12 gap-4">
        {/* Delay by Route */}
        <motion.div whileHover={{scale:1.01,transition:{ease,duration:0.4}}} className="col-span-6 card p-4">
          <p className="section-label mb-0.5">Delay Distribution by Route</p>
          <p className="text-matte-black font-semibold text-sm mb-3">Average minutes · Merge Sort ranked</p>
          <SVGBarChart data={delayRoutes} max={50} height={90}/>
          <div className="flex justify-between mt-1">
            {delayRoutes.map(r => <span key={r.route} className="text-[8px] text-taupe-400 text-center" style={{width:`${100/delayRoutes.length}%`}}>{r.route.split('→')[0]}</span>)}
          </div>
          <div className="mt-3 space-y-1.5">
            {[...delayRoutes].sort((a,b)=>b.avg-a.avg).map(r => (
              <div key={r.route} className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-medium text-taupe-600 w-20">{r.route}</span>
                <div className="flex-1 h-1.5 bg-taupe-50 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{background:r.color}}
                    initial={{width:0}} animate={{width:`${(r.avg/50)*100}%`}} transition={{ease,duration:0.8,delay:0.2}}
                  />
                </div>
                <span className={`text-[10px] font-bold w-8 text-right ${r.avg>20?'text-signal':'text-taupe-500'}`}>{r.avg}m</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Route Traffic Ranking */}
        <motion.div whileHover={{scale:1.01,transition:{ease,duration:0.4}}} className="col-span-6 card p-4">
          <p className="section-label mb-0.5">Route Traffic Ranking</p>
          <p className="text-matte-black font-semibold text-sm mb-3">Pax volume · Heap Sort ranked</p>
          {[
            { route:'JFK→CDG', pax:517, flight:'VT-204', ac:'A380' },
            { route:'DXB→LHR', pax:342, flight:'VT-101', ac:'B777' },
            { route:'FRA→SYD', pax:388, flight:'VT-1012',ac:'B777' },
            { route:'SIN→NRT', pax:291, flight:'VT-318', ac:'B787' },
            { route:'SEA→DFW', pax:186, flight:'VT-614', ac:'A321' },
            { route:'PHL→MSP', pax:148, flight:'VT-833', ac:'B737' },
          ].sort((a,b)=>b.pax-a.pax).map((r,i) => (
            <motion.div key={r.route}
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:i*0.06,ease,duration:0.35}}
              className="flex items-center gap-3 py-2 border-b border-taupe-50 last:border-0"
            >
              <span className={`text-sm font-extrabold w-5 text-center ${i===0?'text-signal':i===1?'text-taupe-600':'text-taupe-300'}`}>
                {i+1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-matte-black">{r.route}</span>
                  <span className="text-xs font-bold text-matte-black">{r.pax.toLocaleString()} pax</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-taupe-400 font-mono">{r.flight}</span>
                  <span className="text-[10px] text-taupe-400">{r.ac}</span>
                  <div className="flex-1 h-1 bg-taupe-50 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-signal rounded-full" style={{opacity: 0.3 + (r.pax/517)*0.7}}
                      initial={{width:0}} animate={{width:`${(r.pax/517)*100}%`}} transition={{ease,duration:0.8,delay:0.1+i*0.06}}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
