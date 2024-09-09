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

sqd prepare:prod && {
  expect <<EOF
  spawn sqd deploy -o limechain -r -m "$manifest_file"
  expect "Are you sure? (Y/n)"
  send "\r"
  expect eof
EOF
}

sleep 10

unset CHAIN
unset CHAIN_RPC_ENDPOINT

# Remove unstaged changes caused by prepare:prod
git reset --hard