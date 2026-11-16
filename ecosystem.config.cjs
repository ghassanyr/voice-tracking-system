module.exports = {
  apps: [
    {
      name: "voice-tracking-system",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 2000",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "2000",
      },
    },
  ],
};
