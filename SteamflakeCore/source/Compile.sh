#!/bin/sh

set -e

# Compile the Typescript files
pushd steamflake/core/metamodel >/dev/null
echo corecommands.ts ...
tsc -t ES5 --module commonjs corecommands.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core
echo elements_impl.ts ...
tsc -t ES5 --module commonjs elements_impl.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core
echo supervisor.ts ...
tsc -t ES5 --module commonjs supervisor.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core
popd >/dev/null

pushd steamflake/core/contracts >/dev/null
echo expectations.ts ...
tsc -t ES5 --module commonjs expectations.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core/contracts
echo providers.ts ...
tsc -t ES5 --module commonjs providers.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core/contracts
popd >/dev/null

# Track the build time
echo "Last build: $(date)" > ../scripts/SteamflakeCore/source/builddate.txt


