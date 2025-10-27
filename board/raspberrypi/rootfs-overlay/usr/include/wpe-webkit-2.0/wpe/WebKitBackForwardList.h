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

#ifndef WebKitBackForwardList_h
#define WebKitBackForwardList_h

#include <glib-object.h>
#include <wpe/WebKitBackForwardListItem.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_BACK_FORWARD_LIST            (webkit_back_forward_list_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitBackForwardList, webkit_back_forward_list, WEBKIT, BACK_FORWARD_LIST, GObject)

WEBKIT_API WebKitBackForwardListItem *
webkit_back_forward_list_get_current_item            (WebKitBackForwardList *back_forward_list);

WEBKIT_API WebKitBackForwardListItem *
webkit_back_forward_list_get_back_item               (WebKitBackForwardList *back_forward_list);

WEBKIT_API WebKitBackForwardListItem *
webkit_back_forward_list_get_forward_item            (WebKitBackForwardList *back_forward_list);

WEBKIT_API WebKitBackForwardListItem *
webkit_back_forward_list_get_nth_item                (WebKitBackForwardList *back_forward_list,
                                                      gint                   index);
WEBKIT_API guint
webkit_back_forward_list_get_length                  (WebKitBackForwardList *back_forward_list);

WEBKIT_API GList *
webkit_back_forward_list_get_back_list               (WebKitBackForwardList *back_forward_list);

WEBKIT_API GList *
webkit_back_forward_list_get_back_list_with_limit    (WebKitBackForwardList *back_forward_list,
                                                      guint                  limit);

WEBKIT_API GList *
webkit_back_forward_list_get_forward_list            (WebKitBackForwardList *back_forward_list);

WEBKIT_API GList *
webkit_back_forward_list_get_forward_list_with_limit (WebKitBackForwardList *back_forward_list,
                                                      guint                  limit);

G_END_DECLS

#endif
