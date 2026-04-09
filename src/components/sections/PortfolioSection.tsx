'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Video, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const categories = ['All', 'Ecommerce', 'SME', 'Social Media', 'Ads', 'SEO']

const VIDEO_EXTS = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
const isVideo = (url: string) => VIDEO_EXTS.some(ext => url.toLowerCase().includes(ext))
const isPdf = (url: string) => url.toLowerCase().includes('.pdf')

export default function PortfolioSection() {
    const [filter, setFilter] = useState('All')
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) setProjects(data)
            setLoading(false)
        }
        fetch()
    }, [])

    const filtered = filter === 'All'
        ? projects
        : projects.filter(p => p.category === filter)

    return (
        <section className="relative py-32 px-6 lg:px-24" id="portfolio">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-bebas mb-4">
                            Featured <span className="text-primary">Case Studies</span>
                        </h2>
                        <p className="text-xl text-foreground/60 font-sans max-w-xl">
                            Real brands. Real numbers. I don't just plan — I deliver.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "px-6 py-2 border font-bebas text-lg tracking-wide transition-all duration-300",
                                    filter === cat
                                        ? "bg-primary border-primary text-white"
                                        : "border-white/10 text-foreground/50 hover:border-primary/50"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-24 font-bebas text-3xl text-foreground/30 animate-pulse">
                        Loading Case Studies...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 text-foreground/20">
                        <p className="font-bebas text-3xl">No projects yet in this category.</p>
                        <p className="font-sans text-sm mt-2">Check back soon.</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="group relative overflow-hidden glass-card"
                                >
                                    {/* Media Thumbnail */}
                                    <div className="aspect-[16/10] overflow-hidden bg-white/5 relative">
                                        {project.thumbnail_url ? (
                                            isVideo(project.thumbnail_url) ? (
                                                <video
                                                    src={project.thumbnail_url}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : isPdf(project.thumbnail_url) ? (
                                                <a
                                                    href={project.thumbnail_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 transition-all"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <FileText size={56} className="text-primary/60" />
                                                    <span className="font-bebas text-lg text-foreground/50 tracking-widest">VIEW PDF</span>
                                                </a>
                                            ) : (
                                                <img
                                                    src={project.thumbnail_url}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="font-bebas text-6xl text-primary/20">
                                                    {project.category?.charAt(0)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Hover overlay — skip for PDFs since they have their own CTA */}
                                        {(!project.thumbnail_url || !isPdf(project.thumbnail_url)) && (
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-background">
                                                    <ExternalLink size={24} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Media type badge */}
                                        {project.thumbnail_url && isVideo(project.thumbnail_url) && (
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-sm">
                                                <Video size={12} className="text-primary" />
                                                <span className="font-bebas text-xs text-white/80">VIDEO</span>
                                            </div>
                                        )}
                                        {project.thumbnail_url && isPdf(project.thumbnail_url) && (
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-sm">
                                                <FileText size={12} className="text-primary" />
                                                <span className="font-bebas text-xs text-white/80">PDF</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-primary font-bebas text-xl tracking-wider">{project.category}</span>
                                            {project.results && (
                                                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-sans text-sm font-bold rounded-full">
                                                    {project.results}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-4xl font-bebas mb-4">{project.title}</h3>
                                        <p className="text-foreground/60 font-sans line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
