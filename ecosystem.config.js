module.exports = {
  apps: [
    {
      name: "cuniverse",
      script: "yarn",
      args: "start",
      interpreter: "/bin/bash",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
