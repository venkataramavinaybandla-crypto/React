import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ArrowUpDown, Plane, X, Save, RefreshCw } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const initialFlights = [
  { id:'VT-101',  origin:'DXB', dest:'LHR', gate:'A3', std:'06:15', sta:'14:30', status:'boarding',     delay:0,  ac:'B777', pax:342, cargo:'12.4t', captain:'Capt. Rahman'   },
  { id:'VT-204',  origin:'JFK', dest:'CDG', gate:'B1', std:'06:45', sta:'19:10', status:'on-time',      delay:0,  ac:'A380', pax:517, cargo:'8.1t',  captain:'Capt. Singh'     },
  { id:'VT-318',  origin:'SIN', dest:'NRT', gate:'C2', std:'07:10', sta:'14:55', status:'delayed',      delay:25, ac:'B787', pax:291, cargo:'5.2t',  captain:'Capt. Nakamura'  },
  { id:'VT-422',  origin:'LAX', dest:'ORD', gate:'A2', std:'07:30', sta:'13:45', status:'on-time',      delay:0,  ac:'A320', pax:168, cargo:'2.8t',  captain:'Capt. Williams'  },
  { id:'VT-509',  origin:'MIA', dest:'ATL', gate:'B3', std:'07:55', sta:'09:25', status:'conflict',     delay:0,  ac:'B737', pax:143, cargo:'1.9t',  captain:'Capt. Rodriguez' },
  { id:'VT-614',  origin:'SEA', dest:'DFW', gate:'C6', std:'08:20', sta:'13:50', status:'on-time',      delay:0,  ac:'A321', pax:186, cargo:'3.1t',  captain:'Capt. Chen'      },
  { id:'VT-721',  origin:'BOS', dest:'IAD', gate:'A5', std:'08:45', sta:'10:05', status:'delayed',      delay:40, ac:'E175', pax:76,  cargo:'0.8t',  captain:"Capt. O'Brien"   },
  { id:'VT-833',  origin:'PHL', dest:'MSP', gate:'B9', std:'09:00', sta:'11:15', status:'boarding',     delay:0,  ac:'B737', pax:148, cargo:'2.3t',  captain:'Capt. Patel'     },
  { id:'VT-940',  origin:'CDG', dest:'DXB', gate:'C4', std:'09:30', sta:'18:45', status:'maintenance',  delay:0,  ac:'A350', pax:0,   cargo:'0t',    captain:'—'               },
  { id:'VT-1012', origin:'FRA', dest:'SYD', gate:'A7', std:'10:00', sta:'06:30', status:'on-time',      delay:0,  ac:'B777', pax:388, cargo:'14.2t', captain:'Capt. Mueller'   },
]

const STATUS_TABS = ['All','Boarding','On-Time','Delayed','Conflict','Maintenance']
const statusMap   = { 'Boarding':'boarding','On-Time':'on-time','Delayed':'delayed','Conflict':'conflict','Maintenance':'maintenance' }
const statusLabel = { boarding:'Boarding','on-time':'On Time',delayed:'Delayed',conflict:'Conflict',maintenance:'Hold' }

const ALL_GATES = ['A1','A2','A3','A4','A5','A6','A7','A8','B1','B2','B3','B4','B5','B6','B7','B9','C1','C2','C3','C4','C5','C6']

const emptyForm = { id:'', origin:'', dest:'', gate:'', std:'', sta:'', ac:'', pax:'', cargo:'', captain:'', status:'on-time', delay:0 }

