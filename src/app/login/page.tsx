'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PrimaryButton from '@/components/ui/PrimaryButton'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/admin/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="glass-card p-12 w-full max-w-md">
                <h1 className="text-5xl font-bebas mb-8 text-center">Admin <span className="text-primary">Login</span></h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bebas tracking-widest text-primary uppercase">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary transition-colors outline-none font-sans"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bebas tracking-widest text-primary uppercase">Password</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary transition-colors outline-none font-sans"
                        />
                    </div>

                    {error && <p className="text-red-500 font-sans text-sm text-center">{error}</p>}

                    <PrimaryButton
                        disabled={loading}
                        type="submit"
                        className="w-full justify-center"
                    >
                        {loading ? 'Authenticating...' : 'Enter Vault'}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    )
}
