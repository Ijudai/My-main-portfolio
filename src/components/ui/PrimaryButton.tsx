'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
}

export default function PrimaryButton({ children, className, ...props }: ButtonProps) {
    const motionProps = props as any
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative group px-8 py-4 bg-primary text-[#e8f0ff] font-bebas text-2xl tracking-wider rounded-none overflow-hidden transition-all duration-300",
                "before:absolute before:inset-0 before:bg-cobalt before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-500",
                "animate-pulse-glow hover:brightness-110",
                className
            )}
            {...motionProps}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 border border-primary/50 group-hover:border-white/50 transition-colors duration-300" />
        </motion.button>
    )
}
