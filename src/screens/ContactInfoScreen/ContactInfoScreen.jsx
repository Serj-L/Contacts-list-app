import { NavLink } from 'react-router-dom';

import styles from './ContactInfoScreen.module.css';

const ContactInfoScreen = () => {

  return (
    <div className={styles.container}>
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
