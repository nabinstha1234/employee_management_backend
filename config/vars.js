require('dotenv').config();

const originsEnv = process.env.ORIGINS;
let origins;
try {
  origins = originsEnv.split(',');
} catch (err) {
  origins = ['http://localhost:3000'];
}

module.exports = {
  origins,
  originUrl: process.env.ORIGINS,
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  appName: process.env.APP_NAME || 'boilerplate',
  secretKey: process.env.SECRET_KEY || 'secretKey',
  refreshTokenKey: process.env.REFRESH_TOKEN_SECRET_KEY || 'refreshSecretKey',
  refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
  saltRounds: process.env.SALT_ROUNDS || 10,
  verificationEmailTokenExpiration: process.env.VERIFICATION_EMAIL_EXPIRATION || '1d',
  authTokenExpiration: process.env.AUTH_TOKEN_EXPIRATION || '10s',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  forgotPasswordTokenExpiration: process.env.FORGOT_PASSWORD_TOKEN_EXPIRATION || '1hr',
  sendGridToken: process.env.SENDGRID_API_KEY,
  mailSender: process.env.SENDER_EMAIL,
  tokenType: {
    refresh: 'refresh',
  },
  languages: {
    english: 'en',
    japanese: 'jp',
  },
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
  },
  mongo: {
    url: process.env.MONGO_URL || `mongodb://127.0.0.1:27017/boilerplate`,
  },
  roles: {
    admin: 'SuperAdmin',
    user: 'user',
    adminAuthority: 'Admin',
    generalAuthority: 'GeneralAdmin',
  },
  models: {
    User: 'User',
    UserToken: 'UserToken',
  },
  log: {
    fileLogLevel: process.env.FILE_LOG_LEVEL,
    dirname: process.env.LOG_DIRNAME,
    errorLogFilename: process.env.ERROR_LOG_FILENAME || 'error',
    logLevels: {
      error: 'error',
      warn: 'warn',
      info: 'info',
      verbose: 'verbose',
      debug: 'debug',
      silly: 'silly',
    },
  },
  acl: {
    // acl values goes here, eg. user: ['admin', 'user']
  },
  events: {
    onSignUp: 'onSignUp',
  },
  permissions: {
    employee: {
      CAN_CREATE_EMPLOYEE: 'create-employee',
      CAN_UPDATE_EMPLOYEE: 'edit-employee',
      CAN_DELETE_EMPLOYEE: 'delete-employee',
      CAN_VIEW_EMPLOYEE: 'view-employee',
    },
    user: {
      CAN_CREATE_USER: 'create-user',
      CAN_UPDATE_USER: 'edit-user',
      CAN_DELETE_USER: 'delete-user',
      CAN_VIEW_USER: 'view-user',
    },
    company: {
      CAN_CREATE_COMPANY: 'create-company',
      CAN_UPDATE_COMPANY: 'edit-company',
      CAN_DELETE_COMPANY: 'delete-company',
      CAN_VIEW_COMPANY: 'view-company',
    },
  },
};
