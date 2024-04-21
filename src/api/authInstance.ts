import axios, { AxiosInstance } from "axios";

import { AUTH_URL } from "./endpoints";

const authInstance: AxiosInstance = axios.create({
  baseURL: AUTH_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

export default authInstance;
