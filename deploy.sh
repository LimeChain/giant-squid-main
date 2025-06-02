#!/bin/bash

# Example of how script is ran:
# ./deploy.sh -m manifests/shiden.yaml -c shiden

while getopts "m:c:" opt; do
  case $opt in
    m) manifest_file="$OPTARG"
    ;;
    c) chain_name="$OPTARG"
    ;;
    *) echo "Invalid option"; exit 1
    ;;
  esac
done

# Run the prepare:prod script with the environment variables
CHAIN=$chain_name CHAIN_RPC_ENDPOINT="$chain_name" sqd prepare:prod

# Deploy with expect for automatic confirmation
expect <<EOF
spawn sqd deploy -o limechain -m "$manifest_file"
expect "Are you sure? (Y/n)"
send "\r"
expect eof
EOF

echo "Deployment finished"

echo "Cleaning up"
# Clean up
git checkout -- .
git clean -fd

sleep 10

unset CHAIN
unset CHAIN_RPC_ENDPOINT

if [ -z "$CHAIN" ]; then
  echo "CHAIN is unset"
fi

if [ -z "$CHAIN_RPC_ENDPOINT" ]; then
  echo "CHAIN_RPC_ENDPOINT is unset"
fi
