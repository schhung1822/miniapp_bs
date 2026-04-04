import React from 'react';

import type { HeaderProps } from '@/components/Header';
import BeautySummitExperience from '@/features/beauty-summit/BeautySummitExperience';

interface HomePageProps {
  onHeaderChange: (config: HeaderProps) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onHeaderChange }) => {
  return <BeautySummitExperience onHeaderChange={onHeaderChange} />;
};

export default HomePage;
