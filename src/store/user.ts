import API from "api/api";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { ISpace } from "types/Space";
import { IUser } from "types/User";

const user = () => {
  return makeAutoObservable(
    {
      email: "" as string,
      name: "" as string,
      isAuth: false as boolean,
      spaces: [] as ISpace[],
      isLoadingSpaces: false as boolean,

      setIsAuth(bool: boolean) {
        this.isAuth = bool;
      },

      setSpaces(spaces: ISpace[]) {
        this.spaces = spaces;
      },

      setEmail(email: string) {
        this.email = email;
      },

      setName(name: string) {
        this.name = name;
      },

      setIsLoadingSpaces(bool: boolean) {
        this.isLoadingSpaces = bool;
      },

      saveUser(user: IUser) {
        this.setEmail(user.email);
        this.setName(user.name);
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

      async getSpaces() {
        this.setIsLoadingSpaces(true);

        try {
          const { data } = await API.getSpaces();
          this.setSpaces(data);
        } catch (error) {
          toast.error(`Error while getting spaces! ${error}`);
        } finally {
          this.setIsLoadingSpaces(false);
        }
      },

      logout() {
        localStorage.clear();
        this.setIsAuth(false);
        this.setSpaces([]);
        this.setEmail("");
        this.setName("");
      },
    },
    {},
  );
};

export default user;
