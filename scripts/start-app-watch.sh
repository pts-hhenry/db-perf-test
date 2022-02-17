#!/bin/sh
set -e

nodemon --require dotenv-defaults/config --watch src src/index.js
