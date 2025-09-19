// apiService.js
import axios from 'axios';
// import { getAuthUser } from './localStorageHelpers'; // Adjust the path as needed
import { getBaseUrl } from '../global/Environment';
import { getAuthUser } from '../utils/localStorageHelpers';


const apiService = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use(async (config) => {
  const authData = await getAuthUser();
  // alert('🔑 Token from storage:', authData?.token);  // DEBUG
  if (authData && authData.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const getCategories = async () => {
  try {
    const response = await apiService.get('/queue/category');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch categories');
  }
};
export const forgotPassword = async (email) => {

  
  try {
    const response = await apiService.post('/auth/forgot-password', { email });
    return response.data;  // return backend response
  } catch (error) {
    // Bubble up server message if available
    const msg = error.response?.data?.message || 'Failed to send reset link';
    throw new Error(msg);
  }
};
export const verifyOtp = async (email, otp) => {
  try {
    const response = await apiService.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

export const resetPassword = async (email, password, otp) => {
  try {
    const response = await apiService.post('/auth/reset-password', { email, password, otp }); 
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};
export const verifyEmailApi = async (code) => {
  try {
    const response = await apiService.post('/auth/verify', { code });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify email');
  }
};

export const verificationcode = async (code) => {
  try {
    const response = await apiService.post('/auth/verification-code', { code });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify email');
  }
};

export const profileUpdate = async (obj) => {
  try {
    const response = await apiService.post('/user/profile', obj);
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};
export const getUserProfileme = async () => {
  try {
    const response = await apiService.get('/user/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};
export const createQueue = async (queueData) => {
  console.log(queueData,"data");
  
  try {
    const response = await apiService.post('/queue', queueData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create queue');
  }
};
export const getQueueList = async (params = {}) => {
  try {
    const user = await getAuthUser();
    const defaultParams = {
      merchantId: user?.id
    };
    const response = await apiService.get('/queue/list', { params: defaultParams });
    // console.log(response,"list");
    // console.log(response.status,"response.status === 'ok'");
    // response.status
    return response.status === 200 ? response.data || [] : [];
  } catch (error) {
    throw error;
  }
};

// Add other API methods as needed
export default apiService;