import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { changeModalStatus, changeModalAcceptBtnStatus } from '../../store/contactsSlice';

import styles from './Modal.module.css';

function Modal5({
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
    if (!isModalOpen.modal5) return;
    document.body.style.overflow = 'hidden';
    return () => {
      if (componentUnmountFunc) componentUnmountFunc();
      if (Object.values(isModalOpen).filter(el => el === true).length < 2) document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, componentUnmountFunc, reduxDispatch]);

  return isModalOpen.modal5 ?
    (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button
              className={styles.btnClose}
              onClick = {() => {
                reduxDispatch(changeModalStatus({ key: 'modal5', confirmModalStatus: false }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: true }));
              }}
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
              disabled={isModalAcceptBtnDissabled.modal5}
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
          onClick = {() => {
            reduxDispatch(changeModalStatus({ key: 'modal5', confirmModalStatus: false }));
            reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal5', acceptBtnStatus: true }));
          }}
        >
        </div>
      </div>
    ) : null;
}

export default Modal5;