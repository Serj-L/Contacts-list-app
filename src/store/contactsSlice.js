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

const contactsSlice = createSlice({
  name: 'contacts',

  initialState: {
    isModalOpen: false,
    isConfirmModalOpen: false,
    isModalAcceptBtnDissabled: true,
    isConfirmModalAcceptBtnDissabled: true,
    addContactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    isInputsValid: {
      phone: false,
      email: false,
    },
    additionalFormFields: [],
    additionalFormFieldTitle: '',
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
    setInitialContactsList(state, action) {
      state.contactsList = action.payload.contactsList;
    },

    changeModalStatus(state, action) {
      state.isModalOpen = action.payload.modalStatus;
    },

    changeConfirmModalStatus(state, action) {
      state.isConfirmModalOpen = action.payload.confirmModalStatus;
    },

    addContactInfo(state, action) {
      state.addContactInfo[action.payload.name] = action.payload.value;
    },

    clearContactInfo(state) {
      Object.keys(state.addContactInfo).forEach(key => state.addContactInfo[key] = '');
    },

    changePhoneValid(state, action) {
      state.isInputsValid.phone = action.payload.phone;
      state.isModalAcceptBtnDissabled = action.payload.acceptBtnStatus;
    },

    changeEmailValid(state, action) {
      state.isInputsValid.email = action.payload.email;
      state.isModalAcceptBtnDissabled = action.payload.acceptBtnStatus;
    },

    changeModalAcceptBtnStatus(state, action) {
      state.isModalAcceptBtnDissabled = action.payload.acceptBtnStatus;
    },

    changeConfirmModalAcceptBtnStatus(state, action) {
      state.isConfirmModalAcceptBtnDissabled = action.payload.acceptBtnStatus;
    },

    addFieldTitle(state, action) {
      state.additionalFormFieldTitle = action.payload.additionalFormFieldTitle;
    },

    clrFieldTitle(state) {
      state.additionalFormFieldTitle = '';
    },

    addFieldToForm(state, action) {
      if (!state.additionalFormFields.filter(el => el.key === action.payload.fieldName).length) {
        state.additionalFormFields.push({
          id: uuid(),
          key: action.payload.fieldName,
        });
        state.addContactInfo[action.payload.fieldName] = '';
      }
    },

    deleteFieldFromForm(state, action) {
      state.additionalFormFields = state.additionalFormFields.filter(el => el.id !== action.payload.fieldId);
      delete state.addContactInfo[action.payload.key];
    },

    addContact(state) {
      const contactInfo = { id: uuid() };
      Object.entries(state.addContactInfo).forEach(([key, value]) => contactInfo[key] = value);
      state.contactsList.push(contactInfo);
    },

    deleteContact(state, action) {
      state.contactsList = state.contactsList.filter((id) => id === action.payload.contactId);
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
  setInitialContactsList,
  changeModalStatus,
  changeConfirmModalStatus,
  addContactInfo,
  clearContactInfo,
  changePhoneValid,
  changeEmailValid,
  changeModalAcceptBtnStatus,
  changeConfirmModalAcceptBtnStatus,
  addFieldTitle,
  clrFieldTitle,
  addFieldToForm,
  deleteFieldFromForm,
  addContact,
  deleteContact,
  setUpSnackbar,
  openSnackbar,
  closeSnackbar,
  setSnackbarWidth,
  setSnackbarHeight,
} = contactsSlice.actions;

export default contactsSlice.reducer;
