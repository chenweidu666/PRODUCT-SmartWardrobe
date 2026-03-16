import React, { useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { deleteClothing, fetchClothingDetail, updateClothing } from '../services/api';

export function WardrobeDetailPage({ onNavigate, token, itemId, onClothingChanged, onAuthExpired }) {
  const [editing, setEditing] = useState(false);
  const [item, setItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!token || !itemId) return;
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await fetchClothingDetail(token, itemId);
        setItem(data.clothing || null);
      } catch (error) {
        if (error.isAuthError) {
          onAuthExpired?.();
          return;
        }
        setErrorMessage(error.message || '加载详情失败');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, itemId, onAuthExpired]);

  const handleChange = (key) => (event) => {
    setItem((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSave = async () => {
    if (!item) return;
    try {
      setSaving(true);
      setErrorMessage('');
      await updateClothing(token, item.id, {
        category_id: item.category_id,
        name: item.name,
        color: item.color,
        size: item.size,
        brand: item.brand,
        season: item.season,
        price: item.price,
        purchase_date: item.purchase_date,
        description: item.description,
      });
      setEditing(false);
      onClothingChanged?.();
    } catch (error) {
      if (error.isAuthError) {
        onAuthExpired?.();
        return;
      }
      setErrorMessage(error.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    try {
      await deleteClothing(token, item.id);
      onClothingChanged?.();
      onNavigate('wardrobe-manage');
    } catch (error) {
      if (error.isAuthError) {
        onAuthExpired?.();
        return;
      }
      setErrorMessage(error.message || '删除失败');
    }
  };

  return (
    <div className="m-page">
      <header className="m-header">
        <div className="m-header-row">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('wardrobe-manage')}>返回</button>
          <h1 className="m-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 20 }}>
            {editing ? '编辑衣物' : '衣物详情'}
          </h1>
          <button className="m-btn m-btn-secondary" onClick={() => setEditing((v) => !v)}>{editing ? '完成' : '编辑'}</button>
        </div>
      </header>

      <main className="m-main">
        {!token ? (
          <section className="m-card">
            <div style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>请先登录后再查看衣物详情。</div>
            <button className="m-btn m-btn-primary" onClick={() => onNavigate('profile')}>去登录</button>
          </section>
        ) : null}

        {token && loading ? <section className="m-card">加载中...</section> : null}
        {errorMessage ? <section className="m-card" style={{ color: '#dc2626' }}>{errorMessage}</section> : null}

        {token && item ? (
          <>
            <section className="m-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="m-clothing-image" style={{ fontSize: 96 }}>
                {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🧥'}
              </div>
            </section>

            <section className="m-card">
              <div className="m-section-title">基本信息</div>
              <label className="m-label">分类</label>
              <input className="m-input" value={item.category_name || '未分类'} disabled />
              <label className="m-label" style={{ marginTop: 10 }}>名称</label>
              <input className="m-input" value={item.name || ''} onChange={handleChange('name')} disabled={!editing} />
              <div className="m-grid-2" style={{ marginTop: 10 }}>
                <div><label className="m-label">颜色</label><input className="m-input" value={item.color || ''} onChange={handleChange('color')} disabled={!editing} /></div>
                <div><label className="m-label">尺码</label><input className="m-input" value={item.size || ''} onChange={handleChange('size')} disabled={!editing} /></div>
              </div>

              <div className="m-section-title" style={{ marginTop: 16 }}>购买信息</div>
              <div className="m-grid-2">
                <div><label className="m-label">价格</label><input className="m-input" value={item.price || ''} onChange={handleChange('price')} disabled={!editing} /></div>
                <div><label className="m-label">日期</label><input className="m-input" value={item.purchase_date || ''} onChange={handleChange('purchase_date')} disabled={!editing} /></div>
              </div>

              <label className="m-label" style={{ marginTop: 10 }}>备注</label>
              <textarea className="m-textarea" value={item.description || ''} onChange={handleChange('description')} disabled={!editing} />
            </section>

            {editing ? (
              <button className="m-btn m-btn-primary" style={{ width: '100%' }} onClick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存修改'}</button>
            ) : (
              <button className="m-btn m-btn-danger" style={{ width: '100%' }} onClick={handleDelete}>删除衣物</button>
            )}
          </>
        ) : null}
      </main>

      <BottomNav active="wardrobe-detail" onNavigate={onNavigate} />
    </div>
  );
}
