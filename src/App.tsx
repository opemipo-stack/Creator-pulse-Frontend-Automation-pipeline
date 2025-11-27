
import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ScraperDashboard } from './components/ScraperDashboard';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return <LandingPage onGetStarted={() => setShowDashboard(true)} />;
  }

  return <ScraperDashboard />;
};

export default Index;
