#!/bin/bash


set -e


pushd steamflake/core/utilities >/dev/null
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null

pushd steamflake/core/concurrency >/dev/null
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null

pushd steamflake/core/contracts >/dev/null
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null

pushd steamflake/core/metamodel >/dev/null
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeCore/specs/builddate.txt


