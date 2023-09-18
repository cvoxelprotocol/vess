import { motion, AnimatePresence } from 'framer-motion'
import { FC } from 'react'

type Props = {
  duration?: number
  noAnimatePresence?: boolean
  children: React.ReactNode
}

const _FadeInOut: FC<Props> = ({ duration, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: duration }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}
export const FadeInOut: FC<Props> = ({ duration = 0.15, noAnimatePresence = false, children }) => {
  return (
    <>
      {noAnimatePresence ? (
        <_FadeInOut duration={duration}>{children}</_FadeInOut>
      ) : (
        <AnimatePresence>
          <_FadeInOut duration={duration}>{children}</_FadeInOut>
        </AnimatePresence>
      )}
    </>
  )
}
