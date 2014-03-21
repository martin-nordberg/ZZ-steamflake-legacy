#!/bin/bash


set -e


pushd steamflake/model >/dev/null
echo Model Specs ...
tsc -t ES5 --module commonjs *.ts --outDir ../../../scripts
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeModel/specs/builddate.txt


