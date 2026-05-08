import { useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

// Dijkstra-computed shortest path from Check-in to Gate C6
// Nodes: positions as % of SVG viewBox (500x320)
const nodes = [
  { id: 'checkin',   label: 'Check-in',  x: 60,  y: 160, type: 'hub'  },
  { id: 'security',  label: 'Security',  x: 155, y: 160, type: 'hub'  },
  { id: 'hubA',      label: 'T-A Hub',   x: 250, y: 70,  type: 'hub'  },
  { id: 'hubB',      label: 'T-B Hub',   x: 250, y: 160, type: 'hub'  },
  { id: 'hubC',      label: 'T-C Hub',   x: 250, y: 250, type: 'hub'  },
  { id: 'gateA3',    label: 'A3',        x: 370, y: 50,  type: 'gate' },
  { id: 'gateA6',    label: 'A6',        x: 370, y: 90,  type: 'gate', alert: true },
  { id: 'gateB1',    label: 'B1',        x: 370, y: 140, type: 'gate' },
  { id: 'gateB3',    label: 'B3',        x: 370, y: 180, type: 'gate', alert: true },
  { id: 'gateC2',    label: 'C2',        x: 370, y: 230, type: 'gate' },
  { id: 'gateC6',    label: 'C6',        x: 370, y: 270, type: 'gate', destination: true },
]

const edges = [
  ['checkin',  'security'],
  ['security', 'hubA'],
  ['security', 'hubB'],
  ['security', 'hubC'],
  ['hubA',     'gateA3'],
  ['hubA',     'gateA6'],
  ['hubB',     'gateB1'],
  ['hubB',     'gateB3'],
  ['hubC',     'gateC2'],
  ['hubC',     'gateC6'],
  ['hubA',     'hubB'],
  ['hubB',     'hubC'],
]

// Dijkstra shortest path (pre-computed): checkin → security → hubC → gateC6
const shortestPath = ['checkin', 'security', 'hubC', 'gateC6']
const pathEdges = shortestPath.slice(0, -1).map((n, i) => `${n}-${shortestPath[i + 1]}`)

function isOnPath(a, b) {
  return pathEdges.includes(`${a}-${b}`) || pathEdges.includes(`${b}-${a}`)
}

const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

export default function NavigationalMap() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="card p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-label">Ground Navigation</p>
          <p className="text-matte-black font-semibold text-sm mt-0.5">Dijkstra · Optimal Path</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[9px] text-taupe-400">
            <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#FF6B00" strokeWidth="2" strokeDasharray="4,2"/></svg>
            Optimal
          </div>
          <div className="flex items-center gap-1 text-[9px] text-taupe-400">
            <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#D4C9BE" strokeWidth="2"/></svg>
            Route
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <svg
          viewBox="0 0 440 310"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* Edges */}
          {edges.map(([a, b]) => {
            const na = nodeMap[a]; const nb = nodeMap[b]
            const onPath = isOnPath(a, b)
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
                stroke={onPath ? '#FF6B00' : '#D4C9BE'}
                strokeWidth={onPath ? 2.5 : 1.5}
                strokeDasharray={onPath ? '6,3' : undefined}
                strokeLinecap="round"
              />
            )
          })}

          {/* Path direction arrows */}
          {shortestPath.slice(0, -1).map((id, i) => {
            const na = nodeMap[id]; const nb = nodeMap[shortestPath[i + 1]]
            const mx = (na.x + nb.x) / 2; const my = (na.y + nb.y) / 2
            const angle = Math.atan2(nb.y - na.y, nb.x - na.x) * 180 / Math.PI
            return (
              <motion.g
                key={`arr-${id}`}
                transform={`translate(${mx},${my}) rotate(${angle})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <polygon points="-5,-3 5,0 -5,3" fill="#FF6B00" opacity="0.9" />
              </motion.g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const onPath = shortestPath.includes(node.id)
            const isHovered = hovered === node.id
            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.04, ease, duration: 0.4 }}
                onHoverStart={() => setHovered(node.id)}
                onHoverEnd={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                {/* Glow for destination */}
                {node.destination && (
                  <motion.circle
                    cx={node.x} cy={node.y} r={14}
                    fill="rgba(255,107,0,0.15)"
                    animate={{ r: [12, 18, 12] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                )}

                <circle
                  cx={node.x} cy={node.y}
                  r={node.type === 'hub' ? 10 : 7}
                  fill={
                    node.destination ? '#FF6B00' :
                    node.alert       ? '#FEE2E2' :
                    onPath           ? '#FFF4EC' :
                    node.type === 'hub' ? '#1A1A1A' : '#FFFFFF'
                  }
                  stroke={
                    node.destination ? '#FF6B00' :
                    node.alert       ? '#EF4444' :
                    onPath           ? '#FF6B00' :
                    node.type === 'hub' ? '#1A1A1A' : '#D4C9BE'
                  }
                  strokeWidth={onPath ? 2 : 1.5}
                />

                {node.alert && (
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize="8" fontWeight="bold" fill="#EF4444">!</text>
                )}

                <text
                  x={node.x + (node.type === 'gate' ? 12 : 0)}
                  y={node.type === 'hub' ? node.y - 14 : node.y}
                  textAnchor={node.type === 'gate' ? 'start' : 'middle'}
                  dominantBaseline={node.type === 'gate' ? 'middle' : 'auto'}
                  fontSize="9"
                  fontWeight={onPath ? '700' : '500'}
                  fill={onPath ? '#FF6B00' : '#8A7A6E'}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.label}
                </text>
              </motion.g>
            )
          })}
        </svg>

        {/* Path Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-taupe-50 rounded-xl px-3 py-1.5 flex items-center gap-2">
          <span className="section-label">Path:</span>
          {shortestPath.map((id, i) => (
            <span key={id} className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-signal">
                {nodeMap[id].label}
              </span>
              {i < shortestPath.length - 1 && <span className="text-taupe-300 text-[10px]">→</span>}
            </span>
          ))}
          <span className="ml-auto text-[10px] font-semibold text-taupe-500">~4 min</span>
        </div>
      </div>
    </div>
  )
}
