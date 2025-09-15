import axios from 'axios';
import { toast } from 'sonner';
import { baseURL } from '@/config/env';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          toast.error('Sessão expirada. Faça login novamente.');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Acesso negado. Você não tem permissão para esta ação.');
          break;
        case 404:
          toast.error('Recurso não encontrado.');
          break;
        case 422:
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err: string) => toast.error(err));
          } else {
            toast.error(data.message || 'Dados inválidos.');
          }
          break;
        case 429:
          toast.error('Muitas tentativas. Tente novamente em alguns minutos.');
          break;
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.');
          break;
        default:
          toast.error(data.message || 'Ocorreu um erro inesperado.');
      }
    } else if (error.request) {
      toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
    } else {
      toast.error('Erro interno. Tente novamente.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
