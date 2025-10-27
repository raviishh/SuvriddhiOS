/*
 * Copyright (C) 2015 Igalia S.L.
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

#ifndef WebKitWebsiteDataManager_h
#define WebKitWebsiteDataManager_h

#include <gio/gio.h>
#include <wpe/WebKitCookieManager.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitMemoryPressureSettings.h>
#include <wpe/WebKitNetworkProxySettings.h>
#include <wpe/WebKitWebsiteData.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_WEBSITE_DATA_MANAGER            (webkit_website_data_manager_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitWebsiteDataManager, webkit_website_data_manager, WEBKIT, WEBSITE_DATA_MANAGER, GObject)

/**
 * WebKitTLSErrorsPolicy:
 * @WEBKIT_TLS_ERRORS_POLICY_IGNORE: Ignore TLS errors.
 * @WEBKIT_TLS_ERRORS_POLICY_FAIL: TLS errors will emit
 *   #WebKitWebView::load-failed-with-tls-errors and, if the signal is handled,
 *   finish the load. In case the signal is not handled,
 *   #WebKitWebView::load-failed is emitted before the load finishes.
 *
 * Enum values used to denote the TLS errors policy.
 */
typedef enum {
    WEBKIT_TLS_ERRORS_POLICY_IGNORE,
    WEBKIT_TLS_ERRORS_POLICY_FAIL
} WebKitTLSErrorsPolicy;


WEBKIT_API gboolean
webkit_website_data_manager_is_ephemeral                              (WebKitWebsiteDataManager* manager);

WEBKIT_API const gchar *
webkit_website_data_manager_get_base_data_directory                   (WebKitWebsiteDataManager *manager);

WEBKIT_API const gchar *
webkit_website_data_manager_get_base_cache_directory                  (WebKitWebsiteDataManager *manager);



WEBKIT_API void
webkit_website_data_manager_fetch                                     (WebKitWebsiteDataManager *manager,
                                                                       WebKitWebsiteDataTypes    types,
                                                                       GCancellable             *cancellable,
                                                                       GAsyncReadyCallback       callback,
                                                                       gpointer                  user_data);

WEBKIT_API GList *
webkit_website_data_manager_fetch_finish                              (WebKitWebsiteDataManager *manager,
                                                                       GAsyncResult             *result,
                                                                       GError                  **error);
WEBKIT_API void
webkit_website_data_manager_remove                                    (WebKitWebsiteDataManager *manager,
                                                                       WebKitWebsiteDataTypes    types,
                                                                       GList                    *website_data,
                                                                       GCancellable             *cancellable,
                                                                       GAsyncReadyCallback       callback,
                                                                       gpointer                  user_data);
WEBKIT_API gboolean
webkit_website_data_manager_remove_finish                             (WebKitWebsiteDataManager *manager,
                                                                       GAsyncResult             *result,
                                                                       GError                  **error);

WEBKIT_API void
webkit_website_data_manager_clear                                      (WebKitWebsiteDataManager *manager,
                                                                        WebKitWebsiteDataTypes    types,
                                                                        GTimeSpan                 timespan,
                                                                        GCancellable             *cancellable,
                                                                        GAsyncReadyCallback       callback,
                                                                        gpointer                  user_data);

WEBKIT_API gboolean
webkit_website_data_manager_clear_finish                               (WebKitWebsiteDataManager *manager,
                                                                        GAsyncResult             *result,
                                                                        GError                  **error);



#define WEBKIT_TYPE_ITP_FIRST_PARTY   (webkit_itp_first_party_get_type())

typedef struct _WebKitITPFirstParty WebKitITPFirstParty;

WEBKIT_API GType
webkit_itp_first_party_get_type                        (void);

WEBKIT_API WebKitITPFirstParty *
webkit_itp_first_party_ref                             (WebKitITPFirstParty      *itp_first_party);

WEBKIT_API void
webkit_itp_first_party_unref                           (WebKitITPFirstParty      *itp_first_party);

WEBKIT_API const char *
webkit_itp_first_party_get_domain                      (WebKitITPFirstParty      *itp_first_party);

WEBKIT_API gboolean
webkit_itp_first_party_get_website_data_access_allowed (WebKitITPFirstParty      *itp_first_party);

WEBKIT_API GDateTime *
webkit_itp_first_party_get_last_update_time            (WebKitITPFirstParty      *itp_first_party);


#define WEBKIT_TYPE_ITP_THIRD_PARTY   (webkit_itp_third_party_get_type())

typedef struct _WebKitITPThirdParty WebKitITPThirdParty;

WEBKIT_API GType
webkit_itp_third_party_get_type                        (void);

WEBKIT_API WebKitITPThirdParty *
webkit_itp_third_party_ref                             (WebKitITPThirdParty      *itp_third_party);

WEBKIT_API void
webkit_itp_third_party_unref                           (WebKitITPThirdParty      *itp_third_party);

WEBKIT_API const char *
webkit_itp_third_party_get_domain                      (WebKitITPThirdParty      *itp_third_party);

WEBKIT_API GList *
webkit_itp_third_party_get_first_parties               (WebKitITPThirdParty      *itp_third_party);


WEBKIT_API void
webkit_website_data_manager_get_itp_summary            (WebKitWebsiteDataManager *manager,
                                                        GCancellable             *cancellable,
                                                        GAsyncReadyCallback       callback,
                                                        gpointer                  user_data);
WEBKIT_API GList *
webkit_website_data_manager_get_itp_summary_finish     (WebKitWebsiteDataManager *manager,
                                                        GAsyncResult             *result,
                                                        GError                  **error);

G_END_DECLS

#endif
