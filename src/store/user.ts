import { makeAutoObservable } from "mobx";

import { endpoints } from "../api/endpoints";
import { IUser } from "../types/User";
import { getTokenFromStore } from "../utils";

const user = () => {
  return makeAutoObservable(
    {
      email: "" as string,
      name: "" as string,
      isAuth: false as boolean,

      setIsAuth(bool: boolean) {
        this.isAuth = bool;
      },

      saveUser(user: IUser) {
        this.email = user.email;
        this.name = user.name;
      },

      async getUser() {
        const token = await getTokenFromStore();

        try {
          const response = await fetch(endpoints.app.user, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            this.saveUser(result);
          } else if (response.status === 404) {
            await this.createUser();
          } else {
            const error = await response.text();
            alert(error);
          }
        } catch {
          alert("Ошибка при получении профиля");
        }
      },

      async createUser() {
        const token = await getTokenFromStore();

        try {
          const response = await fetch(endpoints.app.user, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            this.saveUser(result);
          } else {
            const error = await response.text();
            alert(error);
          }
        } catch {
          alert("Ошибка при создании профиля");
        }
      },
    },
    {},
  );
};

export default user;
