import type { FC } from 'react'
import { useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'

export const CursorFollower: FC = () => {

  
  const springConfig = { damping: 20, stiffness: 100 }
  const mouseX = useSpring(0, springConfig)
  const mouseY = useSpring(0, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: -20,
        left: -20,
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
        pointerEvents: 'none',
        zIndex: 100,
        x: mouseX,
        y: mouseY,
        mixBlendMode: 'screen'
      }}
    />
  )
}
