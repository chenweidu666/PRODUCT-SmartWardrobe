import React, { useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { deleteClothing, fetchClothingDetail, updateClothing, uploadClothingImage } from '../services/api';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const SEASON_OPTIONS = ['春季', '夏季', '秋季', '冬季'];

function parseSeasonList(value) {
  return String(value || '')
    .split(/[、,，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function WardrobeDetailPage({ onNavigate, token, itemId, onClothingChanged, onAuthExpired }) {
  const [editing, setEditing] = useState(false);
  const [item, setItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState('');
  const [seasonSelections, setSeasonSelections] = useState([]);

  React.useEffect(() => {
    if (!token || !itemId) return;
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await fetchClothingDetail(token, itemId);
        if (data.clothing) {
          setItem({
            ...data.clothing,
            is_processed: Number(data.clothing.is_processed) === 1 ? 1 : 0,
          });
          setSeasonSelections(parseSeasonList(data.clothing.season));
        } else {
          setItem(null);
          setSeasonSelections([]);
        }
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

  React.useEffect(() => () => {
    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }
  }, [pendingPreviewUrl]);

  const handleChange = (key) => (event) => {
    setItem((prev) => ({ ...prev, [key]: event.target.value }));
  };
  const handleProcessedChange = (event) => {
    setItem((prev) => ({ ...prev, is_processed: Number(event.target.value) === 1 ? 1 : 0 }));
  };
  const toggleSeason = (season) => {
    setSeasonSelections((prev) => {
      const exists = prev.includes(season);
      return exists ? prev.filter((item) => item !== season) : [...prev, season];
    });
  };

  const handleUploadChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = String(file.name || '').toLowerCase();
    const isImage = (file.type && file.type.startsWith('image/')) || /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i.test(fileName);
    if (!isImage) {
      setErrorMessage('仅支持图片文件上传');
      return;
    }

    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    setErrorMessage('');
    setPendingImageFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
    event.target.value = '';
  };

  const handleSave = async () => {
    if (!item) return;
    try {
      setSaving(true);
      setErrorMessage('');
      if (seasonSelections.length === 0) {
        setErrorMessage('适配季节不能为空');
        return;
      }
      let nextImageUrl = item.image_url || '';
      if (pendingImageFile) {
        const uploadResult = await uploadClothingImage(token, pendingImageFile, item.category_name || '');
        nextImageUrl = uploadResult?.data?.fileUrl || nextImageUrl;
      }
      await updateClothing(token, item.id, {
        category_id: item.category_id,
        name: item.name,
        color: item.color,
        size: item.size,
        is_processed: Number(item.is_processed) === 1 ? 1 : 0,
        chest_circumference: item.chest_circumference || '',
        shoulder_width: item.shoulder_width || '',
        brand: item.brand,
        season: seasonSelections,
        price: item.price,
        purchase_date: item.purchase_date,
        description: item.description,
        image_url: nextImageUrl,
      });
      setItem((prev) => ({ ...prev, image_url: nextImageUrl }));
      setPendingImageFile(null);
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
      setPendingPreviewUrl('');
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
                {(pendingPreviewUrl || item.image_url) ? (
                  <img src={pendingPreviewUrl || item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🧥'}
              </div>
              {editing ? (
                <div style={{ padding: 12, borderTop: '1px solid #e2e8f0' }}>
                  <label htmlFor="detail-upload-input" className="m-btn m-btn-secondary" style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', cursor: 'pointer' }}>
                    {pendingImageFile ? '已选择新图片，保存后生效' : '重新上传图片'}
                  </label>
                  <input
                    id="detail-upload-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUploadChange}
                  />
                </div>
              ) : null}
            </section>

            <section className="m-card">
              <div className="m-section-title">基本信息</div>
              <div className="m-grid-2" style={{ marginTop: 10 }}>
                <div>
                  <label className="m-label">分类</label>
                  <input className="m-input" value={item.category_name || '未分类'} disabled />
                </div>
                <div>
                  <label className="m-label">名称</label>
                  <input className="m-input" value={item.name || ''} onChange={handleChange('name')} disabled={!editing} />
                </div>
                <div>
                  <label className="m-label">颜色</label>
                  <input className="m-input" value={item.color || ''} onChange={handleChange('color')} disabled={!editing} />
                </div>
                <div>
                  <label className="m-label">适配季节</label>
                  <div className="m-chip-row" style={{ marginBottom: 0 }}>
                    {SEASON_OPTIONS.map((season) => (
                      <button
                        type="button"
                        key={season}
                        className={`m-chip ${seasonSelections.includes(season) ? 'active' : ''}`}
                        onClick={() => {
                          if (editing) toggleSeason(season);
                        }}
                        disabled={!editing}
                        style={editing ? undefined : { opacity: 0.85, cursor: 'default' }}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="m-label">尺码（可选）</label>
                  <select className="m-select" value={item.size || ''} onChange={handleChange('size')} disabled={!editing}>
                    <option value="">请选择尺码</option>
                    {SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                    {item.size && !SIZE_OPTIONS.includes(String(item.size).toUpperCase()) ? (
                      <option value={item.size}>{item.size}</option>
                    ) : null}
                  </select>
                </div>
                <div>
                  <label className="m-label">胸围（可选）</label>
                  <input className="m-input" value={item.chest_circumference || ''} onChange={handleChange('chest_circumference')} disabled={!editing} />
                </div>
                <div>
                  <label className="m-label">肩宽（可选）</label>
                  <input className="m-input" value={item.shoulder_width || ''} onChange={handleChange('shoulder_width')} disabled={!editing} />
                </div>
                <div>
                  <label className="m-label">是否处理</label>
                  <div className="m-radio-row">
                    <label className="m-radio-item">
                      <input
                        type="radio"
                        name="detail_is_processed"
                        value="0"
                        checked={Number(item.is_processed) !== 1}
                        onChange={handleProcessedChange}
                        disabled={!editing}
                      />
                      <span>未处理</span>
                    </label>
                    <label className="m-radio-item">
                      <input
                        type="radio"
                        name="detail_is_processed"
                        value="1"
                        checked={Number(item.is_processed) === 1}
                        onChange={handleProcessedChange}
                        disabled={!editing}
                      />
                      <span>已处理</span>
                    </label>
                  </div>
                </div>
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
