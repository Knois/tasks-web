import groupsStore from "./groupsStore";
import tasksStore from "./tasksStore";
import userStore from "./userStore";

export const stores = {
  userStore: userStore(),
  groupsStore: groupsStore(),
  tasksStore: tasksStore(),
};
