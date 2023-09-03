import { takeLatest, call, put, all, select } from "redux-saga/effects";
import {
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
  fetchProjectWithTasksRequest,
  fetchProjectWithTasksSuccess,
  fetchProjectWithTasksFailure,
  addTaskRequest,
  addTaskSuccess,
  addTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
} from "store/reducers";
import ProjectApi from "api/project-api";
import taskApi from "api/task-api";

function* fetchProjects() {
  try {
    const token = yield select((state) => state.auth.token);
    const projects = yield call(ProjectApi.fetchProjects, token);
    yield put(fetchProjectsSuccess(projects));
  } catch (error) {
    yield put(fetchProjectsFailure(error.message));
  }
}

function* fetchProject(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const projectWithTasks = yield call(
      ProjectApi.fetchProjectsWithTasks,
      token,
      action.payload
    );
    yield put(fetchProjectWithTasksSuccess(projectWithTasks));
  } catch (error) {
    yield put(fetchProjectWithTasksFailure(error.message));
  }
}

function* addProject(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const newProject = yield call(ProjectApi.addProject, action.payload, token);
    yield put(addProjectSuccess(newProject));
  } catch (error) {
    yield put(addProjectFailure(error.message));
  }
}

function* updateProject(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const updatedProject = yield call(
      ProjectApi.updateProject,
      action.payload,
      token,
      action.payload.id
    );
    yield put(updateProjectSuccess(updatedProject));
  } catch (error) {
    yield put(updateProjectFailure(error.message));
  }
}

function* deleteProject(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const projectId = action.payload;
    const response = yield call(
      ProjectApi.deleteProject,
      projectId,
      token,
      projectId
    );
    yield put(deleteProjectSuccess({ projectId, message: response.message }));
  } catch (error) {
    yield put(deleteProjectFailure(error.message));
  }
}

function* addTask(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const newTask = yield call(taskApi.addTask, action.payload, token);
    yield put(addTaskSuccess(newTask));
  } catch (error) {
    yield put(addTaskFailure(error.message));
  }
}

function* updateTask(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const updatedTask = yield call(
      taskApi.updateTask,
      action.payload,
      token,
      action.payload.id
    );
    yield put(updateTaskSuccess(updatedTask));
  } catch (error) {
    yield put(updateTaskFailure(error.message));
  }
}

function* deleteTask(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const taskId = action.payload;
    const response = yield call(taskApi.deleteTask, taskId, token, taskId);
    yield put(deleteTaskSuccess({ taskId, message: response.message }));
  } catch (error) {
    yield put(deleteTaskFailure(error.message));
  }
}

export function* watchProjectSaga() {
  yield takeLatest(fetchProjectsRequest.type, fetchProjects);
  yield takeLatest(addProjectRequest.type, addProject);
  yield takeLatest(updateProjectRequest.type, updateProject);
  yield takeLatest(deleteProjectRequest.type, deleteProject);
  yield takeLatest(fetchProjectWithTasksRequest.type, fetchProject);
  yield takeLatest(addTaskRequest.type, addTask);
  yield takeLatest(updateTaskRequest.type, updateTask);
  yield takeLatest(deleteTaskRequest.type, deleteTask);
}

export default function* projectsSaga() {
  yield all([watchProjectSaga()]);
}
