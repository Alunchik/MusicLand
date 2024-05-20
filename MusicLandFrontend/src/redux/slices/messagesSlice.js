import { createSlice } from "@reduxjs/toolkit";

        
const messagesSlice = createSlice({
    name:'messages',
    initialState: {
        messages: [{ id: 0, text: 'Тут могла быть ваша реклама' }],

    },
    reducers: {
        addMessage(state, action) {
            console.log(action)
            state.messages.push({ id: state.messages.length, text: action.payload.message });
          },
    },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
