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

#if !defined(__WEBKIT_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit.h> can be included directly."
#endif

#ifndef WebKitWindowProperties_h
#define WebKitWindowProperties_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>


G_BEGIN_DECLS

#define WEBKIT_TYPE_WINDOW_PROPERTIES            (webkit_window_properties_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitWindowProperties, webkit_window_properties, WEBKIT, WINDOW_PROPERTIES, GObject)


WEBKIT_API gboolean
webkit_window_properties_get_toolbar_visible     (WebKitWindowProperties *window_properties);

WEBKIT_API gboolean
webkit_window_properties_get_statusbar_visible   (WebKitWindowProperties *window_properties);

WEBKIT_API gboolean
webkit_window_properties_get_scrollbars_visible  (WebKitWindowProperties *window_properties);

WEBKIT_API gboolean
webkit_window_properties_get_menubar_visible     (WebKitWindowProperties *window_properties);

WEBKIT_API gboolean
webkit_window_properties_get_locationbar_visible (WebKitWindowProperties *window_properties);

WEBKIT_API gboolean
webkit_window_properties_get_resizable           (WebKitWindowProperties *window_properties);

WEBKIT_API gboolean
webkit_window_properties_get_fullscreen          (WebKitWindowProperties *window_properties);

G_END_DECLS

#endif
