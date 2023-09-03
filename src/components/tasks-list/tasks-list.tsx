import React, { useState } from "react";
import { TaskModel } from "models";
import TaskForm from "./task-form";
import TaskCard from "./task-card";

type TasksListProps = {
  tasks: TaskModel[];
  projectId: number;
};

export const TasksList: React.FC<TasksListProps> = ({ tasks, projectId }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<null | TaskModel>(null);

  const onAddTaskClick = () => {
    setIsAddingTask(true);
  };

  const closeTaskForm = () => {
    setIsAddingTask(false);
  };

  const onEdit = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-black">Список задач:</h2>
        <button
          onClick={onAddTaskClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Додати нову задачу
        </button>
      </div>
      {(isAddingTask || editingTask) && (
        <TaskForm
          projectId={projectId}
          task={editingTask}
          onClose={closeTaskForm}
        />
      )}
      <ul className="list-disc pl-4">
        {tasks.map((task) => (
          <TaskCard onEdit={onEdit} key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};
