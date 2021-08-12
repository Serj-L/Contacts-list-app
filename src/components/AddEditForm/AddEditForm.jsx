import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  changeModalAcceptBtnStatus,
  changeFieldExistStatus,
  addFieldTitle,
  addFieldValue,
  setAddFieldType,
  changeEmailValid,
  changePhoneValid,
} from '../../store/contactsSlice';

import styles from './AddEditForm.module.css';

import {
  addFieldEmailValidator,
  addFieldPhoneValidator,
  getFieldType,
} from '../../utils/utils';

const AddEditForm = ({
  modalKey,
  target,
}) => {
  const reduxDispatch = useDispatch();
  const isFieldExist = useSelector((state) => state.contacts.isFieldExist);
  const currentFieldKey = useSelector((state) => state.contacts.currentFieldKey);
  const { phone: isPhoneValid, email: isEmailValid } = useSelector((state) => state.contacts.isInputsValid);
  const fieldTitle = useSelector((state) => state.contacts.additionalFieldTitle);
  const fieldValue = useSelector((state) => state.contacts.additionalFieldValue);
  const fieldType = useSelector((state) => state.contacts.additionalFieldType);

  useEffect(() => {
    reduxDispatch(setAddFieldType({ additionalFieldType: getFieldType(fieldTitle) }));
  }, [reduxDispatch, fieldTitle]);

  return (
    <div className={styles.wrapper}>
      <label
        className={styles.label}
        data-is-uniq={!isFieldExist}
        data-is-empty={fieldTitle ? 'false' : 'true'}
      >
      Field title:
        <input
          className={styles.input}
          type='text'
          placeholder='Field title'
          name='fieldTitle'
          value={fieldTitle}
          data-is-uniq={!isFieldExist}
          data-is-empty={fieldTitle ? 'false' : 'true'}
          onChange = {(e) => {
            reduxDispatch(addFieldTitle({ additionalFieldTitle: e.target.value }));
            if (Object.keys(target).map(key => key.toLowerCase().trim()).includes(e.target.value.toLowerCase().trim()) && e.target.value !== currentFieldKey) {
              reduxDispatch(changeFieldExistStatus({ fieldExistStatus: true }));
              reduxDispatch(changeModalAcceptBtnStatus({ key: modalKey, acceptBtnStatus: true }));
              return;
            }
            if (isFieldExist) reduxDispatch(changeFieldExistStatus({ fieldExistStatus: false }));
            if (getFieldType(e.target.value) === 'other' || !fieldValue) {
              reduxDispatch(changeModalAcceptBtnStatus({ key: modalKey, acceptBtnStatus: e.target.value ? false : true }));
              return;
            }
            getFieldType(e.target.value) === 'email' ?
              reduxDispatch(changeEmailValid(addFieldEmailValidator(fieldValue, modalKey, e.target.value, false))) :
              reduxDispatch(changePhoneValid(addFieldPhoneValidator(fieldValue, modalKey, e.target.value, false)));
          }}
        />
      </label>
      <label
        className={styles.label}
        data-is-valid={fieldType === 'email' ? isEmailValid : fieldType === 'phone' ? isPhoneValid : ''}
        data-is-empty={fieldType === 'email' || fieldType === 'phone' ? fieldValue ? 'false' : 'true' : ''}
      >
        Field value:
        <input
          className={styles.input}
          type='text'
          placeholder='Field value'
          name='fieldValue'
          value={fieldValue}
          data-is-valid={fieldType === 'email' ? isEmailValid : fieldType === 'phone' ? isPhoneValid : ''}
          data-is-empty={fieldType === 'email' || fieldType === 'phone' ? fieldValue ? 'false' : 'true' : ''}
          onChange = {(e) => {
            reduxDispatch(addFieldValue({ additionalFieldValue: e.target.value }));
            if (fieldType === 'other') reduxDispatch(changeModalAcceptBtnStatus({ key: modalKey, acceptBtnStatus: (e.target.value && fieldTitle && !isFieldExist) || (fieldTitle && !isFieldExist) ? false : true }));
            if (fieldType === 'email') reduxDispatch(changeEmailValid(addFieldEmailValidator(e.target.value, modalKey, fieldTitle, isFieldExist)));
            if (fieldType === 'phone') reduxDispatch(changePhoneValid(addFieldPhoneValidator(e.target.value, modalKey, fieldTitle, isFieldExist)));
          }}
        />
      </label>
    </div>
  );
};

AddEditForm.propTypes = {
  modalKey: PropTypes.string.isRequired,
  target: PropTypes.object.isRequired,
};

export default AddEditForm;
