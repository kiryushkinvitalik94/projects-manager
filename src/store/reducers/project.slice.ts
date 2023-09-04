import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ProjectModel,
  AddProjectRequestType,
  UpdateProjectRequestType,
  FetchProjectsResponseType,
  AddProjectResponseType,
  FetchProjectWithTasksResponseType,
  ProjectWithTasksModel,
  FetchTasksResponseType,
  UpdateProjectResponseType,
  DeleteProjectsResponseType,
  AddTaskRequestType,
  AddTaskResponseType,
  UpdateTaskRequestType,
  UpdateTaskResponseType,
  DeleteTaskResponseType,
} from "models";

type ProjectsState = {
  projects: ProjectModel[];
  projectWithTasks: ProjectWithTasksModel | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
};

const initialState: ProjectsState = {
  projects: [],
  projectWithTasks: null,
  loading: false,
  error: null,
  successMessage: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    fetchProjectWithTasksRequest(state, action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    clearProjectsStore(state) {
      state.projects = [];
      state.projectWithTasks = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    fetchProjectWithTasksSuccess(
      state,
      action: PayloadAction<FetchProjectWithTasksResponseType>
    ) {
      state.projectWithTasks = action.payload.project;
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },
    fetchProjectWithTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearProjectWithTasks(state) {
      state.projectWithTasks = null;
    },
    addTaskRequest(state, action: PayloadAction<AddTaskRequestType>) {
      state.loading = true;
      state.error = null;
    },

    addTaskSuccess(state, action: PayloadAction<AddTaskResponseType>) {
      state.projectWithTasks.tasks = [
        ...state.projectWithTasks.tasks,
        action.payload.task,
      ];
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },

    addTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTaskRequest(state, action: PayloadAction<UpdateTaskRequestType>) {
      state.loading = true;
      state.error = null;
    },

    updateTaskSuccess(state, action: PayloadAction<UpdateTaskResponseType>) {
      const updatedTask = action.payload.task;
      const index = state.projectWithTasks.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (index !== -1) {
        state.projectWithTasks.tasks[index] = updatedTask;
      }
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },

    updateTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTaskRequest(state, action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },

    deleteTaskSuccess(state, action: PayloadAction<DeleteTaskResponseType>) {
      state.projectWithTasks.tasks = state.projectWithTasks.tasks.filter(
        (task) => {
          return task.id !== action.payload.taskId;
        }
      );
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },

    deleteTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProjectsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProjectsSuccess(
      state,
      action: PayloadAction<FetchProjectsResponseType>
    ) {
      state.projects = action.payload.projects;
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },
    fetchProjectsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addProjectRequest(state, action: PayloadAction<AddProjectRequestType>) {
      state.loading = true;
      state.error = null;
    },
    addProjectSuccess(state, action: PayloadAction<AddProjectResponseType>) {
      state.projects.push(action.payload.project);
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },
    addProjectFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateProjectRequest(
      state,
      action: PayloadAction<UpdateProjectRequestType>
    ) {
      state.loading = true;
      state.error = null;
    },
    updateProjectSuccess(
      state,
      action: PayloadAction<UpdateProjectResponseType>
    ) {
      const updatedProject = action.payload.project;
      state.projects = state.projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },
    updateProjectFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProjectRequest(state, action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteProjectSuccess(
      state,
      action: PayloadAction<DeleteProjectsResponseType>
    ) {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload.projectId
      );
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload.message;
    },
    deleteProjectFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearProjectsError(state) {
      state.error = null;
    },
    clearProjectsSuccessMessage(state) {
      state.successMessage = null;
    },
  },
});

export const {
  fetchProjectWithTasksRequest,
  fetchProjectWithTasksSuccess,
  fetchProjectWithTasksFailure,
  clearProjectWithTasks,
  fetchProjectsRequest,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  addProjectRequest,
  addProjectSuccess,
  addProjectFailure,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailure,
  deleteProjectRequest,
  deleteProjectSuccess,
  deleteProjectFailure,
  clearProjectsError,
  clearProjectsSuccessMessage,
  addTaskRequest,
  addTaskSuccess,
  addTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
  clearProjectsStore,
} = projectsSlice.actions;

export default projectsSlice.reducer;
