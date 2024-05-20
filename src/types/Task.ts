export interface ITask {
  id: string;
  name: string;
  description: string;
  creationTime: string;
  updateTime: string;
  deadline: string;
  status: "CREATED" | "IN_PROGRESS" | "DONE" | "REJECTED";
  hardLvl: "LOW" | "MEDIUM" | "HIGH";
  priority: "LOW" | "MEDIUM" | "HIGH";
  creatorEmail: string;
  responsibleEmail: string;
  groupId: string;
  failureReason: string;
}

export interface ITasksCollection {
  [key: string]: ITask[];
}
