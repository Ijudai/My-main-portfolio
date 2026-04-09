'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Instagram, Send } from 'lucide-react'
import PrimaryButton from '../ui/PrimaryButton'
import { supabase } from '@/lib/supabase'

export default function ContactSection() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        budget: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        const { error } = await supabase
            .from('contact_submissions')
            .insert([formData])

        if (error) {
            console.error(error)
            setStatus('error')
        } else {
            setStatus('success')
            setFormData({ name: '', email: '', company: '', budget: '', message: '' })
        }
    }

    return (
        <section className="relative py-32 px-6 lg:px-24" id="contact">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">

                {/* Info Side */}
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bebas mb-6">
                            Ready to grow <span className="text-primary">Exponentially?</span>
                        </h2>
                        <p className="text-xl text-foreground/60 font-sans mb-12 max-w-md">
                            Have a brand that deserves to scale? Bring your vision — I'll bring the strategy to make it real.
                        </p>

                        <div className="space-y-8">
                            <a href="mailto:mrwayne756@gmail.com" className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-sm group-hover:bg-primary/20 transition-colors">
                                    <Mail className="text-primary" />
                                </div>
                                <span className="text-2xl font-bebas tracking-wide">mrwayne756@gmail.com</span>
                            </a>

                            <div className="flex gap-4">
                                <a
                                    href="https://www.linkedin.com/in/alpha-wayne-155376253"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                                >
                                    <Linkedin className="text-foreground/70" />
                                </a>
                                <a
                                    href="https://www.instagram.com/yoits.wayne"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                                >
                                    <Instagram className="text-foreground/70" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Form Side */}
                <div className="flex-[1.5]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-10 md:p-16"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bebas tracking-[0.2em] text-primary uppercase">Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary transition-colors outline-none font-sans"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bebas tracking-[0.2em] text-primary uppercase">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary transition-colors outline-none font-sans"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bebas tracking-[0.2em] text-primary uppercase">Company</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary transition-colors outline-none font-sans"
                                        placeholder="Brand Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bebas tracking-[0.2em] text-primary uppercase">Budget Range</label>
                                    <select
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="w-full bg-[#0a0a0f] border-b border-white/10 p-4 focus:border-primary transition-colors outline-none font-sans appearance-none text-foreground"
                                    >
                                        <option value="" className="bg-[#0a0a0f] text-foreground/40">Select Range</option>
                                        <option value="<$5k" className="bg-[#0a0a0f] text-foreground">&lt; $5k</option>
                                        <option value="$5k-$15k" className="bg-[#0a0a0f] text-foreground">$5k - $15k</option>
                                        <option value="$15k+" className="bg-[#0a0a0f] text-foreground">$15k+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bebas tracking-[0.2em] text-primary uppercase">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary transition-colors outline-none font-sans resize-none"
                                    placeholder="Describe your brand, your goals, and what's been holding you back..."
                                />
                            </div>

                            <PrimaryButton
                                type="submit"
                                className="w-full justify-center"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'Transmit Message'}
                            </PrimaryButton>

                            {status === 'success' && (
                                <p className="text-green-500 font-sans text-center">Message received. Expect a response within 24 hours.</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 font-sans text-center">Something went wrong. Try again or reach out directly at mrwayne756@gmail.com</p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
