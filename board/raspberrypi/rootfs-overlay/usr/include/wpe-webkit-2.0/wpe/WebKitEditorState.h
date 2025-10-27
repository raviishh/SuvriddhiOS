/*
 * Copyright (C) 2015 Igalia S.L.
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

#ifndef WebKitEditorState_h
#define WebKitEditorState_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_EDITOR_STATE            (webkit_editor_state_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitEditorState, webkit_editor_state, WEBKIT, EDITOR_STATE, GObject)

/**
 * WebKitEditorTypingAttributes:
 * @WEBKIT_EDITOR_TYPING_ATTRIBUTE_NONE: No typing attributes.
 * @WEBKIT_EDITOR_TYPING_ATTRIBUTE_BOLD: Bold typing attribute.
 * @WEBKIT_EDITOR_TYPING_ATTRIBUTE_ITALIC: Italic typing attribute.
 * @WEBKIT_EDITOR_TYPING_ATTRIBUTE_UNDERLINE: Underline typing attribute.
 * @WEBKIT_EDITOR_TYPING_ATTRIBUTE_STRIKETHROUGH: Strikethrough typing attribute.
 *
 * Enum values with flags representing typing attributes.
 *
 * Since: 2.10
 */
typedef enum
{
    WEBKIT_EDITOR_TYPING_ATTRIBUTE_NONE           = 1 << 1,
    WEBKIT_EDITOR_TYPING_ATTRIBUTE_BOLD           = 1 << 2,
    WEBKIT_EDITOR_TYPING_ATTRIBUTE_ITALIC         = 1 << 3,
    WEBKIT_EDITOR_TYPING_ATTRIBUTE_UNDERLINE      = 1 << 4,
    WEBKIT_EDITOR_TYPING_ATTRIBUTE_STRIKETHROUGH  = 1 << 5
} WebKitEditorTypingAttributes;

WEBKIT_API guint
webkit_editor_state_get_typing_attributes (WebKitEditorState *editor_state);

WEBKIT_API gboolean
webkit_editor_state_is_cut_available      (WebKitEditorState *editor_state);

WEBKIT_API gboolean
webkit_editor_state_is_copy_available     (WebKitEditorState *editor_state);

WEBKIT_API gboolean
webkit_editor_state_is_paste_available    (WebKitEditorState *editor_state);

WEBKIT_API gboolean
webkit_editor_state_is_undo_available     (WebKitEditorState *editor_state);

WEBKIT_API gboolean
webkit_editor_state_is_redo_available     (WebKitEditorState *editor_state);

G_END_DECLS

#endif
