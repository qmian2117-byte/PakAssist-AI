'use client'

import React, { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleBookmark, getBookmarkStatus } from '@/app/actions/bookmark-action'

interface BookmarkButtonProps {
  serviceId: string
}

export function BookmarkButton({ serviceId }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      const status = await getBookmarkStatus(serviceId)
      setBookmarked(status)
      setLoading(false)
    }
    checkStatus()

    // Track recently viewed service
    const pathParts = window.location.pathname.split('/')
    const slug = pathParts[pathParts.length - 1]
    if (slug && window.location.pathname.includes('/services/')) {
      const title = document.querySelector('h1')?.innerText || 'Service Guideline'
      const categoryBadge = document.querySelector('.font-mono')?.textContent || 'Verified'
      
      const key = 'recently_viewed_services'
      const existingStr = localStorage.getItem(key)
      const existing = existingStr ? JSON.parse(existingStr) : []
      const updated = [
        { title, slug, category: categoryBadge },
        ...existing.filter((s: { slug: string }) => s.slug !== slug)
      ].slice(0, 5)
      localStorage.setItem(key, JSON.stringify(updated))
    }
  }, [serviceId])

  const handleToggle = async () => {
    setBookmarked(prev => !prev)
    const result = await toggleBookmark(serviceId)
    if (result.hasOwnProperty('error')) {
      // Revert if error
      setBookmarked(prev => !prev)
    }
  }

  if (loading) {
    return <div className="h-8.5 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
  }

  return (
    <Button
      variant={bookmarked ? "default" : "outline"}
      size="sm"
      aria-label={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
      onClick={handleToggle}
      className={`flex items-center gap-1.5 justify-center w-full md:w-auto h-8.5 rounded-lg font-bold text-xs ${
        bookmarked 
          ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-transparent' 
          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
      }`}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </Button>
  )
}
