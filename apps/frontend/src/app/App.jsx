import React, { useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { WardrobeManagePage } from '../pages/WardrobeManagePage';
import { AddClothingPage } from '../pages/AddClothingPage';
import { WardrobeDetailPage } from '../pages/WardrobeDetailPage';
import { ProfilePage } from '../pages/ProfilePage';

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
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token') || '';
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || '';
    return {
      token,
      user: token ? { id: userId ? Number(userId) : undefined, username } : null,
    };
  });
  const [clothingVersion, setClothingVersion] = useState(0);

  const handleNavigate = (page, itemId) => {
    setCurrentPage(page);
    if (typeof itemId === 'number') {
      setSelectedItemId(itemId);
    }
  };

  const handleLoginSuccess = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', user?.username || '');
    if (user?.id !== undefined && user?.id !== null) {
      localStorage.setItem('userId', String(user.id));
    }
    setAuth({ token, user });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setAuth({ token: '', user: null });
  };

  const handleAuthExpired = () => {
    handleLogout();
    setCurrentPage(PAGES.PROFILE);
  };

  const handleClothingChanged = () => {
    setClothingVersion((value) => value + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.HOME:
        return (
          <HomePage
            onNavigate={handleNavigate}
            token={auth.token}
            clothingVersion={clothingVersion}
            onAuthExpired={handleAuthExpired}
          />
        );
      case PAGES.WARDROBE_MANAGE:
        return (
          <WardrobeManagePage
            onNavigate={handleNavigate}
            token={auth.token}
            clothingVersion={clothingVersion}
            onAuthExpired={handleAuthExpired}
          />
        );
      case PAGES.WARDROBE_ADD:
        return (
          <AddClothingPage
            onNavigate={handleNavigate}
            token={auth.token}
            onClothingChanged={handleClothingChanged}
            onAuthExpired={handleAuthExpired}
          />
        );
      case PAGES.WARDROBE_DETAIL:
        return (
          <WardrobeDetailPage
            onNavigate={handleNavigate}
            token={auth.token}
            itemId={selectedItemId}
            onClothingChanged={handleClothingChanged}
            onAuthExpired={handleAuthExpired}
          />
        );
      case PAGES.PROFILE:
        return (
          <ProfilePage
            onNavigate={handleNavigate}
            token={auth.token}
            user={auth.user}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            token={auth.token}
            clothingVersion={clothingVersion}
            onAuthExpired={handleAuthExpired}
          />
        );
    }
  };

  return <div className="figma-root">{renderPage()}</div>;
}

export default App;
