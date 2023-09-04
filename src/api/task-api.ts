import ApiBuilder from "./apiBuilder";
import {
  TaskModel,
  AddTaskRequestType,
  UpdateTaskRequestType,
  AddTaskResponseType,
  DeleteTaskResponseType,
  UpdateTaskResponseType,
} from "models";

const apiBuilder = ApiBuilder.getInstance();

export const addTask = apiBuilder.post<AddTaskRequestType, AddTaskResponseType>(
  "/api/projects/projectId/tasks"
);

export const fetchTasks = apiBuilder.get<TaskModel[]>(
  "/api/projects/projectId/tasks"
);

export const updateTask = apiBuilder.put<
  UpdateTaskRequestType,
  UpdateTaskResponseType
>("/api/tasks/projects/projectId/asks");

export const deleteTask = apiBuilder.delete<TaskModel, DeleteTaskResponseType>(
  "/api/tasks/projects/projectId/tasks"
);

const taskApi = { deleteTask, updateTask, fetchTasks, addTask };

export default taskApi;
