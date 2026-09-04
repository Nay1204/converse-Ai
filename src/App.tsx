import { useState } from 'react';
import { ArrowRight, AudioLines, CheckCircle2, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Workspace } from './Workspace';

function BrandMark() {
  return <div className="grid size-10 place-items-center rounded-xl bg-[#25a99b] text-white shadow-[0_8px_24px_rgba(37,169,155,.28)]"><AudioLines size={22} /></div>;
}

function LoginPreview() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#0b3442] px-12 py-10 text-white lg:block">
      <div className="absolute -right-32 -top-28 size-96 rounded-full border border-white/10" />
      <div className="absolute -right-16 -top-8 size-64 rounded-full border border-[#4bd2c2]/20" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-3"><BrandMark /><span className="text-xl font-semibold tracking-[-.03em]">ConverseIQ</span></div>
        <div className="my-auto max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4bd2c2]/25 bg-[#1a4b58] px-3 py-1.5 text-sm text-[#a9ece3]"><Sparkles size={14} />AI conversation intelligence</div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-[-.045em]">Turn every customer call into a clearer next move.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#b8cdd3]">Understand sentiment shifts, escalation signals and the moments that change a conversation.</p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.06] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div><p className="text-xs font-medium uppercase tracking-[.14em] text-[#7da1aa]">Latest analysis</p><p className="mt-1 font-medium">Network outage · Enterprise support</p></div>
              <span className="rounded-full bg-[#c85353]/20 px-2.5 py-1 text-xs font-semibold text-[#ffaaa5]">Negative · 87%</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-5">
              {[['Escalation risk','High'],['Resolution','Follow-up'],['Recovery','+38 pts']].map(([label,value]) => <div key={label} className="rounded-xl bg-black/10 p-3"><p className="text-xs text-[#88aab2]">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}
            </div>
            <div className="rounded-xl border border-[#4bd2c2]/20 bg-[#1c4b57] p-4"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-[#65d9cb]" size={18}/><div><p className="text-sm font-medium">Customer sentiment recovered</p><p className="mt-1 text-sm leading-6 text-[#a9c1c7]">A clear ownership statement shifted the close from frustrated to cautiously positive.</p></div></div></div>
          </div>
        </div>
        <p className="text-xs text-[#7899a1]">Built for focused, evidence-backed service decisions.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('converseiq-session') === 'active');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('demo@converseiq.ai');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  if (authenticated) return <Workspace onLogout={() => { sessionStorage.removeItem('converseiq-session'); setAuthenticated(false); }} />;

  const signIn = () => {
    if (email === 'demo@converseiq.ai' && password === 'demo123') {
      sessionStorage.setItem('converseiq-session', 'active');
      setAuthenticated(true);
      setError('');
    } else setError('Use the prefilled demo credentials to continue.');
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.08fr_.92fr]">
      <LoginPreview />
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-12 flex items-center gap-3 lg:hidden"><BrandMark /><span className="text-xl font-semibold tracking-[-.03em]">ConverseIQ</span></div>
          <p className="text-sm font-semibold text-[#168b7f]">Workspace access</p>
          <h2 className="mt-2 text-[2rem] font-semibold tracking-[-.04em] text-[#122e38]">Welcome back</h2>
          <p className="mt-2 text-base text-[#687d85]">Sign in to analyze a customer conversation.</p>
          <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); signIn(); }}>
            <div><label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[#28434c]">Email address</label><Input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-xl border-[#ccdadd] bg-[#f9fbfb] px-4 text-base" /></div>
            <div><label htmlFor="login-password" className="mb-2 block text-sm font-medium text-[#28434c]">Password</label><div className="relative"><Input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-xl border-[#ccdadd] bg-[#f9fbfb] px-4 pr-12 text-base" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#6d8289] hover:bg-[#eaf2f3]">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
            <Button type="submit" className="h-12 w-full rounded-xl bg-[#0d5967] text-base hover:bg-[#084653]">Enter workspace <ArrowRight className="ml-1" /></Button>
            {error && <p role="alert" className="text-sm font-medium text-[#b64e49]">{error}</p>}
          </form>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#dce9e8] bg-[#f1f8f7] p-4 text-sm text-[#48646b]"><ShieldCheck className="mt-0.5 shrink-0 text-[#238f82]" size={18}/><p><strong className="font-semibold text-[#23444b]">Demo access</strong><br/>Credentials are prefilled. No account data is stored.</p></div>
        </div>
      </section>
    </main>
  );
}
