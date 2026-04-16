import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  } else {
    return await AsyncStorage.getItem('token');
  }
};

const isFormData = (val: any): boolean => {
  // ✅ React Native punya FormData sendiri, instanceof tidak reliable
  // Cek via constructor name atau _parts property (RN FormData internals)
  if (!val) return false;
  if (typeof val === 'object' && val.constructor?.name === 'FormData') return true;
  if (typeof val === 'object' && val._parts !== undefined) return true;
  return false;
};

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    
    // ✅ Tambahkan log ini
    console.log('=== TOKEN CHECK ===');
    console.log('TOKEN:', token ? `ADA: ${token.substring(0, 30)}...` : 'NULL/KOSONG');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isFormData(config.data)) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('=== RESPONSE ERROR ===');
    console.log('STATUS:', error?.response?.status);
    console.log('DATA:', JSON.stringify(error?.response?.data));
    if (error.response?.status === 401) {
      console.error('Token expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;