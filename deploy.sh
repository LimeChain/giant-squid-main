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

# Parse main.ts to determine which pallets are needed
MAIN_TS_FILE="src/chain/$chain_name/main.ts"
echo "Analyzing $MAIN_TS_FILE to determine required pallets..."

# Extract pallet names from main.ts (everything before the dot in 'Pallet.Event' or 'Pallet.call')
USED_PALLETS=$(grep -o "'[A-Za-z]\+\.[A-Za-z]\+'" "$MAIN_TS_FILE" | sed "s/'//g" | cut -d'.' -f1 | sort -u)

echo "Required pallets:"
echo "$USED_PALLETS"

# Create an array to store directory mappings
declare -a KEEP_DIRS

# Map pallet names to directory names based on conventions
for pallet in $USED_PALLETS; do
  case "$pallet" in
    # "Balances")
    #   KEEP_DIRS+=("balances")
    #   ;;
    # "PolkadotXcm")
    #   KEEP_DIRS+=("polkadot-xcm")
    #   ;;
    # "XTokens")
    #   KEEP_DIRS+=("x-tokens")
    #   ;;
    # "ConvictionVoting")
    #   KEEP_DIRS+=("conviction-voting")
    #   ;;
    # "NominationPools")
    #   KEEP_DIRS+=("nomination-pools")
    #   ;;
    # "ParachainStaking")
    #   KEEP_DIRS+=("parachain-staking")
    #   ;;
    # "Staking")
    #   KEEP_DIRS+=("staking")
    #   ;;
    # "Crowdloan")
    #   KEEP_DIRS+=("crowdloan")
    #   ;;
    # "Identity")
    #   KEEP_DIRS+=("identity")
    #   ;;
    # "Xcm")
    #   KEEP_DIRS+=("xcm")
    #   ;;
    *)
      # Convert camelCase to kebab-case for other pallets
      kebab_case=$(echo "$pallet" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')
      KEEP_DIRS+=("$kebab_case")
      ;;
  esac
done

echo "Directories to keep:"
printf '%s\n' "${KEEP_DIRS[@]}"

# Remove unused action and pallet directories
echo "Removing unused action and pallet directories..."

# Process actions directories
for dir in $(find src/indexer/actions -mindepth 1 -maxdepth 1 -type d -printf "%f\n"); do
  keep=false
  for keep_dir in "${KEEP_DIRS[@]}"; do
    if [ "$dir" = "$keep_dir" ]; then
      keep=true
      break
    fi
  done

  if [ "$keep" = false ]; then
    echo "Removing unused action directory: $dir"
    rm -rf "src/indexer/actions/$dir"
    rm -rf "lib/indexer/actions/$dir" 2>/dev/null || true
  else
    echo "Keeping required action directory: $dir"
  fi
done

# Process pallets directories
for dir in $(find src/indexer/pallets -mindepth 1 -maxdepth 1 -type d -printf "%f\n"); do
  keep=false
  for keep_dir in "${KEEP_DIRS[@]}"; do
    if [ "$dir" = "$keep_dir" ]; then
      keep=true
      break
    fi
  done

  if [ "$keep" = false ]; then
    echo "Removing unused pallet directory: $dir"
    rm -rf "src/indexer/pallets/$dir"
    rm -rf "lib/indexer/pallets/$dir" 2>/dev/null || true
  else
    echo "Keeping required pallet directory: $dir"
  fi
done

echo "Cleanup complete. Only $chain_name chain files and required pallets/actions remain."

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
