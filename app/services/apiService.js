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
alert(email);
  
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
console.log(email, password, otp,"email, password, otp")
  try {
    const response = await apiService.post('/auth/reset-password', { email, password, otp });
    console.log(response,"res");
    
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

// Add other API methods as needed
export default apiService;