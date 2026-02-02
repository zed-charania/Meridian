"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <style jsx global>{`
        :root {
          --bg-primary: #FDFCFB;
          --dark: #1A1A1A;
          --text-primary: #1A1A1A;
          --text-secondary: #5C5854;
          --border-light: rgba(26, 24, 21, 0.08);
          --accent-gold: #B8965A;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.7;
          -webkit-font-smoothing: antialiased;
        }
        .legal-header {
          padding: 20px 48px;
          background: rgba(253, 252, 251, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .legal-logo {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
        }
        .legal-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--dark) 0%, #2D2A26 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-gold);
          font-size: 14px;
        }
        .legal-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 140px 24px 80px;
        }
        .legal-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 42px;
          font-weight: 500;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }
        .legal-updated {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 48px;
        }
        .legal-section {
          margin-bottom: 40px;
        }
        .legal-section h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        .legal-section p, .legal-section li {
          color: var(--text-secondary);
          font-size: 15px;
          margin-bottom: 12px;
        }
        .legal-section ul {
          padding-left: 24px;
          margin-bottom: 16px;
        }
        .legal-section li {
          margin-bottom: 8px;
        }
        .legal-footer {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid var(--border-light);
        }
        .legal-footer a {
          color: var(--accent-gold);
          text-decoration: none;
        }
        .legal-footer a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .legal-header { padding: 16px 20px; }
          .legal-container { padding: 120px 20px 60px; }
          .legal-title { font-size: 32px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet" />

      <header className="legal-header">
        <Link href="/" className="legal-logo">
          <div className="legal-logo-icon">◆</div>
          Meridian
        </Link>
      </header>

      <main className="legal-container">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: February 2, 2026</p>

        <div className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Meridian (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our N-400 citizenship application preparation service.
          </p>
          <p>
            By using our service, you consent to the collection and use of information in accordance with this policy.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Information We Collect</h2>
          <p>We collect information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Create an account and sign in</li>
            <li>Complete the N-400 application questionnaire</li>
            <li>Make a payment for our services</li>
            <li>Contact us for support</li>
          </ul>
          <p><strong>Personal Information:</strong> This includes your name, email address, date of birth, address, phone number, immigration history, employment history, travel history, family information, and other information required for the N-400 form.</p>
          <p><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your full credit card number on our servers. Stripe&apos;s privacy policy governs their handling of payment data.</p>
          <p><strong>Technical Information:</strong> We automatically collect certain information when you visit our site, including IP address, browser type, operating system, and pages visited.</p>
        </div>

        <div className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Generate your completed N-400 PDF form</li>
            <li>Save your application progress so you can return later</li>
            <li>Process your payment</li>
            <li>Provide customer support</li>
            <li>Send important service-related communications</li>
            <li>Improve our service and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Data Storage and Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. We use Supabase for data storage, which provides enterprise-grade security including:
          </p>
          <ul>
            <li>Encryption at rest and in transit (TLS/SSL)</li>
            <li>Regular security audits and compliance certifications</li>
            <li>Access controls and authentication</li>
          </ul>
          <p>
            While we implement appropriate security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Data Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We use third-party services (Supabase for database, Stripe for payments, Vercel for hosting) that may process your data on our behalf.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or government request.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</li>
          </ul>
          <p>We do not share your information with USCIS or any government agency. You are responsible for submitting your completed form to USCIS.</p>
        </div>

        <div className="legal-section">
          <h2>6. Data Retention</h2>
          <p>
            We retain your application data for a reasonable period to allow you to access your completed forms and for our records. You may request deletion of your data at any time by contacting us.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
            <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
          </ul>
          <p>To exercise these rights, please contact us at support@meridianforms.com.</p>
        </div>

        <div className="legal-section">
          <h2>8. Cookies and Tracking</h2>
          <p>
            We use essential cookies to maintain your session and preferences. We may also use analytics cookies to understand how users interact with our service. You can control cookies through your browser settings.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under 18. We do not knowingly collect personal information from children under 18. If you believe we have collected such information, please contact us immediately.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            Email: support@meridianforms.com
          </p>
        </div>

        <div className="legal-footer">
          <p>
            <Link href="/terms">Terms of Service</Link> · <Link href="/">Back to Home</Link>
          </p>
        </div>
      </main>
    </>
  );
}
