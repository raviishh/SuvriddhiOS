/*
 * Copyright (C) 2021 Igalia S.L.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public License
 * along with this library; see the file COPYING.LIB.  If not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301, USA.
 */

#if !defined(__WEBKIT_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit.h> can be included directly."
#endif

#ifndef WebKitMediaKeySystemPermissionRequest_h
#define WebKitMediaKeySystemPermissionRequest_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_MEDIA_KEY_SYSTEM_PERMISSION_REQUEST            (webkit_media_key_system_permission_request_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitMediaKeySystemPermissionRequest, webkit_media_key_system_permission_request, WEBKIT, MEDIA_KEY_SYSTEM_PERMISSION_REQUEST, GObject)

WEBKIT_API const gchar *
webkit_media_key_system_permission_get_name (WebKitMediaKeySystemPermissionRequest *request);

G_END_DECLS

#endif
