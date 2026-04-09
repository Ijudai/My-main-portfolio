'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
    {
        name: "Sarah Jenkins",
        company: "LuxeEco",
        quote: "Waida completely transformed our digital strategy. Our ROAS jumped from 2.1 to 5.4 in just three months — results we didn't think were possible.",
        photo: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        name: "Marcus Thorne",
        company: "AlphaTech",
        quote: "Surgical precision in everything he does. The most analytical creative mind I've ever worked with. He thinks in systems, not posts.",
        photo: "https://i.pravatar.cc/150?u=marcus"
    },
    {
        name: "Elena Ross",
        company: "Vibe Social",
        quote: "Our engagement tripled within weeks. His understanding of culture, timing, and audience behaviour is genuinely unparalleled.",
        photo: "https://i.pravatar.cc/150?u=elena"
    },
    {
        name: "David Chen",
        company: "Zen Ecommerce",
        quote: "The strategic depth Waida brings is a game-changer. He's not a freelancer — he's a growth partner who is deeply invested in your success.",
        photo: "https://i.pravatar.cc/150?u=david"
    }
]

export default function TestimonialsSection() {
    const doubledTestimonials = [...testimonials, ...testimonials]

    return (
        <section className="py-32 overflow-hidden bg-primary/5">
            <div className="px-6 lg:px-24 mb-16">
                <h2 className="text-5xl md:text-7xl font-bebas text-center">
                    What My <span className="text-primary">Clients Say</span>
                </h2>
            </div>

            <div className="flex relative items-center">
                <motion.div
                    animate={{
                        x: [0, -1920],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 40,
                            ease: "linear",
                        },
                    }}
                    className="flex gap-8 px-4"
                >
                    {doubledTestimonials.map((t, i) => (
                        <div
                            key={i}
                            className="glass-card min-w-[400px] md:min-w-[500px] p-10 flex flex-col justify-between"
                        >
                            <div>
                                <Quote className="text-primary mb-6" size={40} />
                                <p className="text-2xl font-sans italic text-foreground/80 leading-relaxed mb-8">
                                    "{t.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <img
                                    src={t.photo}
                                    alt={t.name}
                                    className="w-14 h-14 rounded-full grayscale hover:grayscale-0 transition-all duration-300 border-2 border-primary/20"
                                />
                                <div>
                                    <h4 className="font-bebas text-2xl tracking-wide">{t.name}</h4>
                                    <p className="text-primary font-sans text-sm uppercase tracking-widest">{t.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Fades for masking edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
            </div>
        </section>
    )
}
