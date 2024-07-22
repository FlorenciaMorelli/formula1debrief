import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: JSON.parse(sessionStorage.getItem('id')) || null,
    username: JSON.parse(sessionStorage.getItem('username')) || null,
    email: JSON.parse(sessionStorage.getItem('email')) || null,
    role: JSON.parse(sessionStorage.getItem('role')) || null,
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