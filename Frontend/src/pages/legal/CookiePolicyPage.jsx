import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const CookiePolicyPage = () => {
  const tableOfContents = [
    { id: 'what-are-cookies', title: 'What Are Cookies' },
    { id: 'how-we-use', title: 'How We Use Cookies' },
    { id: 'types', title: 'Types of Cookies' },
    { id: 'third-party', title: 'Third-Party Cookies' },
    { id: 'managing', title: 'Managing Cookies' },
    { id: 'changes', title: 'Changes to Policy' },
  ];

  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Learn about how TradeGuard AI uses cookies and similar technologies."
      lastUpdated="February 1, 2026"
      canonical="/cookies"
      tableOfContents={tableOfContents}
    >
      <>
        <p className="lead">
          This Cookie Policy explains how TradeGuard AI, Inc. ("we", "us", or "our") uses cookies 
          and similar technologies when you visit our website and use our services.
        </p>

        <section id="what-are-cookies">
          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. 
            They are widely used to make websites work more efficiently, provide information to 
            website owners, and enhance user experience.
          </p>
          <p>
            Similar technologies include web beacons, pixels, local storage, and other tracking 
            technologies that collect and store information about your browsing activity.
          </p>
        </section>

        <section id="how-we-use">
          <h2>2. How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li><strong>Authentication:</strong> To identify you when you log in and keep you logged in</li>
            <li><strong>Security:</strong> To protect your account and detect fraudulent activity</li>
            <li><strong>Preferences:</strong> To remember your settings and preferences</li>
            <li><strong>Analytics:</strong> To understand how visitors use our platform</li>
            <li><strong>Performance:</strong> To monitor and improve our service performance</li>
          </ul>
        </section>

        <section id="types">
          <h2>3. Types of Cookies We Use</h2>
          
          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function and cannot be switched off. 
            They are usually set in response to actions made by you, such as setting privacy 
            preferences, logging in, or filling in forms.
          </p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Maintains user session</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>auth_token</td>
                <td>Authentication</td>
                <td>30 days</td>
              </tr>
              <tr>
                <td>csrf_token</td>
                <td>Security protection</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>

          <h3>Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization, such as remembering 
            your preferences and customizing your experience.
          </p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>theme_preference</td>
                <td>Dark/light mode setting</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>chart_settings</td>
                <td>Chart preferences</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>language</td>
                <td>Language preference</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h3>Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously.
          </p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_tg_analytics</td>
                <td>Usage analytics</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>_tg_session</td>
                <td>Session tracking</td>
                <td>30 minutes</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="third-party">
          <h2>4. Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our pages. We use 
            the following third-party services:
          </p>
          <ul>
            <li><strong>Stripe:</strong> For secure payment processing</li>
            <li><strong>Cloudflare:</strong> For security and performance optimization</li>
            <li><strong>Intercom:</strong> For customer support chat functionality</li>
          </ul>
          <p>
            These third parties may use cookies according to their own privacy policies. We 
            recommend reviewing their privacy policies for more information.
          </p>
        </section>

        <section id="managing">
          <h2>5. Managing Cookies</h2>
          <p>
            You can control and manage cookies in several ways. Please note that removing or 
            blocking cookies may impact your user experience and some features may not function properly.
          </p>
          
          <h3>Browser Settings</h3>
          <p>
            Most browsers allow you to control cookies through their settings. You can typically 
            find these settings in the "Options" or "Preferences" menu of your browser.
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a></li>
          </ul>

          <h3>Opt-Out Tools</h3>
          <p>
            You can opt out of third-party analytics cookies by visiting the respective opt-out pages:
          </p>
          <ul>
            <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
          </ul>
        </section>

        <section id="changes">
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, 
            legislation, or our data practices. Any changes will be posted on this page with an 
            updated revision date.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at privacy@tradeguard.ai.
          </p>
        </section>
      </>
    </LegalPageLayout>
  );
};

export default CookiePolicyPage;
