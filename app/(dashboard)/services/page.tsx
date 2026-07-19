import React from 'react'
import Link from 'next/link'
import { getServices } from '@/services/services-db'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { EmptyState } from '@/components/shared/empty-state'
import { Clock, Award } from 'lucide-react'
import InstantSearch from '@/components/shared/instant-search'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services Directory — PakAssist AI',
  description: 'Step-by-step guides, required document checklists, and processing fees for NADRA, Passports, Driving Licenses, SECP, and FBR tax services.',
}

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const { q = '', category = '' } = await searchParams
  const services = await getServices(category, q)

  const categoriesList = [
    { name: 'All Services', slug: '' },
    { name: 'NADRA', slug: 'nadra' },
    { name: 'Passports', slug: 'passport' },
    { name: 'Driving License', slug: 'driving-license' },
    { name: 'Scholarships', slug: 'scholarships' },
    { name: 'Business Setup', slug: 'business-registration' },
    { name: 'Tax & FBR', slug: 'tax-fbr' },
    { name: 'Utility Services', slug: 'utilities' },
    { name: 'Police & Legal', slug: 'police-legal' },
    { name: 'Healthcare', slug: 'healthcare' },
    { name: 'Employment', slug: 'employment' }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-10 max-w-5xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Services Directory</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Access step-by-step guides, required documents, and processing fees verified against official Pakistani portals.
            </p>
          </div>
          <div className="shrink-0">
            <InstantSearch />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-4">
          {categoriesList.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug ? `/services?category=${cat.slug}${q ? `&q=${q}` : ''}` : `/services${q ? `?q=${q}` : ''}`}
            >
              <Badge
                variant={
                  (category.toLowerCase() === cat.slug.toLowerCase()) || (cat.slug === '' && !category)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer text-xs px-3 py-1 font-medium transition-colors"
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Search status header */}
        {(q || category) && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Showing results for:</span>
            {category && (
              <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                Category: {category}
              </Badge>
            )}
            {q && (
              <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                Keyword: &quot;{q}&quot;
              </Badge>
            )}
            <Link href="/services" className="text-primary hover:underline ml-auto font-medium">
              Clear Filters
            </Link>
          </div>
        )}

        {/* Services Listings */}
        {services.length === 0 ? (
          <EmptyState
            title="No Services Found"
            description={`We couldn't find any official guidelines matching "${q || category}". Please refine your query or search inside our AI assistant.`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link href={`/services/${service.slug}`} key={service.id} className="group">
                <Card className="hover:border-primary/40 hover:-translate-y-0.5 h-full flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                        {service.category}
                      </Badge>
                      <Badge
                        variant={
                          service.difficulty === 'Easy' 
                            ? 'success' 
                            : service.difficulty === 'Medium' 
                            ? 'secondary' 
                            : 'destructive'
                        }
                        className="text-[9px] uppercase tracking-wider"
                      >
                        {service.difficulty} Mode
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2 mt-2 leading-relaxed">
                      {service.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="border-t border-border/40 pt-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/5 rounded-b-xl">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{service.processingTime.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      <span>{service.baseFee}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
