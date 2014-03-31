#!/bin/bash

export NODE_PATH="/usr/lib/node_modules:.."

set -e

cd ..

# Copy the plaform-specific code to work for node
#pushd scripts/SteamflakeWebServer/source/steamflake/core/platform >/dev/null
#rm platform.js
#cp platform_node.js platform.js
#popd >/dev/null

# Run Jasmine on all specs
jasmine-node --verbose scripts/SteamflakeWebServer/specs


echo "Last test: $(date)" > scripts/SteamflakeWebServer/specs/testdate.txt


