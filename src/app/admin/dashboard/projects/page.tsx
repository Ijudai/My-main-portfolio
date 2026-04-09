'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit2, Save, X, ImageIcon } from 'lucide-react'
import PrimaryButton from '@/components/ui/PrimaryButton'
import VaultPicker from '@/components/admin/VaultPicker'

type Project = {
    id?: string
    title: string
    category: string
    results: string
    description: string
    thumbnail_url: string
    content: string
}

const emptyProject: Project = {
    title: '',
    category: 'Ecommerce',
    results: '',
    description: '',
    thumbnail_url: '',
    content: '',
}

export default function ProjectManagerPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [editing, setEditing] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [showVaultPicker, setShowVaultPicker] = useState(false)

    useEffect(() => { fetchProjects() }, [])

    const fetchProjects = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setProjects(data)
        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editing) return
        const { id, ...data } = editing as any

        if (id) {
            await supabase.from('projects').update(data).eq('id', id)
        } else {
            await supabase.from('projects').insert([data])
        }

        setEditing(null)
        fetchProjects()
    }

    const deleteProject = async (id: string) => {
        if (!confirm('Delete this project?')) return
        await supabase.from('projects').delete().eq('id', id)
        fetchProjects()
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-bebas">
                        Project <span className="text-primary">Manager</span>
                    </h1>
                    <p className="text-foreground/40 font-sans text-sm">Detailed case study management.</p>
                </div>

                <button
                    onClick={() => setEditing(emptyProject)}
                    className="flex items-center gap-3 px-6 py-3 bg-primary text-white font-bebas text-xl hover:brightness-110 transition-all whitespace-nowrap"
                >
                    <Plus size={20} /> Add Project
                </button>
            </header>

            {/* Edit / Create Form */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-card p-6 lg:p-10"
                    >
                        <h2 className="font-bebas text-3xl mb-6">
                            {(editing as any).id ? 'Edit' : 'New'} <span className="text-primary">Project</span>
                        </h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Row 1: Title + Category */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bebas text-primary tracking-widest uppercase">Title</label>
                                    <input
                                        required
                                        value={editing.title}
                                        onChange={e => setEditing({ ...editing, title: e.target.value })}
                                        className="w-full bg-white/5 border-b border-white/10 p-3 outline-none font-sans focus:border-primary transition-colors"
                                        placeholder="Project title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bebas text-primary tracking-widest uppercase">Category</label>
                                    <select
                                        value={editing.category}
                                        onChange={e => setEditing({ ...editing, category: e.target.value })}
                                        className="w-full bg-[#0a0a0f] border-b border-white/10 p-3 outline-none font-sans focus:border-primary transition-colors appearance-none text-foreground"
                                    >
                                        <option value="Ecommerce" className="bg-[#0a0a0f] text-foreground">Ecommerce</option>
                                        <option value="SME" className="bg-[#0a0a0f] text-foreground">SME</option>
                                        <option value="Social Media" className="bg-[#0a0a0f] text-foreground">Social Media</option>
                                        <option value="Ads" className="bg-[#0a0a0f] text-foreground">Ads</option>
                                        <option value="SEO" className="bg-[#0a0a0f] text-foreground">SEO</option>
                                    </select>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="space-y-2">
                                <label className="text-xs font-bebas text-primary tracking-widest uppercase">Results Summary</label>
                                <input
                                    value={editing.results}
                                    onChange={e => setEditing({ ...editing, results: e.target.value })}
                                    className="w-full bg-white/5 border-b border-white/10 p-3 outline-none font-sans focus:border-primary transition-colors"
                                    placeholder="+240% Growth in 3 months"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bebas text-primary tracking-widest uppercase">Description</label>
                                <textarea
                                    rows={3}
                                    value={editing.description}
                                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                                    className="w-full bg-white/5 border-b border-white/10 p-3 outline-none font-sans focus:border-primary transition-colors resize-none"
                                    placeholder="Short project description..."
                                />
                            </div>

                            {/* Thumbnail — Pick from Vault */}
                            <div className="space-y-3">
                                <label className="text-xs font-bebas text-primary tracking-widest uppercase">Thumbnail</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    {/* Preview */}
                                    <div className="w-full sm:w-40 h-28 border border-white/10 flex items-center justify-center bg-white/5 shrink-0 overflow-hidden">
                                        {editing.thumbnail_url ? (
                                            <img
                                                src={editing.thumbnail_url}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-foreground/20">
                                                <ImageIcon size={28} />
                                                <span className="font-sans text-xs">No image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowVaultPicker(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all font-bebas text-lg text-foreground/70 hover:text-primary"
                                        >
                                            <ImageIcon size={18} />
                                            {editing.thumbnail_url ? 'Change from Vault' : 'Pick from Vault'}
                                        </button>

                                        {editing.thumbnail_url && (
                                            <button
                                                type="button"
                                                onClick={() => setEditing({ ...editing, thumbnail_url: '' })}
                                                className="flex items-center gap-2 text-sm font-sans text-red-500/60 hover:text-red-500 transition-colors"
                                            >
                                                <X size={14} /> Remove thumbnail
                                            </button>
                                        )}

                                        <p className="text-xs font-sans text-foreground/25">
                                            Select an image or PDF from your Media Vault.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <PrimaryButton type="submit" className="flex-1 justify-center">
                                    <Save size={18} className="mr-2" /> Save Project
                                </PrimaryButton>
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="flex-1 bg-white/5 border border-white/10 font-bebas text-xl py-3 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vault Picker Modal */}
            {showVaultPicker && editing && (
                <VaultPicker
                    accept={['image', 'video', 'pdf']}
                    currentUrl={editing.thumbnail_url}
                    onSelect={(url) => setEditing({ ...editing, thumbnail_url: url })}
                    onClose={() => setShowVaultPicker(false)}
                />
            )}

            {/* Projects List */}
            {loading ? (
                <div className="text-center py-20 font-bebas text-2xl animate-pulse text-foreground/40">
                    Loading Projects...
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 text-foreground/20">
                    <p className="font-bebas text-2xl">No projects yet.</p>
                    <p className="font-sans text-sm mt-1">Click "Add Project" to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                            <div className="flex gap-4 items-start min-w-0">
                                {/* Thumbnail preview in list */}
                                {project.thumbnail_url && (
                                    <img
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        className="w-16 h-16 object-cover shrink-0 border border-white/10"
                                    />
                                )}
                                <div className="min-w-0">
                                    <span className="text-primary font-bebas text-xs tracking-widest block mb-0.5 uppercase">
                                        {project.category}
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-bebas mb-1 truncate">{project.title}</h3>
                                    <p className="text-foreground/40 font-sans text-sm line-clamp-1">{project.description}</p>
                                    {project.results && (
                                        <span className="inline-block mt-1.5 text-xs font-bebas text-primary bg-primary/10 px-2 py-0.5">
                                            {project.results}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 shrink-0">
                                <button
                                    onClick={() => setEditing(project)}
                                    className="p-3 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all rounded-sm"
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => deleteProject(project.id)}
                                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
