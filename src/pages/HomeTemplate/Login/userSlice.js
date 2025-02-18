import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("userInfo")) || null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => action.payload, // Cập nhật user khi đăng nhập
    logout: () => null, // Đặt lại user về null khi đăng xuất
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
