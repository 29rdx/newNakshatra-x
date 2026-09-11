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
            <a href="#">Reserve Mapping</a>
            <a href="#">Production Planning</a>
            <a href="#">Documentation</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Research</a>
            <a href="#">Careers</a>
          </div>
          <div className="footer-col">
            <h4>Security</h4>
            <Link href="/admin/login">Commander Access</Link>
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

