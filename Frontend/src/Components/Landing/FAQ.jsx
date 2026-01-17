import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'Can I access a free trial?',
      answer:
        "Enjoy a free 30-day trial of our job portal's premium features! Plus, get a complimentary 30-minute onboarding session to maximize your job search success.",
    },
    {
      question: 'Can I modify my plan later?',
      answer:
        'Absolutely! Our job portal pricing adapts to your hiring needs. Contact us to find the perfect plan for your company.',
    },
    {
      question: "What's cancellation policy?",
      answer:
        'We get it—plans change. Cancel your job portal subscription anytime and get a refund for the unused portion, hassle-free!',
    },
    {
      question: 'Can details be an invoice?',
      answer:
        'Currently, the only way to include extra details on job portal invoices is during the billing process.',
    },
    {
      question: 'How is billing processed?',
      answer:
        'Job portal plans apply to each recruitment team, not the entire account. You can upgrade one team while keeping multiple free teams.',
    },
    {
      question: 'How can update email?',
      answer: 'To update your account email, visit untitled.com/account from a laptop or desktop.',
    },
  ];

  return (
    <div className="faq_main_wrapper">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-medium">
            <div className="faq_wrap">
              <div className="faq_title-wrap">
                <h2 className="heading-style-h2">Frequently asked questions</h2>
                <p className="text-size-medium text-color-secondary">
                  All the essential details about the product and billing.
                </p>
              </div>
              <div className="faq_grid">
                {faqs.map((faq, index) => (
                  <div key={index} id={`w-node-_003c9579-a609-2412-26c3-8e5b93c3061${index === 0 ? '1' : index === 1 ? '6' : index === 2 ? 'b' : index === 3 ? '0' : index === 4 ? '5' : 'a'}-3978b161`} className="faq_card">
                    <div className="faq_question-title center">{faq.question}</div>
                    <div className="text-size-regular is-color">{faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
