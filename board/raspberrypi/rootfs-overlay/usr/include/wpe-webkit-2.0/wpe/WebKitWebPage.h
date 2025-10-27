/*
 * Copyright (C) 2012 Igalia S.L.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
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

#if !defined(__WEBKIT_WEB_PROCESS_EXTENSION_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit-web-process-extension.h> can be included directly."
#endif

#ifndef WebKitWebPage_h
#define WebKitWebPage_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitFrame.h>
#include <wpe/WebKitUserMessage.h>
#include <wpe/WebKitWebEditor.h>
#include <wpe/WebKitWebFormManager.h>


G_BEGIN_DECLS

#define WEBKIT_TYPE_WEB_PAGE            (webkit_web_page_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitWebPage, webkit_web_page, WEBKIT, WEB_PAGE, GObject)

/* Forward declarations */
typedef struct _WebKitWebEditor      WebKitWebEditor;



WEBKIT_API guint64
webkit_web_page_get_id                      (WebKitWebPage *web_page);

WEBKIT_API const gchar *
webkit_web_page_get_uri                     (WebKitWebPage *web_page);

WEBKIT_DEPRECATED WebKitFrame *
webkit_web_page_get_main_frame              (WebKitWebPage *web_page);

WEBKIT_API WebKitWebEditor *
webkit_web_page_get_editor                  (WebKitWebPage *web_page);

WEBKIT_API WebKitWebFormManager *
webkit_web_page_get_form_manager            (WebKitWebPage     *web_page,
                                             WebKitScriptWorld *world);

WEBKIT_API void
webkit_web_page_send_message_to_view        (WebKitWebPage      *web_page,
                                             WebKitUserMessage  *message,
                                             GCancellable       *cancellable,
                                             GAsyncReadyCallback callback,
                                             gpointer            user_data);

WEBKIT_API WebKitUserMessage *
webkit_web_page_send_message_to_view_finish (WebKitWebPage      *web_page,
                                             GAsyncResult       *result,
                                             GError            **error);

G_END_DECLS

#endif
