import { AxiosResponse } from "axios";
import { IAuthLoginResponse, IAuthRegisterResponse } from "types/IAuthResponse";
import { IUser } from "types/User";

import appInstance from "./appInstance";
import authInstance from "./authInstance";
import { endpoints } from "./endpoints";

const register = async (user: {
  name: string;
  email: string;
  password: string;
}): Promise<AxiosResponse<IAuthRegisterResponse>> => {
  console.log("trying to register user");

  try {
    const response = await authInstance.post<IAuthRegisterResponse>(
      endpoints.auth.user,
      user,
    );
    return response;
  } catch (error: any) {
    console.log("error.response.data", error.response.data);
    console.log("error.message", error.message);
    throw new Error(error.response.data);
  }
};

const login = async (user: {
  email: string;
  password: string;
}): Promise<AxiosResponse<IAuthLoginResponse>> => {
  console.log("trying to get jwt");

  try {
    const response = await authInstance.post<IAuthLoginResponse>(
      endpoints.auth.jwt,
      user,
    );
    return response;
  } catch (error: any) {
    console.log("error.response.data", error.response.data);
    console.log("error.message", error.message);
    throw new Error(error.response.data);
  }
};

const getUser = async (): Promise<AxiosResponse<IUser>> => {
  console.log("trying to get user profile");

  try {
    const response = await appInstance.get<IUser>(endpoints.app.user);
    return response;
  } catch (error: any) {
    console.log("error.response.data", error.response.data);
    console.log("error.message", error.message);
    throw new Error(error.response.data);
  }
};

const createUser = async (): Promise<AxiosResponse<IUser>> => {
  console.log("trying to create user profile");

  try {
    const response = await appInstance.post<IUser>(endpoints.app.user);
    return response;
  } catch (error: any) {
    console.log("error.response.data", error.response.data);
    console.log("error.message", error.message);
    throw new Error(error.response.data);
  }
};

const API = {
  register,
  login,
  getUser,
  createUser,
};

export default API;
