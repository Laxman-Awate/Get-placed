import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router';
import { Zap, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, register } = useAuth();

  // If path is /login or ?mode=login, default to login view
  const isLoginInitial = location.pathname === '/login' || searchParams.get('mode') === 'login';
  const [isLogin, setIsLogin] = useState(isLoginInitial);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    remember: true,
  });

  // OAuth2 failure redirect lands here as ?error=oauth or ?error=oauth_failed.
  useEffect(() => {
    if (searchParams.get('error')) {
      setError('Google sign-in failed. Please try again.');
    }
  }, []);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const setMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError('');
    if (loginMode) {
      setSearchParams({ mode: 'login' });
    } else {
      setSearchParams({});
    }
  };

  const handleDemoFill = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setIsLogin(true);
      setForm(prev => ({
        ...prev,
        email: 'admin@placepro.com',
        password: 'admin123',
      }));
    } else {
      setIsLogin(true);
      setForm(prev => ({
        ...prev,
        email: 'arjun.kumar@gmail.com',
        password: 'password123',
      }));
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!form.email.trim() || !form.password) {
          throw new Error('Please enter both your email address and password.');
        }
        await login({
          email: form.email.trim(),
          password: form.password,
        });
        // Existing users go directly to the Dashboard
        navigate('/dashboard');
      } else {
        if (!form.name.trim() || !form.email.trim() || !form.password) {
          throw new Error('Please fill in your name, email, and password.');
        }
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (form.password !== form.confirm) {
          throw new Error('Passwords do not match. Please re-check.');
        }
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        // New users proceed to onboarding
        navigate('/profile-setup');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] bg-[#0a0a14] border-r border-[#1e1e30] p-10">
        <div>
          <div className="mb-10">
            <Logo size="lg" to="/" />
          </div>

          <h2 className="text-2xl font-bold font-[Plus_Jakarta_Sans] text-white mb-3">
            {isLogin ? 'Welcome back to your preparation journey' : 'Your placement success starts here'}
          </h2>
          <p className="text-[#64748b] text-sm leading-relaxed mb-8">
            Join 50,000+ students mastering placements at top companies like Google, Amazon, Microsoft, TCS, and more.
          </p>

          <div className="space-y-3.5">
            {[
              { icon: '🎯', text: 'Personalized roadmap to your dream company' },
              { icon: '🧠', text: '10,000+ curated practice problems' },
              { icon: '🏆', text: 'Company-specific mock tests and interview prep' },
              { icon: '📄', text: 'ATS-optimized resume builder with scoring' },
            ].map(item => (
              <div key={item.text} className="flex items-start gap-3 text-sm text-[#94a3b8]">
                <span className="text-base">{item.icon}</span>
                <span className="leading-snug">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Quick Demo Credentials */}
          <div className="mb-4 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 mb-2">
              <ShieldCheck size={14} />
              Quick Demo Accounts
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('student')}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-[#0f0f1a] hover:bg-[#1a1a2b] border border-[#1e1e30] text-[#94a3b8] hover:text-white transition-all flex items-center gap-1"
              >
                <span>Student</span>
                <span className="text-[#475569]">· Arjun</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-[#0f0f1a] hover:bg-[#1a1a2b] border border-[#1e1e30] text-[#94a3b8] hover:text-white transition-all flex items-center gap-1"
              >
                <span>Admin</span>
                <span className="text-[#475569]">· Pro</span>
              </button>
            </div>
          </div>

          <div className="card-dark rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                R
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Riya Sharma</div>
                <div className="text-[10px] text-[#64748b]">Placed at Google · 28 LPA</div>
              </div>
            </div>
            <p className="text-[10px] text-[#64748b] italic">
              "LevelUp's structured roadmap and mock tests helped me crack Google in 3 months!"
            </p>
          </div>
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6">
            <Logo size="md" to="/" />
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#0a0a14] p-1 rounded-xl border border-[#1e1e30] mb-6">
            <button
              type="button"
              onClick={() => setMode(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                isLogin
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                  : 'text-[#64748b] hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                  : 'text-[#64748b] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1.5">
              {isLogin ? 'Log in to your account' : 'Create your account'}
            </h1>
            <p className="text-sm text-[#64748b]">
              {isLogin ? (
                <>
                  New to LevelUp?{' '}
                  <button
                    type="button"
                    onClick={() => setMode(false)}
                    className="text-teal-400 hover:underline font-medium"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode(true)}
                    className="text-teal-400 hover:underline font-medium"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => authService.startGoogleOAuth()}
              className="flex items-center justify-center gap-2 border border-[#1e1e30] hover:border-[#2e2e45] rounded-xl py-2.5 text-sm text-[#94a3b8] hover:text-white transition-all bg-[#0a0a14]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="flex items-center justify-center gap-2 border border-[#1e1e30] hover:border-[#2e2e45] rounded-xl py-2.5 text-sm text-[#94a3b8] hover:text-white transition-all bg-[#0a0a14]"
            >
              <span className="text-base">⚡</span>
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1e1e30]" />
            <span className="text-xs text-[#475569]">or continue with email</span>
            <div className="flex-1 h-px bg-[#1e1e30]" />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-4">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Arjun Kumar"
                  value={form.name}
                  onChange={handle}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder={isLogin ? 'arjun.kumar@gmail.com' : 'arjun@example.com'}
                value={form.email}
                onChange={handle}
                className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#94a3b8]">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setError('Password reset instructions have been sent to your email.')}
                    className="text-[11px] text-teal-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                  value={form.password}
                  onChange={handle}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8] transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={handle}
                    className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8] transition-colors"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => setForm(prev => ({ ...prev, remember: e.target.checked }))}
                  className="w-4 h-4 rounded bg-[#0f0f1a] border-[#1e1e30] text-teal-500 focus:ring-teal-500/20 focus:ring-offset-0 accent-teal-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-[#94a3b8] cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/20 flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : isLogin ? (
                <>
                  <span>Log In to Dashboard</span>
                  <ArrowRight size={15} />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-[#475569] text-center mt-6">
            By continuing, you agree to LevelUp's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
