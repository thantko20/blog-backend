const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const genHash = async (password) => {
  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashPassword;
};

const comparePasswords = async (password, hashPassword) => {
  const isValid = await bcrypt.compare(password, hashPassword);

  return isValid;
};

module.exports = {
  genHash,
  comparePasswords,
};
