export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGOOSE_URI,
  slack: {
    appId: process.env.SLACK_APP_ID,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  },
  rollbar: {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    environment: process.env.ROLLBAR_ENVIRONMENT,
  },
});
