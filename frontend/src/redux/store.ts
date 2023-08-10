import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth-slice.ts'; // Update with the correct import path
import productReducer from './slices/product-slice.ts'; // Update with the correct import path

// Create a Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // List of reducers to persist
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
});

// Define the RootState type
type RootState = ReturnType<typeof rootReducer>;

// Create a persisted reducer using Redux Persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create your Redux store using configureStore from Redux Toolkit
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux Persist
    }),
});

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const persistor = persistStore(store);
