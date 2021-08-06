import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  addFieldTitle,
  addFieldValue,
  clrFieldTitle,
  clrFieldValue,

} from '../../store/contactsSlice';

import { ConfirmModal, Modal } from '../../components';

import styles from './ContactInfoScreen.module.css';

const ContactInfoScreen = () => {
  const reduxDispatch = useDispatch();
  const currentContact = useSelector((state) => state.contacts.currentContact);
  const fieldTitle = useSelector((state) => state.contacts.additionalFormFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFormFieldTitle);
  const additionalFields = useSelector((state) => state.contacts.additionalFormFields);
  const clearAddField = useCallback(() => {
    reduxDispatch(clrFieldTitle());
    reduxDispatch(clrFieldValue());
  },[reduxDispatch]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact {currentContact.firstName} {currentContact.lastName} details</h1>
      <form >
        {Object.entries(currentContact).map(contact => {
          return (
            <label
              className={styles.label}
              key = {contact[1]}
            >
              {contact[0]}:
              <div className={styles.addInputsWrapper}>
                <input
                  className={styles.input}
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
                    onClick = {() => console.log('edit')}
                  >
                Edit
                  </button>
                  <button
                    className={styles.btnDanger}
                    onClick = {() => {
                      console.log('del');
                    }}
                  >
                Delete
                  </button>
                </div>
              </div>
            </label>
          );
        })}
      </form>
      <button
        className={styles.btn}
        onClick = {() => reduxDispatch(changeModalStatus({ modalStatus: true }))}
      >
        Add field
      </button>
      <div className={styles.hrLine}><hr /></div>
      <div className={styles.btnWrapper}>
        <button
          className={styles.btn}
          onClick = {() => console.log('save')}
        >
          Save changes
        </button>
        <button
          className={styles.btn}
          onClick = {() => {
            console.log('undo');
          }}
        >
          Undo
        </button>
      </div>
      <Modal
        modalTitle = {'Add new field'}
        acceptBtnHandler = {() => {
          /* reduxDispatch(addFieldToForm({ fieldName: fieldTitle })); */
          reduxDispatch(changeModalStatus({ modalStatus: false }));
        }}
        acceptBtnTitle = {'Add field'}
        rejectBtnHandler = {() => reduxDispatch(changeModalStatus({ modalStatus: false }))}
        rejectBtnTitle = {'Cancel'}
        componentUnmountFunc = {clearAddField}
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
              reduxDispatch(changeModalAcceptBtnStatus({ acceptBtnStatus: e.target.value ? false : true }));
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
              reduxDispatch(addFieldTitle({ additionalFormFieldTitle: e.target.value }));
              reduxDispatch(changeModalAcceptBtnStatus({ acceptBtnStatus: e.target.value ? false : true }));
            }}
          />
        </label>
      </Modal>
    </div>
  );
};

export default ContactInfoScreen;
