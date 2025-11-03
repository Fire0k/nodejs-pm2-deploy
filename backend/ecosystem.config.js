require('dotenv').config();

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'master',
} = process.env;

module.exports = {
  apps: [{
    name: 'app',
    script: './src/app.ts',
  }],

  // Настройка деплоя
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/Fire0k/nodejs-pm2-deploy.git',
      path: DEPLOY_PATH,
      'pre-deploy': `scp -i ~/.ssh/id_rsa ./*.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'npm i && npm run build',
    },
  },
};
