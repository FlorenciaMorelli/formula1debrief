import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// List all users
export const listUsers = createAsyncThunk('/users', async () => {
    const response = await axios.get('http://localhost:3001/users');
    return response.data;
});

export const addUser = createAsyncThunk('/users', async () => {
    const response = await axios.get('http://localhost:3001/users');
    return response.data;
});

// TODO: userDetails, saveUser, deleteUser ...

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
            state.editingId = action.payload;
        },
        resetUser: (state, action) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ListUsers
            .addCase(listUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(listUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(listUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
        // TODO: userDetails, saveUser, deleteUser ...
    }
})

export const { editUser, resetUser } = usersSlice.actions;
export default usersSlice.reducer;