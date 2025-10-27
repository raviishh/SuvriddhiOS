/*
 * Copyright (C) 2021 Zixing Liu
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

#ifndef WebKitURISchemeResponse_h
#define WebKitURISchemeResponse_h

#include <glib-object.h>
#include <libsoup/soup.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_URI_SCHEME_RESPONSE            (webkit_uri_scheme_response_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitURISchemeResponse, webkit_uri_scheme_response, WEBKIT, URI_SCHEME_RESPONSE, GObject)

WEBKIT_API WebKitURISchemeResponse *
webkit_uri_scheme_response_new                (GInputStream            *input_stream,
                                               gint64                   stream_length);

WEBKIT_API void
webkit_uri_scheme_response_set_status         (WebKitURISchemeResponse *response,
                                               guint                    status_code,
                                               const gchar             *reason_phrase);

WEBKIT_API void
webkit_uri_scheme_response_set_content_type   (WebKitURISchemeResponse *response,
                                               const gchar             *content_type);

WEBKIT_API void
webkit_uri_scheme_response_set_http_headers   (WebKitURISchemeResponse *response,
                                               SoupMessageHeaders      *headers);

G_END_DECLS

#endif
