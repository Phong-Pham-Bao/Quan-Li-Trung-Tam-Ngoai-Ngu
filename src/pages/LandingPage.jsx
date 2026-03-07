import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Languages, Clock, MapPin, Star, Award, Users,
  Menu, X, Globe, GraduationCap,
  MessageSquare, PlayCircle, ArrowRight, Phone, Mail
} from 'lucide-react';

const COURSES = [
  { lang: 'English', flag: '🇬🇧', level: 'All Levels', students: 320, price: '$450', color: 'bg-blue-50 border-blue-100', badge: 'Most Popular', badgeColor: 'bg-blue-600' },
  { lang: 'French', flag: '🇫🇷', level: 'Beginner – Advanced', students: 180, price: '$550', color: 'bg-indigo-50 border-indigo-100', badge: 'New', badgeColor: 'bg-indigo-600' },
  { lang: 'Japanese', flag: '🇯🇵', level: 'Beginner – Intermediate', students: 210, price: '$600', color: 'bg-pink-50 border-pink-100', badge: 'Trending', badgeColor: 'bg-pink-600' },
  { lang: 'Spanish', flag: '🇪🇸', level: 'All Levels', students: 260, price: '$450', color: 'bg-yellow-50 border-yellow-100', badge: null, badgeColor: '' },
  { lang: 'German', flag: '🇩🇪', level: 'Beginner – Intermediate', students: 145, price: '$500', color: 'bg-gray-50 border-gray-100', badge: null, badgeColor: '' },
  { lang: 'Chinese', flag: '🇨🇳', level: 'All Levels', students: 190, price: '$580', color: 'bg-red-50 border-red-100', badge: 'Hot', badgeColor: 'bg-red-600' },
];

const TESTIMONIALS = [
  { name: 'Emily Carter', role: 'English Student', avatar: 'EC', text: 'LinguaCenter completely transformed my English skills. The teachers are patient and the online platform is incredibly easy to use.', rating: 5 },
  { name: 'Marco Bianchi', role: 'French Student', avatar: 'MB', text: 'In just 6 months I went from zero French to confidently holding conversations. The structured curriculum really works!', rating: 5 },
  { name: 'Yuki Tanaka', role: 'Japanese Student', avatar: 'YT', text: 'Learning Japanese here was an amazing experience. The cultural context they provide makes everything click into place.', rating: 5 },
];

const STATS = [
  { value: '12+', label: 'Languages Offered' },
  { value: '1,500+', label: 'Active Students' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '15+', label: 'Years Experience' },
];

