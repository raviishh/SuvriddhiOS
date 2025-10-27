#!/bin/sh

# This file is run after buildroot is done building but not done making the image file

set -u
set -e


# Write scripts here

cd ${TARGET_DIR}/../../src
npm install
npm run build
rm -rf ${TARGET_DIR}/root/www/*
mv dist/* ${TARGET_DIR}/root/www
cd backend
${TARGET_DIR}/../host/bin/aarch64-linux-g++ main.cpp compile_handler.cpp run_handler.cpp utils.cpp code_handler.cpp -lcivetweb -o ${TARGET_DIR}/root/server -I ${TARGET_DIR}/../host/aarch64-buildroot-linux-gnu/sysroot/usr/include -L ${TARGET_DIR}/../host/aarch64-buildroot-linux-gnu/sysroot/usr/lib
