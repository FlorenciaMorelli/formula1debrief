import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// List all reviews
export const listReviews = createAsyncThunk('/reviews', async () => {
    const response = await axios.get('http://localhost:3001/api/reviews');
    return response.data;
});

export const addReview = createAsyncThunk('/reviews', async () => {
    const response = await axios.get('http://localhost:3001/api/reviews');
    return response.data;
});

// TODO: reviewDetails, saveReview, deleteReview ...

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
            state.editingId = action.payload;
        },
        resetReview: (state, action) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ListReviews
            .addCase(listReviews.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(listReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(listReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
        // TODO: reviewDetails, saveReview, deleteReview ...
    }
})

export const { editReview, resetReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;