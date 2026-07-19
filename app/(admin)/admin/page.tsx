'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/services/supabase/client'
import { isUserAdmin } from '@/lib/auth/admin-check'
import { 
  getAdminData, 
  deleteFeedback, 
  createAnnouncement, 
  deleteAnnouncement, 
  deleteService,
  createService,
  updateService,
  getAllUsers,
  deleteUser,
  AdminAnalytics 
} from '@/app/actions/admin-action'
import { getServices, GovServiceDetail } from '@/services/services-db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Landmark, 
  ArrowLeft, 
  ShieldAlert, 
  Users, 
  Database, 
  Sparkles, 
  Trash2, 
  Edit3,
  Plus,
  CheckCircle, 
  AlertTriangle,
  Megaphone,
  UserX,
  X,
  Save
} from 'lucide-react'

interface AdminProfile {
  fullName: string
  email: string
  role: string
}

interface CitizenUser {
  id: string
  email: string
  fullName: string | null
  role: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [unauthorizedUserEmail, setUnauthorizedUserEmail] = useState<string | null>(null)
  
  // Data State
  const [data, setData] = useState<AdminAnalytics | null>(null)
  const [services, setServices] = useState<GovServiceDetail[]>([])
  const [usersList, setUsersList] = useState<CitizenUser[]>([])
  const [activeTab, setActiveTab] = useState<'services' | 'users' | 'health' | 'feedback' | 'announcements'>('services')
  
  // Create Service Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newCategorySlug, setNewCategorySlug] = useState('nadra')
  const [newSummary, setNewSummary] = useState('')
  const [newBaseFee, setNewBaseFee] = useState('')
  const [newProcessingTime, setNewProcessingTime] = useState('')
  const [newOfficialUrl, setNewOfficialUrl] = useState('')
  const [submittingService, setSubmittingService] = useState(false)

