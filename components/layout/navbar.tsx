'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { createClient } from '@/services/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { isUserAdmin } from '@/lib/auth/admin-check'
import { 
  Landmark, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldAlert 
} from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const isAdmin = isUserAdmin(user)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'AI Assistant', href: '/chat', ai: true },
    { name: 'Dashboard', href: '/dashboard', authRequired: true },
    { name: 'Admin Console', href: '/admin', authRequired: true, adminOnly: true }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/10 glass-header transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
            PakAssist <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 font-black">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold">
          {navLinks.map((link) => {
            if (link.authRequired && !user) return null
            if (link.adminOnly && !isAdmin) return null
            const active = isLinkActive(link.href)
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-1.5 transition-all py-1.5 px-2.5 rounded-lg relative ${
                  active 
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                }`}
              >
                {link.ai && <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />}
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Desktop User Menu Actions */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          ) : user ? (
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-52 glass-card rounded-2xl shadow-xl p-2 z-50 mt-1"
                  >
                    <div className="px-3 py-2 border-b border-emerald-500/10 text-left mb-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Logged In As</span>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate block">{user.email}</span>
                    </div>

                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)}>
                      <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-500/10 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>User Dashboard</span>
                      </button>
                    </Link>

                    {isAdmin && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}>
                        <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-500/10 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors">
                          <ShieldAlert className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Admin Console</span>
                        </button>
                      </Link>
                    )}

                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-emerald-500/10 mt-1.5 pt-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold text-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl px-4 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          {user && (
            <div className="h-7 w-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs mr-1">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 space-y-4 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col gap-3 font-semibold text-xs text-left">
              <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400">Services</Link>
              <Link href="/chat" onClick={() => setMobileMenuOpen(false)} className="py-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>AI Assistant</span>
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400">User Dashboard</Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400">Admin Console</Link>
                  )}
                  <button 
                    onClick={() => { setMobileMenuOpen(false); handleSignOut() }}
                    className="w-full text-left py-2 rounded-xl font-bold text-red-500 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5 mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-900">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-bold">Login</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-emerald-700 text-white font-bold">Get Started</Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
