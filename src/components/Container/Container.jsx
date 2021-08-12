import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setScrollBarWidth } from '../../store/contactsSlice';

import { Snackbar } from '../../components';
import { getScrollBarWidth } from '../../utils/utils';

import styles from './Container.module.css';

function localStorageSet(value = [], key = 'contacts') {
  localStorage[key] = JSON.stringify(value);
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
    const windowResizeHandler = () => reduxDispatch(setScrollBarWidth({ scrollBarWidth: `${getScrollBarWidth()}px` }));

    reduxDispatch(setScrollBarWidth({ scrollBarWidth: `${getScrollBarWidth()}px` }));
    window.addEventListener('resize', windowResizeHandler);

    return () => window.removeEventListener('resize', windowResizeHandler);
  }, [reduxDispatch]);

  useEffect(() => {
    if (Object.values(isModalOpen).filter(value => value === true).length) {
      document.body.style.overflow = 'hidden';
      if (document.body.offsetHeight > document.documentElement.clientHeight) {
        document.getElementById('container').style.paddingRight = scrollBarWidth;
        document.getElementById('header').style.paddingRight = scrollBarWidth;
        document.getElementById('footer').style.paddingRight = scrollBarWidth;
        document.getElementById('scrollTopBtn').style.marginRight = scrollBarWidth;
      }
    } else {
      document.body.style.overflow = 'auto';
      if (document.body.offsetHeight > document.documentElement.clientHeight) {
        document.getElementById('container').style.paddingRight = '';
        document.getElementById('header').style.paddingRight = '';
        document.getElementById('footer').style.paddingRight = '';
        document.getElementById('scrollTopBtn').style.marginRight = '';
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
