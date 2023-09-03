import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { addProjectRequest, updateProjectRequest } from "store/reducers";
import { ProjectModel } from "models";

type ProjectFormProps = {
  onClose: () => void;
  isOpenForm: boolean;
  project?: ProjectModel;
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onClose,
  isOpenForm,
  project,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      name: projectName,
      description: projectDescription,
    };

    if (project) {
      dispatch(updateProjectRequest({ ...project, ...newProject }));
    } else {
      dispatch(addProjectRequest(newProject));
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpenForm}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      contentLabel={project ? "Редагувати проект" : "Створити новий проект"}
    >
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
        onClick={(e) => {
          e.stopPropagation();
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white p-4 rounded shadow w-full sm:w-96">
          <h2 className="text-2xl font-semibold mb-4">
            {project ? "Редагувати проект" : "Створити новий проект"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-gray-700">
                Назва проекту:
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="projectDescription"
                className="block text-gray-700"
              >
                Опис проекту:
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full h-32 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              >
                {project ? "Зберегти зміни" : "Створити проект"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                }}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
