'use client'

import React, { useState } from 'react'
import { Check, ClipboardList, CreditCard, HelpCircle, CheckCircle2 } from 'lucide-react'

interface GovServiceDetail {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  processingTime: string
  baseFee: string
  officialSourceUrl: string
  eligibility: string
  documents: { title: string; isRequired: boolean; description?: string }[]
  fees: { title: string; amount: string; notes?: string }[]
  steps: { stepNumber: number; title: string; description: string; tip?: string }[]
  faqs: { question: string; answer: string }[]
}

export function InteractiveGuide({ service }: { service: GovServiceDetail }) {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({})
  const [selectedFeeIndex, setSelectedFeeIndex] = useState<number>(0)

  const toggleDoc = (title: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const requiredDocs = service.documents.filter(d => d.isRequired)
  const checkedRequiredCount = requiredDocs.filter(d => checkedDocs[d.title]).length
  const totalRequiredCount = requiredDocs.length
  
  const completionPercentage = totalRequiredCount > 0 
    ? Math.round((checkedRequiredCount / totalRequiredCount) * 100) 
    : 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Requirements & Fees */}
      <div className="lg:col-span-7 space-y-6">
        {/* Document Preparedness Checklist */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Document Preparation Checklist
            </h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-mono font-bold">
              {completionPercentage}% Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Cross off the documents you have ready. We only calculate required items for preparation status.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-muted h-2 rounded-full mb-6 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="space-y-3">
            {service.documents.map((doc, idx) => {
              const isChecked = !!checkedDocs[doc.title]
              return (
                <div 
                  key={idx}
                  onClick={() => toggleDoc(doc.title)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                    isChecked 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-background border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className={`mt-0.5 h-4.5 w-4.5 rounded border flex items-center justify-center transition-all shrink-0 ${
                    isChecked 
                      ? 'bg-emerald-500 border-transparent text-white' 
                      : 'border-input bg-card'
                  }`}>
                    {isChecked && <Check className="h-3 w-3" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <span className={isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}>
                        {doc.title}
                      </span>
                      {doc.isRequired ? (
                        <span className="text-[9px] bg-red-400/10 text-red-600 px-1.5 py-0.2 rounded font-mono font-semibold uppercase">Required</span>
                      ) : (
                        <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.2 rounded font-mono font-semibold uppercase">Optional</span>
                      )}
                    </div>
                    {doc.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step by Step Vertical Stepper */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Step-by-step Procedure
          </h3>

          <div className="relative border-l border-border pl-6 ml-3 space-y-8">
            {service.steps.map((step) => (
              <div key={step.stepNumber} className="relative">
                {/* Stepper bubble */}
                <div className="absolute -left-[35px] top-0 h-6.5 w-6.5 rounded-full bg-primary text-primary-foreground border-4 border-background flex items-center justify-center font-mono font-bold text-xs">
                  {step.stepNumber}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{step.description}</p>
                  {step.tip && (
                    <div className="mt-2.5 rounded bg-muted/65 p-2.5 text-xs text-muted-foreground border-l-2 border-primary">
                      <span className="font-semibold text-foreground">Pro Tip: </span>
                      {step.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Fee Calculator & Official Sources */}
      <div className="lg:col-span-5 space-y-6">
        {/* Dynamic Fee Calculator */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Fee & Processing Options
          </h3>

          <p className="text-xs text-muted-foreground mb-4">
            Select your preferred speed and validity option to calculate total cost:
          </p>

          <div className="space-y-2">
            {service.fees.map((fee, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFeeIndex(idx)}
                className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer select-none transition-all ${
                  selectedFeeIndex === idx 
                    ? 'bg-primary/5 border-primary/30 font-medium' 
                    : 'bg-background border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="text-xs">
                  <div className="font-medium text-foreground">{fee.title}</div>
                  {fee.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{fee.notes}</p>}
                </div>
                <div className="text-sm font-bold text-primary shrink-0">{fee.amount}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-4 flex justify-between items-center bg-muted/20 -mx-6 -mb-6 p-6 rounded-b-xl">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Fees Due</span>
            <span className="text-lg font-bold text-foreground">{service.fees[selectedFeeIndex]?.amount}</span>
          </div>
        </div>

        {/* FAQs list */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Service Specific FAQs
            </h3>
            <div className="space-y-4">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="text-xs border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
                  <div className="font-semibold text-foreground">{faq.question}</div>
                  <div className="text-muted-foreground mt-1 leading-relaxed">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
