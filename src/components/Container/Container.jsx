import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setScrollBarWidth } from '../../store/contactsSlice';

import { Snackbar } from '../../components';

import styles from './Container.module.css';

function localStorageSet(value = [], key = 'contacts') {
  localStorage[key] = JSON.stringify(value);
}

function getscrollbarWidth() {
  const outer = document.createElement('div');

  outer.style.position = 'adsolute';
  outer.style.top = '-9999px';
  outer.style.width = '50px';
  outer.style.height = '50px';
  outer.style.overflow = 'scroll';
  outer.style.visibility = 'hidden';
  document.body.appendChild(outer);
  const scrollbarWidth = outer.offsetWidth - outer.clientWidth;
  document.body.removeChild(outer);

  return scrollbarWidth;
}

const Container = ({ children }) => {
  const reduxDispatch = useDispatch();
  const contactsList = useSelector((state) => state.contacts.contactsList);
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const scrollBarWidth = useSelector((state) => state.contacts.scrollBarWidth);

  useEffect(() => {
    localStorageSet(contactsList);
  }, [contactsList]);

  useEffect(() => {
    reduxDispatch(setScrollBarWidth({ scrollBarWidth: `${getscrollbarWidth()}px` }));
  }, [reduxDispatch]);

  useEffect(() => {
    if (Object.values(isModalOpen).filter(value => value === true).length) {
      document.body.style.overflow = 'hidden';
      if (document.body.offsetHeight > document.documentElement.clientHeight) {
        document.getElementById('container').style.paddingRight = scrollBarWidth;
      }
    } else {
      document.body.style.overflow = 'auto';
      if (document.body.offsetHeight > document.documentElement.clientHeight) {
        document.getElementById('container').style.paddingRight = '';
      }
    }
  }, [isModalOpen, scrollBarWidth]);

  return (
    <div
      className={styles.container}
      id='container'
    >
      <Snackbar />
      {children}
    </div>
  );
};

export default Container;
