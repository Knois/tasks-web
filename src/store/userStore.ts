import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";

import { endpoints } from "../api/endpoints";
import { IUser } from "../types/User";
import { getTokenFromStore } from "../utils";

const userStore = () => {
  return makeAutoObservable(
    {
      email: "" as string,
      name: "" as string,

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
            Alert.alert("Ошибка", error);
          }
        } catch {
          Alert.alert("Ошибка", "Ошибка при получении профиля");
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
            Alert.alert("Ошибка", error);
          }
        } catch {
          Alert.alert("Ошибка", "Ошибка при создании профиля");
        }
      },
    },
    {},
  );
};

export default userStore;
