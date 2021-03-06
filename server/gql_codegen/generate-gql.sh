#!/usr/bin/env bash

# ROOT_DIR='.'
PORT='9898'

PORT=$PORT ts-node src/server.ts & SERVER_PID=$!
sleep 4s
gql-gen --config ./gql_codegen/codegen.yml 

kill -9 $SERVER_PID
kill -9 $(lsof -t -i:${PORT})

exit 0
