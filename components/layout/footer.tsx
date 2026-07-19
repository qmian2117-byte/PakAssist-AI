import React from 'react'
import Link from 'next/link'
import { Landmark } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-emerald-500/10 bg-slate-900 text-slate-400 py-14 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 h-32 w-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 relative z-10">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5 text-white font-extrabold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Landmark className="h-4 w-4" />
            </div>
            <span>PakAssist <span className="text-emerald-400">AI</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered citizen assistance platform for verified Pakistan government service guidelines. Zero hallucination guaranteed.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">Government Services</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/services?category=nadra" className="hover:text-emerald-400 transition-colors">NADRA Guidance</Link></li>
            <li><Link href="/services?category=passport" className="hover:text-emerald-400 transition-colors">Passport Services</Link></li>
            <li><Link href="/services?category=driving-license" className="hover:text-emerald-400 transition-colors">Driving License</Link></li>
            <li><Link href="/services?category=scholarships" className="hover:text-emerald-400 transition-colors">HEC Scholarships</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">AI Engine</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/chat" className="hover:text-emerald-400 transition-colors">AI Chatbot Assistant</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-emerald-400 transition-colors">No-Hallucination Policy</Link></li>
            <li><Link href="/#faq" className="hover:text-emerald-400 transition-colors">Verified Sources</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">Legal</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-10 border-t border-slate-800 pt-6 text-center text-[11px] text-slate-500 px-6 relative z-10">
        <p>© {new Date().getFullYear()} PakAssist AI. Developed for citizen assistance. All official service procedures are verified against official government websites.</p>
      </div>
    </footer>
  )
}
