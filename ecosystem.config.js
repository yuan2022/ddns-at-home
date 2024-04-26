module.exports = {
  apps: [
    {
      name: 'ddns-at-home',
      script: './dist/index.js',
      watch: './dist',
      env: {
        NODE_ENV: 'development',
        DAEMON: 'pm2'
      },
      env_production: {
        NODE_ENV: 'production',
        DAEMON: 'pm2'
      }
    }
  ],
};
