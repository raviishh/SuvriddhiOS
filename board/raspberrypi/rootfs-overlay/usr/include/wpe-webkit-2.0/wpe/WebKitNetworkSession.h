/*
 * Copyright (C) 2023 Igalia S.L.
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

#if !defined(__WEBKIT_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit.h> can be included directly."
#endif

#ifndef WebKitNetworkSession_h
#define WebKitNetworkSession_h

#include <gio/gio.h>
#include <wpe/WebKitCookieManager.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitDownload.h>
#include <wpe/WebKitMemoryPressureSettings.h>
#include <wpe/WebKitNetworkProxySettings.h>
#include <wpe/WebKitWebsiteDataManager.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_NETWORK_SESSION            (webkit_network_session_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitNetworkSession, webkit_network_session, WEBKIT, NETWORK_SESSION, GObject)

WEBKIT_API WebKitNetworkSession *
webkit_network_session_get_default                               (void);

WEBKIT_API WebKitNetworkSession *
webkit_network_session_new                                       (const char                   *data_directory,
                                                                  const char                   *cache_directory);
WEBKIT_API WebKitNetworkSession *
webkit_network_session_new_ephemeral                             (void);

WEBKIT_API gboolean
webkit_network_session_is_ephemeral                              (WebKitNetworkSession         *session);

WEBKIT_API WebKitWebsiteDataManager *
webkit_network_session_get_website_data_manager                  (WebKitNetworkSession         *session);

WEBKIT_API WebKitCookieManager *
webkit_network_session_get_cookie_manager                        (WebKitNetworkSession         *session);

WEBKIT_API void
webkit_network_session_set_itp_enabled                           (WebKitNetworkSession         *session,
                                                                  gboolean                      enabled);

WEBKIT_API gboolean
webkit_network_session_get_itp_enabled                           (WebKitNetworkSession         *session);

WEBKIT_API void
webkit_network_session_set_persistent_credential_storage_enabled (WebKitNetworkSession         *session,
                                                                  gboolean                      enabled);

WEBKIT_API gboolean
webkit_network_session_get_persistent_credential_storage_enabled (WebKitNetworkSession         *session);

WEBKIT_API void
webkit_network_session_set_tls_errors_policy                     (WebKitNetworkSession         *session,
                                                                  WebKitTLSErrorsPolicy         policy);

WEBKIT_API WebKitTLSErrorsPolicy
webkit_network_session_get_tls_errors_policy                     (WebKitNetworkSession         *session);

WEBKIT_API void
webkit_network_session_allow_tls_certificate_for_host            (WebKitNetworkSession         *session,
                                                                  GTlsCertificate              *certificate,
                                                                  const char                   *host);

WEBKIT_API void
webkit_network_session_set_proxy_settings                        (WebKitNetworkSession         *session,
                                                                  WebKitNetworkProxyMode        proxy_mode,
                                                                  WebKitNetworkProxySettings   *proxy_settings);

WEBKIT_API void
webkit_network_session_set_memory_pressure_settings              (WebKitMemoryPressureSettings *settings);

WEBKIT_API void
webkit_network_session_get_itp_summary                           (WebKitNetworkSession         *session,
                                                                  GCancellable                 *cancellable,
                                                                  GAsyncReadyCallback           callback,
                                                                  gpointer                      user_data);
WEBKIT_API GList *
webkit_network_session_get_itp_summary_finish                    (WebKitNetworkSession         *session,
                                                                  GAsyncResult                 *result,
                                                                  GError                      **error);
WEBKIT_API void
webkit_network_session_prefetch_dns                              (WebKitNetworkSession         *session,
                                                                  const char                   *hostname);

WEBKIT_API WebKitDownload *
webkit_network_session_download_uri                              (WebKitNetworkSession         *session,
                                                                  const char                   *uri);

G_END_DECLS

#endif
