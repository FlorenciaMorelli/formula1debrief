import { configureStore, combineReducers } from '@reduxjs/toolkit';
import racesReducer from './reducers/racesReducer';
import reviewsReducer from './reducers/reviewsReducer';
import likesReducer from './reducers/likesReducer';
import usersReducer from './reducers/usersReducer';
import authSlice from './reducers/authSlice';

const rootReducer = combineReducers({
    auth: authSlice,
    races: racesReducer,
    reviews: reviewsReducer,
    likes: likesReducer,
    users: usersReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
