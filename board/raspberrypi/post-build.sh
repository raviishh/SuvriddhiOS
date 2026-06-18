#!/bin/sh

# This file is run after buildroot is done building but not done making the image file

set -u
set -e

echo "Checking WiFi firmware..."
echo "Installing BCM43455 firmware..."

FIRMWARE_DIR="${TARGET_DIR}/lib/firmware/brcm"

mkdir -p "$FIRMWARE_DIR"

wget -O "$FIRMWARE_DIR/brcmfmac43455-sdio.bin" \
    "https://raw.githubusercontent.com/RPi-Distro/firmware-nonfree/master/brcm/brcmfmac43455-sdio.bin"

wget -O "$FIRMWARE_DIR/brcmfmac43455-sdio.clm_blob" \
    "https://raw.githubusercontent.com/RPi-Distro/firmware-nonfree/master/brcm/brcmfmac43455-sdio.clm_blob"

wget -O "$FIRMWARE_DIR/brcmfmac43455-sdio.txt" \
    "https://raw.githubusercontent.com/RPi-Distro/firmware-nonfree/master/brcm/brcmfmac43455-sdio.txt"

echo "BCM43455 firmware installed."

ls -lh "$FIRMWARE_DIR"/brcmfmac43455-sdio.*

# Write scripts here

cd ${TARGET_DIR}/../../src_phy/public/pdfs
wget https://github.com/LearnPRG-py/SuvriddhiBooks/releases/download/book/drive-download-20260617T081439Z-3-001.zip
unzip drive-download-20260617T081439Z-3-001.zip "*" -d .
rm drive-download-20260617T081439Z-3-001.zip

cd ${TARGET_DIR}/../../home
npm install
npm run build
rm -rf ${TARGET_DIR}/root/www/
mkdir -p ${TARGET_DIR}/root/www/
mv dist/* ${TARGET_DIR}/root/www/

cd ../src_cs
npm install
npm run build
rm -rf ${TARGET_DIR}/root/www/build/
mkdir -p ${TARGET_DIR}/root/www/build/
mv dist/* ${TARGET_DIR}/root/www/build/

cd ../src_phy
npm install
npm run build
rm -rf ${TARGET_DIR}/root/www/learn/
mkdir -p ${TARGET_DIR}/root/www/learn/
mv dist/* ${TARGET_DIR}/root/www/learn/

cd ../src_cs/backend

ARCH=$(uname -m)

if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    echo "Suvriddhi: Native build detected ($ARCH)"
    SYSROOT="${TARGET_DIR}/../host/aarch64-buildroot-linux-gnu/sysroot"
    
    g++ main.cpp compile_handler.cpp run_handler.cpp utils.cpp \
    code_handler.cpp python_handler.cpp wlan_handler.cpp power_handler.cpp \
    updates_handler.cpp rollback_handler.cpp \
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
        wlan_handler.cpp \
        power_handler.cpp \
        updates_handler.cpp \
        rollback_handler.cpp \
        -lcivetweb \
        -o "${TARGET_DIR}/root/server" \
        -I "$SYSROOT/usr/include" \
        -L "$SYSROOT/usr/lib"
fi
