import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAutenticated: false,
        id: null,
        username: null,
        email: null,
        role: null
    },
    reducers: {
        login: (state, action) => {
            state.isAutenticated = true;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.isAutenticated = false;
            state.id = null;
            state.username = null;
            state.email = null;
            state.role = null;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;