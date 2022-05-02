import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

export const store = configureStore({
  // Key in this is based on the createSlice's corresponding name key for each slice
  reducer: {
    authentication: authReducer,
  },
});
