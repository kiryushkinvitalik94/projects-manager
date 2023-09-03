"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import {
  Loader,
  TasksList,
  Notification,
  NotificationStateType,
} from "components";
import { NotificationTypes } from "types";
import {
  fetchProjectWithTasksRequest,
  clearProjectsError,
  clearProjectsSuccessMessage,
} from "store/reducers";

type ProjectPagePropsType = {
  params: { projectId: string };
};

const ProjectPage: React.FC<ProjectPagePropsType> = ({ params }) => {
  const projectId = Number(params.projectId);
  const project = useSelector(
    (state: RootState) => state.projects.projectWithTasks
  );
  const projects = useSelector((state: RootState) => state.projects);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch();
  const [notification, setNotification] =
    useState<NotificationStateType | null>(null);

  useEffect(() => {
    if (projects.successMessage) {
      setNotification({
        message: projects.successMessage,
        type: NotificationTypes.success,
      });
      dispatch(clearProjectsSuccessMessage());
    }
  }, [projects.successMessage, dispatch]);

  useEffect(() => {
    if (projects.error) {
      setNotification({
        message: projects.error,
        type: NotificationTypes.error,
      });
      dispatch(clearProjectsError());
    }
  }, [projects.error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProjectWithTasksRequest(projectId));
    }
  }, [projectId, isAuthenticated, dispatch]);

  if (!project || projects.loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Інформація про проект</h1>
      <p className="mb-2">Назва проекту: {project.name}</p>
      <p className="mb-4">Опис проекту: {project.description}</p>
      <Link href="/projects" className="text-blue-500 hover:underline">
        Повернутися до списку проектів
      </Link>
      <TasksList projectId={projectId} tasks={project.tasks} />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ProjectPage;
