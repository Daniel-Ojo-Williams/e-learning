import * as crypto from 'crypto';

export default (): { token: string; tokenExpiry: Date } => {
  const tokenExpiry = new Date();
  tokenExpiry.setTime(tokenExpiry.getTime() + 24 * 60 * 60 * 1000);
  const byt = crypto.randomBytes(16).toString('hex');
  const token = byt + tokenExpiry.getTime();
  return { token, tokenExpiry };
};
