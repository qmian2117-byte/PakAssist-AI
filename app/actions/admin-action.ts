'use server'

import prisma from '@/db/prisma'
import { createClient } from '@/services/supabase/server'
import { isUserAdmin } from '@/lib/auth/admin-check'
export interface AnnouncementItem {
  id: string
  title: string
  content: string
  createdAt: string
}

export interface AdminAnalytics {
  totalServices: number
  totalCategories: number
  totalUsers: number
  totalQueries: number
  feedbacks: {
    id: string
    category: string | null
    rating: number
    comment: string | null
    createdAt: Date
    userEmail: string | null
  }[]
  announcements: {
    id: string
    title: string
    content: string
    createdAt: string
  }[]
  healthChecks: {
    serviceId: string
    serviceTitle: string
    category: string
    issues: string[]
    status: 'HEALTHY' | 'WARNING'
  }[]
}

export async function getAdminData(): Promise<AdminAnalytics | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) return null

    // Execute all admin queries in parallel for maximum speed
    const [
      totalServices,
      totalCategories,
      totalUsers,
      totalQueries,
      dbFeedbacks,
      dbServices,
      dbAnnouncements
    ] = await Promise.all([
      prisma.govService.count(),
      prisma.serviceCategory.count(),
      prisma.userProfile.count(),
      prisma.chatMessage.count({ where: { sender: 'USER' } }),
      prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } }
      }),
      prisma.govService.findMany({
        include: {
          category: true,
          documents: true,
          steps: true,
          faqs: true
        }
      }),
      prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ])

    const feedbacks = dbFeedbacks.map(f => ({
      id: f.id,
      category: f.category,
      rating: f.rating,
      comment: f.comment,
      createdAt: f.createdAt,
      userEmail: f.user?.email || 'Anonymous'
    }))

    const announcements = dbAnnouncements.map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      createdAt: a.createdAt.toISOString()
    }))

    const healthChecks = dbServices.map(svc => {
      const issues: string[] = []
      
      if (svc.documents.length === 0) {
        issues.push("Missing required documents list")
      }
      if (svc.steps.length === 0) {
        issues.push("Missing step-by-step procedures")
      }
      if (svc.faqs.length === 0) {
        issues.push("Missing FAQs items")
      }
      if (!svc.officialSourceUrl) {
        issues.push("Missing official source URL link")
      } else if (!svc.officialSourceUrl.startsWith('https://')) {
        issues.push("Official source URL is not using secure protocol HTTPS")
      }

      return {
        serviceId: svc.id,
        serviceTitle: svc.title,
        category: svc.category.name,
        issues,
        status: (issues.length > 0 ? 'WARNING' : 'HEALTHY') as 'HEALTHY' | 'WARNING'
      }
    })

    return {
      totalServices,
      totalCategories,
      totalUsers,
      totalQueries,
      feedbacks,
      announcements,
      healthChecks
    }
  } catch (error) {
    console.error("Error loading admin data:", error)
    return null
  }
}

export async function deleteFeedback(feedbackId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) throw new Error("Access denied")

    await prisma.feedback.delete({
      where: { id: feedbackId }
    })
    return { success: true }
  } catch (err) {
    console.error("Error deleting feedback:", err)
    return { success: false, error: String(err) }
  }
}

export async function submitFeedback(category: string, rating: number, comment: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    // User profile link (optional, anonymous feedback is allowed if not logged in)
    
    await prisma.feedback.create({
      data: {
        userId: user?.id || null,
        category,
        rating,
        comment
      }
    })
    return { success: true }
  } catch (err) {
    console.error("Error submitting feedback:", err)
    return { success: false, error: String(err) }
  }
}

export async function createAnnouncement(title: string, content: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) throw new Error("Access denied")

    await prisma.announcement.create({
      data: {
        title,
        content
      }
    })
    
    return { success: true }
  } catch (err) {
    console.error("Error creating announcement:", err)
    return { success: false, error: String(err) }
  }
}

export async function deleteAnnouncement(announcementId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) throw new Error("Access denied")

    await prisma.announcement.delete({
      where: { id: announcementId }
    })
    
    return { success: true }
  } catch (err) {
    console.error("Error deleting announcement:", err)
    return { success: false, error: String(err) }
  }
}

export async function deleteService(serviceId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) throw new Error("Access denied")

    await prisma.govService.delete({
      where: { id: serviceId }
    })
    return { success: true }
  } catch (err) {
    console.error("Error deleting service:", err)
    return { success: false, error: String(err) }
  }
}

export async function createService(data: {
  title: string
  slug: string
  categorySlug: string
  summary: string
  officialSourceUrl?: string
  processingTime?: string
  baseFee?: number
  difficulty?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) throw new Error("Access denied")

    let category = await prisma.serviceCategory.findUnique({
      where: { slug: data.categorySlug }
    })

    if (!category) {
      const catName = data.categorySlug.charAt(0).toUpperCase() + data.categorySlug.slice(1).replace('-', ' ')
      category = await prisma.serviceCategory.create({
        data: {
          name: catName,
          slug: data.categorySlug
        }
      })
    }

    const service = await prisma.govService.create({
      data: {
        title: data.title,
        slug: data.slug,
        categoryId: category.id,
        summary: data.summary,
        officialSourceUrl: data.officialSourceUrl || '',
        processingTime: data.processingTime || 'N/A',
        baseFee: data.baseFee || 0,
        difficulty: data.difficulty || 'Medium',
        isPublished: true
      }
    })

    return { success: true, serviceId: service.id }
  } catch (err) {
    console.error("Error creating service:", err)
    return { success: false, error: String(err) }
  }
}

export async function updateService(serviceId: string, data: {
  title?: string
  summary?: string
  officialSourceUrl?: string
  processingTime?: string
  baseFee?: number
  difficulty?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) throw new Error("Access denied")

    await prisma.govService.update({
      where: { id: serviceId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.summary ? { summary: data.summary } : {}),
        ...(data.officialSourceUrl !== undefined ? { officialSourceUrl: data.officialSourceUrl } : {}),
        ...(data.processingTime ? { processingTime: data.processingTime } : {}),
        ...(data.baseFee !== undefined ? { baseFee: data.baseFee } : {}),
        ...(data.difficulty ? { difficulty: data.difficulty } : {})
      }
    })

    return { success: true }
  } catch (err) {
    console.error("Error updating service:", err)
    return { success: false, error: String(err) }
  }
}

export async function getAllUsers() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) return []

    const users = await prisma.userProfile.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    })

    return users.map(u => ({
      ...u,
      createdAt: u.createdAt.toISOString()
    }))
  } catch (err) {
    console.error("Error fetching users:", err)
    return []
  }
}

export async function deleteUser(profileId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isUserAdmin(user)) throw new Error("Access denied")

    await prisma.userProfile.delete({
      where: { id: profileId }
    })
    return { success: true }
  } catch (err) {
    console.error("Error deleting user:", err)
    return { success: false, error: String(err) }
  }
}
