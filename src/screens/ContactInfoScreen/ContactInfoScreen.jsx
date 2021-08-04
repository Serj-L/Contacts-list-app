import { NavLink } from 'react-router-dom';

import { Modal } from '../../components';
import styles from './ContactInfoScreen.module.css';

const ContactInfoScreen = () => {

  return (
    <div className={styles.container}>
      <Modal
        modalTitle={'Contact Info'}
      >
        <div>
          MODAL CHILDREN
        </div>
      </Modal>
      <h1 className={styles.title}>Contact info</h1>
      <NavLink
        to="/"
        className={styles.navlink}
      >
        Contacts list...
      </NavLink>
    </div>
  );
};

export default ContactInfoScreen;
