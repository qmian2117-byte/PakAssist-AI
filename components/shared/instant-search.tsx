'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Clock, TrendingUp, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchSuggestion {
  title: string
  slug: string
  category: string
}

// Predefined search database list for autocomplete suggestions
const searchDatabase: SearchSuggestion[] = [
  { title: "New CNIC Registration", slug: "new-cnic", category: "nadra" },
  { title: "CNIC Renewal Guide", slug: "cnic-renewal", category: "nadra" },
  { title: "Passport Renewal Procedure", slug: "passport-renewal", category: "passport" },
  { title: "Learner Driving Permit", slug: "learner-permit", category: "driving-license" },
  { title: "HEC PhD Scholarship", slug: "indigenous-phd", category: "scholarships" },
  { title: "SECP Company Incorporation", slug: "company-incorporation", category: "business-registration" },
  { title: "NTN Registration Online", slug: "ntn-registration", category: "tax-fbr" },
  { title: "Sales Tax Registration", slug: "sales-tax-registration", category: "tax-fbr" },
  { title: "Tax Return Filing Guide", slug: "tax-return", category: "tax-fbr" },
  { title: "Active Taxpayer ATL Status", slug: "atl-status", category: "tax-fbr" },
  { title: "Income Tax Certificate", slug: "income-tax-certificate", category: "tax-fbr" },
  { title: "Electricity Complaint Registry", slug: "electricity-complaint", category: "utilities" },
  { title: "Gas Leakage Complaint", slug: "gas-complaint", category: "utilities" },
  { title: "Water Supply Shortage", slug: "water-complaint", category: "utilities" },
  { title: "New Utility Connection Application", slug: "new-utility-connection", category: "utilities" },
  { title: "Utility Bill Correction Guide", slug: "bill-correction", category: "utilities" },
  { title: "First Information Report (FIR)", slug: "fir-guide", category: "police-legal" },
  { title: "Police Complaint Registry", slug: "police-complaint", category: "police-legal" },
  { title: "Police Character Certificate", slug: "character-certificate", category: "police-legal" },
  { title: "E-Stamp Paper Issuance", slug: "estamp-guide", category: "police-legal" },
  { title: "Civil Court Procedure Guide", slug: "court-procedure", category: "police-legal" },
  { title: "Sehat Sahulat Program Card", slug: "sehat-card", category: "healthcare" },
  { title: "Vaccination Registry & Certificate", slug: "vaccination-guide", category: "healthcare" },
  { title: "Government Hospitals Locator", slug: "government-hospitals", category: "healthcare" },
  { title: "Health Card Information", slug: "health-card-info", category: "healthcare" },
  { title: "Medical Fitness Certificate MS", slug: "medical-certificate", category: "healthcare" },
  { title: "Government Job Application Guide", slug: "government-job-guide", category: "employment" },
  { title: "PPSC Online Registration Guide", slug: "ppsc-guide", category: "employment" },
  { title: "FPSC CSS Online Application", slug: "fpsc-guide", category: "employment" },
  { title: "Resume Writing Assistant NJP", slug: "resume-assistant", category: "employment" },
  { title: "Public Sector Interview Preparation", slug: "interview-prep", category: "employment" }
]

const trendingSearches = [
  "Passport Fees",
  "Urgent CNIC",
  "NTN Registration",
  "ATL Status Check",
  "PPSC Challan"
]

function InstantSearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent_searches')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Derived suggestions from live query
  const suggestions = query.trim()
    ? searchDatabase.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Submit search query
  const performSearch = (searchQuery: string) => {
    const q = searchQuery.trim()
    setQuery(q)
    setIsOpen(false)
    
    // Save to recents
    if (q) {
      const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
    }
    
    const category = searchParams.get('category') || ''
    const url = `/services?q=${encodeURIComponent(q)}${category ? `&category=${category}` : ''}`
    router.push(url)
  }

  const handleClear = () => {
    setQuery('')
    const category = searchParams.get('category') || ''
    router.push(category ? `/services?category=${category}` : '/services')
  }

  const handleClearRecent = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = recentSearches.filter(s => s !== val)
    setRecentSearches(updated)
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form 
        onSubmit={(e) => { e.preventDefault(); performSearch(query) }}
        className="relative flex items-center h-12 bg-white/80 dark:bg-slate-950/80 border border-emerald-500/20 rounded-2xl shadow-lg shadow-emerald-500/5 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 backdrop-blur-xl transition-all overflow-hidden"
      >
        <Search className="h-4.5 w-4.5 text-emerald-500 shrink-0 ml-4.5" />
        <Input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Passport renewals, NTN register, police certificate..."
          className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold h-full w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {query && (
          <button 
            type="button" 
            onClick={handleClear}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-full mr-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button 
          type="submit" 
          size="sm" 
          className="h-9 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-[11px] rounded-xl mr-1.5 px-4 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
        >
          Search
        </Button>
      </form>

      {/* Autocomplete Popup Dropdown */}
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 glass-card shadow-2xl rounded-2xl p-4.5 z-40 max-h-[400px] overflow-y-auto mt-1 border border-emerald-500/20">
          {/* Autocomplete matches */}
          {suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>Instant Matches</span>
              </h4>
              <div className="space-y-1">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => router.push(`/services/${item.slug}`)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900/60 flex items-center justify-between text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span>{item.title}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && !query && (
            <div className="mb-4">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Recent Searches</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => performSearch(s)}
                    className="text-[10px] bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border border-slate-200/40 dark:border-slate-800/60 transition-colors"
                  >
                    <span>{s}</span>
                    <X 
                      className="h-3 w-3 text-slate-400 hover:text-red-500 shrink-0" 
                      onClick={(e) => handleClearRecent(s, e)} 
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!query && (
            <div className="mb-3">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                <span>Trending Searches</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {trendingSearches.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => performSearch(t)}
                    className="text-[10px] bg-emerald-50/40 hover:bg-emerald-50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-emerald-100/20 dark:border-emerald-900/10 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No matches fallback */}
          {query && suggestions.length === 0 && (
            <div className="text-center py-6 text-slate-400 space-y-1">
              <p className="text-xs font-semibold">No direct results matching &quot;{query}&quot;</p>
              <p className="text-[10px]">Press Enter to perform keyword matching in services index.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function InstantSearch() {
  return (
    <React.Suspense fallback={
      <div className="relative w-full max-w-2xl">
        <div className="h-11 w-full bg-slate-100 dark:bg-slate-900/50 rounded-xl animate-pulse" />
      </div>
    }>
      <InstantSearchContent />
    </React.Suspense>
  )
}
