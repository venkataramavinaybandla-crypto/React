import { useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

const nodes = [
  { id:'checkin',  label:'Check-in',  x:55,  y:155, type:'hub' },
  { id:'security', label:'Security',  x:155, y:155, type:'hub' },
  { id:'hubA',     label:'T-A Hub',   x:255, y:65,  type:'hub' },
  { id:'hubB',     label:'T-B Hub',   x:255, y:155, type:'hub' },
  { id:'hubC',     label:'T-C Hub',   x:255, y:245, type:'hub' },
  { id:'A2',       label:'A2',        x:370, y:30,  type:'gate' },
  { id:'A3',       label:'A3',        x:370, y:65,  type:'gate' },
  { id:'A5',       label:'A5',        x:370, y:100, type:'gate', alert:true },
  { id:'B1',       label:'B1',        x:370, y:130, type:'gate' },
  { id:'B3',       label:'B3',        x:370, y:165, type:'gate', alert:true },
  { id:'B5',       label:'B5',        x:370, y:200, type:'gate' },
  { id:'C2',       label:'C2',        x:370, y:225, type:'gate' },
  { id:'C6',       label:'C6',        x:370, y:260, type:'gate' },
]

const edges = [
  ['checkin','security'],
  ['security','hubA'],['security','hubB'],['security','hubC'],
  ['hubA','hubB'],['hubB','hubC'],
  ['hubA','A2'],['hubA','A3'],['hubA','A5'],
  ['hubB','B1'],['hubB','B3'],['hubB','B5'],
  ['hubC','C2'],['hubC','C6'],
]

const nodeMap = Object.fromEntries(nodes.map(n=>[n.id,n]))

// Pre-computed Dijkstra paths (weight = edge count)
const paths = {
  'C6': ['checkin','security','hubC','C6'],
  'A3': ['checkin','security','hubA','A3'],
  'B1': ['checkin','security','hubB','B1'],
  'B3': ['checkin','security','hubB','B3'],
  'C2': ['checkin','security','hubC','C2'],
  'A2': ['checkin','security','hubA','A2'],
  'A5': ['checkin','security','hubA','A5'],
  'B5': ['checkin','security','hubB','B5'],
}

const pathTimes = { 'C6':'~5 min','A3':'~4 min','B1':'~4 min','B3':'~5 min','C2':'~5 min','A2':'~4 min','A5':'~4 min','B5':'~5 min' }

function isEdgeOnPath(a, b, path) {
  for (let i = 0; i < path.length - 1; i++) {
    if ((path[i]===a && path[i+1]===b)||(path[i]===b && path[i+1]===a)) return true
  }
  return false
}

export default function GroundNavPage() {
  const [dest, setDest] = useState('C6')
  const path = paths[dest] || []

  return (
    <div className="p-5 space-y-4 h-full flex flex-col">
      <div className="grid grid-cols-12 gap-4 flex-1">
        {/* Map */}
        <div className="col-span-9 card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label">Navigational Map</p>
              <p className="text-matte-black font-semibold text-sm mt-0.5">Dijkstra Shortest Path Algorithm</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-taupe-400">
              <div className="flex items-center gap-1.5">
                <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="#FF6B00" strokeWidth="2.5" strokeDasharray="5,3"/></svg>
                Optimal Path
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="#D4C9BE" strokeWidth="1.5"/></svg>
                Available Route
              </div>
            </div>
          </div>

          <div className="flex-1">
            <svg viewBox="0 0 440 310" className="w-full h-full" style={{overflow:'visible'}}>
              {/* Edges */}
              {edges.map(([a,b]) => {
                const na=nodeMap[a], nb=nodeMap[b]
                if(!na||!nb) return null
                const onPath = isEdgeOnPath(a,b,path)
                return (
                  <motion.line key={`${a}-${b}`}
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    initial={{opacity:0}} animate={{opacity:1}}
                    transition={{duration:0.5, delay:0.1}}
                    stroke={onPath?'#FF6B00':'#D4C9BE'}
                    strokeWidth={onPath?2.5:1.5}
                    strokeDasharray={onPath?'6,3':undefined}
                    strokeLinecap="round"
                  />
                )
              })}

              {/* Arrows on path */}
              {path.slice(0,-1).map((id,i) => {
                const na=nodeMap[id], nb=nodeMap[path[i+1]]
                if(!na||!nb) return null
                const mx=(na.x+nb.x)/2, my=(na.y+nb.y)/2
                const angle=Math.atan2(nb.y-na.y,nb.x-na.x)*180/Math.PI
                return (
                  <motion.g key={`arr-${id}`} transform={`translate(${mx},${my}) rotate(${angle})`}
                    initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5+i*0.1}}
                  >
                    <polygon points="-5,-3 5,0 -5,3" fill="#FF6B00" opacity="0.9"/>
                  </motion.g>
                )
              })}

              {/* Nodes */}
              {nodes.map((node,i) => {
                const onPath = path.includes(node.id)
                const isDest = node.id === dest
                return (
                  <motion.g key={node.id}
                    initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
                    transition={{delay:0.1+i*0.04, ease, duration:0.4}}
                    onClick={() => paths[node.id] && setDest(node.id)}
                    style={{cursor: paths[node.id]?'pointer':'default'}}
                  >
                    {isDest && (
                      <motion.circle cx={node.x} cy={node.y} r={16} fill="rgba(255,107,0,0.15)"
                        animate={{r:[13,19,13]}} transition={{repeat:Infinity,duration:2,ease:'easeInOut'}}
                      />
                    )}
                    <circle cx={node.x} cy={node.y}
                      r={node.type==='hub'?11:8}
                      fill={isDest?'#FF6B00': node.alert?'#FEE2E2': onPath?'#FFF4EC': node.type==='hub'?'#1A1A1A':'#FFFFFF'}
                      stroke={isDest?'#FF6B00': node.alert?'#EF4444': onPath?'#FF6B00': node.type==='hub'?'#1A1A1A':'#D4C9BE'}
                      strokeWidth={onPath||isDest?2:1.5}
                    />
                    {node.alert && !isDest && (
                      <text x={node.x} y={node.y+1} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="bold" fill="#EF4444">!</text>
                    )}
                    {isDest && (
                      <text x={node.x} y={node.y+1} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="bold" fill="white">★</text>
                    )}
                    <text
                      x={node.type==='gate' ? node.x+14 : node.x}
                      y={node.type==='hub'  ? node.y-17  : node.y}
                      textAnchor={node.type==='gate'?'start':'middle'}
                      dominantBaseline={node.type==='gate'?'middle':'auto'}
                      fontSize="9" fontWeight={onPath?'700':'500'}
                      fill={onPath?'#FF6B00':'#9A8B7C'} fontFamily="JetBrains Mono,monospace"
                    >{node.label}</text>
                  </motion.g>
                )
              })}
            </svg>
          </div>

          {/* Path strip */}
          <div className="mt-3 p-3 bg-taupe-50 rounded-xl flex items-center gap-2 flex-wrap">
            <span className="section-label">Optimal Path →</span>
            {path.map((id,i) => (
              <span key={id} className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-signal">{nodeMap[id]?.label}</span>
                {i<path.length-1 && <span className="text-taupe-300 text-[10px]">→</span>}
              </span>
            ))}
            <span className="ml-auto font-mono text-xs font-bold text-signal">{pathTimes[dest]}</span>
          </div>
        </div>

        {/* Route selector */}
        <div className="col-span-3 card p-4 flex flex-col">
          <p className="section-label mb-3">Select Destination</p>
          <p className="text-xs text-taupe-400 mb-3">Click a gate to compute optimal ground route from Check-in</p>
          <div className="flex-1 space-y-1.5 overflow-y-auto">
            {Object.keys(paths).map(gateId => (
              <motion.button key={gateId}
                whileHover={{scale:1.03, transition:{ease,duration:0.25}}}
                onClick={() => setDest(gateId)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                  dest===gateId ? 'bg-matte-black text-white' : 'bg-taupe-50 hover:bg-taupe-100 text-matte-black'
                }`}
              >
                <span className="font-mono font-bold text-sm">{gateId}</span>
                <span className={`text-[10px] font-semibold ${dest===gateId?'text-signal':'text-taupe-400'}`}>{pathTimes[gateId]}</span>
              </motion.button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-taupe-50 rounded-xl border border-taupe-100">
            <p className="section-label mb-1">Algorithm</p>
            <p className="text-xs text-taupe-600 font-semibold">Dijkstra's Shortest Path</p>
            <p className="text-[10px] text-taupe-400 mt-1">Greedy BFS · O((V+E) log V) · Optimized for ground ops</p>
          </div>
        </div>
      </div>
    </div>
  )
}
