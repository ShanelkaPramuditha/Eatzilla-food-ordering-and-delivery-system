import { useAxios as axios } from '@/hooks/use-axios';
import { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schema';

const AuthService = {
  register: async (formData: RegisterFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = formData;
    const res = await axios.post(`/register`, rest);
    return res.data;
  },

  login: async (formData: LoginFormValues) => {
    const res = await axios.post(`/login`, formData);
    return res.data;
  },

  logout: async () => {
    const res = await axios.post(`/logout`);
    return res.data;
  },

  getProfile: async () => {
    const res = await axios.get(`/profile`);
    return res.data;
  },
};

export default AuthService;
