module.exports = {
  apps: [
    {
      name: 'plantonagro-backend',
      cwd: '/root/plant-on-agro/backend',
      script: 'dist/server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '350M',
      env: {
        NODE_ENV: 'production',
        PORT: 5008,
      },
      error_file: '/root/.pm2/logs/plantonagro-backend-error.log',
      out_file: '/root/.pm2/logs/plantonagro-backend-out.log',
      time: true,
    },
  ],
};

