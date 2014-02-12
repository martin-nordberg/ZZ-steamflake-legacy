#!/bin/bash


set -e

cd ..

# Copy the plaform-specific code to work for node
pushd scripts/SteamflakeCore/source/steamflake/core/platform
rm platform.js
cp platform_node.js platform.js
popd

# Run Jasmine on all specs
jasmine-node --verbose scripts/SteamflakeCore/specs


echo "Last test: $(date)" > scripts/SteamflakeCore/specs/testdate.txt


