const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ? true
    : false;
};

const validatePassword = (password) => {
  return /(.*).{6,20}/.test(password)
    ? true
    : false;
};

const valideTitle = (title) => {
  return /[A-Za-z0-9-_ ]{0,100}/.test(password)
  ? true
  : false;
};

export { validateEmail, validatePassword, valideTitle };
