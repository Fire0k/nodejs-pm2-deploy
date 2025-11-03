require('dotenv').config();

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REPO,
  DEPLOY_REF = 'main', // или master
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/app.js', // или путь к точке входа
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: `${DEPLOY_PATH}`,
      'pre-deploy-local': `scp ./.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/backend/.env`,
      'post-deploy': `
        export NVM_DIR="$HOME/.nvm" &&
        source "$NVM_DIR/nvm.sh" &&
        npm install &&
        npm run build &&
        pm2 reload ecosystem.config.js --env production
      `,
    },
  },
};
