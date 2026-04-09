'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Target, PieChart, Search, ArrowRight, ChevronUp, ArrowUpRight } from 'lucide-react'

const services = [
    {
        title: "Creative Strategy",
        description: "No guesswork, no vanity metrics. I build razor-sharp creative roadmaps that position your brand exactly where it needs to be.",
        detail: [
            "Market analysis & competitive research",
            "Brand positioning & messaging",
            "Content pillar development",
            "Campaign architecture",
            "Cross-channel strategy execution",
        ],
        icon: Rocket
    },
    {
        title: "Social Media Management",
        description: "I don't just post — I build communities that convert. Precision-managed presence across every platform that matters.",
        detail: [
            "Content creation & scheduling",
            "Community engagement & moderation",
            "Influencer partnerships",
            "Trend identification & capitalisation",
            "Platform-specific growth tactics",
        ],
        icon: Target
    },
    {
        title: "Paid Advertising",
        description: "High-ROAS campaigns engineered on Meta, Google, and TikTok. Every dollar tracked, every creative tested, every funnel optimised.",
        detail: [
            "Ad creative production",
            "Audience segmentation & targeting",
            "Funnel design & optimisation",
            "A/B testing at scale",
            "Full performance analytics reporting",
        ],
        icon: PieChart
    },
    {
        title: "SEO Optimization",
        description: "Sustainable organic growth built to outlast every algorithm shift. I put your brand where your customers are already looking.",
        detail: [
            "Keyword research & mapping",
            "On-page optimisation",
            "Technical SEO audits",
            "Content strategy & creation",
            "Authoritative link-building",
        ],
        icon: Search
    }
]

export default function ServicesSection() {
    const [expanded, setExpanded] = useState<string | null>(null)

    const toggle = (title: string) =>
        setExpanded(prev => prev === title ? null : title)

    return (
        <section className="relative py-32 px-6 lg:px-24 bg-background" id="services">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-5xl md:text-7xl font-bebas">
                        My <span className="text-primary">Arsenal</span>
                    </h2>
                    <p className="max-w-2xl text-foreground/60 text-xl font-sans mt-4">
                        A full-stack creative approach — from brand positioning to performance campaigns that actually convert.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, i) => {
                        const isOpen = expanded === service.title

                        return (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className={`glass-card p-10 relative group overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/40' : ''}`}
                            >
                                {/* Icon Background Decoration */}
                                <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                    <service.icon size={150} />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-primary/20 flex items-center justify-center rounded-sm mb-8 group-hover:bg-primary/40 transition-colors duration-300">
                                        <service.icon className="text-primary" size={32} />
                                    </div>

                                    <h3 className="text-4xl font-bebas mb-4">{service.title}</h3>
                                    <p className="text-xl font-sans text-foreground/70 mb-6 max-w-md">
                                        {service.description}
                                    </p>

                                    {/* Expandable detail */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <ul className="space-y-2 py-4 border-t border-primary/20 mb-6">
                                                    {service.detail.map(item => (
                                                        <li key={item} className="flex items-center gap-3 font-sans text-sm text-foreground/70">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button
                                                    onClick={() => {
                                                        setExpanded(null)
                                                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                                                    }}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bebas text-xl hover:brightness-110 transition-all mb-4"
                                                >
                                                    Work With Me <ArrowUpRight size={18} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Toggle button */}
                                    <button
                                        onClick={() => toggle(service.title)}
                                        className="flex items-center gap-2 font-bebas text-xl text-primary hover:brightness-125 transition-all"
                                    >
                                        {isOpen ? (
                                            <>Show Less <ChevronUp size={20} /></>
                                        ) : (
                                            <>Learn More <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
