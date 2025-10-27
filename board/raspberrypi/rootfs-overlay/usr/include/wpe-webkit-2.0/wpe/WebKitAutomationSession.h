/*
 * Copyright (C) 2017 Igalia S.L.
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

#ifndef WebKitAutomationSession_h
#define WebKitAutomationSession_h

#include <glib-object.h>
#include <wpe/WebKitApplicationInfo.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_AUTOMATION_SESSION            (webkit_automation_session_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitAutomationSession, webkit_automation_session, WEBKIT, AUTOMATION_SESSION, GObject)

/**
 * WebKitAutomationBrowsingContextPresentation:
 * @WEBKIT_AUTOMATION_BROWSING_CONTEXT_PRESENTATION_WINDOW: a window
 * @WEBKIT_AUTOMATION_BROWSING_CONTEXT_PRESENTATION_TAB: a tab
 *
 * Enum values used for determining the automation browsing context presentation.
 *
 * Since: 2.28
 */
typedef enum {
    WEBKIT_AUTOMATION_BROWSING_CONTEXT_PRESENTATION_WINDOW,
    WEBKIT_AUTOMATION_BROWSING_CONTEXT_PRESENTATION_TAB
} WebKitAutomationBrowsingContextPresentation;

WEBKIT_API const char *
webkit_automation_session_get_id               (WebKitAutomationSession *session);

WEBKIT_API void
webkit_automation_session_set_application_info (WebKitAutomationSession *session,
                                                WebKitApplicationInfo   *info);

WEBKIT_API WebKitApplicationInfo *
webkit_automation_session_get_application_info (WebKitAutomationSession *session);

G_END_DECLS

#endif /* WebKitAutomationSession_h */
