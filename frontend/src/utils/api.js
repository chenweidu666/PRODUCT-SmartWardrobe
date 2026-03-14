// 配置API地址 — 自动检测当前访问地址
export const getApiBaseUrl = () => {
  // 生产环境: 前后端同源，使用相对路径
  if (import.meta.env.PROD) {
    return '';
  }
  // 开发环境: 后端在同一主机的 8080 端口
  return `http://${window.location.hostname}:8080`;
};

// 创建带认证头的fetch请求
export const authenticatedFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
}; 