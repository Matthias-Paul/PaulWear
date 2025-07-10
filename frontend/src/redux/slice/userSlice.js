import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginUser: null,
  myCart: [],
  myOrders: [],
  cartQuantity: null,
  guestId: `guest_${Date.now()}`
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.loginUser = action.payload;
      state.guestId;
    },        
    deleteUserSuccess: (state) => {
      state.loginUser = null;
    },      
    updateUserSuccess: (state, action) => {          
      state.loginUser = action.payload;
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
    },
    logOutSuccess: (state) => {  
      state.loginUser = null;
      state.guestId = `guest_${new Date().getTime()}`;
      state.cartQuantity = null;   
      state.myCart = [];   

    },
    setMyCart: (state, action) => {
      state.myCart = action.payload;   
    }, 
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;   
    },   
    clearMyCart: (state) => {
      state.cartQuantity = null;   
      state.myCart = []; 
    },       

    setCartQuantity: (state, action) => {         
      state.cartQuantity = action.payload;      
    },
  },
});
// destructuring declaration    
export const {
  signInSuccess,
  deleteUserSuccess,
  updateUserSuccess,
  generateNewGuestId,   
  logOutSuccess,    
  setMyCart,
  setCartQuantity,
  clearMyCart,
  setMyOrders,
  
} = userSlice.actions;  

export default userSlice.reducer;
