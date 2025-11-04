require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF, DEPLOY_REPO = 'origin/master',
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
      watch: false,
      node_args: '-r dotenv/config',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: `origin/${DEPLOY_REF}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      env: {
        PATH: '/home/fireok/.nvm/versions/node/v16.20.2/bin:/usr/bin:/bin',
      },
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env || true && scp .env.deploy ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env.deploy || true`,
      'post-setup': `mkdir -p ${DEPLOY_PATH}/shared && mkdir -p ${DEPLOY_PATH}/logs`,
      'post-deploy': `cp ${DEPLOY_PATH}/shared/.env . || true && cp ${DEPLOY_PATH}/shared/.env.deploy . || true && npm i && npm run build && pm2 reload ${DEPLOY_PATH}/current/ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production`,
    },
  },
};
