import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, { payload: { username, token } }) => {
      state.username = username;
      state.token = token;
    },
    logoutUser: (state) => {
      state.username = null;
      state.token = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
