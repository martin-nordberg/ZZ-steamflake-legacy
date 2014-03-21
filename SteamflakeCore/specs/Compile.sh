#!/bin/bash


set -e


pushd steamflake/core >/dev/null
tsc -t ES5 --module commonjs utilities/*.ts concurrency/*.ts contracts/*.ts metamodel/*.ts --outDir ../../../scripts/SteamflakeCore
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeCore/specs/builddate.txt


