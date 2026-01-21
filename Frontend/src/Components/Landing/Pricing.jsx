import React, { useState } from 'react';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: '$19',
      yearlyPrice: '$15',
      features: [
        'Real-time market data for all cryptocurrencies',
        'Basic AI predictions (up to 10 per day)',
        'Candlestick charts with 3 timeframes',
        'Order book and market trades',
        'Email support',
      ],
      checkIcon: 'https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/696803193e6af155cfcc3ff2_check-mark.png',
      isPremium: false,
    },
    {
      name: 'Pro',
      monthlyPrice: '$49',
      yearlyPrice: '$39',
      features: [
        'Everything in Starter plan',
        'Unlimited AI predictions with confidence scores',
        'Advanced technical indicators & overlays',
        'Portfolio tracking and analytics',
        'Priority support with 24/7 chat',
      ],
      checkIcon: 'https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/696803152c912b635ae364ae_check-mark%20(1).png',
      isPremium: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: '$149',
      yearlyPrice: '$119',
      features: [
        'Everything in Pro plan',
        'API access for automated trading',
        'Custom AI model training on your data',
        'White-label solutions available',
        'Dedicated account manager',
      ],
      checkIcon: 'https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/696803193e6af155cfcc3ff2_check-mark.png',
      isPremium: false,
    },
  ];

  return (
    <div className="pricing_main_wrapper">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-medium">
            <div className="pricing_wrap">
              <div className="pricing_heading-wrap">
                <h2 className="heading-style-h2">Choose Your Trading Advantage</h2>
                <p className="pricing_main_header_text text-size-medium text-color-secondary">
                  Unlock AI-powered cryptocurrency predictions with flexible plans designed for traders at every level
                </p>
              </div>
              <div className="pricing_tab-wrap">
                <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100" className="tabs-2 w-tabs">
                  <div className="tabs-menu-2 w-tab-menu">
                    <a
                      data-w-tab="Tab 1"
                      onClick={() => setActiveTab('monthly')}
                      className={`tab-link-tab-1-4 w-inline-block w-tab-link ${
                        activeTab === 'monthly' ? 'w--current' : ''
                      }`}
                    >
                      <div>Monthly</div>
                    </a>
                    <a
                      data-w-tab="Tab 2"
                      onClick={() => setActiveTab('yearly')}
                      className={`tab-link-tab-2-2 w-inline-block w-tab-link ${
                        activeTab === 'yearly' ? 'w--current' : ''
                      }`}
                    >
                      <div>Yearly</div>
                    </a>
                  </div>
                  <div className="tabs-content w-tab-content">
                    <div data-w-tab="Tab 1" className={`w-tab-pane ${activeTab === 'monthly' ? 'w--tab-active' : ''}`}>
                      <div className="pricing_grid">
                        {plans.map((plan, index) => (
                          <div key={index} className={`pricing_card ${plan.isPremium ? 'mid' : ''}`}>
                            <div className={`pricing_card-title ${plan.isPremium ? 'mid' : ''}`}>
                              {plan.name}
                            </div>
                            <div className={`pricing_checklist ${plan.isPremium ? 'mid' : ''}`}>
                              {plan.features.map((feature, idx) => (
                                <div key={idx} className="pricing_checkitem">
                                  <img loading="lazy" src={plan.checkIcon} alt="" className="image-8" />
                                  <div className={`pricing_checktxt ${plan.isPremium ? 'mid' : ''}`}>
                                    {feature}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="pricing_bottom">
                              <div className={`pricing_charges ${plan.isPremium ? 'mid' : ''}`}>
                                <span className={`text-span ${plan.isPremium ? 'mid' : ''}`}>{plan.monthlyPrice}</span>
                                /month
                              </div>
                              <a
                                href="#"
                                className={`button is-small ${
                                  plan.isPremium ? 'is-white' : 'is-secondary'
                                } w-button`}
                              >
                                Select
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div data-w-tab="Tab 2" className={`w-tab-pane ${activeTab === 'yearly' ? 'w--tab-active' : ''}`}>
                      <div className="pricing_grid">
                        {plans.map((plan, index) => (
                          <div key={index} className={`pricing_card ${plan.isPremium ? 'mid' : ''}`}>
                            <div className={`pricing_card-title ${plan.isPremium ? 'mid' : ''}`}>
                              {plan.name}
                            </div>
                            <div className={`pricing_checklist ${plan.isPremium ? 'mid' : ''}`}>
                              {plan.features.map((feature, idx) => (
                                <div key={idx} className="pricing_checkitem">
                                  <img loading="lazy" src={plan.checkIcon} alt="" className="image-8" />
                                  <div className={`pricing_checktxt ${plan.isPremium ? 'mid' : ''}`}>
                                    {feature}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="pricing_bottom">
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div className={`pricing_charges ${plan.isPremium ? 'mid' : ''}`}>
                                  <span className={`text-span ${plan.isPremium ? 'mid' : ''}`}>{plan.yearlyPrice}</span>
                                  /month
                                </div>
                                <div style={{ fontSize: '0.75rem', color: plan.isPremium ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-color--text-secondary)', fontWeight: 500 }}>
                                  Save 20% with yearly billing
                                </div>
                              </div>
                              <a
                                href="#"
                                className={`button is-small ${
                                  plan.isPremium ? 'is-white' : 'is-secondary'
                                } w-button`}
                              >
                                Select
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
