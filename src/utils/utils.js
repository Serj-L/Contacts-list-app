export const getScrollBarWidth = () => {
  const outer = document.createElement('div');
  outer.style.position = 'adsolute';
  outer.style.top = '-9999px';
  outer.style.width = '50px';
  outer.style.height = '50px';
  outer.style.overflow = 'scroll';
  outer.style.visibility = 'hidden';
  document.body.appendChild(outer);
  const scrollBarWidth = outer.offsetWidth - outer.clientWidth;
  document.body.removeChild(outer);

  return scrollBarWidth;
};

export const formValidator = (name, email, phone, isEmailValid, isPhoneValid) => {
  return (name && (!email && !phone)) || (isEmailValid && !phone) || (isPhoneValid && !email) || (isEmailValid && isPhoneValid) ? false : true;
};

export const emailValidator = (email, phone, isPhoneValid, name, surname, key) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  return {
    email: isValid,
    key,
    acceptBtnStatus: (isValid && !phone) || (isPhoneValid && !email) || (isValid && isPhoneValid) || ((!email && !phone) && (name || surname)) ? false : true,
  };
};

export const phoneValidator = (phone, email, isEmailValid, name, surname, key) => {
  const isValid = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/.test(phone.trim());
  return {
    phone: isValid,
    key,
    acceptBtnStatus: (isValid && !email) || (isEmailValid && !phone) || (isValid && isEmailValid) || ((!phone && !email) && (name || surname)) ? false : true,
  };
};

export const addFieldEmailValidator = (email, key, fieldTitle, isFieldExist) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  return {
    email: isValid,
    key,
    acceptBtnStatus: (!email || isValid) && fieldTitle && !isFieldExist ? false : true,
  };
};

export const addFieldPhoneValidator = (phone, key, fieldTitle, isFieldExist) => {
  const isValid = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/.test(phone.trim());
  return {
    phone: isValid,
    key,
    acceptBtnStatus: (!phone || isValid) && fieldTitle && !isFieldExist ? false : true,
  };
};

export const getFieldType = (fieldTitle) => {
  const fieldTitleLowerCase = fieldTitle.toLowerCase();
  if (fieldTitleLowerCase.includes('email') || fieldTitleLowerCase.includes('e-mail') || fieldTitleLowerCase.includes('e mail')) return 'email';
  if (fieldTitleLowerCase.includes('phone')) return 'phone';
  return 'other';
};
