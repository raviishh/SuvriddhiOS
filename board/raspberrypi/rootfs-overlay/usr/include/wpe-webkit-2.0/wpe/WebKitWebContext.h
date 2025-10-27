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

#ifndef WebKitWebContext_h
#define WebKitWebContext_h

#include <glib-object.h>
#include <wpe/WebKitAutomationSession.h>
#include <wpe/WebKitCookieManager.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitDownload.h>
#include <wpe/WebKitGeolocationManager.h>
#include <wpe/WebKitNetworkProxySettings.h>
#include <wpe/WebKitNetworkSession.h>
#include <wpe/WebKitSecurityManager.h>
#include <wpe/WebKitURISchemeRequest.h>
#include <wpe/WebKitUserMessage.h>
#include <wpe/WebKitWebsiteDataManager.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_WEB_CONTEXT            (webkit_web_context_get_type())
WEBKIT_DECLARE_FINAL_TYPE (WebKitWebContext, webkit_web_context, WEBKIT, WEB_CONTEXT, GObject)

/**
 * WebKitCacheModel:
 * @WEBKIT_CACHE_MODEL_DOCUMENT_VIEWER: Disable the cache completely, which
 *   substantially reduces memory usage. Useful for applications that only
 *   access a single local file, with no navigation to other pages. No remote
 *   resources will be cached.
 * @WEBKIT_CACHE_MODEL_DOCUMENT_BROWSER: A cache model optimized for viewing
 *   a series of local files -- for example, a documentation viewer or a website
 *   designer. WebKit will cache a moderate number of resources.
 * @WEBKIT_CACHE_MODEL_WEB_BROWSER: Improve document load speed substantially
 *   by caching a very large number of resources and previously viewed content.
 *
 * Enum values used for determining the #WebKitWebContext cache model.
 */
typedef enum {
    WEBKIT_CACHE_MODEL_DOCUMENT_VIEWER,
    WEBKIT_CACHE_MODEL_WEB_BROWSER,
    WEBKIT_CACHE_MODEL_DOCUMENT_BROWSER
} WebKitCacheModel;


/**
 * WebKitURISchemeRequestCallback:
 * @request: the #WebKitURISchemeRequest
 * @user_data: user data passed to the callback
 *
 * Type definition for a function that will be called back when an URI request is
 * made for a user registered URI scheme.
 */
typedef void (* WebKitURISchemeRequestCallback) (WebKitURISchemeRequest *request,
                                                 gpointer                user_data);

WEBKIT_API WebKitWebContext *
webkit_web_context_get_default                      (void);

WEBKIT_API WebKitWebContext *
webkit_web_context_new                              (void);


WEBKIT_API gboolean
webkit_web_context_is_automation_allowed            (WebKitWebContext              *context);

WEBKIT_API void
webkit_web_context_set_automation_allowed           (WebKitWebContext              *context,
                                                     gboolean                       allowed);

WEBKIT_API WebKitNetworkSession *
webkit_web_context_get_network_session_for_automation(WebKitWebContext             *context);

WEBKIT_API void
webkit_web_context_set_cache_model                  (WebKitWebContext              *context,
                                                     WebKitCacheModel               cache_model);
WEBKIT_API WebKitCacheModel
webkit_web_context_get_cache_model                  (WebKitWebContext              *context);



WEBKIT_API WebKitGeolocationManager *
webkit_web_context_get_geolocation_manager          (WebKitWebContext              *context);


WEBKIT_API WebKitSecurityManager *
webkit_web_context_get_security_manager             (WebKitWebContext              *context);


WEBKIT_API void
webkit_web_context_register_uri_scheme              (WebKitWebContext              *context,
                                                     const gchar                   *scheme,
                                                     WebKitURISchemeRequestCallback callback,
                                                     gpointer                       user_data,
                                                     GDestroyNotify                 user_data_destroy_func);


WEBKIT_API void
webkit_web_context_add_path_to_sandbox              (WebKitWebContext              *context,
                                                     const char                    *path,
                                                     gboolean                       read_only);

WEBKIT_API gboolean
webkit_web_context_get_spell_checking_enabled       (WebKitWebContext              *context);

WEBKIT_API void
webkit_web_context_set_spell_checking_enabled       (WebKitWebContext              *context,
                                                     gboolean                       enabled);
WEBKIT_API const gchar * const *
webkit_web_context_get_spell_checking_languages     (WebKitWebContext              *context);

WEBKIT_API void
webkit_web_context_set_spell_checking_languages     (WebKitWebContext              *context,
                                                     const gchar * const           *languages);

WEBKIT_API void
webkit_web_context_set_preferred_languages          (WebKitWebContext              *context,
                                                     const gchar * const           *languages);


/**
 * webkit_web_context_set_web_process_extensions_directory:
 * @context: a #WebKitWebContext
 * @directory: the directory to add
 *
 * Set the directory where WebKit will look for web process extensions.
 *
 * This method must be called before loading anything in this context,
 * otherwise it will not have any effect. You can connect to
 * #WebKitWebContext::initialize-web-process-extensions to call this method
 * before anything is loaded.
 *
 * If your web process extension is installed to an unusual location,
 * then you may also need to call webkit_web_context_add_path_to_sandbox().
 */
WEBKIT_API void
webkit_web_context_set_web_process_extensions_directory (WebKitWebContext              *context,
                                                         const gchar                   *directory);

/**
 * webkit_web_context_set_web_process_extensions_initialization_user_data:
 * @context: a #WebKitWebContext
 * @user_data: a #GVariant
 *
 * Set user data to be passed to Web Extensions on initialization.
 *
 * The data will be passed to the
 * #WebKitWebProcessExtensionInitializeWithUserDataFunction.
 * This method must be called before loading anything in this context,
 * otherwise it will not have any effect. You can connect to
 * #WebKitWebContext::initialize-web-process-extensions to call this method
 * before anything is loaded.
 *
 * Since: 2.4
 */
WEBKIT_API void
webkit_web_context_set_web_process_extensions_initialization_user_data
                                                    (WebKitWebContext              *context,
                                                     GVariant                      *user_data);

/**
 * WebKitWebContext::initialize-web-process-extensions:
 * @context: the #WebKitWebContext
 *
 * This signal is emitted when a new web process is about to be
 * launched. It signals the most appropriate moment to use
 * webkit_web_context_set_web_process_extensions_initialization_user_data()
 * and webkit_web_context_set_web_process_extensions_directory().
 *
 * Since: 2.4
 */


WEBKIT_API void
webkit_web_context_initialize_notification_permissions
                                                    (WebKitWebContext              *context,
                                                     GList                         *allowed_origins,
                                                     GList                         *disallowed_origins);

WEBKIT_API void
webkit_web_context_send_message_to_all_extensions   (WebKitWebContext              *context,
                                                     WebKitUserMessage             *message);


WEBKIT_API const gchar*
webkit_web_context_get_time_zone_override           (WebKitWebContext              *context);

G_END_DECLS

#endif
