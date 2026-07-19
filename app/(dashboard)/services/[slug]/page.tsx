import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServiceBySlug } from '@/services/services-db'
import { InteractiveGuide } from '@/components/services/interactive-guide'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, ExternalLink, Award, Sparkles } from 'lucide-react'
import { BookmarkButton } from '@/components/services/bookmark-button'

import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'Service Not Found — PakAssist AI',
      description: 'Government service procedures and document checklists in Pakistan.'
    }
  }

  return {
    title: `${service.title} (${service.category.toUpperCase()}) — PakAssist AI`,
    description: service.summary,
    openGraph: {
      title: `${service.title} — Verified Guidelines`,
      description: service.summary,
      type: 'article',
    }
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-10 max-w-5xl space-y-8">
        {/* Back Link */}
        <Link href="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to directory
        </Link>

        {/* Header Block */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                {service.category}
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase font-mono text-emerald-600 border-emerald-500/20 bg-emerald-500/5">
                Verified Guidelines
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{service.title}</h1>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{service.summary}</p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            {service.officialSourceUrl && (
              <a 
                href={service.officialSourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full md:w-auto"
              >
                <Button variant="outline" size="sm" className="w-full justify-center flex items-center gap-1.5 h-8.5 rounded-lg font-bold text-xs">
                  Official Portal
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}
            <BookmarkButton serviceId={service.id} />
            <Link href="/chat" className="w-full md:w-auto">
              <Button size="sm" className="w-full justify-center flex items-center gap-1.5 h-8.5 rounded-lg font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white border-transparent shadow-xs">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Processing Window</div>
              <div className="text-sm font-semibold text-foreground">{service.processingTime}</div>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
            <Award className="h-5 w-5 text-primary shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Base Fee</div>
              <div className="text-sm font-semibold text-foreground">{service.baseFee}</div>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
            <ExternalLink className="h-5 w-5 text-primary shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Official Portal</div>
              <div className="text-sm font-semibold text-primary truncate max-w-[200px]">
                {service.officialSourceUrl ? new URL(service.officialSourceUrl).hostname : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Guide: Checklist and Fees calculator */}
        <InteractiveGuide service={service} />
      </main>

      <Footer />
    </div>
  )
}
export async function generateStaticParams() {
  // Allow static rendering of detail pages for standard slugs
  return [
    { slug: 'new-cnic' },
    { slug: 'cnic-renewal' },
    { slug: 'passport-renewal' },
    { slug: 'learner-permit' },
    { slug: 'indigenous-phd' },
    { slug: 'company-incorporation' }
  ]
}
