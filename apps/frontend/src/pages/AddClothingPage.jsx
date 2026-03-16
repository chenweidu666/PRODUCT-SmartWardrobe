import React, { useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { createCategory, createClothing, fetchCategories, uploadClothingImage } from '../services/api';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export function AddClothingPage({ onNavigate, token, onClothingChanged, onAuthExpired }) {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    color: '',
    size: '',
    is_processed: '0',
    brand: '',
    season: '',
    price: '',
    purchase_date: '',
    description: '',
  });

  React.useEffect(() => {
    if (!token) return;
    const loadCategories = async () => {
      try {
        let data = await fetchCategories(token);
        let all = Array.isArray(data.categories) ? data.categories : [];

        if (all.length === 0) {
          await createCategory(token, { name: '未分类', icon: '🏷️', color: '#667eea', description: '' });
          data = await fetchCategories(token);
          all = Array.isArray(data.categories) ? data.categories : [];
        }

        setCategories(all);
        if (all[0]?.id) {
          setFormData((prev) => ({ ...prev, category_id: String(all[0].id) }));
        }
      } catch (error) {
        if (error.isAuthError) {
          onAuthExpired?.();
          return;
        }
        setErrorMessage(error.message || '加载分类失败');
      }
    };
    loadCategories();
  }, [token, onAuthExpired]);

  React.useEffect(() => () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  }, [preview]);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = String(file.name || '').toLowerCase();
    const isImage = (file.type && file.type.startsWith('image/')) || /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i.test(fileName);
    if (!isImage) {
      setErrorMessage('仅支持图片文件上传');
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setErrorMessage('');
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    event.target.value = '';
  };

  const handleChange = (key) => (event) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async () => {
    if (!token) {
      onNavigate('profile');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      let imageUrl = '';

      if (imageFile) {
        const selectedCategory = categories.find((item) => String(item.id) === String(formData.category_id));
        const uploadResult = await uploadClothingImage(token, imageFile, selectedCategory?.name || '');
        imageUrl = uploadResult?.data?.fileUrl || '';
      }

      await createClothing(token, {
        category_id: Number(formData.category_id),
        name: formData.name,
        color: formData.color,
        size: formData.size,
        is_processed: Number(formData.is_processed),
        brand: formData.brand,
        season: formData.season,
        price: formData.price,
        purchase_date: formData.purchase_date,
        description: formData.description,
        image_url: imageUrl,
      });
      onClothingChanged?.();
      onNavigate('wardrobe-manage');
    } catch (error) {
      if (error.isAuthError) {
        onAuthExpired?.();
        return;
      }
      setErrorMessage(error.message || '添加衣物失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="m-page">
      <header className="m-header">
        <div className="m-header-row">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('wardrobe-manage')}>返回</button>
          <h1 className="m-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 20 }}>添加衣物</h1>
          <div style={{ width: 64 }} />
        </div>
      </header>

      <main className="m-main">
        {!token ? (
          <section className="m-card">
            <div style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>请先登录后再添加衣物。</div>
            <button className="m-btn m-btn-primary" onClick={() => onNavigate('profile')}>去登录</button>
          </section>
        ) : null}

        {token ? (
          <section className="m-card">
            <div className="m-section-title">图片上传</div>
            <label htmlFor="upload-input" style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: 14, minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                {preview ? <img src={preview} alt="预览" style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8 }} /> : <span style={{ color: '#64748b', fontSize: 13 }}>点击上传图片</span>}
              </div>
            </label>
            <input id="upload-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />

            <div className="m-section-title" style={{ marginTop: 16 }}>基本信息</div>
            <div className="m-grid-2" style={{ marginTop: 10 }}>
              <div>
                <label className="m-label">分类</label>
                <select className="m-select" value={formData.category_id} onChange={handleChange('category_id')}>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="m-label">名称</label>
                <input className="m-input" value={formData.name} onChange={handleChange('name')} />
              </div>
              <div>
                <label className="m-label">颜色</label>
                <input className="m-input" value={formData.color} onChange={handleChange('color')} />
              </div>
              <div>
                <label className="m-label">尺码</label>
                <select className="m-select" value={formData.size} onChange={handleChange('size')}>
                  <option value="">请选择尺码</option>
                  {SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label className="m-label">是否处理</label>
              <div className="m-radio-row">
                <label className="m-radio-item">
                  <input
                    type="radio"
                    name="is_processed"
                    value="0"
                    checked={formData.is_processed === '0'}
                    onChange={handleChange('is_processed')}
                  />
                  <span>未处理</span>
                </label>
                <label className="m-radio-item">
                  <input
                    type="radio"
                    name="is_processed"
                    value="1"
                    checked={formData.is_processed === '1'}
                    onChange={handleChange('is_processed')}
                  />
                  <span>已处理</span>
                </label>
              </div>
            </div>

            <div className="m-section-title" style={{ marginTop: 16 }}>购买信息</div>
            <div className="m-grid-2">
              <div><label className="m-label">价格</label><input className="m-input" value={formData.price} onChange={handleChange('price')} /></div>
              <div><label className="m-label">日期</label><input type="date" className="m-input" value={formData.purchase_date} onChange={handleChange('purchase_date')} /></div>
            </div>

            <label className="m-label" style={{ marginTop: 10 }}>备注</label>
            <textarea className="m-textarea" placeholder="例：通勤外套，洗涤时注意水温" value={formData.description} onChange={handleChange('description')} />
          </section>
        ) : null}

        {errorMessage ? <section className="m-card" style={{ color: '#dc2626' }}>{errorMessage}</section> : null}

        <button className="m-btn m-btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={submitting}>
          {submitting ? '提交中...' : '确认添加衣服'}
        </button>
      </main>

      <BottomNav active="wardrobe-add" onNavigate={onNavigate} />
    </div>
  );
}
