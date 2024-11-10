import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  defaultChannelId: '1',
  currentChannelId: '1',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentChannel: (state, { payload }) => ({
      ...state,
      currentChannelId: payload,
      defaultChannelId: '1',
    }),
  },
});

export const { setCurrentChannel } = uiSlice.actions;
export default uiSlice.reducer;
