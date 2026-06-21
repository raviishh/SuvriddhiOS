#!/bin/sh
curl --max-time 240 -L -k -o /tmp/suvriddhi.zip https://github.com/raviishh/SuvriddhiOS/releases/latest/download/suvriddhi.zip
if [ $? -ne 0 ]; then
  echo "Download failed, aborting update"
  exit 1
fi

mkdir -p /root/www_new
unzip -o /tmp/suvriddhi.zip -d /root/www_new
if [ $? -ne 0 ]; then
  echo "Unzip failed, aborting update"
  exit 1
fi

reboot
