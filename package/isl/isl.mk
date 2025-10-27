################################################################################
#
# isl
#
################################################################################

ISL_VERSION = 0.26
ISL_SOURCE = isl-$(ISL_VERSION).tar.xz
ISL_SITE = https://libisl.sourceforge.io
ISL_LICENSE = MIT
ISL_LICENSE_FILES = LICENSE
ISL_DEPENDENCIES = gmp
HOST_ISL_DEPENDENCIES = host-gmp

ISL_CONF_OPTS = --disable-static --enable-shared

$(eval $(autotools-package))
$(eval $(host-autotools-package))
