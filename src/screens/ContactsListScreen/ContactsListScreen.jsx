import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  setCurrentContact,
  setContactSelected,
  setAllContactsSelected,
  changeIsContactsSelected,
  resetSelectedContacts,
  deleteContact,
  deleteSelectedContacts,
  initCurrentContactStateHistory,
} from '../../store/contactsSlice';

import { Modal, AddContact, ScrollTop } from '../../components';

import styles from './ContactsListScreen.module.css';

const ContactsListScreen = ({ history }) => {
  const reduxDispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const contactsList = useSelector((state) => state.contacts.contactsList);
  const { all: allSelected, some: someSelected } = useSelector((state) => state.contacts.isContactsSelected);
  const currentContact = useSelector((state) => state.contacts.currentContact);

  useEffect(() => {
    const selectedContactsList = contactsList.filter(el => el.selected === true).length;
    if (selectedContactsList) {
      if (selectedContactsList === contactsList.length) {
        reduxDispatch(changeIsContactsSelected(({ key: 'all', value: true })));
        if (someSelected) reduxDispatch(changeIsContactsSelected(({ key: 'some', value: false })));
      } else {
        reduxDispatch(changeIsContactsSelected(({ key: 'some', value: true })));
        if (allSelected) reduxDispatch(changeIsContactsSelected(({ key: 'all', value: false })));
      }
    } else {
      if (someSelected) reduxDispatch(changeIsContactsSelected(({ key: 'some', value: false })));
      if (allSelected) reduxDispatch(changeIsContactsSelected(({ key: 'all', value: false })));
    }
  }, [contactsList, someSelected, allSelected, reduxDispatch]);

  return (
    <div className={styles.wrapper}>
      <ScrollTop />
      <h1 className={styles.title}>Contacts list</h1>
      <div className={styles.controlsWrapper}>
        <div className={styles.selectBtns}>
          <button
            className={styles.btn}
            disabled={allSelected}
            onClick = {() => {
              reduxDispatch(setAllContactsSelected());
            }}
          >
          Select all contacts
          </button>
          <button
            className={styles.btn}
            disabled={allSelected || someSelected ? false : true}
            onClick = {() => {
              reduxDispatch(resetSelectedContacts());
            }}
          >
          Unselect contacts
          </button>
          <button
            className={styles.btnDanger}
            disabled={allSelected || someSelected ? false : true}
            onClick = {() => {
              reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', modalStatus: false }));
              reduxDispatch(changeModalStatus({ key: 'modal5', modalStatus: true }));
            }}
          >
          Delete selected contacts
          </button>
        </div>

        <AddContact />

      </div>
      {contactsList ?
        contactsList.map((contact, idx) => {
          return (
            <div
              className={styles.listWrapper}
              key = {contact.id}
            >
              <div className={styles.contactInfo}>
                <h3 className={styles.contactName}>{idx + 1}. {contact.name} {contact.surname}</h3>
                <p className={styles.contactContacts}>{contact.email ? `e-mail: ${contact.email}` : ''}</p>
                <p className={styles.contactContacts}>{contact.phone ? `phone: ${contact.phone}` : ''}</p>
              </div>
              <div className={styles.btnWrapper}>
                <input
                  className={styles.checkbox}
                  type='checkbox'
                  id={contact.id}
                  checked={contact.selected}
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
                    reduxDispatch(resetSelectedContacts());
                    reduxDispatch(initCurrentContactStateHistory());
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
            </div>
          );
        }) : <h3>Contats list is empty</h3>
      }

      <Modal
        isModalActive = {isModalOpen.modal4}
        modalKey = {'modal4'}
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
      </Modal>

      <Modal
        isModalActive = {isModalOpen.modal5}
        modalKey = {'modal5'}
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
      </Modal>

    </div>
  );
};

export default ContactsListScreen;
