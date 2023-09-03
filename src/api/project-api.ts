import ApiBuilder from "./apiBuilder";
import {
  ProjectModel,
  UpdateProjectRequestType,
  AddProjectResponseType,
  UpdateProjectResponseType,
  FetchProjectWithTasksResponseType,
} from "models";

const apiBuilder = new ApiBuilder();

export const addProject = apiBuilder.post<ProjectModel, AddProjectResponseType>(
  "/api/projects"
);

export const fetchProjects = apiBuilder.get<ProjectModel[]>("/api/projects");

export const fetchProjectsWithTasks =
  apiBuilder.get<FetchProjectWithTasksResponseType>("/api/projects");

export const updateProject = apiBuilder.put<
  UpdateProjectRequestType,
  UpdateProjectResponseType
>("/api/projects");

export const deleteProject = apiBuilder.delete<ProjectModel, ProjectModel>(
  "/api/projects"
);

const projectApi = {
  deleteProject,
  updateProject,
  fetchProjects,
  addProject,
  fetchProjectsWithTasks,
};

export default projectApi;
