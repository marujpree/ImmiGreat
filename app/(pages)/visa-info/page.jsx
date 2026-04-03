'use client'

import { useState } from 'react'
import { GraduationCap, Briefcase, Heart, Users, Globe, AlertCircle, ChevronDown, ChevronUp, FileText, Clock, CheckCircle } from 'lucide-react'
import PageBanner from '@/components/PageBanner'
import Link from 'next/link'

const visaCategories = [
  {
    id: 'student', title: 'Student Visas', icon: GraduationCap, color: 'bg-primary',
    visas: [
      { id: 'f1', type: 'F-1', name: 'Academic Student', purpose: 'Pursue academic studies at a U.S. college, university, high school, or language training program', eligibility: ['Accepted by a SEVP-certified school', 'Enrolled full-time in an academic program', 'Proficient in English or enrolled in English language courses', 'Sufficient funds to support yourself'], restrictions: { work: 'On-campus work up to 20 hrs/week during school. Off-campus work requires authorization (CPT/OPT).', travel: 'Can travel with valid F-1 visa and I-20. Travel signature required on I-20 if abroad 5+ months.', duration: 'Duration of Status (D/S) — as long as you maintain student status' }, documents: ['Form I-20 from your school', 'Valid passport', 'DS-160 confirmation', 'SEVIS fee receipt', 'Financial documents', 'Academic transcripts'], timeline: 'Visa interview wait times vary by country (typically 2-8 weeks). Apply as soon as you receive your I-20.', rights: ['Study full-time at SEVP-approved school', 'Work on-campus up to 20 hours per week', 'Apply for practical training (CPT/OPT)', 'Travel in and out of the U.S. with proper documentation'] },
      { id: 'm1', type: 'M-1', name: 'Vocational Student', purpose: 'Pursue vocational or technical training at a U.S. institution', eligibility: ['Accepted by a SEVP-certified vocational school', 'Enrolled full-time in a vocational program', 'Sufficient funds for tuition and living expenses'], restrictions: { work: 'No on-campus employment except practical training after completing studies.', travel: 'Can travel with valid M-1 visa and I-20.', duration: 'Length of program plus 30 days. Maximum of 1 year.' }, documents: ['Form I-20 from vocational school', 'Valid passport', 'DS-160 confirmation', 'SEVIS fee receipt', 'Proof of financial support'], timeline: 'Similar to F-1 visa processing times', rights: ['Study full-time at approved vocational school', 'Limited practical training after completion'] },
    ]
  },
  {
    id: 'work', title: 'Work Visas', icon: Briefcase, color: 'bg-secondary',
    visas: [
      { id: 'h1b', type: 'H-1B', name: 'Specialty Occupation', purpose: "Work in a specialty occupation that requires specialized knowledge and a bachelor's degree or higher", eligibility: ['Job offer from U.S. employer', "Job requires bachelor's degree or higher in a specific field", 'Employer has approved Labor Condition Application (LCA)'], restrictions: { work: 'Can only work for sponsoring employer. Can change employers with new H-1B petition.', travel: 'Can travel freely with valid H-1B visa and approval notice.', duration: 'Initially 3 years, extendable to 6 years total.' }, documents: ['Form I-129 (filed by employer)', 'Labor Condition Application (LCA)', 'Degree certificates', 'Employment letter', 'Valid passport'], timeline: 'Cap-subject H-1Bs filed in March/April for October start. Premium processing available (15 days).', rights: ['Work for sponsoring employer', 'Bring spouse and children on H-4 visas', 'Travel in and out of the U.S.', 'Apply for green card while maintaining H-1B'] },
      { id: 'o1', type: 'O-1', name: 'Extraordinary Ability', purpose: 'Work in the U.S. if you have extraordinary ability in sciences, arts, education, business, or athletics', eligibility: ['Demonstrated extraordinary ability through sustained national or international acclaim', 'Recognition in your field through awards, publications, or other evidence'], restrictions: { work: 'Can work for multiple employers with multiple O-1 approvals.', travel: 'Can travel freely with valid O-1 visa.', duration: 'Initially up to 3 years, renewable in 1-year increments indefinitely.' }, documents: ['Form I-129', 'Evidence of extraordinary ability', 'Written advisory opinion', 'Awards, publications, press coverage'], timeline: 'Standard processing 2-4 months. Premium processing available (15 days).', rights: ['Work in area of extraordinary ability', 'Work for multiple employers', 'Bring dependents on O-3 visas', 'Renewable indefinitely'] },
    ]
  },
  {
    id: 'family', title: 'Family-Based Visas', icon: Heart, color: 'bg-primary',
    visas: [
      { id: 'ir', type: 'IR', name: 'Immediate Relative', purpose: 'Immigrate as immediate relative of U.S. citizen (spouse, unmarried child under 21, or parent)', eligibility: ['U.S. citizen sponsor who is spouse, parent, or child over 21', 'Qualifying relationship documented', 'Sponsor meets income requirements'], restrictions: { work: 'Upon receiving green card, can work without restrictions.', travel: 'Can travel freely once you receive green card.', duration: 'Leads to permanent residence (green card).' }, documents: ['Form I-130 (petition)', 'Form I-485 (if in U.S.) or DS-260 (if abroad)', 'Birth/marriage certificates', 'Financial documents (I-864)', 'Medical examination'], timeline: 'No annual limits. Processing typically 10-18 months.', rights: ['Permanent residence in the U.S.', 'Work without restrictions', 'Travel freely', 'Path to citizenship after 3-5 years'] },
    ]
  },
  {
    id: 'humanitarian', title: 'Humanitarian Visas', icon: Users, color: 'bg-secondary',
    visas: [
      { id: 'asylum', type: 'Asylum', name: 'Asylum Status', purpose: 'Seek protection if you are unable or unwilling to return to your country due to persecution', eligibility: ['Fear of persecution based on race, religion, nationality, political opinion, or social group', 'Apply within 1 year of arrival (with some exceptions)', 'Pass credible fear screening'], restrictions: { work: 'Can apply for work authorization after 150 days from filing asylum application.', travel: 'Should not travel to home country without Refugee Travel Document.', duration: 'Once granted, can remain indefinitely. Can apply for green card after 1 year.' }, documents: ['Form I-589', 'Personal statement', 'Country condition reports', 'Supporting evidence', 'Identity documents'], timeline: 'Varies widely. Initial interview typically within 45 days of filing.', rights: ['Protection from removal', 'Work authorization', 'Access to certain public benefits', 'Apply for green card after 1 year'] },
    ]
  },
]

