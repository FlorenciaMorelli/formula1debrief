import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// List all races
export const listRaces = createAsyncThunk('/races', async () => {
    const response = await axios.get('http://localhost:3001/api/races');
    return response.data;
});

export const addRace = createAsyncThunk('/races', async () => {
    const response = await axios.get('http://localhost:3001/api/races');
    return response.data;
});

// TODO: raceDetails, saveRace, deleteRace ...

const racesSlice = createSlice({
    name: 'races',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        editingId: null,
        editingObj: null
    },
    reducers: {
        editRace: (state, action) => {
            state.editingId = action.payload;
        },
        resetRace: (state, action) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ListRaces
            .addCase(listRaces.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(listRaces.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(listRaces.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
        // TODO: raceDetails, saveRace, deleteRace ...
    }
})

export const { editRace, resetRace } = racesSlice.actions;
export default racesSlice.reducer;