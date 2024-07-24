#!/usr/bin/env bash
set -o errexit

# Ensure correct Node version
nvm install 20.15.1
nvm use 20.15.1

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
