import { configureStore, combineReducers } from '@reduxjs/toolkit';
import racesReducer from './reducers/racesReducer';
import reviewsReducer from './reducers/reviewsReducer';
import commentsReducer from './reducers/commentsReducer';
import usersReducer from './reducers/usersReducer';
import authSlice from './reducers/authSlice';

const rootReducer = combineReducers({
    races: racesReducer,
    reviews: reviewsReducer,
    comments: commentsReducer,
    users: usersReducer,
    auth: authSlice
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
