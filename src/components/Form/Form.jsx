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
  setAddFieldType,
  clrAddFieldValues,
  addFieldToForm,
  deleteFieldFromForm,
  setCurrentFieldKey,
} from '../../store/contactsSlice';

import {
  formValidator,
  emailValidator,
  phoneValidator,
  addFieldEmailValidator,
  addFieldPhoneValidator,
  getFieldType,
} from '../../utils/utils';

import styles from './Form.module.css';

function Form() {
  const reduxDispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const contact = useSelector((state) => state.contacts.addContactInfo);
  const { phone: isPhoneValid, email: isEmailValid } = useSelector((state) => state.contacts.isInputsValid);
  const isFieldExist = useSelector((state) => state.contacts.isFieldExist);
  const fieldTitle = useSelector((state) => state.contacts.additionalFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFieldValue);
  const fieldType = useSelector((state) => state.contacts.additionalFieldType);
  const currentFieldKey = useSelector((state) => state.contacts.currentFieldKey);
  const additionalFields = useSelector((state) => state.contacts.additionalFields);

  useEffect(() => {
    return () => {
      reduxDispatch(clearContactInfo());
    };
  }, [reduxDispatch]);

  useEffect(() => {
    reduxDispatch(setAddFieldType({ additionalFieldType: getFieldType(fieldTitle) }));
  }, [reduxDispatch, fieldTitle]);

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
      {<Modal
        isModalActive = {isModalOpen.modal3}
        modalKey = {'modal3'}
        modalTitle = {'Add new field'}
        acceptBtnHandler = {() => {
          reduxDispatch(addFieldToForm({ fieldTitle: fieldTitle, fieldValue: fieldValue }));
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Add field'}
        rejectBtnHandler = {() => {
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
              reduxDispatch(addFieldTitle({ additionalFieldTitle: e.target.value }));
              if (Object.keys(contact).map(key => key.toLowerCase().trim()).includes(e.target.value.toLowerCase().trim())) {
                reduxDispatch(changeFieldExistStatus({ fieldExistStatus: true }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
                return;
              }
              if (isFieldExist) reduxDispatch(changeFieldExistStatus({ fieldExistStatus: false }));
              if (fieldType === 'other' || !fieldValue) {
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: e.target.value ? false : true }));
                return;
              }
              fieldType === 'email' ?
                reduxDispatch(changeEmailValid(addFieldEmailValidator(fieldValue, 'modal3', fieldTitle, isFieldExist))) :
                reduxDispatch(changePhoneValid(addFieldPhoneValidator(fieldValue, 'modal3', fieldTitle, isFieldExist)));
            }}
          />
        </label>
        <label
          className={styles.label}
          data-is-valid={fieldType === 'email' ? isEmailValid : fieldType === 'phone' ? isPhoneValid : ''}
          data-is-empty={fieldType === 'email' || fieldType === 'phone' ? fieldValue ? 'false' : 'true' : ''}
        >
          Field value:
          <input
            className={styles.input}
            type='text'
            placeholder='Field value'
            name='fieldValue'
            value={fieldValue}
            data-is-valid={fieldType === 'email' ? isEmailValid : fieldType === 'phone' ? isPhoneValid : ''}
            data-is-empty={fieldType === 'email' || fieldType === 'phone' ? fieldValue ? 'false' : 'true' : ''}
            onChange = {(e) => {
              reduxDispatch(addFieldValue({ additionalFieldValue: e.target.value }));
              if (fieldType === 'other') reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: (e.target.value && fieldTitle && !isFieldExist) || (fieldTitle && !isFieldExist) ? false : true }));
              if (fieldType === 'email') reduxDispatch(changeEmailValid(addFieldEmailValidator(e.target.value, 'modal3', fieldTitle, isFieldExist)));
              if (fieldType === 'phone') reduxDispatch(changePhoneValid(addFieldPhoneValidator(e.target.value, 'modal3', fieldTitle, isFieldExist)));
            }}
          />
        </label>
      </Modal>}

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
}

export default Form;
