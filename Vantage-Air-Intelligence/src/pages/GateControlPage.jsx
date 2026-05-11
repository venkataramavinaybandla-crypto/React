import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, RefreshCw, Plus, X, Wrench } from 'lucide-react'
import { fetchLiveFlights } from '../services/aviationApi'

const ease = [0.16, 1, 0.3, 1]

const fallbackTerminals = {
  'Terminal A': [
    { id:'A1', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'A2', status:'boarding',    flight:'VT-422', ac:'A320', pax:168 },
    { id:'A3', status:'boarding',    flight:'VT-101', ac:'B777', pax:342 },
    { id:'A4', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'A5', status:'delayed',     flight:'VT-721', ac:'E175', pax:76  },
    { id:'A6', status:'conflict',    flight:'VT-509', ac:'B737', pax:143 },
    { id:'A7', status:'maintenance', flight:null,     ac:null,   pax:0   },
    { id:'A8', status:'open',        flight:null,     ac:null,   pax:0   },
  ],
  'Terminal B': [
    { id:'B1', status:'boarding',    flight:'VT-204', ac:'A380', pax:517 },
    { id:'B2', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'B3', status:'conflict',    flight:'VT-509', ac:'B737', pax:143 },
    { id:'B4', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'B5', status:'boarding',    flight:'VT-833', ac:'B737', pax:148 },
    { id:'B6', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'B7', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'B9', status:'on-time',     flight:'VT-614', ac:'A321', pax:186 },
  ],
  'Terminal C': [
    { id:'C1', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'C2', status:'boarding',    flight:'VT-318', ac:'B787', pax:291 },
    { id:'C3', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'C4', status:'maintenance', flight:null,     ac:null,   pax:0   },
    { id:'C5', status:'open',        flight:null,     ac:null,   pax:0   },
    { id:'C6', status:'boarding',    flight:'VT-614', ac:'A321', pax:186 },
  ],
}

const statusCfg = {
  open:        { bg:'bg-taupe-50 dark:bg-white/5',     border:'border-taupe-100 dark:border-white/10',  text:'text-taupe-400',   dot:'bg-taupe-300',   label:'Open'        },
  boarding:    { bg:'bg-blue-50 dark:bg-blue-950/40',  border:'border-blue-100 dark:border-blue-900',   text:'text-blue-600',    dot:'bg-blue-500',    label:'Boarding'    },
  'on-time':   { bg:'bg-emerald-50 dark:bg-emerald-950/40', border:'border-emerald-100 dark:border-emerald-900', text:'text-emerald-600', dot:'bg-emerald-500', label:'On Time' },
  delayed:     { bg:'bg-orange-50 dark:bg-orange-950/40',   border:'border-orange-200 dark:border-orange-900',  text:'text-signal',      dot:'bg-signal',      label:'Delayed'     },
  conflict:    { bg:'bg-red-50 dark:bg-red-950/40',    border:'border-red-200 dark:border-red-900',     text:'text-red-600',     dot:'bg-red-500',     label:'Conflict'    },
  maintenance: { bg:'bg-taupe-100 dark:bg-white/10',   border:'border-taupe-200 dark:border-white/10',  text:'text-taupe-500',   dot:'bg-taupe-400',   label:'Maintenance' },
}

