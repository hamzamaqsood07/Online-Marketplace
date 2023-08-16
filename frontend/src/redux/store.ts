import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth-slice'; // Update with the correct import path
import productReducer from './slices/product-slice'; // Update with the correct import path
import cartReducer from './slices/cart-slice';
import profileReducer from './slices/profile-slice'

// Create a Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'profile', 'cart'], // List of reducers to persist
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  profile: profileReducer,
});

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;

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
