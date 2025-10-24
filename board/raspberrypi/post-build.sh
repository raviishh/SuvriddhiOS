#!/bin/sh

# This file is run after buildroot is done building but not done making the image file

set -u
set -e


# Write scripts here
cd ${TARGET_DIR}/../../src
npm run build
mv dist/* ${TARGET_DIR}/root/www
