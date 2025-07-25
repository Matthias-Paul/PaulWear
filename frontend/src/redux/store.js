import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice.js";
import sidebarReducer from "./slice/vendorSlice.js";
import adminSidebarReducer from "./slice/adminSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
  sidebar: sidebarReducer,
  adminSidebar: adminSidebarReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
