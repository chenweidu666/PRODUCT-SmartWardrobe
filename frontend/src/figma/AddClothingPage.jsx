import React, { useState } from 'react';
import { BottomNav } from './BottomNav';

export function AddClothingPage({ onNavigate }) {
  const [preview, setPreview] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result || null);
    reader.readAsDataURL(file);
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
        <section className="m-card">
          <div className="m-section-title">图片上传</div>
          <label htmlFor="upload-input" style={{ display: 'block', cursor: 'pointer' }}>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: 14, minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
              {preview ? <img src={preview} alt="预览" style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8 }} /> : <span style={{ color: '#64748b', fontSize: 13 }}>点击上传图片</span>}
            </div>
          </label>
          <input id="upload-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />

          <div className="m-section-title" style={{ marginTop: 16 }}>基本信息</div>
          <label className="m-label">分类</label>
          <select className="m-select" defaultValue="羽绒服">
            <option>羽绒服</option>
            <option>夹克</option>
            <option>大衣</option>
            <option>T恤</option>
          </select>
          <label className="m-label" style={{ marginTop: 10 }}>名称</label>
          <input className="m-input" defaultValue="速写羽绒服" />
          <div className="m-grid-2" style={{ marginTop: 10 }}>
            <div><label className="m-label">颜色</label><input className="m-input" defaultValue="黑色" /></div>
            <div><label className="m-label">尺码</label><input className="m-input" defaultValue="XXL" /></div>
          </div>

          <div className="m-section-title" style={{ marginTop: 16 }}>购买信息</div>
          <div className="m-grid-2">
            <div><label className="m-label">价格</label><input className="m-input" defaultValue="1497" /></div>
            <div><label className="m-label">日期</label><input type="date" className="m-input" /></div>
          </div>

          <label className="m-label" style={{ marginTop: 10 }}>备注</label>
          <textarea className="m-textarea" placeholder="例：通勤外套，洗涤时注意水温" />
        </section>

        <button className="m-btn m-btn-primary" style={{ width: '100%' }} onClick={() => onNavigate('wardrobe-manage')}>
          确认添加衣服
        </button>
      </main>

      <BottomNav active="wardrobe-add" onNavigate={onNavigate} />
    </div>
  );
}

