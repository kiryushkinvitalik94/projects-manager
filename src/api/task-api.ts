import ApiBuilder from "./apiBuilder";
import {
  TaskModel,
  AddTaskRequestType,
  UpdateTaskRequestType,
  AddTaskResponseType,
  DeleteTaskResponseType,
  UpdateTaskResponseType,
} from "models";

const apiBuilder = new ApiBuilder();

export const addTask = apiBuilder.post<AddTaskRequestType, AddTaskResponseType>(
  "/api/tasks"
);

export const fetchTasks = apiBuilder.get<TaskModel[]>("/api/tasks");

export const updateTask = apiBuilder.put<
  UpdateTaskRequestType,
  UpdateTaskResponseType
>("/api/tasks");

export const deleteTask = apiBuilder.delete<TaskModel, DeleteTaskResponseType>(
  "/api/tasks"
);

const taskApi = { deleteTask, updateTask, fetchTasks, addTask };

export default taskApi;
