'use client'

import React, { useState } from 'react'
import { Sparkles, Database, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react'

interface SampleData {
  query: string
  category: string
  dbRecord: {
    title: string
    baseFee: string
    processingTime: string
    officialSource: string
    documents: string[]
    steps: string[]
  }
  aiResponse: {
    summary: string
    eligibility: string
    fees: string
    documents: string
    steps: string[]
  }
}


const samples: Record<string, SampleData> = {
  cnic: {
    query: "How to renew CNIC urgently?",
    category: "NADRA",
    dbRecord: {
      title: "Urgent CNIC Renewal",
      baseFee: "PKR 3,000",
      processingTime: "15 Working Days",
      officialSource: "NADRA Pakistan (id.nadra.gov.pk)",
      documents: [
        "Expired CNIC / CNIC Card number",
        "Copy of immediate relative's CNIC (for verification)"
      ],
      steps: [
        "Register on NADRA Pak-Identity portal",
        "Select CNIC renewal and upload photograph",
        "Provide biometric verification data",
        "Pay fee online and submit application"
      ]
    },
    aiResponse: {
      summary: "You can renew your CNIC urgently either online through the Pak-Identity portal or by visiting a NADRA Registration Center (NRC). The urgent processing delivers the card in 15 days.",
      eligibility: "Any citizen of Pakistan holding an expired or expiring CNIC card.",
      fees: "Urgent Fee: PKR 3,000 | Executive Fee: PKR 4,000 | Normal Fee: PKR 1,500.",
      documents: "1. Expired CNIC Card\n2. Copy of Father/Mother or Spouse CNIC (for verification details)\n3. Proof of address changes (if applicable).",
      steps: [
        "Create an account on the Pak-Identity Web portal.",
        "Choose 'Re-Print/Renewal of CNIC' and enter your existing card details.",
        "Upload a passport-sized photograph with a white background.",
        "Download the fingerprint form, place fingerprints, scan and upload it back.",
        "Pay the PKR 3,000 urgent fee via debit/credit card and submit."
      ]
    }
  },
  passport: {
    query: "What is the fee for a 10-year Passport?",
    category: "Passport",
    dbRecord: {
      title: "Machine Readable Passport Renewal (10 Years)",
      baseFee: "PKR 4,500 (Normal 36 pages)",
      processingTime: "21 Working Days (Normal)",
      officialSource: "Directorate General of Immigration & Passports (dgip.gov.pk)",
      documents: [
        "Original Expired Passport",
        "Original valid CNIC / NICOP"
      ],
      steps: [
        "Generate bank payment challan",
        "Visit local passport office / online portal",
        "Submit biometrics and address details",
        "Collect passport after processing window"
      ]
    },
    aiResponse: {
      summary: "Passports in Pakistan can be renewed with a 10-year validity period for citizens aged 15 and above. Fees vary based on the number of pages (36, 72, or 100) and delivery urgency.",
      eligibility: "Pakistani citizens aged 15 and above with a valid CNIC or NICOP.",
      fees: "36 Pages: Normal (PKR 4,500) | Urgent (PKR 7,500)\n72 Pages: Normal (PKR 8,250) | Urgent (PKR 13,500)\n100 Pages: Normal (PKR 9,000) | Urgent (PKR 18,000).",
      documents: "1. Original Expired Passport\n2. Original valid CNIC or NICOP\n3. Copy of Expired Passport page 1 & 2.",
      steps: [
        "Pay the renewal fee using the Asaan Koota app or Bank Challan.",
        "Log in to the Online Passport Renewal portal or visit the local executive center.",
        "Upload your scanned CNIC/NICOP and previous passport copies.",
        "Provide your current home address and select delivery branch/home delivery.",
        "Review details and submit for processing."
      ]
    }
  },
  secp: {
    query: "How to register a software company in Pakistan?",
    category: "Business Registration",
    dbRecord: {
      title: "Private Limited Company Incorporation",
      baseFee: "PKR 1,500 (Online portal fee)",
      processingTime: "3 to 5 Working Days",
      officialSource: "Securities and Exchange Commission of Pakistan (secp.gov.pk)",
      documents: [
        "CNIC copies of all directors (minimum 2)",
        "Proposed Company Name",
        "Registered Office Address"
      ],
      steps: [
        "Apply for name reservation on SECP eServices",
        "Draft Memorandum & Articles of Association",
        "Submit incorporation forms and pay filing fees",
        "Obtain Certificate of Incorporation"
      ]
    },
    aiResponse: {
      summary: "Software and IT companies in Pakistan are registered as Private Limited Companies or Single Member Companies through the SECP eServices portal. This provides tax exemptions on exports and official corporate status.",
      eligibility: "Minimum 2 directors for Private Limited; 1 director for Single Member Company (SMC). All directors must possess valid CNICs.",
      fees: "Name Reservation: PKR 200 | Incorporation filing: PKR 1,500 (for capital up to PKR 100,000). Total online setup cost is approximately PKR 2,500-3,500.",
      documents: "1. CNIC/NICOP copies of all proposed directors\n2. Proposed office address\n3. Object clause (defining IT software development scope).",
      steps: [
        "Log in to SECP eServices portal and apply for Name Reservation.",
        "Once approved, select 'Company Incorporation' and fill Form 1 (directors details, address).",
        "Submit the digital Memorandum of Association (MOA) detailing IT business activities.",
        "Pay registration fees online through credit card or banking channel.",
        "Download signed Certificate of Incorporation and NTN from SECP portal once approved."
      ]
    }
  }
}

export function AIDemo() {
  const [selectedKey, setSelectedKey] = useState<string>('cnic')
  const [step, setStep] = useState<'idle' | 'querying' | 'db_done' | 'generating' | 'done'>('idle')
  const [streamedText, setStreamedText] = useState<string>('')

  const active = samples[selectedKey]

  const handleSelectKey = (key: string) => {
    setSelectedKey(key)
    setStep('idle')
    setStreamedText('')
  }

  const runDemo = () => {
    setStep('querying')
    setStreamedText('')

    setTimeout(() => {
      setStep('db_done')
      setTimeout(() => {
        setStep('generating')
        const fullText = active.aiResponse.summary + "\n\n" + 
                       "**Eligibility:** " + active.aiResponse.eligibility + "\n\n" + 
                       "**Required Documents:** \n" + active.aiResponse.documents + "\n\n" + 
                       "**Required Fees:** \n" + active.aiResponse.fees + "\n\n" + 
                       "**Processing Time:** " + active.dbRecord.processingTime + "\n\n" + 
                       "**Step-by-step Procedure:** \n" + active.aiResponse.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n') + "\n\n" +
                       "**Official Source:** " + active.dbRecord.officialSource;
        
        let index = 0
        const interval = setInterval(() => {
          setStreamedText(prev => prev + fullText[index])
          index++
          if (index >= fullText.length - 1) {
            clearInterval(interval)
            setStep('done')
          }
        }, 8)
        return () => clearInterval(interval)
      }, 1500)
    }, 1500)
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-emerald-500/20 glass-card shadow-2xl overflow-hidden">
      <div className="border-b border-emerald-500/10 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xs font-black text-white tracking-wide">Interactive AI RAG Simulator</span>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
        {/* Left menu selection */}
        <div className="md:col-span-4 border-r border-emerald-500/10 p-6 bg-slate-950/40 flex flex-col gap-4">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Select Citizen Query</span>
          <div className="flex flex-col gap-2.5">
            {Object.entries(samples).map(([key, data]) => (
              <button
                key={key}
                onClick={() => handleSelectKey(key)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs transition-all duration-200 ${
                  selectedKey === key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold shadow-lg shadow-emerald-600/20 scale-[1.02]'
                    : 'bg-white/60 dark:bg-slate-900/60 border border-emerald-500/10 hover:border-emerald-500/30 text-slate-800 dark:text-slate-200 font-semibold'
                }`}
              >
                <div className="text-[10px] opacity-75 font-medium mb-0.5">{data.category}</div>
                <div className="truncate font-extrabold">{data.query}</div>
              </button>
            ))}
          </div>

          <button
            onClick={runDemo}
            disabled={step !== 'idle'}
            className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Start Simulator
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right visualization area */}
        <div className="md:col-span-8 p-6 flex flex-col gap-6 bg-background">
          {/* Query Bar */}
          <div className="flex gap-3 items-start border-b border-border/60 pb-4">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
              U
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-medium">Citizen Query</div>
              <div className="text-sm font-medium text-foreground">{active.query}</div>
            </div>
          </div>

          {/* Steps of simulated pipeline */}
          <div className="flex-1 flex flex-col gap-4">
            {step === 'idle' && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <HelpCircle className="h-10 w-10 text-muted-foreground/45 mb-2" />
                <p className="text-sm font-medium">Click &quot;Start Simulator&quot; to view the no-hallucination database RAG lookup.</p>
              </div>
            )}

            {/* Step 1: Database Search */}
            {(step === 'querying' || step === 'db_done' || step === 'generating' || step === 'done') && (
              <div className="rounded-xl border border-border bg-muted/20 p-4 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Database className={`h-4 w-4 ${step === 'querying' ? 'text-primary animate-bounce' : 'text-primary'}`} />
                    1. Step: Database Lookup & Context Extraction
                  </div>
                  {step === 'querying' ? (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded animate-pulse">Searching DB...</span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                      <CheckCircle className="h-3 w-3" /> Record Loaded
                    </span>
                  )}
                </div>

                {step !== 'querying' && (
                  <div className="grid grid-cols-2 gap-3 text-xs bg-card border border-border p-3 rounded-lg font-mono">
                    <div>
                      <span className="text-muted-foreground">Title:</span> <span className="text-foreground font-semibold">{active.dbRecord.title}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Base Fee:</span> <span className="text-primary font-semibold">{active.dbRecord.baseFee}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeframe:</span> <span className="text-foreground">{active.dbRecord.processingTime}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Source:</span> <span className="text-emerald-600 underline truncate">{active.dbRecord.officialSource}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Gemini Generation */}
            {(step === 'generating' || step === 'done') && (
              <div className="rounded-xl border border-border bg-primary/5 p-4 flex-1 flex flex-col transition-all duration-300">
                <div className="flex items-center justify-between mb-3 border-b border-primary/10 pb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    2. Step: AI Response Synthesized (Zero-Hallucination)
                  </div>
                  {step === 'generating' ? (
                    <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded animate-pulse">Streaming Response...</span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Complete
                    </span>
                  )}
                </div>
                <div className="text-xs text-foreground whitespace-pre-wrap font-mono flex-1 overflow-y-auto leading-relaxed max-h-[220px]">
                  {streamedText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
