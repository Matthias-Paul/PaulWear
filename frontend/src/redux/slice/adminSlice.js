      import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdminSidebarOpen: false,
};

const adminSidebarSlice = createSlice({
  name: "adminSidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isAdminSidebarOpen = !state.isAdminSidebarOpen;
    },
    openSidebar: (state) => {
      state.isAdminSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isAdminSidebarOpen = false;
    },
  },
});

export const { toggleSidebar, openSidebar, closeSidebar } = adminSidebarSlice.actions;
export default adminSidebarSlice.reducer;
