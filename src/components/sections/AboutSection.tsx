'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const skills = [
    "Creative Strategy",
    "Social Media Management",
    "Paid Advertising",
    "SEO Optimization",
    "Brand Identity",
    "Content Production",
    "Performance Marketing",
    "Data Analysis"
]

export default function AboutSection() {
    return (
        <section className="relative py-32 px-6 lg:px-24 overflow-hidden" id="about">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">

                {/* Bio Side */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1"
                >
                    <h2 className="text-5xl md:text-7xl font-bebas mb-12 flex flex-col">
                        <span className="text-primary opacity-50">Who Am I</span>
                        <span>The Architect of Brand Growth</span>
                    </h2>

                    <div className="space-y-6 text-xl text-foreground/80 font-sans leading-relaxed">
                        <p>
                            I don't just create content — I engineer growth ecosystems that turn
                            brands into revenue machines. With a background spanning creative production
                            and performance analytics, I specialise in scaling Ecommerce & SME brands
                            from overlooked to undeniable.
                        </p>
                        <p>
                            My approach is rare: asymmetric thinking backed by cold, hard data.
                            Whether rebuilding a brand's social identity from the ground up or
                            precision-tuning a paid funnel for maximum ROAS, the goal never changes —
                            relentless, exponential growth.
                        </p>
                    </div>
                </motion.div>

                {/* Skills Side */}
                <div className="flex-1 relative">
                    <div className="grid grid-cols-2 gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                                    borderColor: 'rgba(0, 102, 255, 0.4)'
                                }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className={cn(
                                    "p-6 border border-white/10 rounded-sm font-bebas text-2xl tracking-tight transition-colors duration-300",
                                    "flex items-center justify-center text-center"
                                )}
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>

                    {/* Decorative bioluminescent glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] electric-glow" />
                </div>
            </div>

            {/* Diagonal Divider Element */}
            <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-background to-transparent" />
        </section>
    )
}