export default function VisaPage() {
  const [expandedVisa, setExpandedVisa] = useState('f1')

  function toggleVisa(id) {
    setExpandedVisa(expandedVisa === id ? null : id)
  }

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1655722723123-c68bdb4f3ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVUyUyMHBhc3Nwb3J0JTIwdmlzYSUyMGRvY3VtZW50cyUyMG9mZmljaWFsfGVufDF8fHx8MTc3NTI0MTQ3MXww&ixlib=rb-4.1.0&q=80&w=1080"
        badge="Comprehensive visa guide"
        badgeIcon={<Globe className="h-4 w-4" />}
        title="U.S. Visa Information"
        description="Everything you need to know about U.S. visa types, requirements, and processes—explained in clear, accessible language"
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-muted rounded-2xl p-6 mb-12 border border-border">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Important Note</h3>
                <p className="text-muted-foreground text-sm">
                  This guide provides general information about common visa types. Immigration law is complex and changes frequently.
                  Always verify current requirements on official government websites (USCIS.gov, State.gov) or consult with an immigration attorney.
                  Use our <Link href="/local-help" className="text-primary hover:underline">Local Help Finder</Link> to locate immigration attorneys near you.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {visaCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.id}>
                  <div className={`${category.color} text-white rounded-2xl p-6 mb-4`}>
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8" />
                      <h2 className="text-3xl font-medium">{category.title}</h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {category.visas.map((visa) => (
                      <div key={visa.id} className="bg-white border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleVisa(visa.id)}
                          className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="bg-primary/10 text-primary rounded-lg px-3 py-1 font-semibold">{visa.type}</div>
                            <div>
                              <h3 className="text-xl mb-1 font-medium">{visa.name}</h3>
                              <p className="text-sm text-muted-foreground">{visa.purpose}</p>
                            </div>
                          </div>
                          {expandedVisa === visa.id
                            ? <ChevronUp className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                            : <ChevronDown className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                        </button>

                        {expandedVisa === visa.id && (
                          <div className="p-6 pt-0 space-y-6 border-t border-border">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="h-5 w-5 text-secondary" />
                                <h4 className="font-semibold">Eligibility Criteria</h4>
                              </div>
                              <ul className="space-y-2 ml-7">
                                {visa.eligibility.map((item, idx) => (
                                  <li key={idx} className="text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span><span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="bg-blue-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2"><Briefcase className="h-4 w-4 text-blue-600" /><h5 className="font-semibold text-sm">Work Rights</h5></div>
                                <p className="text-sm text-muted-foreground">{visa.restrictions.work}</p>
                              </div>
                              <div className="bg-green-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2"><Globe className="h-4 w-4 text-green-600" /><h5 className="font-semibold text-sm">Travel Rules</h5></div>
                                <p className="text-sm text-muted-foreground">{visa.restrictions.travel}</p>
                              </div>
                              <div className="bg-purple-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2"><Clock className="h-4 w-4 text-purple-600" /><h5 className="font-semibold text-sm">Duration</h5></div>
                                <p className="text-sm text-muted-foreground">{visa.restrictions.duration}</p>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-3"><FileText className="h-5 w-5 text-orange-500" /><h4 className="font-semibold">Required Documents</h4></div>
                              <div className="grid md:grid-cols-2 gap-2 ml-7">
                                {visa.documents.map((doc, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />{doc}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-3"><Clock className="h-5 w-5 text-indigo-500" /><h4 className="font-semibold">Typical Timeline</h4></div>
                              <p className="text-muted-foreground ml-7">{visa.timeline}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-3"><Users className="h-5 w-5 text-pink-500" /><h4 className="font-semibold">Your Rights</h4></div>
                              <ul className="space-y-2 ml-7">
                                {visa.rights.map((right, idx) => (
                                  <li key={idx} className="text-muted-foreground flex items-start gap-2">
                                    <span className="text-secondary mt-1">✓</span><span>{right}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 bg-muted rounded-2xl p-8">
            <h2 className="text-2xl mb-4 font-medium">Need Help With Status Changes?</h2>
            <p className="text-muted-foreground mb-6">
              Changing from one visa status to another involves specific procedures and requirements. Always maintain your current status while an application is pending.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/form-guides" className="inline-flex items-center gap-2 bg-white border border-border px-6 py-3 rounded-xl hover:bg-muted transition-colors">
                <FileText className="h-5 w-5" /> View Form Guides
              </Link>
              <Link href="/local-help" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                <Users className="h-5 w-5" /> Find Immigration Lawyer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
