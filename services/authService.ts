import axiosHelper from '../helpers/axiosHelper';

interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  login: async (request: LoginRequest) => {
        const response = await axiosHelper.post('/auth/login', request);
        return response;
    }
};

export default authService;