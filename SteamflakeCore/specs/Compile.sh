#!/bin/bash


set -e


pushd steamflake/core/utilities >/dev/null
echo Utility Specs ...
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null

pushd steamflake/core/concurrency >/dev/null
echo Concurrency Specs ...
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null

pushd steamflake/core/contracts >/dev/null
echo Contracts Specs ...
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null

pushd steamflake/core/metamodel >/dev/null
echo Metamodel Specs ...
tsc -t ES5 --module commonjs *.ts --outDir ../../../../scripts/SteamflakeCore
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeCore/specs/builddate.txt


