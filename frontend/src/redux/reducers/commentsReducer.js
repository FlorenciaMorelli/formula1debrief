import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Thunk para obtener todas las reseñas
export const readComments = createAsyncThunk('comments/readComments', async () => {
    const response = await axios.get(`${API_URL}/comments`);
    return response.data;
});

// Thunk para obtener una reseña por su ID
export const readOneComment = createAsyncThunk('comments/readOneComment', async (id) => {
    const response = await axios.get(`${API_URL}/comments/${id}`);
    return response.data;
});

// Thunk para crear una nueva reseña
export const createComment = createAsyncThunk('comments/createComment', async (comment) => {
    const response = await axios.post(`${API_URL}/comments`, comment);
    return response.data;
});

// Thunk para actualizar una reseña existente
export const updateComment = createAsyncThunk('comments/updateComment', async (comment) => {
    const response = await axios.patch(`${API_URL}/comments/${comment.id}`, comment);
    return response.data;
});

// Thunk para eliminar una reseña
export const deleteComment = createAsyncThunk('comments/deleteComment', async (id) => {
    await axios.delete(`${API_URL}/comments/${id}`);
    return id;
});

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        editingId: null,
        editingObj: null
    },
    reducers: {
        editComment: (state, action) => {
            state.editingId = action.payload.id;
            state.editingObj = action.payload;
        },
        resetComment: (state) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // readComments
            .addCase(readComments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(readComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(readComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // readOneComment
            .addCase(readOneComment.pending, (state) => {
                state.editingObj = null;
                state.error = null;
            })
            .addCase(readOneComment.fulfilled, (state, action) => {
                state.editingObj = action.payload;
                state.error = null;
            })
            .addCase(readOneComment.rejected, (state, action) => {
                state.editingId = null;
                state.editingObj = null;
                state.status = 'error';
                state.error = action.error.message;
            })
            // createComment
            .addCase(createComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // updateComment
            .addCase(updateComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex(comment => comment.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // deleteComment
            .addCase(deleteComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(comment => comment.id !== action.payload);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            });
    }
});

export const { editComment, resetComment } = commentsSlice.actions;
export default commentsSlice.reducer;