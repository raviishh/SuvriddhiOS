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

#ifndef WebKitAutocleanups_h
#define WebKitAutocleanups_h

#ifdef G_DEFINE_AUTOPTR_CLEANUP_FUNC
#ifndef __GI_SCANNER__


G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitApplicationInfo, webkit_application_info_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitCredential, webkit_credential_free)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitITPFirstParty, webkit_itp_first_party_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitITPThirdParty, webkit_itp_third_party_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitMemoryPressureSettings, webkit_memory_pressure_settings_free)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitNavigationAction, webkit_navigation_action_free)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitNetworkProxySettings, webkit_network_proxy_settings_free)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitSecurityOrigin, webkit_security_origin_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitUserScript, webkit_user_script_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitUserStyleSheet, webkit_user_style_sheet_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitUserContentFilter, webkit_user_content_filter_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitWebsiteData, webkit_website_data_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitWebViewSessionState, webkit_web_view_session_state_unref)
G_DEFINE_AUTOPTR_CLEANUP_FUNC (WebKitPermissionStateQuery, webkit_permission_state_query_unref)

#endif /* __GI_SCANNER__ */
#endif /* G_DEFINE_AUTOPTR_CLEANUP_FUNC */

#endif /* WebKitAutocleanups_h */
