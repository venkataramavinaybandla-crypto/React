import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, AlertTriangle, Info, CheckCircle, Check, X } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const initialAlerts = [
  { id:1, type:'critical', title:'Gate Conflict Detected',   body:'VT-509 double-assigned to B3 & A6. Manual reassignment required.',     time:'06:51', read:false, resolved:false },
  { id:2, type:'warning',  title:'Delay Cascade Risk',       body:'VT-721 (+40min) may impact B1 turnaround. Review slot allocation.',      time:'06:38', read:false, resolved:false },
  { id:3, type:'warning',  title:'Runway 14/32 WET',         body:'Surface condition updated. 10kt crosswind limit now active.',            time:'06:20', read:true,  resolved:false },
  { id:4, type:'info',     title:'Peak Load Approaching',    body:'Pax throughput forecast: 1,620/hr at 08:30.',                           time:'06:10', read:true,  resolved:false },
  { id:5, type:'success',  title:'VT-204 Cleared',           body:'JFK→CDG cleared for pushback from Gate B1.',                            time:'06:05', read:true,  resolved:true  },
  { id:6, type:'critical', title:'Cargo Hold Overweight',    body:'VT-1012 FRA→SYD: 14.2t exceeds limit 13.8t. Hold boarding.',           time:'05:45', read:false, resolved:false },
  { id:7, type:'warning',  title:'Staff Shortage: T-C',      body:'Terminal C security lane 3 unstaffed.',                                  time:'05:30', read:true,  resolved:false },
  { id:8, type:'success',  title:'Gate Allocation Complete', body:'Greedy algorithm: 9/9 flights assigned. No conflicts at T+0.',           time:'05:50', read:true,  resolved:true  },
]

const cfg = {
  critical:{ bg:'bg-red-50',     border:'border-l-red-500',    text:'text-red-700',     icon:AlertTriangle, ic:'text-red-500',    label:'Critical' },
  warning: { bg:'bg-orange-50',  border:'border-l-signal',     text:'text-orange-800',  icon:AlertTriangle, ic:'text-signal',     label:'Warning'  },
  info:    { bg:'bg-blue-50',    border:'border-l-blue-400',   text:'text-blue-800',    icon:Info,          ic:'text-blue-500',   label:'Info'     },
  success: { bg:'bg-emerald-50', border:'border-l-emerald-500',text:'text-emerald-800', icon:CheckCircle,   ic:'text-emerald-500',label:'Success'  },
}

