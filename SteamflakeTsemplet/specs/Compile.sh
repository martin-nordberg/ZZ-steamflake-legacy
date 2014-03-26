#!/bin/bash


set -e


pushd steamflake/tsemplet >/dev/null
echo Tsemplet Specs ...
tsc -t ES5 --module commonjs *.ts --outDir ../../../scripts
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeTsemplet/specs/builddate.txt


