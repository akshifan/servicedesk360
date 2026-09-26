import { Link } from 'react-router-dom';
import Landing3DBackground from '../components/Landing3DBackground';

function ProductPreview() {
  return (
    <div className="product-preview" aria-label="ServiceDesk 360 workspace preview">
      <div className="preview-toolbar">
        <div className="preview-brand"><span className="brand-mark brand-mark-small">S</span><span>Operations overview</span></div>
        <span className="live-indicator"><i /> Illustrative preview</span>
      </div>
      <div className="preview-body">
        <div className="preview-heading"><div><span className="eyebrow">Monday, September 20</span><h3>Good afternoon, team</h3></div><span className="avatar">AM</span></div>
        <div className="preview-metrics">
          <div className="preview-metric"><span>Open tickets</span><strong>24</strong><small className="trend-up">↗ 12% this week</small></div>
          <div className="preview-metric"><span>SLA at risk</span><strong>06</strong><small className="trend-warn">Needs attention</small></div>
          <div className="preview-metric"><span>Tasks in motion</span><strong>18</strong><small className="trend-neutral">Across your team</small></div>
        </div>
        <div className="preview-grid">
          <div className="mini-chart"><div className="mini-chart-header"><span>Workload pulse</span><span className="chart-period">Last 7 days</span></div><div className="bars" aria-hidden="true"><span style={{ height: '38%' }} /><span style={{ height: '56%' }} /><span style={{ height: '45%' }} /><span style={{ height: '72%' }} /><span style={{ height: '61%' }} /><span style={{ height: '86%' }} /><span className="bar-active" style={{ height: '69%' }} /></div><div className="chart-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div>
          <div className="queue-card"><div className="mini-chart-header"><span>Priority queue</span><span className="queue-count">4 active</span></div><div className="queue-row"><span className="priority-dot priority-critical" /><span>VPN access issue</span><b>Critical</b></div><div className="queue-row"><span className="priority-dot priority-high" /><span>New starter setup</span><b>High</b></div><div className="queue-row"><span className="priority-dot priority-medium" /><span>Printer connection</span><b>Medium</b></div></div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ number, title, children }) {
  return <article className="feature-card"><span className="feature-number">{number}</span><h3>{title}</h3><p>{children}</p><span className="feature-arrow">↗</span></article>;
}

export default function LandingPage() {
  return (
    <main className="landing-page">
      <Landing3DBackground />
      <nav className="landing-nav">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark">S</span>

          <span className="brand-name">
    <span>
      ServiceDesk <em>360</em>
    </span>
    <small className="my-name">By A.K. Shifan</small>
  </span>
        </Link>        <div className="landing-links"><a href="#platform">Platform</a><a href="#workflow">How it works</a></div>
        <div className="nav-actions"><Link to="/login" className="nav-login">Sign in</Link><Link to="/login" className="button button-dark button-small">Start workspace <span>→</span></Link></div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="status-pill"><span className="status-pulse" /> Calm operations start here</div>
          <h1>Resolve faster.<br /><span>Stay in control.</span></h1>
          <p className="hero-lede">A clear, connected service desk for tickets, tasks and SLAs—so every request gets the attention it deserves.</p>
          <div className="hero-actions"><Link to="/login" className="button button-primary">Enter your workspace <span>↗</span></Link><a href="#workflow" className="text-link">See how it works <span>↓</span></a></div>
          <div className="hero-note"><div className="stacked-avatars"><span>AR</span><span>MK</span><span>JS</span><span>+</span></div><span>Built for teams that care about the details.</span></div>
        </div>
        <div className="hero-visual"><div className="glow-orb glow-orb-one" /><div className="glow-orb glow-orb-two" /><ProductPreview /><div className="floating-note floating-note-top"><span className="floating-icon">✓</span><span><b>Example resolved ticket</b><small>Sample update · VPN access issue</small></span></div><div className="floating-note floating-note-bottom"><span className="floating-icon floating-icon-blue">◷</span><span><b>Example SLA view</b><small>Illustrative countdown</small></span></div></div>
      </section>

      <section className="trust-strip"><span>One focused workspace for</span><div><b>Tickets</b><i>·</i><b>Tasks</b><i>·</i><b>SLAs</b><i>·</i><b>Teams</b><i>·</i><b>Audit</b></div></section>

      <section className="feature-section" id="platform"><div className="section-intro"><span className="eyebrow">The platform</span><h2>Everything your service desk needs.<br /><span>Nothing it doesn't.</span></h2><p>Simple enough to adopt quickly. Structured enough to keep every team aligned.</p></div><div className="feature-grid"><FeatureCard number="01" title="One source of truth">Bring requests, ownership, progress and resolution into one shared view.</FeatureCard><FeatureCard number="02" title="Built-in accountability">Make priorities visible with clear SLAs, due dates and role-aware workflows.</FeatureCard><FeatureCard number="03" title="Designed for momentum">Keep work moving with focused queues, live updates and less context switching.</FeatureCard></div></section>

      <section className="workflow-section" id="workflow"><div className="workflow-panel"><div className="workflow-copy"><span className="eyebrow">A better rhythm</span><h2>From request to resolution, without the noise.</h2><p>Give every person the right context at the right moment—from the requester opening a ticket to the manager balancing team workload.</p><Link to="/login" className="text-link text-link-light">Explore the workspace <span>↗</span></Link></div><div className="workflow-steps"><div className="workflow-step active"><span>01</span><div><b>Capture</b><small>Every request starts with clarity.</small></div><i>↗</i></div><div className="workflow-step"><span>02</span><div><b>Coordinate</b><small>Route work to the right owner.</small></div><i>→</i></div><div className="workflow-step"><span>03</span><div><b>Resolve</b><small>Close the loop with confidence.</small></div><i>→</i></div></div></div></section>

      <section className="final-cta"><span className="eyebrow">Ready when you are</span><h2>Make every request<br /><span>feel handled.</span></h2><Link to="/login" className="button button-primary">Open ServiceDesk 360 <span>↗</span></Link></section>
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
    </main>
  );
}
