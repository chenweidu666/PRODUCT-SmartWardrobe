import React, { useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { loginWithPassword } from '../services/api';

export function ProfilePage({ onNavigate, token, user, onLoginSuccess, onLogout }) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const loggedIn = Boolean(token);

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

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      setErrorMessage('');
      const data = await loginWithPassword(usernameInput.trim(), passwordInput);
      onLoginSuccess?.({ token: data.token, user: data.user });
      setShowLoginForm(false);
    } catch (error) {
      setErrorMessage(error.message || '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (!loggedIn && showLoginForm) {
    return (
      <div className="m-page">
        <header className="m-header">
          <h1 className="m-title">账号登录</h1>
        </header>
        <main className="m-main">
          <section className="m-card">
            <label className="m-label">账号</label>
            <input
              className="m-input"
              placeholder="请输入账号 / 用户名 / 邮箱"
              value={usernameInput}
              onChange={(event) => setUsernameInput(event.target.value)}
            />
            <label className="m-label" style={{ marginTop: 10 }}>密码</label>
            <input
              className="m-input"
              type="password"
              placeholder="请输入密码"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
            />
            <button className="m-btn m-btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={handleLogin} disabled={submitting}>
              {submitting ? '登录中...' : '登录'}
            </button>
            <button className="m-btn m-btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={() => setShowLoginForm(false)}>返回</button>
            {errorMessage ? <div style={{ color: '#dc2626', marginTop: 10, fontSize: 13 }}>{errorMessage}</div> : null}
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
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.username || '用户'}</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>已登录账号</div>
            </div>
          </div>
          <label className="m-label">昵称</label>
          <input className="m-input" defaultValue="用户12345" />
          <label className="m-label" style={{ marginTop: 10 }}>邮箱</label>
          <input className="m-input" placeholder="请输入邮箱" />
          <button className="m-btn m-btn-primary" style={{ width: '100%', marginTop: 12 }}>保存修改</button>
        </section>

        <button className="m-btn m-btn-danger" style={{ width: '100%' }} onClick={() => { onLogout?.(); setShowLoginForm(false); }}>
          退出登录
        </button>
      </main>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
