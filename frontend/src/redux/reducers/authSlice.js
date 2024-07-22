import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: sessionStorage.getItem('userId') || null,
    username: sessionStorage.getItem('username') || "",
    email: sessionStorage.getItem('email') || "",
    role: sessionStorage.getItem('role') || "",
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAutenticated = true;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.role = action.payload.role;
            sessionStorage.setItem('userId', action.payload.id);
            sessionStorage.setItem('username', action.payload.username);
            sessionStorage.setItem('email', action.payload.email);
            sessionStorage.setItem('role', action.payload.role);
        },
        logout: (state) => {
            state.isAutenticated = false;
            state.id = null;
            state.username = null;
            state.email = null;
            state.role = null;
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('role');
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;