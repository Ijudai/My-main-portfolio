'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Mail, Building2, DollarSign, Calendar, Trash2, ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Inquiry = {
    id: string
    name: string
    email: string
    company: string | null
    budget: string | null
    message: string
    created_at: string
}

type SortField = 'created_at' | 'name' | 'budget'
type SortDir = 'asc' | 'desc'

const BUDGET_ORDER: Record<string, number> = {
    '<$5k': 1,
    '$5k-$15k': 2,
    '$15k+': 3,
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [sortField, setSortField] = useState<SortField>('created_at')
    const [sortDir, setSortDir] = useState<SortDir>('desc')
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => { fetchInquiries() }, [])

    const fetchInquiries = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setInquiries(data)
        setLoading(false)
    }

    const deleteInquiry = async (id: string) => {
        if (!confirm('Delete this inquiry permanently?')) return
        setDeleting(id)
        await supabase.from('contact_submissions').delete().eq('id', id)
        setInquiries(prev => prev.filter(i => i.id !== id))
        if (expanded === id) setExpanded(null)
        setDeleting(null)
    }

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('desc')
        }
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    const filtered = inquiries
        .filter(i => {
            const q = search.toLowerCase()
            return (
                i.name.toLowerCase().includes(q) ||
                i.email.toLowerCase().includes(q) ||
                (i.company ?? '').toLowerCase().includes(q) ||
                i.message.toLowerCase().includes(q)
            )
        })
        .sort((a, b) => {
            let val = 0
            if (sortField === 'created_at') {
                val = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            } else if (sortField === 'name') {
                val = a.name.localeCompare(b.name)
            } else if (sortField === 'budget') {
                val = (BUDGET_ORDER[a.budget ?? ''] ?? 0) - (BUDGET_ORDER[b.budget ?? ''] ?? 0)
            }
            return sortDir === 'asc' ? val : -val
        })

    const budgetColour = (budget: string | null) => {
        if (!budget) return 'text-foreground/30'
        if (budget === '$15k+') return 'text-green-400'
        if (budget === '$5k-$15k') return 'text-primary'
        return 'text-foreground/60'
    }

    const SortButton = ({ field, label }: { field: SortField; label: string }) => (
        <button
            onClick={() => toggleSort(field)}
            className={cn(
                "flex items-center gap-1 font-bebas text-sm tracking-widest uppercase transition-colors",
                sortField === field ? "text-primary" : "text-foreground/30 hover:text-foreground/60"
            )}
        >
            {label}
            {sortField === field
                ? sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                : <ChevronDown size={14} className="opacity-30" />
            }
        </button>
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-bebas">
                        Inquiries <span className="text-primary">Inbox</span>
                    </h1>
                    <p className="text-foreground/40 font-sans text-sm">
                        {inquiries.length} lead{inquiries.length !== 1 ? 's' : ''} received
                    </p>
                </div>

                {/* Stats strip */}
                <div className="flex gap-4">
                    {[
                        { label: 'Total', value: inquiries.length },
                        { label: '$15k+', value: inquiries.filter(i => i.budget === '$15k+').length },
                        { label: '$5k–$15k', value: inquiries.filter(i => i.budget === '$5k-$15k').length },
                    ].map(s => (
                        <div key={s.label} className="glass-card px-4 py-2 text-center min-w-[60px]">
                            <p className="font-bebas text-2xl text-primary">{s.value}</p>
                            <p className="font-bebas text-xs text-foreground/30 tracking-widest uppercase">{s.label}</p>
                        </div>
                    ))}
                </div>
            </header>

            {/* Search + Sort bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 w-full sm:w-80 focus-within:border-primary/50 transition-colors">
                    <Search size={16} className="text-foreground/30 shrink-0" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, email, company…"
                        className="bg-transparent outline-none font-sans text-sm flex-1 placeholder:text-foreground/25"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="text-foreground/30 hover:text-foreground transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <span className="font-bebas text-xs text-foreground/25 tracking-widest uppercase">Sort by</span>
                    <SortButton field="created_at" label="Date" />
                    <SortButton field="name" label="Name" />
                    <SortButton field="budget" label="Budget" />
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="h-20 glass-card animate-pulse opacity-40" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 space-y-2 text-foreground/25">
                    <Mail size={48} className="mx-auto opacity-20" />
                    <p className="font-bebas text-2xl">{search ? 'No results found.' : 'No inquiries yet.'}</p>
                    <p className="font-sans text-sm">
                        {search ? 'Try a different search term.' : 'Leads will appear here once the contact form is submitted.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence initial={false}>
                        {filtered.map((inq, i) => {
                            const isOpen = expanded === inq.id
                            const isDeleting = deleting === inq.id

                            return (
                                <motion.div
                                    key={inq.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={cn(
                                        "glass-card overflow-hidden transition-all",
                                        isOpen && "border-primary/30"
                                    )}
                                >
                                    {/* Row */}
                                    <div
                                        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                                        onClick={() => setExpanded(isOpen ? null : inq.id)}
                                    >
                                        {/* Avatar initial */}
                                        <div className="w-10 h-10 rounded-sm bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                                            <span className="font-bebas text-xl text-primary">
                                                {inq.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Name + email */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bebas text-xl leading-tight truncate">{inq.name}</p>
                                            <p className="font-sans text-xs text-foreground/40 truncate">{inq.email}</p>
                                        </div>

                                        {/* Company */}
                                        {inq.company && (
                                            <div className="hidden sm:flex items-center gap-1.5 text-foreground/40">
                                                <Building2 size={13} />
                                                <span className="font-sans text-xs truncate max-w-[120px]">{inq.company}</span>
                                            </div>
                                        )}

                                        {/* Budget */}
                                        <div className="hidden md:flex items-center gap-1.5">
                                            <DollarSign size={13} className={budgetColour(inq.budget)} />
                                            <span className={cn("font-bebas text-sm", budgetColour(inq.budget))}>
                                                {inq.budget ?? '—'}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <div className="hidden lg:flex items-center gap-1.5 text-foreground/30">
                                            <Calendar size={13} />
                                            <span className="font-sans text-xs">{formatDate(inq.created_at)}</span>
                                        </div>

                                        {/* Expand indicator */}
                                        <div className={cn(
                                            "text-foreground/30 transition-transform duration-200 shrink-0",
                                            isOpen && "rotate-180"
                                        )}>
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                                                    {/* Meta row */}
                                                    <div className="flex flex-wrap gap-4 text-sm font-sans">
                                                        <div className="flex items-center gap-2 text-foreground/50">
                                                            <Mail size={13} className="text-primary/60" />
                                                            <a href={`mailto:${inq.email}`} className="hover:text-primary transition-colors">
                                                                {inq.email}
                                                            </a>
                                                        </div>
                                                        {inq.company && (
                                                            <div className="flex items-center gap-2 text-foreground/50">
                                                                <Building2 size={13} className="text-primary/60" />
                                                                <span>{inq.company}</span>
                                                            </div>
                                                        )}
                                                        {inq.budget && (
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign size={13} className="text-primary/60" />
                                                                <span className={cn("font-bebas text-base", budgetColour(inq.budget))}>
                                                                    {inq.budget}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-foreground/30">
                                                            <Calendar size={13} />
                                                            <span>{formatDate(inq.created_at)} at {formatTime(inq.created_at)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Message */}
                                                    <div className="bg-white/3 border border-white/5 px-5 py-4 rounded-sm">
                                                        <p className="font-bebas text-xs text-primary tracking-widest uppercase mb-2">Message</p>
                                                        <p className="font-sans text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">
                                                            {inq.message}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-3 pt-1">
                                                        <a
                                                            href={`mailto:${inq.email}?subject=Re: Your inquiry&body=Hi ${inq.name},%0D%0A%0D%0A`}
                                                            className="flex items-center gap-2 px-5 py-2 bg-primary text-white font-bebas text-lg hover:brightness-110 transition-all"
                                                        >
                                                            <Mail size={15} /> Reply
                                                        </a>
                                                        <button
                                                            onClick={() => deleteInquiry(inq.id)}
                                                            disabled={!!isDeleting}
                                                            className="flex items-center gap-2 px-5 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bebas text-lg transition-all disabled:opacity-40"
                                                        >
                                                            <Trash2 size={15} />
                                                            {isDeleting ? 'Deleting…' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
