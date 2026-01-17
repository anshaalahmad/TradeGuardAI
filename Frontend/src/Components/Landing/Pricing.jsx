import React, { useState } from 'react';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  const plans = [
    {
      name: 'Basic',
      price: '$9',
      features: [
        '1 free job post per month.',
        'Get up to 3 applicants per posting.',
        'Visible on our site & app',
        'Auto-delivered to relevant candidates.',
        'Includes ads',
      ],
      checkIcon: 'https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/696803193e6af155cfcc3ff2_check-mark.png',
      isPremium: false,
    },
    {
      name: 'Premium',
      price: '$19',
      features: [
        'Featured job postings',
        'Unlimited applicants',
        'Automatically shared with relevant candidates',
        'Pay only for clicks, views, or applications',
        'Ad-free experience',
      ],
      checkIcon: 'https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/696803152c912b635ae364ae_check-mark%20(1).png',
      isPremium: true,
    },
    {
      name: 'Enterprise',
      price: '$29',
      features: [
        'Featured job postings',
        'Unlimited applicants',
        'Directly reach out to qualified candidates',
        'Monthly credits for jobs or connections.',
        'Unlimited user access',
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
                <h2 className="heading-style-h2">Get all features with a subscription!</h2>
                <p className="pricing_main_header_text text-size-medium text-color-secondary">
                  Attract job seekers effortlessly with simple and fast plans on the leading job portal
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
                                <span className={`text-span ${plan.isPremium ? 'mid' : ''}`}>{plan.price}</span>
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
                              <div className={`pricing_charges ${plan.isPremium ? 'mid' : ''}`}>
                                <span className={`text-span ${plan.isPremium ? 'mid' : ''}`}>{plan.price}</span>
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
