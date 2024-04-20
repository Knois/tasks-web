const BASE_URL = "https://maaax.ru/gateway/our-tasks/api/v1";
const AUTH_URL = "https://maaax.ru/gateway/auth";

export const endpoints = {
  auth: { jwt: AUTH_URL + "/authenticate/jwt", user: AUTH_URL + "/user" },
  app: {
    user: BASE_URL + "/userProfile",
    group: BASE_URL + "/userGroup",
    task: BASE_URL + "/task",
  },
};
