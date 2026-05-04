// PM2 ecosystem config — Phase 2 (Next.js production server)
// Usage on VPS:
//   cd /var/www/jubir-warga-phase2
//   pm2 start deploy/phase2/ecosystem.config.js
//   pm2 save
//   pm2 startup systemd -u root --hp /root

module.exports = {
  apps: [
    {
      name: 'jubir-warga-phase2',
      cwd: '/var/www/jubir-warga-phase2/apps/web',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Env file dengan secrets di-load oleh Next.js via .env.production.local
      // (chmod 600, root-owned, NOT in git). PM2 tidak load .env file langsung.

      instances: 1,
      exec_mode: 'fork',

      max_memory_restart: '800M',
      min_uptime: '30s',
      max_restarts: 5,

      autorestart: true,
      watch: false,

      // Logs — diarahkan ke ~/.pm2/logs/. Setup logrotate via:
      //   pm2 install pm2-logrotate
      //   pm2 set pm2-logrotate:max_size 10M
      //   pm2 set pm2-logrotate:retain 7
      out_file: '/root/.pm2/logs/jubir-warga-phase2-out.log',
      error_file: '/root/.pm2/logs/jubir-warga-phase2-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
