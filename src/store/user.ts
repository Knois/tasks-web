import API from "api/api";
import { makeAutoObservable } from "mobx";

import { IUser } from "../types/User";

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
        try {
          const { data } = await API.getUser();
          this.saveUser(data);
          this.setIsAuth(true);
        } catch (error) {
          console.log(error);
          await this.createUser();
        }
      },

      async createUser() {
        try {
          const { data } = await API.createUser();
          this.saveUser(data);
          this.setIsAuth(true);
        } catch (error) {
          console.log(error);
        }
      },
    },
    {},
  );
};

export default user;
