import { useDispatch, useSelector } from 'react-redux';

import {
  changeModalStatus,
  addContact,
  launchSnackbar,
} from '../../store/contactsSlice';

import { Modal, Form } from '../../components';
import styles from './AddContact.module.css';

function AddContact() {
  const reduxDispatch = useDispatch();
  const contact = useSelector((state) => state.contacts.addContactInfo);

  return(
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick = {() => reduxDispatch(changeModalStatus({ modalStatus: true }))}
      >
        Add new contact
      </button>
      <Modal
        modalTitle = {'Add new contact'}
        acceptBtnHandler = {() => {
          reduxDispatch(addContact());
          reduxDispatch(launchSnackbar({
            message: `Contact ${contact.firstName} ${contact.lastName} been added to Contacts list`,
            options: {
              duration: 8000,
              position: 'top',
              manualClose: true,
            },
          }));
          reduxDispatch(changeModalStatus({ modalStatus: false }));
        }}
        acceptBtnTitle = {'Add contact'}
        rejectBtnHandler = {() => reduxDispatch(changeModalStatus({ modalStatus: false }))}
        rejectBtnTitle = {'Cancel'}
      >
        <div>
          <Form />
        </div>
      </Modal>
    </div>
  );
}

export default AddContact;
