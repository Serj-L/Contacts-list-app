import { useSelector, useDispatch } from 'react-redux';

import {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  setCurrentContact,
  setContactSelected,
  deleteContact,
  deleteSelectedContacts,
} from '../../store/contactsSlice';

import { Modal4, Modal5, AddContact } from '../../components';

import styles from './ContactsListScreen.module.css';

const ContactsListScreen = ({ history }) => {
  const reduxDispatch = useDispatch();
  const contactsList = useSelector((state) => state.contacts.contactsList);
  const currentContact = useSelector((state) => state.contacts.currentContact);

  return (
    <div className={styles.container}>
      <div className={styles.controlsWrapper}>
        <button
          className={styles.btnDanger}
          disabled={!contactsList.filter(el => el.selected === true).length}
          onClick = {() => {
            reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', modalStatus: false }));
            reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: true }));
          }}
        >
          Delete selected contacts
        </button>
        <AddContact />
      </div>
      <h1 className={styles.title}>Contacts list</h1>
      {contactsList ?
        contactsList.map((contact, idx) => {
          return (
            <div
              className={styles.listWrapper}
              key = {contact.id}
            >
              <h3 className={styles.contactName}>{idx + 1}. {contact.name} {contact.surname}</h3>
              <p className={styles.contactContacts}>{contact.email ? `E-mail: ${contact.email}` : ''}</p>
              <p className={styles.contactContacts}>{contact.phone ? `Phone: ${contact.phone}` : ''}</p>
              <div className={styles.btnWrapper}>
                <input
                  className={styles.checkbox}
                  type='checkbox'
                  id={contact.id}
                  onChange = {() => reduxDispatch(setContactSelected({ contactId: contact.id }))}
                />
                <label
                  className={styles.checkboxLabel}
                  htmlFor={contact.id}
                >
                </label>
                <button
                  className={styles.btn}
                  onClick = {() => {
                    reduxDispatch(setCurrentContact({ contactId: contact.id }));
                    history.push('/info');
                  }}
                >
                  View details / Edit
                </button>
                <button
                  className={styles.btnDanger}
                  onClick = {() => {
                    reduxDispatch(setCurrentContact({ contactId: contact.id }));
                    reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', modalStatus: false }));
                    reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: true }));
                  }}
                >
                Delete
                </button>
              </div>
              <hr />
            </div>
          );
        }) : <h3>Contats list is empty</h3>
      }
      <Modal4
        modalTitle = {'Delete contact'}
        acceptBtnHandler = {() => {
          reduxDispatch(deleteContact({ contactId: currentContact.id }));
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', modalStatus: true }));
        }}
        acceptBtnTitle = {'Yes'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal4', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal4', modalStatus: true }));
        }}
        rejectBtnTitle = {'No'}
      >
        <h3>Delete contact: {currentContact.name} {currentContact.surname} ?</h3>
      </Modal4>
      <Modal5
        modalTitle = {'Delete selected contacts'}
        acceptBtnHandler = {() => {
          reduxDispatch(deleteSelectedContacts());
          reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', modalStatus: true }));
        }}
        acceptBtnTitle = {'Yes'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', modalStatus: true }));
        }}
        rejectBtnTitle = {'No'}
      >
        <h3>Delete all selected contacts ?</h3>
      </Modal5>
    </div>
  );
};

export default ContactsListScreen;
