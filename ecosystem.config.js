// pm2 process definition for production (used by deploy/remote.sh).
//
// exec_mode "cluster" + wait_ready is what makes reloads zero-downtime:
// pm2 spins up the new process, waits for it to send "ready" (see
// src/main.ts), and only then kills the old one — the port is shared by the
// cluster module so requests are never refused. instances must stay at 1
// because the WebSocket gateway keeps its userId -> socket map in memory.
module.exports = {
  apps: [
    {
      name: 'hvoya-crm',
      cwd: '/var/www/sales.hvoya.com/current',
      script: 'dist/src/main.js',
      node_args: '-r newrelic',
      exec_mode: 'cluster',
      instances: 1,
      wait_ready: true,
      listen_timeout: 60000,
      kill_timeout: 15000,
      max_memory_restart: '700M',
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
