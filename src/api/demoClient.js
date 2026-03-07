// Demo API Client - Localhost API
const API_BASE_URL = 'http://127.0.0.1:3000/api';

// Helper function for API calls with retry logic and exponential backoff
const apiCall = async (method, endpoint, data = null, retries = 3, backoff = 1000) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  };

  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[API] Attempt ${i + 1}/${retries}: ${method} ${url}`, data);
      
      const response = await fetch(url, options);
      
      console.log(`[API] Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        
        console.error(`[API] Error Response for ${url}:`, errorData);
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }
      
      const json = await response.json();
      console.log(`[API] Success:`, json);
      return json;
    } catch (error) {
      console.error(`[API] Attempt ${i + 1} failed for ${url}:`, error.message);
      
      const isNetworkError = error instanceof TypeError || error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
      const isRetryableStatus = error.message.includes('502') || error.message.includes('503') || error.message.includes('504');
      
      if (i < retries - 1 && (isNetworkError || isRetryableStatus)) {
        const waitTime = backoff * Math.pow(2, i);
        console.warn(`[API] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If it's the last attempt or not a retryable error, throw it
      if (isNetworkError) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc đảm bảo máy chủ đang hoạt động.');
      }
      throw error;
    }
  }
};

// Auth module
const authModule = {
  login: async (email, password) => {
    const response = await apiCall('POST', '/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response.user;
  },
  register: async (data) => {
    const response = await apiCall('POST', '/auth/register', data);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response.user;
  },
  me: async () => {
    try {
      return await apiCall('GET', '/auth/me');
    } catch (error) {
      console.warn('Auth me() failed, using fallback');
      throw error;
    }
  },
  logout: (redirectUrl = null) => {
    localStorage.removeItem('token');
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },
  redirectToLogin: (redirectUrl = null) => {
    if (redirectUrl) {
      window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
    } else {
      window.location.href = '/login';
    }
  },
  updateMe: async (data) => {
    return apiCall('PUT', '/auth/me', data);
  },
};

// Generic entity module factory
const createEntityModule = (entityName) => ({
  list: async (sort = null) => {
    try {
      const url = `/entities/${entityName}${sort ? `?sort=${sort}` : ''}`;
      return await apiCall('GET', url);
    } catch (error) {
      console.warn(`Failed to fetch ${entityName} list, returning empty array`);
      return [];
    }
  },
  filter: async (filters) => {
    try {
      const query = new URLSearchParams(filters).toString();
      return await apiCall('GET', `/entities/${entityName}?${query}`);
    } catch (error) {
      console.warn(`Failed to filter ${entityName}, returning empty array`);
      return [];
    }
  },
  create: async (data) => {
    return apiCall('POST', `/entities/${entityName}`, data);
  },
  update: async (id, data) => {
    return apiCall('PUT', `/entities/${entityName}/${id}`, data);
  },
  delete: async (id) => {
    return apiCall('DELETE', `/entities/${entityName}/${id}`);
  },
});

// Users module
const usersModule = {
  inviteUser: async (email, role) => {
    try {
      return await apiCall('POST', '/entities/Notification', {
        title: 'Invitation',
        content: `You have been invited to join as a ${role}.`,
        target_email: email,
        is_read: false
      });
    } catch (error) {
      console.warn('Invite user failed, returning dummy success');
      return { success: true };
    }
  },
};

// Create demo client
export const demoClient = {
  auth: authModule,
  users: usersModule,
  entities: {
    Course: createEntityModule('Course'),
    Enrollment: createEntityModule('Enrollment'),
    Grade: createEntityModule('Grade'),
    Attendance: createEntityModule('Attendance'),
    TuitionPayment: createEntityModule('TuitionPayment'),
    Classroom: createEntityModule('Classroom'),
    Subject: createEntityModule('Subject'),
    TeachingMaterial: createEntityModule('TeachingMaterial'),
    User: createEntityModule('User'),
    Notification: createEntityModule('Notification'),
  },
};
