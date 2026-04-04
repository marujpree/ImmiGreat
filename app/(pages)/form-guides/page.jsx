'use client'

import { useState } from 'react'
import { FileText, Volume2, Languages, Download, ExternalLink, Search, ChevronRight } from 'lucide-react'
import PageBanner from '@/components/PageBanner'
import Link from 'next/link'

const formGuides = [
  { id: 'i20', form: 'I-20', title: 'Certificate of Eligibility for Student Status', category: 'student', description: 'Required for F-1 and M-1 student visa applications. Issued by your school, this form certifies your acceptance and eligibility for student status.', whoNeeds: 'All international students applying for F-1 or M-1 visas', steps: ['Apply and get accepted to a SEVP-certified school', 'School issues Form I-20 after reviewing financial documents', 'Receive I-20 via mail or electronically', 'Review all information for accuracy', 'Sign and date the form', 'Pay SEVIS fee using information from I-20', 'Use I-20 for visa application and entry to U.S.'], keyFields: [{ field: 'SEVIS ID', explanation: "Your unique student tracking number. Keep this number safe — you'll need it for work authorization, travel, and other applications." }, { field: 'Program Start Date', explanation: 'When your academic program begins. You can enter the U.S. up to 30 days before this date.' }, { field: 'Program End Date', explanation: 'Expected completion date. You can stay in the U.S. for up to 60 days after this date (grace period).' }], commonMistakes: ["Not keeping I-20 up to date when changing major or extending program", "Traveling without getting travel signature from DSO", "Working without proper authorization"] },
  { id: 'ds160', form: 'DS-160', title: 'Online Nonimmigrant Visa Application', category: 'visa', description: 'Required online form for most nonimmigrant visa applications. Used for tourist, student, work, and other temporary visas.', whoNeeds: 'Anyone applying for a nonimmigrant visa at a U.S. consulate or embassy', steps: ['Go to CEAC website', 'Select your location and start application', 'Answer all questions honestly and completely', 'Upload digital photo meeting requirements', 'Review all information carefully', 'Submit application electronically', 'Print confirmation page with barcode', 'Bring confirmation page to visa interview'], keyFields: [{ field: 'Travel Information', explanation: 'Purpose of trip and detailed itinerary. Be specific and honest about your plans.' }, { field: 'Previous U.S. Travel', explanation: 'All previous visits to the U.S. Include dates, duration, and visa types.' }, { field: 'Security Questions', explanation: 'Questions about criminal history, immigration violations, etc. Answer truthfully.' }], commonMistakes: ['Not saving application ID', 'Photo not meeting strict requirements', 'Inconsistent information with other documents'] },
  { id: 'i765', form: 'I-765', title: 'Application for Employment Authorization', category: 'work', description: 'Apply for work permission (EAD card) if your visa category allows it. Required for OPT, asylum-based work authorization, and many other situations.', whoNeeds: "Anyone needing work authorization who isn't already authorized by their visa type", steps: ['Determine your eligibility category', 'Gather required documents (varies by category)', 'Complete Form I-765', 'Take passport-style photos', 'Pay filing fee (if required)', 'Mail application to correct USCIS address', 'Track case status online', 'Receive EAD card by mail (if approved)'], keyFields: [{ field: 'Eligibility Category', explanation: 'Specific code for your situation (e.g., (c)(3)(C) for F-1 OPT). Choose carefully — wrong category = denial.' }, { field: 'Previous EAD', explanation: 'Information about any prior work authorization. Include EAD numbers and validity dates.' }], commonMistakes: ['Applying too late (apply 90 days before current EAD expires)', 'Wrong eligibility category selected', 'Missing required evidence for your category'] },
  { id: 'i130', form: 'I-130', title: 'Petition for Alien Relative', category: 'family', description: 'U.S. citizens and permanent residents use this form to petition for certain family members to immigrate to the U.S.', whoNeeds: 'U.S. citizens or permanent residents sponsoring family members', steps: ['Verify your eligibility as petitioner', 'Confirm relationship qualifies for petition', 'Gather proof of relationship (birth/marriage certificates)', 'Complete Form I-130', 'Pay filing fee', 'Submit to USCIS', 'Attend interview if required', 'Receive approval notice'], keyFields: [{ field: 'Petitioner Information', explanation: 'Details about the U.S. citizen or permanent resident filing the petition.' }, { field: 'Relationship', explanation: 'How you\'re related. Must be a qualifying relationship (spouse, parent, child, sibling).' }], commonMistakes: ['Not proving relationship adequately', 'Missing translations of foreign documents', "Not updating USCIS about address changes"] },
  { id: 'w4', form: 'W-4', title: "Employee's Withholding Certificate", category: 'employment', description: 'Tell your employer how much federal tax to withhold from your paycheck. Critical for all U.S. employees.', whoNeeds: 'All employees starting a new job in the U.S.', steps: ['Receive W-4 from employer on first day', 'Provide personal information (name, address, SSN)', 'Choose filing status', 'Claim dependents if applicable', 'Sign and date form', 'Submit to employer', 'Update if circumstances change'], keyFields: [{ field: 'Filing Status', explanation: 'Single, married, or head of household. Affects tax withholding amount.' }, { field: 'Dependents', explanation: 'Children or others you financially support. Reduces withholding.' }], commonMistakes: ['Not updating W-4 after major life changes', 'Claiming exempt when not eligible', 'Confusing W-4 with W-2 (year-end tax form)'] },
]

