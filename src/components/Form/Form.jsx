import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Modal, AddEditForm } from '../../components';

import {
  changeModalStatus,
  addContactInfo,
  clearContactInfo,
  changePhoneValid,
  changeEmailValid,
  changeModalAcceptBtnStatus,
  clrAddFieldValues,
  addFieldToForm,
  deleteFieldFromForm,
  setCurrentFieldKey,
} from '../../store/contactsSlice';

import {
  formValidator,
  emailValidator,
  phoneValidator,
} from '../../utils/utils';

import styles from './Form.module.css';

const Form = () => {
  const reduxDispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const contact = useSelector((state) => state.contacts.addContactInfo);
  const { phone: isPhoneValid, email: isEmailValid } = useSelector((state) => state.contacts.isInputsValid);
  const fieldTitle = useSelector((state) => state.contacts.additionalFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFieldValue);
  const currentFieldKey = useSelector((state) => state.contacts.currentFieldKey);
  const additionalFields = useSelector((state) => state.contacts.additionalFields);

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
                key = {additionalField}
              >
                {additionalField}:
                <div className={styles.addInputsWrapper}>
                  <input
                    className={styles.input}
                    type='text'
                    placeholder={additionalField}
                    name={additionalField}
                    value={contact[additionalField]}
                    onChange = {(e) =>{
                      e.preventDefault();
                      reduxDispatch(addContactInfo({ name: additionalField, value: e.target.value }));
                    }}
                  />
                  <button
                    className={styles.btnClose}
                    onClick = {(e) => {
                      e.preventDefault();
                      reduxDispatch(setCurrentFieldKey({ currentFieldKey: additionalField }));
                      reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: false }));
                      reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: true }));
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
        onClick = {() => reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: true }))}
      >
        Add field
      </button>

      <Modal
        isModalActive = {isModalOpen.modal3}
        modalKey = {'modal3'}
        modalTitle = {'Add new field'}
        acceptBtnHandler = {() => {
          reduxDispatch(addFieldToForm({ fieldTitle: fieldTitle, fieldValue: fieldValue }));
          reduxDispatch(changeEmailValid(emailValidator(contact.email, contact.phone, isPhoneValid, contact.name, contact.surname, 'modal1')));
          reduxDispatch(changePhoneValid(phoneValidator(contact.phone, contact.email, isEmailValid, contact.name, contact.surname, 'modal1')));
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Add field'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeEmailValid(emailValidator(contact.email, contact.phone, isPhoneValid, contact.name, contact.surname, 'modal1')));
          reduxDispatch(changePhoneValid(phoneValidator(contact.phone, contact.email, isEmailValid, contact.name, contact.surname, 'modal1')));
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
        }}
        rejectBtnTitle = {'Cancel'}
        closeModalHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
        }}
        componentUnmountFunc = {clearAddFieldValues}
      >
        <AddEditForm
          modalKey = {'modal3'}
          target = {contact}
        />
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal4}
        modalKey = {'modal4'}
        modalTitle = {'Delete field'}
        acceptBtnHandler = {() => {
          reduxDispatch(deleteFieldFromForm({ key: currentFieldKey }));
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Yes'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: true }));}}
        rejectBtnTitle = {'No'}
        closeModalHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: true }));
        }}
      >
        <h3>Delete field: {currentFieldKey} ?</h3>
      </Modal>

    </div>
  );
};

export default Form;
