#!/bin/bash

# Usage:
# Required parameters:
#   -m <manifest_file>    : Path to manifest file (e.g., manifests/shiden.yaml)
#   -c <chain_name>       : Name of the chain (e.g., shiden)
# Optional parameters:
#   -h                    : Perform a hard reset during deployment
#
# Example:
# ./deploy.sh -m manifests/shiden.yaml -c shiden -h

HARD_RESET_FLAG=""

while getopts "m:c:h" opt; do
  case $opt in
    m) manifest_file="$OPTARG"
    ;;
    c) chain_name="$OPTARG"
    ;;
    h) HARD_RESET_FLAG="--hard-reset"
    ;;
    *) echo "Invalid option"; exit 1
    ;;
  esac
done

# Run the prepare:prod script with the environment variables
CHAIN=$chain_name CHAIN_RPC_ENDPOINT="$chain_name" sqd prepare:prod

# Deploy the squid without confirmations
sqd deploy --no-interactive --no-stream-logs --allow-update -o limechain -m "$manifest_file" $HARD_RESET_FLAG
echo "Deployment finished"

# Clean up
echo "Cleaning up..."
git checkout -- .
git clean -fd

# Unset the environment variables
unset CHAIN
unset CHAIN_RPC_ENDPOINT

if [ -z "$CHAIN" ]; then
  echo "CHAIN is unset"
fi

if [ -z "$CHAIN_RPC_ENDPOINT" ]; then
  echo "CHAIN_RPC_ENDPOINT is unset"
fi
