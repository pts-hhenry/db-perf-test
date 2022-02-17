#!/bin/sh
set -e

node --require dotenv-defaults/config src/index.js
