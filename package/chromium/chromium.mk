CHROMIUM_VERSION = 126.0.6478.164-rpt1
CHROMIUM_SOURCE = chromium-browser_$(CHROMIUM_VERSION)_arm64.deb
CHROMIUM_SITE = http://archive.raspberrypi.com/debian/pool/main/c/chromium-browser
CHROMIUM_SITE_METHOD = wget

# Also grab the ffmpeg codecs package
CHROMIUM_EXTRA_DOWNLOADS = \
    http://archive.raspberrypi.com/debian/pool/main/c/chromium-browser/chromium-codecs-ffmpeg-extra_$(CHROMIUM_VERSION)_arm64.deb

define CHROMIUM_EXTRACT_CMDS
    dpkg-deb -x $(@D)/$(CHROMIUM_SOURCE) $(@D)/extracted
    dpkg-deb -x $(@D)/chromium-codecs-ffmpeg-extra_$(CHROMIUM_VERSION)_arm64.deb $(@D)/extracted
endef

define CHROMIUM_INSTALL_TARGET_CMDS
    cp -r $(@D)/extracted/* $(TARGET_DIR)/
endef

$(eval $(generic-package))
