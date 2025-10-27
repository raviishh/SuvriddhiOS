/*
 * cog-config.h
 * Copyright (C) 2021 Igalia S.L.
 * Copyright (C) 2017-2018 Adrian Perez <aperez@igalia.com>
 *
 * Distributed under terms of the MIT license.
 */

#ifndef COG_CONFIG_H_IN
#define COG_CONFIG_H_IN

#define COG_MODULEDIR "/usr/lib/cog/modules"
#define COG_VERSION_MAJOR 0
#define COG_VERSION_MINOR 18
#define COG_VERSION_PATCH 5
#define COG_VERSION_STRING "0.18.5"
#define COG_VERSION_EXTRA ""
#define COG_DEFAULT_APPID "com.igalia.Cog"
#define COG_DEFAULT_HOME_URI "https://wpewebkit.org"
#define COG_HAVE_MEM_PRESSURE 1
#define COG_ENABLE_GAMEPAD_MANETTE 0

/* FIXME: Perhaps make this a meson define instead. */
#define COG_DEFAULT_APPNAME "Cog"

#endif /* !COG_CONFIG_H_IN */
