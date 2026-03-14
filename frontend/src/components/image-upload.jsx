import React, { useState, useRef, useEffect } from 'react';
import './image-upload.css';
import { getApiBaseUrl } from '../utils/api';

const API_BASE_URL = getApiBaseUrl();

function ImageUpload({ token, onImageUpload, currentImageUrl = '', categoryName = null, onOldImageDelete = null }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [oldImageUrl, setOldImageUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  // 监听 currentImageUrl 变化，更新预览和旧图片URL
  useEffect(() => {
    setPreviewUrl(currentImageUrl);
    setOldImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('请选择有效的图片文件 (JPG, PNG, WebP, GIF)');
      return;
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('图片大小不能超过 5MB');
      return;
    }

    // 记录当前图片URL作为旧图片
    if (previewUrl) {
      setOldImageUrl(previewUrl);
    }

    // 显示预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // 上传文件
    uploadFile(file);
    
    // 清空文件输入框，允许选择同一个文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // 如果有类别信息，添加到表单数据中
      if (categoryName) {
        formData.append('categoryName', categoryName);
      }

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success) {
        const newImageUrl = data.data.fileUrl;
        setPreviewUrl(newImageUrl);
        onImageUpload(newImageUrl);
        setError('');
        
        // 如果有旧图片需要删除，通知父组件
        if (oldImageUrl && onOldImageDelete) {
          onOldImageDelete(oldImageUrl);
        }
        

      } else {
        setError(data.message || '上传失败');
        setPreviewUrl(currentImageUrl);
      }
    } catch (error) {
      console.error('上传错误:', error);
      setError('网络错误，请重试');
      setPreviewUrl(currentImageUrl);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    // 如果有当前图片，通知父组件删除
    if (previewUrl && onOldImageDelete) {
      onOldImageDelete(previewUrl);
    }
    
    setPreviewUrl('');
    setOldImageUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-upload">
      <div className="upload-area">
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="预览" />
            <div className="image-overlay">
              <button 
                className="change-btn"
                onClick={handleClickUpload}
                disabled={uploading}
              >
                更换图片
              </button>
              <button 
                className="remove-btn"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                删除
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="upload-placeholder"
            onClick={handleClickUpload}
          >
            <div className="upload-icon">📷</div>
            <p>点击上传图片</p>
            <p className="upload-hint">支持 JPG, PNG, WebP, GIF 格式，最大 5MB</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* 上传进度 */}
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {/* 图片优化提示 */}
      {previewUrl && !uploading && (
        <div className="optimization-info">
          <span>✅ 图片已优化</span>
          <span>📱 智能压缩</span>
          <span>💾 节省空间</span>
        </div>
      )}
    </div>
  );
}

export default ImageUpload; 