#!/bin/sh

echo "stopping infrastructure"

docker compose -f geoapp/docker-compose.yml down
