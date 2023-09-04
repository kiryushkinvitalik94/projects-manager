import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga/rootSaga";

export type RootState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  const { createLogger } = require("redux-logger");
  const logger = createLogger();
  middlewares.push(logger);
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [...middlewares],
});

sagaMiddleware.run(rootSaga);

export default store;
