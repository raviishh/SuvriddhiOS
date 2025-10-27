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

#ifndef WebKitURISchemeRequest_h
#define WebKitURISchemeRequest_h

#include <glib-object.h>
#include <libsoup/soup.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitURISchemeResponse.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_URI_SCHEME_REQUEST            (webkit_uri_scheme_request_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitURISchemeRequest, webkit_uri_scheme_request, WEBKIT, URI_SCHEME_REQUEST, GObject)

typedef struct _WebKitWebView WebKitWebView;

WEBKIT_API const gchar *
webkit_uri_scheme_request_get_scheme   (WebKitURISchemeRequest *request);

WEBKIT_API const gchar *
webkit_uri_scheme_request_get_uri      (WebKitURISchemeRequest *request);

WEBKIT_API const gchar *
webkit_uri_scheme_request_get_path     (WebKitURISchemeRequest *request);

WEBKIT_API WebKitWebView *
webkit_uri_scheme_request_get_web_view (WebKitURISchemeRequest *request);

WEBKIT_API const gchar *
webkit_uri_scheme_request_get_http_method (WebKitURISchemeRequest *request);

WEBKIT_API SoupMessageHeaders *
webkit_uri_scheme_request_get_http_headers (WebKitURISchemeRequest *request);

WEBKIT_API GInputStream *
webkit_uri_scheme_request_get_http_body (WebKitURISchemeRequest *request);

WEBKIT_API void
webkit_uri_scheme_request_finish       (WebKitURISchemeRequest *request,
                                        GInputStream           *stream,
                                        gint64                  stream_length,
                                        const gchar            *content_type);

WEBKIT_API void
webkit_uri_scheme_request_finish_with_response (WebKitURISchemeRequest  *request,
                                                WebKitURISchemeResponse *response);

WEBKIT_API void
webkit_uri_scheme_request_finish_error (WebKitURISchemeRequest *request,
                                        GError                 *error);

G_END_DECLS

#endif
