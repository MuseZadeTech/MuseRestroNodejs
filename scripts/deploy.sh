#!/bin/bash

# any future command that fails will exit the script
set -e
if [ -z ${NODE_ENV+x} ]
then
    echo "Development mode"
    SSH_PRIVATE_KEY="$SSH_PRIVATE_KEY_DEVELOP"
    SSH_USER="$SSH_USER_DEVELOP"
    SSH_HOST="$SSH_HOST_DEVELOP"
    APP_PATH="$APP_PATH_DEVELOP"
fi
# Lets write the public key of our aws instance
eval $(ssh-agent -s)
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null

mkdir -p ~/.ssh
touch ~/.ssh/config
echo -e "Host *\n\tStrictHostKeyChecking no\n\n" >> ~/.ssh/config


echo "deploying to $SSH_HOST"
scp /tmp/artifact.tar.gz ${SSH_USER}@${SSH_HOST}:${APP_PATH}
ssh ${SSH_USER}@${SSH_HOST} 'bash -s' < ./scripts/run.sh