/*
 * Copyright (C) 2011 Igalia S.L.
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

#if !defined(__WEBKIT_H_INSIDE__) && !defined(__WEBKIT_WEB_PROCESS_EXTENSION_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit.h> can be included directly."
#endif

#ifndef WebKitURIRequest_h
#define WebKitURIRequest_h

#include <glib-object.h>
#include <libsoup/soup.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_URI_REQUEST            (webkit_uri_request_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitURIRequest, webkit_uri_request, WEBKIT, URI_REQUEST, GObject)

WEBKIT_API WebKitURIRequest *
webkit_uri_request_new              (const gchar      *uri);

WEBKIT_API const gchar *
webkit_uri_request_get_uri          (WebKitURIRequest *request);

WEBKIT_API void
webkit_uri_request_set_uri          (WebKitURIRequest *request,
                                     const gchar      *uri);

WEBKIT_API const gchar *
webkit_uri_request_get_http_method  (WebKitURIRequest *request);

WEBKIT_API SoupMessageHeaders *
webkit_uri_request_get_http_headers (WebKitURIRequest *request);

G_END_DECLS

#endif
