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

# Export the environment variables and make sure they persist
export CHAIN=$chain_name
export CHAIN_RPC_ENDPOINT="$chain_name"

echo "Building schema for chain: $CHAIN"

# Clean up files not related to the specific chain
echo "Removing files not required for $chain_name..."

# Keep only the specific chain files in src/chain and lib/chain
find src/chain -mindepth 1 -maxdepth 1 -type d -not -name "$chain_name" -exec rm -rf {} \;
find lib/chain -mindepth 1 -maxdepth 1 -type d -not -name "$chain_name" -exec rm -rf {} \; 2>/dev/null || true

echo "Cleanup complete. Only $chain_name chain files remain."

# Run the prepare:prod script with the environment variables
CHAIN=$chain_name CHAIN_RPC_ENDPOINT="$chain_name" sqd prepare:prod

# Deploy with expect for automatic confirmation
# expect <<EOF
# spawn sqd deploy -o limechain -m "$manifest_file"
# expect "Are you sure? (Y/n)"
# send "\r"
# expect eof
# EOF

echo "Deployment finished"

echo "Cleaning up"
# # Clean up
# git checkout -- .
# git clean -fd

sleep 5

unset CHAIN
unset CHAIN_RPC_ENDPOINT

if [ -z "$CHAIN" ]; then
  echo "CHAIN is unset"
fi

if [ -z "$CHAIN_RPC_ENDPOINT" ]; then
  echo "CHAIN_RPC_ENDPOINT is unset"
fi
