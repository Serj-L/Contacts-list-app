import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalStatus } from '../../store/contactsSlice';
import styles from './Modal.module.css';

function Modal({
  modalTitle,
  children,
}) {
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const reduxDispatch = useDispatch();

  useEffect(()=> {
    if (!isModalOpen) return;
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'auto';
  }, [isModalOpen]);

  return isModalOpen ?
    (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button
              className={styles.btn}
              onClick = {() => reduxDispatch(setModalStatus({ modalStatus: false }))}
            >
              <span className={styles.closeSymb}>&times;</span>
            </button>
          </div>
          <div className={styles.modalContent}>
            {children}
          </div>
        </div>
        <div
          className={styles.modalLayout}
          onClick = {() => reduxDispatch(setModalStatus({ modalStatus: false }))}
        ></div>
      </div>
    ) : null;
}

export default Modal;