const TABS = ['All','Critical','Warning','Info','Success','Unresolved']

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [tab, setTab]       = useState('All')
  const [sel, setSel]       = useState(null)

  const filtered = alerts.filter(a => {
    if (tab==='All')        return true
    if (tab==='Unresolved') return !a.resolved
    return a.type === tab.toLowerCase()
  })

  const resolve  = id => setAlerts(p=>p.map(a=>a.id===id?{...a,resolved:true,read:true}:a))
  const markRead = id => setAlerts(p=>p.map(a=>a.id===id?{...a,read:true}:a))

  const exportLog = () => {
    const data = JSON.stringify(alerts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aizen_alerts.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Total',    value:alerts.length,                              sub:'All levels'      },
          { label:'Critical', value:alerts.filter(a=>a.type==='critical'&&!a.resolved).length, sub:'Needs action', accent:true },
          { label:'Warnings', value:alerts.filter(a=>a.type==='warning'&&!a.resolved).length,  sub:'Monitor', accent:true },
          { label:'Unread',   value:alerts.filter(a=>!a.read).length,           sub:'Awaiting review', accent:alerts.filter(a=>!a.read).length>0 },
        ].map(s=>(
          <motion.div key={s.label} whileHover={{scale:1.03,boxShadow:'0 20px 50px rgba(26,26,26,0.12)',transition:{ease,duration:0.4}}} className="card p-4">
            <p className="section-label">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.accent?'text-signal':'text-matte-black'}`}>{s.value}</p>
            <p className="text-xs text-taupe-500 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 card p-4 flex flex-col">
          <div className="flex gap-1 mb-3 bg-taupe-50 p-1 rounded-xl">
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${tab===t?'bg-white text-matte-black shadow-sm':'text-taupe-500 hover:text-matte-black'}`}
              >{t}</button>
            ))}
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {filtered.map((alert,i)=>{
              const c=cfg[alert.type]; const Icon=c.icon
              return (
                <motion.div key={alert.id} layout
                  initial={{opacity:0,x:-16}} animate={{opacity:alert.resolved?0.5:1,x:0}}
                  transition={{delay:i*0.04,ease,duration:0.35}}
                  whileHover={{scale:1.01,boxShadow:'0 6px 20px rgba(26,26,26,0.08)',transition:{ease,duration:0.25}}}
                  onClick={()=>{setSel(sel===alert.id?null:alert.id);markRead(alert.id)}}
                  className={`rounded-xl border-l-[3px] p-3 cursor-pointer ${c.bg} ${c.border} ${sel===alert.id?'ring-2 ring-signal/30':''}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={13} className={`flex-shrink-0 mt-0.5 ${c.ic}`}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-bold truncate ${c.text}`}>{alert.title}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[9px] font-mono text-taupe-400">{alert.time}</span>
                          {!alert.read&&<span className="w-1.5 h-1.5 rounded-full bg-signal animate-live-blink"/>}
                          {alert.resolved&&<span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Resolved</span>}
                        </div>
                      </div>
                      <p className="text-[11px] text-taupe-500 mt-0.5">{alert.body}</p>
                    </div>
                  </div>
                  {sel===alert.id&&!alert.resolved&&(
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mt-2 pt-2 border-t border-black/5 flex gap-2">
                      <button onClick={e=>{e.stopPropagation();resolve(alert.id)}}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:opacity-90">
                        <Check size={10}/> Resolve
                      </button>
                      <button onClick={e=>{e.stopPropagation();setSel(null)}}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-taupe-200 text-taupe-600 text-[11px] font-semibold hover:bg-taupe-50">
                        <X size={10}/> Dismiss
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
            {filtered.length===0&&(
              <div className="flex flex-col items-center justify-center py-12 text-taupe-300">
                <Bell size={28} className="mb-2 opacity-30"/>
                <p className="text-sm">No alerts in this category</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-4 space-y-3">
          <div className="card p-4">
            <p className="section-label mb-3">Severity Breakdown</p>
            {Object.entries(cfg).map(([type,c])=>{
              const count=alerts.filter(a=>a.type===type).length; const Icon=c.icon
              return (
                <div key={type} className="flex items-center gap-3 py-2 border-b border-taupe-50 last:border-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.bg}`}>
                    <Icon size={12} className={c.ic}/>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-matte-black">{c.label}</p>
                    <div className="w-full h-1 bg-taupe-50 rounded-full mt-1 overflow-hidden">
                      <motion.div className={`h-full rounded-full ${type==='critical'?'bg-red-500':type==='warning'?'bg-signal':type==='info'?'bg-blue-500':'bg-emerald-500'}`}
                        initial={{width:0}} animate={{width:`${(count/alerts.length)*100}%`}} transition={{ease,duration:0.8}}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-matte-black">{count}</span>
                </div>
              )
            })}
          </div>
          <div className="card p-4">
            <p className="section-label mb-2">Quick Actions</p>
            <div className="space-y-2">
              <button type="button" onClick={()=>setAlerts(p=>p.map(a=>({...a,read:true})))}
                className="w-full py-2 rounded-xl bg-matte-black text-white text-xs font-semibold hover:opacity-90">Mark All Read</button>
              <button type="button" onClick={()=>setAlerts(p=>p.map(a=>a.type!=='critical'?{...a,resolved:true}:a))}
                className="w-full py-2 rounded-xl border border-taupe-200 text-taupe-600 text-xs font-semibold hover:bg-taupe-50">Resolve Non-Critical</button>
              <button type="button" onClick={exportLog} className="w-full py-2 rounded-xl border border-signal/30 text-signal text-xs font-semibold hover:bg-signal/5">Export Alert Log</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
