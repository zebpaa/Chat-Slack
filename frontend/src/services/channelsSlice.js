import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({});

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
    },
    updateChannel: channelsAdapter.updateOne,
  },
});

export const { addChannel, addChannels, removeChannel, updateChannel } = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
