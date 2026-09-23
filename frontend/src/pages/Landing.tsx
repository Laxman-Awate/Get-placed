import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Zap, ChevronRight, BookOpen, Code2, Brain, Server, ClipboardList,
  Users, FileText, Star, ArrowRight, CheckCircle, Sparkles, TrendingUp, Target,
  Menu, X
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'Aptitude Mastery', desc: 'Quantitative, logical & verbal with 5000+ questions', color: 'from-teal-500 to-cyan-400' },
  { icon: Code2, title: 'Coding Practice', desc: 'DSA problems with multi-language support & editorials', color: 'from-blue-500 to-indigo-500' },
  { icon: Server, title: 'DSA Concepts', desc: 'Structured learning from arrays to advanced algorithms', color: 'from-purple-500 to-violet-500' },
  { icon: BookOpen, title: 'Core CS Subjects', desc: 'OS, DBMS, CN, OOP — interview-focused content', color: 'from-orange-500 to-amber-500' },
  { icon: ClipboardList, title: 'Mock Tests', desc: 'Company-wise full-length tests with detailed analysis', color: 'from-pink-500 to-rose-500' },
  { icon: Users, title: 'Interview Prep', desc: 'Technical, HR, behavioral & AI-powered mock interviews', color: 'from-green-500 to-emerald-500' },
  { icon: FileText, title: 'Resume Builder', desc: 'ATS-optimized templates with real-time score tracking', color: 'from-yellow-500 to-orange-400' },
  { icon: TrendingUp, title: 'Career Roadmap', desc: 'Personalized 4-level journey to placement readiness', color: 'from-cyan-500 to-teal-400' },
];

const stats = [
  { value: '50K+', label: 'Students Placed' },
  { value: '500+', label: 'Companies Covered' },
  { value: '10K+', label: 'Practice Problems' },
  { value: '98%', label: 'Success Rate' },
];

const testimonials = [
  { name: 'Riya Sharma', role: 'Placed at Google · 28 LPA', text: 'LevelUp\'s structured roadmap and daily mock tests helped me crack Google in just 3 months!' },
  { name: 'Karan Mehta', role: 'Placed at Amazon · 22 LPA', text: 'The company-specific prep and leadership principles section was exactly what I needed for Amazon.' },
  { name: 'Priya Nair', role: 'Placed at TCS · 7 LPA', text: 'As a non-CS student, LevelUp\'s step-by-step roadmap made aptitude and coding accessible to me.' },
];

