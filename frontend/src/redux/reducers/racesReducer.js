import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Call to GET all races
export const readRaces = createAsyncThunk('/races', async () => {
    const response = await axios.get(`${API_URL}/races`);
    return response.data;
});

// Call to GET race by ID
export const readOneRace = createAsyncThunk('/races/detail', async (id) => {
    const response = await axios.get(`${API_URL}/races/${id}`);
    return response.data;
});

// Call to POST race
export const createRace = createAsyncThunk('/races/create', async (race) => {
    const response = await axios.post(`${API_URL}/races`, race);
    return response.data;
});

// Call to PATCH race
export const updateRace = createAsyncThunk('/races/update', async (race) => {
    const response = await axios.patch(`${API_URL}/races/${race.raceId}`, race);
    return response.data;
});

// Call to DELETE race
export const deleteRace = createAsyncThunk('/races/delete', async (id) => {
    const response = await axios.delete(`${API_URL}/races/${id}`);
    return response.data;
});

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
            state.editingId = action.payload.raceId;
            state.editingObj = action.payload;
        },
        resetRace: (state) => {
            state.editingId = null;
            state.editingObj = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // readRaces
            .addCase(readRaces.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(readRaces.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(readRaces.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // readOneRace
            .addCase(readOneRace.pending, (state) => {
                state.editingObj = null;
                state.error = null;
            })
            .addCase(readOneRace.fulfilled, (state, action) => {
                state.editingObj = action.payload;
                state.error = null;
            })
            .addCase(readOneRace.rejected, (state, action) => {
                state.editingId = null;
                state.editingObj = null;
                state.status = 'error';
                state.error = action.error.message;
            })
            // createRace
            .addCase(createRace.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRace.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(createRace.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // updateRace
            .addCase(updateRace.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRace.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex(race => race.raceId === action.payload.raceId);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateRace.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // deleteRace
            .addCase(deleteRace.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRace.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(race => race.raceId !== action.meta.arg);
            })
            .addCase(deleteRace.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            });
    }
})

export const { editRace, resetRace } = racesSlice.actions;
export default racesSlice.reducer;