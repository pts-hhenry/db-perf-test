#!/usr/bin/env bash

if [ "${CI}" != "true" ]
then
  set -o allexport
  source ./.env
  set +o allexport
fi
