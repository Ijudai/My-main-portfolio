'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
]

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={cn(
            "fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 lg:px-24 py-6",
            isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <a href="#" className="text-3xl font-bebas tracking-tighter hover:text-primary transition-colors">
                    W<span className="text-primary">.</span>A<span className="text-primary">.</span>W
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-12">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="font-bebas text-xl tracking-widest hover:text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden bg-background/95 backdrop-blur-2xl absolute top-full left-0 w-full"
            >
                <div className="flex flex-col p-8 gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bebas text-3xl tracking-widest hover:text-primary transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </motion.div>
        </nav>
    )
}
