"use client";

import { useSelector } from "react-redux";
import { RootState } from "store/store";

export default function Home() {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-white p-8 shadow-md rounded-md w-96 mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Профіль користувача
      </h2>
      <p className="text-lg text-gray-900">
        <span className="font-semibold">Ім&apos;я користувача:</span>{" "}
        {auth.user ? auth.user.username : "Не відомо"}
      </p>
      <p className="text-lg text-gray-900">
        <span className="font-semibold">Електронна пошта:</span>{" "}
        {auth.user ? auth.user.email : "Не відомо"}
      </p>
    </div>
  );
}
