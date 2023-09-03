import React, { useState } from "react";
import Link from "next/link";
import ProjectForm from "../project-form";
import { ProjectModel } from "models";
import { useDispatch } from "react-redux";
import { deleteProjectRequest } from "store/reducers";

type ProjectCardProps = {
  project: ProjectModel;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const onDeleteClick = () => {
    dispatch(deleteProjectRequest(project.id));
  };

  return (
    <div className="border p-4 rounded-md mb-4">
      {isEditing && (
        <ProjectForm
          project={project}
          onClose={handleCancelEdit}
          isOpenForm={true}
        />
      )}
      <h3 className="text-xl font-semibold mb-2">
        <Link href={`/projects/${project.id}`}>{project.name}</Link>
      </h3>
      <p className="text-sm sm:text-base">{project.description}</p>
      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-3 sm:py-2 sm:px-4 rounded mr-2"
          onClick={handleEditClick}
        >
          Редагувати
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold text-sm py-2 px-3 sm:py-2 sm:px-4 rounded"
          onClick={onDeleteClick}
        >
          Видалити
        </button>
        <Link href={`/projects/${project.id}`}>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold text-sm py-2 px-3 sm:py-2 sm:px-4 rounded ml-2">
            Переглянути проект
          </button>
        </Link>
      </div>
    </div>
  );
};
