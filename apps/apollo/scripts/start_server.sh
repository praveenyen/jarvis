#!/bin/bash
# sudo systemctl restart nginx
cd  /home/ubuntu/apollo
pm2 delete app.json || true
pm2 start app.json
pm2 save
nginx -s reload
