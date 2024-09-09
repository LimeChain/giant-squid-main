#!/bin/bash

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

if [ -z "$chain_name" ]; then
  chain_name=$(basename "$manifest_file" .yaml)
fi

export CHAIN=$chain_name
export CHAIN_RPC_ENDPOINT="$chain_name"

sqd prepare:prod && echo "y" | sqd deploy -o limechain -r -m "$manifest_file"

unset CHAIN
unset CHAIN_RPC_ENDPOINT

# Remove unstaged changes caused by prepare:prod
git checkout -- .