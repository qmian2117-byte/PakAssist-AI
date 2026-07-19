import { User } from '@supabase/supabase-js'
import prisma from '@/db/prisma'

export function isUserAdmin(user: User | { email?: string; user_metadata?: { role?: string } } | null): boolean {
  if (!user || !user.email) return false
  const userEmail = user.email.toLowerCase().trim()
  const configuredAdmin = (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@pakassist.ai').toLowerCase().trim()
  
  // Grant admin access strictly if email matches configured ADMIN_EMAIL or user has ADMIN role metadata
  if (userEmail === configuredAdmin) return true
  if (user.user_metadata?.role === 'ADMIN') return true
  
  return false
}

export async function syncUserProfile(user: User) {
  const isAdmin = isUserAdmin(user)
  const role = isAdmin ? 'ADMIN' : 'USER'

  return await prisma.userProfile.upsert({
    where: { supabaseId: user.id },
    update: { 
      email: user.email || '',
      role
    },
    create: {
      supabaseId: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || (isAdmin ? 'Admin Officer' : 'Citizen'),
      role
    }
  })
}
