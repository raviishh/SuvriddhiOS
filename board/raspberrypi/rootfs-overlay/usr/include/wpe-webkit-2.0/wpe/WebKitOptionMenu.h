/*
 * Copyright (C) 2017, 2020 Igalia S.L.
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

#ifndef WebKitOptionMenu_h
#define WebKitOptionMenu_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitOptionMenuItem.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_OPTION_MENU            (webkit_option_menu_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitOptionMenu, webkit_option_menu, WEBKIT, OPTION_MENU, GObject)

WEBKIT_API guint
webkit_option_menu_get_n_items    (WebKitOptionMenu *menu);

WEBKIT_API WebKitOptionMenuItem *
webkit_option_menu_get_item       (WebKitOptionMenu *menu,
                                   guint             index);

WEBKIT_API void
webkit_option_menu_select_item    (WebKitOptionMenu *menu,
                                   guint             index);

WEBKIT_API void
webkit_option_menu_activate_item  (WebKitOptionMenu *menu,
                                   guint             index);

WEBKIT_API void
webkit_option_menu_close          (WebKitOptionMenu *menu);


G_END_DECLS

#endif
