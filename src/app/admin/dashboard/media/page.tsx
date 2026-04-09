'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Upload, Trash2, File as FileIcon, Video, Eye, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type MediaItem = {
    id: string
    file_name: string
    file_type: string
    file_url: string
    category: string
    upload_date: string
}

type FilterType = 'all' | 'image' | 'video' | 'pdf'

export default function MediaVaultPage() {
    const [media, setMedia] = useState<MediaItem[]>([])
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [dragging, setDragging] = useState(false)
    const [viewer, setViewer] = useState<MediaItem | null>(null)
    const [activeFilter, setActiveFilter] = useState<FilterType>('all')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { fetchMedia() }, [])

    const fetchMedia = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('My portfolio')
            .select('*')
            .order('upload_date', { ascending: false })
        if (data) setMedia(data)
        setLoading(false)
    }

    const handleUpload = async (file: File) => {
        setUploading(true)

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('My portfolio')
            .upload(fileName, file)

        if (uploadError) {
            alert('Error uploading file: ' + uploadError.message)
            setUploading(false)
            return
        }

        const { data: { publicUrl } } = supabase.storage
            .from('My portfolio')
            .getPublicUrl(fileName)

        const fileType = file.type.startsWith('image') ? 'image'
            : file.type.startsWith('video') ? 'video'
            : 'pdf'

        const { error: dbError } = await supabase
            .from('My portfolio')
            .insert([{ file_name: file.name, file_type: fileType, file_url: publicUrl, category: fileType }])

        if (dbError) {
            alert('Error saving to DB: ' + dbError.message)
        } else {
            fetchMedia()
        }

        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleUpload(file)
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleUpload(file)
    }, [])

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragging(false)
        }
    }

    const deleteMedia = async (id: string, url: string) => {
        if (!confirm('Delete this file permanently?')) return
        const parts = url.split('/')
        const fileName = parts[parts.length - 1]
        await supabase.storage.from('My portfolio').remove([fileName])
        await supabase.from('My portfolio').delete().eq('id', id)
        if (viewer?.id === id) setViewer(null)
        fetchMedia()
    }

    const filtered = activeFilter === 'all' ? media : media.filter(m => m.file_type === activeFilter)

    const counts = {
        all: media.length,
        image: media.filter(m => m.file_type === 'image').length,
        video: media.filter(m => m.file_type === 'video').length,
        pdf: media.filter(m => m.file_type === 'pdf').length,
    }

    const FileTypeIcon = ({ type, size = 40 }: { type: string; size?: number }) => {
        if (type === 'video') return <Video size={size} className="text-primary/50" />
        if (type === 'pdf') return <FileIcon size={size} className="text-primary/50" />
        return <ImageIcon size={size} className="text-primary/50" />
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-bebas">
                        Media <span className="text-primary">Vault</span>
                    </h1>
                    <p className="text-foreground/40 font-sans text-sm">
                        {media.length} asset{media.length !== 1 ? 's' : ''} stored
                    </p>
                </div>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-3 px-6 py-3 bg-primary text-white font-bebas text-xl hover:brightness-110 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                    <Upload size={20} />
                    {uploading ? 'Uploading...' : 'Upload Asset'}
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,video/*,.pdf"
                    onChange={handleFileChange}
                />
            </header>

            {/* Drag & Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 select-none",
                    dragging
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : uploading
                            ? "border-primary/40 bg-primary/5 cursor-default"
                            : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                )}
            >
                {uploading ? (
                    <div className="space-y-4">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="font-bebas text-2xl text-primary">Uploading to Vault...</p>
                        <div className="w-48 mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-pulse w-2/3 rounded-full" />
                        </div>
                    </div>
                ) : (
                    <>
                        <Upload
                            size={36}
                            className={cn("mx-auto mb-3 transition-colors", dragging ? "text-primary" : "text-foreground/20")}
                        />
                        <p className="font-bebas text-xl text-foreground/50">
                            {dragging ? 'Drop to upload' : 'Drag & drop a file, or click to browse'}
                        </p>
                        <p className="font-sans text-xs text-foreground/20 mt-1">
                            Supports: Images, Videos, PDFs
                        </p>
                    </>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'image', 'video', 'pdf'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={cn(
                            "px-4 py-2 font-bebas text-lg transition-all",
                            activeFilter === f
                                ? "bg-primary text-white"
                                : "bg-white/5 text-foreground/40 hover:bg-white/10 hover:text-foreground"
                        )}
                    >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                        <span className="ml-2 text-sm opacity-60">({counts[f]})</span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-20 font-bebas text-2xl animate-pulse text-foreground/40">
                    Scanning Vault...
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-foreground/20 space-y-2">
                    <FileTypeIcon type={activeFilter === 'all' ? 'image' : activeFilter} size={48} />
                    <p className="font-bebas text-2xl">No files here yet.</p>
                    <p className="font-sans text-sm">Upload your first asset using the zone above.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filtered.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="glass-card group relative aspect-square flex items-center justify-center overflow-hidden cursor-pointer"
                            onClick={() => setViewer(item)}
                        >
                            {/* Thumbnail */}
                            {item.file_type === 'image' ? (
                                <img
                                    src={item.file_url}
                                    alt={item.file_name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <FileTypeIcon type={item.file_type} />
                                    <span className="font-bebas text-xs text-foreground/30 uppercase">
                                        {item.file_type}
                                    </span>
                                </div>
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-3">
                                <p className="text-xs font-sans text-center line-clamp-2 text-foreground/70 w-full">
                                    {item.file_name}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={e => { e.stopPropagation(); setViewer(item) }}
                                        className="p-2 bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors rounded-sm"
                                        title="View"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    <button
                                        onClick={e => { e.stopPropagation(); deleteMedia(item.id, item.file_url) }}
                                        className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* File Viewer Modal */}
            <AnimatePresence>
                {viewer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setViewer(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col gap-3"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Viewer toolbar */}
                            <div className="flex items-center justify-between px-2">
                                <div>
                                    <p className="font-bebas text-lg text-foreground/80">{viewer.file_name}</p>
                                    <p className="font-sans text-xs text-foreground/30 uppercase">{viewer.file_type}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={viewer.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors font-bebas text-lg"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Open Original
                                    </a>
                                    <button
                                        onClick={() => setViewer(null)}
                                        className="p-2 text-foreground/40 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden flex items-center justify-center">
                                {viewer.file_type === 'image' ? (
                                    <img
                                        src={viewer.file_url}
                                        alt={viewer.file_name}
                                        className="max-h-[78vh] max-w-full object-contain rounded-sm"
                                    />
                                ) : viewer.file_type === 'video' ? (
                                    <video
                                        src={viewer.file_url}
                                        controls
                                        autoPlay
                                        className="max-h-[78vh] max-w-full rounded-sm"
                                    />
                                ) : (
                                    <iframe
                                        src={viewer.file_url}
                                        className="w-full h-[78vh] rounded-sm bg-white"
                                        title={viewer.file_name}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
