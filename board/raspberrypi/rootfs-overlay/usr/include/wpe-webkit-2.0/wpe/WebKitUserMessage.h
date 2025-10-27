/*
 * Copyright (C) 2019 Igalia S.L.
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

#if !defined(__WEBKIT_H_INSIDE__) && !defined(__WEBKIT_WEB_PROCESS_EXTENSION_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit.h> can be included directly."
#endif

#ifndef WebKitUserMessage_h
#define WebKitUserMessage_h

#include <gio/gio.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_USER_MESSAGE            (webkit_user_message_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitUserMessage, webkit_user_message, WEBKIT, USER_MESSAGE, GInitiallyUnowned)

#define WEBKIT_USER_MESSAGE_ERROR webkit_user_message_error_quark ()

/**
 * WebKitUserMessageError:
 * @WEBKIT_USER_MESSAGE_UNHANDLED_MESSAGE: The message was not handled by the receiver.
 *
 * Enum values used to denote errors happening when sending user messages.
 *
 * Since: 2.28
 */
typedef enum {
    WEBKIT_USER_MESSAGE_UNHANDLED_MESSAGE
} WebKitUserMessageError;

WEBKIT_API GQuark
webkit_user_message_error_quark      (void);

WEBKIT_API WebKitUserMessage *
webkit_user_message_new              (const char        *name,
                                      GVariant          *parameters);

WEBKIT_API WebKitUserMessage *
webkit_user_message_new_with_fd_list (const char        *name,
                                      GVariant          *parameters,
                                      GUnixFDList       *fd_list);

WEBKIT_API const char *
webkit_user_message_get_name         (WebKitUserMessage *message);

WEBKIT_API GVariant *
webkit_user_message_get_parameters   (WebKitUserMessage *message);

WEBKIT_API GUnixFDList *
webkit_user_message_get_fd_list      (WebKitUserMessage *message);

WEBKIT_API void
webkit_user_message_send_reply       (WebKitUserMessage *message,
                                      WebKitUserMessage *reply);

G_END_DECLS

#endif
