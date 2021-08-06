import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Snackbar } from '../../components';

import styles from './Container.module.css';

function localStorageSet(value = [], key = 'contacts') {
  localStorage[key] = JSON.stringify(value);
}

const Container = ({ children }) => {
  const contactsList = useSelector((state) => state.contacts.contactsList);

  useEffect(() => {
    localStorageSet(contactsList);
  }, [contactsList]);

  return (
    <div className={styles.container}>
      <Snackbar />
      {children}
    </div>
  );
};

export default Container;
