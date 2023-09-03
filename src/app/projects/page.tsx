"use client";

import React, { useState, useEffect } from "react";
import { ProjectList, ProjectForm } from "components";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjectsRequest,
  clearProjectsError,
  clearProjectsSuccessMessage,
} from "store/reducers";
import { RootState } from "store/store";
import { Notification, NotificationStateType } from "components";
import { NotificationTypes } from "types";

const ProjectsPage: React.FC = () => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [notification, setNotification] =
    useState<NotificationStateType | null>(null);

  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProjectsRequest());
    }
  }, [isAuthenticated, dispatch]);

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

  const handleAddProject = () => {
    setIsAddingProject(true);
  };

  const handleCloseProjectForm = () => {
    setIsAddingProject(false);
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={handleAddProject}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Додати новий проект
      </button>
      <ProjectList projects={projects?.projects} />
      {isAddingProject && (
        <ProjectForm
          onClose={handleCloseProjectForm}
          isOpenForm={isAddingProject}
        />
      )}
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

export default ProjectsPage;
