"use client";

import Link from "next/link";

export default function TermsOfService() {
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
        .legal-highlight {
          background: #FFF8E7;
          border-left: 4px solid var(--accent-gold);
          padding: 20px 24px;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        .legal-highlight p {
          margin-bottom: 0;
          color: var(--text-primary);
          font-weight: 500;
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
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: February 2, 2026</p>

        <div className="legal-highlight">
          <p>
            <strong>Important:</strong> Meridian is a document preparation service. We are NOT a law firm and do NOT provide legal advice. Use of this service does not create an attorney-client relationship.
          </p>
        </div>

        <div className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Meridian (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Description of Service</h2>
          <p>
            Meridian provides a document preparation service that helps users complete the USCIS Form N-400 (Application for Naturalization). Our Service:
          </p>
          <ul>
            <li>Provides a guided questionnaire to collect information needed for Form N-400</li>
            <li>Generates a completed PDF of Form N-400 based on your responses</li>
            <li>Allows you to save your progress and return later</li>
            <li>Provides explanations of questions in plain English</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Important Legal Disclaimers</h2>

          <div className="legal-highlight">
            <p><strong>NOT LEGAL ADVICE:</strong> Meridian is a document preparation service only. We do NOT provide legal advice, legal representation, or immigration consulting services. The information provided through our Service is for general informational purposes only and should not be construed as legal advice.</p>
          </div>

          <p><strong>Not a Law Firm:</strong> Meridian is not a law firm and is not a substitute for the advice of an attorney. If you have specific legal questions about your immigration case, you should consult with a licensed immigration attorney.</p>

          <p><strong>No Attorney-Client Relationship:</strong> Use of this Service does not create an attorney-client, fiduciary, or other confidential relationship between you and Meridian.</p>

          <p><strong>No Government Affiliation:</strong> Meridian is not affiliated with, endorsed by, or sponsored by U.S. Citizenship and Immigration Services (USCIS), the Department of Homeland Security (DHS), or any other government agency.</p>

          <p><strong>Your Responsibility:</strong> You are solely responsible for the accuracy and completeness of the information you provide. You are responsible for reviewing your completed form before submission to USCIS. You are responsible for filing your application with USCIS and paying any applicable government filing fees.</p>

          <p><strong>No Guarantee of Outcome:</strong> We do not guarantee that your naturalization application will be approved. Approval depends on many factors outside our control, including your eligibility, the accuracy of your information, and USCIS adjudication.</p>
        </div>

        <div className="legal-section">
          <h2>4. Eligibility</h2>
          <p>To use our Service, you must:</p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into a binding agreement</li>
            <li>Provide accurate and complete information</li>
            <li>Use the Service only for lawful purposes</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Account Registration</h2>
          <p>
            To use certain features of our Service, you must create an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Be responsible for all activities that occur under your account</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>6. Payment and Refunds</h2>
          <p><strong>Pricing:</strong> The current price for our document preparation service is displayed during checkout. Prices are subject to change without notice.</p>

          <p><strong>Payment:</strong> Payment is processed securely through Stripe. By making a payment, you authorize us to charge your payment method for the total amount.</p>

          <p><strong>Refund Policy:</strong> We offer a 30-day money-back guarantee. If you are not satisfied with our Service, you may request a full refund within 30 days of your purchase by contacting support@meridianforms.com. Refunds may be denied if we determine the Service was used in bad faith.</p>

          <p><strong>Government Fees:</strong> Our fee does not include the USCIS filing fee or biometrics fee, which you must pay directly to USCIS when submitting your application.</p>
        </div>

        <div className="legal-section">
          <h2>7. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide truthful, accurate, and complete information</li>
            <li>Review your completed form carefully before submission to USCIS</li>
            <li>Not use the Service for any unlawful purpose</li>
            <li>Not attempt to circumvent any security features of the Service</li>
            <li>Not share your account credentials with others</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>8. Intellectual Property</h2>
          <p>
            The Service, including its design, features, and content (excluding information you provide), is owned by Meridian and protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the Service without our written permission.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MERIDIAN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul>
            <li>Your use or inability to use the Service</li>
            <li>Any errors or omissions in the content generated by the Service</li>
            <li>Denial or delay of your naturalization application by USCIS</li>
            <li>Unauthorized access to your data</li>
            <li>Any other matter relating to the Service</li>
          </ul>
          <p>
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Meridian, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service will immediately cease.
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website. Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </div>

        <div className="legal-section">
          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of California.
          </p>
        </div>

        <div className="legal-section">
          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
          </p>
        </div>

        <div className="legal-section">
          <h2>15. Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us at:
          </p>
          <p>
            Email: support@meridianforms.com
          </p>
        </div>

        <div className="legal-footer">
          <p>
            <Link href="/privacy">Privacy Policy</Link> · <Link href="/">Back to Home</Link>
          </p>
        </div>
      </main>
    </>
  );
}
