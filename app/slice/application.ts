import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateFormat, TimeFormat } from "config/config.base";
import { authApi } from "services/api/Entrance";
import storage from "services/storage";

export enum AsyncActionThunkState {
  Idle = "Idle",
  Pending = "Pending",
  Fulfilled = "Fulfilled",
  Rejected = "Rejected",
}

export type ApplicationStateType = {
  isAppReady: boolean;
  theme: string;
  font?: string;
  force_dark?: boolean;
  language?: string;
  intro: boolean;
  currency: {
    symbol: string;
    code: string;
  };
  serverSettings: {
    dateFormat: string;
    timeFormat: string;
  };
  asyncActionThunkState: AsyncActionThunkState;
};

const initialState: ApplicationStateType = {
  isAppReady: false,
  theme: "blue",
  font: undefined,
  force_dark: false,
  language: undefined,
  intro: true,
  currency: {
    symbol: "€",
    code: "USD",
  },
  serverSettings: {
    dateFormat: DateFormat.Default.toString(),
    timeFormat: TimeFormat.Default.toString(),
  },
  asyncActionThunkState: AsyncActionThunkState.Idle,
};

async function asyncAction(action: Promise<any>, { rejectWithValue }: any) {
  return action.then((data) => data).catch((err) => rejectWithValue(err));
}

export const asyncThunkAction = createAsyncThunk(
  "application/asyncThunkAction",
  asyncAction
);

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    changeApplicationState: (
      state,
      { payload }: PayloadAction<Partial<ApplicationStateType>>
    ) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(asyncThunkAction.fulfilled, (state) => {
      state.asyncActionThunkState = AsyncActionThunkState.Fulfilled;
    });
    builder.addCase(asyncThunkAction.pending, (state) => {
      state.asyncActionThunkState = AsyncActionThunkState.Pending;
    });
    builder.addCase(asyncThunkAction.rejected, (state) => {
      state.asyncActionThunkState = AsyncActionThunkState.Rejected;
    });
  },
});

export const { changeApplicationState } = applicationSlice.actions;

export default applicationSlice.reducer;
