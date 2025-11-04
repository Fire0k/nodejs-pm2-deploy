require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/master',
  DEPLOY_REPO,
} = process.env;

module.exports = {
  apps: [],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      env: {
        PATH: '/home/fireok/.nvm/versions/node/v16.20.2/bin:/usr/bin:/bin',
      },
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env || true && scp .env.deploy ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env.deploy || true`,
      'post-deploy': `cp ${DEPLOY_PATH}/shared/.env . || true && cp ${DEPLOY_PATH}/shared/.env.deploy . || true && npm i && npm run build`,
    },
  },
};
