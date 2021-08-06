import { useSelector, useDispatch } from 'react-redux';

import {
  changeConfirmModalStatus,
  changeConfirmModalAcceptBtnStatus,
  setCurrentContact,
  deleteContact,
} from '../../store/contactsSlice';

import { ConfirmModal, AddContact } from '../../components';

import styles from './ContactsListScreen.module.css';

const ContactsListScreen = ({ history }) => {
  const reduxDispatch = useDispatch();
  const contactsList = useSelector((state) => state.contacts.contactsList);
  const currentContact = useSelector((state) => state.contacts.currentContact);

  return (
    <div className={styles.container}>
      <div className={styles.addContactWrapper}>
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
              <h3 className={styles.contactName}>{idx + 1}. {contact.firstName} {contact.lastName}</h3>
              <p className={styles.contactContacts}>{contact.email ? `E-mail: ${contact.email}` : ''}</p>
              <p className={styles.contactContacts}>{contact.phone ? `Phone: ${contact.phone}` : ''}</p>
              <div className={styles.btnWrapper}>
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
                    reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: true }));
                    reduxDispatch(changeConfirmModalAcceptBtnStatus({ confirmModalStatus: false }));
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
      <ConfirmModal
        modalTitle = {'Delete contact'}
        acceptBtnHandler = {() => {
          reduxDispatch(deleteContact({ contactId: currentContact.id }));
          reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: false }));
        }}
        acceptBtnTitle = {'Delete'}
        rejectBtnHandler = {() => reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: false }))}
        rejectBtnTitle = {'Cancel'}
      >
        <h3>Delete contact {currentContact.firstName} {currentContact.lastName} ?</h3>
      </ConfirmModal>

    </div>
  );
};

export default ContactsListScreen;
