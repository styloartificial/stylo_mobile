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

interface SendOtpRequest {
  email: string;
}

interface SubmitTokenRequest {
  email: string;
  token: string; 
}


interface ChangePasswordRequest {
  email: string;
  token: string; 
  new_password: string; 
  new_password_confirmation: string; 
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

  sendForgotPasswordOtp: async (request: SendOtpRequest) => {
    const response = await axiosHelper.post('/auth/forgot-password/send-otp', request);
    return response;
  },

  submitResetToken: async (request: SubmitTokenRequest) => {
    const response = await axiosHelper.post('/auth/forgot-password/submit-token', request);
    return response;
  },

  changePassword: async (request: ChangePasswordRequest) => {
    const response = await axiosHelper.post('/auth/forgot-password/change-password', request);
    return response;
  },
};

export default authService;