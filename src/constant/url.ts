// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const ACCEPT_INVITATION_URL =
  process.env.FRONTEND_URL + 'verify-invite/:accessToken';

export const VERIFY_EMAIL_URL =
  process.env.FRONTEND_URL + 'verify-email/:accessToken';

export const RESET_PASSWORD_URL =
  process.env.FRONTEND_URL + 'reset-password/:accessToken';

export const PACKAGE_RENEWAL_URL =
  process.env.FRONTEND_URL + 'payment/card-payment';

// renewalLink
