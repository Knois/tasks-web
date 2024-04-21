import { makeAutoObservable } from "mobx";

import { endpoints } from "../api/endpoints";
import { IGroup } from "../types/Group";
import { getTokenFromStore } from "../utils";

const groups = () => {
  return makeAutoObservable(
    {
      groups: [] as IGroup[],

      setGroups(groups: IGroup[]) {
        this.groups = groups;
      },

      async getGroups() {
        const token = await getTokenFromStore();

        try {
          const response = await fetch(endpoints.app.group, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            this.setGroups(result);
          } else {
            const error = await response.text();
            alert(error);
          }
        } catch {
          alert("Ошибка при получении групп");
        }
      },

      async createGroup(name: string, memberEmails: string[], cb: () => void) {
        const group = { name, memberEmails };
        const token = await getTokenFromStore();

        try {
          const response = await fetch(endpoints.app.group, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(group),
          });

          if (response.ok) {
            this.getGroups();

            if (typeof cb === "function") {
              cb();
            }
          } else {
            const error = await response.text();
            alert(error);
          }
        } catch {
          alert("Ошибка при создании группы");
        }
      },

      async updateGroup(
        id: string,
        name: string,
        memberEmails: string[],
        cb: () => void,
      ) {
        const group = { name, memberEmails };
        const token = await getTokenFromStore();

        try {
          const response = await fetch(endpoints.app.group + `/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(group),
          });

          if (response.ok) {
            this.getGroups();

            if (typeof cb === "function") {
              cb();
            }
          } else {
            const error = await response.text();
            alert(error);
          }
        } catch {
          alert("Ошибка при создании группы");
        }
      },
    },
    {},
  );
};

export default groups;
