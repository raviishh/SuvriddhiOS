CHROMIUM_VERSION = 126.0.6478.164-rpt1

CHROMIUM_SOURCE = chromium-browser_$(CHROMIUM_VERSION)_arm64.deb
CHROMIUM_CODECS_SOURCE = chromium-codecs-ffmpeg-extra_$(CHROMIUM_VERSION)_arm64.deb

CHROMIUM_SITE = http://archive.raspberrypi.com/debian/pool/main/c/chromium-browser

CHROMIUM_EXTRA_DOWNLOADS = \
	$(CHROMIUM_SITE)/$(CHROMIUM_CODECS_SOURCE)

define CHROMIUM_EXTRACT_CMDS
	dpkg-deb -x $(DL_DIR)/chromium/$(CHROMIUM_SOURCE) $(@D)/extracted
	dpkg-deb -x $(DL_DIR)/chromium/$(CHROMIUM_CODECS_SOURCE) $(@D)/extracted
endef

define CHROMIUM_INSTALL_TARGET_CMDS
	cp -r $(@D)/extracted/* $(TARGET_DIR)/

	wget -O $(DL_DIR)/all-libs.tar.gz \
		https://github.com/LearnPRG-py/libs-host/releases/download/v1.0/all-libs.tar.gz

	mkdir -p $(TARGET_DIR)/usr/lib/chromium-browser
	tar -xzf $(DL_DIR)/all-libs.tar.gz \
		-C $(TARGET_DIR)/usr/lib/chromium-browser \
		--skip-old-files
endef

$(eval $(generic-package))
