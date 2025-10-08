import axios from "axios";
import { env } from "../env";

const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
export default apiClient;
