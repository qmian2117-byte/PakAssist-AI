import type { Prisma } from '@prisma/client'

type DbGovService = Prisma.GovServiceGetPayload<{
  include: {
    category: true
    documents: true
    steps: true
    fees: true
    faqs: true
  }
}>

export interface GovServiceDetail {
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

export const staticServices: GovServiceDetail[] = [
  // 1. NADRA
  {
    id: "nadra-new-cnic",
    title: "New CNIC Registration",
    slug: "new-cnic",
    category: "nadra",
    summary: "Obtain a Computerized National Identity Card (CNIC) for Pakistani citizens aged 18 and above.",
    difficulty: "Medium",
    processingTime: "30 Days (Normal) | 15 Days (Urgent)",
    baseFee: "PKR 750 (Normal)",
    officialSourceUrl: "https://www.nadra.gov.pk",
    eligibility: "Pakistani citizen, minimum age of 18 years, who has not obtained a CNIC previously.",
    documents: [
      { title: "Matriculation Certificate or Birth Certificate", isRequired: true, description: "Proof of date of birth" },
      { title: "Copy of Father's or Mother's CNIC", isRequired: true },
      { title: "Original Child Registration Certificate (CRC/Bay Form)", isRequired: false }
    ],
    fees: [
      { title: "Normal CNIC (30 Days)", amount: "PKR 750" },
      { title: "Urgent CNIC (15 Days)", amount: "PKR 1,500" },
      { title: "Executive CNIC (7 Days)", amount: "PKR 2,500" }
    ],
    steps: [
      { stepNumber: 1, title: "Token Generation", description: "Visit the NADRA center and get a token for CNIC registration." },
      { stepNumber: 2, title: "Photo Capture", description: "A photographer at the counter will take your digital portrait." },
      { stepNumber: 3, title: "Biometric Data", description: "Provide scans of your left and right hand fingers." },
      { stepNumber: 4, title: "Data Verification", description: "Verify address details printed on the form and sign it." },
      { stepNumber: 5, title: "Collection", description: "Collect the printed card at the office after the designated processing time." }
    ],
    faqs: [
      { question: "Can I apply for my first CNIC online?", answer: "No. First-time CNIC applications require physical biometric verification at a NADRA Registration Center." },
      { question: "What is NICOP?", answer: "NICOP is the National Identity Card for Overseas Pakistanis, applicable for citizens residing abroad." }
    ]
  },
  {
    id: "nadra-renew-cnic",
    title: "CNIC Renewal",
    slug: "cnic-renewal",
    category: "nadra",
    summary: "Renew an expired or expiring Computerized National Identity Card (CNIC) online or in-person.",
    difficulty: "Easy",
    processingTime: "15 Days (Urgent) | 30 Days (Normal)",
    baseFee: "PKR 1,500 (Urgent)",
    officialSourceUrl: "https://id.nadra.gov.pk",
    eligibility: "Any citizen holding a CNIC that has expired or is within 6 months of expiration.",
    documents: [
      { title: "Existing Expired CNIC Card", isRequired: true },
      { title: "Relative CNIC Copy", isRequired: true, description: "Father/Mother/Spouse for verification matching" }
    ],
    fees: [
      { title: "Normal Renewal", amount: "PKR 750" },
      { title: "Urgent Renewal", amount: "PKR 1,500" },
      { title: "Executive Renewal", amount: "PKR 2,500" }
    ],
    steps: [
      { stepNumber: 1, title: "Online Registration", description: "Create an account on the Pak-Identity portal." },
      { stepNumber: 2, title: "Fill Details", description: "Enter card number, addresses, and relative verification codes." },
      { stepNumber: 3, title: "Upload Attachments", description: "Upload a passport photo with a white background and biometric forms." },
      { stepNumber: 4, title: "Fee Payment", description: "Pay online via credit/debit card." }
    ],
    faqs: [
      { question: "How long is a renewed CNIC valid for?", answer: "CNICs are typically issued with a 10-year validity period." }
    ]
  },
  // 2. Passports
  {
    id: "passport-renewal",
    title: "Passport Renewal",
    slug: "passport-renewal",
    category: "passport",
    summary: "Renew your machine-readable Pakistani passport online or at regional passport offices.",
    difficulty: "Medium",
    processingTime: "21 Days (Normal) | 10 Days (Urgent)",
    baseFee: "PKR 4,500 (10 Years, 36 Pages)",
    officialSourceUrl: "https://onlinemrp.dgip.gov.pk",
    eligibility: "Pakistani citizens possessing an expired passport or one with less than 1 year validity.",
    documents: [
      { title: "Valid CNIC or NICOP", isRequired: true },
      { title: "Previous Expired Passport", isRequired: true },
      { title: "Scanned copy of CNIC (Both sides)", isRequired: true }
    ],
    fees: [
      { title: "5 Years Validity (36 Pages) - Normal", amount: "PKR 3,000" },
      { title: "5 Years Validity (36 Pages) - Urgent", amount: "PKR 5,000" },
      { title: "10 Years Validity (36 Pages) - Normal", amount: "PKR 4,500" },
      { title: "10 Years Validity (36 Pages) - Urgent", amount: "PKR 7,500" }
    ],
    steps: [
      { stepNumber: 1, title: "Online Portal Log In", description: "Access the DGIP online passport website and create an account." },
      { stepNumber: 2, title: "Start Application", description: "Select Passport Renewal and insert your previous passport number." },
      { stepNumber: 3, title: "Add Delivery Info", description: "Select home delivery address or the embassy/passport office branch." },
      { stepNumber: 4, title: "Upload Scans & Payment", description: "Upload CNIC scans and pay the processing fee online." }
    ],
    faqs: [
      { question: "Can I renew a lost passport online?", answer: "No, lost passport replacements must be applied for in person at a passport office." }
    ]
  },
  // 3. Driving License
  {
    id: "driving-license-learner",
    title: "Learner Driving Permit",
    slug: "learner-permit",
    category: "driving-license",
    summary: "Obtain a temporary learner driving permit to start training on public roads.",
    difficulty: "Easy",
    processingTime: "Same Day",
    baseFee: "PKR 500",
    officialSourceUrl: "https://dlims.punjab.gov.pk",
    eligibility: "Minimum age of 18 years for motorcars/motorcycles.",
    documents: [
      { title: "Copy of valid CNIC", isRequired: true },
      { title: "Medical Certificate", isRequired: false, description: "Required for applicants aged 50 and above" }
    ],
    fees: [
      { title: "Learner Ticket Fee (per category)", amount: "PKR 500" }
    ],
    steps: [
      { stepNumber: 1, title: "Visit Licensing Center or DLIMS", description: "Go to DLIMS online portal or nearest police service counter." },
      { stepNumber: 2, title: "Submit CNIC", description: "Provide CNIC number and address credentials." },
      { stepNumber: 3, title: "Fee Voucher", description: "Pay permit ticketing fees via e-payment systems." },
      { stepNumber: 4, title: "Permit Print", description: "Download or print your learner license, valid for 6 months." }
    ],
    faqs: [
      { question: "How long is the learner permit valid for?", answer: "It is valid for 6 months, but you can take the driving test after 42 days." }
    ]
  },
  // 4. HEC Scholarships
  {
    id: "hec-scholarship-phd",
    title: "HEC Indigenous PhD Scholarships",
    slug: "indigenous-phd",
    category: "scholarships",
    summary: "Higher Education Commission (HEC) indigenous scholarship program for PhD studies in Pakistani universities.",
    difficulty: "Hard",
    processingTime: "90 Days (Application cycle)",
    baseFee: "PKR 2,000 (Filing & test fee)",
    officialSourceUrl: "https://www.hec.gov.pk",
    eligibility: "Pakistani national, maximum age 40 years, holding MS/MPhil degree with minimum 3.0/4.0 CGPA.",
    documents: [
      { title: "HEC Attested Degrees (Bachelors & Masters)", isRequired: true },
      { title: "CNIC & Domicile certificate", isRequired: true },
      { title: "PhD Admission Letter", isRequired: false, description: "Or copy of enrollment in HEC recognized university" }
    ],
    fees: [
      { title: "HEC HAT Entry Test Fee", amount: "PKR 2,000" }
    ],
    steps: [
      { stepNumber: 1, title: "HEC Portal Application", description: "Create a profile on the HEC e-portal and apply." },
      { stepNumber: 2, title: "HAT Test Booking", description: "Register for the HEC Aptitude Test (HAT) via ETC portal." },
      { stepNumber: 3, title: "Submit Documents", description: "Upload academic credentials and pay test voucher." },
      { stepNumber: 4, title: "Interview & Selection", description: "Shortlisted candidates will be interviewed for final award." }
    ],
    faqs: [
      { question: "Is there a service bond?", answer: "Yes, awardees must sign a bond to serve in Pakistan for 5 years post-PhD." }
    ]
  },
  // 5. Business Setup
  {
    id: "secp-company-inc",
    title: "SECP Company Incorporation",
    slug: "company-incorporation",
    category: "business-registration",
    summary: "Register a Private Limited Company or Single Member Company with SECP online.",
    difficulty: "Hard",
    processingTime: "3 to 5 Days",
    baseFee: "PKR 2,500 (Approx)",
    officialSourceUrl: "https://www.secp.gov.pk",
    eligibility: "Minimum 1 director for Single Member Company; minimum 2 directors for Private Limited Company.",
    documents: [
      { title: "CNIC / Passport copies of all directors", isRequired: true },
      { title: "Memorandum & Articles of Association", isRequired: true },
      { title: "Proof of Office Address", isRequired: true }
    ],
    fees: [
      { title: "Name Reservation Fee", amount: "PKR 200" },
      { title: "Incorporation filing (Online)", amount: "PKR 1,500" },
      { title: "Digital Signature Certificate (per director)", amount: "PKR 1,000" }
    ],
    steps: [
      { stepNumber: 1, title: "Name Reservation", description: "Log in to SECP eServices and reserve a unique company name." },
      { stepNumber: 2, title: "Drafting Documents", description: "Upload the Memorandum (business objects) and Articles of Association." },
      { stepNumber: 3, title: "Biometric & Digital Sign", description: "Obtain digital signature certificates for all directors." },
      { stepNumber: 4, title: "Filing and Fee Payment", description: "Submit incorporation form and pay voucher online." },
      { stepNumber: 5, title: "NTN Registration", description: "Upon approval, FBR automatically generates company NTN." }
    ],
    faqs: [
      { question: "Can a foreigner be a director?", answer: "Yes, foreigners can incorporate a company, subject to clearance from Ministry of Interior." }
    ]
  },
  // 6. Tax & FBR
  {
    id: "fbr-ntn-registration",
    title: "NTN Registration",
    slug: "ntn-registration",
    category: "tax-fbr",
    summary: "Register with the Federal Board of Revenue (FBR) to obtain a National Tax Number (NTN) for individuals.",
    difficulty: "Medium",
    processingTime: "1 to 2 Days",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://iris.fbr.gov.pk",
    eligibility: "Any Pakistani citizen holding a valid CNIC.",
    documents: [
      { title: "Copy of valid CNIC", isRequired: true },
      { title: "Proof of ownership or tenancy of business premises", isRequired: false },
      { title: "Paid utility bill of business premises (not older than 3 months)", isRequired: false }
    ],
    fees: [
      { title: "FBR Online Registration", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Iris Registration", description: "Visit the FBR Iris portal and click on 'Registration for Unregistered Person'." },
      { stepNumber: 2, title: "Fill Registration Form", description: "Provide CNIC, email, mobile number, and address details." },
      { stepNumber: 3, title: "Submit Verification Code", description: "Enter the verification codes sent to your email and mobile number." },
      { stepNumber: 4, title: "Generate NTN", description: "Once submitted, the Iris portal will generate your NTN within 24 hours." }
    ],
    faqs: [
      { question: "Is there any fee for NTN registration?", answer: "No, FBR does not charge any fee for personal NTN registration." }
    ]
  },
  {
    id: "fbr-sales-tax-registration",
    title: "Sales Tax Registration",
    slug: "sales-tax-registration",
    category: "tax-fbr",
    summary: "Register for Sales Tax with FBR to issue sales tax invoices and file sales tax returns.",
    difficulty: "Hard",
    processingTime: "3 to 5 Days",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://iris.fbr.gov.pk",
    eligibility: "Businesses, manufacturers, wholesalers, and retailers required under local sales tax acts.",
    documents: [
      { title: "Copy of valid CNIC of all directors/partners", isRequired: true },
      { title: "Bank account certificate in name of business", isRequired: true },
      { title: "Tenancy agreement / ownership deeds of business premises", isRequired: true }
    ],
    fees: [
      { title: "FBR Online Registration", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Log In to Iris", description: "Log in using your corporate / individual NTN credentials." },
      { stepNumber: 2, title: "Form 14(1) Application", description: "Submit Form 14(1) for Sales Tax Registration." },
      { stepNumber: 3, title: "Submit Bank Details", description: "Link your business bank account verified certificate." },
      { stepNumber: 4, title: "SECP Verification", description: "Provide corporate integration details if registering a company." }
    ],
    faqs: [
      { question: "What is STRN?", answer: "STRN stands for Sales Tax Registration Number, which is generated upon successful sales tax registration." }
    ]
  },
  {
    id: "fbr-tax-return",
    title: "Tax Return Filing Guide",
    slug: "tax-return",
    category: "tax-fbr",
    summary: "Complete guide to filing your annual income tax returns on the FBR Iris portal.",
    difficulty: "Hard",
    processingTime: "Same Day (Online filing)",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://iris.fbr.gov.pk",
    eligibility: "Every resident taxpayer earning income above the taxable threshold (PKR 600,000 per annum).",
    documents: [
      { title: "Salary certificates or bank statement", isRequired: true },
      { title: "Annual wealth statement details", isRequired: true },
      { title: "Withholding tax certificates (mobile bills, vehicle tokens, school fees)", isRequired: false }
    ],
    fees: [
      { title: "Filing Fee", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Access Declaration", description: "Log in to Iris and select Declaration -> 114(1) (Return of Income Tax)." },
      { stepNumber: 2, title: "Enter Income Details", description: "Input salary, business, rental or other incomes under respective heads." },
      { stepNumber: 3, title: "Reconciliation of Assets", description: "Verify that net assets reconcile with income and personal expenses." },
      { stepNumber: 4, title: "Verification and Pin", description: "Verify form using your 4-digit code and submit." }
    ],
    faqs: [
      { question: "What is the deadline for filing tax returns?", answer: "The standard deadline is September 30th of each fiscal year, unless extended by the FBR." }
    ]
  },
  {
    id: "fbr-atl-status",
    title: "Active Taxpayer List (ATL) Status",
    slug: "atl-status",
    category: "tax-fbr",
    summary: "Check your status on the FBR Active Taxpayer List (ATL) to benefit from lower withholding tax rates.",
    difficulty: "Easy",
    processingTime: "Instant via SMS / Online Portal",
    baseFee: "Free of Cost (PKR 1,000 surcharge for late filers)",
    officialSourceUrl: "https://www.fbr.gov.pk",
    eligibility: "Any individual or business who has filed tax returns for the latest tax year.",
    documents: [
      { title: "CNIC number or NTN number", isRequired: true }
    ],
    fees: [
      { title: "Active Status Check", amount: "Free" },
      { title: "Late Filer ATL Surcharge (Individuals)", amount: "PKR 1,000" }
    ],
    steps: [
      { stepNumber: 1, title: "SMS Check", description: "Send 'ATL [space] CNIC' (without dashes) to 9966." },
      { stepNumber: 2, title: "Online Portal Check", description: "Visit the FBR Active Taxpayer List portal and enter CNIC/NTN." },
      { stepNumber: 3, title: "Verify Status", description: "Check if the status displays 'Active' or 'Inactive'." },
      { stepNumber: 4, title: "Surcharge Payment", description: "If inactive due to late filing, pay the ATL surcharge to activate." }
    ],
    faqs: [
      { question: "How long does it take to become active after paying the surcharge?", answer: "Usually, the ATL is updated within 24 hours of successful surcharge payment." }
    ]
  },
  {
    id: "fbr-income-tax-cert",
    title: "Income Tax Certificate",
    slug: "income-tax-certificate",
    category: "tax-fbr",
    summary: "Obtain an official tax registration or exemption certificate online from the FBR Iris system.",
    difficulty: "Easy",
    processingTime: "Instant (Download)",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://iris.fbr.gov.pk",
    eligibility: "Registered taxpayers with a valid Iris login.",
    documents: [
      { title: "Iris Portal Username & Password", isRequired: true }
    ],
    fees: [
      { title: "Certificate Download", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Log In", description: "Log in to the Iris portal." },
      { stepNumber: 2, title: "Navigate to Print", description: "Go to registration/profile options and select 'Print Certificate'." },
      { stepNumber: 3, title: "Download PDF", description: "Click download to save the PDF copy of your Registration Certificate (NTN)." }
    ],
    faqs: [
      { question: "Is this certificate valid proof of tax filer status?", answer: "Yes, it contains a QR code that can be scanned for verification." }
    ]
  },

  // 7. Utility Services
  {
    id: "utility-electricity-complaint",
    title: "Electricity Complaint Registry",
    slug: "electricity-complaint",
    category: "utilities",
    summary: "Register electricity complaints (power outages, billing issues, transformer failures) with local DISCOs.",
    difficulty: "Easy",
    processingTime: "1 to 24 Hours",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.nepra.org.pk",
    eligibility: "Any consumer having an active electricity connection under a local DISCO (e.g. K-Electric, LESCO, IESCO).",
    documents: [
      { title: "Recent electricity bill (specifically reference number)", isRequired: true },
      { title: "Mobile number", isRequired: true }
    ],
    fees: [
      { title: "Complaint Registration", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Locate Reference Number", description: "Find the 14-digit reference number printed on your electricity bill." },
      { stepNumber: 2, title: "Submit Complaint", description: "Call the DISCO helpline (e.g. 118) or register online through their app." },
      { stepNumber: 3, title: "Obtain Ticket Number", description: "Note down the complaint registration tracking ID." }
    ],
    faqs: [
      { question: "What if my local DISCO does not resolve my issue?", answer: "You can escalate the complaint to NEPRA (National Electric Power Regulatory Authority) online." }
    ]
  },
  {
    id: "utility-gas-complaint",
    title: "Gas Complaint Registry",
    slug: "gas-complaint",
    category: "utilities",
    summary: "Register gas leakage, low pressure, or billing complaints with SNGPL or SSGC.",
    difficulty: "Easy",
    processingTime: "2 to 12 Hours (Emergency leakages handled instantly)",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.sngpl.com.pk",
    eligibility: "Gas consumers registered under SNGPL (North/Central) or SSGC (South).",
    documents: [
      { title: "Gas account number (printed on bill)", isRequired: true }
    ],
    fees: [
      { title: "Gas Complaint Registration", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Call Emergency Hotline", description: "For gas leakages, immediately call SNGPL/SSGC hotline at 1199." },
      { stepNumber: 2, title: "Provide Account Details", description: "Provide consumer number and location address." },
      { stepNumber: 3, title: "Escalation", description: "For billing or low pressure complaints, file a ticket on SNGPL/SSGC portals." }
    ],
    faqs: [
      { question: "Is the emergency gas leakage team active 24/7?", answer: "Yes, the 1199 emergency teams are active 24/7." }
    ]
  },
  {
    id: "utility-water-complaint",
    title: "Water Supply Complaint",
    slug: "water-complaint",
    category: "utilities",
    summary: "Submit water shortage or pipeline contamination complaints to local WASA or KWSB authorities.",
    difficulty: "Easy",
    processingTime: "1 to 3 Days",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.wasa.gop.pk",
    eligibility: "Resident of municipal areas served by water authorities.",
    documents: [
      { title: "Water consumer bill reference", isRequired: true }
    ],
    fees: [
      { title: "Water Supply Complaint Registration", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Submit Complaint", description: "Call WASA helpline (e.g. 1334) or visit their regional sub-divisional office." },
      { stepNumber: 2, title: "Provide Consumer ID", description: "Provide address and water account number." },
      { stepNumber: 3, title: "Inspection", description: "WASA team will inspect the water valve or pipeline leakage." }
    ],
    faqs: [
      { question: "Can I request a water tanker?", answer: "Yes, during severe shortage, WASA/KWSB allows requesting tankers on paid or subsidised rates." }
    ]
  },
  {
    id: "utility-new-connection",
    title: "New Utility Connection Application",
    slug: "new-utility-connection",
    category: "utilities",
    summary: "Step-by-step guide to applying for a new electricity, gas, or water meter connection.",
    difficulty: "Hard",
    processingTime: "30 to 90 Days",
    baseFee: "PKR 5,000 (Varies by load/meter type)",
    officialSourceUrl: "https://enc.com.pk",
    eligibility: "Owner of the property or tenant (with owner NOC).",
    documents: [
      { title: "Proof of Ownership of property (Registry/Fard)", isRequired: true },
      { title: "NOC from owner (if tenant)", isRequired: false },
      { title: "Copy of valid CNIC of applicant", isRequired: true },
      { title: "Neighbor's electricity/gas bill copy", isRequired: true }
    ],
    fees: [
      { title: "Electricity Meter Demand Notice (Single Phase)", amount: "PKR 7,500" },
      { title: "Gas Connection Fee (Domestic)", amount: "PKR 6,000" }
    ],
    steps: [
      { stepNumber: 1, title: "Online Application", description: "Fill the application form at the Electricity New Connection (ENC) portal." },
      { stepNumber: 2, title: "Upload Scans", description: "Upload CNIC, ownership proof, and witness CNICs." },
      { stepNumber: 3, title: "Site Survey", description: "DISCO/SNGPL surveyor will visit the premises to verify structural feasibility." },
      { stepNumber: 4, title: "Demand Notice Payment", description: "Pay the issued demand notice voucher in designated banks." },
      { stepNumber: 5, title: "Meter Installation", description: "Meter will be installed after verification of test report." }
    ],
    faqs: [
      { question: "Can I apply online for a gas connection?", answer: "Yes, both SNGPL and SSGC have online portal systems for new connections." }
    ]
  },
  {
    id: "utility-bill-correction",
    title: "Utility Bill Correction Guide",
    slug: "bill-correction",
    category: "utilities",
    summary: "Resolve wrong reading, double tax, or incorrect tariff calculations on electricity and gas bills.",
    difficulty: "Medium",
    processingTime: "1 to 3 Days",
    baseFee: "Free of Cost",
    officialSourceUrl: "http://www.nepra.org.pk",
    eligibility: "Any utility consumer showing mismatched units or billing errors.",
    documents: [
      { title: "Original faulty bill", isRequired: true },
      { title: "Photograph of actual meter reading", isRequired: true },
      { title: "CNIC copy of consumer", isRequired: true }
    ],
    fees: [
      { title: "Bill Correction filing", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Photograph Meter", description: "Take a clear picture of the current reading on the physical meter." },
      { stepNumber: 2, title: "Visit Customer Service", description: "Visit the local DISCO/Gas office customer care center." },
      { stepNumber: 3, title: "Submit Correction Form", description: "Present the photograph, faulty bill, and request unit verification." },
      { stepNumber: 4, title: "Obtain Corrected Bill", description: "The officer will update the database records and print a corrected bill." }
    ],
    faqs: [
      { question: "What if the deadline expires while correcting the bill?", answer: "The customer care officer will extend the due date of your bill during processing." }
    ]
  },

  // 8. Police & Legal
  {
    id: "legal-fir-guide",
    title: "First Information Report (FIR) Guide",
    slug: "fir-guide",
    category: "police-legal",
    summary: "Complete guide on how to register a First Information Report (FIR) at a police station in Pakistan.",
    difficulty: "Medium",
    processingTime: "Same Day",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.punjabpolice.gov.pk",
    eligibility: "Any individual who has been a victim of or witnessed a cognizable offense.",
    documents: [
      { title: "Written application details of incident", isRequired: true },
      { title: "Copy of valid CNIC", isRequired: true },
      { title: "Evidence/supporting proof (if any)", isRequired: false }
    ],
    fees: [
      { title: "FIR Registration", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Visit Police Station", description: "Go to the nearest police station of the area where the incident occurred." },
      { stepNumber: 2, title: "Report Incident", description: "Verbally narrate the incident to the Station House Officer (SHO) or present a written draft." },
      { stepNumber: 3, title: "Verify Draft", description: "Listen as the duty officer reads back your statements to verify details." },
      { stepNumber: 4, title: "Obtain Copy", description: "Sign the report. By law, you are entitled to a free copy of the FIR immediately." }
    ],
    faqs: [
      { question: "Can a police officer refuse to register an FIR?", answer: "No, but if they do, you can file a complaint with the SP or use the court (Section 22-A/B CrPC)." }
    ]
  },
  {
    id: "legal-police-complaint",
    title: "Police Complaint Registry",
    slug: "police-complaint",
    category: "police-legal",
    summary: "Register non-emergency complaints against police misconduct, harassment, or investigation delays.",
    difficulty: "Easy",
    processingTime: "3 to 7 Days",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://complaints.opd.punjab.gov.pk",
    eligibility: "Any citizen seeking redress against police personnel or delayed case handling.",
    documents: [
      { title: "Application copy", isRequired: true },
      { title: "Evidence of delayed action / misconduct", isRequired: false }
    ],
    fees: [
      { title: "Complaint Submission", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Submit Online", description: "Log in to the Inspector General (IG) Police complaint portal or PMDU." },
      { stepNumber: 2, title: "Call Helpline", description: "Or dial 1787 (Police Complaint Center) directly from your mobile." },
      { stepNumber: 3, title: "Verification", description: "The Central Complaint Cell will assign an officer to verify your grievance." }
    ],
    faqs: [
      { question: "What is the helpline number for police complaints?", answer: "The centralized helpline is 1787." }
    ]
  },
  {
    id: "legal-character-certificate",
    title: "Police Character Certificate",
    slug: "character-certificate",
    category: "police-legal",
    summary: "Apply for a Police Character Certificate (Clearance Certificate) for visa or employment purposes.",
    difficulty: "Medium",
    processingTime: "3 to 7 Days",
    baseFee: "PKR 500",
    officialSourceUrl: "https://pkis.punjab.gov.pk",
    eligibility: "Any resident who has resided in the municipal limits for more than 6 months.",
    documents: [
      { title: "Copy of valid CNIC / NICOP", isRequired: true },
      { title: "Original Passport & Visa scans", isRequired: true },
      { title: "Affidavit of clean record", isRequired: true },
      { title: "Two passport-sized photographs", isRequired: true }
    ],
    fees: [
      { title: "Processing Fee (via e-Khidmat / Police Khidmat)", amount: "PKR 500" }
    ],
    steps: [
      { stepNumber: 1, title: "Visit Police Khidmat Markaz", description: "Visit the nearest Police Khidmat Markaz or e-Khidmat Center." },
      { stepNumber: 2, title: "Submit Documents", description: "Submit passport scans, CNIC, and resident affidavits." },
      { stepNumber: 3, title: "Security Agency Verification", description: "Local police station will conduct a background check of your address." },
      { stepNumber: 4, title: "Collection", description: "Collect the certificate after SMS notification." }
    ],
    faqs: [
      { question: "Can a relative apply on my behalf if I am overseas?", answer: "Yes, but they must have an official authority letter attested by the consulate." }
    ]
  },
  {
    id: "legal-estamp",
    title: "E-Stamp Paper Issuance",
    slug: "estamp-guide",
    category: "police-legal",
    summary: "Generate and print computerized non-judicial e-stamp papers for property, business contracts, or affidavits.",
    difficulty: "Easy",
    processingTime: "Instant (Online Generation)",
    baseFee: "Varies by contract value (Minimum PKR 100)",
    officialSourceUrl: "https://estamp.punjab.gov.pk",
    eligibility: "Individuals, businesses, or legal representatives executing a contract in Pakistan.",
    documents: [
      { title: "CNIC number of first party", isRequired: true },
      { title: "CNIC number of second party", isRequired: true },
      { title: "Challan 32-A details", isRequired: true }
    ],
    fees: [
      { title: "Challan Processing", amount: "Varies" }
    ],
    steps: [
      { stepNumber: 1, title: "Fill Challan 32-A", description: "Visit the e-stamping website and fill out Challan Form 32-A details." },
      { stepNumber: 2, title: "Pay Challan", description: "Print the challan and pay at any branch of the National Bank of Pakistan (NBP)." },
      { stepNumber: 3, title: "Collect E-Stamp", description: "Collect the e-stamp paper containing a unique 16-digit code from the bank." }
    ],
    faqs: [
      { question: "Can I verify the validity of an e-stamp paper online?", answer: "Yes, you can verify it by entering the e-stamp number on the e-stamping portal or via SMS." }
    ]
  },
  {
    id: "legal-court-procedure",
    title: "Civil Court Procedure Guide",
    slug: "court-procedure",
    category: "police-legal",
    summary: "Understand the steps involved in filing civil litigation (property disputes, family disputes, contracts) in district courts.",
    difficulty: "Hard",
    processingTime: "Varies (Several months to years)",
    baseFee: "Court fee stamps (Varies by claim value)",
    officialSourceUrl: "https://www.supremecourt.gov.pk",
    eligibility: "Any individual or corporation having a civil dispute.",
    documents: [
      { title: "Plaint (detailed statement of claim)", isRequired: true },
      { title: "Power of Attorney (Wakalatnama) for lawyer", isRequired: true },
      { title: "Evidence list and supporting documents", isRequired: true }
    ],
    fees: [
      { title: "Court stamp paper fee (Max limit)", amount: "PKR 15,000" }
    ],
    steps: [
      { stepNumber: 1, title: "Consult Lawyer", description: "Retain a registered advocate to draft the civil lawsuit plaint." },
      { stepNumber: 2, title: "Filing in Court", description: "File the lawsuit plaint along with annexures at the Senior Civil Judge office." },
      { stepNumber: 3, title: "Summoning Defendents", description: "Court issues notices to defendants via bailiff, registered mail, or newspaper advertisement." },
      { stepNumber: 4, title: "Trial and Evidence", description: "Parties submit replication, frame issues, and record witness statements." },
      { stepNumber: 5, title: "Arguments and Judgment", description: "Lawyers present final arguments, and court decrees the lawsuit." }
    ],
    faqs: [
      { question: "What is a stay order?", answer: "A temporary injunction issued by the court to preserve the current state of a property/matter during trial." }
    ]
  },

  // 9. Healthcare
  {
    id: "health-sehat-card",
    title: "Sehat Sahulat Program",
    slug: "sehat-card",
    category: "healthcare",
    summary: "Check your eligibility and register for free indoor healthcare coverage under the Sehat Insaf Card scheme.",
    difficulty: "Easy",
    processingTime: "Instant Status Check",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.pmhealthprogram.gov.pk",
    eligibility: "All families registered with NADRA (specifically under poverty indexes or regional eligibility rules).",
    documents: [
      { title: "CNIC Number of Family Head", isRequired: true }
    ],
    fees: [
      { title: "Registration & Coverage", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Check Eligibility", description: "Send your CNIC number in an SMS to 8500." },
      { stepNumber: 2, title: "Receive Status", description: "Wait to receive text verification indicating if your family is eligible." },
      { stepNumber: 3, title: "Hospital Admission", description: "During medical emergency, visit a designated paneled hospital with your original CNIC." },
      { stepNumber: 4, title: "Free Treatment", description: "Get cashless medical treatment up to PKR 1,000,000 per family per year." }
    ],
    faqs: [
      { question: "Does the card cover outdoor (OPD) treatment?", answer: "No, Sehat Sahulat Program only covers indoor (hospitalisation) medical treatments." }
    ]
  },
  {
    id: "health-vaccination",
    title: "Vaccination Registry Guide",
    slug: "vaccination-guide",
    category: "healthcare",
    summary: "Register and obtain vaccination certificates (COVID-19, Polio, Child EPI) from NADRA and NIMS.",
    difficulty: "Easy",
    processingTime: "Same Day",
    baseFee: "PKR 250 (Certificate generation)",
    officialSourceUrl: "https://nims.nadra.gov.pk",
    eligibility: "Citizens who have received at least one vaccine dose at a government center.",
    documents: [
      { title: "CNIC Number", isRequired: true },
      { title: "Vaccination card / receipt from hospital center", isRequired: false }
    ],
    fees: [
      { title: "Vaccination Doses", amount: "Free" },
      { title: "NADRA Certificate Issuance Fee", amount: "PKR 250" }
    ],
    steps: [
      { stepNumber: 1, title: "Visit NIMS Portal", description: "Access the National Immunization Management System (NIMS) portal." },
      { stepNumber: 2, title: "Enter Credentials", description: "Insert CNIC and issue date details." },
      { stepNumber: 3, title: "Fee Payment", description: "Pay PKR 250 fee online or at an e-Sahulat outlet." },
      { stepNumber: 4, title: "Download", description: "Print or download your digital immunization certificate." }
    ],
    faqs: [
      { question: "Can I get this certificate printed in card size?", answer: "Yes, you can request a PVC card printout from any NADRA center." }
    ]
  },
  {
    id: "health-hospitals",
    title: "Government Hospitals Guide",
    slug: "government-hospitals",
    category: "healthcare",
    summary: "Locate and access tertiary government healthcare centers (PIMS, Mayo Hospital, Jinnah Hospital).",
    difficulty: "Easy",
    processingTime: "Ongoing",
    baseFee: "Free of Cost (Nominal OPD slips)",
    officialSourceUrl: "https://www.nih.org.pk",
    eligibility: "Any citizen seeking medical treatment.",
    documents: [
      { title: "Original CNIC", isRequired: true }
    ],
    fees: [
      { title: "OPD Registration Ticket", amount: "PKR 10" },
      { title: "Inpatient stay & basic medicines", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Visit OPD Counter", description: "Visit the hospital early in the morning and buy an OPD slip." },
      { stepNumber: 2, title: "Consultation", description: "Wait at designated rooms for consultation with a specialist doctor." },
      { stepNumber: 3, title: "Pharmacy", description: "Collect prescribed basic medications from the hospital pharmacy free of cost." }
    ],
    faqs: [
      { question: "Are emergency departments active 24/7?", answer: "Yes, emergency and trauma centers at all tertiary government hospitals operate 24/7." }
    ]
  },
  {
    id: "health-card-info",
    title: "Health Card Information",
    slug: "health-card-info",
    category: "healthcare",
    summary: "Complete breakdown of treatments covered under the National Health Card scheme.",
    difficulty: "Easy",
    processingTime: "Instant",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.pmhealthprogram.gov.pk",
    eligibility: "Every registered citizen eligible for Sehat Card coverage.",
    documents: [
      { title: "CNIC", isRequired: true }
    ],
    fees: [
      { title: "Information Guide", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Verify Packages", description: "Review covered operations (cardiac surgeries, kidney transplants, maternity)." },
      { stepNumber: 2, title: "Locate Paneled Hospitals", description: "Search the list of public/private paneled hospitals on the PMHP portal." }
    ],
    faqs: [
      { question: "Is cancer treatment covered?", answer: "Yes, oncology treatments are covered under special packages of the Sehat Card." }
    ]
  },
  {
    id: "health-medical-certificate",
    title: "Government Medical Certificate",
    slug: "medical-certificate",
    category: "healthcare",
    summary: "Obtain a certified medical fitness certificate from a government Medical Superintendent (MS) for employment.",
    difficulty: "Medium",
    processingTime: "1 to 2 Days",
    baseFee: "PKR 500 (Hospital lab tests)",
    officialSourceUrl: "https://www.nih.org.pk",
    eligibility: "Candidates selected for public service or requiring fitness clearances.",
    documents: [
      { title: "Selection letter / job offer letter", isRequired: true },
      { title: "Copy of valid CNIC", isRequired: true },
      { title: "Blood group and lab reports", isRequired: true },
      { title: "Two passport photographs", isRequired: true }
    ],
    fees: [
      { title: "Lab tests (Urinalysis, Chest X-ray, Blood tests)", amount: "PKR 500" }
    ],
    steps: [
      { stepNumber: 1, title: "Purchase Ticket", description: "Go to the District Headquarter Hospital (DHQ) and buy a fitness application form." },
      { stepNumber: 2, title: "Lab Diagnostics", description: "Undergo standard visual, auditory, and blood diagnostics in the lab." },
      { stepNumber: 3, title: "Doctor Signature", description: "Have the reports signed by individual department heads (Eye specialist, ENT)." },
      { stepNumber: 4, title: "Counter-Signature", description: "Submit reports to the MS office to obtain final stamped fitness certificate." }
    ],
    faqs: [
      { question: "How long is a fitness certificate valid?", answer: "Typically, it is valid for 6 months from the date of issue." }
    ]
  },

  // 10. Employment
  {
    id: "job-government-guide",
    title: "Government Job Application Guide",
    slug: "government-job-guide",
    category: "employment",
    summary: "Complete guide on finding and registering for federal and provincial government job openings.",
    difficulty: "Medium",
    processingTime: "Varies (Job application cycle)",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.njp.gov.pk",
    eligibility: "Pakistani citizens matching age, education, and domicile requirements of the respective post.",
    documents: [
      { title: "Educational transcripts & certificates", isRequired: true },
      { title: "Domicile certificate", isRequired: true },
      { title: "CNIC Copy", isRequired: true },
      { title: "Experience certificates (if any)", isRequired: false }
    ],
    fees: [
      { title: "NJP Job Application", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Visit NJP Portal", description: "Create an account on the National Job Portal (NJP)." },
      { stepNumber: 2, title: "Build Profile", description: "Insert your academic background, experience, and contact details." },
      { stepNumber: 3, title: "Apply for Jobs", description: "Search open vacancies matching your profile and click 'Apply'." }
    ],
    faqs: [
      { question: "Is there any age relaxation?", answer: "Yes, federal guidelines allow a general 5-year age relaxation for most government jobs." }
    ]
  },
  {
    id: "job-ppsc-guide",
    title: "PPSC Online Registration Guide",
    slug: "ppsc-guide",
    category: "employment",
    summary: "Apply for Punjab Public Service Commission (PPSC) jobs and competitive exams online.",
    difficulty: "Hard",
    processingTime: "60 to 90 Days",
    baseFee: "PKR 600 (Application fee)",
    officialSourceUrl: "https://www.ppsc.gop.pk",
    eligibility: "Candidates holding Punjab domicile and matching specific academic requisites.",
    documents: [
      { title: "CNIC Scan (Front & Back)", isRequired: true },
      { title: "Paid bank challan slip copy", isRequired: true },
      { title: "Passport size photograph with blue background", isRequired: true },
      { title: "Domicile Certificate Scan", isRequired: true }
    ],
    fees: [
      { title: "PPSC Challan fee (NBP/SBP branches)", amount: "PKR 600" }
    ],
    steps: [
      { stepNumber: 1, title: "Select Post", description: "Open PPSC portal, select 'Apply Online', and choose the desired post." },
      { stepNumber: 2, title: "Generate Challan", description: "Download Challan Form 32-A and pay PKR 600 at National Bank of Pakistan." },
      { stepNumber: 3, title: "Fill Online Form", description: "Input CNIC, paid challan transaction ID, and education records." },
      { stepNumber: 4, title: "Upload Scans", description: "Upload your photo, CNIC, and domicile. Submit application." }
    ],
    faqs: [
      { question: "Can I pay the PPSC fee online?", answer: "Yes, PPSC accepts fee payments through e-payments (JazzCash, EasyPaisa, ATMs)." }
    ]
  },
  {
    id: "job-fpsc-guide",
    title: "FPSC Online Application Guide",
    slug: "fpsc-guide",
    category: "employment",
    summary: "Apply for Federal Public Service Commission (FPSC) jobs and CSS examinations.",
    difficulty: "Hard",
    processingTime: "90 to 180 Days",
    baseFee: "PKR 300 (CSS is PKR 2,200)",
    officialSourceUrl: "https://www.fpsc.gov.pk",
    eligibility: "Any citizen of Pakistan holding a minimum 14-year Bachelor's degree (or equivalent).",
    documents: [
      { title: "Educational degrees/certificates copy", isRequired: true },
      { title: "Paid treasury receipt challan copy", isRequired: true },
      { title: "Passport photograph size", isRequired: true }
    ],
    fees: [
      { title: "FPSC Challan Fee (BS-16 to BS-17)", amount: "PKR 300" },
      { title: "FPSC Challan Fee (BS-18)", amount: "PKR 750" },
      { title: "CSS Exam Challan Fee", amount: "PKR 2200" }
    ],
    steps: [
      { stepNumber: 1, title: "Download Challan", description: "Print treasury receipt challan form from the FPSC website." },
      { stepNumber: 2, title: "Pay Treasury Fee", description: "Deposit the fee in State Bank of Pakistan or National Bank under head 'C02101'." },
      { stepNumber: 3, title: "Submit Online", description: "Submit application details on the FPSC online portal before the deadline." }
    ],
    faqs: [
      { question: "Is CSS exam held once a year?", answer: "Yes, CSS written examinations are held annually, usually in February." }
    ]
  },
  {
    id: "job-resume-assistant",
    title: "Government Resume Writing Assistant",
    slug: "resume-assistant",
    category: "employment",
    summary: "Guide to formatting and writing resume structures matching Pakistani public sector standards.",
    difficulty: "Easy",
    processingTime: "Same Day",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.njp.gov.pk",
    eligibility: "Job seekers looking for a structured resume format.",
    documents: [
      { title: "Personal biography notes & qualifications list", isRequired: true }
    ],
    fees: [
      { title: "Template Download", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Format Selection", description: "Use the reverse-chronological layout emphasizing educational milestones." },
      { stepNumber: 2, title: "Integrate Domicile", description: "Always explicitly mention your domicile district as it is vital for quota verification." },
      { stepNumber: 3, title: "List HEC Attestations", description: "Highlight HEC attestation numbers on your degrees." }
    ],
    faqs: [
      { question: "Why is Domicile critical on a Pakistani government resume?", answer: "Government positions are allocated based on regional quota percentages (Punjab, Sindh, KPK, Balochistan)." }
    ]
  },
  {
    id: "job-interview-prep",
    title: "Public Sector Interview Preparation",
    slug: "interview-prep",
    category: "employment",
    summary: "Prepare for PPSC, FPSC, and CSS department interviews with guide checklists.",
    difficulty: "Medium",
    processingTime: "Ongoing",
    baseFee: "Free of Cost",
    officialSourceUrl: "https://www.fpsc.gov.pk",
    eligibility: "Candidates shortlisted for public sector department interviews.",
    documents: [
      { title: "Original educational degrees & transcripts", isRequired: true },
      { title: "PPSC/FPSC Interview call letter", isRequired: true },
      { title: "Three copies of Attestation forms (signed by BS-17+ officer)", isRequired: true }
    ],
    fees: [
      { title: "Prep Guide Access", amount: "Free" }
    ],
    steps: [
      { stepNumber: 1, title: "Document Organization", description: "Organize all degrees, domiciles, and CNICs in a professional file folder." },
      { stepNumber: 2, title: "Attestation", description: "Get your recent photographs and copies of documents attested by a gazetted officer." },
      { stepNumber: 3, title: "General Knowledge Review", description: "Revise current affairs of Pakistan, basic Islamic studies, and post-related technical topics." }
    ],
    faqs: [
      { question: "Will my original documents be verified on the day of the interview?", answer: "Yes, PPSC/FPSC panels will verify original degrees and domiciles before allowing you into the interview room." }
    ]
  }
]

function withTimeout<T>(promise: Promise<T>, timeoutMs = 500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Database query timeout")), timeoutMs)
    )
  ])
}

export async function getServices(category?: string, query?: string): Promise<GovServiceDetail[]> {
  try {
    // If Prisma client is ready and connected, fetch from database.
    // Otherwise, fallback to static mock data.
    const hasDb = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    if (hasDb) {
      const prisma = (await import('@/db/prisma')).default
      const dbServices = await withTimeout(
        prisma.govService.findMany({
          where: {
            ...(category ? { category: { slug: category } } : {}),
            ...(query ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { summary: { contains: query, mode: 'insensitive' } }
              ]
            } : {}),
            isPublished: true
          },
          include: {
            category: true
          }
        }),
        500
      )

      if (dbServices.length > 0) {
        return dbServices.map((ds) => ({
          id: ds.id,
          title: ds.title,
          slug: ds.slug,
          category: ds.category.slug,
          summary: ds.summary,
          difficulty: (ds.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
          processingTime: ds.processingTime || 'N/A',
          baseFee: ds.baseFee ? `PKR ${ds.baseFee.toString()}` : 'N/A',
          officialSourceUrl: ds.officialSourceUrl || '',
          eligibility: 'Verified Pakistani citizen',
          documents: [],
          fees: [],
          steps: [],
          faqs: []
        }))
      }
    }
  } catch (err) {
    console.warn("Prisma query failed, falling back to static services content", err)
  }

  // Filter static list
  let results = [...staticServices]
  if (category) {
    results = results.filter(s => s.category.toLowerCase() === category.toLowerCase())
  }
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.summary.toLowerCase().includes(q)
    )
  }
  return results
}

export async function getServiceBySlug(slug: string): Promise<GovServiceDetail | null> {
  try {
    const hasDb = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    if (hasDb) {
      const prisma = (await import('@/db/prisma')).default
      const ds = await withTimeout(
        prisma.govService.findUnique({
          where: { slug },
          include: {
            category: true,
            documents: true,
            steps: { orderBy: { stepNumber: 'asc' } },
            fees: true,
            faqs: true
          }
        }),
        500
      ) as DbGovService | null

      if (ds) {
        return {
          id: ds.id,
          title: ds.title,
          slug: ds.slug,
          category: ds.category.slug,
          summary: ds.summary,
          difficulty: (ds.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
          processingTime: ds.processingTime || 'N/A',
          baseFee: ds.baseFee ? `PKR ${ds.baseFee.toString()}` : 'N/A',
          officialSourceUrl: ds.officialSourceUrl || '',
          eligibility: 'Verified Pakistani citizen',
          documents: ds.documents.map(doc => ({
            title: doc.title,
            isRequired: doc.isRequired,
            description: doc.description || undefined
          })),
          fees: ds.fees.map(fee => ({
            title: fee.title,
            amount: `${fee.currency} ${fee.amount.toString()}`,
            notes: fee.notes || undefined
          })),
          steps: ds.steps.map(st => ({
            stepNumber: st.stepNumber,
            title: st.title,
            description: st.description,
            tip: st.tip || undefined
          })),
          faqs: ds.faqs.map(f => ({
            question: f.question,
            answer: f.answer
          }))
        }
      }
    }
  } catch (err) {
    console.warn("Prisma query failed, falling back to static services content", err)
  }

  return staticServices.find(s => s.slug.toLowerCase() === slug.toLowerCase()) || null
}
