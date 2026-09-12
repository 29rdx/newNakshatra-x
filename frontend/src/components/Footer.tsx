import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">NAKSHATRA-X</span>
          <p className="footer-tagline">
            AI + satellite intelligence for manganese mapping.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="/#reserve-intelligence">Reserve AI</Link>
            <Link href="/#production-sentinel">Production Sentinel</Link>
            <Link href="/#smart-blending">Ore Blending</Link>
            <Link href="/#mine-twin">Mine Twin</Link>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <Link href="/#mission-control">Orbital Feed</Link>
            <Link href="/#judges-corner">ML Architecture</Link>
            <Link href="/#risk-cockpit">Risk Cockpit</Link>
            <Link href="/preview">Live Demo Console</Link>
          </div>
          <div className="footer-col">
            <h4>Security &amp; ESG</h4>
            <Link href="/login">Operator Login</Link>
            <Link href="/dashboard">Mission Dashboard</Link>
            <Link href="/admin/login">Commander Portal</Link>
            <Link href="/admin/setup">Claim Admin Slot</Link>
          </div>
        </div>
      </div>


      <div className="footer-bottom">
        <span>&copy; 2026 NAKSHATRA-X. All rights reserved.</span>
        <Link href="/admin/login" className="text-slate-500 hover:text-[#38BDF8] text-xs transition-colors">
          Admin Portal &rarr;
        </Link>
      </div>
    </footer>
  )
}

