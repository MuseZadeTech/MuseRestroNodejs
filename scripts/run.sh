#!/bin/bash

# any future command that fails will exit the script
set -e
export PATH=/home/ubuntu/.nvm/versions/node/v8.16.2/bin/:$PATH
cd /home/ubuntu/api
# Delete the old files and except new build
find ! -iname artifact.tar.gz -delete
# unzip new build
tar xzf artifact.tar.gz
# delete build
rm -f artifact.tar.gz
pm2 delete -s api || :
pm2 start server/index.js --name api
exit