import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Call to GET all users
export const readUsers = createAsyncThunk('/users/readUsers', async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
});

// Call to GET user by ID
export const readOneUser = createAsyncThunk('/users/readOneUser', async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
});

// Call to POST user
export const createUser = createAsyncThunk('/users/createUser', async (user) => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
});

// Call to PATCH user
export const updateUser = createAsyncThunk('/users/updateUser', async (user) => {
    const response = await axios.patch(`${API_URL}/users/${user.id}`, user);
    return response.data;
});

// Call to DELETE user
export const deleteUser = createAsyncThunk('/users/deleteUser', async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        editingId: null,
        editingObj: null
    },
    reducers: {
        editUser: (state, action) => {
            state.editingId = action.payload.id;
            state.editingObj = action.payload;
        },
        resetUser: (state) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // readUsers
            .addCase(readUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(readUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(readUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // readOneUser
            .addCase(readOneUser.pending, (state) => {
                state.editingObj = null;
                state.error = null;
            })
            .addCase(readOneUser.fulfilled, (state, action) => {
                state.editingObj = action.payload;
                state.error = null;
            })
            .addCase(readOneUser.rejected, (state, action) => {
                state.editingId = null;
                state.editingObj = null;
                state.status = 'error';
                state.error = action.error.message;
            })
            // createUser
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // updateUser
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // deleteUser
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(user => user.id !== action.meta.arg);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            });
    }
})

export const { editUser, resetUser } = usersSlice.actions;
export default usersSlice.reducer;