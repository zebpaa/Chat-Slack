import { configureStore } from "@reduxjs/toolkit";

import messagesSlice from "./messagesSlice.js";
import channelsSlice from "./channelsSlice.js";

const store = configureStore({
  reducer: {
    channels: channelsSlice,
    messages: messagesSlice,
  },
});

export default store;
