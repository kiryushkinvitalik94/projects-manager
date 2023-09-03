import { combineReducers } from "redux";
import projectReducer from "./project.slice";
import authReducer from "./auth.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectReducer,
});

export default rootReducer;

export * from "./auth.slice";
export * from "./project.slice";
