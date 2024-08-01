import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user.slice";
import projectReducer from "./project/project.slice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";



const authConfig = {
  key: "user",
  storage,
  whitelist: ["isAuth", "token", "userId", "isLogin"],
};

const persistedUserReducer = persistReducer(authConfig, userReducer);
const persistedProjectrReducer = persistReducer(authConfig, projectReducer);
const rootReducer = combineReducers({ user: persistedUserReducer , project: persistedProjectrReducer});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store); // to save the store in the local storage
