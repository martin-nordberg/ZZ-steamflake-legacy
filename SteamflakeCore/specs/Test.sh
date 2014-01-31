#!/bin/bash


set -e


cd ..


jasmine-node --verbose scripts/SteamflakeCore/specs


echo "Last test: $(date)" > scripts/SteamflakeCore/specs/testdate.txt


