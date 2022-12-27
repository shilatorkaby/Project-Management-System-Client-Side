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
  return /^([\w\d\-_]+(\s[\w\d\-_]+)*){1,100}$/.test(title);
};

const titleConstraint = (str) => {
  return str + " title can't be empty, and must contain only: letters, digits, hyphens, underscores, and one space only between words; up to 100 chars";
};

export { validateEmail, validatePassword, validateTitle, titleConstraint };
