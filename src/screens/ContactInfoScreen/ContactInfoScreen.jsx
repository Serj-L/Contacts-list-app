import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  changeSaveBtnStatus,
  changeFieldExistStatus,
  addFieldTitle,
  addFieldValue,
  setCurrentFieldKey,
  editCurrentContactField,
  deleteFieldFromCurrentContact,
  addFieldToCurrentContact,
  clrAddFieldValues,
  changeEmailValid,
  changePhoneValid,
  changeCurrentContactStateHistory,
  undoCurrentContactStateHistory,
  redoCurrentContactStateHistory,
  resetCurrentContactStateHistory,
  changeUndoBtnStatus,
  changeRedoBtnStatus,
  updateContact,
  launchSnackbar,
} from '../../store/contactsSlice';

import { Modal1, Modal2, Modal3, Modal4, Modal5 } from '../../components';

import styles from './ContactInfoScreen.module.css';

const emailValidator = (email, key, fieldTitle) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  return {
    email: isValid,
    key,
    acceptBtnStatus: (isValid && fieldTitle) || (!email && fieldTitle) ? false : true,
  };
};

const phoneValidator = (phone, key, fieldTitle) => {
  const isValid = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/.test(phone.trim());
  return {
    phone: isValid,
    key,
    acceptBtnStatus: (isValid && fieldTitle) || (!phone && fieldTitle) ? false : true,
  };
};

const getFieldType = (fieldTitle) => {
  const fieldTitleLowerCase = fieldTitle.toLowerCase();
  if (fieldTitleLowerCase.includes('email') || fieldTitleLowerCase.includes('e-mail')) return 'email';
  if (fieldTitleLowerCase.includes('phone')) return 'phone';
  return 'other';
};

