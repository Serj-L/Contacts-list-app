import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { changeModalStatus, changeModalAcceptBtnStatus } from '../../store/contactsSlice';

import styles from './Modal.module.css';

function Modal1({
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
    if (!isModalOpen.modal1) return;
    document.body.style.overflow = 'hidden';
    return () => {
      if (componentUnmountFunc) componentUnmountFunc();
      if (Object.values(isModalOpen).filter(el => el === true).length < 2) document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, componentUnmountFunc, reduxDispatch]);

  return isModalOpen.modal1 ?
    (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button
              className={styles.btnClose}
              onClick = {() => {
                reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: false }));
                reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
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
              disabled={isModalAcceptBtnDissabled.modal1}
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
            reduxDispatch(changeModalStatus({ key: 'modal1', modalStatus: false }));
            reduxDispatch(changeModalAcceptBtnStatus({ key: 'modal1', acceptBtnStatus: true }));
          }}
        >
        </div>
      </div>
    ) : null;
}

export default Modal1;
