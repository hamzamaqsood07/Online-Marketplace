import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  authenticationStatus: boolean; // Replace with your actual state structure
  token: string | null;
}

const initialState: AuthState = {
  authenticationStatus: false, // Initial state value
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      console.log("payload action of token",action.payload)
      state.token = action.payload;
      state.authenticationStatus = true;
    },
    clearAuthToken: (state) => {
      state.token = null;
      state.authenticationStatus = false;
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
