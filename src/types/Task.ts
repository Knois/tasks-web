export interface ITask {
  id: string;
  name: string;
  description: string;
  creationTime: string;
  updateTime: string;
  deadline: string;
  status: string;
  hardLvl: string;
  priority: string;
  creatorEmail: string;
  responsibleEmail: string;
  groupId: string;
  failureReason: string;
}

export interface ITasksCollection {
  [key: string]: ITask[];
}
