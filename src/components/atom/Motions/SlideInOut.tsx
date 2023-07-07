import { motion, AnimatePresence } from 'framer-motion'
import { FC } from 'react'

type Props = {
  x?: number
  duration?: number
  noAnimatePresence?: boolean
  children: React.ReactNode
}

const _SlideInOut: FC<Props> = ({ x = -300, duration, children }) => {
  return (
    <motion.div
      initial={{ x: x, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: duration }}
      exit={{ x: x, opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}
export const SlideInOut: FC<Props> = ({ duration = 0.15, noAnimatePresence = false, children }) => {
  return (
    <>
      {noAnimatePresence ? (
        <_SlideInOut duration={duration}>{children}</_SlideInOut>
      ) : (
        <AnimatePresence>
          <_SlideInOut duration={duration}>{children}</_SlideInOut>
        </AnimatePresence>
      )}
    </>
  )
}
