import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTaskRequest, updateTaskRequest } from "store/reducers";
import { TaskModel } from "models";

type TasksFormProps = {
  onClose: () => void;
  task?: TaskModel;
  projectId: number;
};

export const TaskForm: React.FC<TasksFormProps> = ({
  onClose,
  task,
  projectId,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: !!task.status,
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | HTMLInputElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? !formData.status : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      dispatch(updateTaskRequest({ ...task, ...formData }));
    } else {
      dispatch(addTaskRequest({ ...formData, project_id: projectId }));
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white p-4 shadow-md rounded-lg w-96 text-black">
        <h2 className="text-xl font-semibold mb-4">
          {task ? "Редагувати завдання" : "Додати завдання"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block font-semibold">
              Назва
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-semibold">
              Опис
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block font-semibold">
              Статус
            </label>
            <label
              htmlFor="status"
              className="block font-semibold cursor-pointer"
            >
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="mr-2 border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
              Виконано
            </label>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 text-gray-600 hover:underline"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              {task ? "Зберегти" : "Додати"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
