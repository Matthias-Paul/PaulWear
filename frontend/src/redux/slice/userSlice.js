import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginUser: null,
  guestId: `guest_${Date.now()}`
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.loginUser = action.payload;
    },  
    deleteUserSuccess: (state) => {
      state.loginUser = null;
    },
    updateUserSuccess: (state, action) => {
      state.loginUser = action.payload;
    },
    logOutSuccess: (state) => {
      state.loginUser = null;
    }
  },
});
// destructuring declaration
export const {
  signInSuccess,
  deleteUserSuccess,
  updateUserSuccess,
  logOutSuccess,
  
} = userSlice.actions;  

export default userSlice.reducer;
