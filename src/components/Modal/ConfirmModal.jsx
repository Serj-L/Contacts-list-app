import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { changeConfirmModalStatus, changeConfirmModalAcceptBtnStatus } from '../../store/contactsSlice';

import styles from './Modal.module.css';

function ConfirmModal({
  modalTitle,
  acceptBtnHandler,
  acceptBtnTitle,
  rejectBtnHandler,
  rejectBtnTitle,
  children,
  componentUnmountFunc,
}) {
  const { isConfirmModalOpen, isConfirmModalAcceptBtnDissabled, isModalOpen } = useSelector((state) => state.contacts);
  const reduxDispatch = useDispatch();

  useEffect(()=> {
    if (!isConfirmModalOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      if (componentUnmountFunc) componentUnmountFunc();
      reduxDispatch(changeConfirmModalAcceptBtnStatus({ acceptBtnStatus: true }));
      if (!isModalOpen) document.body.style.overflow = 'auto';
    };
  }, [isConfirmModalOpen, componentUnmountFunc, isModalOpen, reduxDispatch]);

  return isConfirmModalOpen ?
    (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button
              className={styles.btnClose}
              onClick = {() => reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: false }))}
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
              disabled={isConfirmModalAcceptBtnDissabled}
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
          onClick = {() => reduxDispatch(changeConfirmModalStatus({ confirmModalStatus: false }))}
        ></div>
      </div>
    ) : null;
}

export default ConfirmModal;
