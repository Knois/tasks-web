import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { IAuthLoginResponse, IAuthRegisterResponse } from "types/IAuthResponse";
import { IUser } from "types/User";

import appInstance from "./appInstance";
import authInstance from "./authInstance";
import { endpoints } from "./endpoints";

interface RequestParams {
  instance: AxiosInstance;
  method: "get" | "post" | "put" | "delete";
  url: string;
  data?: any;
}

const handleError = (error: any) => {
  console.error("Error:", error.response?.data || error.message);
  throw new Error(error.response?.data || error.message);
};

const sendRequest = async <T>({
  instance,
  method,
  url,
  data,
}: RequestParams): Promise<AxiosResponse<T> | undefined> => {
  try {
    if (method === "get" || method === "delete") {
      return await instance[method]<T>(url);
    } else {
      return await instance[method]<T>(url, data);
    }
  } catch (error) {
    handleError(error as AxiosError);
    return undefined; // TypeScript не требует этой строки для выполнения кода, но она делает намерения ясными.
  }
};

const API = {
  register: async (user: {
    name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<IAuthRegisterResponse>> => {
    const response = await sendRequest<IAuthRegisterResponse>({
      instance: authInstance,
      method: "post",
      url: endpoints.auth.user,
      data: user,
    });
    if (!response) {
      throw new Error("Registration failed without a server response.");
    }
    return response;
  },

  login: async (user: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<IAuthLoginResponse>> => {
    const response = await sendRequest<IAuthLoginResponse>({
      instance: authInstance,
      method: "post",
      url: endpoints.auth.jwt,
      data: user,
    });
    if (!response) {
      throw new Error("Login failed without a server response.");
    }
    return response;
  },

  getUser: async (): Promise<AxiosResponse<IUser>> => {
    const response = await sendRequest<IUser>({
      instance: appInstance,
      method: "get",
      url: endpoints.app.user,
    });
    if (!response) {
      throw new Error("Fetching user failed without a server response.");
    }
    return response;
  },

  createUser: async (): Promise<AxiosResponse<IUser>> => {
    const response = await sendRequest<IUser>({
      instance: appInstance,
      method: "post",
      url: endpoints.app.user,
    });
    if (!response) {
      throw new Error("Creating user failed without a server response.");
    }
    return response;
  },

  updateUser: async (name: string): Promise<AxiosResponse<IUser>> => {
    const response = await sendRequest<IUser>({
      instance: appInstance,
      method: "put",
      url: endpoints.app.user,
      data: { name },
    });
    if (!response) {
      throw new Error("Updating user failed without a server response.");
    }
    return response;
  },
};

export default API;