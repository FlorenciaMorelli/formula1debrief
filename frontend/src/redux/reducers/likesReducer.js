import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Thunk para obtener todas las reseñas
export const readLikes = createAsyncThunk('likes/readLikes', async () => {
    const response = await axios.get(`${API_URL}/likes`);
    return response.data;
});

// Thunk para obtener una reseña por su ID
export const readOneLike = createAsyncThunk('likes/readOneLike', async (id) => {
    const response = await axios.get(`${API_URL}/likes/${id}`);
    return response.data;
});

// Thunk para crear una nueva reseña
export const createLike = createAsyncThunk('likes/createLike', async (like) => {
    const response = await axios.post(`${API_URL}/likes`, like);
    return response.data;
});

// Thunk para actualizar una reseña existente
export const updateLike = createAsyncThunk('likes/updateLike', async (like) => {
    const response = await axios.patch(`${API_URL}/likes/${like.id}`, like);
    return response.data;
});

// Thunk para eliminar una reseña
export const deleteLike = createAsyncThunk('likes/deleteLike', async (id) => {
    await axios.delete(`${API_URL}/likes/${id}`);
    return id;
});

const likesSlice = createSlice({
    name: 'likes',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        editingId: null,
        editingObj: null
    },
    reducers: {
        editLike: (state, action) => {
            state.editingId = action.payload.id;
            state.editingObj = action.payload;
        },
        resetLike: (state) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // readLikes
            .addCase(readLikes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(readLikes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(readLikes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // readOneLike
            .addCase(readOneLike.pending, (state) => {
                state.editingObj = null;
                state.error = null;
            })
            .addCase(readOneLike.fulfilled, (state, action) => {
                state.editingObj = action.payload;
                state.error = null;
            })
            .addCase(readOneLike.rejected, (state, action) => {
                state.editingId = null;
                state.editingObj = null;
                state.status = 'error';
                state.error = action.error.message;
            })
            // createLike
            .addCase(createLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(createLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // updateLike
            .addCase(updateLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex(like => like.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // deleteLike
            .addCase(deleteLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(like => like.id !== action.payload);
            })
            .addCase(deleteLike.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            });
    }
});

export const { editLike, resetLike } = likesSlice.actions;
export default likesSlice.reducer;