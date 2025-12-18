#!/bin/bash 
status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:3000/api/v1/healthCheck)

if [[ "$status_code" -ne 200 ]] ; then
    exit 1
else
    exit 0
fi