import React from "react";
import { TaskModel } from "models";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-regular-svg-icons";
import { deleteTaskRequest } from "store/reducers";

type TaskCardProps = {
  task: TaskModel;
  onEdit: (task: TaskModel) => void;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const onDelete = () => {
    dispatch(deleteTaskRequest(task.id));
  };
  return (
    <div className="mb-4 bg-gray-200 p-4 rounded-md flex flex-col lg:flex-row justify-between items-center">
      <div className="mb-2 lg:mb-0">
        <p className="font-semibold text-gray-800">
          Назва задачі: {task.title}
        </p>
        <p className="text-gray-800">Опис задачі: {task.description}</p>
        <p className="text-gray-800">
          Статус задачі:{" "}
          {task.status ? (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
          )}
        </p>
      </div>
      <div className="mt-2 lg:mt-0 space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          Редагувати
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
        >
          Видалити
        </button>
      </div>
    </div>
  );
};
