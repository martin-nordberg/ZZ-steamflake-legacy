#!/bin/bash


set -e


pushd steamflake/core >/dev/null
tsc -t ES5 --module commonjs concurrency/*.ts contracts/*.ts io/*.ts metamodel/*.ts utilities/*.ts --outDir ../../../scripts/SteamflakeCore
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeCore/specs/builddate.txt


