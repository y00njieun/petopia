import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "order",
  storage,
};

const persistedOrderReducer = persistReducer(persistConfig, orderReducer);

const orderStore = configureStore({
  reducer: {
    order: persistedOrderReducer,
  },
});

export type RootState = ReturnType<typeof orderStore.getState>;
export const persistor = persistStore(orderStore); // Persistor 추가
export default orderStore;