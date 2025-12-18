#!/bin/bash
cd  /home/ubuntu/apollo
ls
rm -rf /etc/nginx/sites-enabled/default.bak
source /home/ubuntu/apollo/env.sh

source /home/ubuntu/apollo/.env
yarn install