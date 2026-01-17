import React from 'react';
import Login from '../Components/Memberstack/Login';

const LoginPage = () => {
  return (
    <section className="main_form_wrapper">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-full-height">
            <Login onClose={() => window.history.back()} />
          </div>
        </div>
      </div>
      <div className="form_main_image_wrapper">
        <img src="/images/Page-1.jpg" loading="lazy" alt="" className="form_main_image" />
      </div>
    </section>
  );
};

export default LoginPage;
