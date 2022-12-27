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

const validateTitle = (title) => {  
  return /^([\w\d_]+(\s[\w\d_]+)*){1,100}$/.test(title);
};

const titleConstraint = (str) => {
  return str + " title can't be empty, and must contain only: letters, digits, underscores, and one space only between words; up to 100 chars";
};

export { validateEmail, validatePassword, validateTitle, titleConstraint };
