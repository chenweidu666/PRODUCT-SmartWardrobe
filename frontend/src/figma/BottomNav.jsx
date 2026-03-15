import React from 'react';

export function BottomNav({ active, onNavigate }) {
  return (
    <nav className="m-bottom-nav">
      <div className="m-bottom-nav-inner">
        <button className={`m-nav-btn ${active === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
          首页
        </button>
        <button
          className={`m-nav-btn ${active === 'wardrobe-manage' || active === 'wardrobe-add' || active === 'wardrobe-detail' ? 'active' : ''}`}
          onClick={() => onNavigate('wardrobe-manage')}
        >
          衣服管理
        </button>
        <button className={`m-nav-btn ${active === 'profile' ? 'active' : ''}`} onClick={() => onNavigate('profile')}>
          我的衣柜
        </button>
      </div>
    </nav>
  );
}

