import axiosHelper from '../helpers/axiosHelper';

interface LoginRequest {
  email: string;
  password: string;
}

interface CheckEmailRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  gender: string;
  date_of_birth: string;
  height: number;
  weight: number;
  skin_tone_id: number;
}

interface SkinToneResponse {
  id: number;
  title: string;
  description: string;
}

export const authService = {
  login: async (request: LoginRequest) => {
        const response = await axiosHelper.post('/auth/login', request);
        return response;
    },

  loginWithGoogle(idToken: string) {
    return axiosHelper.post('/auth/login/google', {
      id_token: idToken,
    });
  },

  checkEmail: async (request: CheckEmailRequest) => {
    const response = await axiosHelper.post('/auth/register/check-email', request);
    return response;
  },

  register: async (request: RegisterRequest) => {
    const response = await axiosHelper.post('/auth/register', request);
    return response;
  },

  getSkinTones: async () => {
    const response = await axiosHelper.get<{
      success: boolean;
      message: string;
      data: SkinToneResponse[];
    }>('/auth/register/skin-tone');
    return response;
  },
};

export default authService;