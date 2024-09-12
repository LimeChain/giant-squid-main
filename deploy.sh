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

# If chain name is not provided, use the name of the manifest file as that
if [ -z "$chain_name" ]; then
  chain_name=$(basename "$manifest_file" .yaml)
fi

export CHAIN=$chain_name
export CHAIN_RPC_ENDPOINT="$chain_name"

# Wait a few seconds when you get the "Are you sure?" prompt it will automatically confirm
sqd prepare:prod && {
  expect <<EOF
  spawn sqd deploy -o limechain -r -m "$manifest_file"
  expect "Are you sure? (Y/n)"
  send "\r"
  expect eof
EOF
}

echo "Deployment finished"

sleep 10

unset CHAIN
unset CHAIN_RPC_ENDPOINT

if [ -z "$CHAIN" ]; then
  echo "CHAIN is unset"
fi

if [ -z "$CHAIN_RPC_ENDPOINT" ]; then
  echo "CHAIN_RPC_ENDPOINT is unset"
fi

# Remove unstaged changes caused by prepare:prod
git checkout -- .
git clean -fd