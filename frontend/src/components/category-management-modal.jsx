import React, { useState, useEffect } from 'react';
import './category-management-modal.css';
import { getApiBaseUrl } from '../utils/api';

function CategoryManagementModal({ userId, token, isOpen, onClose, onCategoryUpdate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🏷️',
    color: '#667eea',
    description: ''
  });

  // 获取分类数据
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiBaseUrl()}/api/categories?user_id=${userId}`);

      if (!response.ok) {
        throw new Error('获取分类数据失败');
      }

      const result = await response.json();

      if (result.success) {
        setCategories(result.categories || []);
      } else {
        throw new Error('获取分类数据失败');
      }
    } catch (err) {
      setError(err.message);
      console.error('获取分类错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 创建新分类
  const createCategory = async (categoryData) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...categoryData,
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error('创建分类失败');
      }

      const result = await response.json();
      if (result.success) {
        await fetchCategories();
        setShowAddModal(false);
        setNewCategory({
          name: '',
          icon: '🏷️',
          color: '#667eea',
          description: ''
        });
        if (onCategoryUpdate) {
          onCategoryUpdate();
        }
      } else {
        throw new Error(result.message || '创建分类失败');
      }
    } catch (err) {
      setError(err.message);
      console.error('创建分类错误:', err);
    }
  };

  // 更新分类
  const updateCategory = async (categoryId, categoryData) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        throw new Error('更新分类失败');
      }

      const result = await response.json();
      if (result.success) {
        await fetchCategories();
        setShowEditModal(false);
        setEditingCategory(null);
        if (onCategoryUpdate) {
          onCategoryUpdate();
        }
      } else {
        throw new Error(result.message || '更新分类失败');
      }
    } catch (err) {
      setError(err.message);
      console.error('更新分类错误:', err);
    }
  };

  // 删除功能已移除
  // const openDeleteModal = (category) => {
  //   setCategoryToDelete(category);
  //   setShowDeleteModal(true);
  // };

  // const deleteCategory = async (categoryId) => {
  //   try {
  //     const response = await fetch(`http://localhost:7860/api/categories/${categoryId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error('删除分类失败');
  //     }

  //     const result = await response.json();
  //     if (result.success) {
  //       await fetchCategories();
  //       setShowDeleteModal(false);
  //       setCategoryToDelete(null);
  //       if (onCategoryUpdate) {


  // 处理添加分类
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError('分类名称不能为空');
      return;
    }
    createCategory(newCategory);
  };

  // 处理编辑分类
  const handleEditCategory = (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      setError('分类名称不能为空');
      return;
    }
    updateCategory(editingCategory.id, editingCategory);
  };

  // 打开编辑模态框
  const openEditModal = (category) => {
    setEditingCategory({ ...category });
    setShowEditModal(true);
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // 计算统计信息
  const categoryStats = {
    categoryCount: categories.length,
    totalItems: categories.reduce((sum, cat) => sum + (cat.item_count || 0), 0),
    avgItems: categories.length > 0 
      ? Math.round(categories.reduce((sum, cat) => sum + (cat.item_count || 0), 0) / categories.length)
      : 0
  };

  if (!isOpen) return null;

  return (
    <div className="category-management-modal-overlay">
      <div className="category-management-modal">
        <div className="modal-header">
          <h2>🏷️ 类别管理</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="modal-content">
          <div className="header-controls">
            <button 
              className="add-category-btn"
              onClick={() => setShowAddModal(true)}
            >
              <span>+</span>
              <span>添加新分类</span>
            </button>
          </div>



          <div className="category-stats">
            <div className="stat-card">
              <div className="stat-number">{categoryStats.categoryCount}</div>
              <div className="stat-label">分类数量</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categoryStats.totalItems}</div>
              <div className="stat-label">衣物总数</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categoryStats.avgItems}</div>
              <div className="stat-label">平均数量</div>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>加载分类数据中...</p>
            </div>
          ) : (
            <div className="category-grid">
              {categories.map((category) => (
                <div key={category.id} className="category-card">
                  <div className="category-icon" style={{ backgroundColor: category.color }}>
                    {category.icon}
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <div className="category-count">{category.item_count || 0} 件衣物</div>
                    {category.description && (
                      <div className="category-desc">{category.description}</div>
                    )}
                  </div>
                  <div className="category-actions">
                    <button className="edit-btn" onClick={() => openEditModal(category)}>编辑</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 添加分类模态框 */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>添加新分类</h3>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
              </div>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label>分类名称 *</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="请输入分类名称"
                    required
                  />
                </div>



                <div className="form-group">
                  <label>图标</label>
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    placeholder="🏷️"
                  />
                </div>
                <div className="form-group">
                  <label>颜色</label>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="分类描述（可选）"
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAddModal(false)}>取消</button>
                  <button type="submit">创建</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 编辑分类模态框 */}
        {showEditModal && editingCategory && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>编辑分类</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
              </div>
              <form onSubmit={handleEditCategory}>
                <div className="form-group">
                  <label>分类名称 *</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    placeholder="请输入分类名称"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>图标</label>
                  <input
                    type="text"
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                    placeholder="🏷️"
                  />
                </div>
                <div className="form-group">
                  <label>颜色</label>
                  <input
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                    placeholder="分类描述（可选）"
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowEditModal(false)}>取消</button>
                  <button type="submit">保存</button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default CategoryManagementModal; 