import axios, { AxiosInstance } from "axios";
import { getTokenFromStore } from "utils";

import { APP_URL } from "./endpoints";

const appInstance: AxiosInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

appInstance.interceptors.request.use(async (config) => {
  const token = getTokenFromStore();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default appInstance;
