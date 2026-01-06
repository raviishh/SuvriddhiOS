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

ARCH=$(uname -m)

if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    echo "Suvriddhi: Native build detected ($ARCH)"
    SYSROOT="${TARGET_DIR}/../host/aarch64-buildroot-linux-gnu/sysroot"
    
    g++ main.cpp compile_handler.cpp run_handler.cpp utils.cpp \
    code_handler.cpp python_handler.cpp \
        --sysroot="$SYSROOT" \
        -lcivetweb \
        -o "${TARGET_DIR}/root/server" \
        -I "$SYSROOT/usr/include" \
        -L "$SYSROOT/usr/lib"
else
    echo "Suvriddhi: Cross-build detected ($ARCH)"
    CROSS_CPP="${TARGET_DIR}/../host/bin/aarch64-linux-g++"
    SYSROOT="${TARGET_DIR}/../host/aarch64-buildroot-linux-gnu/sysroot"

    "$CROSS_CPP" \
        main.cpp \
        compile_handler.cpp \
        run_handler.cpp \
        utils.cpp \
        code_handler.cpp \
        python_handler.cpp \
        -lcivetweb \
        -o "${TARGET_DIR}/root/server" \
        -I "$SYSROOT/usr/include" \
        -L "$SYSROOT/usr/lib"
fi