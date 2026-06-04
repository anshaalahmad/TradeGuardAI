import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Scroll the main window to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // prevents janky smooth scrolling on load
    });

    // 2. Also scroll the dashboard container to the top if we are inside the app dashboard
    const dashboardContainer = document.querySelector('.dashboard_main_app');
    if (dashboardContainer) {
      dashboardContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
