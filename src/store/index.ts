import groups from "./groups";
import tasks from "./tasks";
import user from "./user";

export const stores = {
  userStore: user(),
  groupsStore: groups(),
  tasksStore: tasks(),
};
