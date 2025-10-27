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

#ifndef WebKitResponsePolicyDecision_h
#define WebKitResponsePolicyDecision_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitPolicyDecision.h>
#include <wpe/WebKitURIResponse.h>
#include <wpe/WebKitURIRequest.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_RESPONSE_POLICY_DECISION            (webkit_response_policy_decision_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitResponsePolicyDecision, webkit_response_policy_decision, WEBKIT, RESPONSE_POLICY_DECISION, WebKitPolicyDecision)

WEBKIT_API WebKitURIRequest *
webkit_response_policy_decision_get_request                 (WebKitResponsePolicyDecision *decision);

WEBKIT_API WebKitURIResponse *
webkit_response_policy_decision_get_response                (WebKitResponsePolicyDecision *decision);

WEBKIT_API gboolean
webkit_response_policy_decision_is_mime_type_supported      (WebKitResponsePolicyDecision *decision);

WEBKIT_API gboolean
webkit_response_policy_decision_is_main_frame_main_resource (WebKitResponsePolicyDecision* decision);

G_END_DECLS

#endif
