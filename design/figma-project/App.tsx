import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { WardrobeManage } from './components/WardrobeManage';
import { AddClothing } from './components/AddClothing';
import { WardrobeDetail } from './components/WardrobeDetail';
import { Profile } from './components/Profile';

type Page = 'home' | 'wardrobe-manage' | 'wardrobe-add' | 'wardrobe-detail' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);

  const handleNavigate = (page: string, itemId?: number) => {
    setCurrentPage(page as Page);
    if (itemId !== undefined) {
      setSelectedItemId(itemId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'wardrobe-manage':
        return <WardrobeManage onNavigate={handleNavigate} />;
      case 'wardrobe-add':
        return <AddClothing onNavigate={handleNavigate} />;
      case 'wardrobe-detail':
        return <WardrobeDetail onNavigate={handleNavigate} itemId={selectedItemId} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}
