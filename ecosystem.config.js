module.exports = {
  apps: [{
    name: 'kiboo-backend',
    script: './index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '500M',
    restart_delay: 4000,
    autorestart: true
  }]
};
