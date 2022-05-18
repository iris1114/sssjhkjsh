npm install -g pm2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:retain 7
pm2 unstartup
pm2 stop all
npm install
pm2 start ecosystem.config.js --only mweb-p
pm2 save
pm2 startup
pm2 monit