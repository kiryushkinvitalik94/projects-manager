export type TaskModel = {
  id: number;
  title: string;
  description: string;
  status: boolean;
  projectId: number;
  userId: number;
};

export type FetchTasksResponseType = {
  tasks: TaskModel[];
  message: string;
};

export type AddTaskRequestType = {
  title: string;
  description: string;
  project_id: number;
};

export type AddTaskResponseType = {
  task: TaskModel;
  message: string;
};

export type UpdateTaskRequestType = {
  id: number;
  title?: string;
  description?: string;
  isCompleted?: boolean;
};

export type UpdateTaskResponseType = {
  task: TaskModel;
  message: string;
};

export type DeleteTaskResponseType = {
  taskId: number;
  message: string;
};
