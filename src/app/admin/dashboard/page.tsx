'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Briefcase, ImageIcon, Mail, ArrowRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type Stats = {
    projects: number
    media: number
    inquiries: number
}

type RecentProject = {
    id: string
    title: string
    category: string
    created_at: string
}

type RecentInquiry = {
    id: string
    name: string
    email: string
    budget: string | null
    created_at: string
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({ projects: 0, media: 0, inquiries: 0 })
    const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
    const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const [
                { count: projectCount },
                { count: mediaCount },
                { count: inquiryCount },
                { data: projects },
                { data: inquiries },
            ] = await Promise.all([
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('My portfolio').select('*', { count: 'exact', head: true }),
                supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
                supabase.from('projects').select('id, title, category, created_at').order('created_at', { ascending: false }).limit(3),
                supabase.from('contact_submissions').select('id, name, email, budget, created_at').order('created_at', { ascending: false }).limit(3),
            ])

            setStats({
                projects: projectCount ?? 0,
                media: mediaCount ?? 0,
                inquiries: inquiryCount ?? 0,
            })
            if (projects) setRecentProjects(projects)
            if (inquiries) setRecentInquiries(inquiries)
            setLoading(false)
        }

        load()
    }, [])

    const statCards = [
        {
            label: 'Live Projects',
            value: stats.projects,
            icon: Briefcase,
            href: '/admin/dashboard/projects',
            description: 'Case studies published',
        },
        {
            label: 'Vault Assets',
            value: stats.media,
            icon: ImageIcon,
            href: '/admin/dashboard/media',
            description: 'Media files stored',
        },
        {
            label: 'Inquiries',
            value: stats.inquiries,
            icon: Mail,
            href: '/admin/dashboard/inquiries',
            description: 'Leads from contact form',
        },
    ]

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
        <div className="space-y-10">
            {/* Header */}
            <header>
                <h1 className="text-5xl lg:text-6xl font-bebas mb-1">
                    Welcome back, <span className="text-primary">Waida</span>
                </h1>
                <p className="text-foreground/40 font-sans text-sm">
                    Here's a live snapshot of your portfolio.
                </p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Link
                            href={stat.href}
                            className="glass-card p-8 flex flex-col gap-4 group block hover:border-primary/40 transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <stat.icon size={20} className="text-primary" />
                                </div>
                                <span className={cn("text-5xl font-bebas text-primary tabular-nums", loading && "animate-pulse opacity-40")}>
                                    {loading ? '—' : stat.value}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-bebas text-2xl tracking-wide">{stat.label}</h3>
                                <p className="font-sans text-xs text-foreground/30 mt-0.5">{stat.description}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Projects */}
                <div className="glass-card p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bebas text-2xl">Recent Projects</h2>
                        <Link
                            href="/admin/dashboard/projects"
                            className="flex items-center gap-1 font-bebas text-sm text-primary hover:brightness-125 transition-all"
                        >
                            Manage <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="h-12 bg-white/5 animate-pulse rounded-sm" />
                            ))}
                        </div>
                    ) : recentProjects.length === 0 ? (
                        <div className="py-8 text-center text-foreground/25">
                            <p className="font-bebas text-xl">No projects yet.</p>
                            <Link href="/admin/dashboard/projects" className="font-sans text-xs text-primary hover:underline mt-1 block">
                                Add your first project →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentProjects.map(p => (
                                <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 hover:border-primary/20 transition-colors rounded-sm">
                                    <div>
                                        <p className="font-bebas text-lg leading-tight">{p.title}</p>
                                        <span className="font-bebas text-xs text-primary tracking-widest uppercase">{p.category}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-foreground/25 font-sans text-xs">
                                        <Clock size={11} />
                                        {formatDate(p.created_at)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Inquiries */}
                <div className="glass-card p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bebas text-2xl">Recent Inquiries</h2>
                        <span className="font-bebas text-xs text-foreground/25 tracking-widest uppercase">Contact Form</span>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="h-12 bg-white/5 animate-pulse rounded-sm" />
                            ))}
                        </div>
                    ) : recentInquiries.length === 0 ? (
                        <div className="py-8 text-center text-foreground/25">
                            <p className="font-bebas text-xl">No inquiries yet.</p>
                            <p className="font-sans text-xs mt-1">Leads will appear here once the contact form is submitted.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentInquiries.map(inq => (
                                <div key={inq.id} className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 hover:border-primary/20 transition-colors rounded-sm">
                                    <div>
                                        <p className="font-bebas text-lg leading-tight">{inq.name}</p>
                                        <span className="font-sans text-xs text-foreground/40">{inq.email}</span>
                                    </div>
                                    <div className="text-right">
                                        {inq.budget && (
                                            <span className="font-bebas text-sm text-primary block">{inq.budget}</span>
                                        )}
                                        <span className="font-sans text-xs text-foreground/25">{formatDate(inq.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
                <h2 className="font-bebas text-2xl mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/dashboard/projects"
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bebas text-lg hover:brightness-110 transition-all"
                    >
                        <Briefcase size={16} /> New Project
                    </Link>
                    <Link
                        href="/admin/dashboard/media"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 font-bebas text-lg hover:bg-white/10 hover:border-primary/30 transition-all"
                    >
                        <ImageIcon size={16} /> Upload Media
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 font-bebas text-lg hover:bg-white/10 hover:border-primary/30 transition-all"
                    >
                        <ArrowRight size={16} /> View Live Site
                    </Link>
                </div>
            </div>
        </div>
    )
}

