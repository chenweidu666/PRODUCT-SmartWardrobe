import React, { useState } from 'react';
import { BottomNav } from './BottomNav';

export function ProfilePage({ onNavigate }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  if (!loggedIn && !showLoginForm) {
    return (
      <div className="m-page">
        <header className="m-header">
          <h1 className="m-title">我的衣柜</h1>
          <p className="m-subtitle">登录后管理您的个人信息</p>
        </header>
        <main className="m-main">
          <section className="m-card" style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 24 }}>
            <div style={{ width: 72, height: 72, margin: '0 auto 12px', borderRadius: '50%', background: '#f1f5f9', display: 'grid', placeItems: 'center', fontSize: 28 }}>👤</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>欢迎使用智能衣橱</div>
            <div style={{ color: '#64748b', fontSize: 13, margin: '8px 0 14px' }}>登录后即可同步您的衣物数据</div>
            <button className="m-btn m-btn-primary" style={{ width: '100%', marginBottom: 8 }} onClick={() => setShowLoginForm(true)}>登录 / 注册</button>
            <button className="m-btn m-btn-secondary" style={{ width: '100%' }} onClick={() => onNavigate('home')}>暂不登录</button>
          </section>
        </main>
        <BottomNav active="profile" onNavigate={onNavigate} />
      </div>
    );
  }

  if (!loggedIn && showLoginForm) {
    return (
      <div className="m-page">
        <header className="m-header">
          <h1 className="m-title">登录 / 注册</h1>
        </header>
        <main className="m-main">
          <section className="m-card">
            <label className="m-label">手机号</label>
            <input className="m-input" placeholder="请输入手机号" />
            <label className="m-label" style={{ marginTop: 10 }}>验证码</label>
            <div className="m-grid-2" style={{ gridTemplateColumns: '1fr auto' }}>
              <input className="m-input" placeholder="请输入验证码" />
              <button className="m-btn m-btn-secondary">获取验证码</button>
            </div>
            <button className="m-btn m-btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={() => setLoggedIn(true)}>登录</button>
            <button className="m-btn m-btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={() => setShowLoginForm(false)}>返回</button>
          </section>
        </main>
        <BottomNav active="profile" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="m-page">
      <header className="m-header">
        <h1 className="m-title">我的衣柜</h1>
        <p className="m-subtitle">个人中心</p>
      </header>
      <main className="m-main">
        <section className="m-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e2e8f0', display: 'grid', placeItems: 'center', fontSize: 24 }}>👤</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>用户12345</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>138****8888</div>
            </div>
          </div>
          <label className="m-label">昵称</label>
          <input className="m-input" defaultValue="用户12345" />
          <label className="m-label" style={{ marginTop: 10 }}>邮箱</label>
          <input className="m-input" placeholder="请输入邮箱" />
          <button className="m-btn m-btn-primary" style={{ width: '100%', marginTop: 12 }}>保存修改</button>
        </section>

        <section className="m-card">
          <div className="m-section-title">个人图片管理</div>
          <div className="m-grid-2" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} style={{ aspectRatio: '1 / 1', border: '2px dashed #cbd5e1', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#94a3b8' }}>图片</div>
            ))}
          </div>
        </section>

        <button className="m-btn m-btn-danger" style={{ width: '100%' }} onClick={() => { setLoggedIn(false); setShowLoginForm(false); }}>
          退出登录
        </button>
      </main>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}

