import { useDispatch, useSelector } from 'react-redux';

import {
  changeModalStatus,
  changeModalAcceptBtnStatus,
  addContact,
  launchSnackbar,
} from '../../store/contactsSlice';

import { Modal, Form } from '../../components';
import styles from './AddContact.module.css';

function AddContact() {
  const reduxDispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const contact = useSelector((state) => state.contacts.addContactInfo);

  return(
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick = {() => reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: true }))}
      >
        Add new contact
      </button>

      <Modal
        isModalActive = {isModalOpen.modal1}
        modalKey = {'modal1'}
        modalTitle = {'Add new contact'}
        acceptBtnHandler = {() => {
          reduxDispatch(addContact());
          reduxDispatch(launchSnackbar({
            message: `Contact ${contact.name} ${contact.surname} been added to Contacts list`,
            options: {
              duration: 8000,
              position: 'top',
              manualClose: true,
            },
          }));
          reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
        }}
        acceptBtnTitle = {'Add contact'}
        rejectBtnHandler = {() => {
          reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: false }));
          reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
        }}
        rejectBtnTitle = {'Cancel'}
      >
        <Form />
      </Modal>

    </div>
  );
}

export default AddContact;
