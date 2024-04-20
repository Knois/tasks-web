import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";

import { endpoints } from "../api/endpoints";
import { ITask, ITasksCollection } from "../types/Task";
import { getTokenFromStore } from "../utils";

const tasksStore = () => {
  return makeAutoObservable(
    {
      tasks: {} as ITasksCollection,

      saveTasks(id: string, tasks: ITask[]) {
        this.tasks = { ...this.tasks, [id]: tasks };
      },

      async getTasksByGroupId(id: string) {
        const token = await getTokenFromStore();

        try {
          const response = await fetch(
            endpoints.app.task + `/userGroup/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.ok) {
            const result = await response.json();
            this.saveTasks(id, result);
          } else {
            const error = await response.text();
            Alert.alert("Ошибка", error);
          }
        } catch {
          Alert.alert("Ошибка", `Ошибка при получении задач, id группы ${id}`);
        }
      },
    },
    {},
  );
};

export default tasksStore;
