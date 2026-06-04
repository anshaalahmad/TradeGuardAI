import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPolicyPage = () => {
  const tableOfContents = [
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'data-sharing', title: 'Data Sharing' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'changes', title: 'Changes to Policy' },
    { id: 'contact', title: 'Contact Us' },
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Learn how TradeGuard AI collects, uses, and protects your personal information."
      lastUpdated="February 1, 2026"
      canonical="/privacy"
      tableOfContents={tableOfContents}
    >
      <>
        <p className="lead">
          At TradeGuard AI, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our cryptocurrency trading platform.
        </p>

        <section id="information-collected">
          <h2>1. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li>Name and email address when you create an account</li>
            <li>Billing information when you subscribe to a paid plan</li>
            <li>Profile information you choose to provide</li>
            <li>Communications you send to us</li>
          </ul>

          <h3>Usage Information</h3>
          <p>We automatically collect certain information when you use our platform:</p>
          <ul>
            <li>Device information (browser type, operating system)</li>
            <li>Log data (IP address, access times, pages viewed)</li>
            <li>Trading preferences and platform usage patterns</li>
            <li>Information collected through cookies and similar technologies</li>
          </ul>

          <h3>Exchange Connection Data</h3>
          <p>When you connect cryptocurrency exchanges:</p>
          <ul>
            <li>We receive read-only API credentials</li>
            <li>We access portfolio data and trading history</li>
            <li>We never request withdrawal permissions</li>
          </ul>
        </section>

        <section id="how-we-use">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and customer service requests</li>
            <li>Generate AI-powered trading insights and predictions</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
            <li>Personalize and improve your experience</li>
          </ul>
        </section>

        <section id="data-sharing">
          <h2>3. Data Sharing</h2>
          <p>We do not sell your personal information. We may share information in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> With third parties who perform services on our behalf (payment processing, email delivery, analytics)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of assets</li>
            <li><strong>With Your Consent:</strong> When you give us permission to share</li>
          </ul>
        </section>

        <section id="data-security">
          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information:</p>
          <ul>
            <li>End-to-end encryption for all data transmissions</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Regular security audits and penetration testing</li>
            <li>Strict access controls and employee training</li>
            <li>SOC 2 Type II compliance</li>
          </ul>
          <p>
            While we strive to protect your information, no method of transmission over the Internet 
            is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section id="your-rights">
          <h2>5. Your Rights</h2>
          <p>You have certain rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data</li>
            <li><strong>Portability:</strong> Request a machine-readable copy of your data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>
          <p>To exercise these rights, contact us at privacy@tradeguard.ai.</p>
        </section>

        <section id="cookies">
          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our platform 
            and hold certain information. For detailed information about our cookie practices, 
            please see our <a href="/cookies">Cookie Policy</a>.
          </p>
        </section>

        <section id="changes">
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section id="contact">
          <h2>8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <ul>
            <li>Email: privacy@tradeguard.ai</li>
            <li>Address: TradeGuard AI, Inc., San Francisco, CA 94102</li>
          </ul>
        </section>
      </>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
