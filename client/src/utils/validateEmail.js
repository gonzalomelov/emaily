function isEmail(inputString) {
  // Define a regular expression pattern to match an email string
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  // Test if the input string matches the pattern
  return pattern.test(inputString);
}

export default string => {
  const to = string.split(',').map(email => ({ email: email.trim() }));
  
  const notEmail = to.find(({ email }) => !isEmail(email));
  
  if (notEmail) {
    return { valid: false, error: `You must provide en email per each comma-separated value. Please checkout the following string: ${notEmail.email}` };
  }

  return { valid: true };
};