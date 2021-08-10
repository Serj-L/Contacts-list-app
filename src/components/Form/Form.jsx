import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Modal } from '../../components';

import {
  changeModalStatus,
  addContactInfo,
  clearContactInfo,
  changePhoneValid,
  changeEmailValid,
  changeModalAcceptBtnStatus,
  changeFieldExistStatus,
  addFieldTitle,
  addFieldValue,
  clrAddFieldValues,
  addFieldToForm,
  deleteFieldFromForm,
  setCurrentAddField,
} from '../../store/contactsSlice';

import styles from './Form.module.css';

const formValidator = (name, email, phone, isEmailValid, isPhoneValid) => {
  return (name && (!email && !phone)) || (isEmailValid && !phone) || (isPhoneValid && !email) || (isEmailValid && isPhoneValid) ? false : true;
};

const emailValidator = (email, phone, isPhoneValid, name, surname, key) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  return {
    email: isValid,
    key,
    acceptBtnStatus: (isValid && !phone) || (isPhoneValid && !email) || (isValid && isPhoneValid) || ((!email && !phone) && (name || surname)) ? false : true,
  };
};

const phoneValidator = (phone, email, isEmailValid, name, surname, key) => {
  const isValid = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/.test(phone.trim());
  return {
    phone: isValid,
    key,
    acceptBtnStatus: (isValid && !email) || (isEmailValid && !phone) || (isValid && isEmailValid) || ((!phone && !email) && (name || surname)) ? false : true,
  };
};

function Form() {
  const reduxDispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const contact = useSelector((state) => state.contacts.addContactInfo);
  const { phone: isPhoneValid, email: isEmailValid } = useSelector((state) => state.contacts.isInputsValid);
  const isFieldExist = useSelector((state) => state.contacts.isFieldExist);
  const fieldTitle = useSelector((state) => state.contacts.additionalFormFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFormFieldValue);
  const currentAddfield = useSelector((state) => state.contacts.currentAdditionalField);
  const additionalFields = useSelector((state) => state.contacts.additionalFormFields);

  useEffect(() => {
    return () => {
      reduxDispatch(clearContactInfo());
    };
  }, [reduxDispatch]);

  const clearAddFieldValues = useCallback(() => reduxDispatch(clrAddFieldValues()), [reduxDispatch]);

  return (
    <div className={styles.container}>
      <form className={styles.formWrapper}>
        <label
          className={styles.label}
        >
          name:
          <input
            className={styles.input}
            type='text'
            placeholder='name'
            name='name'
            value={contact.name}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: formValidator( e.target.value, contact.email, contact.phone, isEmailValid, isPhoneValid) }));
            }}
          />
        </label>
        <label
          className={styles.label}
        >
          surname:
          <input
            className={styles.input}
            type='text'
            placeholder='surname'
            name='surname'
            value={contact.surname}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: formValidator(e.target.value, contact.email, contact.phone, isEmailValid, isPhoneValid) }));
            }}
          />
        </label>
        <label
          className={styles.label}
          data-is-valid={isEmailValid}
          data-is-empty={contact.email ? 'false' : 'true'}
        >
          email:
          <input
            className={styles.input}
            type='email'
            placeholder='email'
            name='email'
            value={contact.email}
            data-is-valid={isEmailValid}
            data-is-empty={contact.email ? 'false' : 'true'}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changeEmailValid(emailValidator(e.target.value, contact.phone, isPhoneValid, contact.name, contact.surname, 'modal1')));
            }}
          />
        </label>
        <label
          className={styles.label}
          data-is-valid={isPhoneValid}
          data-is-empty={contact.phone ? 'false' : 'true'}
        >
          phone:
          <input
            className={styles.input}
            type='tel'
            placeholder='phone'
            name='phone'
            value={contact.phone}
            data-is-valid={isPhoneValid}
            data-is-empty={contact.phone ? 'false' : 'true'}
            onChange = {(e) => {
              reduxDispatch(addContactInfo({ name: e.target.name, value: e.target.value }));
              reduxDispatch(changePhoneValid(phoneValidator(e.target.value, contact.email, isEmailValid, contact.name, contact.surname, 'modal1')));
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
                    onChange = {(e) =>{
                      e.preventDefault();
                      reduxDispatch(addContactInfo({ name: additionalField.key, value: e.target.value }));
                    }}
                  />
                  <button
                    className={styles.btnClose}
                    onClick = {(e) => {
                      e.preventDefault();
                      reduxDispatch(setCurrentAddField({ additionalFormFieldId: additionalField.id, additionalFormFieldKey: additionalField.key }));
                      reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: false }));
                      reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: true }));
                    }}
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
        onClick = {() => reduxDispatch(changeModalStatus({ key: 'modal2', modalStatus: true }))}
      >
        Add field
      </button>

      <Modal
        isModalActive = {isModalOpen.modal2}
        modalKey = {'modal2'}
        modalTitle = {'Add new field'}
        acceptBtnHandler = {() => {
          reduxDispatch(addFieldToForm({ fieldTitle: fieldTitle, fieldValue: fieldValue }));
          reduxDispatch(changeModalStatus({ key: 'modal2', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Add field'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal2', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: true }));
        }}
        rejectBtnTitle = {'Cancel'}
        componentUnmountFunc = {clearAddFieldValues}
      >
        <label
          className={styles.label}
          data-is-uniq={!isFieldExist}
          data-is-empty={fieldTitle ? 'false' : 'true'}
        >
          Field title:
          <input
            className={styles.input}
            type='text'
            placeholder='Field title'
            name='fieldTitle'
            value={fieldTitle}
            data-is-uniq={!isFieldExist}
            data-is-empty={fieldTitle ? 'false' : 'true'}
            onChange = {(e) => {
              reduxDispatch(addFieldTitle({ additionalFormFieldTitle: e.target.value }));
              if (Object.keys(contact).map(key => key.toLowerCase()).includes(e.target.value.toLowerCase())) {
                reduxDispatch(changeFieldExistStatus({ fieldExistStatus: true }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: true }));
              } else {
                if (isFieldExist) reduxDispatch(changeFieldExistStatus({ fieldExistStatus: false }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: e.target.value ? false : true }));
              }
            }}
          />
        </label>
        <label
          className={styles.label}
        >
          Field value:
          <input
            className={styles.input}
            type='text'
            placeholder='Field value'
            name='fieldValue'
            value={fieldValue}
            onChange = {(e) => {
              reduxDispatch(addFieldValue({ additionalFormFieldValue: e.target.value }));
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: (e.target.value && fieldTitle && !isFieldExist) || (fieldTitle && !isFieldExist) ? false : true }));
            }}
          />
        </label>
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal3}
        modalKey = {'modal3'}
        modalTitle = {'Delete field'}
        acceptBtnHandler = {() => {
          reduxDispatch(deleteFieldFromForm({ fieldId: currentAddfield.id, key: currentAddfield.key }));
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Yes'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));}}
        rejectBtnTitle = {'No'}
      >
        <h3>Delete field: {currentAddfield.key} ?</h3>
      </Modal>

    </div>
  );
}

export default Form;
