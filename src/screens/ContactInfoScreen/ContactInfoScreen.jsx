import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  addFieldTitle,
  addFieldValue,
  clrAddFieldValues,

} from '../../store/contactsSlice';

import { Modal1 } from '../../components';

import styles from './ContactInfoScreen.module.css';

const ContactInfoScreen = ({ history }) => {
  const reduxDispatch = useDispatch();
  const currentContact = useSelector((state) => state.contacts.currentContact);
  const fieldTitle = useSelector((state) => state.contacts.additionalFormFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFormFieldTitle);
  const additionalFields = useSelector((state) => state.contacts.additionalFormFields);
  const clearAddField = useCallback(() => {
    reduxDispatch(clrAddFieldValues());
  },[reduxDispatch]);
  const clearAddFieldValues = useCallback(() => reduxDispatch(clrAddFieldValues()), [reduxDispatch]);

  return (
    <div className={styles.controlsWrapper}>
      <button
        className={styles.btn}
        onClick = {() => history.push('/')}
      >
        Back to contacts list
      </button>
      <h1 className={styles.title}>Contact {currentContact.name} {currentContact.surname} details</h1>
      <form >
        {Object.entries(currentContact).map(contact => {
          if (contact[0] === 'selected') return null;
          return (
            <label
              className={styles.label}
              key = {contact[1]}
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
        onClick = {() => reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: true }))}
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
      <Modal1
        modalTitle = {'Add new field'}
        acceptBtnHandler = {() => {
          //reduxDispatch(addFieldToForm({ fieldTitle: fieldTitle, fieldValue: fieldValue }));
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
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: e.target.value ? false : true }));
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
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: (e.target.value && fieldTitle) || fieldTitle ? false : true }));
            }}
          />
        </label>
      </Modal1>
    </div>
  );
};

export default ContactInfoScreen;