const DUMMY_ACCOUNTS = [
  { role: 'Admin', username: 'admin@lingua.com', password: 'Admin@2026', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: '🛡️' },
  { role: 'Teacher', username: 'teacher@lingua.com', password: 'Teach@2026', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '📚' },
  { role: 'Student', username: 'student@lingua.com', password: 'Study@2026', color: 'bg-sky-100 text-sky-700 border-sky-200', icon: '🎓' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-200">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">Lingua</span>
                <span className="text-lg font-bold text-violet-600 tracking-tight">Center</span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-7">
              {['Courses', 'About', 'Teachers', 'Testimonials', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">{item}</a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-gray-700 font-medium hover:text-violet-600">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 rounded-full px-5">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            {['Courses', 'About', 'Teachers', 'Testimonials', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-violet-600 py-1">{item}</a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="flex-1 bg-violet-600 hover:bg-violet-700 text-white">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                <Globe className="w-4 h-4" /> #1 Language Learning Center
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Learn a New Language,
                <span className="text-violet-600 block mt-1">Open New Worlds</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                Join over 1,500 students mastering 12+ languages with expert teachers, flexible schedules, and a proven curriculum that delivers real results.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 shadow-lg shadow-violet-200 gap-2">
                  <Link to="/register">Start Learning Free <ArrowRight className="w-4 h-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600">
                  <PlayCircle className="w-4 h-4" /> Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  {['A','B','C','D'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ['#7c3aed','#6366f1','#8b5cf6','#a78bfa'][i] }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-xs text-gray-500 mt-0.5">1,500+ happy students</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-200/50 border border-violet-100">
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&q=80" alt="Students learning languages" className="w-full h-[480px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><Award className="w-5 h-5 text-emerald-600" /></div>
                <div><p className="text-xs text-gray-500">Completion Rate</p><p className="text-lg font-bold text-gray-900">98%</p></div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center"><Users className="w-5 h-5 text-violet-600" /></div>
                <div><p className="text-xs text-gray-500">Active Students</p><p className="text-lg font-bold text-gray-900">1,500+</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 bg-violet-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
                <p className="text-sm text-violet-200 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-violet-600 tracking-widest uppercase">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Our Language Courses</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Structured programs for every level, led by certified native and near-native instructors.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((c, i) => (
              <div key={i} className={`relative rounded-2xl border-2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${c.color}`}>
                {c.badge && <span className={`absolute top-4 right-4 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${c.badgeColor}`}>{c.badge}</span>}
                <div className="text-4xl mb-4">{c.flag}</div>
                <h3 className="text-xl font-bold text-gray-900">{c.lang}</h3>
                <p className="text-sm text-gray-500 mt-1">{c.level}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.students} students</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 3 months</span>
                </div>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/5">
                  <span className="text-xl font-extrabold text-gray-900">{c.price}<span className="text-sm font-normal text-gray-400">/course</span></span>
                  <Button size="sm" asChild className="bg-violet-600 hover:bg-violet-700 text-white rounded-full text-xs px-4">
                    <Link to="/register">Enroll Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / WHY US */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=650&q=80" alt="Teacher in classroom" className="rounded-3xl shadow-2xl shadow-violet-100 border border-violet-100 w-full h-[420px] object-cover" />
            </div>
            <div className="space-y-6">
              <span className="text-sm font-semibold text-violet-600 tracking-widest uppercase">Why LinguaCenter</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">A Modern Approach to Language Mastery</h2>
              <p className="text-gray-500 leading-relaxed">We combine communicative teaching methods with a smart learning management platform so students progress faster, stay motivated, and achieve fluency — not just grades.</p>
              <div className="space-y-4">
                {[
                  { icon: GraduationCap, title: 'Certified Instructors', desc: 'All teachers hold internationally recognized language certifications' },
                  { icon: Clock, title: 'Flexible Schedules', desc: 'Morning, afternoon and evening classes to fit your lifestyle' },
                  { icon: Award, title: 'Accredited Certificates', desc: 'Earn certificates recognized by universities and employers worldwide' },
                  { icon: MessageSquare, title: 'Small Class Sizes', desc: 'Maximum 25 students per class for personalized attention' },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <f.icon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{f.title}</p>
                      <p className="text-sm text-gray-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      <section id="teachers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-violet-600 tracking-widest uppercase">Our Faculty</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Meet Our Expert Teachers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Sarah Mitchell', lang: 'English', exp: '8 years', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
              { name: 'Jean-Paul Dubois', lang: 'French', exp: '11 years', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
              { name: 'Yuki Nakamura', lang: 'Japanese', exp: '7 years', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
              { name: 'Carlos Vega', lang: 'Spanish', exp: '9 years', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
            ].map((t, i) => (
              <div key={i} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Button size="sm" asChild className="w-full bg-white text-violet-700 hover:bg-violet-50 text-xs rounded-full">
                      <Link to="/register">View Profile</Link>
                    </Button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <p className="text-sm text-violet-600 font-medium">{t.lang} Instructor</p>
                <p className="text-xs text-gray-400 mt-1">{t.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-violet-600 tracking-widest uppercase">Student Stories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">What Our Students Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-violet-50 hover:shadow-xl transition-shadow">
                <div className="flex gap-0.5 mb-4">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-gray-600 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">Ready to Start Your Language Journey?</h2>
          <p className="text-violet-200 text-lg">Join thousands of students already achieving fluency. First lesson is free!</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild className="bg-white text-violet-700 hover:bg-violet-50 rounded-full px-8 font-bold shadow-xl gap-2">
              <Link to="/register">Register Now <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowAccountsModal(true)} className="border-white/50 text-white hover:bg-white/10 rounded-full px-8">
              View Demo Accounts
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-sm font-semibold text-violet-600 tracking-widest uppercase">Get In Touch</span>
              <h2 className="text-3xl font-extrabold text-gray-900">We're Here to Help You Choose the Right Course</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: '+1 (555) 234-5678' },
                  { icon: Mail, label: 'hello@linguacenter.com' },
                  { icon: MapPin, label: '123 Language Ave, Learning City, LC 90210' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                      <c.icon className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className="text-sm">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Send us a message</h3>
              <div className="space-y-3">
                <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" placeholder="Full Name" />
                <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" placeholder="Email Address" type="email" />
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white text-gray-500">
                  <option>Interested in...</option>
                  {COURSES.map(c => <option key={c.lang}>{c.lang} Course</option>)}
                </select>
                <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white resize-none" rows={3} placeholder="Your message..." />
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Languages className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">LinguaCenter</span>
              </div>
              <p className="text-sm leading-relaxed">Empowering students worldwide to communicate confidently in any language.</p>
              <div className="flex gap-3">
                {[Mail, Mail, Mail, Mail].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors cursor-pointer">
                    <Icon className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Courses</h4>
              <ul className="space-y-2 text-sm">{['English', 'French', 'Japanese', 'Spanish', 'German', 'Chinese'].map(l => <li key={l}><a href="#courses" className="hover:text-violet-400 transition-colors">{l}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">{['About Us', 'Our Teachers', 'Testimonials', 'Blog', 'Careers', 'Contact'].map(l => <li key={l}><a href="#" className="hover:text-violet-400 transition-colors">{l}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Access Portal</h4>
              <div className="space-y-2">
                <Button asChild variant="outline" size="sm" className="w-full justify-start border-gray-700 text-gray-300 hover:border-violet-500 hover:text-violet-400 bg-transparent text-xs">
                  <Link to="/login">Sign In to Dashboard</Link>
                </Button>
                <Button asChild size="sm" className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs">
                  <Link to="/register">Register Account</Link>
                </Button>
                <button onClick={() => setShowAccountsModal(true)} className="text-xs text-violet-400 hover:underline w-full text-left pt-1">View demo accounts →</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <p>© 2026 LinguaCenter. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-violet-400">Privacy Policy</a>
              <a href="#" className="hover:text-violet-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* DEMO ACCOUNTS MODAL */}
      {showAccountsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAccountsModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Demo Accounts</h2>
                <p className="text-xs text-gray-500 mt-0.5">Use these to explore the platform</p>
              </div>
              <button onClick={() => setShowAccountsModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {DUMMY_ACCOUNTS.map((a, i) => (
                <div key={i} className={`rounded-xl border p-4 ${a.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{a.icon}</span>
                    <span className="font-bold text-sm">{a.role} Account</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between"><span className="opacity-70">Username:</span><span className="font-semibold">{a.username}</span></div>
                    <div className="flex justify-between"><span className="opacity-70">Password:</span><span className="font-semibold">{a.password}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">These are demonstration credentials for preview purposes only.</p>
            <Button asChild className="w-full mt-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2">
              <Link to="/login">Go to Login <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
