import React, { useEffect, useMemo, useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { fetchClothingList, fetchTodayWeather } from '../services/api';

export function HomePage({ onNavigate, token, clothingVersion, onAuthExpired }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await fetchClothingList(token);
        setItems(Array.isArray(data.clothing) ? data.clothing : []);
      } catch (error) {
        if (error.isAuthError) {
          onAuthExpired?.();
          return;
        }
        setErrorMessage(error.message || '加载首页数据失败');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, clothingVersion, onAuthExpired]);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError('');
        const data = await fetchTodayWeather('南京');
        setWeather(data.weather || null);
      } catch (error) {
        setWeatherError(error.message || '天气加载失败');
      } finally {
        setWeatherLoading(false);
      }
    };
    loadWeather();
  }, []);

  const dashboard = useMemo(() => {
    const total = items.length;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthAdded = items.filter((item) => {
      if (!item.created_at) return false;
      const date = new Date(item.created_at);
      return !Number.isNaN(date.getTime()) && date.getMonth() === month && date.getFullYear() === year;
    }).length;
    const categoryCount = new Set(items.map((item) => item.category_name || '未分类')).size;
    const prices = items.map((item) => Number(item.price)).filter((value) => Number.isFinite(value) && value > 0);
    const totalPrice = prices.reduce((sum, value) => sum + value, 0);
    const recent = [...items].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
    return { total, monthAdded, categoryCount, totalPrice, recent };
  }, [items]);

  return (
    <div className="m-page">
      <header className="m-header">
        <h1 className="m-title">智能衣柜</h1>
        <p className="m-subtitle">让穿搭更简单，让生活更优雅</p>
      </header>

      <main className="m-main">
        <section className="m-card" style={{ background: 'linear-gradient(135deg,#eff6ff,#ecfeff)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="m-section-title">今日天气</div>
              <div style={{ color: '#64748b', fontSize: 13 }}>
                {weather?.resolvedCity ? `${weather.resolvedCity} 实时天气` : '根据天气智能推荐穿搭'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#2563eb' }}>
                {weatherLoading ? '--' : Number.isFinite(weather?.temperature) ? `${Math.round(weather.temperature)}°` : '22°'}
              </div>
              <div style={{ color: '#64748b', fontSize: 12 }}>
                {weatherLoading ? '加载中...' : weather?.condition || '多云'}
              </div>
            </div>
          </div>
          {weatherError ? <div style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>{weatherError}</div> : null}
        </section>

        <section className="m-card" style={{ background: 'linear-gradient(135deg,#faf5ff,#fdf2f8)' }}>
          <div className="m-section-title">AI 穿搭推荐</div>
          {!token ? (
            <div style={{ color: '#64748b', fontSize: 13 }}>登录后将展示数据库中的最近衣物。</div>
          ) : loading ? (
            <div style={{ color: '#64748b', fontSize: 13 }}>加载中...</div>
          ) : (
            <>
              <div className="m-grid-2" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                {dashboard.recent.map((item) => (
                  <div key={item.id} className="m-clothing-image" style={{ borderRadius: 10, fontSize: 24, background: '#fff', overflow: 'hidden' }}>
                    {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👕'}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="m-card" style={{ background: 'linear-gradient(135deg,#ecfdf5,#f0fdf4)' }}>
          <div className="m-section-title">我的衣物数据</div>
          <div className="m-grid-2" style={{ gridTemplateColumns: 'repeat(2,1fr)', textAlign: 'center' }}>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{token ? dashboard.total : '--'}</div><div className="m-subtitle">总件数</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{token ? dashboard.monthAdded : '--'}</div><div className="m-subtitle">本月新增</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{token ? dashboard.categoryCount : '--'}</div><div className="m-subtitle">分类数</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{token ? `¥${dashboard.totalPrice.toFixed(2)}` : '--'}</div><div className="m-subtitle">衣物总价</div></div>
          </div>
          {errorMessage ? <div style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>{errorMessage}</div> : null}
        </section>

      </main>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
