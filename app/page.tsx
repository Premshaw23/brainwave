"use client"
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { showSuccess, showError, showInfo } from '@/lib/toast';
import Image from 'next/image';
import { Brain, Sparkles, TrendingUp, Users, Zap, CheckCircle2, ArrowRight, BookOpen, Target, Award, Clock, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Prevent background scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileNavOpen]);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Learning",
      description: "Advanced algorithms adapt to your learning style, creating personalized study paths that maximize retention and understanding."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Comprehensive insights into your progress with predictive analytics that identify weak spots before they become problems."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaborative Study",
      description: "Join study groups, share resources, and learn together with real-time collaboration tools and peer accountability."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Generation",
      description: "Transform any content into flashcards, quizzes, and summaries in seconds with our advanced AI processing."
    }
  ];

  const stats = [
    { number: "5K+", label: "Active Students" },
    { number: "2M+", label: "Flashcards Created" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" }
  ];

  const benefits = [
    { icon: <Clock className="w-5 h-5" />, text: "Save 10+ hours per week on study prep" },
    { icon: <Target className="w-5 h-5" />, text: "Improve retention rates by 40%" },
    { icon: <Award className="w-5 h-5" />, text: "Track mastery across all subjects" },
    { icon: <Shield className="w-5 h-5" />, text: "Evidence-based learning methods" },
    { icon: <Globe className="w-5 h-5" />, text: "Access from any device, anywhere" },
    { icon: <BookOpen className="w-5 h-5" />, text: "Unlimited content generation" }
  ];

  // Toast for login (example: after login, user is set)
  useEffect(() => {
    if (user) {
      showSuccess(`Welcome${user.displayName ? ', ' + user.displayName : ''}!`);
    }
  }, [user]);

  // Toast for logout
  const handleLogout = () => {
    logout();
    showInfo('Logged out 👋');
  };

  return (
    <>
      {/* Overlay and mobile nav are rendered at the root so overlay covers the full viewport */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-110 lg:hidden bg-black/60 backdrop-blur-md transition-all duration-200"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close mobile menu overlay"
        ></div>
      )}
      <nav
        className={`fixed top-0 right-0 z-120 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 lg:hidden ${mobileNavOpen ? 'translate-x-0' : 'translate-x-full'} ${mobileNavOpen ? '' : 'pointer-events-none'}`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center gap-2 px-6 py-3.5 border-b bg-linear-to-r from-indigo-600 to-purple-600">
          <Image src="/logo.png" alt="BrainWave Logo" width={36} height={36} className="rounded-xl bg-white p-1 border border-indigo-100 w-9 h-9 img-optimize" />
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-white to-indigo-200 tracking-tight">BrainWave</span>
        </div>
        <div className="flex flex-col gap-2 px-6 py-6 h-[calc(100%-80px)]">
          {/* Always show nav links at the top for both states */}
          <a href="#features" className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors rounded-lg px-2" onClick={() => setMobileNavOpen(false)}>Features</a>
          <a href="#how-it-works" className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors rounded-lg px-2" onClick={() => setMobileNavOpen(false)}>How It Works</a>
          {/* <a href="#testimonials" className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors rounded-lg px-2" onClick={() => setMobileNavOpen(false)}>Reviews</a> */}
          {/* <a href="#pricing" className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors rounded-lg px-2" onClick={() => setMobileNavOpen(false)}>Pricing</a> */}
          <div className="my-2"></div>
          {user ? (
            <>
              <div className="flex flex-col items-center gap-2 bg-linear-to-r from-indigo-100 to-purple-100 rounded-xl px-3 py-4 border border-indigo-200 shadow mb-4">
                <Image src={user.photoURL || '/avatar.jpg'} alt="User Avatar" width={56} height={56} className="rounded-full w-14 h-14 object-cover border-2 border-indigo-400 img-optimize" />
                <span className="text-lg font-bold text-indigo-900">{user.displayName || 'User'}</span>
                <span className="text-xs font-medium text-gray-600">{user.email}</span>
              </div>
              <a href="/dashboard" className="block w-full text-center bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-xl transition-all mb-2 hover:scale-105">Go to Dashboard</a>
              <button className="block w-full text-center bg-red-50 text-red-600 font-semibold px-4 py-3 rounded-xl transition-all hover:bg-red-100" onClick={() => { setMobileNavOpen(false); logout(); }}>Logout</button>
            </>
          ) : (
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <button className="w-full text-gray-700 bg-white border border-gray-200 font-semibold px-4 py-3 rounded-xl transition-all hover:text-indigo-600" onClick={() => { setMobileNavOpen(false); }}>Login</button>
              <button className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-xl transition-all hover:scale-105" onClick={() => { setMobileNavOpen(false); }}>Get Started Free</button>
            </div>
          )}
        </div>
        <button
          className="absolute top-4 right-4 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80"
          aria-label="Close navigation menu"
          onClick={() => setMobileNavOpen(false)}
          style={{ zIndex: 120 }}
        >
          <svg className="w-7 h-7 text-indigo-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>
      {/* Header/Navbar at the top */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-white/80 backdrop-blur-xl'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between h-16 gap-y-2 relative">
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer select-none">
              <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                <Image
                  src="/logo.png"
                  alt="BrainWave Logo"
                  width={44}
                  height={44}
                  className="rounded-xl shadow-md object-contain bg-white p-1 border border-indigo-100 group-hover:scale-105 transition-transform w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 img-optimize"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                BrainWave
              </span>
            </div>
            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-4 lg:gap-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">How It Works</a>
              {/* <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Reviews</a> */}
              {/* <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Pricing</a> */}
            </nav>
            <div className="hidden md:flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-end md:justify-start mt-2 md:mt-0">
              {user ? (
                <>
                  <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1 border border-indigo-100 shadow-sm">
                    <Image src={user.photoURL || '/avatar.jpg'} alt="User Avatar" width={32} height={32} className="rounded-full w-8 h-8 object-cover" />
                    <span className="text-sm font-semibold text-gray-800 max-w-30 truncate">{user.email}</span>
                  </div>
                  <a href="/dashboard" className="text-indigo-700 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-xl transition-all">Dashboard</a>
                  <button className="text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-xl transition-all" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link href={"/login"}>
                    <button className=" cursor-pointer text-gray-700 hover:text-indigo-600 font-semibold px-4 py-2 rounded-xl transition-all w-full md:w-auto">
                      Login
                    </button>
                  </Link>
                  <Link href={"/signup"}>
                    <button className=" cursor-pointer bg-linear-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:scale-105 w-full md:w-auto">
                      Get Started Free
                    </button>
                  </Link>
                </>
              )}
            </div>
            {/* Hamburger for mobile (visible below lg) */}
            <button
              className="lg:hidden flex items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              <span className="sr-only">Open navigation menu</span>
              <svg className="w-7 h-7 text-indigo-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileNavOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-size-[20px_20px]"></div>
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <Sparkles className="w-4 h-4" />
                Trusted by 5000+ students worldwide
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                Master Any Subject with
                <span className="block bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI-Powered Learning
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Transform your notes into smart flashcards, adaptive quizzes, and personalized study plans.
                Study smarter, not harder, with proven AI technology.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full">
                <Link href={"/dashboard"}>
                  <button className="w-full sm:w-auto bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <button className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all border-2 border-gray-200">
                  Watch Demo
                </button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Benefits Bar */}
        <section className="py-8 sm:py-12 bg-linear-to-r from-indigo-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white">
                  <div className="shrink-0 bg-white/20 p-2 rounded-lg">
                    {benefit.icon}
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* How It Works */}
        <section id="how-it-works" className="py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-8 sm:px-8 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Your Learning Journey in
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> 4 Steps</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From upload to mastery, our AI handles the heavy lifting while you focus on learning
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: "📤", title: "Upload Content", desc: "Drop your notes, PDFs, or lecture slides", color: "from-blue-500 to-cyan-500" },
                { icon: "🤖", title: "AI Processing", desc: "Advanced AI analyzes and structures content", color: "from-purple-500 to-pink-500" },
                { icon: "📚", title: "Smart Materials", desc: "Get flashcards, quizzes, and summaries", color: "from-orange-500 to-red-500" },
                { icon: "📈", title: "Track Progress", desc: "Monitor mastery and optimize learning", color: "from-green-500 to-emerald-500" }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 bg-linear-to-br ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Everything You Need to
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Excel</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed by educators and powered by AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-indigo-300 transition-all cursor-pointer hover:shadow-xl"
                  onMouseEnter={() => setActiveFeature(idx)}
                >
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 w-14 h-14 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                      {idx === 0 && (
                        <a href="/flashcards" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                      {idx === 1 && (
                        <a href="/analytics" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                      {idx === 2 && (
                        <a href="/groups" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                      {idx === 3 && (
                        <a href="/quizzes" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section id="testimonials" className="py-16 sm:py-24 lg:py-32 bg-linear-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Loved by Students
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Worldwide</span>
            </h2>
            <p className="text-xl text-gray-600">Real success stories from our community</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: "Sarah Johnson", role: "Medical Student", avatar: "👩‍⚕️", text: "BrainWave helped me ace my anatomy exams. The AI-generated flashcards are incredibly accurate and the spaced repetition actually works!", rating: 5 },
              { name: "Alex Chen", role: "Engineering Major", avatar: "👨‍💻", text: "Cut my study time in half while improving my grades. The analytics show exactly what I need to focus on. Game changer!", rating: 5 },
              { name: "Maya Patel", role: "Law Student", avatar: "👩‍⚖️", text: "The study groups feature keeps me accountable. Love collaborating with classmates and sharing resources in real-time.", rating: 5 }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

        {/* CTA */}
        <section className="py-16 sm:py-24 lg:py-32 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-indigo-100 mb-10">
              Join 50,000+ students who are already learning smarter with BrainWave
            </p>
            <Link href={"/dashboard"}>
              <button className="bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-3">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <p className="text-indigo-100 mt-6 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-indigo-400" />
                  <span className="text-white font-bold text-xl">BrainWave</span>
                </div>
                <p className="text-sm">AI-powered learning for the modern student</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  {/* <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li> */}
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm">© 2025 BrainWave. All rights reserved.</p>
              <div className="flex gap-4 sm:gap-6">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}