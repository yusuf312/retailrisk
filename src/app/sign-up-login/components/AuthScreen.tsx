'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, AlertTriangle, TrendingDown, Package, Copy, Check, ArrowRight } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

type AuthMode = 'login' | 'signup';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface SignupForm {
  fullName: string;
  email: string;
  company: string;
  role: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const demoCredentials = [
  { id: 'cred-finance', role: 'Finance Manager', email: 'marcus.kim@retailrisk.app', password: 'RR$Finance2026' },
  { id: 'cred-analyst', role: 'Loss Prevention Analyst', email: 'priya.loss@retailrisk.app', password: 'RR$Analyst2026' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check size={12} className="text-positive" /> : <Copy size={12} />}
    </button>
  );
}

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({ defaultValues: { remember: false } });
  const signupForm = useForm<SignupForm>();

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    // Backend integration point: POST /api/auth/login
    await new Promise((r) => setTimeout(r, 1200));
    const validCred = demoCredentials.find(
      (c) => c.email === data.email && c.password === data.password,
    );
    setIsLoading(false);
    if (!validCred) {
      loginForm.setError('email', {
        message: 'Invalid credentials — use the demo accounts below to sign in',
      });
      return;
    }
    toast.success(`Welcome back, ${validCred.role}!`);
    window.location.href = '/';
  };

  const handleSignup = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setIsLoading(true);
    // Backend integration point: POST /api/auth/register
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    toast.success('Account created — redirecting to dashboard');
    setTimeout(() => { window.location.href = '/'; }, 800);
  };

  const autofillCredential = (cred: typeof demoCredentials[0]) => {
    loginForm.setValue('email', cred.email);
    loginForm.setValue('password', cred.password);
    toast.info(`${cred.role} credentials loaded`);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-card border-r border-border flex-col p-10 relative overflow-hidden">
        <div className="blob-primary absolute inset-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-12">
            <AppLogo size={32} />
            <span className="font-semibold text-foreground text-lg tracking-tight">RetailRisk</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="mb-6">
              <span className="text-xs font-medium uppercase tracking-widest text-primary mb-3 block">Revenue Intelligence</span>
              <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">
                Find where your retail business is quietly losing profit
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                SQL-powered risk analytics that surfaces pricing mistakes, discount abuse, return fraud, inventory shrinkage, and supplier defects — with a dollar figure on each one.
              </p>
            </div>

            {/* Live stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: 'Avg leakage found', value: '$284K', sub: 'per retailer/yr' },
                { label: 'Risk categories', value: '13', sub: 'automated queries' },
                { label: 'Detection rate', value: '94.2%', sub: 'anomaly accuracy' },
              ].map((stat) => (
                <div key={`stat-${stat.label}`} className="bg-muted rounded-lg p-3 border border-border">
                  <p className="text-xl font-bold text-foreground tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/60">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Risk category pills */}
            <div className="flex flex-wrap gap-2">
              {['Pricing Errors', 'Discount Abuse', 'Return Fraud', 'Shrinkage', 'Employee Anomalies', 'Supplier Risk', 'RFM Churn', 'Duplicate Orders'].map((cat) => (
                <span key={`pill-${cat}`} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom risk indicators */}
          <div className="flex items-center gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle size={12} className="text-primary" />
              <span>3 critical flags active right now</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingDown size={12} className="text-positive" />
              <span>$18K recovered last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={28} />
            <span className="font-semibold text-foreground">RetailRisk</span>
          </div>

          {/* Mode switcher */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 mb-6">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={`mode-${m}`}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                  mode === m
                    ? 'bg-card text-foreground shadow-card'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  {...loginForm.register('email', { required: 'Email is required' })}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-primary">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password', { required: 'Password is required' })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1.5 text-xs text-primary">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...loginForm.register('remember')}
                    className="w-3.5 h-3.5 rounded border-border bg-input accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">Remember me</span>
                </label>
                <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60 transition-all duration-150 active:scale-[0.98]"
                style={{ minHeight: '42px' }}
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>

              {/* Demo credentials */}
              <div className="mt-4 rounded-lg border border-border bg-muted overflow-hidden">
                <div className="px-3 py-2 border-b border-border flex items-center gap-1.5">
                  <Package size={12} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Demo accounts — click to autofill</span>
                </div>
                {demoCredentials.map((cred) => (
                  <div key={cred.id} className="flex items-center justify-between px-3 py-2 hover:bg-secondary transition-colors border-b border-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-foreground">{cred.role}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-muted-foreground truncate">{cred.email}</span>
                        <CopyButton text={cred.email} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => autofillCredential(cred)}
                      className="ml-3 text-xs font-medium px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors flex-shrink-0"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Full name</label>
                  <input
                    type="text"
                    {...signupForm.register('fullName', { required: 'Name required' })}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {signupForm.formState.errors.fullName && (
                    <p className="mt-1 text-xs text-primary">{signupForm.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Company</label>
                  <input
                    type="text"
                    {...signupForm.register('company', { required: 'Company required' })}
                    placeholder="Retailer name"
                    className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {signupForm.formState.errors.company && (
                    <p className="mt-1 text-xs text-primary">{signupForm.formState.errors.company.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
                <input
                  type="email"
                  {...signupForm.register('email', { required: 'Email required' })}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {signupForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-primary">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Your role</label>
                <select
                  {...signupForm.register('role', { required: 'Role required' })}
                  className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select role...</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="loss_prevention">Loss Prevention Analyst</option>
                  <option value="vp_operations">VP of Operations</option>
                  <option value="data_analyst">Data Analyst</option>
                  <option value="cfo">CFO / Finance Director</option>
                </select>
                {signupForm.formState.errors.role && (
                  <p className="mt-1 text-xs text-primary">{signupForm.formState.errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...signupForm.register('password', {
                      required: 'Password required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                    })}
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2.5 pr-10 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {signupForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-primary">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...signupForm.register('confirmPassword', { required: 'Please confirm password' })}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2.5 pr-10 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {signupForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-primary">{signupForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...signupForm.register('terms', { required: 'You must accept the terms' })}
                  className="w-3.5 h-3.5 mt-0.5 rounded border-border bg-input accent-primary flex-shrink-0"
                />
                <span className="text-xs text-muted-foreground">
                  I agree to the{' '}
                  <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {signupForm.formState.errors.terms && (
                <p className="text-xs text-primary">{signupForm.formState.errors.terms.message}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60 transition-all duration-150 active:scale-[0.98]"
                style={{ minHeight: '42px' }}
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>Create Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}