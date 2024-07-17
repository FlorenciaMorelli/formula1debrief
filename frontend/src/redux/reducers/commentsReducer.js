import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/comments`;

// List all comments
export const listComments = createAsyncThunk('/comments', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addComment = createAsyncThunk('/comments', async () => {
    console.log("TODO: axios.post(URL_API, comment)");
});

// TODO: commentDetails, saveComment, deleteComment ...

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
            state.editingId = action.payload;
        },
        resetComment: (state, action) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ListComments
            .addCase(listComments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(listComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(listComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
        // TODO: commentDetails, saveComment, deleteComment ...
    }
})

export const { editComment, resetComment } = commentsSlice.actions;
export default commentsSlice.reducer;