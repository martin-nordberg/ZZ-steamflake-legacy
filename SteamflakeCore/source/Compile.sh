#!/bin/sh

set -e


pushd steamflake/core/metamodel >/dev/null
tsc -t ES5 --module commonjs elements_impl.ts --outDir ../../../../scripts/SteamflakeCore/source/steamflake/core
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeCore/source/builddate.txt


