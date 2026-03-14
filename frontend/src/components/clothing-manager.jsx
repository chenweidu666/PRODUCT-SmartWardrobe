import React, { useState, useEffect } from 'react';
import ImageUpload from './image-upload';
import CategoryManagementModal from './category-management-modal';
import { getApiBaseUrl, authenticatedFetch } from '../utils/api';
import './clothing-manager.css';

const API_BASE_URL = getApiBaseUrl();

// 图标组件
const Icon = ({ name, className = "", size = 20 }) => {
  const icons = {
    add: "➕",
    edit: "✏️",
    delete: "🗑️",
    favorite: "❤️",
    unfavorite: "🤍",
    category: "📁",
    stats: "📊",
    image: "🖼️",
    close: "✕",
    arrow: "▼",
    check: "✓",
    warning: "⚠️",
    info: "ℹ️",
    clothes: "👕",
    shoes: "👟",
    accessories: "👜",
    jewelry: "💍",
    watch: "⌚",
    bag: "👜",
    hat: "🎩",
    scarf: "🧣",
    belt: "👔",
    sunglasses: "🕶️",
    umbrella: "☂️",
    wallet: "👛",
    tie: "👔",
    socks: "🧦",
    underwear: "🩲",
    swimsuit: "🏊",
    sport: "⚽",
    formal: "🎩",
    casual: "👕",
    winter: "❄️",
    summer: "☀️",
    spring: "🌸",
    autumn: "🍂"
  };

  return (
    <span 
      className={`icon ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={name}
    >
      {icons[name] || "📦"}
    </span>
  );
};

function ClothingManager({ userId, token }) {
  const [clothing, setClothing] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total_items: 0,
    favorite_items: 0,
    category_count: 0,
    total_value: 0,
    items_with_price: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showEditColorDropdown, setShowEditColorDropdown] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // 预存颜色列表（20个）
  const presetColors = [
    '黑色', '白色', '红色', '蓝色', '绿色', 
    '黄色', '紫色', '橙色', '粉色', '灰色',
    '棕色', '深蓝', '浅蓝', '深绿', '浅绿',
    '深红', '浅红', '金色', '银色', '米色'
  ];

  // 颜色映射对象
  const colorMap = {
    '黑色': '#000000',
    '白色': '#FFFFFF',
    '红色': '#FF0000',
    '蓝色': '#0000FF',
    '绿色': '#00FF00',
    '黄色': '#FFFF00',
    '紫色': '#800080',
    '橙色': '#FFA500',
    '粉色': '#FFC0CB',
    '灰色': '#808080',
    '棕色': '#A52A2A',
    '深蓝': '#000080',
    '浅蓝': '#87CEEB',
    '深绿': '#006400',
    '浅绿': '#90EE90',
    '深红': '#8B0000',
    '浅红': '#FFB6C1',
    '金色': '#FFD700',
    '银色': '#C0C0C0',
    '米色': '#F5F5DC'
  };
  
  const [clothingFormData, setClothingFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    color: '',
    size: '',
    brand: '',
    season: '',
    price: '',
    purchase_date: '',
    image_url: ''
  });



  // 获取分类列表
  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  // 获取衣物列表和统计
  useEffect(() => {
    fetchClothing();
    fetchStats();
  }, [selectedCategory, userId, token]);



  // 初始加载时获取统计
  useEffect(() => {
    if (userId && token) {
      fetchStats();
    }
  }, [userId, token]);



  const fetchCategories = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories || data.data || []);
      } else {
        console.error('获取分类失败:', data.message);
      }
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  const fetchClothing = async () => {
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `${API_BASE_URL}/api/clothing?category_id=${selectedCategory}`
        : `${API_BASE_URL}/api/clothing`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const clothingList = data.clothing || [];
        setClothing(clothingList);

        // If a specific category has no items, fall back to "all"
        // to avoid the impression that all data disappeared.
        if (selectedCategory && clothingList.length === 0) {
          setSelectedCategory(null);
        }
      }
    } catch (error) {
      console.error('获取衣物列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clothing/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  const handleAddClothing = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/clothing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clothingFormData)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddForm(false);
        setClothingFormData({
          category_id: '',
          name: '',
          description: '',
          color: '',
          size: '',
          brand: '',
          season: '',
          price: '',
          purchase_date: '',
          image_url: ''
        });
        fetchClothing();
        fetchStats();
      }
    } catch (error) {
      console.error('添加衣物失败:', error);
    }
  };





  const handleEditClothing = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/clothing/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clothingFormData)
      });
      const data = await response.json();
      if (data.success) {
        setShowEditForm(false);
        setEditingItem(null);
        setClothingFormData({
          category_id: '',
          name: '',
          description: '',
          color: '',
          size: '',
          brand: '',
          season: '',
          price: '',
          purchase_date: '',
          image_url: ''
        });
        fetchClothing();
        fetchStats();
      }
    } catch (error) {
      console.error('更新衣物失败:', error);
    }
  };

  const handleDeleteClothing = async (id) => {
    // 找到要删除的衣物信息
    const item = clothing.find(c => c.id === id);
    if (item) {
      setItemToDelete(item);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/clothing/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchClothing();
        fetchStats();
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('删除衣物失败:', error);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clothing/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        await fetchClothing();
        await fetchStats(); // 同时刷新统计信息
      } else {
        console.error('收藏状态更新失败:', data.message);
      }
    } catch (error) {
      console.error('切换收藏状态失败:', error);
    }
  };

  const handleImageUpload = (imageUrl) => {
    setClothingFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
  };

  // 处理旧图片删除
  const handleOldImageDelete = async (oldImageUrl) => {
    try {
      // 从URL中提取文件名
      let fileName = oldImageUrl.split('/').pop();
      
      // 如果URL包含查询参数，移除它们
      if (fileName && fileName.includes('?')) {
        fileName = fileName.split('?')[0];
      }
      
      if (fileName) {
        const response = await fetch(`${API_BASE_URL}/api/upload/image/${fileName}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          console.error(`删除旧图片失败: ${fileName}`);
        }
      }
    } catch (error) {
      console.error('删除旧图片时出错:', error);
    }
  };

  // 获取当前选择的类别名称
  const getCurrentCategoryName = () => {
    if (!clothingFormData.category_id) return null;
    const category = categories.find(cat => cat.id == clothingFormData.category_id);
    return category ? category.name : null;
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setClothingFormData({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      color: item.color || '',
      size: item.size || '',
      brand: item.brand || '',
      season: item.season || '',
      price: item.price || '',
      purchase_date: item.purchase_date || '',
      image_url: item.image_url || ''
    });
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingItem(null);
    setShowEditColorDropdown(false);
    setClothingFormData({
      category_id: '',
      name: '',
      description: '',
      color: '',
      size: '',
      brand: '',
      season: '',
      price: '',
      purchase_date: '',
      image_url: ''
    });
  };

  // 颜色选择处理函数
  const handleColorSelect = (color) => {
    setClothingFormData({...clothingFormData, color});
    setShowColorDropdown(false);
  };

  // 编辑表单颜色选择处理函数
  const handleEditColorSelect = (color) => {
    setClothingFormData({...clothingFormData, color});
    setShowEditColorDropdown(false);
  };

  // 点击外部关闭颜色下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorDropdown && !event.target.closest('.color-dropdown-container')) {
        setShowColorDropdown(false);
      }
      if (showEditColorDropdown && !event.target.closest('.edit-color-dropdown-container')) {
        setShowEditColorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorDropdown, showEditColorDropdown]);

  // 计算对比色函数
  const getContrastColor = (hexColor) => {
    // 移除#号
    const hex = hexColor.replace('#', '');
    
    // 转换为RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 根据亮度返回黑色或白色
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  // 图片预览处理函数
  const handleImagePreview = (imageUrl) => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
    }
  };

  // 关闭图片预览
  const closeImagePreview = () => {
    setPreviewImage(null);
  };


  return (
    <div className="clothing-manager">
      <div className="clothing-header">
        <h2>
          <Icon name="clothes" size={32} className="header-icon" />
          智能衣柜管理
        </h2>
        <div className="header-buttons">
          <button 
            className="add-category-button"
            onClick={() => setShowCategoryManagement(true)}
          >
            <Icon name="category" size={18} />
            <span>分类管理</span>
          </button>
          <button 
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            <Icon name="add" size={18} />
            <span>添加衣物</span>
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="clothes" size={24} />
          </div>
          <div className="stat-number">{stats.total_items || 0}</div>
          <div className="stat-label">总衣物数</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="favorite" size={24} />
          </div>
          <div className="stat-number">{stats.favorite_items || 0}</div>
          <div className="stat-label">收藏衣物</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="category" size={24} />
          </div>
          <div className="stat-number">{stats.category_count || 0}</div>
          <div className="stat-label">分类数量</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="stats" size={24} />
          </div>
          <div className="stat-number">¥{stats.total_value ? stats.total_value.toFixed(0) : 0}</div>
          <div className="stat-label">总价值</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="info" size={24} />
          </div>
          <div className="stat-number">{stats.items_with_price || 0}</div>
          <div className="stat-label">有价格衣物</div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="category-filter">
        <button 
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          全部
        </button>
        
        {/* 所有分类平级显示 */}
        {categories.map(category => (
          <div key={category.id} className="category-filter-item">
            <button
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ borderColor: category.color }}
            >
              {category.icon} {category.name}
            </button>
          </div>
        ))}
      </div>

      {/* 添加衣物表单 */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>添加衣物</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <form onSubmit={handleAddClothing} className="add-form">
              <div className="form-group">
                <label>分类 *</label>
                <select
                  value={clothingFormData.category_id}
                  onChange={(e) => setClothingFormData({...clothingFormData, category_id: e.target.value})}
                  required
                >
                  <option value="">选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>名称 *</label>
                <input
                  type="text"
                  value={clothingFormData.name}
                  onChange={(e) => setClothingFormData({...clothingFormData, name: e.target.value})}
                  placeholder="输入衣物名称"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>颜色</label>
                  <div className="color-dropdown-container">
                    <div 
                      className="color-select-input"
                      onClick={() => setShowColorDropdown(!showColorDropdown)}
                    >
                      {clothingFormData.color ? (
                        <div className="selected-color">
                          <span 
                            className="color-square" 
                            style={{ backgroundColor: colorMap[clothingFormData.color] }}
                          ></span>
                          {clothingFormData.color}
                        </div>
                      ) : (
                        <span className="placeholder">选择颜色</span>
                      )}
                      <span className="dropdown-arrow">▼</span>
                    </div>
                    
                    {showColorDropdown && (
                      <div className="color-dropdown">
                        {presetColors.map(color => (
                          <div
                            key={color}
                            className="color-option"
                            onClick={() => handleColorSelect(color)}
                          >
                            <span 
                              className="color-square" 
                              style={{ backgroundColor: colorMap[color] }}
                            ></span>
                            {color}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>尺码</label>
                  <input
                    type="text"
                    value={clothingFormData.size}
                    onChange={(e) => setClothingFormData({...clothingFormData, size: e.target.value})}
                    placeholder="如：M"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>品牌</label>
                  <input
                    type="text"
                    value={clothingFormData.brand}
                    onChange={(e) => setClothingFormData({...clothingFormData, brand: e.target.value})}
                    placeholder="如：优衣库"
                  />
                </div>
                <div className="form-group">
                  <label>季节</label>
                  <select
                    value={clothingFormData.season}
                    onChange={(e) => setClothingFormData({...clothingFormData, season: e.target.value})}
                  >
                    <option value="">选择季节</option>
                    <option value="春季">春季</option>
                    <option value="夏季">夏季</option>
                    <option value="秋季">秋季</option>
                    <option value="冬季">冬季</option>
                    <option value="春秋">春秋</option>
                    <option value="四季">四季</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>价格 (元)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={clothingFormData.price}
                    onChange={(e) => setClothingFormData({...clothingFormData, price: e.target.value})}
                    placeholder="如：199.99"
                  />
                </div>
                <div className="form-group">
                  <label>购买日期</label>
                  <input
                    type="date"
                    value={clothingFormData.purchase_date}
                    onChange={(e) => setClothingFormData({...clothingFormData, purchase_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>描述</label>
                <textarea
                  value={clothingFormData.description}
                  onChange={(e) => setClothingFormData({...clothingFormData, description: e.target.value})}
                  placeholder="描述这件衣物..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>衣物图片</label>
                <ImageUpload 
                  token={token}
                  onImageUpload={handleImageUpload}
                  currentImageUrl={clothingFormData.image_url}
                  categoryName={getCurrentCategoryName()}
                  onOldImageDelete={handleOldImageDelete}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowAddForm(false);
                  setShowColorDropdown(false);
                }}>
                  取消
                </button>
                <button type="submit" className="primary">
                  添加衣物
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑衣物表单 */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>编辑衣物</h3>
              <button 
                className="close-btn"
                onClick={handleCancelEdit}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <form onSubmit={handleEditClothing} className="add-form">
              <div className="form-group">
                <label>分类 *</label>
                <select
                  value={clothingFormData.category_id}
                  onChange={(e) => setClothingFormData({...clothingFormData, category_id: e.target.value})}
                  required
                >
                  <option value="">选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>名称 *</label>
                <input
                  type="text"
                  value={clothingFormData.name}
                  onChange={(e) => setClothingFormData({...clothingFormData, name: e.target.value})}
                  placeholder="输入衣物名称"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>颜色</label>
                  <div className="edit-color-dropdown-container">
                    <div 
                      className="color-select-input"
                      onClick={() => setShowEditColorDropdown(!showEditColorDropdown)}
                    >
                      {clothingFormData.color ? (
                        <div className="selected-color">
                          <span 
                            className="color-square" 
                            style={{ backgroundColor: colorMap[clothingFormData.color] }}
                          ></span>
                          {clothingFormData.color}
                        </div>
                      ) : (
                        <span className="placeholder">选择颜色</span>
                      )}
                      <span className="dropdown-arrow">▼</span>
                    </div>
                    
                    {showEditColorDropdown && (
                      <div className="color-dropdown">
                        {presetColors.map(color => (
                          <div
                            key={color}
                            className="color-option"
                            onClick={() => handleEditColorSelect(color)}
                          >
                            <span 
                              className="color-square" 
                              style={{ backgroundColor: colorMap[color] }}
                            ></span>
                            {color}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>尺码</label>
                  <input
                    type="text"
                    value={clothingFormData.size}
                    onChange={(e) => setClothingFormData({...clothingFormData, size: e.target.value})}
                    placeholder="如：M"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>品牌</label>
                  <input
                    type="text"
                    value={clothingFormData.brand}
                    onChange={(e) => setClothingFormData({...clothingFormData, brand: e.target.value})}
                    placeholder="如：优衣库"
                  />
                </div>
                <div className="form-group">
                  <label>季节</label>
                  <select
                    value={clothingFormData.season}
                    onChange={(e) => setClothingFormData({...clothingFormData, season: e.target.value})}
                  >
                    <option value="">选择季节</option>
                    <option value="春季">春季</option>
                    <option value="夏季">夏季</option>
                    <option value="秋季">秋季</option>
                    <option value="冬季">冬季</option>
                    <option value="春秋">春秋</option>
                    <option value="四季">四季</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>价格 (元)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={clothingFormData.price}
                    onChange={(e) => setClothingFormData({...clothingFormData, price: e.target.value})}
                    placeholder="如：199.99"
                  />
                </div>
                <div className="form-group">
                  <label>购买日期</label>
                  <input
                    type="date"
                    value={clothingFormData.purchase_date}
                    onChange={(e) => setClothingFormData({...clothingFormData, purchase_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>描述</label>
                <textarea
                  value={clothingFormData.description}
                  onChange={(e) => setClothingFormData({...clothingFormData, description: e.target.value})}
                  placeholder="描述这件衣物..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>衣物图片</label>
                <ImageUpload 
                  token={token}
                  onImageUpload={handleImageUpload}
                  currentImageUrl={clothingFormData.image_url}
                  categoryName={getCurrentCategoryName()}
                  onOldImageDelete={handleOldImageDelete}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCancelEdit}>
                  取消
                </button>
                <button type="submit" className="primary">
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 图片预览模态框 */}
      {previewImage && (
        <div className="image-preview-modal" onClick={closeImagePreview}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-preview-btn" onClick={closeImagePreview}>
              ✕
            </button>
            <img src={previewImage} alt="图片预览" />
          </div>
        </div>
      )}

      {/* 衣物列表 */}
      <div className="clothing-list">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : clothing.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="clothes" size={64} />
            </div>
            <h3>还没有衣物</h3>
            <p>点击"添加衣物"开始管理您的衣柜</p>
          </div>
        ) : (
          <div className="clothing-grid">
            {clothing.map(item => (
              <div key={item.id} className="clothing-card">
                <div className="clothing-image">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      onClick={() => handleImagePreview(item.image_url)}
                      className="clickable-image"
                    />
                  ) : (
                    <div className="placeholder-image">
                      <Icon name="image" size={48} />
                    </div>
                  )}
                  <button
                    className={`favorite-btn ${item.is_favorite ? 'favorited' : ''}`}
                    onClick={() => handleToggleFavorite(item.id)}
                  >
                    <Icon name={item.is_favorite ? 'favorite' : 'unfavorite'} size={20} />
                  </button>
                </div>
                <div className="clothing-info">
                  <h4>{item.name}</h4>
                  <div className="clothing-meta">
                    <span className="category-tag" style={{ backgroundColor: item.category_color }}>
                      <Icon name="category" size={14} />
                      {item.category_name}
                    </span>
                    {item.color && (
                      <span className="meta-item color-tag">
                        <span 
                          className="color-indicator" 
                          style={{ backgroundColor: colorMap[item.color] || '#ccc' }}
                        ></span>
                        {item.color}
                      </span>
                    )}
                    {item.size && (
                      <span className="meta-item">
                        <Icon name="info" size={14} />
                        {item.size}
                      </span>
                    )}
                    {item.brand && (
                      <span className="meta-item">
                        <Icon name="info" size={14} />
                        {item.brand}
                      </span>
                    )}
                    {item.season && (
                      <span className="meta-item">
                        <Icon name={item.season === '春季' ? 'spring' : 
                                   item.season === '夏季' ? 'summer' : 
                                   item.season === '秋季' ? 'autumn' : 'winter'} size={14} />
                        {item.season}
                      </span>
                    )}
                    {item.price && (
                      <span className="meta-item price">
                        <Icon name="stats" size={14} />
                        ¥{item.price}
                      </span>
                    )}
                    {item.purchase_date && (
                      <span className="meta-item">
                        <Icon name="info" size={14} />
                        {item.purchase_date}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="description">{item.description}</p>
                  )}
                </div>
                <div className="clothing-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditClick(item)}
                  >
                    <Icon name="edit" size={16} />
                    <span>编辑</span>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteClothing(item.id)}
                  >
                    <Icon name="delete" size={16} />
                    <span>删除</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>





      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-header">
              <h3>确认删除</h3>
            </div>
            <div className="confirm-content">
              <p>您确定要删除 "{itemToDelete?.name}" 吗？</p>
              <p className="info">
                <Icon name="warning" size={16} />
                衣物将被移到回收站，您可以稍后恢复或永久删除
              </p>
            </div>
            <div className="confirm-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
              >
                <Icon name="close" size={16} />
                <span>取消</span>
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={confirmDelete}
              >
                <Icon name="delete" size={16} />
                <span>移到回收站</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 类别管理模态框 */}
      <CategoryManagementModal
        userId={userId}
        token={token}
        isOpen={showCategoryManagement}
        onClose={() => setShowCategoryManagement(false)}
        onCategoryUpdate={() => {
          fetchCategories();
          fetchClothing();
        }}
      />


    </div>
  );
}

export default ClothingManager; 