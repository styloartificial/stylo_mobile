import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  } else {
    return await AsyncStorage.getItem('login_token');
  }
};

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 60000, // 60 detik
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    console.log('=== TOKEN CHECK ===');
    console.log('TOKEN:', token ? `ADA: ${token.substring(0, 30)}...` : 'NULL/KOSONG');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // === DEBUG TAMBAHAN ===
    console.log('BASE URL:', config.baseURL);
    console.log('URL:', config.url);
    console.log('METHOD:', config.method);
    console.log('FULL URL:', (config.baseURL ?? '') + (config.url ?? ''));
    console.log('DATA TYPE:', config.data?.constructor?.name);
    console.log('HEADERS:', JSON.stringify(config.headers));
    // === END DEBUG ===

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
    console.log('ERROR CODE:', error?.code);
    console.log('ERROR MSG:', error?.message);
    console.log('IS NETWORK ERROR:', error?.message === 'Network Error');
    if (error.response?.status === 401) {
      console.error('Token expired or unauthorized');
    }
    return Promise.reject(error);
  }
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