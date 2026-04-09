import React from 'react'
import { Linkedin, Instagram, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="py-16 px-6 lg:px-24 border-t border-white/5 bg-background relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <p className="font-bebas text-2xl tracking-widest mb-1">Waida Alpha Wayne</p>
                    <p className="text-foreground/40 font-sans text-sm">
                        © {new Date().getFullYear()} All Rights Reserved. Turning bold brands into market forces.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="mailto:mrwayne756@gmail.com"
                        className="w-11 h-11 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                        title="Email"
                    >
                        <Mail size={18} className="text-foreground/50" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/alpha-wayne-155376253"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                        title="LinkedIn"
                    >
                        <Linkedin size={18} className="text-foreground/50" />
                    </a>
                    <a
                        href="https://www.instagram.com/yoits.wayne"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                        title="Instagram"
                    >
                        <Instagram size={18} className="text-foreground/50" />
                    </a>
                </div>
            </div>
        </footer>
    )
}
