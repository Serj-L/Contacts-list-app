import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  setSnackbarWidth,
  setSnackbarHeight,
  closeSnackbar,
} from '../../store/contactsSlice';

import styles from './Snackbar.module.css';

const Snackbar = () => {
  const reduxDispatch = useDispatch();
  const { message, width, height, isActive } = useSelector((state) => state.contacts.snackbar);
  const { manualClose, position } = useSelector((state) => state.contacts.snackbar.options);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      position === 'top' || position === 'bottom' ?
        reduxDispatch(setSnackbarHeight({ height: node.offsetHeight })) :
        reduxDispatch(setSnackbarWidth({ width: node.offsetWidth }));
    }
  }, [position, reduxDispatch]);

  const hideStyles = new Map ([
    ['top', { top: `-${height}px` }],
    ['bottom', { bottom: `-${height}px` }],
    ['left', { left: `-${width}px` }],
    ['right', { right: `-${width}px` }],
  ]);

  return (
    <div
      className={styles.container}
      ref={measuredRef}
      data-is-active={isActive}
      data-position={position}
      data-manual-close={manualClose}
      style={!isActive ? hideStyles.get(position) : {} }
      onClick = {manualClose ? () => reduxDispatch(closeSnackbar()) : null}
    >
      <h3 className={styles.title}>{message}</h3>
    </div>
  );
};

export default Snackbar;
