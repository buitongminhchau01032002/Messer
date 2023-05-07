import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "services/api/Entrance";
import storage from "services/storage";

export type AuthStateType = {
  token?: string;
  session: any;
  isLogin: boolean;
  user: any;
  parent: any;
};

const initialState: AuthStateType = {
  token: "",
  session: undefined,
  isLogin: false,
  user: undefined,
  parent: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      return initialState;
    },
    reLogin: (state, { payload }: PayloadAction<Partial<AuthStateType>>) => {
      state.token = payload.token;
      state.isLogin = true;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { token } = payload;
        console.log(payload);
        storage.set("token", token);
        // const token = payload.result;
        state.token = token;
        state.isLogin = true;
      }
    );
  },
});

export const { logout, reLogin } = authSlice.actions;

export default authSlice.reducer;
