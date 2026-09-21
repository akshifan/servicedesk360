import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  tenantName: '',
  tenantCode: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 12) {
      setError('Password must contain at least 12 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...request } = form;
      await register(request);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page register-page">
      <div className="login-backdrop login-backdrop-one" />
      <div className="login-backdrop login-backdrop-two" />
      <div className="login-layout register-layout">
        <section className="login-story">
          <Link to="/" className="brand-lockup login-brand">
            <span className="brand-mark">S</span>
            <span>ServiceDesk <em>360</em></span>
          </Link>
          <div>
            <span className="eyebrow">Start with clarity</span>
            <h1>Build your<br /><span>workspace.</span></h1>
            <p>Create a focused service desk for your organization and invite your team when you are ready.</p>
          </div>
          <div className="login-story-footer">
            <span className="status-pulse" />
            Tenant administrators add the official team after workspace setup.
          </div>
        </section>

        <section className="login-card register-card">
          <Link to="/" className="mobile-login-brand">
            <span className="brand-mark brand-mark-small">S</span>
            ServiceDesk <em>360</em>
          </Link>
          <span className="eyebrow">Create workspace</span>
          <h2>Get started</h2>
          <p className="login-subtitle">Set up your organization and administrator account.</p>
          <div className="security-callout">
            <b>Organization setup</b>
            <span>Create a tenant administrator account. Tenant administrators add workers and assign roles after setup.</span>
          </div>
          {error && <div className="error" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="register-fields">
              <label>
                Organization name
                <input autoComplete="organization" placeholder="Acme Support" value={form.tenantName} onChange={updateField('tenantName')} required />
              </label>
              <label>
                Workspace code
                <input autoComplete="off" placeholder="acme" value={form.tenantCode} onChange={updateField('tenantCode')} required />
              </label>
              <label>
                Your name
                <input autoComplete="name" placeholder="Asha Rao" value={form.name} onChange={updateField('name')} required />
              </label>
              <label>
                Email
                <input autoComplete="email" placeholder="you@company.com" type="email" value={form.email} onChange={updateField('email')} required />
              </label>
              <label>
                Password
                <input autoComplete="new-password" placeholder="At least 12 characters" type="password" value={form.password} onChange={updateField('password')} required />
              </label>
              <label>
                Confirm password
                <input autoComplete="new-password" placeholder="Repeat your password" type="password" value={form.confirmPassword} onChange={updateField('confirmPassword')} required />
              </label>
            </div>
            <button className="button button-primary button-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating workspace…' : 'Create workspace'} <span>↗</span>
            </button>
          </form>
          <p className="login-footnote">This creates the first tenant administrator. Afterward, use the Admin control room to add approved workers.</p>
          <p className="account-switch">Already have a workspace? <Link to="/login">Sign in</Link></p>
          <Link to="/" className="back-link">← Back to home</Link>
        </section>
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
      </div>
    </main>
  );
}