const ContactInfoScreen = ({ history }) => {
  const reduxDispatch = useDispatch();
  const currentContact = useSelector((state) => state.contacts.currentContact);
  const isFieldExist = useSelector((state) => state.contacts.isFieldExist);
  const currentFieldKey = useSelector((state) => state.contacts.currentFieldKey);
  const isSaveBtnDissabled = useSelector((state) => state.contacts.isSaveBtnDissabled);
  const isUndoBtnDissabled = useSelector((state) => state.contacts.isUndoBtnDissabled);
  const isRedoBtnDissabled = useSelector((state) => state.contacts.isRedoBtnDissabled);
  const { phone: isPhoneValid, email: isEmailValid } = useSelector((state) => state.contacts.isInputsValid);
  const fieldTitle = useSelector((state) => state.contacts.additionalFormFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFormFieldValue);
  const currentContactHistory = useSelector((state) => state.contacts.currentContactHistory);

  const clearAddFieldValues = useCallback(() => reduxDispatch(clrAddFieldValues()), [reduxDispatch]);

  useEffect(() => {
    if (currentContactHistory.prev.length) {
      reduxDispatch(changeSaveBtnStatus({ saveBtnStatus: false }));
      reduxDispatch(changeUndoBtnStatus({ undoBtnStatus: false }));
    }
    if (currentContactHistory.next.length) reduxDispatch(changeRedoBtnStatus({ redoBtnStatus: false }));
  }, [reduxDispatch, currentContactHistory]);

  return (
    <div className={styles.controlsWrapper}>
      <button
        className={styles.btn}
        onClick = {(e) => {
          if (!isSaveBtnDissabled) {
            reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: false }));
            reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: true }));
          } else {
            history.push('/');
            reduxDispatch(resetCurrentContactStateHistory());
          }
        }}
      >
        Back to contacts list
      </button>
      <h1 className={styles.title}>Contact {currentContact.name} {currentContact.surname} details</h1>
      <div >
        {Object.entries(currentContact).map(contact => {
          if (contact[0] === 'selected' || contact[0] === 'id') return null;
          return (
            <label
              className={styles.label}
              key = {contact[0]}
            >
              {contact[0]}:
              <div className={styles.addInputsWrapper}>
                <input
                  className={styles.contactInfoInput}
                  type='text'
                  placeholder={contact[0]}
                  name={contact[0]}
                  value={currentContact[contact[0]]}
                  readOnly
                  onChange = {(e) => console.log('ch')}
                />
                <div className={styles.btnWrapper}>
                  <button
                    className={styles.btn}
                    onClick = {() => {
                      reduxDispatch(setCurrentFieldKey({ currentFieldKey: contact[0] }));
                      reduxDispatch(addFieldTitle({ additionalFormFieldTitle: contact[0] }));
                      reduxDispatch(addFieldValue({ additionalFormFieldValue: contact[1] }));
                      if (getFieldType(contact[0]) === 'email') reduxDispatch(changeEmailValid(emailValidator(contact[1], 'modal3', contact[0])));
                      if (getFieldType(contact[0]) === 'phone') reduxDispatch(changePhoneValid(phoneValidator(contact[1], 'modal3', contact[0])));
                      if (getFieldType(contact[0]) === 'other') reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: false }));
                      reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: true }));
                    }}
                  >
                Edit
                  </button>
                  <button
                    className={styles.btnDanger}
                    onClick = {(e) => {
                      reduxDispatch(setCurrentFieldKey({ currentFieldKey: contact[0] }));
                      reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: false }));
                      reduxDispatch(changeModalStatus({ key: 'modal2', modalStatus: true }));
                    }}
                  >
                Delete
                  </button>
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <button
        className={styles.btn}
        onClick = {() => reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: true }))}
      >
        Add field
      </button>
      <div className={styles.hrLine}><hr /></div>
      <div className={styles.btnWrapper}>
        <button
          className={styles.btn}
          disabled={isSaveBtnDissabled}
          onClick = {() => {
            reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: false }));
            reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: true }));
          }}
        >
          Save changes
        </button>
        <button
          className={styles.btn}
          disabled={isUndoBtnDissabled}
          onClick = {() => reduxDispatch(undoCurrentContactStateHistory())}
        >
          Undo
        </button>
        <button
          className={styles.btn}
          disabled={isRedoBtnDissabled}
          onClick = {() => reduxDispatch(redoCurrentContactStateHistory())}
        >
          Redo
        </button>
      </div>

      <Modal1
        modalTitle = {'Add new field'}
        acceptBtnHandler = {() => {
          reduxDispatch(addFieldToCurrentContact({ fieldTitle: fieldTitle, fieldValue: fieldValue }));
          reduxDispatch(changeCurrentContactStateHistory());
          reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Add field'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
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
              if (Object.keys(currentContact).includes(e.target.value)) {
                reduxDispatch(changeFieldExistStatus({ fieldExistStatus: true }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
              } else {
                if (isFieldExist) reduxDispatch(changeFieldExistStatus({ fieldExistStatus: false }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: e.target.value ? false : true }));
              }
            }}
          />
        </label>
        <label
          className={styles.label}
          data-is-valid={getFieldType(fieldTitle) === 'email' ? isEmailValid : getFieldType(fieldTitle) === 'phone' ? isPhoneValid : ''}
          data-is-empty={getFieldType(fieldTitle) === 'email' || getFieldType(fieldTitle) === 'phone' ? fieldValue ? 'false' : 'true' : ''}
        >
          Field value:
          <input
            className={styles.input}
            type='text'
            placeholder='Field value'
            name='fieldValue'
            value={fieldValue}
            data-is-valid={getFieldType(fieldTitle) === 'email' ? isEmailValid : getFieldType(fieldTitle) === 'phone' ? isPhoneValid : ''}
            data-is-empty={getFieldType(fieldTitle) === 'email' || getFieldType(fieldTitle) === 'phone' ? fieldValue ? 'false' : 'true' : ''}
            onChange = {(e) => {
              reduxDispatch(addFieldValue({ additionalFormFieldValue: e.target.value }));
              if (getFieldType(fieldTitle) === 'other') reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: (e.target.value && fieldTitle) || fieldTitle ? false : true }));
              if (getFieldType(fieldTitle) === 'email') reduxDispatch(changeEmailValid(emailValidator(e.target.value, 'modal1', fieldTitle)));
              if (getFieldType(fieldTitle) === 'phone') reduxDispatch(changePhoneValid(phoneValidator(e.target.value, 'modal1', fieldTitle)));
            }}
          />
        </label>
      </Modal1>

      <Modal2
        modalTitle = {'Delete field'}
        acceptBtnHandler = {() => {
          reduxDispatch(deleteFieldFromCurrentContact({ key: currentFieldKey }));
          reduxDispatch(changeCurrentContactStateHistory());
          reduxDispatch(changeModalStatus({ key: 'modal2', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Yes'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal2', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: true }));}}
        rejectBtnTitle = {'No'}
      >
        <h3>Delete field: {currentFieldKey} ?</h3>
      </Modal2>

      <Modal3
        modalTitle = {'Edit field'}
        acceptBtnHandler = {() => {
          reduxDispatch(editCurrentContactField({ fieldCurrentTitle: currentFieldKey, fieldNewTitle: fieldTitle, fieldValue: fieldValue }));
          reduxDispatch(changeCurrentContactStateHistory());
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Ok'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal3', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: true }));
        }}
        rejectBtnTitle = {'Cancel'}
        componentUnmountFunc = {clearAddFieldValues}
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
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: e.target.value ? false : true }));
            }}
          />
        </label>
        <label
          className={styles.label}
          data-is-valid={getFieldType(fieldTitle) === 'email' ? isEmailValid : getFieldType(fieldTitle) === 'phone' ? isPhoneValid : ''}
          data-is-empty={getFieldType(fieldTitle) === 'email' || getFieldType(fieldTitle) === 'phone' ? fieldValue ? 'false' : 'true' : ''}
        >
            Field value:
          <input
            className={styles.input}
            type='text'
            placeholder='Field value'
            name='fieldValue'
            value={fieldValue}
            data-is-valid={getFieldType(fieldTitle) === 'email' ? isEmailValid : getFieldType(fieldTitle) === 'phone' ? isPhoneValid : ''}
            data-is-empty={getFieldType(fieldTitle) === 'email' || getFieldType(fieldTitle) === 'phone' ? fieldValue ? 'false' : 'true' : ''}
            onChange = {(e) => {
              reduxDispatch(addFieldValue({ additionalFormFieldValue: e.target.value }));
              if (getFieldType(fieldTitle) === 'other') reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal3', acceptBtnStatus: (e.target.value && fieldTitle) || fieldTitle ? false : true }));
              if (getFieldType(fieldTitle) === 'email') reduxDispatch(changeEmailValid(emailValidator(e.target.value, 'modal3', fieldTitle)));
              if (getFieldType(fieldTitle) === 'phone') reduxDispatch(changePhoneValid(phoneValidator(e.target.value, 'modal3', fieldTitle)));
            }}
          />
        </label>
      </Modal3>

      <Modal4
        modalTitle = {'Update contact'}
        acceptBtnHandler = {() => {
          reduxDispatch(updateContact());
          reduxDispatch(changeSaveBtnStatus({ saveBtnStatus: true }));
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: true }));
          reduxDispatch(launchSnackbar({
            message: `Contact ${currentContact.name} ${currentContact.surname} been updated`,
            options: {
              duration: 8000,
              position: 'top',
              manualClose: true,
            },
          }));
        }}
        acceptBtnTitle = {'Yes'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: true }));
        }}
        rejectBtnTitle = {'No'}
      >
        <h3>Update contact: {currentContact.name} {currentContact.surname} ?</h3>
      </Modal4>

      <Modal5
        modalTitle = {'Save changes'}
        acceptBtnHandler = {() => {
          reduxDispatch(updateContact());
          reduxDispatch(resetCurrentContactStateHistory());
          reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: true }));
          reduxDispatch(launchSnackbar({
            message: `Contact ${currentContact.name} ${currentContact.surname} changes been saved`,
            options: {
              duration: 8000,
              position: 'top',
              manualClose: true,
            },
          }));
          history.push('/');
        }}
        acceptBtnTitle = {'Yes'}
        rejectBtnHandler = {() => {
          reduxDispatch(resetCurrentContactStateHistory());
          reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: true }));
          history.push('/');
        }}
        rejectBtnTitle = {'No'}
      >
        <h3>Save contact {currentContact.name} {currentContact.surname} changes before leaving the page ?</h3>
      </Modal5>

    </div>
  );
};

export default ContactInfoScreen;
