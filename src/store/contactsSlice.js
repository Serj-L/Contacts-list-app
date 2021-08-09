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
    }, { dispatch } ) => {
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
    isSaveBtnDissabled: true,
    isUndoBtnDissabled: true,
    isRedoBtnDissabled: true,
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
    currentFieldKey: '',
    isFieldExist: false,
    contactsList,
    currentContact: {},
    currentContactHistory: {
      prev: [],
      current: null,
      next: [],
    },
    isContactsSelected: {
      some: false,
      all: false,
    },
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

    changeSaveBtnStatus(state, action) {
      state.isSaveBtnDissabled = action.payload.saveBtnStatus;
    },

    changeUndoBtnStatus(state, action) {
      state.isUndoBtnDissabled = action.payload.undoBtnStatus;
    },

    changeRedoBtnStatus(state, action) {
      state.isRedoBtnDissabled = action.payload.redoBtnStatus;
    },

    addContactInfo(state, action) {
      state.addContactInfo[action.payload.name] = action.payload.value;
    },

    addCurrentContactInfo(state, action) {
      state.currentContact[action.payload.name] = action.payload.value;
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

    changeFieldExistStatus(state, action) {
      state.isFieldExist = action.payload.fieldExistStatus;
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

    addFieldToCurrentContact(state, action) {
      state.currentContact[action.payload.fieldTitle] = action.payload.fieldValue;
    },

    setCurrentAddField(state, action) {
      state.currentAdditionalField.id = action.payload.additionalFormFieldId;
      state.currentAdditionalField.key = action.payload.additionalFormFieldKey;
    },

    setCurrentFieldKey(state, action) {
      state.currentFieldKey = action.payload.currentFieldKey;
    },

    editCurrentContactField(state, action) {
      if (action.payload.fieldCurrentTitle !== action.payload.fieldNewTitle) {
        const newCurrentContact = {};

        Object.keys(state.currentContact).forEach(key => {
          const value = state.currentContact[key];

          if (key === action.payload.fieldCurrentTitle) {
            newCurrentContact[action.payload.fieldNewTitle] = value;
          } else {
            newCurrentContact[key] = value;
          }
        });
        state.currentContact = newCurrentContact;
      }
      state.currentContact[action.payload.fieldNewTitle] = action.payload.fieldValue;
    },

    deleteFieldFromForm(state, action) {
      state.additionalFormFields = state.additionalFormFields.filter(el => el.id !== action.payload.fieldId);
      delete state.addContactInfo[action.payload.key];
    },

    deleteFieldFromCurrentContact(state, action) {
      delete state.currentContact[action.payload.key];
    },

    addContact(state) {
      const contactInfo = { id: uuid(), selected: false };
      Object.entries(state.addContactInfo).forEach(([key, value]) => contactInfo[key] = value);
      state.contactsList.push(contactInfo);
    },

    setCurrentContact(state, action) {
      state.currentContact = state.contactsList.filter(contact => contact.id === action.payload.contactId)[0];
    },

    updateContact(state) {
      state.contactsList = state.contactsList.map(contact => {
        return contact.id === state.currentContact.id ? contact = state.currentContact : contact;
      });
    },

    deleteContact(state, action) {
      state.contactsList = state.contactsList.filter(contact => contact.id !== action.payload.contactId);
    },

    setContactSelected(state, action) {
      state.contactsList = state.contactsList.map(contact => {
        return contact.id === action.payload.contactId ? { ...contact, selected: !contact.selected } : contact;
      });
    },

    setAllContactsSelected(state) {
      state.contactsList = state.contactsList.map(contact => {
        return { ...contact, selected: true };
      });
    },

    resetSelectedContacts(state) {
      state.contactsList = state.contactsList.map(contact => {
        return contact.selected ? { ...contact, selected: false } : contact;
      });
      if (state.isContactsSelected.some) state.isContactsSelected.some = false;
      if (state.isContactsSelected.all) state.isContactsSelected.all = false;
    },

    changeIsContactsSelected(state, action) {
      state.isContactsSelected[action.payload.key] = action.payload.value;
    },

    deleteSelectedContacts(state) {
      state.contactsList = state.contactsList.filter(contact => contact.selected !== true);
    },

    initCurrentContactStateHistory(state) {
      state.currentContactHistory.current = state.currentContact;
    },

    changeCurrentContactStateHistory(state) {
      state.currentContactHistory.prev.push(state.currentContactHistory.current);
      state.currentContactHistory.current = state.currentContact;
      if (state.currentContactHistory.next.length) {
        state.currentContactHistory.next = [];
        state.isRedoBtnDissabled = true;
      }
    },

    undoCurrentContactStateHistory(state) {
      state.currentContactHistory.next.unshift(state.currentContactHistory.current);
      state.currentContactHistory.current = state.currentContactHistory.prev.pop();
      state.currentContact = state.currentContactHistory.current;
      if (!state.currentContactHistory.prev.length) state.isUndoBtnDissabled = true;
    },

    redoCurrentContactStateHistory(state) {
      state.currentContactHistory.prev.push(state.currentContactHistory.current);
      state.currentContactHistory.current = state.currentContactHistory.next.shift();
      state.currentContact = state.currentContactHistory.current;
      if (!state.currentContactHistory.next.length) state.isRedoBtnDissabled = true;
    },

    resetCurrentContactStateHistory(state) {
      state.currentContactHistory = {
        prev: [],
        current: null,
        next: [],
      };
      state.isSaveBtnDissabled = true;
      state.isUndoBtnDissabled = true;
      state.isRedoBtnDissabled = true;
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
  changeSaveBtnStatus,
  changeUndoBtnStatus,
  changeRedoBtnStatus,
  addContactInfo,
  addCurrentContactInfo,
  clearContactInfo,
  changePhoneValid,
  changeEmailValid,
  changeFieldExistStatus,
  addFieldTitle,
  addFieldValue,
  clrAddFieldValues,
  addFieldToForm,
  addFieldToCurrentContact,
  setCurrentAddField,
  setCurrentFieldKey,
  editCurrentContactField,
  deleteFieldFromForm,
  deleteFieldFromCurrentContact,
  addContact,
  setCurrentContact,
  setContactSelected,
  setAllContactsSelected,
  changeIsContactsSelected,
  resetSelectedContacts,
  updateContact,
  deleteContact,
  deleteSelectedContacts,
  initCurrentContactStateHistory,
  changeCurrentContactStateHistory,
  undoCurrentContactStateHistory,
  redoCurrentContactStateHistory,
  resetCurrentContactStateHistory,
  setUpSnackbar,
  openSnackbar,
  closeSnackbar,
  setSnackbarWidth,
  setSnackbarHeight,
} = contactsSlice.actions;

export default contactsSlice.reducer;