// ── Reassign Gate Modal ────────────────────────────────────────────────────
function ReassignGateModal({ gate, openGates, onClose, onSave }) {
  const [selected, setSelected] = useState('')
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
          className="card p-6 w-[360px]"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label">Reassign Flight</p>
              <p className="text-matte-black dark:text-[#E8E2D9] font-bold text-base mt-0.5">{gate.flight} → New Gate</p>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-taupe-50 dark:hover:bg-white/5 text-taupe-400"><X size={16} /></button>
          </div>

          <p className="text-xs text-taupe-500 mb-3">Select an open gate to reassign <span className="font-bold text-matte-black dark:text-[#E8E2D9]">{gate.flight}</span>:</p>

          {openGates.length === 0 ? (
            <p className="text-xs text-signal text-center py-4">No open gates available in this terminal.</p>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {openGates.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelected(g.id)}
                  className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                    selected === g.id
                      ? 'bg-signal text-white shadow-sm'
                      : 'bg-taupe-50 dark:bg-white/5 text-matte-black dark:text-[#E8E2D9] hover:bg-taupe-100 dark:hover:bg-white/10'
                  }`}
                >
                  {g.id}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => selected && onSave(selected)}
              disabled={!selected}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-signal text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw size={12} /> {selected ? `Reassign to ${selected}` : 'Select a gate'}
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

// ── Confirmation Toast ─────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-lg"
    >
      <CheckCircle size={13} /> {message}
    </motion.div>
  )
}

export default function GateControlPage() {
  const [terminals,      setTerminals]     = useState(fallbackTerminals)
  const [activeTerminal, setActiveTerminal] = useState('Terminal A')
  const [selectedGate,   setSelectedGate]  = useState(null)
  const [modal,          setModal]         = useState(null) // null | 'reassign'
  const [toast,          setToast]         = useState(null)

  useEffect(() => {
    let mounted = true;
    const loadGates = async () => {
      const data = await fetchLiveFlights(35);
      if (!mounted) return;
      if (data && data.length > 0) {
        const newTerms = JSON.parse(JSON.stringify(fallbackTerminals));
        for (const term in newTerms) {
          newTerms[term].forEach(g => {
            g.status = 'open';
            g.flight = null;
            g.ac = null;
            g.pax = 0;
          });
        }
        
        let gateIndex = 0;
        const allGatesArr = Object.values(newTerms).flat();
        
        data.forEach((apiFlight, idx) => {
          if (gateIndex >= allGatesArr.length) return;
          const gate = allGatesArr[gateIndex];
          
          let statusStr = 'on-time';
          const delay = apiFlight.departure?.delay || 0;
          if (delay > 0) statusStr = 'delayed';
          else if (['cancelled', 'incident', 'diverted'].includes(apiFlight.flight_status)) statusStr = 'conflict';
          else if (idx % 7 === 0) statusStr = 'boarding';
          else if (idx % 13 === 0) statusStr = 'maintenance';
          
          gate.status = statusStr;
          if (statusStr !== 'maintenance' && statusStr !== 'open') {
             gate.flight = apiFlight.flight?.iata || apiFlight.flight?.number || `VT-${Math.floor(Math.random() * 900 + 100)}`;
             gate.ac = apiFlight.aircraft?.iata || 'B777';
             gate.pax = Math.floor(Math.random() * 300 + 50);
          }
          gateIndex++;
        });
        
        // Ensure at least one conflict to demonstrate UI feature
        if (allGatesArr[1].flight && allGatesArr[2].flight) {
           allGatesArr[2].flight = allGatesArr[1].flight;
           allGatesArr[1].status = 'conflict';
           allGatesArr[2].status = 'conflict';
        }
        
        setTerminals(newTerms);
      }
    };
    loadGates();
    return () => { mounted = false; };
  }, []);

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const termNames = Object.keys(terminals)
  const gates     = terminals[activeTerminal]
  const allGates  = Object.values(terminals).flat()
  const selGate   = allGates.find(g => g.id === selectedGate)
  const conflicts = allGates.filter(g => g.status === 'conflict')
  const occupied  = allGates.filter(g => g.flight !== null)

  // Update a gate across terminals
  const updateGate = (gateId, updates) => {
    setTerminals(prev => {
      const next = {}
      for (const [term, gates] of Object.entries(prev)) {
        next[term] = gates.map(g => g.id === gateId ? { ...g, ...updates } : g)
      }
      return next
    })
  }

  // Resolve conflict: move VT-509 from second conflict gate to an open gate
  const handleResolve = () => {
    const conflictGates = allGates.filter(g => g.status === 'conflict')
    if (conflictGates.length < 2) return

    // Keep flight in first conflict gate, clear second
    const toKeep  = conflictGates[0]
    const toClear = conflictGates[1]

    // Find first open gate not already occupied
    const openGate = allGates.find(g => g.status === 'open')

    // Move flight from second conflict gate → open gate
    if (openGate) {
      updateGate(openGate.id, {
        status: 'on-time',
        flight: toClear.flight,
        ac:     toClear.ac,
        pax:    toClear.pax,
      })
    }
    // Clear second conflict gate
    updateGate(toClear.id, { status: 'open', flight: null, ac: null, pax: 0 })
    // Resolve first gate
    updateGate(toKeep.id,  { status: 'on-time' })

    if (selectedGate === toClear.id || selectedGate === toKeep.id) setSelectedGate(null)
    showToast(`Conflict resolved — VT-509 reassigned to ${openGate?.id || 'new gate'}`)
  }

  // Reassign selected gate's flight to a chosen open gate
  const handleReassign = (newGateId) => {
    if (!selGate?.flight) return
    const newGate = allGates.find(g => g.id === newGateId)
    if (!newGate) return

    updateGate(newGateId, {
      status: selGate.status === 'conflict' ? 'on-time' : selGate.status,
      flight: selGate.flight,
      ac:     selGate.ac,
      pax:    selGate.pax,
    })
    updateGate(selGate.id, { status: 'open', flight: null, ac: null, pax: 0 })
    setSelectedGate(null)
    setModal(null)
    showToast(`${selGate.flight} reassigned from ${selGate.id} to ${newGateId}`)
  }

  // Mark selected gate as maintenance
  const handleMarkMaintenance = () => {
    if (!selGate) return
    updateGate(selGate.id, { status: 'maintenance', flight: null, ac: null, pax: 0 })
    setSelectedGate(null)
    showToast(`Gate ${selGate.id} marked for maintenance`)
  }

  // Open gates in current terminal for reassign picker
  const openGatesInCurrentTerminal = (terminals[activeTerminal] || []).filter(g => g.status === 'open')

  return (
    <div className="p-5 space-y-4">
      {/* Toast */}
      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>

      {/* Reassign modal */}
      {modal === 'reassign' && selGate && (
        <ReassignGateModal
          gate={selGate}
          openGates={openGatesInCurrentTerminal}
          onClose={() => setModal(null)}
          onSave={handleReassign}
        />
      )}

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Total Gates',  value: allGates.length,                                sub:'Across 3 terminals' },
          { label:'Occupied',     value: occupied.length,                                sub:'With active flights' },
          { label:'Available',    value: allGates.filter(g=>g.status==='open').length,   sub:'Ready for assignment' },
          { label:'Conflicts',    value: conflicts.length,                               sub:'Require resolution', accent:true },
        ].map(s => (
          <motion.div key={s.label} whileHover={{ scale:1.03, boxShadow:'0 20px 50px rgba(26,26,26,0.12)', transition:{ease,duration:0.4} }} className="card p-4">
            <p className="section-label">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.accent ? 'text-signal' : 'text-matte-black dark:text-[#E8E2D9]'}`}>{s.value}</p>
            <p className="text-xs text-taupe-500 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Conflict banner */}
      <AnimatePresence>
        {conflicts.length > 0 && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{ease,duration:0.35}}
            className="card p-3 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/40 flex items-center gap-3"
          >
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-red-400">Gate Conflict Detected</p>
              <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">
                Flight VT-509 is double-assigned to gates {conflicts.map(g=>g.id).join(' & ')}. Manual reassignment required.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResolve}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
            >
              <RefreshCw size={11} /> Resolve
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-4">
        {/* Gate Grid */}
        <div className="col-span-8 card p-4 flex flex-col">
          {/* Terminal tabs */}
          <div className="flex gap-1 mb-4 bg-taupe-50 dark:bg-white/5 p-1 rounded-xl">
            {termNames.map(t => (
              <button key={t} type="button" onClick={() => setActiveTerminal(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTerminal===t ? 'bg-white dark:bg-[#2a2a2a] text-matte-black dark:text-[#E8E2D9] shadow-sm' : 'text-taupe-500 hover:text-matte-black dark:hover:text-[#E8E2D9]'
                }`}
              >{t}</button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {Object.entries(statusCfg).map(([s,c]) => (
              <div key={s} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                <span className="text-[9px] text-taupe-400">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTerminal} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
              className="grid grid-cols-4 gap-2"
            >
              {gates.map((gate, i) => {
                const cfg = statusCfg[gate.status]
                const isConflict = gate.status === 'conflict'
                const isSelected = selectedGate === gate.id
                return (
                  <motion.div key={gate.id}
                    initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}}
                    transition={{delay:i*0.04, ease, duration:0.35}}
                    whileHover={{scale:1.05, boxShadow:'0 8px 24px rgba(26,26,26,0.1)', transition:{ease,duration:0.25}}}
                    onClick={() => setSelectedGate(isSelected ? null : gate.id)}
                    className={`relative p-3 rounded-xl border cursor-pointer transition-all ${cfg.bg} ${cfg.border} ${
                      isSelected ? 'ring-2 ring-signal' : ''
                    } ${isConflict ? 'animate-signal-pulse' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-extrabold text-matte-black dark:text-[#E8E2D9]">{gate.id}</span>
                      <span className={`w-2 h-2 rounded-full ${cfg.dot} ${isConflict ? 'animate-live-blink' : ''}`} />
                    </div>
                    {gate.flight ? (
                      <>
                        <p className={`text-xs font-bold ${cfg.text}`}>{gate.flight}</p>
                        <p className="text-[10px] font-mono text-taupe-400 mt-0.5">{gate.ac}</p>
                        <p className="text-[10px] text-taupe-400 mt-1">{gate.pax} pax</p>
                      </>
                    ) : (
                      <p className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</p>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gate Detail */}
        <div className="col-span-4 card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Gate Detail</p>
            <button type="button" className="flex items-center gap-1 text-xs font-semibold text-signal hover:underline">
              <Plus size={12} /> Assign
            </button>
          </div>

          {selGate ? (
            <motion.div key={selGate.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{ease,duration:0.35}} className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-extrabold font-mono text-matte-black dark:text-[#E8E2D9]">{selGate.id}</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full status-${selGate.status}`}>
                  {statusCfg[selGate.status].label}
                </span>
              </div>

              {selGate.flight ? (
                <>
                  {[
                    ['Flight',     selGate.flight],
                    ['Aircraft',   selGate.ac],
                    ['Passengers', selGate.pax.toLocaleString()],
                    ['Terminal',   activeTerminal],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-taupe-50 dark:border-white/5">
                      <span className="text-xs text-taupe-400">{k}</span>
                      <span className="text-xs font-semibold text-matte-black dark:text-[#E8E2D9]">{v}</span>
                    </div>
                  ))}

                  {selGate.status === 'conflict' && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-100 dark:border-red-900">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertTriangle size={11} /> Conflict Alert
                      </p>
                      <p className="text-[11px] text-red-500 mt-1">This gate has a scheduling conflict. Reassign {selGate.flight} immediately.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-taupe-50 dark:bg-white/5 rounded-xl">
                  <p className="text-xs font-semibold text-taupe-600 dark:text-taupe-400 flex items-center gap-1.5">
                    <CheckCircle size={11} className="text-emerald-500" /> Available
                  </p>
                  <p className="text-[11px] text-taupe-400 mt-1">Gate is ready for flight assignment</p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => selGate.flight ? setModal('reassign') : null}
                  disabled={!selGate.flight}
                  className="w-full py-2 rounded-xl bg-matte-black dark:bg-signal text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  Reassign Gate
                </button>
                <button
                  type="button"
                  onClick={handleMarkMaintenance}
                  disabled={selGate.status === 'maintenance'}
                  className="w-full py-2 rounded-xl border border-taupe-200 dark:border-white/10 text-taupe-600 dark:text-taupe-400 text-xs font-semibold hover:bg-taupe-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Wrench size={11} /> Mark Maintenance
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-taupe-300">
              <DoorOpenIcon />
              <p className="text-sm font-medium mt-3">Select a gate</p>
              <p className="text-xs mt-1">Click any gate to manage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DoorOpenIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
      <path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>
    </svg>
  )
}
