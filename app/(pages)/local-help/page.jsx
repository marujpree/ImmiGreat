'use client'

import { useState } from 'react'
import { MapPin, Search, Phone, Clock, DollarSign, Languages, Star, Navigation, Building2, Scale, MessageCircle, Users, FileText } from 'lucide-react'
import PageBanner from '@/components/PageBanner'

const serviceTypes = [
  { id: 'all', label: 'All Services', icon: Building2 },
  { id: 'lawyer', label: 'Immigration Lawyers', icon: Scale },
  { id: 'notary', label: 'Notaries', icon: FileText },
  { id: 'interpreter', label: 'Interpreters', icon: MessageCircle },
  { id: 'community', label: 'Community Centers', icon: Users },
]

const localServices = [
  { id: 1, name: 'Immigration Legal Services Center', type: 'lawyer', address: '123 Main Street, Suite 200', city: 'New York, NY 10001', phone: '(212) 555-0100', hours: 'Mon-Fri: 9AM-6PM', cost: 'Free consultation, sliding scale fees', languages: ['English', 'Español', '中文', 'العربية'], rating: 4.8, reviews: 127, distance: '0.5 miles', services: ['Visa applications', 'Green card assistance', 'Citizenship prep', 'Deportation defense'], description: 'Non-profit organization providing affordable immigration legal services to low-income individuals and families.' },
  { id: 2, name: 'Community Welcome Center', type: 'community', address: '456 Oak Avenue', city: 'New York, NY 10002', phone: '(212) 555-0200', hours: 'Mon-Sat: 8AM-8PM', cost: 'Free', languages: ['English', 'Español', 'Français', 'Português', 'हिन्दी'], rating: 4.9, reviews: 203, distance: '0.8 miles', services: ['English classes', 'Job search help', 'Document assistance', 'Cultural orientation'], description: 'Welcoming community center offering free resources, classes, and support for immigrants.' },
  { id: 3, name: 'Maria Rodriguez - Certified Notary', type: 'notary', address: '789 Park Street', city: 'New York, NY 10003', phone: '(212) 555-0300', hours: 'Mon-Fri: 10AM-7PM, Sat: 10AM-4PM', cost: '$15-25 per notarization', languages: ['English', 'Español'], rating: 5.0, reviews: 89, distance: '1.2 miles', services: ['Document notarization', 'Apostille services', 'Translation certification', 'Mobile notary available'], description: 'Experienced notary public specializing in immigration documents with bilingual services.' },
  { id: 4, name: 'Global Language Services', type: 'interpreter', address: '321 Broadway, Floor 5', city: 'New York, NY 10004', phone: '(212) 555-0400', hours: '24/7 (by appointment)', cost: '$50-100/hour depending on language', languages: ['50+ languages available'], rating: 4.7, reviews: 156, distance: '1.5 miles', services: ['Medical interpretation', 'Legal interpretation', 'Document translation', 'Phone/video interpretation'], description: 'Professional interpretation and translation services for medical, legal, and business settings.' },
  { id: 5, name: 'Immigrant Rights Law Firm', type: 'lawyer', address: '555 Fifth Avenue, 10th Floor', city: 'New York, NY 10005', phone: '(212) 555-0500', hours: 'Mon-Fri: 8:30AM-5:30PM', cost: 'Initial consultation: $150', languages: ['English', 'Español', '한국어'], rating: 4.6, reviews: 94, distance: '2.0 miles', services: ['Family-based immigration', 'Employment visas', 'Asylum cases', 'Appeals'], description: 'Full-service immigration law firm with experienced attorneys handling complex cases.' },
  { id: 6, name: 'New Beginnings Resource Hub', type: 'community', address: '888 Community Boulevard', city: 'New York, NY 10006', phone: '(212) 555-0600', hours: 'Tue-Sat: 9AM-6PM', cost: 'Free (donations welcome)', languages: ['English', 'Español', 'Français', 'Kreyòl', 'বাংলা'], rating: 4.8, reviews: 178, distance: '2.3 miles', services: ['Legal workshops', 'ESL classes', 'Food pantry', 'Childcare', 'Job training'], description: 'Comprehensive community center providing wraparound services for immigrant families.' },
]

export default function LocalHelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const filtered = localServices.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.services.some((sv) => sv.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchService = selectedService === 'all' || s.type === selectedService
    const matchLang = selectedLanguage === 'all' || s.languages.some((l) => l.includes(selectedLanguage)) || s.languages.includes('50+ languages available')
    return matchSearch && matchService && matchLang
  })

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1758778932790-da96c9f06969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjZW50ZXIlMjBoZWxwaW5nJTIwcGVvcGxlJTIwdm9sdW50ZWVyc3xlbnwxfHx8fDE3NzUyNDE0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        badge="Find help near you"
        badgeIcon={<MapPin className="h-4 w-4" />}
        title="Local Help Finder"
        description="Discover nearby immigration lawyers, notaries, interpreters, and community centers—filtered by services, languages, and cost"
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white border border-border rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text" placeholder="Search by name or service..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
                  className="px-4 py-3 border border-border rounded-xl bg-input-background focus:outline-none focus:ring-2 focus:ring-primary">
                  {serviceTypes.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-3 border border-border rounded-xl bg-input-background focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="all">All Languages</option>
                  <option value="English">English</option>
                  <option value="Español">Español</option>
                  <option value="中文">中文</option>
                  <option value="العربية">العربية</option>
                  <option value="Français">Français</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Found {filtered.length} service{filtered.length !== 1 ? 's' : ''} near you
          </div>

          <div className="space-y-6">
            {filtered.map((service) => (
              <div key={service.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-xl mb-1 font-medium">{service.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{service.address}, {service.city}</span>
                        <span className="text-primary">• {service.distance}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-primary" /><span>{service.phone}</span></div>
                      <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-secondary" /><span>{service.hours}</span></div>
                      <div className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-green-600" /><span>{service.cost}</span></div>
                      <div className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /><span>{service.rating} ({service.reviews} reviews)</span></div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2"><Languages className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium">Languages:</span></div>
                      <div className="flex flex-wrap gap-2">
                        {service.languages.map((lang, idx) => (
                          <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full">{lang}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Services Offered:</div>
                      <div className="flex flex-wrap gap-2">
                        {service.services.map((s, idx) => (
                          <span key={idx} className="text-xs bg-muted px-3 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:w-48">
                    <button className="bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" /> Call Now
                    </button>
                    <button className="bg-secondary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <Navigation className="h-4 w-4" /> Get Directions
                    </button>
                    <button className="border border-border px-6 py-3 rounded-xl hover:bg-muted transition-colors">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2 font-medium">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}

          <div className="mt-12 bg-muted rounded-2xl p-8 border border-border">
            <div className="flex items-start gap-3">
              <Building2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl mb-2 font-medium">Want to add your service?</h3>
                <p className="text-muted-foreground mb-4">If you provide immigration-related services and want to be listed in our directory, contact us to learn more.</p>
                <button className="bg-primary text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity">Contact Us</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
