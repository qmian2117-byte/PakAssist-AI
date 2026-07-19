'use server'

import prisma from '@/db/prisma'
import { createClient } from '@/services/supabase/server'
import { revalidatePath } from 'next/cache'
import { syncUserProfile } from '@/lib/auth/admin-check'

export async function toggleBookmark(serviceId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Ensure UserProfile exists with correct role sync
    const profile = await syncUserProfile(user)

    // Check if bookmark exists
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_serviceId: {
          userId: profile.id,
          serviceId
        }
      }
    })

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id }
      })
      revalidatePath(`/services`)
      return { bookmarked: false }
    } else {
      await prisma.bookmark.create({
        data: {
          userId: profile.id,
          serviceId
        }
      })
      revalidatePath(`/services`)
      return { bookmarked: true }
    }
  } catch (error) {
    console.error("Bookmark Action Error:", error)
    return { error: String(error) }
  }
}

export async function getBookmarkStatus(serviceId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Fetch the UserProfile by supabaseId
    const profile = await prisma.userProfile.findUnique({
      where: { supabaseId: user.id }
    })
    if (!profile) return false

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_serviceId: {
          userId: profile.id,
          serviceId
        }
      }
    })
    return !!existing
  } catch {
    return false
  }
}
