import axios from "axios";
import { toast } from "sonner";
import { baseURL } from "@/config/env";

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorized = callback;
};

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
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
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          if (data?.message === "Invalid credentials") {
            error.normalizedMessage = "Email ou senha incorretos";
          } else {
            error.normalizedMessage = "Sessão expirada. Faça login novamente.";
          }

          if (onUnauthorized) {
            onUnauthorized();
          } else {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
          }
          break;

        case 403:
          error.normalizedMessage =
            "Acesso negado. Você não tem permissão para esta ação.";
          break;

        case 404:
          error.normalizedMessage = "Recurso não encontrado.";
          break;

        case 422:
          if (data.errors && Array.isArray(data.errors)) {
            error.normalizedMessage = data.errors.join("\n");
          } else {
            error.normalizedMessage = data.message || "Dados inválidos.";
          }
          break;

        case 429:
          error.normalizedMessage =
            "Muitas tentativas. Tente novamente em alguns minutos.";
          break;

        case 500:
          error.normalizedMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
          break;

        default:
          error.normalizedMessage =
            data.message || "Ocorreu um erro inesperado.";
      }
    } else if (error.request) {
      error.normalizedMessage =
        "Erro de conexão. Verifique sua internet e tente novamente.";
    } else {
      error.normalizedMessage = "Erro interno. Tente novamente.";
    }

    return Promise.reject(error);
  }
);

export default api;
