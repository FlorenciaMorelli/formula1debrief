import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// List all reviews
export const listReviews = createAsyncThunk('/reviews', async () => {
    const response = await axios.get('http://localhost:3001/reviews');
    return response.data;
})

// TODO: reviewDetails, saveReview, deleteReview ...

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: {
            data: [],
            status: 'idle',
            error: null,
            editingId: null,
            editingObj: null
        }
    },
    reducers: {
        editReview: (state, action) => {
            state.reviews.editingId = action.payload;
        },
        resetReview: (state, action) => {
            state.reviews.editingId = null;
            state.reviews.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ListReviews
            .addCase(listReviews.pending, (state) => {
                state.reviews.status = 'loading';
                state.reviews.error = null;
            })
            .addCase(listReviews.fulfilled, (state, action) => {
                state.reviews.status = 'succeeded';
                state.reviews.data = action.payload;
                state.reviews.error = null;
            })
            .addCase(listReviews.rejected, (state, action) => {
                state.reviews.status = 'failed';
                state.reviews.error = action.error.message;
            })
            // TODO: reviewDetails, saveReview, deleteReview ...
    }
})

export const { editReview, resetReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;