import React, { useState } from 'react';
import './figma/figma-app.css';
import { HomePage } from './figma/HomePage';
import { WardrobeManagePage } from './figma/WardrobeManagePage';
import { AddClothingPage } from './figma/AddClothingPage';
import { WardrobeDetailPage } from './figma/WardrobeDetailPage';
import { ProfilePage } from './figma/ProfilePage';

const PAGES = {
  HOME: 'home',
  WARDROBE_MANAGE: 'wardrobe-manage',
  WARDROBE_ADD: 'wardrobe-add',
  WARDROBE_DETAIL: 'wardrobe-detail',
  PROFILE: 'profile',
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const [selectedItemId, setSelectedItemId] = useState(undefined);

  const handleNavigate = (page, itemId) => {
    setCurrentPage(page);
    if (typeof itemId === 'number') {
      setSelectedItemId(itemId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.HOME:
        return <HomePage onNavigate={handleNavigate} />;
      case PAGES.WARDROBE_MANAGE:
        return <WardrobeManagePage onNavigate={handleNavigate} />;
      case PAGES.WARDROBE_ADD:
        return <AddClothingPage onNavigate={handleNavigate} />;
      case PAGES.WARDROBE_DETAIL:
        return <WardrobeDetailPage onNavigate={handleNavigate} itemId={selectedItemId} />;
      case PAGES.PROFILE:
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return <div className="figma-root">{renderPage()}</div>;
}

export default App;