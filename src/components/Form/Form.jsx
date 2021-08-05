import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ConfirmModal } from '../../components';

import {
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
} from '../../store/contactsSlice';

import styles from './Form.module.css';

const formValidator = (name, email, phone, isEmailValid, isPhoneValid) => {
  return name && (((isPhoneValid && !email) || (isEmailValid && !phone) ) || (phone && email && isEmailValid && isPhoneValid)) ? false : true;
};

const emailValidator = (email, isPhoneValid, firstName, lastName) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  return {
    email: isValid,
    acceptBtnStatus: (isValid && (firstName || lastName)) || (isPhoneValid && !email && (firstName || lastName)) ? false : true,
  };
};

const phoneValidator = (phone, isEmailValid, firstName, lastName) => {
  const isValid = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/.test(phone.trim());
  return {
    phone: isValid,
    acceptBtnStatus: (isValid && (firstName || lastName)) || (isEmailValid && !phone && (firstName || lastName)) ? false : true,
  };
};

function Form() {
  const reduxDispatch = useDispatch();
  const contact = useSelector((state) => state.contacts.addContactInfo);
  const { phone: isPhoneValid, email: isEmailValid } = useSelector((state) => state.contacts.isInputsValid);
  const fieldTitle = useSelector((state) => state.contacts.additionalFormFieldTitle);
  const additionalFields = useSelector((state) => state.contacts.additionalFormFields);

  useEffect(() => {
    return () => {
      reduxDispatch(changeModalAcceptBtnStatus({ acceptBtnStatus: true }));
      reduxDispatch(changeConfirmModalAcceptBtnStatus({ acceptBtnStatus: true }));
      reduxDispatch(clearContactInfo());
    };
  },[reduxDispatch]);

  const clearFieldTitle = useCallback(() => reduxDispatch(clrFieldTitle()),[reduxDispatch]);

  return (
    <div className={styles.container}>
      <form className={styles.formWrapper}>
        <label
          className={styles.label}
        >
            First Name:
          <input
            className={styles.input}
            type='text'
            placeholder='First Name'
            name='firstName'
            value={contact.firstName}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changeModalAcceptBtnStatus({ acceptBtnStatus: formValidator( e.target.value, contact.email, contact.phone, isEmailValid, isPhoneValid) }));
            }}
          />
        </label>
        <label
          className={styles.label}
        >
            Last Name:
          <input
            className={styles.input}
            type='text'
            placeholder='Last Name'
            name='lastName'
            value={contact.lastName}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changeModalAcceptBtnStatus({ acceptBtnStatus: formValidator( e.target.value, contact.email, contact.phone, isEmailValid, isPhoneValid) }));
            }}
          />
        </label>
        <label
          className={styles.label}
          data-is-valid={isEmailValid}
          data-is-empty={contact.email ? 'false' : 'true'}
        >
            E-mail:
          <input
            className={styles.input}
            type='email'
            placeholder='E-mail'
            name='email'
            value={contact.email}
            data-is-valid={isEmailValid}
            data-is-empty={contact.email ? 'false' : 'true'}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changeEmailValid(emailValidator(e.target.value, isPhoneValid, contact.firstName, contact.lastName)));
            }}
          />
        </label>
        <label
          className={styles.label}
          data-is-valid={isPhoneValid}
          data-is-empty={contact.phone ? 'false' : 'true'}
        >
            Phone:
          <input
            className={styles.input}
            type='tel'
            placeholder='Phone'
            name='phone'
            value={contact.phone}
            data-is-valid={isPhoneValid}
            data-is-empty={contact.phone ? 'false' : 'true'}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changePhoneValid(phoneValidator(e.target.value, isEmailValid, contact.firstName, contact.lastName)));
            }}
          />
        </label>
        {additionalFields.length ?
          additionalFields.map(additionalField => {
            return (
              <label
                className={styles.label}
                key = {additionalField.id}
              >
                {additionalField.key}:
                <div className={styles.addInputsWrapper}>
                  <input
                    className={styles.input}
                    type='text'
                    placeholder={additionalField.key}
                    name={additionalField.key}
                    value={contact[additionalField.key]}
                    onChange = {(e) => reduxDispatch(addContactInfo({ name: additionalField.key, value: e.target.value }))}
                  />
                  <button
                    className={styles.btnClose}
                    onClick = {() => reduxDispatch(deleteFieldFromForm({ fieldId: additionalField.id, key: additionalField.key }))}
                  >
                    <span className={styles.closeSymb}>&times;</span>
                  </button>
                </div>
              </label>
            );
          }) : null
        }
      </form>
      <button
        className={styles.btn}
        onClick = {() => reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: true }))}
      >
        Add field
      </button>
      <ConfirmModal
        modalTitle = {'Add new field'}
        acceptBtnHandler = {() => {
          reduxDispatch(addFieldToForm({ fieldName: fieldTitle }));
          reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: false }));
        }}
        acceptBtnTitle = {'Add field'}
        rejectBtnHandler = {() => reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: false }))}
        rejectBtnTitle = {'Cancel'}
        componentUnmountFunc = {clearFieldTitle}
      >
        <label
          className={styles.label}
        >
            Field title:
          <input
            className={styles.input}
            type='text'
            placeholder='Field title'
            name='fieldTitle'
            value={fieldTitle}
            onChange = {(e) => {
              reduxDispatch(addFieldTitle({ additionalFormFieldTitle: e.target.value }));
              reduxDispatch(changeConfirmModalAcceptBtnStatus({ acceptBtnStatus: e.target.value ? false : true }));
            }}
          />
        </label>
      </ConfirmModal>
      <hr />
    </div>
  );
}

export default Form;
