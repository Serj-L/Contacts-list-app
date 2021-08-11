import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  changeSaveBtnStatus,
  changeFieldExistStatus,
  addFieldTitle,
  addFieldValue,
  setAddFieldType,
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

import { Modal, ScrollTop } from '../../components';

import styles from './ContactInfoScreen.module.css';

import {
  addFieldEmailValidator,
  addFieldPhoneValidator,
  getFieldType,
} from '../../utils/utils';

const ContactInfoScreen = ({ history }) => {
  const reduxDispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const contactsList = useSelector((state) => state.contacts.contactsList);
  const currentContact = useSelector((state) => state.contacts.currentContact);
  const isFieldExist = useSelector((state) => state.contacts.isFieldExist);
  const currentFieldKey = useSelector((state) => state.contacts.currentFieldKey);
  const isSaveBtnDissabled = useSelector((state) => state.contacts.isSaveBtnDissabled);
  const isUndoBtnDissabled = useSelector((state) => state.contacts.isUndoBtnDissabled);
  const isRedoBtnDissabled = useSelector((state) => state.contacts.isRedoBtnDissabled);
  const { phone: isPhoneValid, email: isEmailValid } = useSelector((state) => state.contacts.isInputsValid);
  const fieldTitle = useSelector((state) => state.contacts.additionalFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFieldValue);
  const fieldType = useSelector((state) => state.contacts.additionalFieldType);
  const currentContactHistory = useSelector((state) => state.contacts.currentContactHistory);

  const clearAddFieldValues = useCallback(() => reduxDispatch(clrAddFieldValues()), [reduxDispatch]);

  const contactFromList = contactsList.filter(contact => contact.id === currentContact.id)[0];

  useEffect(() => {
    reduxDispatch(setAddFieldType({ additionalFieldType: getFieldType(fieldTitle) }));
  }, [reduxDispatch, fieldTitle]);

  useEffect(() => {
    if (currentContactHistory.prev.length) {
      reduxDispatch(changeSaveBtnStatus({ saveBtnStatus: false }));
      reduxDispatch(changeUndoBtnStatus({ undoBtnStatus: false }));
    }
    if (currentContactHistory.next.length) reduxDispatch(changeRedoBtnStatus({ redoBtnStatus: false }));
  }, [reduxDispatch, currentContactHistory]);

  useEffect(() => {
    if (Object.keys(currentContact).length > 2) return;
    if (!Object.keys(currentContact).filter(key => key !== 'selected' && key !== 'id').length) {
      if(!isSaveBtnDissabled) reduxDispatch(changeSaveBtnStatus({ saveBtnStatus: true }));
      reduxDispatch(launchSnackbar({
        message: 'Contact details cannot be empty. Add at least one field to save changes.',
        options: {
          duration: 10000,
          position: 'left',
          manualClose: true,
        },
      }));
    }
  }, [currentContact, isSaveBtnDissabled, reduxDispatch]);

  return (
    <div className={styles.wrapper}>

      <ScrollTop />

      <div className={styles.controlsWrapper}>
        <button
          className={styles.btn}
          onClick = {(e) => {
            if (!isSaveBtnDissabled) {
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: false }));
              reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: true }));
              return;
            }
            if (!Object.keys(currentContact).filter(key => key !== 'selected' && key !== 'id').length) {
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal6', acceptBtnStatus: false }));
              reduxDispatch(changeModalStatus({ key: 'modal6', modalStatus: true }));
              return;
            }
            history.push('/');
            reduxDispatch(resetCurrentContactStateHistory());

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
                  />
                  <div className={styles.btnWrapper}>
                    <button
                      className={styles.btn}
                      onClick = {() => {
                        reduxDispatch(setCurrentFieldKey({ currentFieldKey: contact[0] }));
                        reduxDispatch(addFieldTitle({ additionalFieldTitle: contact[0] }));
                        reduxDispatch(addFieldValue({ additionalFieldValue: contact[1] }));
                        if (getFieldType(contact[0]) === 'email') reduxDispatch(changeEmailValid(addFieldEmailValidator(contact[1], 'modal3', contact[0])));
                        if (getFieldType(contact[0]) === 'phone') reduxDispatch(changePhoneValid(addFieldPhoneValidator(contact[1], 'modal3', contact[0])));
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
      </div>

      <Modal
        isModalActive = {isModalOpen.modal1}
        modalKey = {'modal1'}
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
        closeModalHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
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
              if (Object.keys(currentContact).map(key => key.toLowerCase().trim()).includes(e.target.value.toLowerCase().trim())) {
                reduxDispatch(changeFieldExistStatus({ fieldExistStatus: true }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
                return;
              }
              if (isFieldExist) reduxDispatch(changeFieldExistStatus({ fieldExistStatus: false }));
              if (fieldType === 'other' || !fieldValue) {
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: e.target.value ? false : true }));
                return;
              }
              fieldType === 'email' ?
                reduxDispatch(changeEmailValid(addFieldEmailValidator(fieldValue, 'modal1', fieldTitle, isFieldExist))) :
                reduxDispatch(changePhoneValid(addFieldPhoneValidator(fieldValue, 'modal1', fieldTitle, isFieldExist)));
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
              if (fieldType === 'other') reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: (e.target.value && fieldTitle && !isFieldExist) || (fieldTitle && !isFieldExist) ? false : true }));
              if (fieldType === 'email') reduxDispatch(changeEmailValid(addFieldEmailValidator(e.target.value, 'modal1', fieldTitle, isFieldExist)));
              if (fieldType === 'phone') reduxDispatch(changePhoneValid(addFieldPhoneValidator(e.target.value, 'modal1', fieldTitle, isFieldExist)));
            }}
          />
        </label>
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal2}
        modalKey = {'modal2'}
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
        closeModalHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal2', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal2', acceptBtnStatus: true }));
        }}
      >
        <h3>Delete field: {currentFieldKey} ?</h3>
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal3}
        modalKey = {'modal3'}
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
              if (Object.keys(currentContact).map(key => key.toLowerCase().trim()).includes(e.target.value.toLowerCase().trim()) && e.target.value !== currentFieldKey) {
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
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal4}
        modalKey = {'modal4'}
        modalTitle = {'Update contact'}
        acceptBtnHandler = {() => {
          reduxDispatch(updateContact());
          reduxDispatch(changeSaveBtnStatus({ saveBtnStatus: true }));
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: true }));
          reduxDispatch(launchSnackbar({
            message: `Contact ${currentContact.name ? currentContact.name : ''} ${currentContact.surname ? currentContact.surname : ''} been updated`,
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
        closeModalHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', acceptBtnStatus: true }));
        }}
      >
        <h3>Update contact {currentContact.name} {currentContact.surname} ?</h3>
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal5}
        modalKey = {'modal5'}
        modalTitle = {'Save changes'}
        acceptBtnHandler = {() => {
          reduxDispatch(updateContact());
          reduxDispatch(resetCurrentContactStateHistory());
          reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: true }));
          reduxDispatch(launchSnackbar({
            message: `Contact ${currentContact.name ? currentContact.name : ''} ${currentContact.surname ? currentContact.surname : ''} details changes been saved`,
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
        closeModalHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: true }));
        }}
      >
        <h3>Save contact {currentContact.name} {currentContact.surname} details changes before closing contact details ?</h3>
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal6}
        modalKey = {'modal6'}
        modalTitle = {'Discard changes'}
        acceptBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal6', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal6', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'No'}
        rejectBtnHandler = {() => {
          reduxDispatch(resetCurrentContactStateHistory());
          reduxDispatch(changeModalStatus({ key: 'modal6', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal6', acceptBtnStatus: true }));
          reduxDispatch(launchSnackbar({
            message: `All contact ${contactFromList.name ? contactFromList.name : ''} ${contactFromList.surname ? contactFromList.surname : ''} details changes been discarded`,
            options: {
              duration: 8000,
              position: 'top',
              manualClose: true,
            },
          }));
          history.push('/');
        }}
        rejectBtnTitle = {'Yes'}
        closeModalHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal6', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal6', acceptBtnStatus: true }));
        }}
      >
        <h3>Discard all contact details changes? To continue edit contact details press `No` or close modal window (to save changes add at least one field).</h3>
      </Modal>

    </div>
  );
};

export default ContactInfoScreen;
