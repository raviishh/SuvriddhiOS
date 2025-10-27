/*
 * Copyright (C) 2013 Igalia S.L.
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

#ifndef WebKitScriptWorld_h
#define WebKitScriptWorld_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_SCRIPT_WORLD            (webkit_script_world_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitScriptWorld, webkit_script_world, WEBKIT, SCRIPT_WORLD, GObject )

WEBKIT_API WebKitScriptWorld *
webkit_script_world_get_default   (void);

WEBKIT_API WebKitScriptWorld *
webkit_script_world_new           (void);

WEBKIT_API WebKitScriptWorld *
webkit_script_world_new_with_name (const char        *name);

WEBKIT_API const char *
webkit_script_world_get_name      (WebKitScriptWorld *world);

G_END_DECLS

#endif
