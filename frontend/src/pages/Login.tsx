import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Factory } from 'lucide-react';


export const Login = () => {
  const navigate = useNavigate();
  const { setUser, user } = useAppData();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      if (isLogin) {
        setUser({ id: 'u1', email, factory_id: 'f1' });
        navigate('/dashboard');
      } else {
        setUser({ id: 'u2', email, factory_id: '' });
        navigate('/setup');
      }
    }
  };

  const handleGoogleAuth = () => {
    if (isLogin) {
      setUser({ id: 'u1', email: 'owner@sakthiprecision.com', factory_id: 'f1' });
      navigate('/dashboard');
    } else {
      setUser({ id: 'u2', email: 'new@factory.com', factory_id: '' });
      navigate('/setup');
    }
  };

  return (
    <div className="min-h-screen flex font-inter">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-brand-primary)] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Factory className="text-[var(--color-brand-primary)]" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">ReMargin</span>
        </div>

        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-5xl font-bold leading-tight mb-12">
            Track waste.<br />Save money.<br />Stay compliant.
          </h1>

          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-lg">
                <span className="text-[var(--color-brand-emerald)] font-bold mr-2">↑</span>
                ₹15L+ average annual savings per CNC unit
              </div>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-lg">
                <span className="text-[var(--color-brand-emerald)] font-bold mr-2">↑</span>
                25× ROI vs. subscription cost in Year 1
              </div>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-lg">
                <span className="text-[var(--color-brand-amber)] font-bold mr-2">⚡</span>
                2026 EU CBAM deadline — ReMargin gets you ready
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-20 text-white/60 text-sm font-medium tracking-wide">
          HackFinix · Sustainability Track · Amrita Vishwa Vidyapeetham
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-brand-primary)] rounded-lg flex items-center justify-center">
            <Factory className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-brand-primary)]">ReMargin</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start tracking waste and saving money today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                placeholder="owner@factory.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="w-full btn-primary text-lg mt-2 shadow-md">
              {isLogin ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleAuth}
            className="w-full mt-8 btn-outline flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.7 17.59V20.34H19.26C21.34 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.7 17.59C14.72 18.25 13.46 18.66 12 18.66C9.18 18.66 6.78 16.76 5.88 14.21H2.2V17.06C4.01 20.64 7.68 23 12 23Z" fill="#34A853"/>
              <path d="M5.88 14.21C5.65 13.53 5.52 12.79 5.52 12C5.52 11.21 5.65 10.47 5.88 9.79V6.94H2.2C1.46 8.42 1.05 10.15 1.05 12C1.05 13.85 1.46 15.58 2.2 17.06L5.88 14.21Z" fill="#FBBC05"/>
              <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.34 3.84C17.45 2.09 14.96 1 12 1C7.68 1 4.01 3.36 2.2 6.94L5.88 9.79C6.78 7.24 9.18 5.34 12 5.34Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            {isLogin ? "New to ReMargin? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-medium text-[var(--color-brand-primary)] hover:underline"
            >
              {isLogin ? "Create a free account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
