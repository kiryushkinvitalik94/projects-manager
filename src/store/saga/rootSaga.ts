import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";
import projectSaga from "./project.saga";

function* rootSaga() {
  yield all([authSaga(), projectSaga()]);
}

export default rootSaga;
