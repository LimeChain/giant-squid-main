# Project Setup

## Prerequisites

- Node >=20
- Nvm
- Install SubSquid CLI:

```bash
 npm i -g @subsquid/cli@latest
```

- Install Docker Desktop (<https://www.docker.com/products/docker-desktop/>)

- Install PgAdmin 4 (<https://www.postgresql.org/ftp/pgadmin/pgadmin4/v7.8/macos/>)

- Register on Dwellir to get a CHAIN_RPC_ENDPOINT URL (<https://dashboard.dwellir.com/register>) (It supports most chains)

- Make a new .env file (Copy .env.example)

## Run the project

- Build:

```bash
sqd build
```

- Build the DB:

```bash
sqd up
```

- Run:

```bash
sqd process
```

## TIPS

If you're using VSCode - Enable format on save with Prettier

On code change, to apply changes:

```bash
sqd build && sqd process
```

## PgAdmin 4 Configuration

To connect locally to the DB when you register a new DB, you need to configure the following:

```plaintext
Name: DB_NAME
Host name/address: localhost
Port: DB_PORT
Password: DB_PASS
```

## Development (Example - Subject to change)

### Adding a new chain

1. Go to chain/ and create a new folder with the chain name
2. Create a metadata.json file with the pallets that will be used (Refer to template folder)
3. Run `sqd typegen` - to generate class types for the chain
4. Go to chain/{chainName}/ and create a decoders folder inside with events and calls subfolders (Refer to the templates folder)
5. Implement the pallet calls and events decoding in the corresponding folders (Refer to the templates folder)

### Adding a new pallet (Example with current structure - subject to change)

1. Figure out pallet flow
2. Create/Update DB schema
3. Apply migration
4. Import in registry.ts the Handlers
5. Implement each pallet action in the indexer/actions folder (Could split the code in the actions folder)

## TODO: update this
