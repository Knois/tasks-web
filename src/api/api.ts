import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { IAuthLoginResponse, IAuthRegisterResponse } from "types/AuthResponses";
import { IGroup } from "types/Group";
import { ISpace } from "types/Space";
import { ITask } from "types/Task";
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
  console.log("Error:", error.response?.data || error.message);
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

  updateUser: async (name: ISpace["name"]): Promise<AxiosResponse<IUser>> => {
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

  getSpaces: async (): Promise<AxiosResponse<ISpace[]>> => {
    const response = await sendRequest<ISpace[]>({
      instance: appInstance,
      method: "get",
      url: endpoints.app.space,
    });
    if (!response) {
      throw new Error("Getting spaces failed without a server response.");
    }
    return response;
  },

  getSpaceById: async (id: ISpace["id"]): Promise<AxiosResponse<ISpace>> => {
    const response = await sendRequest<ISpace>({
      instance: appInstance,
      method: "get",
      url: endpoints.app.space + `/${id}`,
    });

    if (!response) {
      throw new Error("Getting space failed without a server response.");
    }
    return response;
  },

  createSpace: async (space: {
    name: ISpace["name"];
    description: ISpace["description"];
    memberEmails: ISpace["memberEmails"];
  }): Promise<AxiosResponse<ISpace>> => {
    const response = await sendRequest<ISpace>({
      instance: appInstance,
      method: "post",
      url: endpoints.app.space,
      data: space,
    });
    if (!response) {
      throw new Error("Creating space failed without a server response.");
    }
    return response;
  },

  updateSpace: async (space: {
    id: ISpace["id"];
    name: ISpace["name"];
    description: ISpace["description"];
    memberEmails: ISpace["memberEmails"];
    groups: ISpace["groups"];
  }): Promise<AxiosResponse<ISpace>> => {
    const response = await sendRequest<ISpace>({
      instance: appInstance,
      method: "put",
      url: endpoints.app.space + `/${space.id}`,
      data: space,
    });
    if (!response) {
      throw new Error("Updating space failed without a server response.");
    }
    return response;
  },

  deleteSpace: async (id: ISpace["id"]): Promise<AxiosResponse> => {
    const response = await sendRequest({
      instance: appInstance,
      method: "delete",
      url: endpoints.app.space + `/${id}`,
    });
    if (!response) {
      throw new Error("Deleting space failed without a server response.");
    }
    return response;
  },

  getGroupById: async (id: IGroup["id"]): Promise<AxiosResponse<IGroup>> => {
    const response = await sendRequest<IGroup>({
      instance: appInstance,
      method: "get",
      url: endpoints.app.group + `/${id}`,
    });

    if (!response) {
      throw new Error("Getting group failed without a server response.");
    }
    return response;
  },

  createGroup: async (group: {
    name: IGroup["name"];
    memberEmails: IGroup["memberEmails"];
    spaceId: ISpace["id"];
  }): Promise<AxiosResponse<IGroup>> => {
    const response = await sendRequest<IGroup>({
      instance: appInstance,
      method: "post",
      url: endpoints.app.group,
      data: group,
    });
    if (!response) {
      throw new Error("Creating group failed without a server response.");
    }
    return response;
  },

  updateGroup: async (
    group: {
      name: IGroup["name"];
      memberEmails: IGroup["memberEmails"];
    },
    id: IGroup["id"],
  ): Promise<AxiosResponse<IGroup>> => {
    const response = await sendRequest<IGroup>({
      instance: appInstance,
      method: "put",
      url: endpoints.app.group + `/${id}`,
      data: group,
    });
    if (!response) {
      throw new Error("Updating group failed without a server response.");
    }
    return response;
  },

  deleteGroup: async (id: IGroup["id"]): Promise<AxiosResponse> => {
    const response = await sendRequest({
      instance: appInstance,
      method: "delete",
      url: endpoints.app.group + `/${id}`,
    });
    if (!response) {
      throw new Error("Deleting group failed without a server response.");
    }
    return response;
  },

  getTaskById: async (id: ITask["id"]): Promise<AxiosResponse<ITask>> => {
    const response = await sendRequest<ITask>({
      instance: appInstance,
      method: "get",
      url: endpoints.app.task + `/${id}`,
    });

    if (!response) {
      throw new Error("Getting task failed without a server response.");
    }
    return response;
  },

  getTasksByGroupId: async (
    id: IGroup["id"],
  ): Promise<AxiosResponse<ITask[]>> => {
    const response = await sendRequest<ITask[]>({
      instance: appInstance,
      method: "get",
      url: endpoints.app.task + "/" + endpoints.app.group + `/${id}`,
    });

    if (!response) {
      throw new Error(
        "Getting tasks by group id failed without a server response.",
      );
    }
    return response;
  },

  createTask: async (task: {
    name: ITask["name"];
    description: ITask["description"];
    deadline: ITask["deadline"];
    hardLvl: ITask["hardLvl"];
    priority: ITask["priority"];
    responsibleEmail: ITask["responsibleEmail"];
    groupId: ITask["groupId"];
  }): Promise<AxiosResponse<ITask>> => {
    const response = await sendRequest<ITask>({
      instance: appInstance,
      method: "post",
      url: endpoints.app.task,
      data: task,
    });
    if (!response) {
      throw new Error("Creating task failed without a server response.");
    }
    return response;
  },

  updateTask: async (
    task: {
      name: ITask["name"];
      description: ITask["description"];
      deadline: ITask["deadline"];
      status: ITask["status"];
      hardLvl: ITask["hardLvl"];
      priority: ITask["priority"];
      failureReason: ITask["failureReason"];
      responsibleEmail: ITask["responsibleEmail"];
      groupId: ITask["groupId"];
    },
    id: ITask["id"],
  ): Promise<AxiosResponse<ITask>> => {
    const response = await sendRequest<ITask>({
      instance: appInstance,
      method: "put",
      url: endpoints.app.task + `/${id}`,
      data: task,
    });
    if (!response) {
      throw new Error("Updating task failed without a server response.");
    }
    return response;
  },

  deleteTask: async (id: ITask["id"]): Promise<AxiosResponse> => {
    const response = await sendRequest({
      instance: appInstance,
      method: "delete",
      url: endpoints.app.task + `/${id}`,
    });
    if (!response) {
      throw new Error("Deleting task failed without a server response.");
    }
    return response;
  },
};

export default API;
