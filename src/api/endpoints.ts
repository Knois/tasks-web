export const APP_URL = "https://maaax.ru/gateway/our-tasks/api/v1";
export const AUTH_URL = "https://maaax.ru/gateway/auth";

export const endpoints = {
  auth: { jwt: "authenticate/jwt", user: "user" },
  app: {
    user: "userProfile",
    group: "userGroup",
    task: "task",
    space: "userGroupSpace",
  },
};
