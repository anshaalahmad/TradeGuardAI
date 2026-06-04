import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const TermsPage = () => {
  const tableOfContents = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'services', title: 'Our Services' },
    { id: 'accounts', title: 'User Accounts' },
    { id: 'subscriptions', title: 'Subscriptions & Payments' },
    { id: 'acceptable-use', title: 'Acceptable Use' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'disclaimers', title: 'Disclaimers' },
    { id: 'limitation', title: 'Limitation of Liability' },
    { id: 'termination', title: 'Termination' },
    { id: 'governing-law', title: 'Governing Law' },
  ];

  return (
    <LegalPageLayout
      title="Terms of Service"
      description="Read the terms and conditions governing your use of the TradeGuard AI platform."
      lastUpdated="February 1, 2026"
      canonical="/terms"
      tableOfContents={tableOfContents}
    >
      <>
        <p className="lead">
          Welcome to TradeGuard AI. By accessing or using our platform, you agree to be bound by these 
          Terms of Service. Please read them carefully before using our services.
        </p>

        <section id="acceptance">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using TradeGuard AI's website, mobile applications, or any of our services, 
            you acknowledge that you have read, understood, and agree to be bound by these Terms of Service 
            and our Privacy Policy.
          </p>
          <p>
            If you do not agree to these terms, you may not access or use our services. We reserve the 
            right to modify these terms at any time, and such modifications will be effective immediately 
            upon posting.
          </p>
        </section>

        <section id="services">
          <h2>2. Our Services</h2>
          <p>
            TradeGuard AI provides cryptocurrency market analysis tools, AI-powered trading predictions, 
            portfolio tracking, and educational resources. Our services are designed for informational 
            purposes only and do not constitute financial advice.
          </p>
          <h3>Service Availability</h3>
          <p>
            We strive to maintain service availability but cannot guarantee uninterrupted access. 
            We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
          </p>
        </section>

        <section id="accounts">
          <h2>3. User Accounts</h2>
          <h3>Account Creation</h3>
          <p>To access certain features, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
            <li>Not share your account with others</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>
          <h3>Account Responsibility</h3>
          <p>
            You are responsible for all activities that occur under your account. We are not liable 
            for any loss or damage arising from unauthorized use of your account.
          </p>
        </section>

        <section id="subscriptions">
          <h2>4. Subscriptions & Payments</h2>
          <h3>Billing</h3>
          <p>
            Paid subscriptions are billed in advance on a monthly or annual basis. You authorize us 
            to charge your payment method on each billing date.
          </p>
          <h3>Cancellation</h3>
          <p>
            You may cancel your subscription at any time. Cancellation takes effect at the end of 
            the current billing period. No refunds are provided for partial months.
          </p>
          <h3>Price Changes</h3>
          <p>
            We reserve the right to modify our prices. We will provide at least 30 days' notice 
            before any price increase takes effect on your subscription.
          </p>
        </section>

        <section id="acceptable-use">
          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use our services for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the integrity of our services</li>
            <li>Use automated systems to access our platform without permission</li>
            <li>Reverse engineer or decompile our software</li>
            <li>Resell or redistribute our services without authorization</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Submit false or misleading information</li>
          </ul>
        </section>

        <section id="intellectual-property">
          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of TradeGuard AI, including but not limited to 
            text, graphics, logos, icons, images, audio clips, and software, are the exclusive 
            property of TradeGuard AI, Inc. and are protected by copyright, trademark, and other 
            intellectual property laws.
          </p>
          <p>
            You may not copy, modify, distribute, sell, or lease any part of our services without 
            our written permission.
          </p>
        </section>

        <section id="disclaimers">
          <h2>7. Disclaimers</h2>
          <p className="text-weight-semibold">
            TRADEGUARD AI IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
          </p>
          <p>We disclaim all warranties, including but not limited to:</p>
          <ul>
            <li>Accuracy or reliability of predictions or analysis</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
            <li>Uninterrupted or error-free service</li>
          </ul>
          <p className="text-weight-semibold">
            Our AI predictions and market analysis are not financial advice. Cryptocurrency trading 
            involves substantial risk of loss. Past performance does not guarantee future results.
          </p>
        </section>

        <section id="limitation">
          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRADEGUARD AI, INC. SHALL NOT BE LIABLE FOR ANY 
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
            LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES.
          </p>
          <p>
            Our total liability for any claims arising from your use of our services shall not 
            exceed the amount you paid us in the twelve (12) months preceding the claim.
          </p>
        </section>

        <section id="termination">
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account and access to our services immediately, without 
            prior notice or liability, for any reason, including breach of these Terms.
          </p>
          <p>
            Upon termination, your right to use our services will immediately cease. Provisions that 
            by their nature should survive termination shall survive.
          </p>
        </section>

        <section id="governing-law">
          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State 
            of California, without regard to its conflict of law provisions.
          </p>
          <p>
            Any disputes arising from these Terms or your use of our services shall be resolved 
            through binding arbitration in San Francisco, California.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>For questions about these Terms, please contact us at legal@tradeguard.ai.</p>
        </section>
      </>
    </LegalPageLayout>
  );
};

export default TermsPage;
