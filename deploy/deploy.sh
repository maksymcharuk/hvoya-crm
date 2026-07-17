#!/usr/bin/env bash
#
# Deploys hvoya-crm to the production VPS.
#
#   ./deploy/deploy.sh              # deploy origin/master
#   DEPLOY_BRANCH=my-branch ./deploy/deploy.sh
#
# Configuration (override via environment):
#   DEPLOY_HOST   ssh target            (default: charuk@164.90.184.112)
#   DEPLOY_BRANCH branch to deploy      (default: master)
set -euo pipefail

DEPLOY_HOST=${DEPLOY_HOST:-charuk@164.90.184.112}
DEPLOY_BRANCH=${DEPLOY_BRANCH:-master}

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

echo "Deploying branch '$DEPLOY_BRANCH' to $DEPLOY_HOST"
ssh "$DEPLOY_HOST" "DEPLOY_BRANCH=$DEPLOY_BRANCH bash -s" < "$SCRIPT_DIR/remote.sh"
