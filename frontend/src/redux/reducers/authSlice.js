import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAutenticated: false,
        role: null
    },
    reducers: {
        login: (state, action) => {
            state.isAutenticated = true;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.isAutenticated = false;
            state.role = null;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;