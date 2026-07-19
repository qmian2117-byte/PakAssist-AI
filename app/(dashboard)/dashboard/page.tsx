'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/services/supabase/client'
import { User } from '@supabase/supabase-js'
import { getDashboardData, DashboardData } from '@/app/actions/dashboard-action'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import InstantSearch from '@/components/shared/instant-search'
import { 
  Landmark, 
  Sparkles, 
  Bookmark, 
  Clock, 
  ChevronRight, 
  BookOpen,
  MessageSquare,
  Activity,
  FileCheck2,
  Bell,
  LogOut
} from 'lucide-react'

interface RecentlyViewedItem {
  title: string
  slug: string
  category?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch dynamic database data
      const dbData = await getDashboardData()
      setData(dbData)

      // Load recently viewed services from localStorage
      const recent = localStorage.getItem('recently_viewed_services')
      if (recent) {
        setRecentlyViewed(JSON.parse(recent))
      }

      setLoading(false)
    }

    loadDashboard()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-950/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-11 w-11 border-2 border-emerald-700 border-t-transparent mx-auto" />
          <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">Loading your citizen dashboard...</p>
        </div>
      </div>
    )
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Citizen'

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      
      {/* Top Navbar Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-16 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <Landmark className="h-4.5 w-4.5" />
          </div>
          <span className="font-extrabold text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
            PakAssist AI Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
            <div className="h-6 w-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
              {fullName[0].toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 hidden sm:inline">{fullName}</span>
          </div>
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-semibold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/40 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-6 py-8 max-w-5xl space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
              Assalam-o-Alaikum, {fullName}!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              Manage your saved guidelines, recover previous chats, and explore procedures.
            </p>
          </div>
          <Link href="/chat">
            <Button className="flex items-center gap-1.5 h-10.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Ask AI Assistant</span>
            </Button>
          </Link>
        </div>

        {/* Global Autocomplete Instant Search Bar */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-3 rounded-2xl shadow-xs flex justify-center w-full">
          <InstantSearch />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200/60 dark:border-slate-800/60 p-4.5 bg-white dark:bg-slate-950 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bookmarks Saved</span>
              <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">{data?.stats?.bookmarkCount || 0}</span>
            </div>
          </Card>

          <Card className="border-slate-200/60 dark:border-slate-800/60 p-4.5 bg-white dark:bg-slate-950 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-teal-100/60 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400 flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Conversations</span>
              <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">{data?.stats?.chatSessionCount || 0}</span>
            </div>
          </Card>

          <Card className="border-slate-200/60 dark:border-slate-800/60 p-4.5 bg-white dark:bg-slate-950 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-100/60 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Prompts Submitted</span>
              <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">{data?.stats?.chatMessageCount || 0}</span>
            </div>
          </Card>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quick Directory Shortcuts</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'NADRA', slug: 'nadra', count: '2 guides' },
              { name: 'Passport MRP', slug: 'passport', count: '1 guide' },
              { name: 'Driving License', slug: 'driving-license', count: '1 guide' },
              { name: 'Tax & FBR', slug: 'tax-fbr', count: '5 guides' },
              { name: 'Utility Services', slug: 'utilities', count: '5 guides' }
            ].map((cat) => (
              <Link href={`/services?category=${cat.slug}`} key={cat.slug} className="group">
                <Card className="hover:border-emerald-500/40 hover:-translate-y-0.5 text-center p-4 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-2xl h-full flex flex-col justify-center transition-all shadow-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{cat.count}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Center Grid Column (Saved Services & Recently Viewed) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bookmarked Services */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="h-4.5 w-4.5 text-emerald-700" />
                  <span>Saved Guidelines</span>
                </h2>
                <Link href="/services" className="text-xs font-bold text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center transition-colors">
                  <span>Browse Directory</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              {(!data?.bookmarks || data.bookmarks.length === 0) ? (
                <Card className="border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-950">
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
                    <BookOpen className="h-8 w-8 text-slate-300 mb-1" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No saved guidelines yet</p>
                    <p className="text-[10px] max-w-xs leading-normal">
                      Bookmark official guidelines while browsing directories to save them here for quick access.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.bookmarks.map((b) => (
                    <Link href={`/services/${b.service.slug}`} key={b.id} className="group">
                      <Card className="hover:border-emerald-500/40 hover:-translate-y-0.5 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 h-full flex flex-col justify-between transition-all shadow-xs">
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            {b.service.category}
                          </span>
                          <h3 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {b.service.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                            {b.service.summary}
                          </p>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-900/60 mt-3 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                          <span>{b.service.processingTime}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{b.service.baseFee}</span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recently Viewed Services */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-emerald-700" />
                <span>Recently Viewed</span>
              </h2>

              {recentlyViewed.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-[11px] text-slate-400">
                  You haven&apos;t visited any procedures details recently.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentlyViewed.map((s, idx) => (
                    <Link href={`/services/${s.slug}`} key={idx} className="block group">
                      <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-xl transition-all shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <FileCheck2 className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {s.title}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                              Category: {s.category}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar Column (Announcements & Recent Chats) */}
          <div className="space-y-8">
            
            {/* Announcements */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-emerald-700" />
                <span>System Updates</span>
              </h2>

              <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-xs space-y-4">
                <div className="flex gap-3 items-start text-xs border-b border-slate-100 dark:border-slate-900 pb-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">FBR ATL Sync Successful</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Active Taxpayer List structures updated for the latest fiscal year. Lower withholding rates active.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">Employment Guides Added</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Completed guides for PPSC registration and FPSC CSS exam dates have been seeded in directories.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Conversation Recovery */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-700" />
                <span>Recent Chats</span>
              </h2>

              {(!data?.sessions || data.sessions.length === 0) ? (
                <div className="p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-[11px] text-slate-400">
                  No active conversations. Open the AI Assistant to ask.
                </div>
              ) : (
                <div className="space-y-2">
                  {data.sessions.map((sess) => (
                    <Link href={`/chat?session=${sess.id}`} key={sess.id} className="block group">
                      <div className="p-3.5 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-xl transition-all flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5 truncate">
                          <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {sess.title}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 ml-2" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  )
}
