#!/bin/bash


set -e


pushd steamflake/webserver >/dev/null
tsc -t ES5 --module commonjs *.ts --outDir ../../../scripts
popd >/dev/null


echo "Last build: $(date)" > ../scripts/SteamflakeWebServer/specs/builddate.txt


