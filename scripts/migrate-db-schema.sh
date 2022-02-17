#!/bin/sh

node --require dotenv-defaults/config src/models/migrations/schema/run.js
