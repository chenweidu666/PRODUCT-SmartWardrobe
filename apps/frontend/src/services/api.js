const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function apiRequest(path, { method = 'GET', token, body, headers } = {}) {
  const requestHeaders = {
    ...JSON_HEADERS,
    ...(headers || {}),
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  const message = data?.message || `请求失败（${response.status}）`;
  if (!response.ok || data?.success === false) {
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    error.isAuthError = response.status === 401 || response.status === 403 || message.includes('token无效');
    throw error;
  }
  return data;
}

export function loginWithPassword(username, password) {
  return apiRequest('/api/login', {
    method: 'POST',
    body: { username, password },
  });
}

export function fetchCategories(token) {
  return apiRequest('/api/categories', { token });
}

export function createCategory(token, payload) {
  return apiRequest('/api/categories', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function fetchClothingList(token) {
  return apiRequest('/api/clothing', { token });
}

export function fetchClothingDetail(token, id) {
  return apiRequest(`/api/clothing/${id}`, { token });
}

export function createClothing(token, payload) {
  return apiRequest('/api/clothing', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function updateClothing(token, id, payload) {
  return apiRequest(`/api/clothing/${id}`, {
    method: 'PUT',
    token,
    body: payload,
  });
}

export function deleteClothing(token, id) {
  return apiRequest(`/api/clothing/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function fetchTodayWeather(city = '上海') {
  const cityParam = encodeURIComponent(city);
  return apiRequest(`/api/weather?city=${cityParam}`);
}
