#!/bin/bash
echo Removing packages...
rm -rf node_modules/
rm package-lock.json
rm -rf ~/.node-gyp/
echo Re-installing...
npm i --no-optional
echo Deduplicating modules
npm dedupe