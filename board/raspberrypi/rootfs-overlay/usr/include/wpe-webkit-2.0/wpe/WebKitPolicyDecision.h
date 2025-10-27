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

#ifndef WebKitPolicyDecision_h
#define WebKitPolicyDecision_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitWebsitePolicies.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_POLICY_DECISION            (webkit_policy_decision_get_type())

WEBKIT_DECLARE_DERIVABLE_TYPE (WebKitPolicyDecision, webkit_policy_decision, WEBKIT, POLICY_DECISION, GObject)

struct _WebKitPolicyDecisionClass {
    GObjectClass parent_class;

    /*< private >*/
    void (*_webkit_reserved0) (void);
    void (*_webkit_reserved1) (void);
    void (*_webkit_reserved2) (void);
    void (*_webkit_reserved3) (void);
    void (*_webkit_reserved4) (void);
    void (*_webkit_reserved5) (void);
    void (*_webkit_reserved6) (void);
    void (*_webkit_reserved7) (void);
};

WEBKIT_API void
webkit_policy_decision_use      (WebKitPolicyDecision *decision);

WEBKIT_API void
webkit_policy_decision_use_with_policies  (WebKitPolicyDecision *decision,
                                           WebKitWebsitePolicies *policies);

WEBKIT_API void
webkit_policy_decision_ignore   (WebKitPolicyDecision *decision);

WEBKIT_API void
webkit_policy_decision_download (WebKitPolicyDecision *decision);

G_END_DECLS

#endif
