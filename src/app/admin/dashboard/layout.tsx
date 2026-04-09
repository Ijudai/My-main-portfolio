'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, FolderKanban, Image as ImageIcon, Mail, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Projects', icon: FolderKanban, href: '/admin/dashboard/projects' },
    { name: 'Media Vault', icon: ImageIcon, href: '/admin/dashboard/media' },
    { name: 'Inquiries', icon: Mail, href: '/admin/dashboard/inquiries' },
]

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (!session) router.push('/login')
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (!session) router.push('/login')
        })

        return () => subscription.unsubscribe()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-primary font-bebas text-4xl animate-pulse">Initializing Dashboard...</div>
        </div>
    )

    if (!session) return null

    return (
        <div className="min-h-screen flex bg-[#0a0a0f]">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-30 w-64 border-r border-white/5 p-8 flex flex-col bg-[#0a0a0f]",
                "transform transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex items-center justify-between mb-12">
                    <div className="text-3xl font-bebas tracking-tighter">
                        Admin <span className="text-primary">Portal</span>
                    </div>
                    <button
                        className="lg:hidden text-foreground/40 hover:text-foreground transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const active = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 font-bebas text-xl transition-all rounded-sm",
                                    active
                                        ? "text-primary bg-primary/10 border-l-2 border-primary pl-3"
                                        : "text-foreground/50 hover:text-primary hover:bg-white/5"
                                )}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 text-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all font-bebas text-xl rounded-sm"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center gap-4 px-4 py-4 border-b border-white/5 sticky top-0 z-10 bg-[#0a0a0f]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-foreground/60 hover:text-primary transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="text-2xl font-bebas tracking-tighter">
                        Admin <span className="text-primary">Portal</span>
                    </div>
                </div>

                <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
