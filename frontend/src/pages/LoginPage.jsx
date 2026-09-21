import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ tenantCode: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); setError(''); setIsSubmitting(true); try { await login(form); navigate('/app'); } catch (err) { setError(err.message); } finally { setIsSubmitting(false); } };

  return <main className="login-page"><div className="login-backdrop login-backdrop-one" /><div className="login-backdrop login-backdrop-two" /><div className="login-layout"><section className="login-story"><Link to="/" className="brand-lockup login-brand"><span className="brand-mark">S</span><span>ServiceDesk <em>360</em></span></Link><div><span className="eyebrow">Your operations, in focus</span><h1>Welcome back<br /><span>to calm.</span></h1><p>Pick up where your team left off and keep every request moving forward.</p></div><div className="login-story-footer"><span className="status-pulse" /> Secure, role-aware workspace</div></section><section className="login-card"><Link to="/" className="mobile-login-brand"><span className="brand-mark brand-mark-small">S</span> ServiceDesk <em>360</em></Link><span className="eyebrow">Workspace access</span><h2>Sign in</h2><p className="login-subtitle">Enter your workspace details to continue.</p>{error && <div className="error" role="alert">{error}</div>}<form onSubmit={submit}><label>Tenant code<input aria-label="Tenant code" autoComplete="organization" placeholder="e.g. demo" value={form.tenantCode} onChange={updateField('tenantCode')} required /></label><label>Email<input aria-label="Email" autoComplete="email" placeholder="you@company.com" type="email" value={form.email} onChange={updateField('email')} required /></label><label>Password<input aria-label="Password" autoComplete="current-password" placeholder="Your password" type="password" value={form.password} onChange={updateField('password')} required /></label><button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in to workspace'} <span>↗</span></button></form><p className="login-footnote">Need access? Ask your tenant administrator to create an account.</p><p className="account-switch">New organization? <Link to="/register">Create workspace</Link></p><Link to="/" className="back-link">← Back to home</Link></section>
    <footer className="landing-footer">

      <div className="footer-brand">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark brand-mark-small">S</span>
          <span className="service-desk">ServiceDesk <em>360</em></span>
        </Link>
      </div>

      <div className="footer-info">
    <span className="footer-tagline">
      Focused support operations, beautifully organized.
    </span>

        <span className="footer-copyright">
      © 2026 ServiceDesk 360
    </span>
      </div>

      <div className="footer-developer">
    <span>
      Developed by <strong>Abdul Khader Shifan</strong>
    </span>

        <a
          href="mailto:akshifan234@gmail.com"
          className="footer-email"
        >
          <span className="email-icon">✉</span>
          <span>akshifan234@gmail.com</span>
        </a>
      </div>

    </footer>
  </div></main>;
}
