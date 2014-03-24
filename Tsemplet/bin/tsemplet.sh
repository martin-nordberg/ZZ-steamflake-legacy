#!/bin/bash

export NODE_PATH="/usr/lib/node_modules:.."

node ../app/tsemplet/main.js ../test/samples/sample001.html.tsmplt --outDir ../test/actual_output

