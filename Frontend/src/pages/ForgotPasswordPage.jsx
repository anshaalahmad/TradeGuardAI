import React from 'react';
import ForgotPassword from '../Components/Memberstack/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <section className="main_form_wrapper">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <ForgotPassword onClose={() => window.history.back()} />
          </div>
        </div>
      </div>
      <div className="form_main_image_wrapper">
        <img 
          src="/images/Page-1.jpg" 
          loading="lazy" 
          sizes="240px" 
          srcSet="/images/Page-1-p-500.jpg 500w, /images/Page-1-p-800.jpg 800w, /images/Page-1.jpg 1000w" 
          alt="" 
          className="form_main_image" 
        />
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
