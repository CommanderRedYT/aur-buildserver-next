#!/bin/bash
# shellcheck disable=SC2164
pushd backend

yarn generate-types

popd

pushd frontend

yarn generate-types

popd
