'use client'

import { useState } from 'react'
import { Search, Volume2, Languages, BookOpen, Heart, Building2, Briefcase, GraduationCap, Home, DollarSign } from 'lucide-react'
import PageBanner from '@/components/PageBanner'

const categories = [
  { id: 'all', label: 'All', icon: BookOpen },
  { id: 'legal', label: 'Legal', icon: Building2 },
  { id: 'healthcare', label: 'Healthcare', icon: Heart },
  { id: 'banking', label: 'Banking', icon: DollarSign },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'school', label: 'School', icon: GraduationCap },
  { id: 'housing', label: 'Housing', icon: Home },
]

const resources = [
  { id: 'ssn', title: 'Social Security Number (SSN)', category: 'legal', definition: 'A unique 9-digit number issued by the Social Security Administration used to track your earnings and determine eligibility for benefits.', why: 'You need an SSN to work legally, pay taxes, open bank accounts, get credit cards, and access many services in the U.S.', howToGet: 'Apply at your local Social Security office after arriving in the U.S. with valid work authorization. Bring your passport, visa, I-94, and work authorization documents.', relatedLinks: ['Work Authorization', 'Opening a Bank Account'] },
  { id: 'green-card', title: 'Green Card (Permanent Residence)', category: 'legal', definition: 'Official document proving you are a lawful permanent resident of the United States, allowing you to live and work permanently.', why: 'Green card holders can live and work anywhere in the U.S., travel freely, sponsor certain family members, and eventually apply for citizenship.', howToGet: 'Typically obtained through family sponsorship, employment, refugee/asylum status, or diversity visa lottery.', relatedLinks: ['Path to Citizenship', 'Family-Based Immigration'] },
  { id: 'ead', title: 'Employment Authorization Document (EAD)', category: 'work', definition: 'A card issued by USCIS that proves you are authorized to work in the United States for a specific period.', why: 'Required for many visa categories that don\'t automatically include work authorization. Allows you to work for any U.S. employer.', howToGet: 'File Form I-765 with USCIS. Requirements vary by visa category. Processing typically takes 3-5 months.', relatedLinks: ['Form I-765 Guide', 'Work Authorization'] },
  { id: 'ein', title: 'Employer Identification Number (EIN)', category: 'work', definition: 'A unique 9-digit number assigned by the IRS to businesses for tax purposes, similar to an SSN for businesses.', why: 'Required if you own a business, have employees, or operate as certain business structures.', howToGet: 'Apply online at IRS.gov for free. Instant approval for most applicants.', relatedLinks: ['Starting a Business', 'Tax Obligations'] },
  { id: 'medicaid', title: 'Medicaid', category: 'healthcare', definition: 'Government health insurance program for low-income individuals and families. Coverage varies by state.', why: 'Provides free or low-cost healthcare coverage including doctor visits, hospital care, prescriptions, and preventive services.', howToGet: "Apply through your state's Medicaid office or Healthcare.gov. Eligibility depends on income, family size, and immigration status.", relatedLinks: ['Healthcare Marketplace', 'Community Health Centers'] },
  { id: 'health-insurance', title: 'Health Insurance', category: 'healthcare', definition: 'Coverage that pays for medical expenses. Can be through employer, government program, or private purchase.', why: 'Medical care in the U.S. is very expensive. Insurance protects you from high costs and ensures access to care.', howToGet: 'Many employers offer health insurance. You can also buy through Healthcare.gov marketplace during open enrollment.', relatedLinks: ['Medicaid', 'Affordable Care Act'] },
  { id: 'checking-account', title: 'Checking Account', category: 'banking', definition: 'A bank account used for everyday transactions like deposits, withdrawals, bill payments, and debit card purchases.', why: 'Essential for managing money, receiving paychecks, paying bills, and building financial history in the U.S.', howToGet: 'Visit a bank or credit union with your passport, I-94, and proof of address. Most require minimum deposit.', relatedLinks: ['Opening a Bank Account', 'Banking Basics'] },
  { id: 'credit-score', title: 'Credit Score', category: 'banking', definition: 'A number (300-850) representing your creditworthiness based on your credit history.', why: 'Affects your ability to get loans, credit cards, apartments, and sometimes jobs.', howToGet: 'Build credit by using a credit card responsibly, paying all bills on time, and maintaining accounts over time.', relatedLinks: ['Building Credit', 'Credit Cards for Beginners'] },
  { id: 'lease', title: 'Lease Agreement', category: 'housing', definition: 'A legal contract between you and a landlord that specifies terms of renting property.', why: 'Protects both tenant and landlord rights. Defines responsibilities, payment terms, and rules.', howToGet: 'Sign a lease when renting an apartment or house. Read carefully before signing.', relatedLinks: ['Lease Agreement Guide', 'Tenant Rights'] },
  { id: 'w2', title: 'Form W-2', category: 'work', definition: 'Annual form from your employer showing how much you earned and how much tax was withheld.', why: 'Required to file taxes. Shows your income and prepaid taxes.', howToGet: 'Employers must provide W-2 by January 31st for previous year.', relatedLinks: ['Filing Taxes', 'Form W-4'] },
  { id: 'fafsa', title: 'FAFSA', category: 'school', definition: 'Federal form used to apply for financial aid for college, including grants, loans, and work-study programs.', why: 'Opens access to federal and state financial aid, scholarships, and loans.', howToGet: 'Complete online at fafsa.gov annually. Requires FSA ID, tax information, and financial details.', relatedLinks: ['Paying for College', 'Scholarships'] },
  { id: 'drivers-license', title: "Driver's License", category: 'legal', definition: 'Official state-issued card that permits you to drive and serves as primary ID in the U.S.', why: 'Needed to drive legally. Also most widely accepted form of ID for banking, travel, and other services.', howToGet: "Visit your state's DMV. Take written test, vision test, and driving test.", relatedLinks: ['State ID Card', 'DMV Basics'] },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.definition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory
    return matchSearch && matchCat
  })

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1549439548-22601048c6b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjBsaWJyYXJ5JTIwYm9va3MlMjByZWFkaW5nJTIwc3R1ZHl8ZW58MXx8fHwxNzc1MjQxNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
        badge="Clear, accessible definitions"
        badgeIcon={<BookOpen className="h-4 w-4" />}
        title="Resource Library"
        description="Understand important terms, documents, and processes—explained in plain language without legal jargon"
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text" placeholder="Search resources..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-muted hover:bg-accent'}`}
                  >
                    <Icon className="h-4 w-4" />{cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((resource) => (
              <div key={resource.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl flex-1 font-medium">{resource.title}</h3>
                  <div className="flex gap-2">
                    <button className="text-primary hover:bg-primary/10 rounded-lg p-2 transition-colors" aria-label="Listen"><Volume2 className="h-5 w-5" /></button>
                    <button className="text-secondary hover:bg-secondary/10 rounded-lg p-2 transition-colors" aria-label="Translate"><Languages className="h-5 w-5" /></button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">What is it?</div>
                    <p className="text-muted-foreground">{resource.definition}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-secondary font-semibold mb-1">Why do you need it?</div>
                    <p className="text-muted-foreground">{resource.why}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-orange-500 font-semibold mb-1">How to get it?</div>
                    <p className="text-muted-foreground">{resource.howToGet}</p>
                  </div>
                  {resource.relatedLinks?.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Related Topics</div>
                      <div className="flex flex-wrap gap-2">
                        {resource.relatedLinks.map((link, idx) => (
                          <button key={idx} className="text-xs bg-muted hover:bg-primary hover:text-white px-3 py-1 rounded-full transition-colors">{link}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2 font-medium">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter</p>
            </div>
          )}

          <div className="mt-12 bg-muted rounded-2xl p-8 text-center">
            <h2 className="text-2xl mb-4 font-medium">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our chatbot assistant can answer specific questions about immigration, forms, and settling in the U.S.
            </p>
            <button className="bg-primary text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">Ask a Question</button>
          </div>
        </div>
      </div>
    </div>
  )
}