const navLinks = ['Learning Paths', 'Practice', 'Coding', 'Mock Tests', 'Companies', 'Resources'];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080810] text-[#f1f5f9] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 border-b border-[#1e1e30] bg-[#080810]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg font-[Plus_Jakarta_Sans]">LevelUp</span>
        </div>

        <div className="hidden md:flex items-center gap-5 text-sm text-[#64748b]">
          <a href="#" className="text-teal-400 font-medium">Home</a>
          {navLinks.map(item => (
            <a key={item} href="#" className="hover:text-teal-400 transition-colors">{item}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-[#94a3b8] hover:text-white transition-colors px-3 py-1.5">Login</Link>
          <button
            onClick={() => navigate('/register')}
            className="text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-teal-500/20"
          >
            Get Started →
          </button>
        </div>

        <button className="md:hidden text-[#94a3b8]" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#080810] pt-20 px-6">
          <div className="space-y-4">
            {['Home', ...navLinks].map(item => (
              <a key={item} href="#" className="block text-base text-[#94a3b8] py-2 border-b border-[#1e1e30]">{item}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="w-full text-center py-2.5 rounded-xl border border-[#1e1e30] text-sm text-[#94a3b8]">
                Log In
              </Link>
              <button onClick={() => navigate('/register')} className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl">
                Get Started →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-8 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-teal-500/6 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-purple-500/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-medium mb-6">
              <Sparkles size={11} />
              India's #1 Placement Preparation Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 font-[Plus_Jakarta_Sans]">
              Your Placement<br />
              <span className="gradient-teal">Journey Starts Here</span>
            </h1>
            <p className="text-[#94a3b8] text-base md:text-lg mb-8 leading-relaxed">
              Learn. Practice. Level Up. Get Placed.<br />
              Master aptitude, DSA, core CS and ace interviews at top companies — with a personalized roadmap built for you.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-xl hover:shadow-teal-500/25"
              >
                Start for Free <ArrowRight size={16} />
              </button>
              <button className="flex items-center gap-2 border border-[#1e1e30] hover:border-[#2e2e45] text-[#94a3b8] hover:text-white font-medium px-6 py-3 rounded-xl transition-all">
                Explore Demo <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-5">
              {['No credit card required', '500+ companies covered', 'AI-powered feedback'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <CheckCircle size={12} className="text-teal-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="relative hidden md:block">
            {/* Main card */}
            <div className="card-dark rounded-2xl p-5 relative glow-teal">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-[#64748b]">Good morning, Arjun 👋</div>
                  <div className="text-sm font-bold text-white mt-0.5">Placement Readiness</div>
                </div>
                <div className="text-2xl font-extrabold gradient-teal font-[Plus_Jakarta_Sans]">78%</div>
              </div>
              <div className="h-2 bg-[#1e1e30] rounded-full mb-5 overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Problems', val: '347', color: 'text-blue-400' },
                  { label: 'Mock Tests', val: '12', color: 'text-purple-400' },
                  { label: 'Avg Score', val: '82%', color: 'text-orange-400' },
                ].map(s => (
                  <div key={s.label} className="bg-[#0a0a14] rounded-lg p-3 text-center">
                    <div className={`text-base font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] text-[#475569] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Mini skill bars */}
              <div className="space-y-1.5">
                {[
                  { name: 'Aptitude', pct: 82, color: 'bg-teal-500' },
                  { name: 'DSA', pct: 67, color: 'bg-blue-500' },
                  { name: 'Coding', pct: 71, color: 'bg-purple-500' },
                ].map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#64748b] w-12">{s.name}</span>
                    <div className="flex-1 h-1 bg-[#1e1e30] rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-[#475569] w-6 text-right">{s.pct}%</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 mt-4">
                {['TCS', 'Infosys', 'Amazon', 'Google', 'Microsoft'].map(c => (
                  <div key={c} className="flex-1 bg-[#0a0a14] rounded-md py-1 text-center text-[9px] text-[#64748b]">{c}</div>
                ))}
              </div>
            </div>

            {/* Floating badge top-right */}
            <div className="absolute -top-3 -right-3 bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm rounded-xl p-3 shadow-xl">
              <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Star size={12} />Interview Ready
              </div>
            </div>

            {/* Floating badge bottom-left */}
            <div className="absolute -bottom-3 -left-3 bg-teal-500/20 border border-teal-500/30 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl">
              <div className="flex items-center gap-1.5">
                <Target size={12} className="text-teal-400" />
                <span className="text-xs font-bold text-teal-400">Level 3 / 6</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="card-dark rounded-xl p-5 text-center">
              <div className="text-2xl md:text-3xl font-extrabold gradient-teal font-[Plus_Jakarta_Sans] mb-1">{s.value}</div>
              <div className="text-xs text-[#64748b]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-teal-400 tracking-widest mb-3 uppercase">Everything You Need</div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-[Plus_Jakarta_Sans] mb-3">One Platform. Complete Preparation.</h2>
            <p className="text-[#64748b] max-w-xl mx-auto text-sm">From aptitude basics to system design — all in one structured, expert-curated platform designed for campus placements.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {features.map(f => (
              <div key={f.title} className="card-dark card-lift rounded-xl p-5 cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1.5 text-sm">{f.title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap preview */}
      <section className="py-16 px-6 md:px-8 border-t border-[#1e1e30]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-purple-400 tracking-widest mb-3 uppercase">Your Journey</div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-[Plus_Jakarta_Sans] mb-3">Structured 6-Level Roadmap</h2>
            <p className="text-[#64748b] text-sm max-w-md mx-auto">Follow a proven path from beginner to interview-ready, with milestones and checkpoints at every step.</p>
          </div>
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {['Foundation', 'Intermediate', 'Advanced', 'Expert', 'Mock & Practice', '🎯 Interview Ready'].map((level, i) => (
              <div key={level} className="flex items-center">
                <div className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  i < 2 ? 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                  : i === 2 ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                  : 'border-[#1e1e30] text-[#475569]'
                }`}>
                  {i < 2 ? '✓ ' : i === 2 ? '● ' : '○ '}{level}
                </div>
                {i < 5 && <ChevronRight size={14} className="text-[#2e2e45] mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-8 border-t border-[#1e1e30]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-orange-400 tracking-widest mb-3 uppercase">Success Stories</div>
            <h2 className="text-2xl font-extrabold font-[Plus_Jakarta_Sans]">50,000+ Students Placed</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="card-dark rounded-xl p-6 card-lift">
                <div className="flex items-center gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-[#94a3b8] leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.name}</div>
                    <div className="text-[10px] text-[#64748b]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center card-dark rounded-2xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-teal-500/5 blur-2xl" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-teal-500/20">
              <Zap size={24} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-[Plus_Jakarta_Sans] mb-3">Ready to Get Placed?</h2>
            <p className="text-[#64748b] mb-8 text-sm">Join 50,000+ students who leveled up their careers with LevelUp. Start free, no card needed.</p>
            <button
              onClick={() => navigate('/register')}
              className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-xl hover:shadow-teal-500/20 text-sm"
            >
              Start Your Placement Journey →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e30] py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-white font-[Plus_Jakarta_Sans]">LevelUp</span>
          </div>
          <div className="text-xs text-[#475569]">Learn. Practice. Level Up. Get Placed.</div>
          <div className="text-xs text-[#475569]">© 2025 LevelUp · All rights reserved</div>
        </div>
      </footer>
    </div>
  );
}
