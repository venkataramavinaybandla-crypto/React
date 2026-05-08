import { motion } from 'framer-motion'
import KPISummary        from '../components/KPISummary'
import WeatherWidget     from '../components/WeatherWidget'
import FlightSchedule    from '../components/FlightSchedule'
import GateMonitor       from '../components/GateMonitor'
import DelayHeatmap      from '../components/DelayHeatmap'
import NavigationalMap   from '../components/NavigationalMap'
import NotificationPanel from '../components/NotificationPanel'

const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const iv = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { ease: [0.16,1,0.3,1], duration: 0.5 } } }

export default function OverviewPage() {
  return (
    <motion.div variants={cv} initial="hidden" animate="visible" className="p-5 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <motion.div variants={iv} className="col-span-8"><KPISummary /></motion.div>
        <motion.div variants={iv} className="col-span-4"><WeatherWidget /></motion.div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <motion.div variants={iv} className="col-span-7 relative z-20"><FlightSchedule /></motion.div>
        <motion.div variants={iv} className="col-span-5 relative z-10"><GateMonitor /></motion.div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <motion.div variants={iv} className="col-span-5"><DelayHeatmap /></motion.div>
        <motion.div variants={iv} className="col-span-4"><NavigationalMap /></motion.div>
        <motion.div variants={iv} className="col-span-3 relative z-30"><NotificationPanel /></motion.div>
      </div>
    </motion.div>
  )
}
