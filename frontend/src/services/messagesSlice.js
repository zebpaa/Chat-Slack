import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { removeChannel } from "./channelsSlice";

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  // когда удаляем канал, все сообщения тоже удаляются (extraReducers)
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, { payload }) => {
      const channelId = payload;
      const restEntities = Object.values(state.entities).filter((e) => e.id !== channelId);
      messagesAdapter.setAll(state, restEntities);
    });
  },
});

export const { addMessage, addMessages, removeMessage, updateMessage } =
  messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors(
  (state) => state.messages
);
export default messagesSlice.reducer;
