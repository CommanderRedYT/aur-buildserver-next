#!/bin/bash
docker-compose down

pushd backend

yarn full-reset

popd

docker-compose up -d
