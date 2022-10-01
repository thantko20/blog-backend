import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const genHash = async (password: string): Promise<string> => {
  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return hashPassword;
};
