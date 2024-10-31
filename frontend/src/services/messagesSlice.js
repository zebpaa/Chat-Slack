import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  // когда удаляем канал, все сообщения тоже удаляются
});

export const { addMessage, removeMessage, updateMessage } = messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
