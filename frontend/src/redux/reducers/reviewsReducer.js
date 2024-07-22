import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Thunk para obtener todas las reseñas
export const readReviews = createAsyncThunk('reviews/readReviews', async () => {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data;
});

// Thunk para obtener una reseña por su ID
export const readOneReview = createAsyncThunk('reviews/readOneReview', async (id) => {
    const response = await axios.get(`${API_URL}/reviews/${id}`);
    return response.data;
});

// Thunk para crear una nueva reseña
export const createReview = createAsyncThunk('reviews/createReview', async (review) => {
    const response = await axios.post(`${API_URL}/reviews`, review);
    return response.data;
});

// Thunk para actualizar una reseña existente
export const updateReview = createAsyncThunk('reviews/updateReview', async (review) => {
    const response = await axios.patch(`${API_URL}/reviews/${review.id}`, review);
    return response.data;
});

// Thunk para eliminar una reseña
export const deleteReview = createAsyncThunk('reviews/deleteReview', async (id) => {
    await axios.delete(`${API_URL}/reviews/${id}`);
    return id;
});

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        editingId: null,
        editingObj: null
    },
    reducers: {
        editReview: (state, action) => {
            state.editingId = action.payload.id;
            state.editingObj = action.payload;
        },
        resetReview: (state) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // readReviews
            .addCase(readReviews.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(readReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(readReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // readOneReview
            .addCase(readOneReview.pending, (state) => {
                state.editingObj = null;
                state.error = null;
            })
            .addCase(readOneReview.fulfilled, (state, action) => {
                state.editingObj = action.payload;
                state.error = null;
            })
            .addCase(readOneReview.rejected, (state, action) => {
                state.editingId = null;
                state.editingObj = null;
                state.status = 'error';
                state.error = action.error.message;
            })
            // createReview
            .addCase(createReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(createReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // updateReview
            .addCase(updateReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // deleteReview
            .addCase(deleteReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(review => review.id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            });
    }
});

export const { editReview, resetReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;