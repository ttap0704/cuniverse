module.exports = {
  apps: [
    {
      name: 'cuniverse',
      cwd: '/home/ubuntu/cuniverse',
      script: '/home/ubuntu/cuniverse/node_modules/next/dist/bin/next',
      args: 'start',
      exec_mode: 'cluster',
      instances: 0,
      autorestart: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
