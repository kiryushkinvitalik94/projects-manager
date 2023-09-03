"use client";

import { useSelector } from "react-redux";
import { RootState } from "store/store";
import ProjectsPage from "./projects/page";

export default function Home() {
  const auth = useSelector((state: RootState) => state.auth);

  return <ProjectsPage />;
}
