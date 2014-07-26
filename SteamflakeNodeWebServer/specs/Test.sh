#!/bin/bash

export NODE_PATH="/usr/lib/node_modules:.."

set -e

cd ..

# Copy the plaform-specific code to work for node
pushd scripts/SteamflakeCore/source/steamflake/core/platform >/dev/null
rm platform.js
cp platform_node.js platform.js
popd >/dev/null

# Kill any remnants of prior run
rm -rf /tmp/steamflake

# Run Jasmine on all specs
jasmine-node --verbose scripts/SteamflakeNodeWebServer/specs


echo "Last test: $(date)" > scripts/SteamflakeNodeWebServer/specs/testdate.txt


