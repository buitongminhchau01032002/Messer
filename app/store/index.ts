import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from 'services/api';
import applicationReducer from 'slice/application';
import authReducer from 'slice/auth';
import callReducer from 'slice/call';

export const store = configureStore({
    reducer: {
        application: applicationReducer,
        auth: authReducer,
        call: callReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
