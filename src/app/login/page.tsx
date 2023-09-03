"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login, clearAuthError } from "store/reducers";
import { RootState } from "store/store";
import { Notification, NotificationStateType } from "components";
import { NotificationTypes } from "types";

const Login: React.FC = () => {
  const [notification, setNotification] =
    useState<NotificationStateType | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/");
    } else if (auth.error) {
      setNotification({ message: auth.error, type: NotificationTypes.error });
      dispatch(clearAuthError());
    }
  }, [auth.isAuthenticated, auth.error, dispatch, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleRegistrationClick = () => {
    router.push("/registration");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-6">Вхід</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Електронна пошта
            </label>
            <input
              type="text"
              id="email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Увійти
            </button>
            <button
              type="button"
              className="text-blue-500 hover:underline focus:outline-none"
              onClick={handleRegistrationClick}
            >
              Реєстрація
            </button>
          </div>
        </form>
      </div>
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

export default Login;