function StatCard({ label, value, sub, accent }) {
  return (
    <motion.div whileHover={{ scale:1.03, boxShadow:'0 20px 50px rgba(26,26,26,0.12)', transition:{ease,duration:0.4} }} className="card p-4">
      <p className="section-label">{label}</p>
      <p className={`text-3xl font-extrabold mt-1 ${accent ? 'text-signal' : 'text-matte-black dark:text-[#E8E2D9]'}`}>{value}</p>
      <p className="text-xs text-taupe-500 mt-0.5">{sub}</p>
    </motion.div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────
function FlightModal({ mode, flight, onClose, onSave }) {
  const [form, setForm] = useState(flight || { ...emptyForm })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const isEdit = mode === 'edit'

  const inputCls = "w-full px-3 py-2 text-xs rounded-xl border border-taupe-100 dark:border-white/10 bg-taupe-50 dark:bg-[#252525] text-matte-black dark:text-[#E8E2D9] placeholder-taupe-400 focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/20"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ ease, duration: 0.3 }}
          className="card p-6 w-[520px] max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-label">{isEdit ? 'Edit Flight Record' : 'Add New Flight'}</p>
              <p className="text-matte-black dark:text-[#E8E2D9] font-bold text-base mt-0.5">
                {isEdit ? form.id : 'New Flight Entry'}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-taupe-50 dark:hover:bg-white/5 text-taupe-400">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {!isEdit && (
              <div className="col-span-2">
                <label className="section-label block mb-1">Flight ID</label>
                <input value={form.id} onChange={set('id')} placeholder="VT-XXXX" className={inputCls} />
              </div>
            )}
            <div>
              <label className="section-label block mb-1">Origin</label>
              <input value={form.origin} onChange={set('origin')} placeholder="DXB" className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1">Destination</label>
              <input value={form.dest} onChange={set('dest')} placeholder="LHR" className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1">Gate</label>
              <select value={form.gate} onChange={set('gate')} className={inputCls}>
                <option value="">Select gate</option>
                {ALL_GATES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label block mb-1">Aircraft</label>
              <input value={form.ac} onChange={set('ac')} placeholder="B777" className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1">STD</label>
              <input value={form.std} onChange={set('std')} placeholder="06:15" className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1">STA</label>
              <input value={form.sta} onChange={set('sta')} placeholder="14:30" className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1">Passengers</label>
              <input type="number" value={form.pax} onChange={set('pax')} placeholder="342" className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1">Cargo</label>
              <input value={form.cargo} onChange={set('cargo')} placeholder="12.4t" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="section-label block mb-1">Captain</label>
              <input value={form.captain} onChange={set('captain')} placeholder="Capt. Name" className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1">Status</label>
              <select value={form.status} onChange={set('status')} className={inputCls}>
                <option value="on-time">On Time</option>
                <option value="boarding">Boarding</option>
                <option value="delayed">Delayed</option>
                <option value="conflict">Conflict</option>
                <option value="maintenance">Hold</option>
              </select>
            </div>
            <div>
              <label className="section-label block mb-1">Delay (min)</label>
              <input type="number" value={form.delay} onChange={set('delay')} placeholder="0" className={inputCls} />
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              type="button"
              onClick={() => onSave({ ...form, pax: Number(form.pax) || 0, delay: Number(form.delay) || 0 })}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-signal text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <Save size={13} /> {isEdit ? 'Save Changes' : 'Add Flight'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-taupe-100 dark:border-white/10 text-xs font-semibold text-taupe-600 dark:text-taupe-400 hover:bg-taupe-50 dark:hover:bg-white/5">
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Reassign Gate Modal ────────────────────────────────────────────────────
function ReassignModal({ flight, takenGates, onClose, onSave }) {
  const [gate, setGate] = useState(flight.gate)
  const available = ALL_GATES.filter(g => !takenGates.includes(g) || g === flight.gate)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ ease, duration: 0.3 }}
          className="card p-6 w-[340px]"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label">Reassign Gate</p>
              <p className="text-matte-black dark:text-[#E8E2D9] font-bold text-base mt-0.5">{flight.id}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-taupe-50 dark:hover:bg-white/5 text-taupe-400"><X size={16} /></button>
          </div>

          <p className="text-xs text-taupe-500 mb-3">Current gate: <span className="font-bold text-matte-black dark:text-[#E8E2D9]">{flight.gate}</span></p>

          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {available.map(g => (
              <button
                key={g}
                onClick={() => setGate(g)}
                className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                  gate === g
                    ? 'bg-signal text-white shadow-sm'
                    : 'bg-taupe-50 dark:bg-white/5 text-matte-black dark:text-[#E8E2D9] hover:bg-taupe-100'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSave(gate)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-signal text-white text-xs font-bold hover:opacity-90"
            >
              <RefreshCw size={12} /> Reassign to {gate}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-taupe-100 dark:border-white/10 text-xs font-semibold text-taupe-600 dark:text-taupe-400 hover:bg-taupe-50">
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function FlightOpsPage() {
  const [flights,  setFlights]  = useState(initialFlights)
  const [tab,      setTab]      = useState('All')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [modal,    setModal]    = useState(null)  // null | 'add' | 'edit' | 'reassign'

  const filtered = flights.filter(f => {
    const matchTab    = tab === 'All' || f.status === statusMap[tab]
    const matchSearch = search === '' ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.origin.toLowerCase().includes(search.toLowerCase()) ||
      f.dest.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const sel = flights.find(f => f.id === selected)
  const takenGates = flights.filter(f => f.id !== selected).map(f => f.gate)

  const handleAdd = (form) => {
    if (!form.id) form.id = 'VT-' + Math.floor(Math.random() * 9000 + 1000)
    setFlights(p => [...p, form])
    setModal(null)
  }

  const handleEdit = (form) => {
    setFlights(p => p.map(f => f.id === form.id ? { ...f, ...form } : f))
    setModal(null)
  }

  const handleReassign = (newGate) => {
    setFlights(p => p.map(f => f.id === selected ? { ...f, gate: newGate } : f))
    setModal(null)
  }

  return (
    <div className="p-5 space-y-4">
      {/* Modals */}
      {modal === 'add' && (
        <FlightModal mode="add" onClose={() => setModal(null)} onSave={handleAdd} />
      )}
      {modal === 'edit' && sel && (
        <FlightModal mode="edit" flight={sel} onClose={() => setModal(null)} onSave={handleEdit} />
      )}
      {modal === 'reassign' && sel && (
        <ReassignModal flight={sel} takenGates={takenGates} onClose={() => setModal(null)} onSave={handleReassign} />
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total Flights"  value={flights.length}                                                    sub="Today's schedule"      />
        <StatCard label="Boarding"       value={flights.filter(f=>f.status==='boarding').length}    sub="At gate now"           />
        <StatCard label="Delayed"        value={flights.filter(f=>f.status==='delayed').length}     sub="Needs attention" accent />
        <StatCard label="Conflicts"      value={flights.filter(f=>f.status==='conflict').length}    sub="Requires resolution" accent />
        <StatCard label="Total Pax"      value={flights.reduce((a,f)=>a+f.pax,0).toLocaleString()} sub="Across all flights"    />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main table */}
        <div className="col-span-8 card p-4 flex flex-col">
          {/* Controls — Filter button REMOVED, only search + Add Flight */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search flight, origin, destination…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-taupe-100 dark:border-white/10 bg-taupe-50 dark:bg-[#252525] text-matte-black dark:text-[#E8E2D9] placeholder-taupe-400 focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setModal('add')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-signal text-white text-xs font-semibold hover:bg-signal-light transition-colors"
            >
              <Plus size={12} /> Add Flight
            </button>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[90px_1fr_55px_50px_55px_55px_75px] gap-2 px-2 mb-1">
            {['Flight','Route','A/C','Gate','STD','STA','Status'].map(h => (
              <span key={h} className="section-label">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto space-y-1">
            <AnimatePresence mode="popLayout">
              {filtered.map((f, i) => (
                <motion.div key={f.id}
                  layout
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:10 }}
                  transition={{ delay:i*0.03, ease, duration:0.3 }}
                  whileHover={{ scale:1.01, boxShadow:'0 4px 20px rgba(26,26,26,0.08)', transition:{ease,duration:0.25} }}
                  onClick={() => setSelected(selected===f.id ? null : f.id)}
                  className={`grid grid-cols-[90px_1fr_55px_50px_55px_55px_75px] gap-2 items-center px-2 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    selected===f.id ? 'bg-matte-black' : 'hover:bg-taupe-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`font-mono text-xs font-bold ${selected===f.id?'text-signal':'text-matte-black dark:text-[#E8E2D9]'}`}>{f.id}</span>
                  <div className="flex items-center gap-1.5">
                    <Plane size={11} className="text-taupe-400" />
                    <span className={`text-xs font-medium ${selected===f.id?'text-white':'text-matte-black dark:text-[#E8E2D9]'}`}>{f.origin} → {f.dest}</span>
                  </div>
                  <span className={`font-mono text-[10px] ${selected===f.id?'text-taupe-300':'text-taupe-500'}`}>{f.ac}</span>
                  <span className={`font-mono text-xs font-bold ${selected===f.id?'text-signal':'text-matte-black dark:text-[#E8E2D9]'}`}>{f.gate}</span>
                  <span className={`font-mono text-[10px] ${selected===f.id?'text-taupe-200':'text-taupe-600'}`}>
                    {f.std}{f.delay>0&&<span className="text-signal ml-0.5">+{f.delay}</span>}
                  </span>
                  <span className={`font-mono text-[10px] ${selected===f.id?'text-taupe-200':'text-taupe-600'}`}>{f.sta}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-center transition-colors ${selected===f.id ? 'bg-signal/20 text-signal' : `status-${f.status}`}`}>{statusLabel[f.status]}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-taupe-400">
                <Plane size={24} className="mb-2 opacity-40" />
                <p className="text-sm">No flights match your filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="col-span-4 card p-4 flex flex-col">
          <p className="section-label mb-3">Flight Detail</p>
          {sel ? (
            <motion.div key={sel.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ ease, duration:0.35 }} className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-extrabold text-matte-black dark:text-[#E8E2D9] font-mono">{sel.id}</p>
                  <p className="text-xs text-taupe-500 mt-0.5">{sel.origin} → {sel.dest}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full status-${sel.status}`}>{statusLabel[sel.status]}</span>
              </div>

              {[
                ['Aircraft',    sel.ac],
                ['Gate',        sel.gate],
                ['Departure',   `${sel.std}${sel.delay>0?' (+'+sel.delay+'m)':''}`],
                ['Arrival',     sel.sta],
                ['Passengers',  sel.pax.toLocaleString()],
                ['Cargo',       sel.cargo],
                ['Captain',     sel.captain],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-taupe-50 dark:border-white/5 last:border-0">
                  <span className="text-xs text-taupe-500">{k}</span>
                  <span className="text-xs font-semibold text-matte-black dark:text-[#E8E2D9] text-right">{v}</span>
                </div>
              ))}

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setModal('edit')}
                  className="w-full py-2 rounded-xl bg-matte-black dark:bg-signal text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Edit Flight Record
                </button>
                <button
                  type="button"
                  onClick={() => setModal('reassign')}
                  className="w-full py-2 rounded-xl border border-signal text-signal text-xs font-semibold hover:bg-signal/5 transition-colors"
                >
                  Reassign Gate
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-taupe-300">
              <Plane size={36} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Select a flight</p>
              <p className="text-xs mt-1">Click any row to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
