#!/bin/sh

set -e

# Compile the Typescript files
pushd steamflake/core/metamodel >/dev/null
tsc -t ES5 --module commonjs corecommands.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core
tsc -t ES5 --module commonjs elements_impl.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core
tsc -t ES5 --module commonjs listeners.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core
popd >/dev/null

# Track the build time
echo "Last build: $(date)" > ../scripts/SteamflakeCore/source/builddate.txt


