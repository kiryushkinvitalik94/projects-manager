import React from "react";
import ProjectCard from "./project-card";
import { ProjectModel } from "models";

type ProjectListProps = {
  projects: ProjectModel[];
};

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Список проектів</h2>
      {!!projects?.length &&
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
    </div>
  );
};

export default ProjectList;
