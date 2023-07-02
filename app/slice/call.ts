import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from 'services/storage';

export enum CallState {
    Create = 'Create',
    NoCall = 'NoCall',
    Calling = 'Calling',
    Waiting = 'Waiting',
    Coming = 'Coming',
}

type CallInfor = {
    id: string;
    offer: {
        sdp: string;
        type: string;
    };
    answer?: {
        sdp: string;
        type: string;
    };
    fromUser: {
        device: string;
        id?: string;
        username?: string;
    };
    toUser: {
        device: string;
        id?: string;
        username?: string;
    };
};

type CallSliceType = {
    state: CallState;
    infor: {[key: string]: any} | null;
};

const initialState: CallSliceType = {
    state: CallState.NoCall,
    infor: null,
};

export const callSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeCallState: (state, { payload }: PayloadAction<CallState>) => {
            state.state = payload;
        },
        changeCallInfor: (state, { payload }: PayloadAction<{[key: string]: any} | null>) => {
            state.infor = payload;
        },
    },
});

export const callActions = callSlice.actions;

export default callSlice.reducer;
