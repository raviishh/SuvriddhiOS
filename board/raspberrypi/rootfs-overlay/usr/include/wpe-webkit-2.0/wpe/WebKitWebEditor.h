/*
 * Copyright (C) 2015 Red Hat Inc.
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

#ifndef WebKitWebEditor_h
#define WebKitWebEditor_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitWebPage.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_WEB_EDITOR               (webkit_web_editor_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitWebEditor, webkit_web_editor, WEBKIT, WEB_EDITOR, GObject)

/* Forward declarations */
typedef struct _WebKitWebPage          WebKitWebPage;

WEBKIT_API WebKitWebPage *
webkit_web_editor_get_page (WebKitWebEditor *editor);

G_END_DECLS

#endif /* WebKitWebEditor_h */
