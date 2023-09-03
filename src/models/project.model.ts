import { TaskModel } from "models";

export type ProjectModel = {
  id: number;
  name: string;
  description: string;
  user_id: number;
};

export type ProjectWithTasksModel = {
  id: number;
  name: string;
  description: string;
  user_id: number;
  tasks: TaskModel[];
};

export type FetchProjectWithTasksResponseType = {
  message: string;
  project: ProjectWithTasksModel;
};

export type AddProjectRequestType = Pick<ProjectModel, "description" | "name">;

export type AddProjectResponseType = {
  project: ProjectModel;
  message: string;
};

export type FetchProjectsResponseType = {
  message: string;
  projects: ProjectModel[];
};
export type DeleteProjectsResponseType = {
  message: string;
  projectId: number;
};

export type UpdateProjectRequestType = {
  id: number;
} & AddProjectRequestType;

export type UpdateProjectResponseType = AddProjectResponseType;
