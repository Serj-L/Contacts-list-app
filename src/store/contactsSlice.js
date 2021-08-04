import { createSlice } from '@reduxjs/toolkit';

const contactsSlice = createSlice({
  name: 'contacts',

  initialState: {
    contacts: [],
    isModalOpen: true,
  },

  reducers: {
    addContact(state, action) {
      state.contacts.push(action.payload);
    },

    deleteContact(state, action) {
      state.contacts = state.contacts.filter((id) => id === action.payload.contactId);
    },

    setModalStatus(state, action) {
      state.isModalOpen = action.payload.modalStatus;
    },

  },

});

export const { addContact, deleteContact, setModalStatus } = contactsSlice.actions;

export default contactsSlice.reducer;
