module.exports = {
  apps: [
    {
      name: "cuniverse",
      cwd: "/home/ubuntu/cuniverse",
      script: "yarn",
      args: ["start"],
      exec_mode: "cluster",
      instances: 0,
      autorestart: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
