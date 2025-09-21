module.exports = {
  apps: [
    {
      name: "nest-expense-splitter",
      cwd: "/var/www/app",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/pm2/nest-expense-splitter.err.log",
      out_file: "/var/log/pm2/nest-expense-splitter.out.log",
    },
  ],
};
