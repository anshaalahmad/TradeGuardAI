import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const DisclaimerPage = () => {
  const tableOfContents = [
    { id: 'general', title: 'General Disclaimer' },
    { id: 'not-financial-advice', title: 'Not Financial Advice' },
    { id: 'ai-predictions', title: 'AI Predictions' },
    { id: 'risk-warning', title: 'Risk Warning' },
    { id: 'third-party', title: 'Third-Party Links' },
    { id: 'accuracy', title: 'Accuracy of Information' },
    { id: 'limitation', title: 'Limitation of Liability' },
  ];

  return (
    <LegalPageLayout
      title="Disclaimer"
      description="Important disclaimers regarding the use of TradeGuard AI and cryptocurrency trading risks."
      lastUpdated="February 1, 2026"
      canonical="/disclaimer"
      tableOfContents={tableOfContents}
    >
      <>
        <p className="lead">
          Please read this disclaimer carefully before using TradeGuard AI. By using our services, 
          you acknowledge and agree to the terms outlined below.
        </p>

        <div className="legal-warning-box">
          <strong>⚠️ Important:</strong> Cryptocurrency trading involves substantial risk of loss and 
          is not suitable for all investors. You could lose all or a substantial portion of your 
          investment. Never invest more than you can afford to lose.
        </div>

        <section id="general">
          <h2>1. General Disclaimer</h2>
          <p>
            TradeGuard AI, Inc. ("TradeGuard AI", "we", "us", or "our") provides this website and 
            its services on an "as is" and "as available" basis. All information provided through 
            our platform is for informational and educational purposes only.
          </p>
          <p>
            We make no representations or warranties of any kind, express or implied, regarding 
            the completeness, accuracy, reliability, suitability, or availability of the information, 
            products, services, or related graphics contained on the website.
          </p>
        </section>

        <section id="not-financial-advice">
          <h2>2. Not Financial Advice</h2>
          <p className="text-weight-semibold">
            THE CONTENT PROVIDED BY TRADEGUARD AI DOES NOT CONSTITUTE FINANCIAL, INVESTMENT, TRADING, 
            OR ANY OTHER TYPE OF ADVICE.
          </p>
          <p>
            You should not treat any information presented on our platform as a specific recommendation 
            to make a particular investment, follow a particular strategy, or make any financial decisions.
          </p>
          <p>
            Before making any investment decisions, we strongly recommend that you:
          </p>
          <ul>
            <li>Consult with a qualified financial advisor</li>
            <li>Conduct your own research and due diligence</li>
            <li>Consider your financial situation and risk tolerance</li>
            <li>Understand the risks associated with cryptocurrency trading</li>
          </ul>
        </section>

        <section id="ai-predictions">
          <h2>3. AI Predictions Disclaimer</h2>
          <p>
            Our AI-powered predictions and market analysis are generated using machine learning 
            algorithms and historical data. These predictions:
          </p>
          <ul>
            <li>Are not guaranteed to be accurate or profitable</li>
            <li>Should not be relied upon as the sole basis for investment decisions</li>
            <li>May be subject to errors, inaccuracies, or delays</li>
            <li>Do not account for your individual financial situation</li>
            <li>Are based on historical data and market conditions may change</li>
          </ul>
          <p className="text-weight-semibold">
            Past performance, whether actual or indicated by historical tests, is not indicative 
            of future results. No representation is being made that any account will or is likely 
            to achieve profits or losses similar to those shown.
          </p>
        </section>

        <section id="risk-warning">
          <h2>4. Cryptocurrency Risk Warning</h2>
          <p>
            Cryptocurrency markets are highly volatile and unpredictable. Trading cryptocurrencies 
            involves significant risks including:
          </p>
          <ul>
            <li><strong>Market Risk:</strong> Prices can fluctuate dramatically in short periods</li>
            <li><strong>Liquidity Risk:</strong> Some cryptocurrencies may be difficult to sell quickly</li>
            <li><strong>Regulatory Risk:</strong> Regulations may change and affect cryptocurrency values</li>
            <li><strong>Technology Risk:</strong> Security breaches, hacks, and technical failures can result in loss</li>
            <li><strong>Operational Risk:</strong> Exchanges and platforms may fail or cease operations</li>
            <li><strong>Legal Risk:</strong> Cryptocurrencies may not be legal in all jurisdictions</li>
          </ul>
          <p className="text-weight-semibold">
            You should only invest money that you can afford to lose entirely. Never invest your 
            emergency funds, retirement savings, or money needed for essential expenses.
          </p>
        </section>

        <section id="third-party">
          <h2>5. Third-Party Links and Services</h2>
          <p>
            Our platform may contain links to third-party websites, exchanges, and services. 
            We do not control these third parties and are not responsible for:
          </p>
          <ul>
            <li>Their content, privacy practices, or policies</li>
            <li>Any losses or damages arising from your use of third-party services</li>
            <li>The accuracy or reliability of information provided by third parties</li>
          </ul>
          <p>
            Inclusion of any link does not imply endorsement or recommendation by TradeGuard AI.
          </p>
        </section>

        <section id="accuracy">
          <h2>6. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no warranties 
            regarding:
          </p>
          <ul>
            <li>The accuracy of market data or price information</li>
            <li>The completeness of trading analysis or educational content</li>
            <li>The timeliness of information updates</li>
            <li>The reliability of third-party data sources</li>
          </ul>
          <p>
            You should always verify information through multiple independent sources before 
            making any trading or investment decisions.
          </p>
        </section>

        <section id="limitation">
          <h2>7. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, TRADEGUARD AI, ITS DIRECTORS, EMPLOYEES, 
            PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, SHALL NOT BE LIABLE FOR:
          </p>
          <ul>
            <li>Any trading losses or damages of any kind</li>
            <li>Decisions made based on our predictions or analysis</li>
            <li>Loss of profits, revenue, or data</li>
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Service interruptions or technical issues</li>
          </ul>
          <p>
            Your use of our services is at your sole risk. You acknowledge that you are solely 
            responsible for your trading and investment decisions.
          </p>
        </section>

        <section>
          <h2>Questions</h2>
          <p>
            If you have any questions about this disclaimer, please contact us at legal@tradeguard.ai.
          </p>
        </section>
      </>
    </LegalPageLayout>
  );
};

export default DisclaimerPage;
