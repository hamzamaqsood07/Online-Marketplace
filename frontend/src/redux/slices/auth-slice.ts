import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  authenticationStatus: boolean; // Replace with your actual state structure
}

const initialState: AuthState = {
  authenticationStatus: false, // Initial state value
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticationStatus: (state, action: PayloadAction<boolean>) => {
      state.authenticationStatus = action.payload;
    },
  },
});

export const { setAuthenticationStatus } = authSlice.actions;

export default authSlice.reducer;
