import { getServices, GovServiceDetail } from '@/services/services-db'

export async function buildRAGContext(userPrompt: string): Promise<{ contextText: string; matchedServices: GovServiceDetail[] }> {
  // Extract keywords
  const queryWords = userPrompt.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
  const keywords = queryWords.filter(w => 
    w.length > 3 && 
    !['what', 'where', 'how', 'when', 'apply', 'fee', 'fees', 'renew', 'renewal', 'pakistan', 'government', 'documents'].includes(w)
  )

  let matchingServices: GovServiceDetail[] = []
  
  // Look up matching records
  for (const kw of keywords.slice(0, 3)) {
    const matched = await getServices(undefined, kw)
    if (matched.length > 0) {
      matchingServices = [...matchingServices, ...matched]
    }
  }

  // Deduplicate matches
  const uniqueServices = Array.from(new Map(matchingServices.map(s => [s.slug, s])).values())

  if (uniqueServices.length === 0) {
    return {
      contextText: "NO VERIFIED SERVICE RECORDS FOUND in the database matching this query. You must explicitly tell the user that you don't possess official verified details for this query in your local database.",
      matchedServices: []
    }
  }

  let contextText = "VERIFIED DATABASE SERVICE RECORDS LOADED:\n"
  uniqueServices.forEach((service) => {
    contextText += `\n---\nSERVICE: ${service.title}\n`
    contextText += `Category: ${service.category}\n`
    contextText += `Summary: ${service.summary}\n`
    contextText += `Eligibility: ${service.eligibility}\n`
    contextText += `Processing Time: ${service.processingTime}\n`
    contextText += `Base Fee: ${service.baseFee}\n`
    contextText += `Official Source: ${service.officialSourceUrl}\n`
    
    contextText += `Required Documents:\n`
    service.documents.forEach(d => {
      contextText += `- ${d.title} (Required: ${d.isRequired})${d.description ? ` - ${d.description}` : ''}\n`
    })
    
    contextText += `Fees Chart:\n`
    service.fees.forEach(f => {
      contextText += `- ${f.title}: ${f.amount}${f.notes ? ` (${f.notes})` : ''}\n`
    })
    
    contextText += `Procedure Steps:\n`
    service.steps.forEach(s => {
      contextText += `${s.stepNumber}. ${s.title}: ${s.description}${s.tip ? ` (Tip: ${s.tip})` : ''}\n`
    })
    contextText += `---\n`
  })

  return { contextText, matchedServices: uniqueServices }
}
