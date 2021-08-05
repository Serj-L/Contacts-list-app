import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setInitialContactsList } from '../../store/contactsSlice';

import { Snackbar } from '../../components';

import styles from './Container.module.css';

function localStorageSet(key = 'contacts', value = []) {
  localStorage[key] = JSON.stringify(value);
}

function localStorageGet(key = 'contacts') {
  return JSON.parse(localStorage.getItem(key));
}

const Container = ({ children }) => {
  const reduxDispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.contactsList);

  useEffect(() => {
    const list = localStorageGet();
    reduxDispatch(setInitialContactsList({ contactsList: list ? list : []}));
  }, [reduxDispatch]);

  useEffect(() => {
    localStorageSet('contacts', contacts);
  }, [contacts]);

  return (
    <div className={styles.container}>
      <Snackbar />
      {children}
    </div>
  );
};

export default Container;
