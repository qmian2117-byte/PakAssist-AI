'use server'

import prisma from '@/db/prisma'
import { createClient } from '@/services/supabase/server'
import { syncUserProfile } from '@/lib/auth/admin-check'

export interface DashboardData {
  bookmarks: {
    id: string
    service: {
      id: string
      title: string
      slug: string
      summary: string
      difficulty: string
      processingTime: string
      baseFee: string | number
      category: string
    }
  }[]
  sessions: {
    id: string
    title: string
    updatedAt: Date
  }[]
  stats: {
    bookmarkCount: number
    chatSessionCount: number
    chatMessageCount: number
  }
}

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Ensure UserProfile exists with correct role sync
    const profile = await syncUserProfile(user)

    // Fetch all dashboard data concurrently
    const [dbBookmarks, sessions, chatSessionCount, chatMessageCount] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: profile.id },
        include: {
          service: {
            include: {
              category: true
            }
          }
        }
      }),
      prisma.chatSession.findMany({
        where: { userId: profile.id },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          updatedAt: true
        }
      }),
      prisma.chatSession.count({
        where: { userId: profile.id }
      }),
      prisma.chatMessage.count({
        where: {
          session: {
            userId: profile.id
          },
          sender: 'USER'
        }
      })
    ])

    const bookmarks = dbBookmarks.map(b => ({
      id: b.id,
      service: {
        id: b.service.id,
        title: b.service.title,
        slug: b.service.slug,
        summary: b.service.summary,
        difficulty: b.service.difficulty,
        processingTime: b.service.processingTime || '',
        baseFee: String(b.service.baseFee),
        category: b.service.category.name
      }
    }))

    return {
      bookmarks,
      sessions,
      stats: {
        bookmarkCount: dbBookmarks.length,
        chatSessionCount,
        chatMessageCount
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return null
  }
}
