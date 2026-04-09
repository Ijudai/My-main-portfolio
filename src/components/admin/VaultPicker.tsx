'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { X, Check, File as FileIcon, Video, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type VaultItem = {
    id: string
    file_name: string
    file_type: string
    file_url: string
    upload_date: string
}

interface VaultPickerProps {
    accept?: ('image' | 'video' | 'pdf')[]
    onSelect: (url: string) => void
    onClose: () => void
    currentUrl?: string
}

export default function VaultPicker({ accept = ['image', 'video', 'pdf'], onSelect, onClose, currentUrl }: VaultPickerProps) {
    const [items, setItems] = useState<VaultItem[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<string>(currentUrl || '')

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('My portfolio')
                .select('*')
                .in('file_type', accept)
                .order('upload_date', { ascending: false })
            if (data) setItems(data)
            setLoading(false)
        }
        fetch()
    }, [])

    const filtered = items.filter(i =>
        i.file_name.toLowerCase().includes(search.toLowerCase())
    )

    const handleConfirm = () => {
        if (selected) onSelect(selected)
        onClose()
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card w-full max-w-3xl max-h-[85vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="font-bebas text-3xl">Pick from <span className="text-primary">Vault</span></h2>
                            <p className="text-foreground/40 font-sans text-xs mt-1">
                                Showing: {accept.join(', ')}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-foreground/40 hover:text-foreground transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-6 py-4 border-b border-white/10">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2">
                            <Search size={16} className="text-foreground/30" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search files..."
                                className="bg-transparent outline-none font-sans text-sm flex-1 placeholder:text-foreground/30"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="text-center py-12 font-bebas text-xl text-foreground/40 animate-pulse">
                                Loading vault...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12 font-bebas text-xl text-foreground/30">
                                No files found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {filtered.map(item => {
                                    const isSelected = selected === item.file_url
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelected(item.file_url)}
                                            className={cn(
                                                "relative aspect-square rounded-sm overflow-hidden border-2 transition-all duration-200",
                                                isSelected
                                                    ? "border-primary shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                                                    : "border-white/10 hover:border-white/30"
                                            )}
                                        >
                                            {item.file_type === 'image' ? (
                                                <img
                                                    src={item.file_url}
                                                    alt={item.file_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : item.file_type === 'video' ? (
                                                <div className="w-full h-full relative bg-black flex items-center justify-center">
                                                    <video
                                                        src={item.file_url}
                                                        muted
                                                        className="w-full h-full object-cover opacity-70"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Video size={24} className="text-white/80" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-white/5">
                                                    <FileIcon size={28} className="text-primary/60" />
                                                    <span className="font-bebas text-xs text-foreground/40 px-1 text-center truncate w-full">
                                                        PDF
                                                    </span>
                                                </div>
                                            )}

                                            {/* Selected checkmark */}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <div className="bg-primary rounded-full p-1">
                                                        <Check size={16} className="text-white" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Filename tooltip on hover */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-1 py-0.5 opacity-0 hover:opacity-100 transition-opacity">
                                                <p className="text-xs font-sans truncate text-foreground/70">{item.file_name}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-4 p-6 border-t border-white/10">
                        <span className="text-foreground/40 font-sans text-sm">
                            {selected ? '1 file selected' : 'None selected'}
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-white/5 border border-white/10 font-bebas text-lg hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selected}
                                className="px-6 py-2 bg-primary text-white font-bebas text-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Use This File
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
