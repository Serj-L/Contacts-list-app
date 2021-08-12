import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './Modal.module.css';

const Modal = ({
  isModalActive,
  modalKey,
  modalTitle,
  acceptBtnHandler,
  acceptBtnTitle,
  rejectBtnHandler,
  rejectBtnTitle,
  closeModalHandler,
  componentUnmountFunc,
  children,
}) => {
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);
  const isModalAcceptBtnDissabled = useSelector((state) => state.contacts.isModalAcceptBtnDissabled);
  const reduxDispatch = useDispatch();

  useEffect(()=> {
    if (!isModalActive) return;
    document.body.style.overflow = 'hidden';
    return () => {
      if (componentUnmountFunc) componentUnmountFunc();
    };
  }, [isModalActive, componentUnmountFunc, isModalOpen, reduxDispatch]);

  return isModalActive ?
    (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button
              className={styles.btnClose}
              onClick = {closeModalHandler}
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
              disabled={isModalAcceptBtnDissabled[modalKey]}
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
          onClick = {closeModalHandler}
        >
        </div>
      </div>
    ) : null;
};

Modal.propTypes = {
  isModalActive: PropTypes.bool.isRequired,
  modalKey: PropTypes.string.isRequired,
  modalTitle: PropTypes.string,
  acceptBtnHandler: PropTypes.func.isRequired,
  acceptBtnTitle: PropTypes.string,
  rejectBtnHandler: PropTypes.func.isRequired,
  rejectBtnTitle: PropTypes.string,
  closeModalHandler: PropTypes.func.isRequired,
  componentUnmountFunc: PropTypes.func,
};

Modal.defaultProps = {
  modalTitle: 'Modal window',
  acceptBtnTitle: 'Accept',
  rejectBtnTitle: 'Reject',
};

export default Modal;
