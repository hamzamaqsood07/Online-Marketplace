import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  profilePicture: string;
}

const initialState: ProfileState = {
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    profilePicture: "",
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
        const {firstName, lastName, email, userType, profilePicture} = action.payload;
        state.firstName = firstName;
        state.lastName = lastName;
        state.email = email;
        state.userType = userType;
        state.profilePicture = profilePicture;
    },
    clearProfile: (state)=> {
        state = initialState;
    }
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
