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

#ifndef WebKitFileChooserRequest_h
#define WebKitFileChooserRequest_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>


G_BEGIN_DECLS

#define WEBKIT_TYPE_FILE_CHOOSER_REQUEST            (webkit_file_chooser_request_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitFileChooserRequest, webkit_file_chooser_request, WEBKIT, FILE_CHOOSER_REQUEST, GObject)

WEBKIT_API const gchar * const *
webkit_file_chooser_request_get_mime_types        (WebKitFileChooserRequest *request);


WEBKIT_API gboolean
webkit_file_chooser_request_get_select_multiple   (WebKitFileChooserRequest *request);

WEBKIT_API void
webkit_file_chooser_request_select_files          (WebKitFileChooserRequest *request,
                                                   const gchar * const      *files);

WEBKIT_API const gchar * const *
webkit_file_chooser_request_get_selected_files    (WebKitFileChooserRequest *request);

WEBKIT_API void
webkit_file_chooser_request_cancel                (WebKitFileChooserRequest *request);

G_END_DECLS

#endif
