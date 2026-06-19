#!/bin/sh

# Step 1: Curl the release URL:
curl --max-time 30 -o /tmp/release.json https://api.github.com/repos/raviishh/SuvriddhiOS/releases/latest
DOWNLOAD_URL=$(grep -o '"browser_download_url": *"[^"]*"' /tmp/release.json | grep -o 'https://[^"]*')
curl --max-time 60 -L -o /tmp/suvriddhi.zip "$DOWNLOAD_URL"

# Step 2: After downloading you have a zip file, create /root/www_new with the extracted contents of the zip
mkdir -p /root/www_new
unzip -o /tmp/suvriddhi.zip -d /root/www_new

# Step 3: Reboot and have S55git take over the rest on boot.
reboot
