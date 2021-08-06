import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export const launchSnackbar = createAsyncThunk(
  'serj/launchSnackbar',
  (
    snackbarParams = {
      message: 'Hello world!',
      options: {
        duration: 3000,
        position: 'top',
        manualClose: false,
      },
    } , { dispatch } ) => {
    dispatch(setUpSnackbar(snackbarParams));
    setTimeout(() => {
      dispatch(openSnackbar());
    }, 350);
    setTimeout(() => {
      dispatch(closeSnackbar());
    }, snackbarParams.options.duration);
  });

const contactsList = localStorage.getItem('contacts') ? JSON.parse(localStorage.getItem('contacts')) : [];

const contactsSlice = createSlice({
  name: 'contacts',

  initialState: {
    isModalOpen: {
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      modal5: false,
    },
    isModalAcceptBtnDissabled: {
      modal1: true,
      modal2: true,
      modal3: true,
      modal4: true,
      modal5: true,
    },
    addContactInfo: {
      name: '',
      surname: '',
      email: '',
      phone: '',
    },
    isInputsValid: {
      phone: false,
      email: false,
    },
    additionalFormFields: [],
    additionalFormFieldTitle: '',
    additionalFormFieldValue: '',
    currentAdditionalField: {},
    contactsList,
    currentContact: {},
    snackbar: {
      message: 'Hello world!',
      options: {
        duration: 3000,
        position: 'top',
        manualClose: false,
      },
      width: 0,
      height: 0,
      positions: ['top', 'bottom', 'left', 'right'],
      isActive: false,
    },
  },

  reducers: {
    changeModalStatus(state, action) {
      state.isModalOpen[action.payload.key] = action.payload.modalStatus;
    },

    changeModalAcceptBtnStatus(state, action) {
      state.isModalAcceptBtnDissabled[action.payload.key] = action.payload.acceptBtnStatus;
    },

    addContactInfo(state, action) {
      state.addContactInfo[action.payload.name] = action.payload.value;
    },

    clearContactInfo(state) {
      Object.keys(state.addContactInfo).forEach(key => state.addContactInfo[key] = '');
    },

    changePhoneValid(state, action) {
      state.isInputsValid.phone = action.payload.phone;
      state.isModalAcceptBtnDissabled[action.payload.key] = action.payload.acceptBtnStatus;
    },

    changeEmailValid(state, action) {
      state.isInputsValid.email = action.payload.email;
      state.isModalAcceptBtnDissabled[action.payload.key] = action.payload.acceptBtnStatus;
    },

    addFieldTitle(state, action) {
      state.additionalFormFieldTitle = action.payload.additionalFormFieldTitle;
    },

    addFieldValue(state, action) {
      state.additionalFormFieldValue = action.payload.additionalFormFieldValue;
    },

    clrAddFieldValues(state) {
      state.additionalFormFieldTitle = '';
      state.additionalFormFieldValue = '';
    },

    addFieldToForm(state, action) {
      if (!state.additionalFormFields.filter(el => el.key === action.payload.fieldTitle).length) {
        state.additionalFormFields.push({
          id: uuid(),
          key: action.payload.fieldTitle,
        });
        state.addContactInfo[action.payload.fieldTitle] = action.payload.fieldValue;
      }
    },

    setCurrentAddField(state, action) {
      state.currentAdditionalField.id = action.payload.additionalFormFieldId;
      state.currentAdditionalField.key = action.payload.additionalFormFieldKey;
    },

    deleteFieldFromForm(state, action) {
      state.additionalFormFields = state.additionalFormFields.filter(el => el.id !== action.payload.fieldId);
      delete state.addContactInfo[action.payload.key];
    },

    addContact(state) {
      const contactInfo = { id: uuid(), selected: false };
      Object.entries(state.addContactInfo).forEach(([key, value]) => contactInfo[key] = value);
      state.contactsList.push(contactInfo);
    },

    setCurrentContact(state, action) {
      state.currentContact = state.contactsList.filter(contact => contact.id === action.payload.contactId)[0];
    },

    setContactSelected(state, action) {
      state.contactsList = state.contactsList.map(contact => {
        return contact.id === action.payload.contactId ? { ...contact, selected: !contact.selected } : contact;
      });
    },

    deleteContact(state, action) {
      state.contactsList = state.contactsList.filter(contact => contact.id !== action.payload.contactId);
    },

    deleteSelectedContacts(state) {
      state.contactsList = state.contactsList.filter(contact => contact.selected !== true);
    },

    setUpSnackbar(state, action) {
      if (typeof(action.payload.options.duration) !== 'number' || action.payload.options.duration < 3000) action.payload.options.duration = 3000;
      if (action.payload.options.duration > 15000) action.payload.options.manualClose = true;
      if (!state.snackbar.positions.includes(action.payload.options.position)) action.payload.options.position = 'top';
      if (typeof(action.payload.options.manualClose) !== 'boolean') action.payload.options.manualClose = false;
      state.snackbar.message = action.payload.message;
      state.snackbar.options = action.payload.options;
    },

    openSnackbar(state) {
      state.snackbar.isActive = true;
    },

    closeSnackbar(state) {
      state.snackbar.isActive = false;
    },

    setSnackbarWidth(state, action) {
      state.snackbar.width = action.payload.width;
    },

    setSnackbarHeight(state, action) {
      state.snackbar.height = action.payload.height;
    },
  },

});

export const {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  addContactInfo,
  clearContactInfo,
  changePhoneValid,
  changeEmailValid,
  addFieldTitle,
  addFieldValue,
  clrAddFieldValues,
  addFieldToForm,
  setCurrentAddField,
  deleteFieldFromForm,
  addContact,
  setCurrentContact,
  setContactSelected,
  deleteContact,
  deleteSelectedContacts,
  setUpSnackbar,
  openSnackbar,
  closeSnackbar,
  setSnackbarWidth,
  setSnackbarHeight,
} = contactsSlice.actions;

export default contactsSlice.reducer;
