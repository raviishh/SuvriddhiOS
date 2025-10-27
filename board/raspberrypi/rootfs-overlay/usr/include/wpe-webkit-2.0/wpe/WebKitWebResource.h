/*
 * Copyright (C) 2012 Igalia S.L.
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

#ifndef WebKitWebResource_h
#define WebKitWebResource_h

#include <glib-object.h>
#include <gio/gio.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitURIResponse.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_WEB_RESOURCE            (webkit_web_resource_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitWebResource, webkit_web_resource, WEBKIT, WEB_RESOURCE, GObject)

WEBKIT_API const gchar *
webkit_web_resource_get_uri         (WebKitWebResource  *resource);

WEBKIT_API WebKitURIResponse *
webkit_web_resource_get_response    (WebKitWebResource  *resource);

WEBKIT_API void
webkit_web_resource_get_data        (WebKitWebResource  *resource,
                                     GCancellable       *cancellable,
                                     GAsyncReadyCallback callback,
                                     gpointer            user_data);

WEBKIT_API guchar *
webkit_web_resource_get_data_finish (WebKitWebResource  *resource,
                                     GAsyncResult       *result,
                                     gsize              *length,
                                     GError            **error);

G_END_DECLS

#endif
