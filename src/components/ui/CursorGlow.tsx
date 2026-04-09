'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CursorGlow() {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth out the movement
    const springConfig = { damping: 25, stiffness: 200 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 100)
            mouseY.set(e.clientY - 100)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    return (
        <motion.div
            style={{
                translateX: x,
                translateY: y,
            }}
            className="fixed top-0 left-0 w-[200px] h-[200px] bg-primary/20 rounded-full blur-[80px] pointer-events-none z-50 mix-blend-screen"
        />
    )
}
