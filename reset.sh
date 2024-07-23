#!/bin/bash
docker-compose down backend-dev redis-dev -t 1

pushd backend || exit 1

yarn full-reset

popd || exit 1

docker-compose up backend-dev redis-dev -d
