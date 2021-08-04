import { NavLink } from 'react-router-dom';

import styles from './ContactsListScreen.module.css';

const ContactsListScreen = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contacts list</h1>
      <NavLink
        to="/info"
        className={styles.navlink}
      >
        Contact details information...
      </NavLink>
    </div>
  );
};

export default ContactsListScreen;
