'use client'

import React from 'react'
import { motion } from 'framer-motion'
import PrimaryButton from '../ui/PrimaryButton'
import { supabase } from '@/lib/supabase'

const { data: { publicUrl } } = supabase.storage
    .from('My portfolio')
    .getPublicUrl('ALPHA image.jpg')

export default function HeroSection() {
    const text = "I don't market brands. I build movements."

    return (
        <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-20 overflow-hidden">

            {/* Ambient orb — sits behind the image */}
            <div
                className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, rgba(0, 63, 255, 0.1) 50%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Two-column layout */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

                {/* Left — Text */}
                <div className="flex-1 lg:max-w-[55%]">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-4"
                    >
                        <span className="text-primary font-bebas text-xl tracking-[0.2em] uppercase">
                            Waida Alpha Wayne
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl lg:text-8xl xl:text-9xl font-bebas leading-[0.9] mb-8">
                        {text.split("").map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03, duration: 0.1 }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="text-xl md:text-2xl text-foreground/70 max-w-xl mb-12 font-sans"
                    >
                        Performance-led creative strategy for Ecommerce & SME brands.
                        Bold ideas. Measurable outcomes. No guesswork.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.8 }}
                    >
                        <PrimaryButton>
                            Explore My Work
                        </PrimaryButton>
                    </motion.div>
                </div>

                {/* Right — Alpha's photo */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="flex-1 flex justify-center lg:justify-end items-center"
                >
                    <div className="relative">
                        {/* Decorative corner accents */}
                        <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-primary z-10" />
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-primary z-10" />

                        {/* Glow behind image */}
                        <div
                            className="absolute inset-0 scale-110"
                            style={{
                                background: 'radial-gradient(circle at center, rgba(0,102,255,0.25) 0%, transparent 70%)',
                                filter: 'blur(24px)',
                            }}
                        />

                        {/* Photo */}
                        <motion.img
                            src={publicUrl}
                            alt="Waida Alpha Wayne"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative z-10 w-[280px] md:w-[360px] lg:w-[420px] xl:w-[460px] object-cover object-top"
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                            }}
                        />

                        {/* Subtle blue tint overlay */}
                        <div
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,102,255,0.08) 0%, transparent 60%)',
                            }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Decorative scanline */}
            <div className="scanline opacity-10" />
        </section>
    )
}
