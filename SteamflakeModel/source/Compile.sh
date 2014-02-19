#!/bin/sh

set -e

# Compile the Typescript files
pushd steamflake/model >/dev/null
tsc -t ES5 --module commonjs structure.ts --outDir ../../../scripts
popd >/dev/null

# Track the build time
echo "Last build: $(date)" > ../scripts/SteamflakeModel/source/builddate.txt


