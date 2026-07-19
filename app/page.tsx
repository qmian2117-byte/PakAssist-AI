'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import NeuralNetwork from '@/components/shared/neural-network'
import InstantSearch from '@/components/shared/instant-search'
import { AIDemo } from '@/features/landing/ai-demo'
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Landmark, 
  ClipboardList, 
  Car,
  Check,
  ChevronDown,
  ChevronUp,
  Target
} from 'lucide-react'

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const stats = [
    { value: "21+", label: "Official Procedures", desc: "NADRA, Passports, SECP, FBR, Utilities & more" },
    { value: "100%", label: "Accuracy Lock", desc: "No AI guessing. Grounded against verified entries" },
    { value: "0", label: "Hallucinations", desc: "Strict verification pipeline halts incorrect text" },
    { value: "24/7", label: "Availability", desc: "Instant citizen guidance in English and Urdu" }
  ]

  const features = [
    {
      title: "NADRA Services",
      desc: "CNIC registration, renew CNIC, FRC and NICOP document checklist and fee verification.",
      icon: Landmark,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      slug: "nadra"
    },
    {
      title: "Passports MRP",
      desc: "Detailed support for 5 vs 10 year passports, urgent/normal tracking, and collection offices.",
      icon: ClipboardList,
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      slug: "passport"
    },
    {
      title: "Driving License",
      desc: "Guidance on computerized licensing centers, required documents, and fee structures.",
      icon: Car,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      slug: "driving-license"
    },
    {
      title: "FBR & Tax Registry",
      desc: "NTN Registration, sales tax, active tax filer list status (ATL) checks, and tax return filing.",
      icon: Target,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
      slug: "tax-fbr"
    },
    {
      title: "Utility Services",
      desc: "Apply for a new gas/electricity meter, correct billing, or register supply complaints WASA.",
      icon: Sparkles,
      color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      slug: "utilities"
    },
    {
      title: "Police & Legal Matters",
      desc: "Step-by-step FIR filing procedures, police character clearance certificates, and court guides.",
      icon: ShieldCheck,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      slug: "police-legal"
    }
  ]

  const stepList = [
    { step: "01", title: "Search or Ask", desc: "Enter a procedure or ask our AI chatbot directly about documents, fees, or timeline." },
    { step: "02", title: "Database Match", desc: "Our RAG system pulls verified, structured government rules from our catalog." },
    { step: "03", title: "Actionable Checklist", desc: "Generate an interactive checkbox tracker to complete your offline application." }
  ]

  const testimonials = [
    {
      quote: "PakAssist AI saved me hours of going back and forth to the NADRA office. The document checklist was 100% accurate.",
      author: "M. Bilal Tariq",
      role: "Freelance Developer, Lahore"
    },
    {
      quote: "Checking my ATL status and understanding NTN registration was so simple. The chatbot guided me in Urdu instantly.",
      author: "Sobia Rehman",
      role: "E-commerce Merchant, Karachi"
    },
    {
      quote: "Highly recommend the Passport renewal roadmap. The fee breakdown for executive delivery was precisely what I paid.",
      author: "Major (R) Kamran",
      role: "Retired Public Officer, Rawalpindi"
    }
  ]

  const faqs = [
    {
      q: "Is PakAssist AI affiliated with the Government of Pakistan?",
      a: "No, PakAssist AI is an independent citizen assistance platform. We crawl, structure, verify, and catalog official guidelines from public domains for the benefit of citizens."
    },
    {
      q: "How does the Zero-Hallucination AI feature work?",
      a: "Our assistant uses a Retrieval-Augmented Generation (RAG) lock. When you ask a question, the system queries our verified database first. If the procedure or category is missing, the AI states it doesn't know rather than fabricating steps."
    },
    {
      q: "Are Urdu queries supported?",
      a: "Yes. The AI assistant automatically detects if you are chatting in Urdu and provides translated markdown content, fees, and steps in Urdu, maintaining all official citations."
    },
    {
      q: "Can I track my application status here?",
      a: "No, we do not host actual application forms. We provide the checklist, fee structure, and step-by-step procedural directory. You must use official agency sites (e.g. Iris FBR, NIMS NADRA) to submit forms, which are cited in our sources."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-emerald-950/25 via-background to-background border-b border-emerald-500/10">
        
        {/* Background ambient lighting orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 h-64 w-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Interactive Neural Network Particles */}
        <NeuralNetwork />

        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 backdrop-blur-md shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span>Pakistan&apos;s 1st Zero-Hallucination Citizen Portal</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white"
          >
            Understand Pakistan&apos;s Services with <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400">Absolute Trust</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-semibold"
          >
            Find up-to-date document checklists, exact fee charts, processing times, and step-by-step procedures for FBR NTN, Passports, NADRA CNIC, utility connections, and employment registration.
          </motion.p>

          {/* Centered Instant Autocomplete Search */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex justify-center w-full pt-4"
          >
            <InstantSearch />
          </motion.div>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link href="/chat">
              <Button size="lg" className="w-full sm:w-auto h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold px-7 shadow-xl shadow-emerald-600/25 rounded-2xl transition-all hover:scale-[1.02] flex items-center gap-2">
                <span>Start AI Chat Assistant</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 border-slate-300 bg-white hover:bg-slate-100 text-slate-900 font-black dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 px-7 rounded-2xl transition-all shadow-sm">
                Browse Services Directory
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Metrics / Statistics Cards */}
      <section className="py-16 bg-white/50 dark:bg-slate-950/50 border-b border-emerald-500/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-card hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xs">
                <span className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">{item.value}</span>
                <div className="mt-2 space-y-1">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{item.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-normal block">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Categories grid */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Supported Government Modules</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Browse structured procedures verified with active links to the official portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <Link href={`/services?category=${feat.slug}`} key={idx}>
                  <Card className="hover:border-emerald-500/40 hover:-translate-y-1 transition-all h-full bg-white dark:bg-slate-950 flex flex-col justify-between border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl">
                    <CardHeader className="p-0 space-y-3">
                      <div className={`h-11 w-11 rounded-xl ${feat.color} flex items-center justify-center shadow-xs`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">{feat.title}</CardTitle>
                        <CardDescription className="text-[11px] leading-relaxed text-slate-400">
                          {feat.desc}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 pt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 group">
                      <span>Explore Procedures</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* RAG Verification Policy Pipeline */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-3 py-1 rounded-full">
                Zero Hallucinations Engine
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">How We Secure Authenticity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Traditional AI chat engines make assumptions when requested about bureaucratic guidelines. PakAssist AI uses a strict multi-layer verification pipeline to lock down accuracy.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Database Verification Checks</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">The query matches keywords against a checked repository. If absent, the assistant states it has no data instead of fabricating answers.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Structured Prompt Anchoring</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Official fee tables, lists of copies, and addresses are packed into the AI system prompts, ensuring strict synthesis bounds.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Citations Verification</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Every generated guideline is accompanied by click badges directing to designated regulatory bodies.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated chat output preview */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono">response_pipeline.json</span>
              </div>
              
              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl space-y-2 text-[10px] font-mono text-slate-500">
                <p className="text-emerald-700 dark:text-emerald-400">&quot;status&quot;: &quot;RAG_LOCKED_ACCURATE&quot;</p>
                <p className="text-slate-800 dark:text-slate-200">&quot;confidenceScore&quot;: 100</p>
                <p className="text-slate-600 dark:text-slate-400">&quot;citations&quot;: [ {`{"title": "FBR Iris Portal", "url": "..."}`} ]</p>
                <p className="text-slate-600 dark:text-slate-400">&quot;steps&quot;: [ &quot;Fill Form 14(1)&quot;, &quot;Pay Challan Voucher&quot;, &quot;Obtain NTN&quot; ]</p>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold leading-normal">
                  All references linked with Supabase verified relational records.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive RAG Simulator Demo */}
      <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-6 max-w-5xl">
          <AIDemo />
        </div>
      </section>

      {/* How it Works / Step-by-Step */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">How PakAssist AI Simplifies Applications</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-semibold">
              Three simple steps to transition from confused applications to successfully completed documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stepList.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute top-0 right-0 text-7xl font-black text-slate-200/50 dark:text-slate-800/40 select-none group-hover:text-emerald-200/40 transition-colors z-0">
                  {item.step}
                </div>
                <div className="relative z-10 space-y-3 pt-6 pr-6">
                  <div className="h-9 w-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen Testimonials Section */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Citizen Testimonials</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-semibold">
              Read how everyday citizens and businesses save time using PakAssist AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 shadow-xs flex flex-col justify-between">
                <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  &quot;{test.quote}&quot;
                </p>
                <div className="mt-6 border-t border-slate-200/50 dark:border-slate-800/40 pt-4 flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-full bg-emerald-700/10 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800 dark:text-white">{test.author}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-semibold">
              Find answers to common questions about data updates, association, and privacy.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isSelected = activeFaq === idx
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isSelected ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-slate-800 dark:text-white transition-colors hover:bg-slate-50/50"
                  >
                    <span>{faq.q}</span>
                    {isSelected ? <ChevronUp className="h-4 w-4 text-emerald-600 shrink-0 ml-2" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-xs leading-relaxed text-slate-400 border-t border-slate-100 dark:border-slate-900/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Immersive CTA Footer Container */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 text-center relative overflow-hidden">
        
        {/* Subtle background glow effect */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-2xl relative z-10 space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Simplify Your Procedures Today</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold max-w-md mx-auto">
            Create a free account to gain full access to verified custom checklists, processing fee alerts, and our advanced AI assistant.
          </p>
          <div className="pt-2">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-7 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-700/10 transition-all">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
