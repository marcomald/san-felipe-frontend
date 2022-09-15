export const validateLength = (input, size) => {
  if (input.length === size) {
    return true;
  }
  return false;
};

export const validateIntField = input => {
  const expression = new RegExp(/^\d+$/);
  return expression.test(input);
};

export const validateLessLength = (input, size) => {
  if (input.length <= size) {
    return true;
  }
  return false;
};

export const validateRepited = (listToVerify, attrNAme, value) => {
  if (listToVerify.filter(item => item[attrNAme] === value).length > 0) {
    return true;
  }
  return false;
};

export const validateEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