const categories = [
  { id: 'all', label: 'All Forms' },
  { id: 'student', label: 'Student' },
  { id: 'visa', label: 'Visa' },
  { id: 'work', label: 'Work' },
  { id: 'family', label: 'Family' },
  { id: 'employment', label: 'Employment' },
]

export default function FormGuidesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filtered = formGuides.filter((f) => {
    const matchSearch = f.form.toLowerCase().includes(searchQuery.toLowerCase()) || f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = selectedCategory === 'all' || f.category === selectedCategory
    return matchSearch && matchCat
  })

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1750277120336-ca98ec2e2f90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbW1pZ3JhdGlvbiUyMHBhcGVyd29yayUyMHBlbiUyMHNpZ25pbmclMjBkb2N1bWVudHxlbnwxfHx8fDE3NzUyNDE0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
        badge="Simplified form guidance"
        badgeIcon={<FileText className="h-4 w-4" />}
        title="Form Guides"
        description="Step-by-step instructions for common immigration forms—no legal jargon, just clear guidance"
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text" placeholder="Search forms..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-muted hover:bg-accent'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map((form) => (
              <details key={form.id} className="bg-white border border-border rounded-2xl overflow-hidden group">
                <summary className="p-6 cursor-pointer hover:bg-muted/50 transition-colors list-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-primary/10 text-primary rounded-xl px-4 py-2 font-semibold text-lg">{form.form}</div>
                      <div className="flex-1">
                        <h3 className="text-xl mb-1 font-medium">{form.title}</h3>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" />
                  </div>
                </summary>

                <div className="p-6 pt-0 space-y-6 border-t border-border">
                  <div className="flex gap-3 flex-wrap">
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"><Volume2 className="h-4 w-4" />Listen to Guide</button>
                    <button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"><Languages className="h-4 w-4" />Translate</button>
                    <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl hover:bg-muted transition-colors"><Download className="h-4 w-4" />Download PDF</button>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3"><span className="bg-blue-100 text-blue-600 rounded-lg px-2 py-1 text-sm">Who Needs This?</span></h4>
                    <p className="text-muted-foreground">{form.whoNeeds}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Step-by-Step Instructions</h4>
                    <ol className="space-y-2">
                      {form.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm">{idx + 1}</div>
                          <span className="text-muted-foreground pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Important Fields Explained</h4>
                    <div className="space-y-3">
                      {form.keyFields.map((field, idx) => (
                        <div key={idx} className="bg-muted rounded-xl p-4">
                          <div className="font-medium mb-1">{field.field}</div>
                          <div className="text-sm text-muted-foreground">{field.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3"><span className="bg-red-100 text-red-600 rounded-lg px-2 py-1 text-sm">Common Mistakes to Avoid</span></h4>
                    <ul className="space-y-2">
                      {form.commonMistakes.map((mistake, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-red-500 mt-1">⚠</span><span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900 mb-1">Need More Help?</div>
                      <p className="text-sm text-blue-700">
                        Visit our <Link href="/local-help" className="underline">Local Help Finder</Link> to locate immigration attorneys, notaries, and form assistance services near you.
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2 font-medium">No forms found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
