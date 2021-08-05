import { NavLink } from 'react-router-dom';

import { AddContact } from '../../components';

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
      <AddContact />
    </header>
  );
}

export default Header;
