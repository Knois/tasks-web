export enum Level {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Status {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  REJECTED = "REJECTED",
}

export interface ITask {
  id: string; // Уникальный идентификатор задачи
  name: string; // Название задачи
  description: string; // Описание задачи
  creationTime: string; // Время создания задачи
  updateTime: string; // Время последнего обновления задачи
  deadline: string; // Срок выполнения задачи
  status: Status; // Статус задачи: создана, в процессе, выполнена, отклонена
  hardLvl: Level; // Уровень сложности задачи: низкий, средний, высокий
  priority: Level; // Приоритет задачи: низкий, средний, высокий
  creatorEmail: string; // Email создателя задачи
  responsibleEmail: string; // Email ответственного за задачу
  groupId: string; // Идентификатор группы, к которой относится задача
  failureReason: string; // Причина отказа (если задача отклонена)
}