  // Edit Service State
  const [editingService, setEditingService] = useState<GovServiceDetail | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSummary, setEditSummary] = useState('')
  const [editBaseFee, setEditBaseFee] = useState('')
  const [editProcessingTime, setEditProcessingTime] = useState('')
  const [editOfficialUrl, setEditOfficialUrl] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)

  // Create Announcement State
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')
  const [submittingAnn, setSubmittingAnn] = useState(false)

  const loadAdminDashboard = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    if (!isUserAdmin(user)) {
      setUnauthorizedUserEmail(user.email || 'Unknown User')
      setLoading(false)
      return
    }

    setProfile({
      fullName: user.user_metadata?.full_name || 'Admin Officer',
      email: user.email || '',
      role: 'ADMIN'
    })

    const adminStats = await getAdminData()
    setData(adminStats)

    const listed = await getServices()
    setServices(listed)

    const citizens = await getAllUsers()
    setUsersList(citizens)

    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      if (!isUserAdmin(user)) {
        if (isMounted) {
          setUnauthorizedUserEmail(user.email || 'Unknown User')
          setLoading(false)
        }
        return
      }

      if (isMounted) {
        setProfile({
          fullName: user.user_metadata?.full_name || 'Admin Officer',
          email: user.email || '',
          role: 'ADMIN'
        })
      }

      const adminStats = await getAdminData()
      const listed = await getServices()
      const citizens = await getAllUsers()

      if (isMounted) {
        setData(adminStats)
        setServices(listed)
        setUsersList(citizens)
        setLoading(false)
      }
    }

    init()
    return () => { isMounted = false }
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Delete Service
  const handleDeleteService = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete government service "${title}"?`)) {
      const res = await deleteService(id)
      if (res.success) {
        loadAdminDashboard()
      } else {
        alert("Failed to delete service: " + res.error)
      }
    }
  }

  // Delete User / Citizen Data
  const handleDeleteUser = async (profileId: string, email: string) => {
    if (confirm(`Are you sure you want to remove citizen profile for "${email}"? This will delete all their bookmarks and saved sessions.`)) {
      const res = await deleteUser(profileId)
      if (res.success) {
        loadAdminDashboard()
      } else {
        alert("Failed to delete user profile: " + res.error)
      }
    }
  }

  // Create Service
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newSlug || !newSummary) return

    setSubmittingService(true)
    const res = await createService({
      title: newTitle,
      slug: newSlug.toLowerCase().replace(/\s+/g, '-'),
      categorySlug: newCategorySlug,
      summary: newSummary,
      baseFee: newBaseFee ? parseFloat(newBaseFee) : 0,
      processingTime: newProcessingTime || 'N/A',
      officialSourceUrl: newOfficialUrl
    })

    if (res.success) {
      setShowCreateModal(false)
      setNewTitle('')
      setNewSlug('')
      setNewSummary('')
      setNewBaseFee('')
      setNewProcessingTime('')
      setNewOfficialUrl('')
      loadAdminDashboard()
    } else {
      alert("Failed to create service: " + res.error)
    }
    setSubmittingService(false)
  }

  // Start Edit Service
  const startEditing = (service: GovServiceDetail) => {
    setEditingService(service)
    setEditTitle(service.title)
    setEditSummary(service.summary)
    setEditBaseFee(service.baseFee.replace(/[^0-9.]/g, ''))
    setEditProcessingTime(service.processingTime)
    setEditOfficialUrl(service.officialSourceUrl)
  }

  // Save Edit Service
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return

    setSubmittingEdit(true)
    const res = await updateService(editingService.id, {
      title: editTitle,
      summary: editSummary,
      baseFee: editBaseFee ? parseFloat(editBaseFee) : 0,
      processingTime: editProcessingTime,
      officialSourceUrl: editOfficialUrl
    })

    if (res.success) {
      setEditingService(null)
      loadAdminDashboard()
    } else {
      alert("Failed to update service: " + res.error)
    }
    setSubmittingEdit(false)
  }

  const handleDeleteFeedback = async (id: string) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      const res = await deleteFeedback(id)
      if (res.success) {
        loadAdminDashboard()
      }
    }
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!annTitle.trim() || !annContent.trim()) return

    setSubmittingAnn(true)
    const res = await createAnnouncement(annTitle, annContent)
    if (res.success) {
      setAnnTitle('')
      setAnnContent('')
      loadAdminDashboard()
    }
    setSubmittingAnn(false)
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      const res = await deleteAnnouncement(id)
      if (res.success) {
        loadAdminDashboard()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-950/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-11 w-11 border-2 border-emerald-700 border-t-transparent mx-auto" />
          <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">Authorizing Admin Console...</p>
        </div>
      </div>
    )
  }

  if (unauthorizedUserEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-12">
        <Card className="max-w-md w-full p-6 text-center space-y-5 border-red-500/20 bg-slate-950 text-white rounded-2xl shadow-xl">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <ShieldAlert className="h-7 w-7" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-white">Admin Access Restricted</h2>
            <p className="text-xs text-slate-400">
              You are currently logged in as <span className="font-semibold text-emerald-400">{unauthorizedUserEmail}</span>.
            </p>
          </div>

          <div className="p-3.5 bg-red-950/30 rounded-xl border border-red-900/40 text-[11px] text-red-300 text-left space-y-1">
            <p className="font-bold">Required Admin Email:</p>
            <p className="font-mono text-emerald-300">admin@pakassist.ai</p>
            <p className="text-[10px] text-slate-400 pt-1">
              (Any account starting with <code className="bg-slate-800 px-1 py-0.5 rounded text-white">admin@...</code> will also be granted full admin permissions).
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleSignOut} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10">
              Sign Out & Log In as Admin
            </Button>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full border-slate-700 text-slate-300 text-xs h-10">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      
      {/* Admin header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-16 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <span className="font-extrabold text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-500 dark:from-red-400 dark:to-red-300">
              PakAssist AI Admin Console
            </span>
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider bg-red-100/60 dark:bg-red-950/40 text-red-800 dark:text-red-400 px-3 py-1 rounded-full border border-red-200/40 dark:border-red-900/30">
          System Admin: {profile?.fullName}
        </div>
      </header>

      {/* Main panel container */}
      <main className="flex-1 container mx-auto px-6 py-8 max-w-6xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Admin Management System</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Create, edit, or delete government services, manage registered citizens, and publish system alerts.</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-9.5 px-4 rounded-xl shadow-sm shrink-0">
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Service
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 p-4.5 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Guidelines</span>
              <Database className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{data?.totalServices || services.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Verified procedures cached in DB</p>
          </Card>

          <Card className="bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 p-4.5 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</span>
              <Landmark className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{data?.totalCategories || 0}</div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Departments directories indexed</p>
          </Card>

          <Card className="bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 p-4.5 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citizens Profiles</span>
              <Users className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{usersList.length || data?.totalUsers || 0}</div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Active database profile records</p>
          </Card>

          <Card className="bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 p-4.5 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Queries</span>
              <Sparkles className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{data?.totalQueries || 0}</div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Assistant messages processed</p>
          </Card>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 pb-0.5">
          {[
            { key: 'services', label: 'Services CRUD' },
            { key: 'users', label: `Registered Citizens (${usersList.length})` },
            { key: 'health', label: 'KB Health Checks' },
            { key: 'feedback', label: 'Citizen Feedbacks' },
            { key: 'announcements', label: 'Announcements' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'services' | 'users' | 'health' | 'feedback' | 'announcements')}
              className={`text-xs font-bold pb-2 border-b-2 transition-all ${
                activeTab === tab.key 
                  ? 'border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Body content */}
        <div className="space-y-4">
          
          {/* TAB 1: Services Directory CRUD */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Services Management</h3>
              </div>
              
              <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 overflow-hidden rounded-2xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 font-bold">Service Name</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Category</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Base Fee</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Processing Window</th>
                        <th scope="col" className="px-6 py-3.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                            <div>{service.title}</div>
                            <div className="font-mono text-[9px] text-slate-400 font-normal">{service.slug}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                              {service.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-750 font-bold dark:text-slate-300">{service.baseFee}</td>
                          <td className="px-6 py-4">{service.processingTime}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => startEditing(service)}
                              className="text-slate-400 hover:text-emerald-600 p-1.5 transition-colors rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                              title="Edit Service"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id, service.title)}
                              className="text-slate-400 hover:text-red-500 p-1.5 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                              title="Delete Service"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: Registered Citizens / Users Management */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Registered Citizens Directory</h3>
              
              <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 overflow-hidden rounded-2xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 font-bold">Full Name</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Email Address</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Role</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Joined Date</th>
                        <th scope="col" className="px-6 py-3.5 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {usersList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-[11px] text-slate-400 font-semibold">No citizen accounts registered in database yet.</td>
                        </tr>
                      ) : (
                        usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{u.fullName || 'Citizen'}</td>
                            <td className="px-6 py-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                u.role === 'ADMIN' 
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50' 
                                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">
                              {u.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  className="text-slate-400 hover:text-red-500 p-1.5 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                                  title="Remove Citizen Data"
                                >
                                  <UserX className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: Knowledge Base Health Checks */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Database Integrity Diagnostics</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {data?.healthChecks.map((check, idx) => {
                  const isWarning = check.status === 'WARNING'
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                        isWarning 
                          ? 'border-amber-200 bg-amber-500/5 dark:border-amber-900/40 dark:bg-amber-950/10' 
                          : 'border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-950'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isWarning ? (
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-emerald-600 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white">{check.serviceTitle}</h4>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{check.category}</span>
                        </div>
                        {isWarning ? (
                          <ul className="list-disc pl-4 space-y-0.5 pt-1 text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                            {check.issues.map((issue, issueIdx) => (
                              <li key={issueIdx}>{issue}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">All fields (fees, documents, steps, FAQs, secure URLs) verified. KB status is healthy.</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Feedback Management */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Citizen Service Feedbacks</h3>
              
              <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 overflow-hidden rounded-2xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 font-bold">Category</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Rating</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Comment</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Citizen Email</th>
                        <th scope="col" className="px-6 py-3.5 font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {(!data?.feedbacks || data.feedbacks.length === 0) ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-[11px] text-slate-400 font-semibold">No feedback records submitted by citizens yet.</td>
                        </tr>
                      ) : (
                        data.feedbacks.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{f.category || 'General'}</td>
                            <td className="px-6 py-4 font-bold text-yellow-600">{f.rating} / 5</td>
                            <td className="px-6 py-4 max-w-sm truncate">{f.comment || 'N/A'}</td>
                            <td className="px-6 py-4">{f.userEmail}</td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => handleDeleteFeedback(f.id)}
                                className="text-slate-400 hover:text-red-500 p-1.5 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 5: Announcements Management */}
          {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Publish Announcement</h3>
                <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-xs">
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                      <Input
                        type="text"
                        placeholder="e.g., FBR active taxpayer list sync successful"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        required
                        className="h-9.5 text-xs rounded-lg dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Content Body</label>
                      <textarea
                        placeholder="Provide details about system-wide rules update..."
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        required
                        rows={4}
                        className="w-full text-xs rounded-lg dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-700/10"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={submittingAnn} 
                      className="w-full h-10 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      <Megaphone className="h-4 w-4 mr-1.5" />
                      <span>Publish Announcement</span>
                    </Button>
                  </form>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active System Alerts</h3>
                
                {(!data?.announcements || data.announcements.length === 0) ? (
                  <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-[11px] text-slate-450 font-semibold bg-white dark:bg-slate-950">
                    No active system announcements posted yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.announcements.map((ann) => (
                      <div 
                        key={ann.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/60 shadow-xs flex justify-between gap-4 items-start"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white">{ann.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{ann.content}</p>
                          <span className="text-[9px] text-slate-400 block pt-1.5">{new Date(ann.createdAt).toLocaleString()}</span>
                        </div>
                        
                        <button 
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL 1: Create New Service */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Create Government Service</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateService} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Title</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. New Electric Meter Connection" 
                    value={newTitle} 
                    onChange={e => {
                      setNewTitle(e.target.value)
                      if (!newSlug) setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                    }}
                    required 
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">URL Slug</label>
                    <Input 
                      type="text" 
                      placeholder="electric-meter" 
                      value={newSlug} 
                      onChange={e => setNewSlug(e.target.value)}
                      required 
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Slug</label>
                    <select
                      value={newCategorySlug}
                      onChange={e => setNewCategorySlug(e.target.value)}
                      className="w-full h-9 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-2 font-bold"
                    >
                      <option value="nadra">NADRA</option>
                      <option value="passport">Passport</option>
                      <option value="driving-license">Driving License</option>
                      <option value="hec">HEC Scholarships</option>
                      <option value="business">Business Registration</option>
                      <option value="utilities">Utilities & Complaints</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Summary</label>
                  <textarea 
                    placeholder="Brief description of application procedure..."
                    value={newSummary}
                    onChange={e => setNewSummary(e.target.value)}
                    required
                    rows={2}
                    className="w-full text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Fee (PKR)</label>
                    <Input 
                      type="number" 
                      placeholder="1500" 
                      value={newBaseFee} 
                      onChange={e => setNewBaseFee(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Processing Window</label>
                    <Input 
                      type="text" 
                      placeholder="7 to 10 Days" 
                      value={newProcessingTime} 
                      onChange={e => setNewProcessingTime(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official URL</label>
                  <Input 
                    type="url" 
                    placeholder="https://..." 
                    value={newOfficialUrl} 
                    onChange={e => setNewOfficialUrl(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button type="submit" disabled={submittingService} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-9">
                    {submittingService ? 'Creating...' : 'Create Service'}
                  </Button>
                  <Button type="button" onClick={() => setShowCreateModal(false)} variant="outline" className="text-xs h-9">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL 2: Edit Service */}
        {editingService && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Edit Service: {editingService.title}</h3>
                <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Title</label>
                  <Input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    required 
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Summary</label>
                  <textarea 
                    value={editSummary}
                    onChange={e => setEditSummary(e.target.value)}
                    required
                    rows={3}
                    className="w-full text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Fee Amount</label>
                    <Input 
                      type="number" 
                      value={editBaseFee} 
                      onChange={e => setEditBaseFee(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Processing Window</label>
                    <Input 
                      type="text" 
                      value={editProcessingTime} 
                      onChange={e => setEditProcessingTime(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official URL</label>
                  <Input 
                    type="url" 
                    value={editOfficialUrl} 
                    onChange={e => setEditOfficialUrl(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button type="submit" disabled={submittingEdit} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-9">
                    <Save className="h-4 w-4 mr-1.5" />
                    <span>{submittingEdit ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                  <Button type="button" onClick={() => setEditingService(null)} variant="outline" className="text-xs h-9">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

      </main>
    </div>
  )
}
