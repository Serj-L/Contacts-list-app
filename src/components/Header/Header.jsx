import { NavLink } from 'react-router-dom';

import styles from './Header.module.css';

function Header() {
  return (
    <header>
      <h1
        className={styles.title}
      >
        <NavLink
          to="/"
          className={styles.navlink}
        >
        Contacts List App
        </NavLink>
      </h1>
      <button
        className={styles.btn}
        onClick = {() => console.log('ADD CONTACT')}
      >
        Add new contact
      </button>
    </header>
  );
}

export default Header;
