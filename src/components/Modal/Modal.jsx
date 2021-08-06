import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { changeModalStatus } from '../../store/contactsSlice';

import styles from './Modal.module.css';

function Modal({
  modalTitle,
  acceptBtnHandler,
  acceptBtnTitle,
  rejectBtnHandler,
  rejectBtnTitle,
  children,
  componentUnmountFunc,
}) {
  const { isModalOpen, isModalAcceptBtnDissabled } = useSelector((state) => state.contacts);
  const reduxDispatch = useDispatch();

  useEffect(()=> {
    if (!isModalOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      if (componentUnmountFunc) componentUnmountFunc();
      document.body.style.overflow = 'auto';
    };
  }, [componentUnmountFunc, isModalOpen]);

  return isModalOpen ?
    (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button
              className={styles.btnClose}
              onClick = {() => reduxDispatch(changeModalStatus({ modalStatus: false }))}
            >
              <span className={styles.closeSymb}>&times;</span>
            </button>
          </div>
          <div className={styles.modalContent}>
            {children}
          </div>
          <div className={styles.hrLine}><hr /></div>
          <div className={styles.modalFooter}>
            <button
              className={styles.btn}
              disabled={isModalAcceptBtnDissabled}
              onClick = {acceptBtnHandler}
            >
              {acceptBtnTitle}
            </button>
            <button
              className={styles.btnDanger}
              onClick = {rejectBtnHandler}
            >
              {rejectBtnTitle}
            </button>
          </div>
        </div>
        <div
          className={styles.modalLayout}
          onClick = {() => reduxDispatch(changeModalStatus({ modalStatus: false }))}
        ></div>
      </div>
    ) : null;
}

export default Modal;
